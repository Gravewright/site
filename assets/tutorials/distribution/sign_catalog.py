"""Offline catalog signer for Gravewright 0.3.0. License: MIT.

Uses cryptography already installed in the host virtual environment. It imports
no host internals, executes no archive code, generates no production key and
overwrites no output. Native installation remains the authoritative ZIP check.
"""
from __future__ import annotations
import argparse
import base64
import hashlib
import hmac
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import sys
from urllib.parse import urlsplit
import zipfile
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey


def canonical(record):
    # Exact wire representation used by packages.canonical in the target host.
    return json.dumps(
        {k: v for k, v in record.items() if k != "signature"},
        sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False,
    ).encode("ascii")


def archive_info(path):
    path = Path(path)
    if path.stat().st_size > 64 * 1024 * 1024:
        raise ValueError("Archive exceeds 64 MiB: " + str(path))
    data = path.read_bytes()
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        entries = archive.infolist()
        if len(entries) > 4096 or sum(item.file_size for item in entries) > 256 * 1024 * 1024:
            raise ValueError("Archive quota exceeded")
        seen = set()
        for item in entries:
            name = item.filename.rstrip("/") if item.is_dir() else item.filename
            parts = name.split("/")
            mode = item.external_attr >> 16
            if (not name or PurePosixPath(name).is_absolute()
                    or any(part in ("", ".", "..") for part in parts)
                    or any(char in name for char in ("\\", "\x00", ":", "%", "?", "#"))
                    or stat.S_ISLNK(mode) or stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR)
                    or item.flag_bits & 1 or name.casefold() in seen):
                raise ValueError("Unsupported archive path or entry: " + name)
            seen.add(name.casefold())
        info = archive.getinfo("manifest.json")
        if info.file_size > 1024 * 1024:
            raise ValueError("Manifest exceeds 1 MiB")
        manifest = json.loads(archive.read(info))
        if not isinstance(manifest, dict) or not isinstance(manifest.get("sdk"), dict):
            raise ValueError("Manifest and sdk must be objects")
        bad_crc = archive.testzip()
        if bad_crc:
            raise ValueError("Archive CRC failure: " + bad_crc)
        if "entry" in manifest and manifest["entry"] not in archive.namelist():
            raise ValueError("Manifest entry is missing from the ZIP")
    if not re.fullmatch(r"[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+", manifest.get("id", "")):
        raise ValueError("Invalid manifest ID")
    if not re.fullmatch(r"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)", manifest.get("version", "")):
        raise ValueError("Invalid manifest version")
    if not isinstance(manifest.get("sdk", {}).get("requires"), str):
        raise ValueError("Missing sdk.requires")
    if "system" in manifest and "locales" in manifest:
        raise ValueError("A system cannot also declare locales")
    if "django" in manifest and any(key in manifest for key in ("entry", "system", "locales")):
        raise ValueError("A Django package cannot also declare entry, system or locales")
    kind = "django" if "django" in manifest else "system" if "system" in manifest else "module"
    return data, manifest, kind


def valid_download(value):
    parsed = urlsplit(value)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or parsed.fragment:
        raise ValueError("Use an HTTPS download URL without credentials or a fragment")
    parsed.port


def record_shape(record):
    required = {"id", "version", "sdk", "download", "sha256", "keyId", "signature"}
    allowed = required | {"status", "name", "description", "type", "tags"}
    if not isinstance(record, dict) or not required <= set(record) or not set(record) <= allowed:
        raise ValueError("Invalid catalog record fields")
    if any(not isinstance(value, str) or not value.isascii() for key, value in record.items() if key != "tags"):
        raise ValueError("Record scalar fields must be ASCII strings")
    tags = record.get("tags", [])
    if (not isinstance(tags, list) or len(tags) > 24
            or any(not isinstance(tag, str) or not tag.strip() or tag != tag.strip()
                   or len(tag) > 64 or any(ord(char) < 32 for char in tag) for tag in tags)
            or len({tag.casefold() for tag in tags}) != len(tags)):
        raise ValueError("Invalid tags")
    if record.get("type", "module") not in ("module", "system", "django"):
        raise ValueError("Invalid package type")
    if record.get("status", "active") not in ("active", "revoked"):
        raise ValueError("Invalid release status")
    if not re.fullmatch(r"[a-f0-9]{64}", record["sha256"]):
        raise ValueError("Invalid SHA-256")
    valid_download(record["download"])


def sign(args):
    data, manifest, kind = archive_info(args.archive)
    record = {"id":manifest["id"], "version":manifest["version"],
              "sdk":manifest["sdk"]["requires"], "type":kind,
              "download":args.download, "sha256":hashlib.sha256(data).hexdigest(),
              "keyId":args.key_id, "status":args.status, "signature":""}
    if args.tag:
        record["tags"] = args.tag
    record_shape(record)
    password = None
    if args.password_env:
        if args.password_env not in os.environ:
            raise ValueError("The requested password environment variable is not set")
        password = os.environ[args.password_env].encode("utf-8")
    private = serialization.load_pem_private_key(Path(args.private_key).read_bytes(), password=password)
    if not isinstance(private, Ed25519PrivateKey):
        raise ValueError("The private PEM must contain an Ed25519 key")
    record["signature"] = base64.b64encode(private.sign(canonical(record))).decode("ascii")
    # Exclusive creation protects an existing reviewed record from replacement.
    with Path(args.output).open("x", encoding="utf-8", newline="\n") as stream:
        json.dump(record, stream, ensure_ascii=True, indent=2)
        stream.write("\n")
    print("Signed " + record["id"] + "@" + record["version"] + " -> " + args.output)


def verify(args):
    record = json.loads(Path(args.record).read_text(encoding="utf-8"))
    record_shape(record)
    data, manifest, kind = archive_info(args.archive)
    if (record["id"] != manifest["id"] or record["version"] != manifest["version"]
            or record["sdk"] != manifest["sdk"]["requires"] or record.get("type", "module") != kind
            or not hmac.compare_digest(record["sha256"], hashlib.sha256(data).hexdigest())):
        raise ValueError("The final ZIP does not match the signed identity, SDK, type or digest")
    keys = json.loads(Path(args.keys).read_text(encoding="utf-8"))
    raw = base64.b64decode(keys[record["keyId"]], validate=True)
    Ed25519PublicKey.from_public_bytes(raw).verify(base64.b64decode(record["signature"], validate=True), canonical(record))
    print("Verified " + record["id"] + "@" + record["version"] + " (" + record.get("status", "active") + ")")


def self_test(_args):
    # Public, deterministic test material. Never use these bytes as a publisher key.
    private = Ed25519PrivateKey.from_private_bytes(bytes(range(32)))
    record = {"id":"example.synthetic", "version":"1.0.0", "sdk":">=1.0.0 <2.0.0",
              "type":"module", "download":"https://publisher.example/synthetic.zip",
              "sha256":"0" * 64, "keyId":"synthetic-test", "status":"active"}
    record["signature"] = base64.b64encode(private.sign(canonical(record))).decode("ascii")
    record_shape(record)
    signature = base64.b64decode(record["signature"])
    private.public_key().verify(signature, canonical(record))
    record["status"] = "revoked"
    try:
        private.public_key().verify(signature, canonical(record))
    except InvalidSignature:
        pass
    else:
        raise AssertionError("Changing signed status must invalidate the signature")
    assert canonical({"z":"a", "signature":"ignored", "a":"b"}) == b'{"a":"b","z":"a"}'
    print("Synthetic Ed25519 and canonicalization tests passed")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    signing = sub.add_parser("sign", help="Write one signed record, not a complete catalog")
    signing.add_argument("--archive", required=True)
    signing.add_argument("--download", required=True)
    signing.add_argument("--key-id", required=True)
    signing.add_argument("--tag", action="append", default=[], help="Optional signed catalog tag, repeat for multiple tags")
    signing.add_argument("--private-key", required=True)
    signing.add_argument("--password-env", help="Name of an optional PEM-password environment variable")
    signing.add_argument("--status", choices=("active", "revoked"), default="active")
    signing.add_argument("--output", required=True)
    signing.set_defaults(run=sign)
    verifying = sub.add_parser("verify")
    verifying.add_argument("--archive", required=True)
    verifying.add_argument("--record", required=True)
    verifying.add_argument("--keys", required=True)
    verifying.set_defaults(run=verify)
    sub.add_parser("self-test").set_defaults(run=self_test)
    args = parser.parse_args()
    try:
        args.run(args)
    except (OSError, ValueError, TypeError, KeyError, zipfile.BadZipFile, InvalidSignature) as error:
        parser.exit(2, "Error: " + (str(error) or type(error).__name__) + "\n")


if __name__ == "__main__":
    main()
