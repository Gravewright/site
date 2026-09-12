<!-- Generated from content/media.json by scripts/build-media-guide.mjs. -->

# Imagens e vídeos do site

[English](MEDIA.md) · [Português (Brasil)](MEDIA.pt-BR.md)

Todos os caminhos abaixo são relativos a `/mnt/dados/grave-site`. As pastas `assets/images/` e `assets/videos/` já existem. Você fornecerá **3 imagens, 1 vídeo, 1 capa, 2 legendas e 2 transcrições**.

**Para substituir:** copie os arquivos com os nomes exatos, execute `npm run build` e atualize a página. Não é necessário editar HTML. O build mostra a mídia quando o arquivo existe e mantém o placeholder enquanto estiver ausente. Para trocar nomes ou textos alternativos, edite `content/media.json` e gere novamente.

**Importante:** os textos alternativos abaixo já estão preparados, mas precisam corresponder à mídia final. Revise-os se mudar o enquadramento ou a demonstração. Use capturas da versão atual, não da interface legacy.

## Gravewright à mesa

- Arquivo: `assets/images/table-overview.webp`
- Dimensões sugeridas: **1911 × 926**
- Descrição / alt em inglês: Gravewright tabletop showing a lava-filled dungeon, a large dragon token, character tokens, lighting and the tabletop toolbars.
- Descrição / alt em português: Mesa do Gravewright com uma masmorra cercada por lava, um grande token de dragão, tokens de personagens, iluminação e barras de ferramentas.


Capture a mesa da Alpha 0.1.0 com uma cena preparada, tokens e iluminação visível. Use conteúdo que possa compartilhar.

## The Dragon’s Legacy · Demonstração de batalha

- Arquivo: `assets/videos/table-session.mp4`
- Dimensões sugeridas: **1920 × 1080**
- Descrição / alt em inglês: Gravewright battle showcase with a lava-filled dungeon, a dragon token, lighting and fog controls, and character movement, accompanied by orchestral music.
- Descrição / alt em português: Demonstração do Gravewright com masmorra de lava, token de dragão, controles de iluminação e névoa e movimento de personagens, acompanhada por música orquestral.


Edição de batalha de 51,1 segundos da gravação fornecida. A capa foi capturada em 00:05. Créditos da música estão no encerramento, na transcrição e nos avisos de terceiros.

- Capa do vídeo: `assets/images/table-session-cover.png` (1920 × 1080)
- Legendas em inglês: `assets/videos/table-session.en.vtt`
- Legendas em português: `assets/videos/table-session.pt-BR.vtt`
- Transcrição em inglês: `assets/videos/table-session.en.txt`
- Transcrição em português: `assets/videos/table-session.pt-BR.txt`


O vídeo usa `aria-label` e um título visível, pois `<video>` não aceita `alt` como uma imagem. Use a descrição acima para orientar a transcrição. A capa é exibida pelo player e compartilha o contexto acessível dele.

## Seu personagem perto da história

- Arquivo: `assets/images/pdf-character-sheet.webp`
- Dimensões sugeridas: **1600 × 1000**
- Descrição / alt em inglês: The original Seren Ashford PDF character sheet open in Gravewright, with editable health, energy, defense and attribute fields, abilities, equipment and notes.
- Descrição / alt em português: Ficha PDF original de Seren Ashford aberta no Gravewright, com campos editáveis de vida, energia, defesa e atributos, habilidades, equipamentos e notas.


Mostre uma ficha PDF que tenha permissão para redistribuir, com campos mapeados e o token correspondente visível.

## Um lugar para suas campanhas

- Arquivo: `assets/images/campaign-dashboard.webp`
- Dimensões sugeridas: **1600 × 1000**
- Descrição / alt em inglês: Gravewright campaign dashboard with The Verdant Vigil, The Drowned Crown and Ashfall Citadel, illustrated covers, participant icons and a control to create a campaign.
- Descrição / alt em português: Painel do Gravewright com The Verdant Vigil, The Drowned Crown e Ashfall Citadel, capas ilustradas, ícones de participantes e controle para criar uma campanha.


Capture o painel da Alpha com campanhas fictícias, sem dados pessoais ou códigos de convite ativos.

## Formatos e acessibilidade

- Imagens e capas: WebP. Mantenha textos legíveis, proporção consistente e tamanho de arquivo razoável (idealmente até cerca de 600 KB por captura, sem prejudicar a leitura).
- Vídeos: MP4 com H.264 e, se houver áudio, AAC; 1080p é suficiente. Use `faststart` ao exportar. O player não reproduz automaticamente e carrega o vídeo somente quando solicitado.
- Legendas: WebVTT em UTF-8, nos dois idiomas, sincronizadas com a gravação final. Inclua falas e sons relevantes.
- Transcrições: texto UTF-8 nos dois idiomas, com falas e descrição das ações visuais que são necessárias para compreender a demonstração.
- Se não houver fala, descreva as ações nos textos e use legendas explicativas. Não deixe as legendas preenchidas com exemplos fictícios.

### Estrutura de uma legenda

Exemplo de formato, não uma legenda pronta. Substitua texto e tempos pela gravação real:

```vtt
WEBVTT

00:00:00.000 --> 00:00:04.000
[Descreva a ação ou transcreva a fala deste trecho.]
```

## Conferência final das mídias

```sh
npm run build
npm run check:media
```

A segunda verificação retorna erro enquanto faltar algum arquivo planejado. Depois, abra as duas páginas, reproduza os vídeos, teste avançar no tempo, confira legendas/transcrições e verifique a leitura no celular. O comando confere presença e estrutura básica; a revisão do conteúdo e da sincronização é manual.
