# Demo media sources / Fontes das mídias de demonstração

The current product screenshots and main video show published **Gravewright VTT
0.3.2**. The 68.5-second silent recording covers the tabletop, campaign manager,
progress, mind maps, journals, PDF mapping and Smart Object integrations. Main
screenshots have real English and Brazilian Portuguese interface versions.
See [the 0.3.2 capture record](#published-032-interface-captures-and-recording)
and [asset hashes](scripts/media-032-provenance.json). Earlier media and original
artwork remain below as historical records; their bytes are preserved.

As capturas atuais e o vídeo principal mostram o **Gravewright VTT 0.3.2
publicado**. A gravação silenciosa tem 68,5 segundos; os prints principais têm
interfaces reais em inglês e português brasileiro. A procedência da 0.3.2 e os
hashes estão nos links acima. As mídias anteriores e artes originais foram
preservadas e permanecem identificadas abaixo como registros históricos.

## Link-sharing artwork / Arte de compartilhamento

Shared links always use the original authorized dragon artwork. The primary
URL is [`../images/gravewright-share-dragon.jpg`](../images/gravewright-share-dragon.jpg).
The earlier [`../images/gravewright-social-032.jpg`](../images/gravewright-social-032.jpg)
URL now serves the same dragon bytes for compatibility with older metadata.
Both are exact copies of the unchanged
[`gravewright-social-v3.jpg`](../images/gravewright-social-v3.jpg) source: no
image editing or re-encoding was performed. Real interface photographs remain
in the product gallery. The former tabletop JPEG is archived unchanged as
[`../images/tabletop-preview-032.jpg`](../images/tabletop-preview-032.jpg), with
its original capture hash and former URL retained in the provenance record.

Links compartilhados sempre usam a arte original autorizada do dragão. A URL
principal é `gravewright-share-dragon.jpg`; a antiga URL
`gravewright-social-032.jpg` agora entrega os mesmos bytes do dragão para
compatibilidade com metadados anteriores. Ambas são cópias exatas do original
`gravewright-social-v3.jpg`, sem edição nem recodificação. Fotos da interface
ficam na galeria do produto. A antiga prévia JPEG da mesa está arquivada,
inalterada, como `tabletop-preview-032.jpg`, com hash e caminho anterior
preservados no registro de procedência.

## Historical 0.2.1 capture record / Registro histórico da 0.2.1

These historical captures and the former walkthrough show the real **Gravewright VTT 0.2.1** interface and **Translator 0.1.2**. That recording presented maps, tokens, measurement, journals and combat. The published **DnD 5e SRD 0.1.0** system appeared briefly as an optional extension example; its sheet and compendium screenshots remain historical examples. They were captured in a browser using an isolated local database, fictional campaigns and demonstration accounts. Original map and portrait assets were loaded into the application before recording; the interface itself was not generated.

| Media | English file | Portuguese file |
| --- | --- | --- |
| Tabletop | `../images/table-overview-universal-021.webp` | `../images/table-overview-universal-021.pt-BR.webp` |
| Optional DnD sheet example | `../images/dnd-character-sheet-010.webp` | `../images/dnd-character-sheet-010.pt-BR.webp` |
| Campaign dashboard | `../images/campaign-dashboard-universal-021.webp` | `../images/campaign-dashboard-universal-021.pt-BR.webp` |
| Optional SRD compendium example | `../images/srd-compendium-universal-010.webp` | `../images/srd-compendium-universal-010.pt-BR.webp` |
| Preserved Dragon’s Legacy scene | `../images/table-overview.webp` | Shared capture |

The historical universal walkthrough is `../videos/gravewright-universal-021-showcase.mp4`, 60 seconds at 1920 × 1080. Its English/Portuguese captions and descriptive transcripts use the same basename with `.en.vtt`, `.pt-BR.vtt`, `.en.txt` and `.pt-BR.txt`. The current `content/media.json` points to the new 0.3.2 media. The campaign names are **Moonfall Vigil**, **The Wild Paths** and **Beyond the Mists** in both interfaces; the map/scene name is **Moonfall Abbey**. Proper names remain in English when interface controls are translated. The preserved illustrated poster is `../images/table-session-cover.png`; its `../images/gravewright-social-v3.jpg` derivative is the current link-sharing image. The dragon artwork retains its original lettering and is distinct from the actual 0.3.2 interface captures.

The earlier supplied Dragon’s Legacy tabletop capture (`../images/table-overview.webp`, 1911 × 926) is also preserved, with a visible thumbnail and an expandable full image. It is distinct from the new 0.2.1 captures and the illustrated dragon poster. No current application version is inferred from that earlier image.

As capturas históricas da 0.2.1 e o vídeo anterior mostram o VTT universal real, com base isolada e dados fictícios, destacando mapa, tokens, medição, diários e combate. O DnD 5e SRD aparece naquele vídeo como exemplo opcional de extensão. Há capturas históricas em inglês e português; os nomes Moonfall Vigil, The Wild Paths, Beyond the Mists e Moonfall Abbey permanecem em inglês. O mapa e os retratos foram inseridos no VTT antes da gravação. O arquivo `content/media.json` agora aponta às mídias atuais da 0.3.2. A imagem social `gravewright-social-v3.jpg` volta a representar o site nos links compartilhados: é a ilustração original do dragão, com sua tipografia preservada, e não uma captura da interface atual.

## Demo source assets

| Asset | Provenance | Dimensions | SHA-256 |
| --- | --- | --- | --- |
| `moonfall-abbey-map.png` | Built-in image generation, one text-to-image call on 2026-10-12, no reference image | 1672 × 941 | `8b9a78f02772e4214605bbec66f946b48f09cb23a80973d1e910744bfb23ce24` |
| `seraphina-vale.png` | Built-in image generation, one text-to-image call on 2026-10-12, no reference image | 1672 × 941 | `2a0dc382b5a87913ba9655f687821400869c285787d82e3b29c0b60d48633a52` |
| `bram-ironwood.png` | Built-in image generation, one text-to-image call on 2026-10-12, no reference image; original dwarf token portrait | 1254 × 1254 | `de160cca6c99ba9b857c84ea199b5eed2ea467351a2b5fe6996eb4a1d01e7b82` |
| `abbey-sentinel.png` | Built-in image generation, one text-to-image call on 2026-10-12, no reference image; original stone-guardian token portrait | 1254 × 1254 | `e2599199d82a43a537f5c5dd7567d288978803cc5684307f73499090d4ca79cd` |
| `../images/table-session-cover.png` | Original text-to-image dragon artwork preserved from the earlier site demonstration | 1672 × 941 | `3e7f63a3df82708178edfd41dc3ea7509ef50df8842d2b5927fa8a0024368503` |
| `../images/gravewright-social-v3.jpg` | JPEG derivative of the preserved dragon cover | 1200 × 676 | `5f0eb975c9417017d8c40d009f0d9b75fd6470a940a2820d4a766d169b0fe3f3` |
| `../images/table-overview.webp` | Earlier supplied Gravewright tabletop capture, preserved unchanged | 1911 × 926 | `f190a01290c570d234f1fc2b9325b535e535e105252215ac6772c6e486de498e` |
| `Seren-Ashford.pdf` | Original editable tutorial PDF, seven blank form fields; retained as a tutorial source | — | `fc41dd50558505570530865cf51cf4655f33f872f917987f6d340062c3525d34` |

The PDF is not the current website character-sheet capture. Prompts below reproduce the instructions used to generate the original assets; requested sizes in prompts can differ from the actual output dimensions in the table. Image generation produced artwork only. The source artwork does not contain an application interface, token frames or logos. Bram Ironwood and Abbey Sentinel are fictional characters whose portraits were loaded as real VTT token avatars before capture. Their opaque RGB PNG sources are 2,775,934 and 3,054,973 bytes respectively, preserved unchanged from the generator outputs. License distinctions and the soundtrack credit are documented in [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).

Os quatro novos PNGs foram gerados com uma chamada cada, sem imagens de referência. Os prompts completos estão abaixo, e os hashes identificam os arquivos originais. Bram Ironwood e Abbey Sentinel são personagens fictícios; seus retratos quadrados foram carregados como avatares dos tokens reais da demonstração. O PDF continua como fonte do tutorial, com campos vazios. A interface e os contornos dos tokens das capturas foram renderizados pelo aplicativo.

## Generation prompts

### Moonfall Abbey map

```text
Use case: stylized-concept.
Asset type: original high-resolution RPG battle map to load as the background of a real virtual tabletop, without any interface baked into the art.
Primary request: the roofless ruins of an ancient stone abbey in a jade-green forest, photographed straight down as a playable orthographic plan. Landscape 16:9 composition, as high resolution as possible, ideally 3840 x 2160.
Scene and composition: a generous open central courtyard of worn pale stone paving, with an old circular fountain and several broad, clearly connected walking paths. Arrange roofless ruined abbey chambers and broken cloister columns around the courtyard. Include a recognizable small side library with a few surviving bookcases and tables, and a small side crypt with stone tombs. Keep both rooms open to the sky, with their entire floors visible. Mature forest trees and low vegetation frame the outer edges without obscuring the main playable ground. A narrow stone bridge enters from the bottom/south across a shallow ravine and leads directly into the courtyard through a broken gate.
Style: premium hand-painted fantasy tabletop battle map, elegant natural materials, nuanced moss and ivy, crisp readable stone edges and rubble, restrained detail. Clear separation between walkable pale stone, jade foliage, dark ruined walls and water. Warm amber lanterns mark a few passages; balanced soft ambient light so all rooms and movement lanes remain readable. Subtle near-vertical shadows only.
Constraints: absolutely vertical top-down orthographic view, no perspective, no isometric camera, no horizon, no roofs. Practical playable floor plan with generous unobstructed lanes and sufficient open floor for movable virtual tokens. Original generic fantasy architecture; do not reproduce any known fictional setting or existing map.
Avoid: grids, squares drawn as a grid, text, lettering, labels, numbers, map legends, icons, tokens, characters, creatures, logos, watermarks, UI, screenshots, mockups, decorative borders, excessive darkness, dramatic oblique shadows, cinematic perspective.
```

### Seraphina Vale portrait

```text
Use case: stylized-concept
Asset type: original landscape character portrait for a fantasy virtual tabletop character-sheet banner and product demonstration, aspect ratio 16:9.
Scene/backdrop: a misty jade-green forest, with soft layered tree silhouettes and atmospheric depth. Keep the left half quiet, dark, uncluttered and mostly forest.
Subject: Seraphina Vale, an original adult female elven ranger. An expressive, fully visible face, softly pointed ears, lightly wavy black hair, alert thoughtful eyes, a dark forest-green cloak, practical detailed leather armor, and a small leaf-shaped brooch. The upper part of a simple wooden bow may appear low in the frame. No extra characters.
Style/medium: polished premium naturalistic fantasy painting, credible anatomy and proportions, subtle painterly brushwork, convincing leather, cloth, skin and hair textures, beautiful restrained detail. Original character design with no resemblance to an existing named franchise character.
Composition/framing: a wide 16:9 image, chest-up and shoulders visible, subject on the right third. Place her face in the upper-center of the right third, approximately 75 percent across and 35 percent down. Show her ENTIRE head with comfortable headroom and visible hair silhouette; do not cut off the crown, chin, ears or face. Keep her face clear and large enough to remain readable in a character-sheet header. Her torso extends toward the lower-right. Keep the calm dark forest on the left suitable for interface text added later, but do not render any text.
Lighting/mood: soft natural light on her face, delicate warm highlights against cool jade forest shadows, attentive grounded adventurer mood. Strong enough face/background separation for a dark interface, without neon effects.
Constraints: one original artwork only. No text, lettering, logo, watermark, signature, user interface, panels, map, borders or typography. No Wizards of the Coast or Foundry artwork or distinctive copyrighted character design. Not a screenshot or mockup. Opaque forest background.
```

### Bram Ironwood token portrait

```text
Use case: stylized-concept
Asset type: one original square 1:1 fantasy character portrait, intended as a virtual tabletop token avatar.
Subject: Bram Ironwood, an original adult male dwarf adventurer with a substantial copper-red beard, expressive attentive eyes, robust believable facial proportions and practical worn steel armor. His face is clearly visible, no helmet covering it. Naturalistic premium fantasy painted realism, fine tactile brushwork and believable skin, beard and metal.
Composition/framing: square image. Full head centered with comfortable headroom and the entire beard visible; head and shoulders occupy around 70 percent of the canvas. Keep the face, hair, ears and beard well inside the central circular token-safe region, with a readable silhouette at small sizes.
Scene/backdrop: softly defocused dark jade forest, subtle warm amber lantern illumination on the face and armor, restrained warm/cool separation. Grounded and resolute mood.
Constraints: one character portrait only, opaque background, completely original design without copying an existing named franchise character or official artwork. No text, logos, watermarks, signature, lettering, UI, borders, maps or graphic panels.
```

### Abbey Sentinel token portrait

```text
Use case: stylized-concept
Asset type: one original square 1:1 fantasy stone-guardian portrait, intended as a virtual tabletop token avatar.
Subject: Abbey Sentinel, an original ancient stone construct and armored guardian. Weathered granite head and shoulders with convincing carved stone armor, restrained moss in crevices, faint jade light in the eyes. Clearly a dignified stone construct rather than a living person. Premium original fantasy painted realism, tactile mineral textures and subtle painterly brushwork.
Composition/framing: square image. Full head centered with comfortable headroom, head and shoulders occupying around 70 percent of the canvas. Keep the head, face and shoulders safely within the central circular token-safe region and use a strong readable silhouette for small sizes.
Scene/backdrop: a dark softly defocused forest, atmospheric jade shadows, subdued natural rim light separating the weathered stone from the background. The jade eyes glow faintly, not neon.
Constraints: one original construct portrait only, opaque background, do not copy any official artwork or existing franchise creature design. No text, symbols resembling letters or runes, logos, watermark, signature, UI, borders, maps or graphic panels.
```

### Preserved video cover — The Dragon’s Legacy

Created from scratch with the built-in image generation tool, without reference images. The original artwork and its lettering remain unchanged; the current product version is stated in the page copy and recording.

```text
Use case: ads-marketing. Create an entirely new premium dark fantasy video thumbnail, landscape 16:9, full bleed. A colossal red dragon on the right, roaring with glowing embers in its jaws, wings framing a ruined black stone fortress above rivers of lava. Small adventurer silhouettes on a bridge convey scale. Cinematic painted realism, dramatic molten gold and crimson rim lighting, charcoal shadows, floating sparks, strong focal point, polished fantasy key art. Left third has controlled dark negative space with large beautifully typeset, extremely legible antique gold title exactly 'GRAVEWRIGHT', below it smaller ivory text exactly 'THE DRAGON’S LEGACY', and a small understated line 'ALPHA 0.1.0'. Keep typography safely inset from edges. Compose for immediate readability as a video cover at small size. Original illustration only: no screenshot, no tabletop map, no tokens, no software UI, no browser frame, no play button, no watermark. Do not reference or reuse any previous image.
```

## Map Builder node editor — 0.3.0

`../images/map-builder-nodes-030.webp` is a real **1920 × 1080** browser capture
of the released [Gravewright 0.3.0](https://github.com/Gravewright/gravewright/releases/tag/v0.3.0),
commit [`23ea61b8ef`](https://github.com/Gravewright/gravewright/commit/23ea61b8efb566cad0e3359489b0dad45e214906),
captured on 2026-10-20 with Microsoft Edge 155.0.4283.62.
One English-interface image is shared by both site languages; its caption and
alternative text are localized.

The isolated **Moonfall Workshop** project uses fictional names, a synthetic
128 × 32 solid-color door image (`#9a6844`) and a native light. No operator
database, campaign, media or third-party artwork was reused. The disposable
fixture comes from the published Map Builder browser harness. The graph was
authored through the validated project API and displayed in the real editor.
The window was resized using its native handle; Fit graph and Simulate were
used without injected CSS, changed DOM text, generated UI or image composition.

Five nodes and five connections are visible at **100%**: Moonfall gate's
interaction checks whether it is Closed, branches to Opened or Closed, then
enables Gate torch. Simulate highlights the open branch and leaves the saved
project unchanged. All node bounds fit in the graph; the capture reported no
page errors, failed requests or native dialogs. Only lossless WebP encoding was
applied, and decoded pixels were compared with the original PNG.

| Artifact | SHA-256 |
| --- | --- |
| Original PNG, retained in the local capture evidence | `e73948e6925fbf54884be7b557647fe6d755247676fdf44d2f86bae62057a054` |
| Published WebP | `2439b369603bf6f7f3d42210c1853df9b51be7f2bfe0ce5ce0d88b77a987bc36` |
| Synthetic door PNG | `18a2df97ce891c34846f962066bb86e742717099fb53a6656fdd0d72a69663b3` |

### Português — captura dos nodes da 0.3.0

O print real de **1920 × 1080** mostra o editor de Objetos Inteligentes do
Gravewright **0.3.0** publicado, no commit acima. Uma única imagem em inglês é
compartilhada entre os idiomas, com legenda e texto alternativo traduzidos.
A campanha descartável Moonfall Workshop usa nomes fictícios, uma imagem de
porta sintética e uma luz nativa, sem dados reais nem arte de terceiros.

Os cinco nodes e cinco conexões aparecem a **100%**: a interação em Moonfall
gate verifica o estado Closed, escolhe Opened ou Closed e ativa Gate torch.
Simulate destaca o ramo de abertura sem alterar o projeto salvo. A interface
foi renderizada pelo aplicativo real, sem CSS ou texto visual injetados nem
montagem. O WebP foi convertido sem perdas e seus pixels foram comparados com
o PNG original. Os hashes acima registram a origem e o arquivo publicado.

## Published 0.3.2 interface captures and recording

The new `*032*` images and `../videos/gravewright-032-showcase.mp4` were
captured from published **Gravewright VTT 0.3.2**, commit
`04f0c1ee48341f2cfd3d47418138d3380db7ea2e`, on 23 October 2026 using Chromium
151.0.7922.34 and a 1920 × 1080 viewport at device scale 1. Main screenshots
have real English and Brazilian Portuguese interface versions. Authored names,
notes and PDF text remain in their original English wording. The synthetic fixture adapter (`gravewright.translator`, fixture version
0.1.0, not a published Translator package release) activates the host's public locale catalogs through its
normal package mechanism; no displayed text was replaced in the browser.

The fictional Moonfall campaign reuses only this site's original abbey map,
Seraphina, Bram and Sentinel portraits and tutorial PDF. A new flat PDF was
drawn as an original vector document: its complete source is
[`scripts/moonfall-record-032.py`](scripts/moonfall-record-032.py).
Its text, numbered fields and checkbox are generic examples, with no rulebook
or system-specific catalog. Screens demonstrate the lower dock, campaign
manager, transparent progress HUD, mind maps, nested/empty journal chapters,
typed references, PDF mapping and field rolls, and clock/clue/mind-map nodes.

The **68.5-second silent recording** uses the real English interface and has
English/Portuguese WebVTT captions and descriptive transcripts. It contains no
music, narration or audio track. Only the first second of browser startup was
trimmed. The poster is the real 0.3.2 tabletop screenshot, preserving the earlier
dragon poster and earlier recordings as historical files. No UI was generated,
composited, restyled, or replaced. Browser actions use native controls and window
handles; authored data was prepared with the application's normal models and
validated public project API in a fresh, isolated fixture.

Screenshots use lossless WebP, and decoded pixels were compared with the PNG
sources. `../images/tabletop-preview-032.jpg` archives the real tabletop capture
resized to 1200 × 676 and JPEG-encoded at quality 84 (277,604 bytes). Its original
bytes and SHA-256 are preserved; this former social preview is the only lossy
screenshot derivative in the capture set. Its previous URL,
`../images/gravewright-social-032.jpg`, now serves an unchanged copy of the dragon
artwork for compatibility. Current sharing uses `../images/gravewright-share-dragon.jpg`;
interface photographs remain in the gallery.
SHA-256 values, source
artwork hashes, dimensions and encoding details for every new asset are in
[`scripts/media-032-provenance.json`](scripts/media-032-provenance.json).
No operator `.env`, campaign, account, installed private package or personal file
was used. Database, media, caches, tools and temporary files stayed inside the
disposable installation-local capture directory; its server was terminated.

Original screenshot contributions, authored examples and the vector PDF follow
this site's GPL-3.0-only license. The application interface remains GPL-3.0-only
with the Gravewright Independent Module Permission, and its third-party notices
remain applicable. These captures do not relicense those components or systems.
Older 0.2.1/0.3.0 media and both original dragon images remain unchanged and are
identified as historical where still displayed.

### Português — capturas e gravação da 0.3.2

As novas capturas reais da **0.3.2 publicada**, no commit acima, usam a interface
em inglês e português brasileiro; os nomes e textos autorais ficam em inglês.
A campanha Moonfall é fictícia e reutiliza somente mapa, retratos e PDF de
tutorial originais já autorizados neste site. O novo PDF plano é vetorial,
original e genérico, com fonte reproduzível e hash registrados acima.

O vídeo tem **68,5 segundos**, interface em inglês, legendas e transcrições em
inglês/português, sem música, narração ou faixa de áudio. Apenas o primeiro
segundo de inicialização foi aparado. Interface, textos e estilos não foram
substituídos; os prints não são montagens. O pôster vem da mesa real da 0.3.2.
WebP sem perdas preserva os pixels; só a antiga prévia JPEG da mesa foi reduzida.
A prévia da mesa foi arquivada como `tabletop-preview-032.jpg`. Links compartilhados
usam sempre o dragão em `gravewright-share-dragon.jpg`; a antiga URL
`gravewright-social-032.jpg` entrega a mesma arte para compatibilidade.
Banco, mídia, módulos, caches e temporários eram novos e isolados na instalação,
sem configuração nem dados reais de operador; o servidor foi encerrado.
Os arquivos antigos e as duas imagens originais de dragão foram preservados.
