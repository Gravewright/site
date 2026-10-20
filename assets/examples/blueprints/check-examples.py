"""Check synthetic Blueprint examples against an installed source checkout.

Run from the host root:
    uv run --locked python data/blueprint-examples/check-examples.py --host .

Contributor fixture checker; not a public module SDK or gameplay entry point.
"""
import argparse
import json
import os
from pathlib import Path
import sys
from uuid import uuid4

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--host", required=True, type=Path, help="Disposable Gravewright source root")
args = parser.parse_args()
host = args.host.resolve()
if not (host / "manage.py").is_file() or not (host / "gravewright/maps/blueprints.py").is_file():
    parser.error("--host must point to a Gravewright source checkout")
fixtures = Path(__file__).resolve().parent
sys.path.insert(0, str(host))
sys.dont_write_bytecode = True
workspace = (host / "data/blueprint-example-check" / uuid4().hex).resolve()
if not workspace.is_relative_to(host / "data"):
    parser.error("Fixture workspace must remain inside the installation data folder")
from scripts.runtime_storage import configure_runtime_storage
configure_runtime_storage(host, workspace / "tools")
directories = {name: workspace / name for name in ("media", "modules", "content", "api-extensions", "django-extensions")}
for directory in directories.values():
    directory.mkdir(parents=True, exist_ok=True)
os.environ.update({
    "PYTHON_DOTENV_DISABLED": "1",
    "DJANGO_SETTINGS_MODULE": "config.settings",
    "DJANGO_DEBUG": "true",
    "DJANGO_SECRET_KEY": "synthetic-documentation-fixtures-only",
    "GRAVEWRIGHT_DATABASE": ":memory:",
    "GRAVEWRIGHT_PUBLIC_ORIGIN": "",
    "GRAVEWRIGHT_REDIS_URL": "",
    "GRAVEWRIGHT_SERVER_APP_PATHS": "",
    "GRAVEWRIGHT_SERVER_APPS": "",
    "GRAVEWRIGHT_MARKETPLACE_URL": "",
    "GRAVEWRIGHT_MARKETPLACE_KEYS_FILE": "",
    "GRAVEWRIGHT_RELEASES_REPOSITORY": "",
    "GRAVEWRIGHT_AUTOMATION_WORKER_ENABLED": "false",
    "GRAVEWRIGHT_MAP_TILER": "pillow",
    "GRAVEWRIGHT_MEDIA_ROOT": str(directories["media"]),
    "GRAVEWRIGHT_MODULES_ROOT": str(directories["modules"]),
    "GRAVEWRIGHT_CONTENT_ROOT": str(directories["content"]),
    "GRAVEWRIGHT_API_MODULES_ROOT": str(directories["api-extensions"]),
    "GRAVEWRIGHT_DJANGO_MODULES_ROOT": str(directories["django-extensions"]),
    "GRAVEWRIGHT_DJANGO_REGISTRY": str(workspace / "server-apps.json"),
})

import django
django.setup()
from django.conf import settings
from django.db import connection
from gravewright.maps.blueprints import KIND_STATES, NODE_TYPES, clean_blueprint, evaluate_graph
from gravewright.maps.services import MapError


def read(name):
    return json.loads((fixtures / name).read_text(encoding="utf-8"))


def refuse_database(execute, sql, params, many, context):
    raise AssertionError("This fixture checker must not query a database")


def require(condition, message):
    if not condition:
        raise AssertionError(message)


resources = read("resources.json")
require(settings.DATABASES["default"]["NAME"] == ":memory:", "isolated database")
require(not settings.GRAVEWRIGHT_SERVER_APPS, "operator applications must not be imported")
require(settings.GRAVEWRIGHT_MODULES_ROOT == directories["modules"], "isolated modules")
require(settings.GRAVEWRIGHT_CONTENT_ROOT == directories["content"], "isolated content")
recipe_names = ("door-toggle", "lever-toggle", "torch-turn-flame", "region-pressure-plate", "execution-data")
evaluations = 0
with connection.execute_wrapper(refuse_database):
    documents = {}
    for name in recipe_names:
        raw = read(name + ".json")
        normalized = clean_blueprint(raw, asset_ids=[], light_ids=[], track_ids=[])
        require(normalized == raw, name + ": fixture must already be normalized")
        documents[name] = normalized

    for state, expected in (("closed", "open"), ("open", "closed"), ("locked", None)):
        result = evaluate_graph(documents["door-toggle"], "interact", state)
        require([a["targetState"] for a in result["actions"]] == ([] if expected is None else [expected]), "door toggle")
        evaluations += 1

    for name in ("lever-toggle", "torch-turn-flame", "execution-data"):
        for state, expected in (("off", "on"), ("on", "off")):
            result = evaluate_graph(documents[name], "interact", state)
            require(result["actions"][0]["targetState"] == expected, name)
            if name == "torch-turn-flame":
                require(result["actions"][1]["type"] == "flame", "torch flame action")
                require(result["actions"][1]["enabled"] == (state == "off"), "torch flame setting")
            if name == "execution-data" and state == "off":
                require(result["trace"] == ["start", "branch", "read", "compare", "on", "message"], "typed data trace")
                require([a["type"] for a in result["actions"]] == ["state", "showMessage"], "message action order")
            evaluations += 1

    for event, count, state, expected in (("presence:enter", 1, "occupied", "open"), ("presence:enter", 2, "occupied", None), ("presence:exit", 1, "occupied", None), ("presence:exit", 0, "empty", "closed")):
        result = evaluate_graph(documents["region-pressure-plate"], event, state, event_context={"count": count, "presence": "enter" if event.endswith("enter") else "exit"})
        require([a["targetState"] for a in result["actions"]] == ([] if expected is None else [expected]), "first/last occupancy")
        if expected is not None:
            require(result["actions"][0]["target"] == resources["door"], "region target")
        evaluations += 1

    catalog = read("node-catalog.json")
    require({item["type"] for item in catalog} == set(NODE_TYPES), "node catalog must cover the host's NODE_TYPES exactly")
    for item in catalog:
        raw = read(item["file"])
        normalized = clean_blueprint(raw, asset_ids=[resources["asset"]], light_ids=[resources["light"]], track_ids=[resources["sound"]])
        require(raw == normalized, item["type"] + ": normalization")
        event = next(iter(normalized["graphs"]))
        state = KIND_STATES[normalized["kind"]][0]
        result = evaluate_graph(normalized, event, state, event_context={"count": 1})
        require(("start" if item["type"] == "event" else "sample") in result["trace"], item["type"] + ": sample must execute or be read")
        if item["type"] == "delay":
            result = evaluate_graph(normalized, event, state, continuation=result["delay"]["continuation"], now=3000)
            require(result["actions"][0]["targetState"] == "open", "delay continuation")
        if item["type"] == "counter":
            require(result["actions"] == [], "counter first run")
            result = evaluate_graph(normalized, event, state, memory=result["memory"])
            require(result["actions"][0]["targetState"] == "open", "counter second run")
        if item["type"] in ("once", "cooldown"):
            require(result["actions"][0]["targetState"] == "open", "control first run")
            repeat = evaluate_graph(normalized, event, state, memory=result["memory"], now=1000)
            require(repeat["actions"] == [], "control repetition")
        if item["type"] in ("emitEvent", "timer"):
            receiver = evaluate_graph(normalized, "signal:ready", state)
            require(receiver["actions"][0]["targetState"] == "open", "signal receiver")

    malformed = read("execution-data.json")
    malformed["graphs"]["interact"]["edges"].append({"kind": "execution", "from": "start", "to": "read", "output": "next"})
    try:
        clean_blueprint(malformed)
    except MapError:
        pass
    else:
        raise AssertionError("Execution edges into pure value nodes must be rejected")

print(f"Passed: {len(recipe_names)} recipes, {evaluations} main evaluations, {len(catalog)} node types, delayed/control/signal checks, invalid connection rejected; database queries blocked.")
