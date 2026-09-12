<!-- Generated from content/media.json by scripts/build-media-guide.mjs. -->

# Website images and videos

[English](MEDIA.md) · [Português (Brasil)](MEDIA.pt-BR.md)

All paths below are relative to the site directory. The `assets/images/` and `assets/videos/` folders already exist. Supply **3 images, 1 video, 1 poster, 2 caption files and 2 transcripts**.

**To replace:** copy files using the exact names, run `npm run build` and refresh. No HTML changes are needed. The build renders existing media and retains placeholders for missing files. To change filenames or alternative text, edit `content/media.json` and rebuild.

**Important:** the alternative text below is prepared in advance and must match the final media. Revise it if the framing or demonstration changes. Capture the current version, not the legacy interface.

## Gravewright at the table

- File: `assets/images/table-overview.webp`
- Suggested dimensions: **1911 × 926**
- English description / alt: Gravewright tabletop showing a lava-filled dungeon, a large dragon token, character tokens, lighting and the tabletop toolbars.
- Portuguese description / alt: Mesa do Gravewright com uma masmorra cercada por lava, um grande token de dragão, tokens de personagens, iluminação e barras de ferramentas.


Capture the current Alpha 0.1.0 tabletop with a prepared scene, tokens and visible lighting. Use content you can share.

## The Dragon’s Legacy · Battle showcase

- File: `assets/videos/table-session.mp4`
- Suggested dimensions: **1920 × 1080**
- English description / alt: Gravewright battle showcase with a lava-filled dungeon, a dragon token, lighting and fog controls, and character movement, accompanied by orchestral music.
- Portuguese description / alt: Demonstração do Gravewright com masmorra de lava, token de dragão, controles de iluminação e névoa e movimento de personagens, acompanhada por música orquestral.


51.1-second battle edit from the supplied recording. The poster is an original illustrated cover showing a red dragon and a volcanic fortress, with the Gravewright title. Music attribution is included in the end card, transcript and third-party notices.

- Video poster: `assets/images/table-session-cover.png` (1920 × 1080)
- English captions: `assets/videos/table-session.en.vtt`
- Portuguese captions: `assets/videos/table-session.pt-BR.vtt`
- English transcript: `assets/videos/table-session.en.txt`
- Portuguese transcript: `assets/videos/table-session.pt-BR.txt`


Video uses an `aria-label` and visible title because `<video>` does not support image-style `alt`. Use the description above to guide the transcript. The poster appears inside the player and shares its accessible context.

## Your character, close to the story

- File: `assets/images/pdf-character-sheet.webp`
- Suggested dimensions: **1600 × 1000**
- English description / alt: The original Seren Ashford PDF character sheet open in Gravewright, with editable health, energy, defense and attribute fields, abilities, equipment and notes.
- Portuguese description / alt: Ficha PDF original de Seren Ashford aberta no Gravewright, com campos editáveis de vida, energia, defesa e atributos, habilidades, equipamentos e notas.


Fresh capture of the real Alpha application using an original editable demo PDF in an isolated sample campaign. Source PDF: assets/demo/Seren-Ashford.pdf.

## A home for your campaigns

- File: `assets/images/campaign-dashboard.webp`
- Suggested dimensions: **1600 × 1000**
- English description / alt: Gravewright campaign dashboard with The Verdant Vigil, The Drowned Crown and Ashfall Citadel, illustrated covers, participant icons and a control to create a campaign.
- Portuguese description / alt: Painel do Gravewright com The Verdant Vigil, The Drowned Crown e Ashfall Citadel, capas ilustradas, ícones de participantes e controle para criar uma campanha.


Fresh capture of the real Alpha dashboard using fictional campaigns and a sample account. New abbey, ocean-palace and volcanic-fortress illustrations were created for these demo campaigns.

## Formats and accessibility

- Images and posters: WebP. Keep text legible, aspect ratios consistent and file sizes reasonable (ideally around 600 KB or less per screenshot without sacrificing readability).
- Videos: MP4 with H.264 and AAC if audio is present; 1080p is sufficient. Enable `faststart` on export. Playback is not automatic and media uses `preload="none"`.
- Captions: UTF-8 WebVTT in both languages, timed against the final recording. Include speech and relevant sounds.
- Transcripts: UTF-8 text in both languages, including speech and visual actions needed to understand the demonstration.
- For silent recordings, describe the actions in the text and explanatory captions. Do not leave fictional sample cues in the final caption files.

### Caption structure

Format example, not a finished caption. Replace text and timing with the actual recording:

```vtt
WEBVTT

00:00:00.000 --> 00:00:04.000
[Describe the action or transcribe the speech in this segment.]
```

## Final media check

```sh
npm run build
npm run check:media
```

The second check returns an error while any planned file is missing. Then open both pages, play and seek the videos, review captions/transcripts and check readability on mobile. The command checks presence and basic structure; content and timing need manual review.
