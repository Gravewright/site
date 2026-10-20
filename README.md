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

## Preview

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
| `content/media.json` | Shared/localized media paths, dimensions, titles, alternative text, recording briefs and video duration |
| `scripts/build.mjs` | Shared page template; generates both HTML pages |
| `styles.css` | Template styles and responsive/media additions |
| `script.js` | Mobile menu, section-preserving language links, copy buttons and reduced-motion-aware reveals |
| `assets/icon.svg` | Unchanged icon from the supplied template |
| `scripts/serve.mjs` | Local preview server with video byte-range support |
| `scripts/check.mjs` | Generated-page, localized-asset, metadata and accessibility checks |

Edit the sources and rebuild rather than editing the generated HTML. Both pages contain their text at build time and work without JavaScript. Documentation links point to the current Django project, rather than importing the obsolete legacy wiki. No external fonts, trackers or CDN scripts are used.

When publishing a VTT release, update `publicVersion`, release copy and FAQs together, then rebuild. The download URL and structured-data version derive from `publicVersion`; verify that the public ZIP is available first. Both languages must describe the same release status and Translator requirement.

## Checks

```sh
npm test                 # rebuild and check both pages, links, IDs and media states
npm run check:media      # also require all planned media files
```

The normal check accepts placeholders; the strict check requires every shared and localized asset. The existing tabletop media uses real VTT 0.2.1 captures and Translator 0.1.2; the new Map Builder feature uses the shared 0.3.0 screenshot. The universal walkthrough (`assets/videos/gravewright-universal-021-showcase.mp4`, 60 seconds, 1920 × 1080) focuses on maps, tokens, measurement, journals and combat, with a brief optional DnD 5e SRD 0.1.0 sheet/compendium example. Both languages have interface screenshots, captions and descriptive transcripts. Campaign names remain **Moonfall Vigil**, **The Wild Paths** and **Beyond the Mists** in both interfaces; the scene is **Moonfall Abbey**. `durationSeconds` in the video metadata records the final edit's duration.

Both dragon images are retained: the illustrated video poster and the earlier supplied tabletop capture (`assets/images/table-overview.webp`). The latter appears in a secondary expandable gallery, with a visible thumbnail, and is distinct from the new 0.2.1 captures. The social preview remains a derivative of the illustrated poster. The Moonfall Abbey map and Seraphina Vale portrait were generated specifically for the new demonstration. The original Seren Ashford PDF remains a tutorial source, rather than the website's character-sheet screenshot. See [demo sources, prompts and hashes](assets/demo/README.md) and [media credits](THIRD_PARTY_NOTICES.md). Review playback, seeking, synchronized captions, alt text and mobile readability in a browser after changing media.

Licensing and template attribution are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## SEO

SEO metadata is generated by `scripts/seo.mjs`: localized titles and descriptions, canonical URLs, language alternates, Open Graph, large-image social cards and WebSite/WebPage/SoftwareApplication JSON-LD. Sharing uses a lightweight JPEG derivative of the video cover (`assets/images/gravewright-social-v3.jpg`, 1200 × 676, about 258 KB). Its path and dimensions are in `scripts/seo.mjs`; the original PNG remains the video poster. The checks enforce JPEG format and a 300 KB size budget. Use a new filename when replacing a social image to avoid stale image caches. `sitemap.xml` lists both public pages and `robots.txt` points crawlers to it.

Reference: [Open Graph protocol](https://ogp.me/) and [Google software application structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app).
