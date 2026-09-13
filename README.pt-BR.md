# Site do Gravewright

[English](README.md) · [Português (Brasil)](README.pt-BR.md)

Site estático e local da versão **0.1.1**, baseado no template `repository-site` fornecido. A página principal é em inglês (`index.html`), com uma versão completa em português brasileiro (`pt-br.html`). Não inclui workflow de implantação. O arquivo `CNAME` registra o domínio previsto, `gravewright.com`.

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

1. Coloque os arquivos exatamente nos caminhos indicados.
2. Execute `npm run build` novamente e atualize a página.
3. Quando terminar de adicionar as mídias, rode `npm run check:media`.

Enquanto faltarem arquivos, o site mostra placeholders com o nome esperado. Não faz requisições para imagens ou vídeos inexistentes. Vídeos reais usam controles nativos, sem reprodução automática, com legendas por idioma e links de transcrição quando fornecidos. Revise os textos alternativos se a captura final mostrar algo diferente da descrição preparada.

## Editar o site

| Arquivo | Função |
| --- | --- |
| `content/site.mjs` | Textos em inglês/português, links da release e comandos |
| `content/media.json` | Caminhos, dimensões, títulos, textos alternativos e sugestões de captura |
| `scripts/build.mjs` | Template compartilhado que gera os dois HTMLs |
| `styles.css` | Estilos do template e adaptações responsivas/de mídia |
| `script.js` | Menu móvel, troca de idioma mantendo a seção, botão de copiar e animações que respeitam movimento reduzido |
| `assets/icon.svg` | Ícone original do template, sem alterações |
| `scripts/serve.mjs` | Servidor local com suporte a intervalos de bytes para vídeos |

Edite os arquivos-fonte e gere novamente, em vez de alterar os HTMLs gerados. As duas páginas já contêm seus textos e funcionam sem JavaScript. A documentação aponta para o projeto Django atual, sem importar a wiki antiga. Não são usados fontes externas, rastreadores ou scripts de CDN.

## Verificações

```sh
npm test                 # gera e verifica páginas, links, IDs e estados das mídias
npm run check:media      # exige também todas as mídias planejadas
```

A verificação normal aceita placeholders. Todos os espaços de mídia estão preenchidos, incluindo novas capturas de uma ficha PDF original e de um painel com campanhas fictícias. A verificação completa confirma a presença dos arquivos necessários. Consulte as [fontes da demonstração](assets/demo/README.md). Depois de adicionar os arquivos, confira os vídeos, legendas sincronizadas, textos alternativos e reprodução no navegador.

Licenciamento e atribuição do template estão em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## SEO

Os metadados de SEO são gerados por `scripts/seo.mjs`: títulos e descrições por idioma, URLs canônicas, versões alternativas, Open Graph, cartões sociais com imagem grande e JSON-LD de WebSite/WebPage/SoftwareApplication. O compartilhamento usa uma versão JPEG leve da capa (`assets/images/gravewright-social-v3.jpg`, 1200 × 676, cerca de 258 KB). Caminho e dimensões ficam em `scripts/seo.mjs`; o PNG original continua como capa do vídeo. As verificações exigem JPEG e tamanho abaixo de 300 KB. Use um novo nome de arquivo ao trocar a imagem social para evitar caches antigos da imagem. O `sitemap.xml` lista as duas páginas públicas e o `robots.txt` aponta para ele.

Referências: [protocolo Open Graph](https://ogp.me/) e [dados estruturados de software do Google](https://developers.google.com/search/docs/appearance/structured-data/software-app).
