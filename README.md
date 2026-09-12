# Gravewright website

[English](README.md) · [Português (Brasil)](README.pt-BR.md)

Local, static website for **Alpha 0.1.0**, based on the supplied Gravewright `repository-site` template. English is the primary page (`index.html`), with a complete Brazilian Portuguese page (`pt-br.html`). No deployment workflow is included. `CNAME` records the intended domain, `gravewright.com`.

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

1. Place the media at the exact paths listed there.
2. Run `npm run build` again and refresh the preview.
3. Run `npm run check:media` when all media are ready.

Missing media render as designed placeholders, with the expected filename visible. Nonexistent images and videos are not requested. Real videos use native controls, no autoplay, language-specific captions and transcript links when supplied. Text alternatives must be revised if the final media depict something different.

## Edit content

| File | Purpose |
| --- | --- |
| `content/site.mjs` | English/Portuguese copy, release URLs and source commands |
| `content/media.json` | Media paths, dimensions, titles, alternative text and recording briefs |
| `scripts/build.mjs` | Shared page template; generates both HTML pages |
| `styles.css` | Template styles and responsive/media additions |
| `script.js` | Mobile menu, section-preserving language links, copy buttons and reduced-motion-aware reveals |
| `assets/icon.svg` | Unchanged icon from the supplied template |
| `scripts/serve.mjs` | Local preview server with video byte-range support |

Edit the sources and rebuild rather than editing the generated HTML. Both pages contain their text at build time and work without JavaScript. Documentation links point to the current Django project, rather than importing the obsolete legacy wiki. No external fonts, trackers or CDN scripts are used.

## Checks

```sh
npm test                 # rebuild and check both pages, links, IDs and media states
npm run check:media      # also require all planned media files
```

The normal check accepts placeholders. All current media slots are filled, including fresh screenshots of an original PDF character and a fictional campaign dashboard. The strict check verifies that every required asset is present. See [demo sources](assets/demo/README.md). Review the real recordings, timed captions, alt text and playback in a browser after adding them.

Licensing and template attribution are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
