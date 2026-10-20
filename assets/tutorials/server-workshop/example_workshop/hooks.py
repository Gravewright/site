from collections import Counter
from threading import Lock

counts = Counter()
lock = Lock()


def observe(sender, change, **kwargs):
    # Only fixed resource names are retained, never campaign/user/document IDs.
    if change.resource not in {"actors", "tokens", "maps", "journals", "items", "combat", "cards", "audio", "compendiums"}:
        return
    with lock:
        counts[change.resource] += 1


def snapshot():
    with lock:
        return dict(counts)
