# Site do Gravewright

[English](README.md) · [Português (Brasil)](README.pt-BR.md)

Site de apresentação do Gravewright, um **VTT universal**, com páginas em inglês (`index.html`) e português brasileiro (`pt-br.html`). O download público é a **0.3.3 Alpha**. A versão acrescenta públicos individuais por cena, mapas vazios, ponteiros compartilhados e atalhos configuráveis, tokens mais legíveis, produtividade no Builder e controle de shaders por Objetos Inteligentes. Preparação de campanha, relógios, pistas, mapas mentais, mapeamento PDF e fluxos Universal VTT continuam disponíveis das versões anteriores. O grupo escolhe pacotes de sistemas compatíveis ou fichas PDF; as regras pertencem ao sistema instalado. O GitHub Pages serve os arquivos gerados em `gravewright.com`; este repositório não inclui workflow de implantação.

| Produto disponível | Release | Detalhes |
| --- | --- | --- |
| Gravewright VTT | [0.3.3 Alpha](https://github.com/Gravewright/gravewright/releases/tag/v0.3.3) | ZIP portátil com instaladores Windows, Linux e macOS e código-fonte |
| DnD 5e SRD | [0.1.2](https://github.com/Gravewright/dnd-srd-5e/releases/tag/v0.1.2) | Um pacote de sistema opcional: 2014/SRD 5.1 e 2024/SRD 5.2.1, fichas próprias, arraste do SRD, salvamento automático e automações de combate |
| Savage Worlds Compatibility Package for Gravewright | [0.1.2](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright/releases/tag/v0.1.2) | Um pacote de sistema com fichas gratuitas de personagens/NPCs, modelos vazios de itens, automações de SWADE e três estilos de baralho de ação; sem compêndios nem textos do livro |
| Translator | [0.1.4](https://github.com/Gravewright/marketplace/releases/tag/gravewright.translator-v0.1.4) | Catálogos da interface em inglês, português brasileiro e espanhol, além de API de tradução para extensões |

A página principal apresenta primeiro o VTT universal e suas ferramentas comuns. As imagens da ficha e do compêndio DnD permanecem em um exemplo opcional de sistema, recolhido por padrão perto da seção de extensões. Fichas PDF e de sistemas são apresentadas como escolhas; a plataforma não exige um conjunto específico de regras.

O [pacote de compatibilidade Savage Worlds](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright) aparece junto do exemplo DnD, com links do repositório e da versão **0.1.2** nos dois idiomas do site. Instale o pacote completo em **Sistemas** e selecione-o para a mesa. Fichas, modelos, arquivos e automações ficam juntos no pacote do sistema; o mestre avança o combate pela mesa. Os usuários criam o conteúdo de suas campanhas; inglês está disponível por padrão, e português/espanhol usam o módulo oficial Translator.

O **DnD 5e SRD 0.1.2** também é um único pacote instalado em **Sistemas** pelo [Marketplace](https://github.com/Gravewright/marketplace). Fichas, compêndios e automações ficam juntos; o mestre avança o combate pela mesa. Seus 20 compêndios contêm 2.535 entradas de coleções selecionadas do SRD licenciado, em inglês. Os guias dos [sistemas DnD](https://github.com/Gravewright/dnd-srd-5e) e [Savage Worlds](https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright) ainda documentam a instalação no VTT **0.2.3**. Preserve essa referência histórica e confira os requisitos de compatibilidade de cada pacote; ela não é uma orientação para rebaixar o download atual do core, **0.3.3**.

## Novidades da 0.3.3

Baixe a [release 0.3.3 publicada](https://github.com/Gravewright/gravewright/releases/tag/v0.3.3), seu [ZIP portátil](https://github.com/Gravewright/gravewright/releases/download/v0.3.3/Gravewright-0.3.3-django.zip) e o [checksum SHA-256](https://github.com/Gravewright/gravewright/releases/download/v0.3.3/Gravewright-0.3.3-django.zip.sha256). Consulte [atualização e recuperação](docs/pt-BR/upgrading.html) para as três migrações desde a 0.3.2 e o caso das instalações que informam a antiga numeração incorreta 3.0.1.

- [Cenas](wiki/pt-BR/scenes.html): criação de mapas vazios com nome, cor, dimensões e opção de grid, além de ativação para todos ou para jogadores selecionados com bolinhas nas cores de identificação.
- [Controles da mesa](wiki/pt-BR/tabletop.html): ponteiros na cor do ping de cada participante, opções de exibir ou compartilhar ponteiros, atalhos configuráveis e títulos nas medições locais.
- [Tokens](wiki/pt-BR/tokens.html): nomes e condições mais nítidos, barras acima e abaixo dos tokens, cores e públicos configuráveis, modos de exibição do nome e indicadores opcionais de turno.
- [Map Builder](wiki/pt-BR/map-builder.html): agrupamento em camadas, alinhamento e distribuição, objetos reutilizáveis da campanha, pintura de objetos repetidos e exibição das áreas de ativação durante a edição.
- [Objetos Inteligentes](wiki/pt-BR/smart-objects.html): comportamentos em imagens enviadas, áreas circulares de ativação e parâmetros de shaders com valores fixos ou variáveis tipadas. O [exemplo completo do nó de shader](docs/pt-BR/example-blueprint-nodes.html) exige a 0.3.3.
- [Ensaio como jogador](docs/pt-BR/map-builder.html): teste movimento, visão, interação e eventos de área em um mapa separado. Os testes de comportamento revertem alterações sem modificar a cena real; não simulam regras de sistemas nem avançam temporizadores.

A área `#release` da página inicial apresenta a versão atual e aponta para seus guias locais. Os fluxos de [gestão de campanha](docs/pt-BR/campaign-management.html), [mapas mentais](docs/pt-BR/mindmaps.html), [relógios](docs/pt-BR/clocks.html), [pistas](docs/pt-BR/clues.html), [diários](docs/pt-BR/journals.html), [PDF System](docs/pt-BR/pdf-system.html) e [Universal VTT vinculado](docs/pt-BR/universal-vtt.html), introduzidos na 0.3.2, continuam documentados. `manager-032`, `mindmap-032`, `journal-032`, `progress-032` e `pdf-032` identificam mídias preservadas da aplicação 0.3.2 em `content/media.json`; não são capturas dos controles novos da 0.3.3. A identidade de VTT universal e os exemplos opcionais de sistemas são preservados.

## Destaque do Map Builder e mídias históricas

A seção `#map-builder` aparece logo após a apresentação e é o destino do botão secundário e do primeiro item de navegação. Ela mostra a construção do mapa, as conexões entre nodes de Objetos Inteligentes e a geração de uma cena exclusiva do mestre. Atualizar a cena vinculada e ativá-la para os jogadores são ações separadas. Os links apontam para os guias de [Map Builder](https://github.com/Gravewright/gravewright/blob/main/docs/pt-BR/map-builder.md) e [Universal VTT](https://github.com/Gravewright/gravewright/blob/main/docs/pt-BR/universal-vtt.md).

As mídias preservadas mostram a aplicação 0.3.2 publicada, com campanhas fictícias descartáveis. `content/media.json` registra as dimensões reais, o idioma da interface, as legendas e o enquadramento de cada arquivo; o link abre a imagem completa. As capturas anteriores do Builder 0.3.0 e outras mídias históricas preservam seus arquivos e suas versões. Um novo download público não altera a procedência de uma imagem antiga.

O download do core é o mesmo ZIP para os três sistemas: `Install Windows.bat`, `Install Linux.sh` e `Install macOS.command`. Os três guias de Runner vêm de `runnerGuides` nos textos por idioma.

## Wiki do produto e documentação para devs

O site inclui a wiki de produto em [`wiki/pt-BR/index.html`](wiki/pt-BR/index.html), a referência completa para desenvolvedores em [`docs/pt-BR/index.html`](docs/pt-BR/index.html) e os [guias práticos de IA](docs/pt-BR/ai.html). Cada página possui uma versão em inglês sob `en/`. A página inicial apresenta os dois públicos. Os artigos são gerados integralmente no build, com navegação por assunto, índice de títulos, fontes, troca de idioma, leitura relacionada e código/prompts copiáveis. A busca local pesquisa nas duas áreas e ignora acentos, sem chamadas a APIs externas.

Os procedimentos do produto ficam em `content/wiki.mjs`; os fluxos de IA, em `content/ai-guides.mjs`. `content/wiki-media.json` associa capturas reais da aplicação aos artigos relevantes, com legenda, texto alternativo, versão e procedência. As miniaturas abrem a imagem completa. As capturas podem usar a interface em inglês com legendas em português; as legendas identificam o idioma da interface. Imagens históricas mantêm a versão original. Leia a [procedência das capturas](assets/wiki/README.md) antes de substituí-las.

O Markdown técnico completo é uma cópia versionada dos guias públicos do projeto, sem depender do GitHub durante a leitura. Escolha um checkout separado do host no commit publicado da `v0.3.3`, **cc4fd089e6d49d32808c45ee90fdae21d1ad17dc**. Na raiz do site, confira esse checkout e sincronize seus guias confirmados no Git:

```sh
git -C /caminho/para/gravewright rev-parse HEAD
git -C /caminho/para/gravewright status --short
npm run sync:docs -- --source /caminho/para/gravewright
```

A sincronização lê o HEAD confirmado no Git do checkout escolhido, sem incorporar edições pendentes, e copia somente a lista permitida de documentação pública. Ela não gera as páginas nem atualiza os contratos de extensão. Revise o diff do Markdown/catálogo, atualize o snapshot dos contratos abaixo quando mudar a revisão documentada do host e execute `npm test`.

`content/reference/catalog.json` registra a revisão e a versão de origem. Os links de fonte apontam para essa revisão. `scripts/build-knowledge.mjs` renderiza a cópia com `scripts/markdown.mjs`, resolve links entre guias para os artigos locais e gera `knowledge-search.json`, o manifesto e o sitemap completo. Edite o Markdown no projeto principal primeiro, mantenha inglês e português alinhados e sincronize novamente. Revise os guias quando a versão pública mudar; a versão da cópia deve corresponder a `publicVersion`.

A cópia da 0.3.3 contém **26 artigos de referência bilíngues (52 arquivos Markdown)** e cobre todos os guias públicos em inglês e português da lista permitida. Os procedimentos da wiki agora cobrem mapas vazios, públicos individuais por cena, ponteiros, atalhos, aparência dos tokens, produtividade do Builder e controle de shaders. Propostas de direção de design ficam fora da referência pública; nenhum guia público estável foi omitido.

Os bytes originais da cópia são preservados. Durante a renderização, `publicationCopy` alinha a redação histórica de empacotamento com a decisão atual do `AGENTS.md`: cada novo sistema de RPG é um único pacote instalável com interface, regras, recursos e traduções. Também atualiza a introdução anterior à publicação do Map Builder para descrever a revisão documentada. Revise essas adaptações editoriais explícitas ao sincronizar guias mais novos; assinaturas de APIs e avisos legais exatos são preservados.

Os exemplos de IA explicam como fornecer contexto do repositório, manter sistemas em um único pacote, usar APIs públicas, proteger dados locais e validar o resultado. Os prompts são textos para o assistente do desenvolvedor; o site não envia dados do projeto para um provedor de IA nem promete que código gerado funciona.

## Exemplos executáveis para desenvolvedores

Comece por [Exemplos completos por kind](docs/pt-BR/examples-index.html). O catálogo tem 29 artigos bilíngues: quatro variantes completas de pacote de extensão, as 13 superfícies de montagem do SDK, contratos de busca/imagens/compêndios, os quatro kinds de Objetos Inteligentes, os dois kinds de conexão e um grafo para cada um dos 49 tipos de nó. Cada exemplo traz pré-requisitos, código completo, resultado esperado, erros, validação e um prompt contextual de IA. A referência dos contratos acompanha a 0.3.3. Receitas existentes de módulos/sistemas preservam o alvo compatível 0.3.0 declarado quando o SDK não mudou; os exemplos Blueprint de `requestRoll` e `setQuestStatus` exigem a 0.3.1. Os quatro tipos de nó para relógios, pistas e mapas mentais exigem a 0.3.2, e `shaderControl` exige a 0.3.3. Os exemplos não inventam `kind` na raiz dos manifestos nem confundem packs de sistema instalado com catálogos nativos locais.

`content/examples*.mjs` contém os fontes autorais. `scripts/build-examples.mjs` gera os quatro pacotes, os fontes e ZIPs das superfícies e o pacote de Blueprints com sua licença. O manifesto fica diretamente na raiz dos ZIPs. **Instalar de ZIP** permite testar código revisado em host descartável; publicação no Marketplace usa registros assinados. Não há chaves privadas nem credenciais nos downloads. O exemplo de idioma é propositalmente parcial. O exemplo Django exige ativação confiável explícita e não é complemento de sistema de RPG. As capturas reais e sua procedência estão em [assets/examples/previews](assets/examples/previews/README.md).

`npm test` funciona num checkout independente do site. Para executar também os testes opcionais de superfícies contra o runtime real do host:

```sh
GRAVEWRIGHT_SOURCE=/caminho/para/gravewright node --test scripts/*.test.mjs
```

No PowerShell, defina `$env:GRAVEWRIGHT_SOURCE='C:/caminho/para/gravewright'` antes do mesmo `node --test`. Sem caminho explícito, os casos de integração com o host são pulados com explicação; testes de fonte/sintaxe, comportamento dos pacotes e Markdown continuam. A integração usa ModuleRuntime/API de domínio reais com DOM/transporte simulados. Ela complementa a instalação nativa e a verificação em navegador descritas em cada guia.

O pacote de Blueprints inclui seu próprio verificador; consulte o README baixado e execute `uv run --locked python data/blueprint-examples/check-examples.py --host .` na raiz de um host descartável após extrair ali. Ele ignora `.env`/apps do operador, isola armazenamento e proíbe consultas ao banco. Valida todos os tipos de nó e prevê ações; propriedade dos alvos, permissões de GM/jogador e efeitos ao vivo ainda exigem o fluxo documentado de Test behavior/playtest.

## Tutoriais de implementação e mapa de capacidades

O [catálogo de implementação](docs/pt-BR/tutorial-index.html) acrescenta **29 artigos bilíngues** e **22 novos projetos-fonte em ZIP**, além dos exemplos por kind existentes. Comece por [seu primeiro módulo](docs/pt-BR/tutorial-first-module.html), uma [ação na ficha existente](docs/pt-BR/tutorial-sheet-module.html), um [módulo de diário](docs/pt-BR/tutorial-journal-module.html) ou pelo [sistema original completo](docs/pt-BR/tutorial-complete-system.html). Cada projeto traz arquivos, instalação e ativação, campos de entrada, ações executáveis, resultados observáveis, tratamento de falhas e prompt de adaptação com IA. Os guias cobrem atores, tokens, cenas, itens, combate, cartas, áudio, chat/dados, missões, tabelas de rolagem, compêndios, arquivos, armazenamento, tradução, personalização e integração confiável de servidor.

O [mapa de capacidades de extensão](docs/pt-BR/tutorial-capability-map.html) indexa **213 métodos públicos de domínio**, **17 operações do SDK original** e **13 superfícies de montagem**, além de helpers de ciclo de vida, eventos, recursos, armazenamento, modais e tradução. Ele aponta para projetos de implementação existentes quando disponíveis e para os guias canônicos da API e dos domínios nas capacidades introduzidas na 0.3.2; os 22 projetos anteriores não implementam todos os métodos novos. O Map Builder liga os **quatro kinds de Objeto Inteligente**, os dois kinds de conexão e os **49 tipos de nó**, incluindo o controle de shader da 0.3.3, aos seus grafos completos. Essas quantidades descrevem a cópia do contrato 0.3.3 e o catálogo autoral versionados, não resultados de testes nem suporte a combinações arbitrárias. O mapa distingue packs mutáveis da campanha, coleções de sistema instalado e catálogos locais do operador.

`content/tutorials.mjs` agrega os guias e pacotes autorais de `content/tutorial-*.mjs`. `scripts/build-examples.mjs` gera os projetos em `assets/tutorials/<project-id>/`, com o manifesto final na raiz de cada ZIP. O sistema completo combina fichas funcionais de ator/token, tipos originais de item/magia, iniciativa armazenada e três packs em um único sistema instalável. Idiomas são ativados globalmente e escolhidos por conta; módulos de navegador são ativados por campanha; apps Django exigem ativação explícita pelo dono. O guia de distribuição inclui assinador local e autoteste sintético; não cria chaves reais nem publica releases. Confira [licenças e procedência](THIRD_PARTY_NOTICES.md) antes de reutilizar um projeto.

O snapshot dos contratos está versionado em `content/extension-contracts.json`, fixado no **Gravewright 0.3.3**, revisão **cc4fd089e6d49d32808c45ee90fdae21d1ad17dc**. O SDK **1.0.0** e o contrato frontend **1.2.0** permanecem iguais. `npm run build` e o `npm test` normal usam fontes locais e esse snapshot; não procuram checkout pai do host, não buscam SDK remoto nem exigem repositório vizinho. Informar `GRAVEWRIGHT_SOURCE` ativa somente as verificações opcionais dependentes do host.

### Atualizar explicitamente o snapshot dos contratos

Atualize esse snapshot ao mudar a revisão documentada do host ou seus contratos públicos, não ao alterar textos ou capturas. Use checkout separado e escolhido explicitamente na revisão publicada desejada. Revise as mudanças de API pública e preserve a compatibilidade declarada de cada exemplo. Em POSIX, defina:

```sh
export GRAVEWRIGHT_SOURCE=/caminho/para/gravewright
export GRAVEWRIGHT_REVISION=cc4fd089e6d49d32808c45ee90fdae21d1ad17dc
```

No PowerShell, defina as mesmas variáveis apenas no processo:

```powershell
$env:GRAVEWRIGHT_SOURCE='C:/caminho/para/gravewright'
$env:GRAVEWRIGHT_REVISION='cc4fd089e6d49d32808c45ee90fdae21d1ad17dc'
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

Abra **http://127.0.0.1:4173**. Pressione Ctrl+C para encerrar. Para outra porta, use `PORT=4174 npm start` em shells POSIX ou o seguinte no PowerShell:

```powershell
$env:PORT='4174'
npm start
```

O servidor escuta somente no computador local e serve os arquivos existentes; ele não refaz o build nem acompanha alterações nos fontes. Depois de editar, execute `npm run build` e atualize o navegador. Também é possível abrir o HTML diretamente; o servidor local é preferível para copiar comandos e carregar legendas de vídeo.

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
| `scripts/build-examples.mjs` | Gera fontes e ZIPs de pacotes/superfícies/tutoriais a partir do conteúdo autoral; empacota fixtures Blueprint |
| `assets/examples/blueprints/` | JSON, verificador e README autorais dos Blueprints; `examples.zip` é gerado |
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

Edite os arquivos-fonte e gere novamente. `npm run build` grava `index.html`, `pt-br.html`, `docs/`, `wiki/`, `MEDIA.md`, `MEDIA.pt-BR.md`, `knowledge-search.json`, `content/knowledge-manifest.json`, `sitemap.xml`, fontes e ZIPs de pacotes/superfícies em `assets/examples/` e projetos em `assets/tutorials/`. O JSON/verificador/README em `assets/examples/blueprints/` são entradas revisadas; gere o arquivo ZIP novamente depois de alterá-las. Inclua os arquivos gerados na mesma revisão e commit dos seus fontes.

Ao substituir uma mídia, revise sua versão real, idioma, dimensões, enquadramento, legendas, licença, hashes e procedência em `content/media.json`, `content/wiki-media.json` e no README dos recursos correspondentes. Uma captura existente da 0.3.0 continua sendo da 0.3.0 quando o download público muda para 0.3.2. Atualize a procedência das capturas somente após produzir e revisar novas mídias.

Todas as páginas já contêm seus textos e funcionam sem JavaScript. A referência acompanha o projeto Django atual e informa a revisão de origem. Não são usados fontes externas, rastreadores ou scripts de CDN.

Ao publicar uma versão do VTT, atualize `publicVersion`, os textos da release e as perguntas frequentes juntos e gere as páginas novamente. O link de download e a versão nos dados estruturados vêm de `publicVersion`; confira antes se o ZIP público está disponível. Os dois idiomas devem informar o mesmo estado da release e a necessidade do Translator para outros idiomas da interface.

## Verificações

```sh
node --test scripts/*.test.mjs  # testa fontes, comportamento e Markdown; sem build do site
npm run build                  # gera novamente todos os arquivos publicados
npm run check                  # confere os arquivos gerados existentes
npm test                       # node:test, build e verificação normal, nessa ordem
npm run check:media            # exige também todas as mídias planejadas
git diff --check
```

O `npm test` é definido pelo `package.json` deste site. `npm run check` e `npm run check:media` não geram os arquivos: execute o build antes ao validar alterações nos fontes. Confira os dois idiomas em telas de computador e celular; teste navegação, busca, downloads, imagens, avanço/legendas de vídeo e cópia de código. Essas verificações não comprovam integração nativa com o VTT nem publicação bem-sucedida.

A verificação normal aceita placeholders; a completa exige todos os arquivos compartilhados e por idioma. As capturas atuais da 0.3.2 e a demonstração estão descritas em `content/media.json`, com nome final do vídeo, duração, faixas de legenda e transcrições. A demonstração universal anterior da 0.2.1 e a imagem do Builder 0.3.0 permanecem como fontes históricas. Os exemplos opcionais de ficha e compêndio DnD mantêm seus próprios rótulos de pacote e versão; eles não definem o suporte a regras do core. `durationSeconds` registra a duração real da edição final.

As duas imagens do dragão foram preservadas: a capa ilustrada histórica do vídeo e a captura de mesa fornecida anteriormente (`assets/images/table-overview.webp`). A captura aparece em uma galeria secundária expansível, com miniatura visível, separada das capturas atuais da 0.3.2 e das mídias preservadas da 0.2.1. O compartilhamento de links usa a arte original do dragão com seus dizeres históricos; as capturas atuais da interface ficam na galeria. Nas próximas releases, atualize as demonstrações preservando o dragão como arte social. O mapa Moonfall Abbey e o retrato de Seraphina Vale foram gerados para a demonstração original e reutilizados no aplicativo. O PDF original de Seren Ashford permanece como fonte para o tutorial, em vez de aparecer na captura de ficha do site. Consulte as [fontes, prompts e hashes](assets/demo/README.md) e os [créditos das mídias](THIRD_PARTY_NOTICES.md). Depois de alterar os arquivos, confira reprodução, avanço do vídeo, legendas sincronizadas, textos alternativos e leitura no celular.

Licenciamento e atribuição do template estão em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Publicar com GitHub Pages

Este repositório publica os arquivos gerados confirmados na raiz da branch `main`. Não há workflow de implantação autoral do site nem build npm remoto; o fluxo **pages build and deployment**, gerenciado pelo GitHub, publica esses arquivos versionados. Preserve `CNAME` com `gravewright.com` e a configuração correspondente de domínio personalizado em [Settings → Pages](https://github.com/Gravewright/site/settings/pages).

Antes de publicar, confira se a release do VTT e seu ZIP estão públicos, sincronize referência/contratos com a release revisada e execute `npm test`, `npm run check:media` e a revisão no navegador local. Confira `git status --short` e o diff completo; depois selecione somente fontes revisados e seus arquivos gerados. Mantenha checkouts locais do host, arquivos de ambiente, caches, chaves, resultados de testes e mídias não publicadas fora do commit público. Faça o commit do resultado na `main` e publique com:

```sh
git push origin main
git rev-parse HEAD
```

Use esse SHA para conferir **pages build and deployment** em [Actions](https://github.com/Gravewright/site/actions) e o ambiente `github-pages` em [Deployments](https://github.com/Gravewright/site/deployments). Aguarde a implantação bem-sucedida do mesmo commit; o push concluído sozinho não comprova publicação. Depois abra [a página inicial em inglês](https://gravewright.com/), [a página em português](https://gravewright.com/pt-br.html), a wiki e os guias de desenvolvimento, conferindo versão pública, download da release, navegação, busca e mídias. Verifique respostas HTTPS e conteúdo renderizado depois da atualização dos caches do CDN/navegador.

Trocar o domínio também exige coordenar DNS, domínio personalizado/HTTPS do Pages, `CNAME`, origens canônicas/sociais em `scripts/seo.mjs` e fontes/verificações que contêm o domínio antigo. Revise as ocorrências com `rg -n "gravewright.com" content scripts CNAME robots.txt`, refaça o build e valide sitemap/robots/links canônicos juntos. Editar `CNAME` sozinho não configura DNS nem certificados.

## SEO

Os metadados de SEO são gerados por `scripts/seo.mjs` e `scripts/build-knowledge.mjs`: títulos e descrições por idioma, URLs canônicas, versões alternativas, Open Graph, cartões sociais com imagem grande e dados estruturados do produto, artigos e coleções. O compartilhamento usa `assets/images/gravewright-share-dragon.jpg` (1200 × 676, 257.815 bytes), cópia byte a byte da arte original `gravewright-social-v3.jpg`, com os dizeres históricos “Gravewright / The Dragon’s Legacy / Alpha”. É uma ilustração promocional, não uma captura da interface atual. A antiga URL `assets/images/gravewright-social-032.jpg` também entrega o dragão por compatibilidade; o JPEG real da mesa 0.3.2 foi preservado em `assets/images/tabletop-preview-032.jpg`, junto das capturas da interface na galeria. Caminho e dimensões da imagem social ficam em `scripts/seo.mjs`; as capas dos vídeos são registradas separadamente em `content/media.json`. As verificações exigem JPEG e tamanho abaixo de 300 KB. Mantenha o dragão no compartilhamento das próximas releases e coloque as novas capturas na galeria. O `sitemap.xml` lista todas as páginas públicas e o `robots.txt` aponta para ele.

Referências: [protocolo Open Graph](https://ogp.me/) e [dados estruturados de software do Google](https://developers.google.com/search/docs/appearance/structured-data/software-app).
