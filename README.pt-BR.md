# Site do Gravewright

[English](README.md) · [Português (Brasil)](README.pt-BR.md)

Site de apresentação do Gravewright, um **VTT universal**, com páginas em inglês (`index.html`) e português brasileiro (`pt-br.html`). O download público é a **0.3.0 Alpha**. A versão 0.3.0 destaca o Map Builder, os Objetos Inteligentes com nodes visuais e a importação/exportação Universal VTT, junto das ferramentas comuns da mesa: tokens, medição, dados, diários e ambientação. O grupo escolhe extensões de sistemas compatíveis ou fichas PDF para seus jogos; as regras e automações vêm do sistema instalado. O GitHub Pages serve os arquivos gerados em `gravewright.com`; este repositório não inclui workflow de implantação.

| Produto disponível | Release | Detalhes |
| --- | --- | --- |
| Gravewright VTT | [0.3.0 Alpha](https://github.com/Gravewright/gravewright/releases/tag/v0.3.0) | ZIP portátil com instaladores Windows, Linux e macOS e código-fonte |
| DnD 5e SRD | [0.1.2](https://github.com/Gravewright/dnd-srd-5e/releases/tag/v0.1.2) | Um pacote de sistema opcional: 2014/SRD 5.1 e 2024/SRD 5.2.1, fichas próprias, arraste do SRD, salvamento automático e automações de combate |
| Savage Worlds Compatibility Package for Gravewright | [0.1.2](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright/releases/tag/v0.1.2) | Um pacote de sistema com fichas gratuitas de personagens/NPCs, modelos vazios de itens, automações de SWADE e três estilos de baralho de ação; sem compêndios nem textos do livro |
| Translator | [0.1.2](https://github.com/Gravewright/marketplace/releases/tag/gravewright.translator-v0.1.2) | Tradução da interface para português brasileiro e API de tradução para extensões |

A página principal apresenta primeiro o VTT universal e suas ferramentas comuns. As imagens da ficha e do compêndio DnD permanecem em um exemplo opcional de sistema, recolhido por padrão perto da seção de extensões. Fichas PDF e de sistemas são apresentadas como escolhas; a plataforma não exige um conjunto específico de regras.

O [pacote de compatibilidade Savage Worlds](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright) aparece junto do exemplo DnD, com links do repositório e da versão **0.1.2** nos dois idiomas do site. Instale o pacote completo em **Sistemas** e selecione-o para a mesa. Fichas, modelos, arquivos e automações ficam juntos no pacote do sistema; o mestre avança o combate pela mesa. Os usuários criam o conteúdo de suas campanhas; inglês está disponível por padrão, e português/espanhol usam o módulo oficial Translator.

O **DnD 5e SRD 0.1.2** também é um único pacote instalado em **Sistemas** pelo [Marketplace](https://github.com/Gravewright/marketplace). Fichas, compêndios e automações ficam juntos; o mestre avança o combate pela mesa. Seus 20 compêndios contêm 2.535 entradas de coleções selecionadas do SRD licenciado, em inglês. Os guias dos [sistemas DnD](https://github.com/Gravewright/dnd-srd-5e) e [Savage Worlds](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright) ainda documentam a instalação no VTT **0.2.3**. Preserve essa referência histórica e confira os requisitos de compatibilidade de cada pacote; ela não é uma orientação para rebaixar o download atual do core, **0.3.0**.

## Destaque do Map Builder 0.3.0

A seção `#map-builder` aparece logo após a apresentação e é o destino do botão secundário e do primeiro item de navegação. Ela mostra a construção do mapa, as conexões entre nodes de Objetos Inteligentes e a geração de uma cena exclusiva do mestre. Atualizar a cena vinculada e ativá-la para os jogadores são ações separadas. Os links apontam para os guias de [Map Builder](https://github.com/Gravewright/gravewright/blob/main/docs/pt-BR/map-builder.md) e [Universal VTT](https://github.com/Gravewright/gravewright/blob/main/docs/pt-BR/universal-vtt.md).

Esse destaque usa **uma única captura real da 0.3.0 com a interface em inglês e nodes visíveis**, compartilhada entre as duas páginas. O título, a legenda e o texto alternativo são traduzidos; a interface dentro da imagem não é traduzida. A mesma imagem abre em tamanho completo pelo link do destaque. Registre o arquivo compartilhado em `content/media.json`, com dimensões reais e descrições que correspondam ao enquadramento. As capturas, os vídeos e as artes anteriores mantêm seus arquivos e suas versões históricas.

O download do core é o mesmo ZIP para os três sistemas: `Install Windows.bat`, `Install Linux.sh` e `Install macOS.command`. Os três guias de Runner vêm de `runnerGuides` nos textos por idioma.

## Wiki do produto e documentação para devs

O site inclui a wiki de produto em [`wiki/pt-BR/index.html`](wiki/pt-BR/index.html), a referência completa para desenvolvedores em [`docs/pt-BR/index.html`](docs/pt-BR/index.html) e os [guias práticos de IA](docs/pt-BR/ai.html). Cada página possui uma versão em inglês sob `en/`. A página inicial apresenta os dois públicos. Os artigos são gerados integralmente no build, com navegação por assunto, índice de títulos, fontes, troca de idioma, leitura relacionada e código/prompts copiáveis. A busca local pesquisa nas duas áreas e ignora acentos, sem chamadas a APIs externas.

Os procedimentos do produto ficam em `content/wiki.mjs`; os fluxos de IA, em `content/ai-guides.mjs`. `content/wiki-media.json` associa capturas reais da aplicação aos artigos relevantes, com legenda, texto alternativo, versão e procedência. As miniaturas abrem a imagem completa. As capturas podem usar a interface em inglês com legendas em português; as legendas identificam o idioma da interface. Imagens históricas mantêm a versão original. Leia a [procedência das capturas](assets/wiki/README.md) antes de substituí-las.

O Markdown técnico completo é uma cópia versionada dos guias públicos do projeto, sem depender do GitHub durante a leitura. Para atualizá-lo a partir de um checkout limpo, execute na pasta do site e depois revise o conteúdo e gere novamente:

```sh
node scripts/sync-project-docs.mjs --source /caminho/para/gravewright
npm test
```

`content/reference/catalog.json` registra a revisão e a versão de origem. Os links de fonte apontam para essa revisão. `scripts/build-knowledge.mjs` renderiza a cópia com `scripts/markdown.mjs`, resolve links entre guias para os artigos locais e gera `knowledge-search.json`, o manifesto e o sitemap completo. Edite o Markdown no projeto principal primeiro, mantenha inglês e português alinhados e sincronize novamente. Revise os guias quando a versão pública mudar; a versão da cópia deve corresponder a `publicVersion`.

Os bytes originais da cópia são preservados. Durante a renderização, `publicationCopy` alinha a redação histórica de empacotamento com a decisão atual do `AGENTS.md`: cada novo sistema de RPG é um único pacote instalável com interface, regras, recursos e traduções. Também atualiza a introdução anterior à publicação do Map Builder para descrever a revisão documentada. Revise essas adaptações editoriais explícitas ao sincronizar guias mais novos; assinaturas de APIs e avisos legais exatos são preservados.

Os exemplos de IA explicam como fornecer contexto do repositório, manter sistemas em um único pacote, usar APIs públicas, proteger dados locais e validar o resultado. Os prompts são textos para o assistente do desenvolvedor; o site não envia dados do projeto para um provedor de IA nem promete que código gerado funciona.

## Exemplos executáveis para desenvolvedores

Comece por [Exemplos completos por kind](docs/pt-BR/examples-index.html). O catálogo tem 29 artigos bilíngues: quatro variantes completas de pacote de extensão, as 13 superfícies de montagem do SDK, contratos de busca/imagens/compêndios, os quatro kinds de Objetos Inteligentes, os dois kinds de conexão e um grafo para cada um dos 42 tipos de nó. Cada exemplo traz pré-requisitos, código completo, resultado esperado, erros, validação e um prompt contextual de IA. Os exemplos usam os contratos documentados da 0.3.0; não inventam `kind` na raiz dos manifestos nem confundem packs de sistema instalado com catálogos nativos locais.

`content/examples*.mjs` contém os fontes autorais. `scripts/build-examples.mjs` gera os quatro pacotes, os fontes e ZIPs das superfícies e o pacote de Blueprints com sua licença. O manifesto fica diretamente na raiz dos ZIPs. **Instalar de ZIP** permite testar código revisado em host descartável; publicação no Marketplace usa registros assinados. Não há chaves privadas nem credenciais nos downloads. O exemplo de idioma é propositalmente parcial. O exemplo Django exige ativação confiável explícita e não é complemento de sistema de RPG. As capturas reais e sua procedência estão em [assets/examples/previews](assets/examples/previews/README.md).

`npm test` funciona num checkout independente do site. Para executar também os testes opcionais de superfícies contra o runtime real do host:

```sh
GRAVEWRIGHT_SOURCE=/caminho/para/gravewright node --test scripts/*.test.mjs
```

No PowerShell, defina `$env:GRAVEWRIGHT_SOURCE='C:/caminho/para/gravewright'` antes do mesmo `node --test`. Sem caminho explícito, os casos de integração com o host são pulados com explicação; testes de fonte/sintaxe, comportamento dos pacotes e Markdown continuam. A integração usa ModuleRuntime/API de domínio reais com DOM/transporte simulados. Ela complementa a instalação nativa e a verificação em navegador descritas em cada guia.

O pacote de Blueprints inclui seu próprio verificador; consulte o README baixado e execute `uv run --locked python data/blueprint-examples/check-examples.py --host .` na raiz de um host descartável após extrair ali. Ele ignora `.env`/apps do operador, isola armazenamento e proíbe consultas ao banco. Valida todos os tipos de nó e prevê ações; propriedade dos alvos, permissões de GM/jogador e efeitos ao vivo ainda exigem o fluxo documentado de Test behavior/playtest.

## Tutoriais de implementação e mapa de capacidades

O [catálogo de implementação](docs/pt-BR/tutorial-index.html) acrescenta **29 artigos bilíngues** e **22 novos projetos-fonte em ZIP**, além dos exemplos por kind existentes. Comece por [seu primeiro módulo](docs/pt-BR/tutorial-first-module.html), uma [ação na ficha existente](docs/pt-BR/tutorial-sheet-module.html), um [módulo de diário](docs/pt-BR/tutorial-journal-module.html) ou pelo [sistema original completo](docs/pt-BR/tutorial-complete-system.html). Cada projeto traz arquivos, instalação e ativação, campos de entrada, ações executáveis, resultados observáveis, tratamento de falhas e prompt de adaptação com IA. Os guias cobrem atores, tokens, cenas, itens, combate, cartas, áudio, chat/dados, missões, tabelas de rolagem, compêndios, arquivos, armazenamento, tradução, personalização e integração confiável de servidor.

O [mapa de capacidades de extensão](docs/pt-BR/tutorial-capabilities.html) liga **139 métodos públicos de domínio**, **17 operações do SDK original** e **13 superfícies de montagem** a implementações concretas. Também identifica ciclo de vida, eventos, recursos, armazenamento, modais e tradução. O Map Builder liga os **quatro kinds de Objeto Inteligente**, os dois kinds de conexão e os **42 tipos de nó** aos seus grafos completos. Essas quantidades descrevem o contrato 0.3.0 e o catálogo autoral versionados, não uma contagem de testes aprovados nem promessa de suportar combinações arbitrárias. O mapa distingue packs mutáveis da campanha, coleções de sistema instalado e catálogos locais do operador.

`content/tutorials.mjs` agrega os guias e pacotes autorais de `content/tutorial-*.mjs`. `scripts/build-examples.mjs` gera os projetos em `assets/tutorials/<project-id>/`, com o manifesto final na raiz de cada ZIP. O sistema completo combina fichas funcionais de ator/token, tipos originais de item/magia, iniciativa armazenada e três packs em um único sistema instalável. Idiomas são ativados globalmente e escolhidos por conta; módulos de navegador são ativados por campanha; apps Django exigem ativação explícita pelo dono. O guia de distribuição inclui assinador local e autoteste sintético; não cria chaves reais nem publica releases. Confira [licenças e procedência](THIRD_PARTY_NOTICES.md) antes de reutilizar um projeto.

O snapshot dos contratos está versionado em `content/extension-contracts.json`, fixado no **Gravewright 0.3.0**, revisão **23ea61b8efb566cad0e3359489b0dad45e214906**. `npm run build` e o `npm test` normal usam fontes locais e esse snapshot; não procuram checkout pai do host, não buscam SDK remoto nem exigem repositório vizinho. Informar `GRAVEWRIGHT_SOURCE` ativa somente as verificações opcionais dependentes do host.

### Atualizar explicitamente o snapshot dos contratos

Use checkout separado e escolhido explicitamente na revisão publicada desejada. Revise as mudanças de API pública e preserve a compatibilidade pedida. Em POSIX, defina:

```sh
export GRAVEWRIGHT_SOURCE=/caminho/para/gravewright
export GRAVEWRIGHT_REVISION=23ea61b8efb566cad0e3359489b0dad45e214906
```

No PowerShell, defina as mesmas variáveis apenas no processo:

```powershell
$env:GRAVEWRIGHT_SOURCE='C:/caminho/para/gravewright'
$env:GRAVEWRIGHT_REVISION='23ea61b8efb566cad0e3359489b0dad45e214906'
```

Salve o JavaScript abaixo como `data/site-maintenance/update-extension-contracts.mjs` no checkout do host escolhido explicitamente, fora da pasta publicada do site. Troque explicitamente a revisão ao documentar outra release. Ele lê bytes confirmados no Git, evitando atribuir edições pendentes a um commit; grava somente o snapshot do site e não altera configuração global do Git:

```javascript
import {execFileSync} from "node:child_process";
import {writeFile} from "node:fs/promises";
import {resolve} from "node:path";
if (!process.env.GRAVEWRIGHT_SOURCE || !process.env.GRAVEWRIGHT_REVISION) {
  throw new Error("Set GRAVEWRIGHT_SOURCE and GRAVEWRIGHT_REVISION explicitly.");
}
const source = resolve(process.env.GRAVEWRIGHT_SOURCE);
const git = (...args) => execFileSync("git", ["-c", "safe.directory=" + source.replaceAll("\\", "/"), "-C", source, ...args], {encoding:"utf8", maxBuffer:8*1024*1024});
const revision = git("rev-parse", "--verify", process.env.GRAVEWRIGHT_REVISION + "^{commit}").trim();
const committed = path => git("show", revision + ":" + path);
const hostVersion = committed("pyproject.toml").match(/^version\s*=\s*"([^"]+)"/m)?.[1];
if (!hostVersion) throw new Error("The committed host project has no version.");
const registry = JSON.parse(committed("gravewright/modules/contracts/registry.json"));
const frontend = JSON.parse(committed("gravewright/modules/contracts/frontend.json"));
const snapshot = {hostVersion, sourceRevision:revision, frontend, operations:registry.operations, surfaces:registry.domains, events:registry.events};
await writeFile("content/extension-contracts.json", JSON.stringify(snapshot, null, 2) + "\n");
console.log("Updated contract snapshot from " + revision + " (" + hostVersion + ")");
```

Execute o utilitário salvo a partir da **raiz do repositório do site**. Em POSIX:

```sh
node '/caminho/para/gravewright/data/site-maintenance/update-extension-contracts.mjs'
```

No PowerShell:

```powershell
node 'C:/caminho/para/gravewright/data/site-maintenance/update-extension-contracts.mjs'
```

Revise o diff do JSON e as conveniências de `domain-api.js`; atualize receitas, links de capacidades e testes quando assinaturas ou permissões mudarem. Sincronize a documentação técnica de um checkout cujo HEAD seja essa mesma revisão usando `scripts/sync-project-docs.mjs --source <caminho>`. Mantenha `content/reference/catalog.json`, procedência dos contratos e versão pública documentada alinhados. Depois rode `npm test` e execute explicitamente integração com host, testes nativos e de navegador com dados descartáveis. Build estático aprovado não comprova instalação, persistência, autorização ou aparência no VTT.

## Comandos de preview

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
| `content/wiki.mjs`, `content/ai-guides.mjs` | Procedimentos do produto e guias de desenvolvimento com IA nos dois idiomas |
| `content/reference/` | Cópia completa da referência técnica e catálogo com revisão de origem |
| `content/tutorials.mjs`, `content/tutorial-*.mjs` | Guias bilíngues por tarefa, fontes completos dos projetos e receitas executáveis |
| `content/extension-contracts.json`, `content/tutorial-capabilities.mjs` | Snapshot do contrato atualizado explicitamente e mapa de implementações |
| `scripts/build-examples.mjs`, `assets/tutorials/` | Projetos gerados, fontes para revisão dos ZIPs e utilitário local de distribuição |
| `content/wiki-media.json`, `assets/wiki/` | Associação entre capturas e artigos, imagens reais e procedência |
| `scripts/build-knowledge.mjs`, `scripts/markdown.mjs` | Páginas estáticas de conhecimento e renderização de Markdown |
| `knowledge.css`, `knowledge.js` | Layouts da documentação e busca local no texto completo |
| `content/media.json` | Caminhos compartilhados/por idioma, dimensões, títulos, textos alternativos, sugestões de captura e duração do vídeo |
| `scripts/build.mjs` | Template compartilhado que gera os dois HTMLs |
| `styles.css` | Estilos do template e adaptações responsivas/de mídia |
| `script.js` | Menu móvel, troca de idioma mantendo a seção, botão de copiar e animações que respeitam movimento reduzido |
| `assets/icon.svg` | Ícone original do template, sem alterações |
| `scripts/serve.mjs` | Servidor local com suporte a intervalos de bytes para vídeos |
| `scripts/check.mjs` | Verificações de páginas geradas, arquivos por idioma, metadados e acessibilidade |

Edite os arquivos-fonte e gere novamente, em vez de alterar os HTMLs gerados. Todas as páginas já contêm seus textos e funcionam sem JavaScript. A referência acompanha o projeto Django atual e informa a revisão de origem. Não são usados fontes externas, rastreadores ou scripts de CDN.

Ao publicar uma versão do VTT, atualize `publicVersion`, os textos da release e as perguntas frequentes juntos e gere as páginas novamente. O link de download e a versão nos dados estruturados vêm de `publicVersion`; confira antes se o ZIP público está disponível. Os dois idiomas devem informar o mesmo estado da release e a necessidade do Translator para outros idiomas da interface.

## Verificações

```sh
npm test                 # testa o renderer, gera e verifica todas as páginas/links/mídias
npm run check:media      # exige também todas as mídias planejadas
```

A verificação normal aceita placeholders; a completa exige todos os arquivos compartilhados e por idioma. As mídias anteriores da mesa usam capturas reais do VTT 0.2.1 e o Translator 0.1.2; o novo destaque do Map Builder usa a captura compartilhada da 0.3.0. A demonstração universal (`assets/videos/gravewright-universal-021-showcase.mp4`, 60 segundos, 1920 × 1080) destaca mapas, tokens, medição, diários e combate, com um breve exemplo opcional de ficha e compêndio do DnD 5e SRD 0.1.0. Há capturas da interface, legendas e transcrições descritivas nos dois idiomas. Os nomes das campanhas permanecem **Moonfall Vigil**, **The Wild Paths** e **Beyond the Mists** nas duas interfaces; a cena é **Moonfall Abbey**. `durationSeconds` nos metadados registra a duração da edição final.

As duas imagens do dragão foram preservadas: a capa ilustrada do vídeo e a captura de mesa fornecida anteriormente (`assets/images/table-overview.webp`). A captura aparece em uma galeria secundária expansível, com miniatura visível, separada das novas capturas da 0.2.1. A imagem social permanece como uma versão da capa ilustrada. O mapa Moonfall Abbey e o retrato de Seraphina Vale foram gerados para a nova demonstração. O PDF original de Seren Ashford permanece como fonte para o tutorial, em vez de aparecer na captura de ficha do site. Consulte as [fontes, prompts e hashes](assets/demo/README.md) e os [créditos das mídias](THIRD_PARTY_NOTICES.md). Depois de alterar os arquivos, confira reprodução, avanço do vídeo, legendas sincronizadas, textos alternativos e leitura no celular.

Licenciamento e atribuição do template estão em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## SEO

Os metadados de SEO são gerados por `scripts/seo.mjs` e `scripts/build-knowledge.mjs`: títulos e descrições por idioma, URLs canônicas, versões alternativas, Open Graph, cartões sociais com imagem grande e dados estruturados do produto, artigos e coleções. O compartilhamento usa uma versão JPEG leve da capa (`assets/images/gravewright-social-v3.jpg`, 1200 × 676, cerca de 258 KB). Caminho e dimensões ficam em `scripts/seo.mjs`; o PNG original continua como capa do vídeo. As verificações exigem JPEG e tamanho abaixo de 300 KB. Use um novo nome de arquivo ao trocar a imagem social para evitar caches antigos da imagem. O `sitemap.xml` lista todas as páginas públicas e o `robots.txt` aponta para ele.

Referências: [protocolo Open Graph](https://ogp.me/) e [dados estruturados de software do Google](https://developers.google.com/search/docs/appearance/structured-data/software-app).
