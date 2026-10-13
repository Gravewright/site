# Site do Gravewright

[English](README.md) · [Português (Brasil)](README.pt-BR.md)

Site de apresentação do Gravewright, um **VTT universal**, com páginas em inglês (`index.html`) e português brasileiro (`pt-br.html`). O download público é a **0.2.2 Alpha**. O site apresenta as ferramentas comuns da mesa: mapas, tokens, medição, dados, diários, preparação de campanhas e ambientação. O grupo escolhe extensões de sistemas compatíveis ou fichas PDF para seus jogos; as regras e automações vêm do sistema instalado. O GitHub Pages serve os arquivos gerados em `gravewright.com`; este repositório não inclui workflow de implantação.

| Produto disponível | Release | Detalhes |
| --- | --- | --- |
| Gravewright VTT | [0.2.2 Alpha](https://github.com/Gravewright/gravewright/releases/tag/v0.2.2) | Instalador Windows x64 e distribuição do código-fonte |
| DnD 5e SRD | [0.1.0 Alpha](https://github.com/Gravewright/dnd-srd-5e/releases/tag/v0.1.0) | Sistema independente opcional mostrado como exemplo: 2014/SRD 5.1 e 2024/SRD 5.2.1, fichas próprias, arraste do SRD e salvamento automático |
| Translator | [0.1.2](https://github.com/Gravewright/marketplace/releases/tag/gravewright.translator-v0.1.2) | Tradução da interface para português brasileiro e API de tradução para extensões |

A página principal apresenta primeiro o VTT universal e suas ferramentas comuns. As imagens da ficha e do compêndio DnD permanecem em um exemplo opcional de sistema, recolhido por padrão perto da seção de extensões. Fichas PDF e de sistemas são apresentadas como escolhas; a plataforma não exige um conjunto específico de regras.

Para usar o exemplo DnD, instale **DnD 5e SRD 0.1.0** e o complemento **Server Rules 0.1.0** correspondente pelo [Marketplace](https://github.com/Gravewright/marketplace) no VTT **0.2.1 ou superior**. Seus 20 compêndios contêm 2.535 entradas de coleções selecionadas do SRD licenciado; esse conteúdo está em inglês. Essas fichas, o salvamento automático e as regras pertencem ao sistema. O core do VTT permanece independente das regras dos sistemas.

## Abrir localmente

Use Node.js 22 ou superior. **Não há dependências npm para instalar.**

```sh
git clone https://github.com/Gravewright/site.git
cd site
npm run build
npm start
```

Abra **http://127.0.0.1:4173**. Pressione Ctrl+C para encerrar. Para outra porta local, use `PORT=4174 npm start`. O servidor escuta somente no computador local. Também é possível abrir o HTML diretamente; o servidor local é preferível para copiar comandos e carregar legendas de vídeo.

## Colocar suas imagens e vídeos

O [MEDIA.pt-BR.md](MEDIA.pt-BR.md) lista todos os nomes de arquivo, textos alternativos nos dois idiomas, sugestões de captura, dimensões, capas, legendas e transcrições.

1. Coloque os arquivos exatamente nos caminhos indicados. As capturas podem ter arquivos separados por idioma em `files.en` e `files.pt`, usando `file` como alternativa compartilhada.
2. Execute `npm run build` novamente e atualize a página.
3. Quando terminar de adicionar as mídias, rode `npm run check:media`.

Enquanto faltarem arquivos, o site mostra placeholders com o nome esperado. Não faz requisições para imagens ou vídeos inexistentes. Vídeos reais usam controles nativos, sem reprodução automática, com legendas por idioma e links de transcrição quando fornecidos. Revise os textos alternativos se a captura final mostrar algo diferente da descrição preparada.

## Editar o site

| Arquivo | Função |
| --- | --- |
| `content/site.mjs` | Textos em inglês/português, versão pública, links da release e comandos |
| `content/media.json` | Caminhos compartilhados/por idioma, dimensões, títulos, textos alternativos, sugestões de captura e duração do vídeo |
| `scripts/build.mjs` | Template compartilhado que gera os dois HTMLs |
| `styles.css` | Estilos do template e adaptações responsivas/de mídia |
| `script.js` | Menu móvel, troca de idioma mantendo a seção, botão de copiar e animações que respeitam movimento reduzido |
| `assets/icon.svg` | Ícone original do template, sem alterações |
| `scripts/serve.mjs` | Servidor local com suporte a intervalos de bytes para vídeos |
| `scripts/check.mjs` | Verificações de páginas geradas, arquivos por idioma, metadados e acessibilidade |

Edite os arquivos-fonte e gere novamente, em vez de alterar os HTMLs gerados. As duas páginas já contêm seus textos e funcionam sem JavaScript. A documentação aponta para o projeto Django atual, sem importar a wiki antiga. Não são usados fontes externas, rastreadores ou scripts de CDN.

Ao publicar uma versão do VTT, atualize `publicVersion`, os textos da release e as perguntas frequentes juntos e gere as páginas novamente. O link de download e a versão nos dados estruturados vêm de `publicVersion`; confira antes se o ZIP público está disponível. Os dois idiomas devem informar o mesmo estado da release e a necessidade do Translator para outros idiomas da interface.

## Verificações

```sh
npm test                 # gera e verifica páginas, links, IDs e estados das mídias
npm run check:media      # exige também todas as mídias planejadas
```

A verificação normal aceita placeholders; a completa exige todos os arquivos compartilhados e por idioma. As mídias usam capturas reais do VTT 0.2.1 e o Translator 0.1.2. A demonstração universal (`assets/videos/gravewright-universal-021-showcase.mp4`, 60 segundos, 1920 × 1080) destaca mapas, tokens, medição, diários e combate, com um breve exemplo opcional de ficha e compêndio do DnD 5e SRD 0.1.0. Há capturas da interface, legendas e transcrições descritivas nos dois idiomas. Os nomes das campanhas permanecem **Moonfall Vigil**, **The Wild Paths** e **Beyond the Mists** nas duas interfaces; a cena é **Moonfall Abbey**. `durationSeconds` nos metadados registra a duração da edição final.

As duas imagens do dragão foram preservadas: a capa ilustrada do vídeo e a captura de mesa fornecida anteriormente (`assets/images/table-overview.webp`). A captura aparece em uma galeria secundária expansível, com miniatura visível, separada das novas capturas da 0.2.1. A imagem social permanece como uma versão da capa ilustrada. O mapa Moonfall Abbey e o retrato de Seraphina Vale foram gerados para a nova demonstração. O PDF original de Seren Ashford permanece como fonte para o tutorial, em vez de aparecer na captura de ficha do site. Consulte as [fontes, prompts e hashes](assets/demo/README.md) e os [créditos das mídias](THIRD_PARTY_NOTICES.md). Depois de alterar os arquivos, confira reprodução, avanço do vídeo, legendas sincronizadas, textos alternativos e leitura no celular.

Licenciamento e atribuição do template estão em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## SEO

Os metadados de SEO são gerados por `scripts/seo.mjs`: títulos e descrições por idioma, URLs canônicas, versões alternativas, Open Graph, cartões sociais com imagem grande e JSON-LD de WebSite/WebPage/SoftwareApplication. O compartilhamento usa uma versão JPEG leve da capa (`assets/images/gravewright-social-v3.jpg`, 1200 × 676, cerca de 258 KB). Caminho e dimensões ficam em `scripts/seo.mjs`; o PNG original continua como capa do vídeo. As verificações exigem JPEG e tamanho abaixo de 300 KB. Use um novo nome de arquivo ao trocar a imagem social para evitar caches antigos da imagem. O `sitemap.xml` lista as duas páginas públicas e o `robots.txt` aponta para ele.

Referências: [protocolo Open Graph](https://ogp.me/) e [dados estruturados de software do Google](https://developers.google.com/search/docs/appearance/structured-data/software-app).
