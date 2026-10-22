import contracts from './extension-contracts.json' with {type:'json'};

const baseGuides={actors:'tutorial-actors',tokens:'tutorial-tokens',maps:'tutorial-maps',journals:'tutorial-journal-management',items:'tutorial-items',combat:'tutorial-combat',cards:'tutorial-cards',audio:'tutorial-audio',compendiums:'tutorial-compendium-module'};
function guide(domain,method){
  if(domain==='actors'&&method==='saveSheet')return 'tutorial-sheet-module';
  if(domain==='actors'&&method==='deleteAsset')return 'tutorial-assets';
  if(domain==='journals'){
    if(['setStatus','setObjective','assignCharacters','createBoardQuest','addQuest','removeQuest','pinQuest','reorderQuests'].includes(method))return 'tutorial-quests';
    if(['roll','reset'].includes(method))return 'tutorial-roll-tables';
    if(['create','update'].includes(method))return 'tutorial-journal-module';
  }
  return baseGuides[domain];
}
const entries=Object.entries(contracts.frontend.domains);
const collections=new Set(['actors','tokens','maps','journals','items']);
export const documentedDomainMethods=entries.flatMap(([domain,methods])=>[
  ...Object.keys(methods).map(method=>({domain,method,action:methods[method],slug:guide(domain,method)})),
  {domain,method:'state',action:'state',slug:baseGuides[domain]},
  ...(collections.has(domain)?['list','get'].map(method=>({domain,method,action:'state projection',slug:baseGuides[domain]})):[]),
]);
documentedDomainMethods.push({domain:'actors',method:'sheet',action:'sheet',slug:'tutorial-sheet-module'},{domain:'maps',method:'layers',action:'layers',slug:'tutorial-maps'});
const specialMethods=[['chat','history'],['chat','send'],['chat','remove'],['chat','clear'],['dice','roll'],['table','search'],['table','lobby'],['table','updateLobby']];
for(const [domain,method] of specialMethods)documentedDomainMethods.push({domain,method,action:method,slug:'tutorial-chat-dice'});
const operationGuide=name=>name.startsWith('asset.')||name==='actor.image.upload'||name==='card.asset.upload'?'tutorial-assets':name==='locale.apply'?'tutorial-localization-events':'tutorial-sdk-operations';
const operations=Object.entries(contracts.operations);
function body(locale){
  const pt=locale==='pt';
  const methodTables=[...new Set(documentedDomainMethods.map(row=>row.domain))].map(domain=>{
    const rows=documentedDomainMethods.filter(row=>row.domain===domain);
    return '### api.'+domain+'\n\n| '+(pt?'Método':'Method')+' | '+(pt?'Ação nativa':'Native action')+' | '+(pt?'Projeto com implementação':'Implementation project')+' |\n| --- | --- | --- |\n'+rows.map(row=>'| `'+domain+'.'+row.method+'` | `'+row.action+'` | ['+(pt?'Código, entradas e teste':'Code, inputs and test')+'](docs:'+row.slug+') |').join('\n');
  }).join('\n\n');
  const sdkTable='| '+(pt?'Operação original':'Original operation')+' | '+(pt?'Transporte/efeito':'Transport/effect')+' | '+(pt?'Projeto':'Project')+' |\n| --- | --- | --- |\n'+operations.map(([name,record])=>'| `'+name+'` | '+(record.transport||'json')+' / '+record.effect+' | ['+(pt?'Implementação completa':'Complete implementation')+'](docs:'+operationGuide(name)+') |').join('\n');
  const surfaceTable='| '+(pt?'Superfície':'Surface')+' | '+(pt?'Modos aceitos':'Accepted modes')+' | '+(pt?'Exemplo completo':'Complete example')+' |\n| --- | --- | --- |\n'+Object.entries(contracts.surfaces).map(([name,record])=>'| `'+name+'` | '+record.modes.map(mode=>'`'+mode+'`').join(', ')+' | [`'+name+'`](docs:example-surface-'+name.replaceAll('.','-')+') |').join('\n');
  const summary=pt?`## Como usar este mapa

Este índice cruza os contratos públicos da revisão ${contracts.sourceRevision.slice(0,7)} do host ${contracts.hostVersion} com os projetos de implementação. Ele cobre **${documentedDomainMethods.length} métodos da API de domínio**, **${operations.length} operações do SDK original**, **${Object.keys(contracts.surfaces).length} superfícies** e os helpers de ciclo de vida. O link de cada método leva a código executável, entradas e teste; não é uma promessa de que qualquer combinação arbitrária de ideias é suportada.

Comece pelo [resultado que quer construir](docs:tutorial-index), e use a tabela para localizar uma capacidade específica. Uma receita pode reunir várias chamadas porque criar, configurar, consultar e apagar fazem parte do mesmo recurso. As receitas executam apenas por clique e identificam ações destrutivas. Use uma instalação/campanha descartável.

## Qual pacote preciso criar

| Quero entregar | Estrutura | Tutorial completo |
| --- | --- | --- |
| Ferramenta de diário, ficha, carta, áudio ou mesa | Pacote de navegador com entry e register | [Projeto básico](docs:tutorial-first-module) e famílias abaixo |
| RPG com fichas, tipos, iniciativa e catálogo | Um único pacote system, entry, assets e content.compendiums | [Sistema completo](docs:tutorial-complete-system) |
| Traduzir meu módulo | Catálogos privados registrados em api.i18n | [Tradução e eventos](docs:tutorial-localization-events) |
| Acrescentar idioma à instalação | Pacote locales sem system/Django | [Pacote de idioma](docs:tutorial-language-package) |
| Rota ou serviço Python confiável | Pacote Django, ativação pelo dono/Runner | [Integração de servidor](docs:tutorial-server-integration) |
| Distribuir uma versão aprovada | ZIP imutável, hash, assinatura e catálogo HTTPS | [Publicação](docs:tutorial-publish-module) |

Não existe um enum global de tipos de módulo. “Compêndio” pode significar pack mutável da campanha, catálogo instalado com um sistema ou catálogo local do operador; cada origem tem regras próprias. A montagem depende da superfície, não do nome que você deu ao módulo.

## Todos os métodos de domínio

Em métodos genéricos, use api.dominio.metodo(payload, {signal, requestId}) com os campos da receita. Leituras não precisam requestId. list/get são projeções autorizadas de state. actors.sheet, dice.roll, table.search, chat.remove e outras conveniências têm assinaturas próprias demonstradas nos guias. Não confunda o nome JavaScript com a ação da fachada Python.

${methodTables}

## Todas as operações do SDK original

Use host.call(nome,payload,{signal,onProgress}) somente com o contrato correspondente. File e Blob são objetos reais, não JSON nem caminhos locais. DTOs e expectedRevision do SDK original são diferentes de version/sheetVersion da API de domínio. Os projetos abaixo mostram essa diferença em código.

${sdkTable}

## Todas as superfícies de montagem

augment acrescenta controles à interface existente. replace assume o corpo completo daquela superfície; você passa a fornecer a navegação e ações que quer oferecer. Para ficha de ator/token, [o sistema completo](docs:tutorial-complete-system) mostra substituição funcional; para agir na ficha existente, [use augment](docs:tutorial-sheet-module). As 13 páginas abaixo fornecem arquivos completos para experimentar cada superfície.

${surfaceTable}

## Helpers locais e ciclo de vida

| Capacidade | API concreta | Projeto para adaptar |
| --- | --- | --- |
| Carregar arquivos do pacote | assets.url / text / json / bytes | [Tradução e arquivos](docs:tutorial-localization-events) |
| Anexar/remover CSS | styles.use e disposer | [Primeiro módulo](docs:tutorial-first-module) |
| Preferência no navegador | storage.local.get / set / delete | [Armazenamento](docs:tutorial-storage) |
| Preferência por conta/mesa | storage.user.get / set / delete / list | [Armazenamento](docs:tutorial-storage) |
| Configuração compartilhada GM | storage.table.get / set / delete / list | [Armazenamento](docs:tutorial-storage) |
| Configuração com interface | customize(context) e preferences | [Formulário completo](docs:tutorial-customize-ui) |
| Catálogos privados | api.i18n.locale / t / has / number / register / onChange | [Tradução](docs:tutorial-localization-events) |
| Janela nativa e fechamento | api.ui.openModal; close / suspend / resume; gravewright:sheet-flush | [Customize e modais](docs:tutorial-customize-ui) |
| Registrar componente | register, equivalente ao registro de UI na fase register | [Projeto básico](docs:tutorial-first-module) |
| Atualização autorizada | api.events.on e unsubscribe | [Eventos](docs:tutorial-localization-events) |
| Avisos antigos de ator | events.on actor.created / actor.updated / actor.deleted | [Contrato e limites](docs:modules#arquivos-persistencia-e-eventos) |
| Coordenadas e pan/zoom | viewport.sceneToViewport / viewportToScene; scene.viewport.changed | [Overlay executável](docs:example-surface-scene-overlay) |
| Cancelar e liberar | signal e onDispose em cada montagem; start / register / stop | [Projeto básico](docs:tutorial-first-module) |

Os eventos de domínio incluem actors.changed, tokens.changed, maps.changed, maps.layersChanged, journals.changed, items.changed, combat.changed, cards.changed, audio.changed, compendiums.changed, chat.changed, chat.message, table.presence e table.lobbyChanged. Podem agrupar invalidações e fazer leituras iniciais/reconexão; não disparam uma automação uma única vez garantida. Cada assinatura precisa ser liberada.

## Map Builder e automação visual

Os quatro donos door/lever/torch/region, as conexões execution/data e os 44 node.type têm [grafo completo, JSON e passos no editor](docs:examples-blueprints). O [catálogo de nós](docs:example-blueprint-nodes) explica recursos, alvos e efeitos. Use a ação nativa de Test behavior/playtest antes de aplicar na cena. Esses grafos são documentos de desenvolvimento, não uma API browser para importar qualquer JSON nem um campo novo do manifesto.

O tutorial de [cenas](docs:tutorial-maps) mostra a API pública de camadas/objetos. Criar novos kinds ou portas do editor exige contribuição ao core e seus testes; a release 0.3.1 não promete uma API de plugin para registrar tipos arbitrários de nó.

## Integrações de servidor e limites da release

A [integração Django](docs:tutorial-server-integration) mostra Context.from_request, comandos públicos, rotas autenticadas/CSRF e sinais depois do commit. As fachadas Python api.actors/tokens/maps/journals/items/combat/cards/audio/compendiums/resources/chat/dice/table/events têm assinaturas na [referência](docs:api#interface-python). O contexto carrega IDs, sem congelar permissões; cada serviço revalida acesso. Contas, administração, instalação e campanhas são adaptadores globais da aplicação, não métodos do api entregue a uma montagem: consulte [a referência de adaptadores](docs:api#adaptadores-de-conta-campanha-proprietario-e-modulos) para ferramentas do operador.

Não há maps.create ou audio.upload no SDK de domínio: os tutoriais preparam cena/arquivos pela interface nativa e usam as operações públicas disponíveis depois. Não há SQL/Python arbitrário por chamada de módulo browser, permissão de GM implícita, mudança de campanha por UUID nem bypass de conteúdo privado. system.combat aceita iniciativa declarativa. Provedores Python existentes são código confiável de servidor; não justificam distribuir um novo RPG como sistema mais Server Rules separado. Uma necessidade sem contrato deve ser apresentada como limitação, preservando a versão solicitada.

## Como conferir a cobertura ao evoluir o host

Este mapa usa uma cópia versionada de frontend.json e registry.json em extension-contracts.json. Ao atualizar a documentação para outro host, compare os arquivos fonte e a revisão, atualize os projetos e execute suas receitas contra os serviços reais. Compatibilidade de nome não prova payload, permissão, efeito visual ou transação. Refaça testes de escrita e dados independentes em fixtures novas.
`:
`## How to use this map

This index crosses public contracts from host ${contracts.hostVersion}, revision ${contracts.sourceRevision.slice(0,7)}, with implementation projects. It covers **${documentedDomainMethods.length} domain API methods**, **${operations.length} original SDK operations**, **${Object.keys(contracts.surfaces).length} surfaces** and lifecycle helpers. Each method links to runnable code, inputs and a test, rather than promising arbitrary unsupported combinations.

Begin with the [outcome you want to build](docs:tutorial-index). Use this table to locate a specific capability. A recipe can combine create/configure/read/remove because they are parts of one feature. Actions execute on click and destructive operations are identified. Use a disposable installation/campaign.

## Choose the package structure

| Deliverable | Structure | Complete tutorial |
| --- | --- | --- |
| Journal, sheet, cards, audio or table tool | Browser package with entry and register | [First module](docs:tutorial-first-module) and families below |
| RPG sheets, types, initiative and catalog | One system package with entry/assets/content.compendiums | [Complete system](docs:tutorial-complete-system) |
| Translate your own module | Private api.i18n catalogs | [Translation and events](docs:tutorial-localization-events) |
| Add an installation language | locales package without system/Django | [Language package](docs:tutorial-language-package) |
| Trusted Python routes/services | Django package, owner/Runner activation | [Server integration](docs:tutorial-server-integration) |
| Distribute an approved release | Immutable ZIP, hash, signature and HTTPS catalog | [Publication](docs:tutorial-publish-module) |

There is no global module-type enum. A compendium can mean a mutable campaign pack, an installed system catalog or an operator-managed local catalog, with different rules. Mounting depends on its surface rather than your module’s label.

## Every domain method

Generic methods take api.domain.method(payload,{signal,requestId}) with recipe-specific fields. Reads do not need requestId. list/get project authorized state. actors.sheet, dice.roll, table.search, chat.remove and other convenience methods use their own demonstrated signatures. JavaScript method names differ from native Python action names.

${methodTables}

## Every original SDK operation

Use host.call(name,payload,{signal,onProgress}) with its corresponding contract. File/Blob must be real objects rather than JSON or local paths. Original DTOs/expectedRevision differ from domain version/sheetVersion; the linked projects demonstrate that difference.

${sdkTable}

## Every mounting surface

augment adds controls to native UI. replace owns the complete surface body and its navigation/actions. The [complete system](docs:tutorial-complete-system) demonstrates functional actor/token sheet replacement; an [existing-sheet action](docs:tutorial-sheet-module) uses augment. Each surface below has complete source files.

${surfaceTable}

## Local helpers and lifecycle

| Capability | Concrete API | Project to adapt |
| --- | --- | --- |
| Package files | assets.url / text / json / bytes | [Translation and assets](docs:tutorial-localization-events) |
| Stylesheet lifetime | styles.use and disposer | [First module](docs:tutorial-first-module) |
| Browser settings | storage.local.get / set / delete | [Persistence](docs:tutorial-storage) |
| Account/table settings | storage.user.get / set / delete / list | [Persistence](docs:tutorial-storage) |
| GM-shared settings | storage.table.get / set / delete / list | [Persistence](docs:tutorial-storage) |
| Settings UI | customize(context) and preferences | [Complete form](docs:tutorial-customize-ui) |
| Private catalogs | api.i18n.locale / t / has / number / register / onChange | [Translation](docs:tutorial-localization-events) |
| Native modal/closing | api.ui.openModal; close / suspend / resume; gravewright:sheet-flush | [Customize and modals](docs:tutorial-customize-ui) |
| Component registration | register, also exposed as UI registration during the register phase | [First module](docs:tutorial-first-module) |
| Authorized changes | api.events.on and unsubscribe | [Events](docs:tutorial-localization-events) |
| Legacy actor hints | events.on actor.created / actor.updated / actor.deleted | [Contract and limits](docs:modules#assets-persistence-and-events) |
| Coordinates/pan/zoom | viewport.sceneToViewport / viewportToScene; scene.viewport.changed | [Working overlay](docs:example-surface-scene-overlay) |
| Cancellation/disposal | signal and onDispose per mount; start / register / stop | [First module](docs:tutorial-first-module) |

Domain events include actors.changed, tokens.changed, maps.changed, maps.layersChanged, journals.changed, items.changed, combat.changed, cards.changed, audio.changed, compendiums.changed, chat.changed, chat.message, table.presence and table.lobbyChanged. They may coalesce invalidations and perform initial/reconnect reads. They are not exactly-once automation triggers. Dispose each subscription.

## Map Builder and visual automation

All four door/lever/torch/region owners, execution/data connections and 44 node.type values have [complete graphs, JSON and editor steps](docs:examples-blueprints). The [node catalog](docs:example-blueprint-nodes) explains targets, resources and effects. Use native Test behavior/playtest before live application. These graphs are development documents, not a browser API for importing arbitrary JSON or a new manifest field.

The [scene tutorial](docs:tutorial-maps) implements public layer/object operations. Adding new kinds or editor ports requires a core contribution and tests; 0.3.1 does not promise a plugin API for arbitrary node-type registration.

## Server integrations and release boundaries

The [Django integration](docs:tutorial-server-integration) implements Context.from_request, public commands, authenticated/CSRF routes and after-commit hooks. Python facades api.actors/tokens/maps/journals/items/combat/cards/audio/compendiums/resources/chat/dice/table/events have signatures in the [reference](docs:api#python-interface). Context retains IDs rather than cached authority, and each service checks access. Account/admin/package/campaign management are global application adapters rather than methods on a mount’s api; see [adapter reference](docs:api#account-campaign-owner-and-module-adapters) for operator tools.

There is no maps.create or audio.upload domain SDK method: tutorials prepare scenes/files through native UI and then use supported public operations. Browser modules do not receive arbitrary SQL/Python execution, implicit GM powers, campaign switching through foreign UUIDs or hidden-data bypasses. system.combat supports declarative initiative. Existing Python providers are trusted server code, not permission to distribute a new RPG as a system plus separate Server Rules companion. Explain unsupported requirements while preserving the requested host version.

## Maintain coverage when the host changes

This map uses a versioned frontend.json/registry.json snapshot in extension-contracts.json. For a host upgrade, compare actual source files/revisions, update projects and run their recipes against real services. Matching names alone does not prove payload, permission, visual or transaction behavior. Repeat mutation/snapshot tests in new fixtures.
`;
  return summary;
}
export const capabilityTutorialArticles=[{slug:'tutorial-capability-map',group:'tutorials',sourcePaths:['gravewright/modules/contracts/frontend.json','gravewright/modules/contracts/registry.json','gravewright/modules/static/gravewright_modules/domain-api.js','gravewright/modules/static/gravewright_modules/browser-bridge.js'],en:{title:'All extension capabilities and where to implement them',summary:'An explicit method-by-method map to projects, local helpers, surfaces, server integrations and release limits.',body:body('en')},pt:{title:'Todas as capacidades de extensão e onde implementá-las',summary:'Mapa explícito de cada método para seu projeto, helpers, superfícies, integrações de servidor e limites da release.',body:body('pt')}}];
