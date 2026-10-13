<!-- Generated from content/media.json by scripts/build-media-guide.mjs. -->

# Website images and videos

[English](MEDIA.md) · [Português (Brasil)](MEDIA.pt-BR.md)

All paths below are relative to this repository root. This list derives from `content/media.json` and accompanies Gravewright **0.2.1 Alpha**. Dimensions, languages and duration must match the final files.

**To replace:** copy files using the exact names, run `npm run build` and refresh. No HTML changes are needed. The build renders existing media and retains placeholders for missing files. To change filenames or alternative text, edit `content/media.json` and rebuild.

**Important:** alternative text must match the final media. Revise it if the framing or demonstration changes. Use real captures of the current version with fictional data. Artwork provenance, prompts and hashes are in [assets/demo/README.md](assets/demo/README.md); credits and licenses are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Your next encounter, ready to play

- Default / fallback file: `assets/images/table-overview-021.webp`
- Localized file (English): `assets/images/table-overview-021.webp`
- Localized file (Português (Brasil)): `assets/images/table-overview-021.pt-BR.webp`
- Dimensions: **1920 × 1080**
- English description / alt: Gravewright 0.2.1 showing the original Moonfall Abbey map, character tokens and the current tabletop controls.
- Portuguese description / alt: Gravewright 0.2.1 com o mapa original da Abadia de Moonfall, tokens de personagens e os controles atuais da mesa.


Fresh English and Brazilian Portuguese captures of published VTT 0.2.1 in an isolated fictional campaign. The abbey map and character illustration were created for this demonstration.

## Gravewright 0.2.1 · Product showcase

- Default / fallback file: `assets/videos/gravewright-021-showcase.mp4`
- Dimensions: **1920 × 1080**
- English description / alt: New recording of Gravewright 0.2.1 showing a prepared tabletop, the DnD 5e SRD sheet, compendium drag and drop, automatic saving and combat.
- Portuguese description / alt: Nova gravação do Gravewright 0.2.1 mostrando uma mesa preparada, a ficha DnD 5e SRD, arraste do compêndio, salvamento automático e combate.
- Final edit duration: **60 s**


New recording of real published VTT 0.2.1, signed DnD 5e SRD 0.1.0 and Translator 0.1.2. Existing illustrated dragon cover preserved unchanged; bilingual descriptive captions and transcripts accompany the recording.

- Video poster: `assets/images/table-session-cover.png`
- English captions: `assets/videos/gravewright-021-showcase.en.vtt`
- Portuguese captions: `assets/videos/gravewright-021-showcase.pt-BR.vtt`
- English transcript: `assets/videos/gravewright-021-showcase.en.txt`
- Portuguese transcript: `assets/videos/gravewright-021-showcase.pt-BR.txt`


Video uses an `aria-label` and visible title because `<video>` does not support image-style `alt`. Use the description above to guide the transcript. The poster appears inside the player and shares its accessible context.


Soundtrack: [Volatile Reaction — Kevin MacLeod](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400039), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Preserve attribution in the end card, transcripts and third-party notices.

## DnD 5e SRD · Seraphina Vale

- Default / fallback file: `assets/images/dnd-character-sheet-010.webp`
- Localized file (English): `assets/images/dnd-character-sheet-010.webp`
- Localized file (Português (Brasil)): `assets/images/dnd-character-sheet-010.pt-BR.webp`
- Dimensions: **1050 × 1120**
- English description / alt: Seraphina Vale's real DnD 5e SRD 0.1.0 character sheet with an original ranger portrait, abilities, skills, health, equipment and rest controls.
- Portuguese description / alt: Ficha real de Seraphina Vale no DnD 5e SRD 0.1.0, com retrato original de patrulheira, atributos, perícias, vida, equipamento e descansos.


Native character window captured from the signed DnD 5e SRD 0.1.0 system in published VTT 0.2.1. Portuguese interface uses Translator 0.1.2.

## Your campaigns, together

- Default / fallback file: `assets/images/campaign-dashboard-021.webp`
- Localized file (English): `assets/images/campaign-dashboard-021.webp`
- Localized file (Português (Brasil)): `assets/images/campaign-dashboard-021.pt-BR.webp`
- Dimensions: **1920 × 1080**
- English description / alt: The current Gravewright dashboard with three fictional campaigns, new original covers and controls to create or join a table.
- Portuguese description / alt: Painel atual do Gravewright com três campanhas fictícias, novas capas originais e controles para criar ou entrar em uma mesa.


Fresh VTT 0.2.1 dashboard captures in both languages with fictional demo accounts; no live user campaigns or personal data.

## From the SRD to your character

- Default / fallback file: `assets/images/srd-compendium-010.webp`
- Localized file (English): `assets/images/srd-compendium-010.webp`
- Localized file (Português (Brasil)): `assets/images/srd-compendium-010.pt-BR.webp`
- Dimensions: **1920 × 1080**
- English description / alt: DnD 5e SRD compendium beside Seraphina's character sheet, with searchable licensed entries ready to drag onto the sheet.
- Portuguese description / alt: Compêndio DnD 5e SRD ao lado da ficha de Seraphina, com entradas licenciadas pesquisáveis prontas para arrastar para a ficha.


Real native compendium and system sheet. SRD entries remain in English; interface controls are captured in both English and Portuguese.

## The Dragon’s Legacy · A world to explore

- Default / fallback file: `assets/images/table-overview.webp`
- Dimensions: **1911 × 926**
- English description / alt: The preserved Gravewright tabletop capture of a lava-filled dungeon, a large dragon token and a party of adventurers.
- Portuguese description / alt: Captura preservada da mesa do Gravewright com uma masmorra de lava, um grande token de dragão e um grupo de aventureiros.


Original dragon tabletop image preserved unchanged at the user’s request. It illustrates an earlier tabletop interface; the other product captures show VTT 0.2.1.

## Formats and accessibility

- Interface screenshots: localized WebP files. Preserve the original artwork and illustrated poster PNGs; the social image uses JPEG. Keep text legible, aspect ratios consistent and screenshot file sizes reasonable.
- Videos: MP4 with H.264 and AAC if audio is present; 1080p is sufficient. Enable `faststart` on export. Playback is not automatic and media uses `preload="none"`. Record the final duration as `durationSeconds`.
- Captions: UTF-8 WebVTT in both languages, timed against the final recording. Include speech and relevant sounds.
- Transcripts: UTF-8 text in both languages, including speech and visual actions needed to understand the demonstration.
- For silent recordings, describe the actions in text and explanatory captions. Do not leave fictional sample cues in the final caption files.

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
