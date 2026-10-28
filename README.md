# Gravewright website

[English](README.md) · [Português (Brasil)](README.pt-BR.md)

Product website for Gravewright, a **universal virtual tabletop**, with English (`index.html`) and Brazilian Portuguese (`pt-br.html`) pages. The public download is **0.3.4 Alpha**. It adds four themes, active-layer selection, F1–F8 shortcuts and reorganized controls, with fixes for Firefox, combat stopping and subfolders. Campaign preparation, clocks, clues, mind maps, PDF mapping and Universal VTT workflows remain available from earlier releases. Groups choose compatible system packages or PDF sheets; game rules belong to the installed system. GitHub Pages serves the generated files at `gravewright.com`; no deployment workflow is included in this repository.

| Available product | Release | Details |
| --- | --- | --- |
| Gravewright VTT | [0.3.4 Alpha](https://github.com/Gravewright/gravewright/releases/tag/v0.3.4) | Portable ZIP with Windows, Linux and macOS installers and source |
| DnD 5e SRD | [0.1.2](https://github.com/Gravewright/dnd-srd-5e/releases/tag/v0.1.2) | One optional system package: 2014/SRD 5.1 and 2024/SRD 5.2.1, dedicated sheets, SRD drag and drop, automatic saving and combat automation |
| Savage Worlds Compatibility Package for Gravewright | [0.1.4](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright/releases/tag/v0.1.4) | One system package with free character/NPC sheets, empty item templates, SWADE automation and three action-deck styles; no compendiums or rulebook text |
| Translator | [0.1.4](https://github.com/Gravewright/marketplace/releases/tag/gravewright.translator-v0.1.4) | English, Brazilian Portuguese and Spanish interface catalogs, plus an API for extension translations |

The main page leads with the universal VTT and its shared tools. The DnD sheet and compendium images remain in an optional system example, collapsed by default near the extensions section. PDF and system sheets are presented as choices; no particular ruleset is required by the platform.

The [Savage Worlds compatibility package](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright) appears alongside the DnD example, with repository and **0.1.4** release links in both website languages. Install the complete package from **Systems** and select it for your table. Sheets, templates, assets and automation stay together in the system package; the GM advances combat from the table. Users create their own campaign content; English is built in, and Portuguese/Spanish use the official Translator module.

**DnD 5e SRD 0.1.4** is also one package installed from **Systems** in the [Marketplace](https://github.com/Gravewright/marketplace). Sheets, compendiums and automation stay together; the GM advances combat from the table. Its 20 compendium packs contain 2,535 entries from selected licensed SRD collections in English. The [DnD](https://github.com/Gravewright/dnd-srd-5e) and [Savage Worlds](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright) system guides currently document installation on VTT **0.2.3**. Preserve that historical reference and check each package’s compatibility requirements; it is not an instruction to downgrade the current core download, **0.3.4**.

## Current release: 0.3.4

Four themes, active-layer selection, F1–F8 shortcuts, organized toolbar and chat controls, improved blank maps, and fixes for Firefox, combat stopping and subfolders. Savage Worlds 0.1.4 adds compact sheets and actor types chosen by the GM at creation: Wild Card and Extra. The signed Marketplace release is linked from both home pages.


## What is new in 0.3.3

Download the published [0.3.3 release](https://github.com/Gravewright/gravewright/releases/tag/v0.3.3), its [portable ZIP](https://github.com/Gravewright/gravewright/releases/download/v0.3.3/Gravewright-0.3.3-django.zip) and [SHA-256 checksum](https://github.com/Gravewright/gravewright/releases/download/v0.3.3/Gravewright-0.3.3-django.zip.sha256). Review [upgrade and recovery](docs/en/upgrading.html) for the three migrations since 0.3.2 and the special case of installations reporting the earlier, incorrectly numbered 3.0.1 version.

- [Scenes](wiki/en/scenes.html): create a blank map with a name, color, dimensions and grid choice, and activate scenes for everyone or selected players with identification-color dots.
- [Tabletop controls](wiki/en/tabletop.html): share pointers in each participant's ping color, choose whether to display or share them, configure keyboard shortcuts and add titles to local measurements.
- [Tokens](wiki/en/tokens.html): sharper names and conditions, bars above and below tokens, configurable colors and audiences, name display modes and optional turn indicators.
- [Map Builder](wiki/en/map-builder.html): group objects into layers, align and distribute selections, save reusable campaign objects, paint repeated objects and display activation areas while editing.
- [Smart Objects](wiki/en/smart-objects.html): add behaviors to uploaded artwork, define circular activation areas and control shader parameters with fixed values or typed variables. The complete [shader node example](docs/en/example-blueprint-nodes.html) requires 0.3.3.
- [Player rehearsal](docs/en/map-builder.html): test movement, vision, interaction and area events in a detached map. Behavior tests roll back changes without modifying the live scene; this does not simulate system-specific rules or advance timers.

The home page’s `#release` area presents the current release and links to its local guides. The [campaign manager](docs/en/campaign-management.html), [mind maps](docs/en/mindmaps.html), [clocks](docs/en/clocks.html), [clues](docs/en/clues.html), [journals](docs/en/journals.html), [PDF System](docs/en/pdf-system.html) and linked [Universal VTT](docs/en/universal-vtt.html) workflows introduced in 0.3.2 remain documented. `manager-032`, `mindmap-032`, `journal-032`, `progress-032` and `pdf-032` identify retained 0.3.2 application media in `content/media.json`; they are not captures of the new 0.3.3 controls. The site keeps its universal VTT branding and its optional system examples.

## Map Builder feature and historical media

The `#map-builder` section appears immediately after the hero and is the target of its secondary action and the first navigation item. It presents building the map, connecting Smart Object nodes and generating a GM-only scene. Updating the linked scene and activating it for players are separate actions. Links lead to the [Map Builder](https://github.com/Gravewright/gravewright/blob/main/docs/en/map-builder.md) and [Universal VTT](https://github.com/Gravewright/gravewright/blob/main/docs/en/universal-vtt.md) guides.

The retained feature media show the published 0.3.2 application using disposable fictional campaigns. `content/media.json` records each file’s actual dimensions, interface language, captions and framing; the image link opens its full size. Earlier 0.3.0 Builder captures and other historical media keep their original files and version labels. A new public download never changes the provenance of an old screenshot.

The core download is one ZIP for all three platforms: `Install Windows.bat`, `Install Linux.sh` and `Install macOS.command`. The three Runner guide links come from `runnerGuides` in the locale content.

## Product wiki and developer documentation

The site includes a product wiki at [`wiki/en/index.html`](wiki/en/index.html), a complete developer reference at [`docs/en/index.html`](docs/en/index.html), and [practical AI guides](docs/en/ai.html). Every page has a Brazilian Portuguese counterpart under `pt-BR/`. The home page links to both audiences. Articles render fully at build time, with a topic sidebar, heading links, source provenance, language switching, related reading and copyable code/prompts. Local full-text search covers both areas and ignores accents; it makes no external API calls.

Product procedures live in `content/wiki.mjs`; AI workflows live in `content/ai-guides.mjs`. `content/wiki-media.json` maps real application screenshots to relevant articles, with captions, alternative text, version and provenance. Full-size images open from their thumbnails. Screenshots can use the English interface with Portuguese captions; their captions identify the interface language. Historical images retain their original version labels. Read [screenshot provenance](assets/wiki/README.md) before replacing them.

The complete technical Markdown is a checked-in snapshot of the public project guides, rather than a runtime GitHub dependency. Select a separate host checkout at the released `v0.3.3` commit, **cc4fd089e6d49d32808c45ee90fdae21d1ad17dc**. From the site root, verify that checkout and synchronize its committed guides:

```sh
git -C /path/to/gravewright rev-parse HEAD
git -C /path/to/gravewright status --short
npm run sync:docs -- --source /path/to/gravewright
```

The sync command reads the selected checkout's committed HEAD, not pending edits, and copies only its public documentation allowlist. It does not build pages or refresh extension contracts. Review the Markdown/catalog diff, refresh the contract snapshot below when changing the documented host revision, and run `npm test`.

`content/reference/catalog.json` records the source revision and version. Source links point to that revision. `scripts/build-knowledge.mjs` renders the snapshot with `scripts/markdown.mjs`, resolves documentation links to local articles, and generates `knowledge-search.json`, the knowledge manifest and the complete sitemap. Edit source Markdown in the main project first, keep English and Portuguese aligned, and sync again. Review copied guides whenever the public version changes; keep the snapshot version aligned with `publicVersion`.

The 0.3.3 snapshot contains **26 bilingual reference articles (52 Markdown files)**, covering all published English and Portuguese guides in the allowlist. The wiki procedures now cover blank maps, individual scene audiences, pointer preferences, shortcuts, token appearance, Builder productivity and shader controls. Design-direction proposals remain outside the public reference snapshot; no stable public guide is omitted.

The original snapshot bytes remain intact. During rendering, `publicationCopy` aligns historical module packaging wording with the current `AGENTS.md` decision: each new RPG system is one installable package containing its interface, rules, assets and translations. It also updates Map Builder's pre-publication introduction to describe the documented revision. Review these explicit editorial adaptations when syncing newer source guides; API signatures and exact legal notices are preserved.

AI examples explain how to provide repository context, keep systems in one package, use public APIs, protect local data and validate the result. Prompts are plain text for a developer's assistant; the website does not send project data to an AI provider or promise that generated code works.

## Runnable developer examples

Start at [Complete examples by kind](docs/en/examples-index.html). The cookbook has 29 bilingual articles: four complete extension package variants, all 13 SDK mounting surfaces, search/image/compendium contracts, the four Smart Object kinds, both connection kinds and a graph for each of the 49 node types. Each example provides prerequisites, complete code, expected behavior, errors, validation and a contextual AI prompt. The contract reference targets 0.3.3. Existing module/system recipes retain their declared compatible 0.3.0 target where the SDK is unchanged; the Blueprint examples for `requestRoll` and `setQuestStatus` require 0.3.1. The four clock, clue and mind-map node types require 0.3.2, and `shaderControl` requires 0.3.3. Examples do not add a root `kind` field to manifests or confuse installed-system packs with native local catalogs.

`content/examples*.mjs` are the authored sources. `scripts/build-examples.mjs` generates the four package sources, all surface sources and their ZIPs, plus the Blueprint bundle with its license. ZIPs contain the manifest directly at their root. Local **Install from ZIP** can test reviewed code on a disposable host; Marketplace publication uses signed catalog records. No private keys or credentials are included. The language example is deliberately partial. The Django example requires explicit trusted activation; it is not an RPG system companion. Native captures and provenance are in [assets/examples/previews](assets/examples/previews/README.md).

`npm test` works in an independent site checkout. To run the optional surface integration tests against the real host runtime as well:

```sh
GRAVEWRIGHT_SOURCE=/path/to/gravewright node --test scripts/*.test.mjs
```

In PowerShell, set `$env:GRAVEWRIGHT_SOURCE='C:/path/to/gravewright'` before the same `node --test` command. Without an explicit source path, host integration cases are skipped with an explanation; source/syntax, package behavior and Markdown tests still run. These integration tests use the real ModuleRuntime/domain API with a simulated DOM/transport. They complement native installation and browser verification, which the individual guides describe.

The Blueprint bundle includes its own checker; see the download's README and run `uv run --locked python data/blueprint-examples/check-examples.py --host .` from a disposable host checkout after extraction there. It ignores operator `.env`/apps, isolates runtime storage and rejects database queries. It validates every node type and predicts actions, while real target ownership, GM/player permissions and live effects still require the documented Test behavior/playtest flow.

## Implementation tutorials and coverage map

The [implementation tutorial catalog](docs/en/tutorial-index.html) adds **29 bilingual articles** and **22 new source-project ZIPs**, in addition to the existing examples by kind. Start with [your first module](docs/en/tutorial-first-module.html), an [action on an existing sheet](docs/en/tutorial-sheet-module.html), a [journal module](docs/en/tutorial-journal-module.html), or the [complete original system](docs/en/tutorial-complete-system.html). Each project supplies its files, installation and activation steps, input fields, executable actions, observable results, failure handling and an AI adaptation prompt. Guides cover actors, tokens, scenes, items, combat, cards, audio, chat/dice, quests, roll tables, compendiums, files, storage, localization, customization and trusted server integration.

The [extension capability map](docs/en/tutorial-capability-map.html) indexes **213 public domain methods**, **17 original SDK operations** and **13 mounting surfaces**, together with lifecycle, event, asset, storage, modal and translation helpers. It links existing implementation projects where available and the canonical API/domain guides for capabilities introduced in 0.3.2; the earlier 22 projects do not implement every newer method. Map Builder coverage links the **four Smart Object kinds**, both connection kinds and all **49 node types**, including the 0.3.3 shader control, to their complete graph examples. These counts describe the checked-in 0.3.3 contract snapshot and authored catalog, not test results or support for arbitrary feature combinations. The map distinguishes mutable campaign packs, installed system collections and operator-managed local catalogs.

`content/tutorials.mjs` aggregates the authored `content/tutorial-*.mjs` guides and packages. `scripts/build-examples.mjs` materializes the projects under `assets/tutorials/<project-id>/`, with the final manifest at each ZIP root. The complete system composes the existing working actor/token sheet with original item/spell types, stored initiative and three catalog packs in one system ZIP. Language packages activate globally and are selected per account; browser modules activate per campaign; Django packages require explicit owner activation. The distribution guide includes an offline signing helper and synthetic self-test; it does not generate production keys or publish releases. See [licenses and provenance](THIRD_PARTY_NOTICES.md) before reusing a project.

The host contract snapshot is committed in `content/extension-contracts.json`, pinned to **Gravewright 0.3.3**, revision **cc4fd089e6d49d32808c45ee90fdae21d1ad17dc**. SDK **1.0.0** and frontend contract **1.2.0** remain unchanged. `npm run build` and ordinary `npm test` consume local source and this snapshot; they do not discover a parent host checkout, fetch a remote SDK or require a neighboring repository. Providing `GRAVEWRIGHT_SOURCE` opts into host-dependent integration checks only.

### Refresh the extension contract snapshot explicitly

Refresh this snapshot when changing the documented host revision or its public contracts, not when changing copy or screenshots. Use a separate, explicitly selected host checkout at the intended released revision. Review its public API changes and preserve each example's declared host compatibility. In POSIX set:

```sh
export GRAVEWRIGHT_SOURCE=/path/to/gravewright
export GRAVEWRIGHT_REVISION=cc4fd089e6d49d32808c45ee90fdae21d1ad17dc
```

In PowerShell set the same process-local variables:

```powershell
$env:GRAVEWRIGHT_SOURCE='C:/path/to/gravewright'
$env:GRAVEWRIGHT_REVISION='cc4fd089e6d49d32808c45ee90fdae21d1ad17dc'
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

Open **http://127.0.0.1:4173**. Press Ctrl+C to stop. For another port, use `PORT=4174 npm start` in POSIX shells, or the following in PowerShell:

```powershell
$env:PORT='4174'
npm start
```

The server binds only to loopback and serves existing files; it does not rebuild or watch sources. After editing, run `npm run build` and refresh the browser. Generated HTML can also be opened directly; serving locally is preferable for clipboard access and video captions.

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
| `scripts/build-examples.mjs` | Generates package/surface/tutorial sources and ZIPs from authored content; bundles Blueprint fixtures |
| `assets/examples/blueprints/` | Authored Blueprint JSON, checker and README; `examples.zip` is generated |
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

Edit the sources and rebuild rather than editing generated files. `npm run build` writes `index.html`, `pt-br.html`, `docs/`, `wiki/`, `MEDIA.md`, `MEDIA.pt-BR.md`, `knowledge-search.json`, `content/knowledge-manifest.json`, `sitemap.xml`, package/surface sources and ZIPs under `assets/examples/`, and projects under `assets/tutorials/`. The Blueprint JSON/checker/README under `assets/examples/blueprints/` are reviewed inputs; rebuild their archive after changing them. Keep generated outputs in the same review and commit as their sources.

A media replacement requires reviewing its actual version, language, dimensions, framing, captions, license, hashes and provenance in `content/media.json`, `content/wiki-media.json` and the relevant asset README. An existing 0.3.0 screenshot remains a 0.3.0 capture when the public download becomes 0.3.2. Update screenshot provenance only after producing and reviewing new media.

All pages contain their text at build time and work without JavaScript. The reference follows the current Django project, with pinned source links. No external fonts, trackers or CDN scripts are used.

When publishing a VTT release, update `publicVersion`, release copy and FAQs together, then rebuild. The download URL and structured-data version derive from `publicVersion`; verify that the public ZIP is available first. Both languages must describe the same release status and Translator requirement.

## Checks

```sh
node --test scripts/*.test.mjs  # source, behavior and Markdown tests; no site build
npm run build                  # regenerate all published outputs
npm run check                  # check the existing generated files
npm test                       # node:test, build and normal check in that order
npm run check:media            # also require all planned media files
git diff --check
```

`npm test` is defined by this site's `package.json`. `npm run check` and `npm run check:media` do not rebuild: run the build first when validating changed sources. Preview both languages at desktop and mobile widths; check navigation, search, downloads, images, video seeking/captions and code-copy controls. These checks do not establish native VTT integration or a successful public deployment.

The normal check accepts placeholders; the strict check requires every shared and localized asset. Current 0.3.2 captures and the walkthrough are described in `content/media.json`, including the video’s final filename, duration, caption tracks and transcripts. The earlier 0.2.1 universal walkthrough and 0.3.0 Builder image remain historical sources. Optional DnD sheet and compendium examples retain their own package/version labels; they do not define the core’s rules support. `durationSeconds` records the final edit’s actual duration.

Both dragon images are retained: the historical illustrated video poster and the earlier supplied tabletop capture (`assets/images/table-overview.webp`). The latter appears in a secondary expandable gallery, with a visible thumbnail, and is distinct from the current 0.3.2 captures and retained 0.2.1 media. Link sharing uses the original dragon artwork with its historical lettering; current interface screenshots belong in the gallery. Future releases should refresh the demonstrations while preserving the dragon as the social artwork. The Moonfall Abbey map and Seraphina Vale portrait were generated for the original demonstration and reused in the application. The original Seren Ashford PDF remains a tutorial source, rather than the website's character-sheet screenshot. See [demo sources, prompts and hashes](assets/demo/README.md) and [media credits](THIRD_PARTY_NOTICES.md). Review playback, seeking, synchronized captions, alt text and mobile readability in a browser after changing media.

Licensing and template attribution are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Publish with GitHub Pages

This repository publishes the generated files committed to `main` at the repository root. There is no site-authored deployment workflow or remote npm build; the GitHub-managed **pages build and deployment** run deploys those checked-in files. Keep `CNAME` set to `gravewright.com` and retain its matching custom-domain configuration in [Settings → Pages](https://github.com/Gravewright/site/settings/pages).

Before publishing, verify that the VTT release and its ZIP are public, synchronize the reference/contracts to the reviewed release, and run `npm test`, `npm run check:media` and the local browser review. Inspect `git status --short` and the complete diff, then stage only reviewed sources and their generated outputs. Keep local host checkouts, environment files, caches, keys, test output and unpublished media outside the public commit. Commit the result to `main` and publish it with:

```sh
git push origin main
git rev-parse HEAD
```

Use that SHA to verify the **pages build and deployment** run in [Actions](https://github.com/Gravewright/site/actions) and the `github-pages` environment in [Deployments](https://github.com/Gravewright/site/deployments). Wait for a successful deployment of the same commit; a successful push alone does not establish publication. Then open [the English home page](https://gravewright.com/), [Portuguese home page](https://gravewright.com/pt-br.html), wiki and developer guides, and confirm the public version, release download, navigation, search and media. Check HTTPS responses and rendered content after any CDN/browser cache has refreshed.

A domain change also needs coordinated DNS, Pages custom-domain/HTTPS settings, `CNAME`, canonical/social origins in `scripts/seo.mjs`, and source links/checks that contain the old domain. Review occurrences with `rg -n "gravewright.com" content scripts CNAME robots.txt`, rebuild and validate sitemap/robots/canonical links together. Editing `CNAME` alone does not configure DNS or certificates.

## SEO

SEO metadata is generated by `scripts/seo.mjs` and `scripts/build-knowledge.mjs`: localized titles and descriptions, canonical URLs, language alternates, Open Graph, large-image social cards and structured data for the product, articles and collections. Sharing uses `assets/images/gravewright-share-dragon.jpg` (1200 × 676, 257,815 bytes), a byte-identical copy of the original `gravewright-social-v3.jpg` dragon artwork with its historical “Gravewright / The Dragon’s Legacy / Alpha” lettering. This is promotional artwork, not a screenshot of the current interface. The former `assets/images/gravewright-social-032.jpg` URL also serves the dragon for compatibility; the real 0.3.2 tabletop JPEG is preserved as `assets/images/tabletop-preview-032.jpg`, alongside the gallery’s interface captures. The social image’s path and dimensions are in `scripts/seo.mjs`; video posters are recorded separately in `content/media.json`. The checks enforce JPEG format and a 300 KB size budget. Keep the dragon for sharing when updating future releases, and place new screenshots in the gallery. `sitemap.xml` lists all public pages and `robots.txt` points crawlers to it.

Reference: [Open Graph protocol](https://ogp.me/) and [Google software application structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app).
