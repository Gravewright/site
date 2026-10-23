# Product wiki screenshots / Capturas da wiki de produto

This collection includes current **0.3.2** captures under `../images/*032*.webp`
and preserves the 15 earlier **0.3.0** screenshots unchanged. Current provenance
is recorded at the end; the historical 0.3.0 record follows here.

A coleção reúne capturas atuais da **0.3.2** em `../images/*032*.webp` e preserva
os 15 prints anteriores da **0.3.0**. A procedência atual está ao fim; abaixo
permanece o registro histórico da 0.3.0, com suas tabelas intactas.

## Historical 0.3.0 captures / Capturas históricas da 0.3.0

These 15 WebP images are real browser captures of **Gravewright VTT 0.3.0**, taken
on 20 October 2026 from source revision
`23ea61b8efb566cad0e3359489b0dad45e214906`. Each image is 1440 × 900 pixels.
The interface is in **English**. The wiki supplies English and Brazilian
Portuguese captions and alternative text; Portuguese captions identify the
English interface explicitly.

As 15 imagens WebP são capturas reais do **Gravewright VTT 0.3.0**, feitas em
20 de outubro de 2026, em 1440 × 900 pixels. A interface está em **inglês**.
As legendas e os textos alternativos estão disponíveis em inglês e português
brasileiro e identificam o idioma exibido.

## Provenance and content

The application was started with a newly created installation-local SQLite
database, isolated media directory, generated demonstration accounts and a
disabled external marketplace. The regular `.env`, operator database, local
extensions, private campaigns and personal files were not used. Screenshots
were captured by Chromium with Playwright and encoded as WebP; the interface
was rendered by the application, without image generation or compositing.

The map and portraits reuse only the original public site assets
`../demo/moonfall-abbey-map.png`, `../demo/seraphina-vale.png`,
`../demo/bram-ironwood.png` and `../demo/abbey-sentinel.png`.
The PDF is the original public tutorial `../demo/Seren-Ashford.pdf`.
Their sources, generation prompts and hashes remain in
[the demonstration asset record](../demo/README.md). The PDF screen now
demonstrates that tutorial source in the real 0.3.0 PDF sheet.

Campaign titles, journal text, the Wayfarer Omens card names, audio titles and
the Lantern Gate project are original fictional examples. The three audio
files are synthetic silent WAV files. The small stone and wood textures in
Map Builder were drawn procedurally for the disposable fixture. The real
blueprint uses `interact` to enable a light, display an original message and
open a door; the playtest screen shows the application's actual predicted
changes. No proprietary catalog, rulebook, PDF or copied third-party artwork
was imported for these captures.

Os nomes e textos são exemplos fictícios originais. A captura foi feita com
banco e mídia novos e isolados, sem reutilizar a instalação pessoal. Mapa,
retratos e PDF de tutorial vêm dos arquivos já públicos deste site. Os áudios
são WAVs silenciosos sintéticos; as texturas do Map Builder foram desenhadas
por código para a demonstração. O teste de comportamento mostra o resultado
real previsto pelo aplicativo.

## Files

| File | Real application workflow |
| --- | --- |
| `campaigns-030.webp` | Campaign dashboard |
| `tabletop-030.webp` | Tabletop, map and actor tokens |
| `scenes-030.webp` | Scene directory, folder and broadcast indicator |
| `actors-030.webp` | Actor directory and reusable PDF templates |
| `pdf-sheet-030.webp` | Original editable tutorial PDF in the bundled PDF system |
| `journals-030.webp` | Journal pages, original authored text and sharing controls |
| `combat-030.webp` | Initiative, current turn and actor resources |
| `chat-dice-030.webp` | Public chat message and actual dice result |
| `library-030.webp` | Shared campaign image, PDF and audio library |
| `audio-030.webp` | Scene audio tracks, playlist and spatial-source controls |
| `cards-030.webp` | Synthetic card deck and deck-management controls |
| `extensions-030.webp` | Package installation and marketplace entry points |
| `map-builder-030.webp` | Real editable courtyard project, layers and material library |
| `blueprints-030.webp` | Connected interaction, light, message and state nodes |
| `playtest-030.webp` | Actual behavior dry run and predicted changes |

Machine-readable paths, dimensions, captions and article associations are in
[`content/wiki-media.json`](../../content/wiki-media.json).

## Licensing

Original screenshot contributions, example prose and procedural textures follow
the site's **GPL-3.0-only** license. Gravewright's application interface is
**GPL-3.0-only with the Gravewright Independent Module Permission**. The
application's preserved third-party component notices continue to apply; a
screenshot does not relicense those components or independent system packages.
See the site's [licensing and media attribution](../../THIRD_PARTY_NOTICES.md),
[LICENSE](../../LICENSE), and the application's
[0.3.0 licensing policy](https://github.com/Gravewright/gravewright/blob/v0.3.0/LICENSING.md),
[module permission](https://github.com/Gravewright/gravewright/blob/v0.3.0/LICENSE-EXCEPTION)
and [third-party notices](https://github.com/Gravewright/gravewright/blob/v0.3.0/THIRD_PARTY_NOTICES.md).

These new images are separate from the site's historical 0.2.1 screenshots and
recording and from the existing `assets/images/map-builder-nodes-030.webp` image.

## Current 0.3.2 captures / Capturas atuais da 0.3.2

The current images live under `../images/*032*.webp`; `content/wiki-media.json`
identifies each capture's actual version and associations. New 1920 × 1080
English-interface captures cover the dashboard, tabletop, scene/actor directories,
combat, chat, campaign manager, mind maps, journal chapters/references, PDF mapping
and field actions, and Smart Object integrations. Main-gallery counterparts also
show the real Brazilian Portuguese interface. Unreplaced 0.3.0 screenshots above
remain historical and explicitly retain their captured version.

As imagens atuais ficam em `../images/*032*.webp`. Os registros identificam a
versão realmente capturada. As novas telas reais da 0.3.2 estão em 1920 × 1080,
com interface em inglês; a galeria principal também tem capturas em português.
Os prints antigos não substituídos permanecem históricos, identificados como 0.3.0.

The published host commit, original artwork, isolated fixture, native UI actions,
lossless pixel checks and licenses are documented in
[the demonstration record](../demo/README.md#published-032-interface-captures-and-recording).
Hashes are in [the machine-readable record](../demo/scripts/media-032-provenance.json).
