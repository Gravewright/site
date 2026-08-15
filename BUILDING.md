# Building the Gravewright site

The site is an independent repository. Wiki generation reads the canonical capability registry from the Gravewright core through `GRAVEWRIGHT_CAPABILITIES_PATH`; it never guesses where a neighboring checkout might be.

## Clean checkout

Install the pinned Node dependencies:

```sh
npm ci
```

Point the build at a compatible Gravewright core checkout and run every gate:

```sh
GRAVEWRIGHT_CAPABILITIES_PATH=/path/to/gravewright/app/engine/sdk/capabilities.json npm test
```

PowerShell:

```powershell
$env:GRAVEWRIGHT_CAPABILITIES_PATH = "C:\path\to\gravewright\app\engine\sdk\capabilities.json"
npm test
```

`npm test` regenerates the prerendered English pages and all locale bundles, validates links, anchors, IDs, capability coverage, translation regressions and freshness metadata, then proves that the explicitly supplied registry was used.

The official CI checks out the site and core independently and supplies this path explicitly. If the registry cannot be found or is invalid, generation fails with a setup-oriented error instead of a raw filesystem exception.
