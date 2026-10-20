# Gravewright website

[English](README.md) · [Português (Brasil)](README.pt-BR.md)

Product website for Gravewright, a **universal virtual tabletop**, with English (`index.html`) and Brazilian Portuguese (`pt-br.html`) pages. The public download is **0.3.0 Alpha**. Version 0.3.0 highlights Map Builder, Smart Objects with visual nodes and Universal VTT import/export alongside shared tabletop tools: tokens, measurement, dice, journals and atmosphere. Groups choose compatible system extensions or PDF sheets for their games; rules and automations come from the installed system. GitHub Pages serves the generated files at `gravewright.com`; no deployment workflow is included in this repository.

| Available product | Release | Details |
| --- | --- | --- |
| Gravewright VTT | [0.3.0 Alpha](https://github.com/Gravewright/gravewright/releases/tag/v0.3.0) | Portable ZIP with Windows, Linux and macOS installers and source |
| DnD 5e SRD | [0.1.2](https://github.com/Gravewright/dnd-srd-5e/releases/tag/v0.1.2) | One optional system package: 2014/SRD 5.1 and 2024/SRD 5.2.1, dedicated sheets, SRD drag and drop, automatic saving and combat automation |
| Savage Worlds Compatibility Package for Gravewright | [0.1.2](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright/releases/tag/v0.1.2) | One system package with free character/NPC sheets, empty item templates, SWADE automation and three action-deck styles; no compendiums or rulebook text |
| Translator | [0.1.2](https://github.com/Gravewright/marketplace/releases/tag/gravewright.translator-v0.1.2) | Brazilian Portuguese interface translation and an API for extension translations |

The main page leads with the universal VTT and its shared tools. The DnD sheet and compendium images remain in an optional system example, collapsed by default near the extensions section. PDF and system sheets are presented as choices; no particular ruleset is required by the platform.

The [Savage Worlds compatibility package](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright) appears alongside the DnD example, with repository and **0.1.2** release links in both website languages. Install the complete package from **Systems** and select it for your table. Sheets, templates, assets and automation stay together in the system package; the GM advances combat from the table. Users create their own campaign content; English is built in, and Portuguese/Spanish use the official Translator module.

**DnD 5e SRD 0.1.2** is also one package installed from **Systems** in the [Marketplace](https://github.com/Gravewright/marketplace). Sheets, compendiums and automation stay together; the GM advances combat from the table. Its 20 compendium packs contain 2,535 entries from selected licensed SRD collections in English. The [DnD](https://github.com/Gravewright/dnd-srd-5e) and [Savage Worlds](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright) system guides currently document installation on VTT **0.2.3**. Preserve that historical reference and check each package’s compatibility requirements; it is not an instruction to downgrade the current core download, **0.3.0**.

## Map Builder 0.3.0 feature

The `#map-builder` section appears immediately after the hero and is the target of its secondary action and the first navigation item. It presents building the map, connecting Smart Object nodes and generating a GM-only scene. Updating the linked scene and activating it for players are separate actions. Links lead to the [Map Builder](https://github.com/Gravewright/gravewright/blob/main/docs/en/map-builder.md) and [Universal VTT](https://github.com/Gravewright/gravewright/blob/main/docs/en/universal-vtt.md) guides.

This feature uses **one real 0.3.0 screenshot with the English interface and visible nodes**, shared by both pages. The title, caption and alternative text are localized; the interface inside the image is not translated. The same image opens at full size from the feature link. Register the shared file in `content/media.json`, with its actual dimensions and descriptions matching the framing. Existing screenshots, videos and artwork keep their files and historical versions.

The core download is one ZIP for all three platforms: `Install Windows.bat`, `Install Linux.sh` and `Install macOS.command`. The three Runner guide links come from `runnerGuides` in the locale content.

## Product wiki and developer documentation

The site includes a product wiki at [`wiki/en/index.html`](wiki/en/index.html), a complete developer reference at [`docs/en/index.html`](docs/en/index.html), and [practical AI guides](docs/en/ai.html). Every page has a Brazilian Portuguese counterpart under `pt-BR/`. The home page links to both audiences. Articles render fully at build time, with a topic sidebar, heading links, source provenance, language switching, related reading and copyable code/prompts. Local full-text search covers both areas and ignores accents; it makes no external API calls.

Product procedures live in `content/wiki.mjs`; AI workflows live in `content/ai-guides.mjs`. `content/wiki-media.json` maps real application screenshots to relevant articles, with captions, alternative text, version and provenance. Full-size images open from their thumbnails. Screenshots can use the English interface with Portuguese captions; their captions identify the interface language. Historical images retain their original version labels. Read [screenshot provenance](assets/wiki/README.md) before replacing them.

The complete technical Markdown is a checked-in snapshot of the public project guides, rather than a runtime GitHub dependency. To update it from a clean source checkout, run the following from the site directory, then review the content and rebuild:

```sh
node scripts/sync-project-docs.mjs --source /path/to/gravewright
npm test
```

`content/reference/catalog.json` records the source revision and version. Source links point to that revision. `scripts/build-knowledge.mjs` renders the snapshot with `scripts/markdown.mjs`, resolves documentation links to local articles, and generates `knowledge-search.json`, the knowledge manifest and the complete sitemap. Edit source Markdown in the main project first, keep English and Portuguese aligned, and sync again. Review copied guides whenever the public version changes; keep the snapshot version aligned with `publicVersion`.

The original snapshot bytes remain intact. During rendering, `publicationCopy` aligns historical module packaging wording with the current `AGENTS.md` decision: each new RPG system is one installable package containing its interface, rules, assets and translations. It also updates Map Builder's pre-publication introduction to describe the documented revision. Review these explicit editorial adaptations when syncing newer source guides; API signatures and exact legal notices are preserved.

AI examples explain how to provide repository context, keep systems in one package, use public APIs, protect local data and validate the result. Prompts are plain text for a developer's assistant; the website does not send project data to an AI provider or promise that generated code works.

## Runnable developer examples

Start at [Complete examples by kind](docs/en/examples-index.html). The cookbook has 29 bilingual articles: four complete extension package variants, all 13 SDK mounting surfaces, search/image/compendium contracts, the four Smart Object kinds, both connection kinds and a graph for each of the 42 node types. Each example provides prerequisites, complete code, expected behavior, errors, validation and a contextual AI prompt. Examples use the documented 0.3.0 contracts; they do not add a root `kind` field to manifests or confuse installed-system packs with native local catalogs.

`content/examples*.mjs` are the authored sources. `scripts/build-examples.mjs` generates the four package sources, all surface sources and their ZIPs, plus the Blueprint bundle with its license. ZIPs contain the manifest directly at their root. Local **Install from ZIP** can test reviewed code on a disposable host; Marketplace publication uses signed catalog records. No private keys or credentials are included. The language example is deliberately partial. The Django example requires explicit trusted activation; it is not an RPG system companion. Native captures and provenance are in [assets/examples/previews](assets/examples/previews/README.md).

`npm test` works in an independent site checkout. To run the optional surface integration tests against the real host runtime as well:

```sh
GRAVEWRIGHT_SOURCE=/path/to/gravewright node --test scripts/*.test.mjs
```

In PowerShell, set `$env:GRAVEWRIGHT_SOURCE='C:/path/to/gravewright'` before the same `node --test` command. Without an explicit source path, host integration cases are skipped with an explanation; source/syntax, package behavior and Markdown tests still run. These integration tests use the real ModuleRuntime/domain API with a simulated DOM/transport. They complement native installation and browser verification, which the individual guides describe.

The Blueprint bundle includes its own checker; see the download's README and run `uv run --locked python data/blueprint-examples/check-examples.py --host .` from a disposable host checkout after extraction there. It ignores operator `.env`/apps, isolates runtime storage and rejects database queries. It validates every node type and predicts actions, while real target ownership, GM/player permissions and live effects still require the documented Test behavior/playtest flow.

## Implementation tutorials and coverage map

The [implementation tutorial catalog](docs/en/tutorial-index.html) adds **29 bilingual articles** and **22 new source-project ZIPs**, in addition to the existing examples by kind. Start with [your first module](docs/en/tutorial-first-module.html), an [action on an existing sheet](docs/en/tutorial-sheet-module.html), a [journal module](docs/en/tutorial-journal-module.html), or the [complete original system](docs/en/tutorial-complete-system.html). Each project supplies its files, installation and activation steps, input fields, executable actions, observable results, failure handling and an AI adaptation prompt. Guides cover actors, tokens, scenes, items, combat, cards, audio, chat/dice, quests, roll tables, compendiums, files, storage, localization, customization and trusted server integration.

The [extension capability map](docs/en/tutorial-capabilities.html) links **139 public domain methods**, **17 original SDK operations** and **13 mounting surfaces** to concrete implementations. It also identifies lifecycle, event, asset, storage, modal and translation helpers. Map Builder coverage links the **four Smart Object kinds**, both connection kinds and all **42 node types** to their complete graph examples. These counts describe the checked-in 0.3.0 contract and authored catalog, not a test-pass count or a promise that arbitrary combinations of features are supported. The map distinguishes mutable campaign packs, installed system collections and operator-managed local catalogs.

`content/tutorials.mjs` aggregates the authored `content/tutorial-*.mjs` guides and packages. `scripts/build-examples.mjs` materializes the projects under `assets/tutorials/<project-id>/`, with the final manifest at each ZIP root. The complete system composes the existing working actor/token sheet with original item/spell types, stored initiative and three catalog packs in one system ZIP. Language packages activate globally and are selected per account; browser modules activate per campaign; Django packages require explicit owner activation. The distribution guide includes an offline signing helper and synthetic self-test; it does not generate production keys or publish releases. See [licenses and provenance](THIRD_PARTY_NOTICES.md) before reusing a project.

The host contract snapshot is committed in `content/extension-contracts.json`, pinned to **Gravewright 0.3.0**, revision **23ea61b8efb566cad0e3359489b0dad45e214906**. `npm run build` and ordinary `npm test` consume local source and this snapshot; they do not discover a parent host checkout, fetch a remote SDK or require a neighboring repository. Providing `GRAVEWRIGHT_SOURCE` opts into host-dependent integration checks only.

### Refresh the extension contract snapshot explicitly

Use a separate, explicitly selected host checkout at the intended released revision. Review its public API changes and preserve the requested host compatibility. In POSIX set:

```sh
export GRAVEWRIGHT_SOURCE=/path/to/gravewright
export GRAVEWRIGHT_REVISION=23ea61b8efb566cad0e3359489b0dad45e214906
```

In PowerShell set the same process-local variables:

```powershell
$env:GRAVEWRIGHT_SOURCE='C:/path/to/gravewright'
$env:GRAVEWRIGHT_REVISION='23ea61b8efb566cad0e3359489b0dad45e214906'
```

Save the following JavaScript as `data/site-maintenance/update-extension-contracts.mjs` inside the explicitly selected host checkout, outside the published site directory. Replace the revision explicitly when documenting another release. It reads committed bytes rather than attributing pending host edits to a commit, writes only the site contract snapshot and does not change global Git configuration:

```javascript
import {execFileSync} from "node:child_process";
import {writeFile} from "node:fs/promises";
import {resolve} from "node:path";
if (!process.env.GRAVEWRIGHT_SOURCE || !process.env.GRAVEWRIGHT_REVISION) {
  throw new Error("Set GRAVEWRIGHT_SOURCE and GRAVEWRIGHT_REVISION explicitly.");
}
const source = resolve(process.env.GRAVEWRIGHT_SOURCE);
const git = (...args) => execFileSync("git", ["-c", "safe.directory=" + source.replaceAll("\\", "/"), "-C", source, ...args], {encoding:"utf8", maxBuffer:8*1024*1024});
const revision = git("rev-parse", "--verify", process.env.GRAVEWRIGHT_REVISION + "^{commit}").trim();
const committed = path => git("show", revision + ":" + path);
const hostVersion = committed("pyproject.toml").match(/^version\s*=\s*"([^"]+)"/m)?.[1];
if (!hostVersion) throw new Error("The committed host project has no version.");
const registry = JSON.parse(committed("gravewright/modules/contracts/registry.json"));
const frontend = JSON.parse(committed("gravewright/modules/contracts/frontend.json"));
const snapshot = {hostVersion, sourceRevision:revision, frontend, operations:registry.operations, surfaces:registry.domains, events:registry.events};
await writeFile("content/extension-contracts.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log("Updated contract snapshot from " + revision + " (" + hostVersion + ")");
```

Run the saved utility from the **site repository root**. In POSIX:

```sh
node '/path/to/gravewright/data/site-maintenance/update-extension-contracts.mjs'
```

In PowerShell:

```powershell
node 'C:/path/to/gravewright/data/site-maintenance/update-extension-contracts.mjs'
```

Review the JSON diff and `domain-api.js` convenience methods, then update recipes, capability links and tests for any changed signatures or permissions. Sync the technical documentation from a checkout whose HEAD is that same revision using `scripts/sync-project-docs.mjs --source <path>`. Keep `content/reference/catalog.json`, the contract provenance and the documented public version aligned. Finally run `npm test`, and run host integration/native/browser checks explicitly with disposable data. A successful static build alone does not prove installation, persistence, authorization or rendering on the VTT.

## Preview commands

Use Node.js 22 or newer. There are **no npm dependencies to install**.

```sh
git clone https://github.com/Gravewright/site.git
cd site
npm run build
npm start
```

Open **http://127.0.0.1:4173**. Press Ctrl+C to stop. An alternate local port can be selected with `PORT=4174 npm start`. The server binds only to loopback. The generated HTML can also be opened directly; serving locally is preferable for clipboard access and video captions.

## Add your images and videos

Read [MEDIA.md](MEDIA.md) for the complete list of filenames, bilingual alternative text, recording briefs, sizes, posters, captions and transcripts. Its [Portuguese version](MEDIA.pt-BR.md) contains the same instructions.

1. Place the media at the exact paths listed there. Screenshots can supply separate English and Portuguese files through `files.en` and `files.pt`, with `file` as the shared fallback.
2. Run `npm run build` again and refresh the preview.
3. Run `npm run check:media` when all media are ready.

Missing media render as designed placeholders, with the expected filename visible. Nonexistent images and videos are not requested. Real videos use native controls, no autoplay, language-specific captions and transcript links when supplied. Text alternatives must be revised if the final media depict something different.

## Edit content

| File | Purpose |
| --- | --- |
| `content/site.mjs` | English/Portuguese copy, public version, release URLs and source commands |
| `content/wiki.mjs`, `content/ai-guides.mjs` | Product procedures and AI development guides in both languages |
| `content/reference/` | Complete technical reference snapshot and pinned source catalog |
| `content/tutorials.mjs`, `content/tutorial-*.mjs` | Task-oriented bilingual guides, complete project sources and executable recipes |
| `content/extension-contracts.json`, `content/tutorial-capabilities.mjs` | Explicitly refreshed host contract snapshot and implementation coverage map |
| `scripts/build-examples.mjs`, `assets/tutorials/` | Generated source projects, reviewable ZIP inputs and offline distribution helper |
| `content/wiki-media.json`, `assets/wiki/` | Screenshot-to-article mapping, real images and provenance |
| `scripts/build-knowledge.mjs`, `scripts/markdown.mjs` | Static knowledge pages and Markdown rendering |
| `knowledge.css`, `knowledge.js` | Documentation layouts and local full-text search |
| `content/media.json` | Shared/localized media paths, dimensions, titles, alternative text, recording briefs and video duration |
| `scripts/build.mjs` | Shared page template; generates both HTML pages |
| `styles.css` | Template styles and responsive/media additions |
| `script.js` | Mobile menu, section-preserving language links, copy buttons and reduced-motion-aware reveals |
| `assets/icon.svg` | Unchanged icon from the supplied template |
| `scripts/serve.mjs` | Local preview server with video byte-range support |
| `scripts/check.mjs` | Generated-page, localized-asset, metadata and accessibility checks |

Edit the sources and rebuild rather than editing the generated HTML. All pages contain their text at build time and work without JavaScript. The reference follows the current Django project, with pinned source links. No external fonts, trackers or CDN scripts are used.

When publishing a VTT release, update `publicVersion`, release copy and FAQs together, then rebuild. The download URL and structured-data version derive from `publicVersion`; verify that the public ZIP is available first. Both languages must describe the same release status and Translator requirement.

## Checks

```sh
npm test                 # renderer tests, rebuild and check every page/link/media
npm run check:media      # also require all planned media files
```

The normal check accepts placeholders; the strict check requires every shared and localized asset. The existing tabletop media uses real VTT 0.2.1 captures and Translator 0.1.2; the new Map Builder feature uses the shared 0.3.0 screenshot. The universal walkthrough (`assets/videos/gravewright-universal-021-showcase.mp4`, 60 seconds, 1920 × 1080) focuses on maps, tokens, measurement, journals and combat, with a brief optional DnD 5e SRD 0.1.0 sheet/compendium example. Both languages have interface screenshots, captions and descriptive transcripts. Campaign names remain **Moonfall Vigil**, **The Wild Paths** and **Beyond the Mists** in both interfaces; the scene is **Moonfall Abbey**. `durationSeconds` in the video metadata records the final edit's duration.

Both dragon images are retained: the illustrated video poster and the earlier supplied tabletop capture (`assets/images/table-overview.webp`). The latter appears in a secondary expandable gallery, with a visible thumbnail, and is distinct from the new 0.2.1 captures. The social preview remains a derivative of the illustrated poster. The Moonfall Abbey map and Seraphina Vale portrait were generated specifically for the new demonstration. The original Seren Ashford PDF remains a tutorial source, rather than the website's character-sheet screenshot. See [demo sources, prompts and hashes](assets/demo/README.md) and [media credits](THIRD_PARTY_NOTICES.md). Review playback, seeking, synchronized captions, alt text and mobile readability in a browser after changing media.

Licensing and template attribution are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## SEO

SEO metadata is generated by `scripts/seo.mjs` and `scripts/build-knowledge.mjs`: localized titles and descriptions, canonical URLs, language alternates, Open Graph, large-image social cards and structured data for the product, articles and collections. Sharing uses a lightweight JPEG derivative of the video cover (`assets/images/gravewright-social-v3.jpg`, 1200 × 676, about 258 KB). Its path and dimensions are in `scripts/seo.mjs`; the original PNG remains the video poster. The checks enforce JPEG format and a 300 KB size budget. Use a new filename when replacing a social image to avoid stale image caches. `sitemap.xml` lists all public pages and `robots.txt` points crawlers to it.

Reference: [Open Graph protocol](https://ogp.me/) and [Google software application structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app).
