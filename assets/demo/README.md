# Demo media sources / Fontes das mídias de demonstração

The product screenshots and video show the real **Gravewright VTT 0.2.1** interface and **Translator 0.1.2**. Gravewright is a universal VTT: the main walkthrough presents maps, tokens, measurement, journals and combat. The published **DnD 5e SRD 0.1.0** system appears briefly as an optional extension example; its sheet and compendium screenshots are preserved in a collapsed example near the bottom of the page. They were captured in a browser using an isolated local database, fictional campaigns and demonstration accounts. Original map and portrait assets were loaded into the application before recording; the interface itself was not generated.

| Media | English file | Portuguese file |
| --- | --- | --- |
| Tabletop | `../images/table-overview-universal-021.webp` | `../images/table-overview-universal-021.pt-BR.webp` |
| Optional DnD sheet example | `../images/dnd-character-sheet-010.webp` | `../images/dnd-character-sheet-010.pt-BR.webp` |
| Campaign dashboard | `../images/campaign-dashboard-universal-021.webp` | `../images/campaign-dashboard-universal-021.pt-BR.webp` |
| Optional SRD compendium example | `../images/srd-compendium-universal-010.webp` | `../images/srd-compendium-universal-010.pt-BR.webp` |
| Preserved Dragon’s Legacy scene | `../images/table-overview.webp` | Shared capture |

The recorded universal walkthrough is `../videos/gravewright-universal-021-showcase.mp4`, 60 seconds at 1920 × 1080. Its English/Portuguese captions and descriptive transcripts use the same basename with `.en.vtt`, `.pt-BR.vtt`, `.en.txt` and `.pt-BR.txt`. Exact capture dimensions and the final video duration are recorded in `content/media.json` at the site root. The campaign names are **Moonfall Vigil**, **The Wild Paths** and **Beyond the Mists** in both interfaces; the map/scene name is **Moonfall Abbey**. Proper names remain in English when interface controls are translated. The preserved illustrated poster is `../images/table-session-cover.png`; the social preview is its `../images/gravewright-social-v3.jpg` derivative.

The earlier supplied Dragon’s Legacy tabletop capture (`../images/table-overview.webp`, 1911 × 926) is also preserved, with a visible thumbnail and an expandable full image. It is distinct from the new 0.2.1 captures and the illustrated dragon poster. No current application version is inferred from that earlier image.

As novas capturas e o vídeo mostram o VTT universal real, com base isolada e dados fictícios, destacando mapa, tokens, medição, diários e combate. O DnD 5e SRD é um exemplo opcional de extensão, com breve participação no vídeo e imagens da ficha e compêndio em uma seção recolhida por padrão. Há capturas de interface em inglês e português; os nomes Moonfall Vigil, The Wild Paths, Beyond the Mists e Moonfall Abbey permanecem em inglês nos dois idiomas. O mapa e os retratos foram inseridos no VTT antes da gravação. Dimensões, caminhos e duração final ficam em `content/media.json`. Foram preservadas as duas imagens do dragão: a capa ilustrada e a captura de mesa anterior, exibida em galeria secundária sem atribuí-la à versão atual.

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
