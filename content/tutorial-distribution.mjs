// Original distribution guides. This file neither creates signing keys nor publishes releases.
import {packageExamples} from './examples-packages.mjs';
const language=packageExamples.find(example=>example.id==='language');
const fence=(lang,value)=>'```'+lang+'\n'+value.trimEnd()+'\n```';

const signer=String.raw`"""Offline catalog signer for Gravewright 0.3.0. License: MIT.

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
`;

export const distributionSupportFiles=[{path:'assets/tutorials/distribution/sign_catalog.py',content:signer}];
const sources=['docs/en/modules.md','docs/pt-BR/modules.md','gravewright/modules/packages.py','gravewright/modules/localization.py','gravewright/modules/views.py','gravewright/web/static/gravewright_web/inside/management.js','gravewright/table/jinja2/gravewright_table/house.html'];

function languageGuide(locale){
  const pt=locale==='pt',s=(en,br)=>pt?br:en,base='../../assets/examples/packages/language/';
  return [
    `## ${s('What this package actually changes','O que este pacote altera')}`,
    s('Create a declarative, installation-wide language package for **Gravewright 0.3.0**. This original demonstration translates exactly six interface keys into Portuguese and Spanish. It is deliberately partial, so most host text remains English. It does not translate authored character names, chat, journals, PDFs or exact legal notices. It is not a complete release of the official Translator.','Crie um pacote declarativo de idioma para a instalação do **Gravewright 0.3.0**. A demonstração original traduz exatamente seis chaves de interface em português e espanhol. É propositalmente parcial: a maior parte do host permanece em inglês. Não traduz nomes autorais, chat, diários, PDFs nem avisos legais exatos. Não é uma release completa do Translator oficial.'),
    s('Use a disposable installation. Activating this language package selects it globally and disables the previously enabled global package; do not replace an operator’s active translation just to test six strings. Individual accounts still choose their own interface language.','Use instalação descartável. Ativar esse idioma o seleciona globalmente e desativa o pacote global anteriormente habilitado; não substitua a tradução ativa do operador para testar seis textos. Cada conta continua escolhendo seu próprio idioma de interface.'),
    `## ${s('1. Start with the complete existing sources','1. Comece pelos fontes completos existentes')}`,
    `[${s('Download language-source.zip','Baixar language-source.zip')}](${base}language-source.zip)`,
    fence('text','language/\n  manifest.json\n  main.mjs\n  locales/pt-BR.json\n  locales/es.json\n  LICENSE.txt\n  README.md'),
    s('Create a folder named language and save the exact files below as UTF-8. Preserve the existing [GPL license](../../assets/examples/packages/language/LICENSE.txt) and [README](../../assets/examples/packages/language/README.md) from the source ZIP. There are no npm dependencies or Python files in this browser package.','Crie uma pasta language e salve os arquivos abaixo em UTF-8. Preserve a [licença GPL](../../assets/examples/packages/language/LICENSE.txt) e o [README](../../assets/examples/packages/language/README.md) existentes no ZIP-fonte. Não há dependências npm nem arquivos Python neste pacote de navegador.'),
    '### manifest.json',fence('json',JSON.stringify(language.manifest,null,2)),
    ...Object.entries(language.files).flatMap(([name,content])=>['### '+name,fence(name.endsWith('.json')?'json':'javascript',content)]),
    s('locales is metadata, not a kind field. The no-op start/register/stop entry satisfies the released browser manifest contract and mounts no table surface. A manifest cannot combine system with locales, cannot override en and cannot put a Django app in this language package.','locales é metadado, não campo kind. A entrada start/register/stop sem ações atende ao contrato de navegador da release e não monta superfície da mesa. O manifesto não pode combinar system e locales, substituir en nem colocar um app Django neste pacote de idioma.'),
    `## ${s('2. Validate JSON and build the ZIP','2. Valide o JSON e monte o ZIP')}`,
    s('From the language folder, use the already managed Python in the host. In PowerShell, replace the path to python.exe with that of your disposable host. On POSIX use its .venv/bin/python. No package installation is needed.','Na pasta language, use o Python já gerenciado pelo host. No PowerShell, ajuste python.exe para o caminho do host descartável. Em POSIX use .venv/bin/python. Não é necessário instalar dependências.'),
    fence('powershell',`& 'E:/Your disposable host/.venv/Scripts/python.exe' -m json.tool manifest.json
& 'E:/Your disposable host/.venv/Scripts/python.exe' -m json.tool locales/pt-BR.json
& 'E:/Your disposable host/.venv/Scripts/python.exe' -m json.tool locales/es.json
& 'E:/Your disposable host/.venv/Scripts/python.exe' -m zipfile -c ../language-demo-1.0.0.zip manifest.json main.mjs locales LICENSE.txt README.md
& 'E:/Your disposable host/.venv/Scripts/python.exe' -m zipfile -l ../language-demo-1.0.0.zip`),
    s('The listing must place manifest.json directly at the ZIP root. json.tool checks JSON syntax; native installation also validates catalogs: nonempty objects, at most 15,000 entries, nonblank strings up to 12,000 characters and exactly preserved {placeholder} names/counts. A missing translation falls back to its original English key.','A listagem deve mostrar manifest.json diretamente na raiz. json.tool verifica sintaxe; a instalação nativa também valida catálogos: objetos não vazios, até 15.000 entradas, strings não vazias de até 12.000 caracteres e os mesmos nomes/quantidades de {placeholder}. Uma tradução ausente usa a chave original em inglês.'),
    `## ${s('3. Install and activate the global languages','3. Instale e ative os idiomas globais')}`,
    s('1. Sign in as installation owner. Open **Inside → Modules → Install module → Install from ZIP**, choose the reviewed ZIP and click **Install**. Local upload is an explicit trust decision; it does not require a signed remote catalog.\n2. In the installed **Modules** library, find **Example language demo**. Use its power icon with accessible label/tooltip **Activate languages**. In Portuguese the label is **Ativar idiomas**. The page reloads after activation.\n3. Do not look for the package under a campaign’s Extensions. Language packages are installation-wide and deliberately absent from that table list. Installing, globally activating and choosing a personal language are three different steps.','1. Entre como dono da instalação. Abra **Inside → Módulos → Instalar módulo → Instalar de ZIP**, escolha o ZIP revisado e clique em **Instalar**. O envio local é decisão explícita de confiança e não exige catálogo remoto assinado.\n2. Na biblioteca de **Módulos** instalados, encontre **Example language demo**. Use o ícone de energia com nome acessível/tooltip **Activate languages**, ou **Ativar idiomas** em português. A página recarrega após ativar.\n3. Não procure esse pacote nas Extensões da campanha. Idiomas são globais à instalação e ficam fora dessa lista. Instalar, ativar globalmente e escolher idioma pessoal são três etapas diferentes.'),
    `## ${s('4. Choose a language for your account','4. Escolha o idioma da sua conta')}`,
    s('On the 0.3.0 table, click the **Gravewright** button, open **Preferences** and find **Interface language**. Choose **Português (Brasil)** or **Español** and wait for the page to reload. This control saves UserPreference.locale for the authenticated account; it is not a campaign setting. The general account/security form does not contain this selector in this release. Repeat as another account and select English there.','Na mesa da 0.3.0, clique no botão **Gravewright**, abra **Preferences / Preferências** e encontre **Interface language / Idioma da interface**. Escolha **Português (Brasil)** ou **Español** e aguarde recarregar. O controle salva UserPreference.locale da conta autenticada; não é configuração da campanha. O formulário geral de conta/segurança não contém esse seletor nesta release. Repita com outra conta e escolha inglês nela.'),
    s('Check supported labels where the host uses those exact keys: Save becomes Salvar or Guardar, Close becomes Fechar or Cerrar, and Search becomes Buscar. Most text remains English because only six keys are included. A package-local i18n catalog and an authored name are separate content; do not promise that this six-key package translates every extension.','Confira locais que usam exatamente essas chaves: Save vira Salvar ou Guardar, Close vira Fechar ou Cerrar e Search vira Buscar. A maior parte permanece em inglês porque são só seis chaves. Catálogos i18n de outro pacote e nomes autorais são conteúdos separados; esse pacote não promete traduzir todas as extensões.'),
    `## ${s('5. Verify fallback, updates and disabling','5. Confira alternativa, atualização e desativação')}`,
    s('As owner, use **Deactivate languages** / **Desativar idiomas**, then reload existing pages. An unavailable personal locale resolves to English on the next request; authored campaign text is unchanged. Re-enable and verify each account’s explicit choice. To expand the catalog, add exact current host keys with preserved placeholders to both files, change version to 1.0.1, build and install that new ZIP, then activate that exact release globally. Do not edit extracted installed files or overwrite the original ID/version.','Como dono, use **Deactivate languages / Desativar idiomas** e recarregue páginas abertas. Um idioma pessoal indisponível usa inglês na próxima requisição; conteúdo autoral da campanha permanece igual. Reative e confira as escolhas explícitas das contas. Para ampliar, adicione chaves atuais exatas e preserve placeholders nos dois arquivos, mude a versão para 1.0.1, gere e instale outro ZIP e ative essa release exata globalmente. Não edite arquivos instalados nem substitua o ID/versão original.'),
    `## ${s('How to use AI to extend the catalog','Como usar a IA para ampliar o catálogo')}`,
    fence('text',s('Extend this exact language-demo package for Gravewright 0.3.0 with [specified host strings]. Inspect localization.py, the host templates and the existing language package before proposing keys. Preserve source strings, placeholders, GPL notices, en fallback and the separate per-account language choice. Keep one global locales package with no system/Django block. Deliver both complete JSON files, versioned manifest, ZIP commands and tests for owner activation, two accounts, missing keys and disabling.','Amplie este pacote language-demo no Gravewright 0.3.0 com [textos do host definidos]. Leia localization.py, templates e o pacote existente antes de propor chaves. Preserve strings originais, placeholders, avisos GPL, alternativa em inglês e escolha por conta. Mantenha pacote global locales sem system/Django. Entregue os dois JSON completos, manifesto versionado, comandos de ZIP e testes de ativação pelo dono, duas contas, chaves ausentes e desativação.')),
    '[SDK](docs:modules) · ['+s('Publish a module','Publicar um módulo')+'](docs:tutorial-publish-module) · ['+s('All tutorials','Todos os tutoriais')+'](docs:tutorial-index)'
  ].join('\n\n');
}

function publishGuide(locale){
  const pt=locale==='pt',s=(en,br)=>pt?br:en;
  return [
    `## ${s('From a working local package to an immutable release','De pacote local funcional a uma release imutável')}`,
    s('This guide prepares a publisher’s own distribution for **Gravewright 0.3.0**. It does not publish anything on your behalf. Start with a complete working [first module](docs:tutorial-first-module), [sheet action](docs:tutorial-sheet-module) or [language package](docs:tutorial-language-package), and test it on a disposable host. Keep original or authorized code/assets and their licenses together. Exclude .env, databases, campaign media, installed packages, logs, private keys and operator files.','Este guia prepara a distribuição do próprio publicador para **Gravewright 0.3.0**. Não publica nada em seu nome. Comece com [primeiro módulo](docs:tutorial-first-module), [ação de ficha](docs:tutorial-sheet-module) ou [pacote de idioma](docs:tutorial-language-package) completo e funcional e teste em host descartável. Mantenha código/recursos originais ou autorizados com suas licenças. Exclua .env, bancos, mídia de campanha, pacotes instalados, logs, chaves privadas e arquivos do operador.'),
    `## ${s('1. Prepare a new version and validate the final ZIP','1. Prepare uma versão nova e valide o ZIP final')}`,
    s('For changed bytes, increment the package manifest version, for example 1.0.0 to 1.0.1. Keep the ID stable, entry path correct and sdk.requires/tested honest for the target host. A release ID/version cannot be replaced with different bytes. Save previous archives and catalog records before publishing an update. Existing users remain on their explicitly selected campaign version until it is changed.','Para bytes diferentes, aumente a versão do manifesto, por exemplo de 1.0.0 para 1.0.1. Mantenha ID estável, entrada correta e sdk.requires/tested compatíveis com o host alvo. Um ID/versão de release não aceita bytes diferentes. Preserve arquivos e registros anteriores antes de publicar atualização. Usuários permanecem na versão escolhida na campanha até alterá-la.'),
    s('Build the ZIP with manifest.json directly at its root. List the archive and test CRC before signing. The native installer enforces compressed/expanded quotas, file count/type rules, manifest schema, SDK compatibility, entry presence, traversal, duplicate paths and executable-content checks. The signer below adds basic offline checks; it is not a substitute for native installation and activation tests.','Monte o ZIP com manifest.json na raiz. Liste e teste CRC antes de assinar. O instalador nativo verifica limites compactados/expandidos, quantidade/tipos de arquivos, schema, SDK, entrada, caminhos, duplicatas e conteúdo executável. O assinador abaixo acrescenta verificações locais básicas; não substitui testes de instalação e ativação no host.'),
    fence('powershell',`& 'E:/Your disposable host/.venv/Scripts/python.exe' -m zipfile -l ./example.sheet-name-1.0.1.zip
& 'E:/Your disposable host/.venv/Scripts/python.exe' -m zipfile -t ./example.sheet-name-1.0.1.zip`),
    `## ${s('2. Keep installation and activation distinct','2. Separe instalação e ativação')}`,
    s('Local testing: owner uses **Inside → Modules → Install module → Install from ZIP**. A system uses **Systems → Install system**. Installation validates and stores a release. A GM then opens the table’s **Gravewright → Extensions → Table modules** and selects **Activate** for the exact browser-module version. A campaign system is selected as the system. A language uses the global **Activate languages** control; a Django app requires owner activation of trusted server code and a managed restart. Do not treat any of these as the same operation.','Teste local: o dono usa **Inside → Módulos → Instalar módulo → Instalar de ZIP**. Um sistema usa **Sistemas → Instalar sistema**. A instalação valida e armazena a release. O mestre abre **Gravewright → Extensions → Table modules** e usa **Activate** para a versão exata do módulo de navegador. Um sistema é escolhido como sistema da campanha. Idioma usa **Ativar idiomas** globalmente; app Django exige ativação de código confiável pelo dono e reinício gerenciado. São operações diferentes.'),
    `## ${s('3. Choose the signed catalog type','3. Escolha o tipo do catálogo assinado')}`,
    '| '+s('Manifest','Manifesto')+' | type | '+s('Activation','Ativação')+' |\n| --- | --- | --- |\n| entry, '+s('without system/django','sem system/django')+' | module | '+s('Campaign; locales are global','Campanha; locales é global')+' |\n| system | system | '+s('Campaign system','Sistema da campanha')+' |\n| django, '+s('without entry/system/locales','sem entry/system/locales')+' | django | '+s('Owner, server restart','Dono, reinício do servidor')+' |',
    s('type participates in the signature and must match the ZIP manifest. A language package is catalog type module with locales metadata, not a fourth catalog type. Publish complete RPG systems as one installable system package using the requested host APIs; do not create a separately installed rules companion to work around missing host support.','type participa da assinatura e deve corresponder ao manifesto do ZIP. Idioma usa type module e metadado locales, não um quarto tipo de catálogo. Distribua cada sistema de RPG como um pacote instalável único com as APIs do host pedido; não crie pacote de regras separado para contornar suporte ausente.'),
    `## ${s('4. Download the complete offline signer','4. Baixe o assinador local completo')}`,
    '[sign_catalog.py](../../assets/tutorials/distribution/sign_catalog.py)',
    s('Save this original MIT helper outside the module source folder. Run it with the host’s already prepared virtual environment; cryptography is an existing host dependency. It imports no private host API, creates no production key and never overwrites an output record. Use the path of a publisher-managed Ed25519 private PEM that you already control. Keep that private key outside the ZIP, site, catalog and repository. For an encrypted PEM, --password-env names an environment variable containing its password; the helper does not print it.','Salve este utilitário original MIT fora da pasta de fontes do módulo. Execute com o ambiente virtual já preparado pelo host; cryptography já é dependência dele. O utilitário não importa API privada, não cria chave real e não sobrescreve registro de saída. Use o caminho de um PEM privado Ed25519 já administrado pelo publicador. Mantenha a chave privada fora de ZIP, site, catálogo e repositório. Para PEM cifrado, --password-env indica variável com a senha; o utilitário não a imprime.'),
    fence('python',signer),
    `## ${s('5. Sign the final bytes and verify them','5. Assine os bytes finais e confira')}`,
    s('The self-test uses public deterministic synthetic material in memory, never a real publishing key. Run it first. Then replace all example paths, URL and key ID with the publisher’s own values. On POSIX use the existing host .venv/bin/python path in place of python.exe. No dependency install, global Python registration or permanent PATH change is required.','O autoteste usa material sintético determinístico público na memória, nunca uma chave real de publicação. Execute primeiro. Depois ajuste caminhos, URL e identificador para os valores do próprio publicador. Em POSIX use .venv/bin/python do host no lugar de python.exe. Não é necessário instalar dependências, registrar Python globalmente nem mudar PATH permanentemente.'),
    fence('powershell',`& 'E:/Your disposable host/.venv/Scripts/python.exe' ./sign_catalog.py self-test
& 'E:/Your disposable host/.venv/Scripts/python.exe' ./sign_catalog.py sign --archive ./example.sheet-name-1.0.1.zip --download https://publisher.example/releases/example.sheet-name-1.0.1.zip --key-id publisher-2026 --private-key 'E:/Publisher private material/publisher-ed25519.pem' --output ./release-record-1.0.1.json
& 'E:/Your disposable host/.venv/Scripts/python.exe' ./sign_catalog.py verify --archive ./example.sheet-name-1.0.1.zip --record ./release-record-1.0.1.json --keys ./publisher-public-keys.json`),
    s('publisher-public-keys.json maps key IDs to base64-encoded raw 32-byte Ed25519 public keys. It contains no private key. Export the matching public key through your publisher key-management process. A renamed keyId with the same signature does not verify, because keyId is signed too.','publisher-public-keys.json mapeia identificadores para chaves públicas Ed25519 de 32 bytes brutos em base64. Não contém chave privada. Exporte a pública correspondente pelo processo de gestão de chaves do publicador. Alterar keyId mantendo a assinatura não funciona: keyId também é assinado.'),
    s('The SHA-256 covers the final ZIP bytes, including archive metadata. The signature covers every catalog field except signature, using the exact packages.canonical format: sorted keys, compact comma/colon separators, ensure_ascii true and allow_nan false. Scalar record values are ASCII strings; supported tags are the explicit exception and remain covered by canonicalization. Use --tag Exploration --tag Original when signing if you want catalog categories; there may be at most 24 unique nonblank tags of up to 64 characters. Recompressing, altering a URL, adding a type/status/tag or changing any signed field requires re-signing. Do not sign a directory and later rebuild its ZIP.','SHA-256 cobre os bytes finais do ZIP, inclusive metadados do arquivo. A assinatura cobre todos os campos do registro exceto signature, usando packages.canonical: chaves ordenadas, separadores compactos, ensure_ascii verdadeiro e allow_nan falso. Valores escalares são strings ASCII; tags suportadas são a exceção explícita e continuam assinadas. Use --tag Exploration --tag Original ao assinar se quiser categorias no catálogo; são até 24 tags únicas não vazias de até 64 caracteres. Recompactar, alterar URL, adicionar type/status/tag ou mudar qualquer campo assinado exige assinar novamente. Não assine uma pasta para depois refazer o ZIP.'),
    `## ${s('6. Assemble and host the catalog','6. Monte e hospede o catálogo')}`,
    s('The helper writes one record object. The Marketplace feed is an array. To create a new one-release draft catalog without overwriting an existing feed, save and run this small script beside the reviewed record. For an established multi-package catalog, merge the new record into the publisher’s existing reviewed feed, preserve unrelated records and coordinate concurrent publishers.','O utilitário grava um objeto de registro. O feed do Marketplace é um array. Para criar um catálogo novo de uma release sem sobrescrever um feed existente, salve e execute o script abaixo ao lado do registro revisado. Em catálogo com vários pacotes, mescle no feed revisado do publicador, preserve os demais registros e coordene publicações concorrentes.'),
    fence('python',`import json
from pathlib import Path

record = json.loads(Path("release-record-1.0.1.json").read_text(encoding="utf-8"))
with Path("catalog-draft.json").open("x", encoding="utf-8") as output:
    json.dump([record], output, ensure_ascii=True, indent=2)
    output.write("\\n")`),
    s('Host the immutable ZIP at its signed HTTPS download URL and the reviewed array at an HTTPS catalog URL. Publish the matching public key separately through a trusted channel; do not treat a key obtained only from an untrusted catalog as trust. Confirm a fresh download has the exact signed digest before making the catalog discoverable. Keep backup artifacts and do not replace an already distributed ID/version. This guide supplies no hosting credentials and performs no upload.','Hospede o ZIP imutável na URL HTTPS assinada e o array revisado em URL HTTPS de catálogo. Distribua a chave pública por canal confiável separado; chave recebida apenas de catálogo não confiável não estabelece confiança. Baixe novamente e confirme o digest exato antes de disponibilizar o catálogo. Preserve cópias e não substitua ID/versão distribuído. Este guia não fornece credenciais nem faz envio.'),
    `## ${s('7. Configure a disposable consumer and diagnose failures','7. Configure consumidor descartável e diagnostique')}`,
    s('On a disposable consumer only, explicitly configure GRAVEWRIGHT_MARKETPLACE_URL with the catalog HTTPS URL and GRAVEWRIGHT_MARKETPLACE_KEYS_FILE with its trusted public-key JSON. The key file defaults and relative paths remain inside that installation when you choose installation-relative paths. Restart after changing environment configuration. Do not edit a real operator .env just to run this tutorial. The owner can read GET /api/marketplace/status without contacting the remote publisher.','Somente em consumidor descartável, configure explicitamente GRAVEWRIGHT_MARKETPLACE_URL com a URL HTTPS do catálogo e GRAVEWRIGHT_MARKETPLACE_KEYS_FILE com o JSON público confiável. Use caminhos relativos à instalação para manter esse material nela. Reinicie após alterar configuração de ambiente. Não edite .env real do operador para executar o tutorial. O dono pode consultar GET /api/marketplace/status sem contatar o publicador remoto.'),
    '| '+s('Diagnostic','Diagnóstico')+' | '+s('What to inspect','O que conferir')+' |\n| --- | --- |\n| marketplace_catalog_missing / invalid | '+s('Catalog URL, HTTPS, credentials and fragment','URL do catálogo, HTTPS, credenciais e fragmento')+' |\n| marketplace_keys_missing / unreadable / invalid / empty | '+s('Trusted public-key path, JSON and raw key length','Caminho confiável, JSON e tamanho da chave pública bruta')+' |\n| permission_denied | '+s('Unknown key ID, signature, revocation or authorization','Identificador desconhecido, assinatura, revogação ou autorização')+' |\n| invalid_data | '+s('Manifest/catalog shape, digest, type, paths and quotas','Formato, digest, tipo, caminhos e limites')+' |\n| unavailable | '+s('SDK compatibility, HTTPS transport and publisher availability','Compatibilidade SDK, transporte HTTPS e disponibilidade')+' |\n| conflict | '+s('Refresh activation state and review its new revision','Recarregue ativação e revise sua nova revisão')+' |',
    s('Open the appropriate Modules or Systems installation modal to fetch that catalog. Selecting a release installs its verified archive; activate it separately. Configuration failure must not disable signature checks. Test one altered ZIP, one changed signed field, a missing public key and a mismatching type on the disposable consumer, and verify that each is rejected.','Abra o modal de instalação de Módulos ou Sistemas para buscar o catálogo. Escolher uma release instala seu arquivo verificado; ative separadamente. Falha de configuração não pode desativar assinatura. Teste ZIP alterado, campo assinado modificado, chave ausente e tipo incompatível no consumidor descartável e confirme as rejeições.'),
    `## ${s('8. Revoke or roll back without promising data rollback','8. Revogue ou volte código sem prometer voltar dados')}`,
    s('To revoke, sign a new record for the same existing ID/version with status revoked, keeping its immutable archive identity. Use the helper sign command with --status revoked and a new output filename; changing status without re-signing invalidates the old signature. Replace that version’s catalog record with the signed revoked record while preserving other releases. When consumers fetch that catalog, the host marks installed releases revoked, disables global activation, removes affected table modules, clears replacement preferences and changes table revisions. This is catalog-fetch-driven, not an immediate push to offline users.','Para revogar, assine novo registro do mesmo ID/versão com status revoked, preservando a identidade do arquivo imutável. Use sign com --status revoked e outro nome de saída; mudar status sem assinar invalida a assinatura. Substitua o registro dessa versão no catálogo pelo registro revogado assinado e preserve as demais releases. Ao buscar esse catálogo, consumidores marcam instalações como revogadas, desativam a ativação global, removem módulos afetados, limpam preferências de substituição e alteram revisões das mesas. Isso depende da busca do catálogo; não é envio imediato a usuários offline.'),
    s('Selecting an older installed release changes code selection only. Module storage and campaign documents do not revert automatically; deactivating a Django app does not generally undo its migrations. Version and migrate your own storage explicitly and keep compatible code/data recovery backups. Re-enable only a reviewed compatible version.','Selecionar release anterior muda somente a seleção de código. Storage e documentos da campanha não voltam automaticamente; desativar app Django normalmente não desfaz migrações. Versione e migre o storage explicitamente e preserve cópias compatíveis de código/dados para recuperação. Reative somente uma versão compatível revisada.'),
    `## ${s('How to use AI to prepare a release','Como usar a IA para preparar uma release')}`,
    fence('text',s('Prepare a reviewable distribution for this exact working package on Gravewright 0.3.0. Inspect the manifest and packages.py before choosing catalog type or SDK range. Preserve private data and earlier work. Provide a new version, exact file tree, final ZIP checksum, canonicalization-compatible Ed25519 signing steps using an existing private key outside the repo, public-key trust setup, HTTPS catalog draft and native disposable-host validation. Do not generate or publish a real key, upload artifacts or mutate an operator environment without authorization. Explain installation versus activation, signed revocation, immutable releases and storage/data rollback limits.','Prepare uma distribuição revisável deste pacote funcional no Gravewright 0.3.0. Confira manifesto e packages.py antes de escolher tipo e SDK. Preserve dados privados e trabalho anterior. Entregue versão nova, árvore de arquivos, checksum do ZIP final, assinatura Ed25519 canônica com chave existente fora do repositório, configuração de confiança pública, catálogo HTTPS de rascunho e validação em host descartável. Não gere nem publique chave real, envie arquivos ou altere ambiente do operador sem autorização. Explique instalar/ativar, revogação assinada, imutabilidade e limites da volta de storage/dados.')),
    '[SDK](docs:modules) · ['+s('All tutorials','Todos os tutoriais')+'](docs:tutorial-index)'
  ].join('\n\n');
}

export const distributionTutorialArticles=[
  {slug:'tutorial-language-package',group:'tutorials',sourcePaths:sources,en:{title:'How to create and activate an installation language package',summary:'Package six original interface strings, install globally, choose a personal locale and verify English fallback.',body:languageGuide('en')},pt:{title:'Como criar e ativar um pacote de idioma da instalação',summary:'Empacote seis textos originais, ative globalmente, escolha o idioma da conta e confira a alternativa em inglês.',body:languageGuide('pt')}},
  {slug:'tutorial-publish-module',group:'tutorials',sourcePaths:sources,en:{title:'How to version, sign and distribute a module',summary:'Prepare immutable ZIP releases, verify Ed25519 catalog records and understand installation, activation and revocation.',body:publishGuide('en')},pt:{title:'Como versionar, assinar e distribuir um módulo',summary:'Prepare ZIPs imutáveis, confira registros Ed25519 e entenda instalação, ativação e revogação.',body:publishGuide('pt')}}
];
