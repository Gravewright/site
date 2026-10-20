import {packageExamples} from './examples-packages.mjs';
import {tutorialJournalPackages,tutorialJournalArticles} from './tutorial-journals.mjs';
import {tutorialSheetPackages,tutorialSheetArticles} from './tutorial-sheets.mjs';
import {tutorialCompendiumPackages,tutorialCompendiumArticles} from './tutorial-compendiums.mjs';
import {platformToolPackages,platformToolArticles} from './tutorial-platform-tools.mjs';
import {sdkTutorialPackages,sdkTutorialArticles} from './tutorial-sdk-compat.mjs';
import {customizeTutorialPackages,customizeTutorialArticles} from './tutorial-customize.mjs';
import {serverTutorialPackages,serverTutorialArticles} from './tutorial-server.mjs';
import {contentToolPackages,contentToolArticles} from './tutorial-content-tools.mjs';
import {worldToolPackages,worldToolArticles} from './tutorial-world-tools.mjs';
import {communicationToolPackages,communicationToolArticles} from './tutorial-communication-tools.mjs';
import {completeSystemPackages,completeSystemArticles} from './tutorial-complete-system.mjs';
import {distributionTutorialArticles} from './tutorial-distribution.mjs';
import {capabilityTutorialArticles} from './tutorial-capabilities.mjs';
export {distributionSupportFiles} from './tutorial-distribution.mjs';

const fence=(language,value)=>'```'+language+'\n'+value.trimEnd()+'\n```';
const browser=packageExamples.find(example=>example.id==='browser');
const paths=['gravewright/modules/contracts/schemas/manifest.json','gravewright/modules/packages.py','gravewright/modules/static/gravewright_modules/module-runtime.js','gravewright/modules/static/gravewright_modules/workspace.js','gravewright/web/jinja2/gravewright_web/inside/modules.html'];

function index(locale,additional){
  const pt=locale==='pt';
  const catalog=additional.map(article=>'- ['+article[locale].title+'](docs:'+article.slug+'): '+article[locale].summary).join('\n');
  return {
    title:pt?'Aprenda a criar módulos e sistemas':'Learn to build modules and systems',
    summary:pt?'Escolha o que quer construir e siga do primeiro arquivo ao recurso funcionando na mesa.':'Choose what you want to build and follow it from the first file to a working tabletop feature.',
    body:pt?`## Escolha o resultado que você quer entregar

Consulte o [mapa completo de capacidades](docs:tutorial-capability-map) para localizar cada método, operação, superfície e família do Map Builder.

| Quero construir | Tutorial | O que vou conseguir testar |
| --- | --- | --- |
| Meu primeiro módulo | [Criar, instalar e atualizar um módulo do zero](docs:tutorial-first-module) | Botão na mesa, leitura autorizada e modal nativo |
| Uma ferramenta de diário | [Como criar um módulo de diário](docs:tutorial-journal-module) | Criar um diário e acrescentar uma seção pela interface do módulo |
| Uma ação na ficha existente | [Como criar um módulo que atua na ficha](docs:tutorial-sheet-module) | Editar um nome preservando os dados da ficha, inclusive snapshots de token |
| Uma biblioteca criada pelo módulo | [Como criar um módulo de compêndio](docs:tutorial-compendium-module) | Criar pack, capturar conteúdo, ler entrada e importar uma cópia |
| Conteúdo que acompanha meu sistema | [Como incluir compêndios em um sistema](docs:tutorial-system-compendiums) | Instalar um único ZIP com sistema, JSONs e três packs originais |

Comece pelo primeiro tutorial se ainda não instalou um módulo próprio. Os casos acima são pontos de entrada. O catálogo completo abaixo também ensina personagens, itens, cenas, tokens, combate, cartas, áudio, chat/dados, missões, tabelas de rolagem, arquivos, armazenamento, tradução, janelas e servidor. Cada página mostra arquivos necessários, o que mudar, instalação, ativação e resultado a conferir. Use campanha de desenvolvimento e conteúdo original.

## Todos os projetos e suas receitas

${catalog}

## Antes de escolher um “tipo de módulo”

“Diário”, “ficha” e “compêndio” descrevem o que seu módulo faz. Não são valores para colocar em um campo kind do manifesto. Um módulo de diário é um pacote comum que registra journal.sheet e usa journals. Uma ação de ficha registra actor.sheet e token.sheet. Uma biblioteca pode ser criada como conteúdo da campanha pela API. Um sistema com catálogo declara system e content.compendiums no mesmo manifesto.

| Decisão | Escolha |
| --- | --- |
| Acrescentar um botão ou painel | mode: augment, mantendo a interface existente |
| Desenhar a ficha do próprio sistema | mode: replace e tipos do sistema, como no [sistema de exemplo](docs:example-package-system) |
| Salvar dados de um diário/ator | API pública do documento, usando a revisão lida |
| Salvar uma preferência do módulo | Armazenamento do módulo, sem sobrescrever o documento |
| Distribuir catálogo com um sistema | Arquivos físicos no ZIP e content.compendiums |

## O ciclo completo de desenvolvimento

1. Defina uma ação observável: “clicar no botão cria uma seção”, por exemplo. Escolha um recurso que o contrato da release 0.3.0 realmente permite alterar.
2. Crie uma pasta com manifest.json, a entrada JavaScript, estilos e licença. O manifesto aponta para arquivos; ele não executa a ação sozinho.
3. Implemente start/register/stop. Use o root e o api da montagem; registre a superfície onde a ferramenta deve aparecer.
4. Faça um ZIP com o manifesto na raiz. O dono instala esse ZIP na instalação de teste.
5. O GM ativa a versão exata na mesa. Um sistema também precisa ser escolhido como sistema da campanha.
6. Abra a janela ou diretório que recebe a montagem. Execute a ação e confirme o documento salvo, não apenas uma mensagem de sucesso.
7. Teste leitura, conflito, cancelamento e jogador. Uma versão instalada é imutável: altere a versão do pacote antes de instalar novos bytes.

## Quando consultar a referência

Os tutoriais ensinam o fluxo completo. Use [Exemplos por kind](docs:examples-index) para variar um contrato e a [referência de módulos](docs:modules) para limites e assinaturas. O [guia de API](docs:api) detalha os métodos. Se uma ideia não cabe na release solicitada, descreva a limitação antes de inventar um endpoint ou exigir um novo host.

## Como usar a IA para começar um módulo

${fence('text','Quero construir [ação concreta] no Gravewright 0.3.0. Parta do tutorial [link] e de seu ZIP. Antes de escrever, mostre qual superfície monta a ferramenta, qual API grava o recurso e onde o pacote será instalado/ativado. Entregue a árvore completa, todos os arquivos, instruções de instalação e passos de teste com resultado observável. Preserve revisões, permissões, seções privadas e snapshots. Não crie um kind de manifesto nem uma API inexistente.')}\n`:
`## Choose the outcome you want to deliver

Use the [complete capability map](docs:tutorial-capability-map) to locate every method, operation, surface and Map Builder family.

| I want to build | Tutorial | What I can test |
| --- | --- | --- |
| My first module | [Create, install and update a module from scratch](docs:tutorial-first-module) | Table button, authorized read and native modal |
| A journal tool | [How to create a journal module](docs:tutorial-journal-module) | Create a journal and append a section from module UI |
| An action in an existing sheet | [How to create a module that acts on a sheet](docs:tutorial-sheet-module) | Edit a name while preserving sheet data and token snapshots |
| A module-created library | [How to create a compendium module](docs:tutorial-compendium-module) | Create a pack, capture content, read an entry and import a copy |
| Content shipped with my system | [How to include compendiums in a system](docs:tutorial-system-compendiums) | Install one ZIP with a system, JSON files and three original packs |

Start with the first tutorial if you have never installed your own module. The table above supplies entry points. The full catalog below also covers actors, items, scenes, tokens, combat, cards, audio, chat/dice, quests, roll tables, files, persistence, translation, windows and server code. Every guide provides files, adaptation points, installation, activation and observable results. Use a development campaign and original content.

## Every project and its recipes

${catalog}

## Before choosing a “module type”

Journal, sheet and compendium describe what your module does. They are not values for a manifest kind field. A journal module is a regular package registering journal.sheet and calling journals. A sheet action registers actor.sheet and token.sheet. A library can be created as campaign content through the API. A system catalog declares system and content.compendiums in the same manifest.

| Decision | Choice |
| --- | --- |
| Add a button or panel | mode: augment, keeping the existing UI |
| Draw your system's own sheet | mode: replace with system-owned types, as in the [sample system](docs:example-package-system) |
| Save journal/actor data | The public document API with the revision you read |
| Save a module preference | Module storage, without overwriting the document |
| Ship a catalog with a system | Physical ZIP files and content.compendiums |

## The complete development cycle

1. Define an observable action, such as “clicking the button creates a section.” Choose a resource supported by the 0.3.0 contract.
2. Create a folder containing manifest.json, a JavaScript entry, styles and a license. The manifest names files; it does not implement the action.
3. Implement start/register/stop. Use the mount's root and api, and register the surface where the tool should appear.
4. Build a ZIP with the manifest at its root. The installation owner installs it on a development host.
5. The GM activates the exact version for the table. A system also needs to be selected as the campaign system.
6. Open the window or directory receiving the mount. Execute the action and inspect persisted data rather than relying on a success message.
7. Test read access, conflicts, cancellation and player behavior. Installed versions are immutable: increase the package version before installing changed bytes.

## When to use the reference

Tutorials teach the full flow. Use [Examples by kind](docs:examples-index) to vary a contract and the [module reference](docs:modules) for limits and signatures. The [API guide](docs:api) covers methods. When an idea cannot be implemented on the requested release, explain that limitation before inventing an endpoint or requiring a host upgrade.

## How to use AI to start a module

${fence('text','I want to build [observable action] on Gravewright 0.3.0. Start from tutorial [link] and its ZIP. Before coding, identify the mounting surface, the API that saves the resource, and package installation/activation. Deliver the complete tree, every file, installation steps and tests with observable results. Preserve revisions, permissions, private sections and snapshots. Do not invent a manifest kind or an unavailable API.')}\n`
  };
}

function first(locale){
  const pt=locale==='pt',base='../../assets/examples/packages/browser/';
  const title=pt?'Criar, instalar e atualizar seu primeiro módulo':'Create, install and update your first module';
  const summary=pt?'Da pasta vazia ao botão na mesa, com arquivos completos, instalação, ativação e uma segunda versão.':'From an empty folder to a table button, with complete files, installation, activation and a second version.';
  const tree=fence('text','campaign-summary/\n  manifest.json\n  main.mjs\n  styles.css\n  LICENSE.txt');
  const manifest=fence('json',JSON.stringify(browser.manifest,null,2));
  const code=fence('javascript',browser.files['main.mjs']);
  const css=fence('css',browser.files['styles.css']);
  const zipPS=fence('powershell',"Set-Location .\\campaign-summary\npython -m json.tool manifest.json\npython -m zipfile -c ..\\campaign-summary-1.0.0.zip manifest.json main.mjs styles.css LICENSE.txt\npython -m zipfile -l ..\\campaign-summary-1.0.0.zip");
  const zipPosix=fence('sh','cd campaign-summary\npython3 -m json.tool manifest.json\npython3 -m zipfile -c ../campaign-summary-1.0.0.zip manifest.json main.mjs styles.css LICENSE.txt\npython3 -m zipfile -l ../campaign-summary-1.0.0.zip');
  return {title,summary,body:pt?`## O que você vai construir

Um módulo de navegador chamado Example campaign summary. Ele acrescenta o botão Campaign summary à mesa, lê os atores que a conta pode abrir e exibe a contagem em um modal nativo. O resultado final é um ZIP instalável na interface. Você não precisa alterar o código do VTT, instalar um SDK npm ou configurar um servidor Python para esse módulo.

Você precisa de uma instalação de desenvolvimento do Gravewright 0.3.0, acesso de proprietário para instalar e uma conta GM em uma campanha de teste. Para escrever e empacotar, use um editor de texto e Python no terminal. Se a instalação que você usa tem dados importantes, prepare outra instalação para os exemplos. A conta do proprietário da instalação e o papel de GM da campanha são permissões diferentes.

## 1. Comece com uma pasta vazia

Crie campaign-summary na sua área de trabalho de desenvolvimento. Crie os quatro arquivos abaixo usando UTF-8. Confira extensões: main.mjs.txt não é main.mjs. Você também pode [baixar o projeto pronto](${base}browser-source.zip), extrair e comparar arquivo por arquivo.

${tree}

Não coloque banco de dados, .env, credenciais nem arquivos da campanha nessa pasta. O ZIP precisa apenas do módulo. O código a seguir é o mesmo do download.

## 2. Declare o pacote em manifest.json

${manifest}

id identifica o pacote e continua igual entre suas versões. name é o nome mostrado para o dono e o GM. version identifica bytes imutáveis. entry é um caminho relativo dentro do ZIP. sdk descreve o contrato do módulo, não a versão do VTT. Não acrescente kind: journal ou type: compendium aqui: o que o pacote faz será definido pelo código e pelos blocos suportados do manifesto.

## 3. Escreva main.mjs

${code}

start carrega estilos uma vez para a ativação. register informa ao host que há uma extensão em table.interface. A função registrada roda quando a mesa oferece essa superfície e recebe um root próprio, api limitado à montagem e signal de cancelamento. O botão só lê atores ao ser clicado. actors.list retorna a coleção autorizada; canOpen separa documentos legíveis de entradas que permitem apenas listagem.

api.ui.openModal usa a infraestrutura de modal do VTT. O exemplo não cria um elemento HTML dialog nem usa alert. signal impede que uma resposta tardia abra uma janela depois que o módulo foi desativado. onDispose remove o painel; listeners vinculados ao signal são cancelados junto da montagem.

## 4. Escreva styles.css e copie a licença

${css}

O seletor data-module-id mantém o posicionamento do botão específico para este pacote. O painel fica acima da mesa e abaixo das janelas nativas, sem bloquear os controles.

Baixe [LICENSE.txt completo](${base}LICENSE.txt) e salve-o com esse nome na pasta. Preserve o texto da licença ao reutilizar o exemplo. A licença do exemplo é GPL-3.0-only; para um módulo autoral diferente, escolha a licença aplicável e mantenha manifesto e arquivo consistentes. O nome do pacote pode mudar; não distribua apenas um rótulo de licença sem seu texto.

## 5. Gere e confira o ZIP

No PowerShell, partindo da pasta que contém campaign-summary:

${zipPS}

No Linux/macOS:

${zipPosix}

json.tool precisa encerrar sem erro. Na listagem do ZIP, manifest.json aparece diretamente na raiz, ao lado de main.mjs. Se aparecer campaign-summary/manifest.json, você compactou a pasta em vez dos seus arquivos. Feche o ZIP antes de instalar.

## 6. Instale como proprietário

1. Entre na área Inside e abra Módulos (Modules na interface em inglês).
2. Clique em Instalar módulo / Install module, depois Instalar de ZIP / Install from ZIP.
3. Escolha campaign-summary-1.0.0.zip no campo Arquivo ZIP / ZIP file e clique Instalar / Install.
4. Espere o pacote Example campaign summary 1.0.0 aparecer na lista. Ainda falta ativá-lo na campanha.

O upload local é o caminho de desenvolvimento para código que o proprietário revisou. Publicar no Marketplace é outro fluxo, com catálogo e assinatura. Instalar o ZIP não ativa o módulo em todas as mesas.

## 7. Ative como GM e veja o resultado

1. Abra uma campanha de teste como GM. No menu Gravewright, entre em Extensions e depois Table modules. Localize Example campaign summary 1.0.0 e clique Activate. Os botões Activate/Deactivate desta lista permanecem em inglês na release documentada.
2. Volte à mesa. O botão Campaign summary aparece na parte inferior esquerda.
3. Crie um ator pelo diretório nativo, conceda à sua conta o acesso apropriado e clique no botão. O modal mostra Readable actors: 1 se houver um único ator legível; o número depende da campanha.
4. Feche por Close ou Escape. Reabra, depois desative o módulo. O botão deve desaparecer; os atores continuam na campanha.

Se a campanha não usa um sistema com tipos de ator, teste primeiro com a contagem zero ou escolha um sistema apropriado na campanha de desenvolvimento. Não invente um tipo de ator apenas para o módulo carregar.

## 8. Faça uma alteração e instale a versão 1.0.1

No main.mjs, troque o texto Campaign summary do botão por Campaign notebook. Em manifest.json, troque apenas version de 1.0.0 para 1.0.1. Mantenha id igual. Gere outro ZIP com os mesmos quatro arquivos e nome campaign-summary-1.0.1.zip; repita a instalação.

Na mesa, ative a versão 1.0.1, confira o novo texto e use o botão. O fato de a versão nova estar instalada não muda automaticamente a versão já selecionada na mesa. Não sobrescreva arquivos dentro do diretório de pacotes instalados e não tente reinstalar bytes diferentes como 1.0.0: o instalador pode rejeitar isso com conflict. Não há hot reload de pasta-fonte; o ciclo é editar, mudar versão, empacotar, instalar e ativar.

## 9. Descubra em qual etapa uma falha ocorreu

| Sintoma | Confira |
| --- | --- |
| O ZIP é recusado | Raiz do arquivo, JSON válido, entry existente, licença e versão numérica |
| conflict ao instalar | Mesmo id/version já instalado com bytes diferentes; publique 1.0.1 |
| Instalado, mas sem botão | Conta GM, ativação exata na mesa e console de importação de main.mjs |
| Botão aparece, mas leitura falha | Acesso da conta, rede e error.code no texto do painel |
| Jogador vê contagem diferente | Permissões dos atores; o módulo lê a coleção autorizada daquele usuário |
| Botão antigo continua | Versão ativada, abas abertas e recarregamento após mudar a seleção |

Para investigar, abra as ferramentas de desenvolvimento do navegador e veja Console e Network enquanto reproduz a ação. Não cole cookies ou tokens da sessão em uma issue. Código JavaScript escrito na entrada precisa ser um módulo ES válido; remover export default impede o carregamento.

## 10. Escolha sua próxima implementação

- [Criar um módulo de diário](docs:tutorial-journal-module): duas montagens, criação de documento e uma ação na janela aberta.
- [Atuar na ficha](docs:tutorial-sheet-module): alterar um dado genérico sem perder os campos existentes.
- [Criar um módulo de compêndio](docs:tutorial-compendium-module): criar conteúdo da campanha e capturar snapshots.
- [Distribuir compêndios no sistema](docs:tutorial-system-compendiums): arquivos JSON e manifesto no mesmo ZIP.

## Como usar a IA para adaptar este projeto

${fence('text','Use o ZIP campaign-summary do tutorial como ponto de partida no Gravewright 0.3.0. Quero substituir o resumo por [ação]. Explique se continuo em table.interface ou preciso de outra montagem. Entregue main.mjs, manifest.json e CSS completos. Preserve API do contexto, signal, onDispose e modal nativo. Gere uma nova versão do pacote e explique o teste depois da instalação/ativação, incluindo o que ver no console em caso de falha.')}\n`:
`## What you will build

A browser module named Example campaign summary. It adds a Campaign summary button to the table, reads actors the caller may open and displays their count in a native modal. The result is a ZIP installed through the UI. You do not need to modify VTT source, install an npm SDK or configure a Python server for this module.

You need a Gravewright 0.3.0 development installation, installation-owner access to install code and a GM account in a test campaign. Use a text editor and Python in your terminal to write and package files. If your current installation contains valuable campaigns, prepare another development installation. Installation owner and campaign GM are different permissions.

## 1. Start with an empty folder

Create campaign-summary in your development work area. Save these four files as UTF-8. Check extensions: main.mjs.txt is not main.mjs. You may also [download the finished project](${base}browser-source.zip), extract it and compare each file.

${tree}

Do not put a database, .env, credentials or campaign files here. The ZIP needs only module files. The following source matches the download.

## 2. Declare the package in manifest.json

${manifest}

id identifies the package across versions. name is displayed to the owner and GM. version identifies immutable bytes. entry is a path inside the ZIP. sdk describes the module contract rather than the VTT release. Do not add kind: journal or type: compendium: behavior comes from code and supported manifest blocks.

## 3. Write main.mjs

${code}

start loads styles once per activation. register declares an extension for table.interface. Its callback runs when the table offers that surface and receives an owned root, a mount-scoped api and a cancellation signal. Reading happens on click. actors.list returns the authorized collection; canOpen distinguishes readable documents from listing-only entries.

api.ui.openModal uses the VTT modal infrastructure. The example does not create an HTML dialog element or call alert. The signal prevents a late read from opening a window after deactivation. onDispose removes the panel; signal-bound listeners are cancelled with the mount.

## 4. Write styles.css and copy the license

${css}

The data-module-id selector scopes table positioning to this package. Its panel appears above the table and below native windows while leaving controls available.

Download the [complete LICENSE.txt](${base}LICENSE.txt) into the folder with that exact name. Preserve the notice when reusing this example. The sample uses GPL-3.0-only; choose the appropriate license for a different original module and keep its manifest and license file consistent. Do not distribute just a license label without its text.

## 5. Build and inspect the ZIP

In PowerShell, starting in the folder containing campaign-summary:

${zipPS}

On Linux/macOS:

${zipPosix}

json.tool must finish without errors. The archive listing must show manifest.json at its root beside main.mjs. campaign-summary/manifest.json means you zipped the folder instead of its contents. Close the archive before installation.

## 6. Install as the installation owner

1. Enter Inside and open Modules.
2. Select Install module, then Install from ZIP.
3. Choose campaign-summary-1.0.0.zip in ZIP file and press Install.
4. Wait for Example campaign summary 1.0.0 to appear. Campaign activation is still required.

Local upload is the development path for owner-reviewed code. Marketplace publication uses its separate signed-catalog workflow. Installing a ZIP does not enable it on every table.

## 7. Activate as GM and inspect the result

1. Open a test campaign as GM. Open the Gravewright menu, select Extensions, then Table modules. Find Example campaign summary 1.0.0 and click Activate.
2. Return to the table. Campaign summary appears near the lower-left corner.
3. Create an actor through the native directory, give the caller appropriate access and click the button. With one readable actor, the modal displays Readable actors: 1; the count depends on campaign data.
4. Close using Close or Escape. Reopen, then deactivate the module. Its button disappears while actors remain in the campaign.

If the campaign has no system declaring actor types, first test a zero count or select an appropriate system in your development campaign. Do not invent an actor type just to load this module.

## 8. Make a change and install version 1.0.1

In main.mjs, change the button text from Campaign summary to Campaign notebook. In manifest.json, change version from 1.0.0 to 1.0.1 while keeping id. Build another ZIP containing the same four files, named campaign-summary-1.0.1.zip, then install it.

Activate 1.0.1 on the table and check its new text and action. Installing a newer version does not automatically change a table's selection. Do not modify installed package files or reinstall changed bytes as 1.0.0: the installer may reject that with conflict. There is no source-folder hot reload. The cycle is edit, increment version, package, install and activate.

## 9. Locate the failing stage

| Symptom | Check |
| --- | --- |
| ZIP rejected | Root layout, valid JSON, existing entry, license and numeric version |
| conflict during installation | Same id/version already has different bytes; install 1.0.1 |
| Installed but no button | GM account, exact table activation and main.mjs import errors |
| Button appears but read fails | Caller access, network and the panel's error.code |
| Player sees a different count | Actor permissions; each account reads its authorized collection |
| Old label remains | Active version, open tabs and reload after selecting the new release |

Open browser developer tools and inspect Console and Network while reproducing the action. Never paste session cookies or tokens into an issue. The entry must be a valid ES module; removing export default prevents loading.

## 10. Choose your next implementation

- [Create a journal module](docs:tutorial-journal-module): two mounts, document creation and an action in an open journal.
- [Act on a sheet](docs:tutorial-sheet-module): edit generic data without losing existing fields.
- [Create a compendium module](docs:tutorial-compendium-module): create campaign content and capture snapshots.
- [Ship compendiums with a system](docs:tutorial-system-compendiums): JSON files and manifest in one ZIP.

## How to use AI to adapt this project

${fence('text','Start from the tutorial campaign-summary ZIP on Gravewright 0.3.0. Replace its summary with [action]. Explain whether table.interface remains appropriate or another mount is needed. Deliver complete main.mjs, manifest.json and CSS. Preserve the scoped API, signal, onDispose and native modal. Increment the package version and explain testing after installation/activation, including console diagnostics.')}\n`};
}

export const tutorialPackages=[...tutorialJournalPackages,...tutorialSheetPackages,...tutorialCompendiumPackages,...platformToolPackages,...sdkTutorialPackages,...customizeTutorialPackages,...serverTutorialPackages,...contentToolPackages,...worldToolPackages,...communicationToolPackages,...completeSystemPackages];
const implementationArticles=[...capabilityTutorialArticles,...completeSystemArticles,...tutorialJournalArticles,...tutorialSheetArticles,...tutorialCompendiumArticles,...worldToolArticles,...contentToolArticles,...communicationToolArticles,...platformToolArticles,...sdkTutorialArticles,...customizeTutorialArticles,...serverTutorialArticles,...distributionTutorialArticles];
export const tutorialArticles=[
  {slug:'tutorial-index',group:'tutorials',sourcePaths:paths,en:index('en',implementationArticles),pt:index('pt',implementationArticles)},
  {slug:'tutorial-first-module',group:'tutorials',sourcePaths:paths,en:first('en'),pt:first('pt'),related:['tutorial-journal-module','tutorial-sheet-module','tutorial-compendium-module','tutorial-system-compendiums']},
  ...implementationArticles,
];
