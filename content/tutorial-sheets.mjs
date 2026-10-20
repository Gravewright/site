// Original task-oriented tutorials; the package and listings share exact bytes.
import {tutorialLicense} from './tutorial-workbench.mjs';
const id='example.sheet-name';
const manifest={id,name:'Sheet name action',version:'1.0.0',sdk:{requires:'>=1.0.0 <2.0.0',tested:'1.0.0'},entry:'main.mjs',description:'Rename an actor or its independent token from an existing sheet, preserving data and revisions.',author:'Gravewright documentation',license:'MIT'};
const main=String.raw`export async function mountSheetName({root,context,api,signal,onDispose}) {
  const doc=root.ownerDocument;
  const t=key=>api.i18n.t(key);
  const el=(tag,text)=>{const node=doc.createElement(tag);if(text)node.textContent=text;return node;};
  const form=el('form');form.className='tutorial-sheet-name';
  form.setAttribute('aria-label',t('Sheet name action'));
  const title=el('h3',t('Sheet name action'));
  const label=el('label',t('Sheet name'));
  const input=el('input');input.type='text';input.maxLength=120;input.required=true;label.append(input);
  const saveButton=el('button',t('Save name'));saveButton.type='submit';
  const reloadButton=el('button',t('Reload server value'));reloadButton.type='button';
  const status=el('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  form.append(title,label,saveButton,reloadButton,status);root.append(form);
  onDispose(()=>form.remove());
  let current,dirty=false,pending,loading=false,ready=false,generation=0;
  const token=context.tokenId?{tokenId:context.tokenId}:{};
  function controls(){
    const edit=ready&&!loading&&!pending&&current?.canEdit;
    input.disabled=!edit;saveButton.disabled=!edit||!dirty;
    reloadButton.disabled=loading||!!pending;
  }
  function report(error){if(!signal.aborted)status.textContent=error.code||error.message||'unavailable';}
  function reject(message){const error=new Error(message);report(error);return Promise.reject(error);}
  async function load(){
    const ticket=++generation;loading=true;ready=false;controls();
    try {
      const sheet=await api.actors.sheet(context.actorId,token,{signal});
      if(signal.aborted||ticket!==generation)return;
      if(typeof sheet.name!=='string'||!sheet.data||typeof sheet.data!=='object'||Array.isArray(sheet.data))throw new Error('invalid_data');
      current=sheet;input.value=sheet.name;dirty=false;ready=true;
      status.textContent=t(sheet.canEdit?'Server value loaded.':'Read-only sheet.');
    } finally {if(ticket===generation&&!signal.aborted){loading=false;controls();}}
  }
  function save(){
    if(pending)return pending;
    if(!dirty)return Promise.resolve();
    if(!ready||!current?.canEdit)return reject('permission_denied');
    const name=input.value.trim();
    if(!name||Array.from(name).length>120)return reject(t('Use a name with 1 to 120 characters.'));
    const data=structuredClone(current.data),snapshot=!!current.tokenId;
    if(snapshot){
      if(current.tokenId!==context.tokenId)return reject('stale_context');
      if(data.token!==undefined&&(!data.token||typeof data.token!=='object'||Array.isArray(data.token)))return reject(t('This system uses an incompatible token field.'));
      data.token={...(data.token||{}),name};
    }
    const payload={actorId:context.actorId,...token,name:snapshot?current.name:name,
      version:current.version,sheetVersion:current.sheetVersion,data};
    const requestId=crypto.randomUUID();
    pending=(async()=>{
      try {
        await api.actors.saveSheet(payload,{requestId,signal});
        if(signal.aborted)return;
        await load();
        if(!signal.aborted)status.textContent=t(snapshot?'Saved independent token name.':'Saved actor name.');
      } catch(error){
        if(!signal.aborted){
          if(error.code==='conflict'){
            try {await load();if(!signal.aborted)status.textContent=t('Conflict: server value loaded. Review it and edit again.');}
            catch(refreshError){ready=false;report(refreshError);}
          } else {ready=false;report(error);}
        }
        throw error;
      } finally {pending=undefined;if(!signal.aborted)controls();}
    })();
    controls();return pending;
  }
  input.addEventListener('input',()=>{dirty=true;controls();},{signal});
  form.addEventListener('submit',event=>{event.preventDefault();void save().catch(()=>{});},{signal});
  reloadButton.addEventListener('click',()=>{void load().catch(report);},{signal});
  root.closest('.gw-window')?.addEventListener('gravewright:sheet-flush',event=>{
    if(pending)event.detail.waitUntil(pending);
    else if(dirty)event.detail.waitUntil(Promise.reject(new Error(t('Save the name or reload the server value before closing.'))));
  },{signal});
  controls();await load();
}

export default {
  start({styles,api}){
    styles.use('styles.css');
    const en={};
    const pt={
      'Sheet name action':'Ação no nome da ficha','Sheet name':'Nome da ficha',
      'Save name':'Salvar nome','Reload server value':'Recarregar valor do servidor',
      'Server value loaded.':'Valor do servidor carregado.','Read-only sheet.':'Ficha somente leitura.',
      'Saved actor name.':'Nome do ator salvo.','Saved independent token name.':'Nome do token independente salvo.',
      'Use a name with 1 to 120 characters.':'Use um nome com 1 a 120 caracteres.',
      'This system uses an incompatible token field.':'Este sistema usa um campo token incompatível.',
      'Conflict: server value loaded. Review it and edit again.':'Conflito: valor do servidor carregado. Revise e edite novamente.',
      'Save the name or reload the server value before closing.':'Salve o nome ou recarregue o valor do servidor antes de fechar.'
    };
    for(const key of Object.keys(pt))en[key]=key;
    api.i18n.register({en,'pt-BR':pt});
  },
  register({register}){
    register('actor.sheet',{mode:'augment',mount:mountSheetName});
    register('token.sheet',{mode:'augment',mount:mountSheetName});
  },
  stop(){}
};
`;
const css=String.raw`[data-module-id="example.sheet-name"] .tutorial-sheet-name { padding: var(--space-4); margin: var(--space-2); border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text); font: 14px/1.5 system-ui, sans-serif; }
[data-module-id="example.sheet-name"] .tutorial-sheet-name h3 { font-size: 16px; margin: var(--space-0) var(--space-0) var(--space-3); }
[data-module-id="example.sheet-name"] .tutorial-sheet-name label { display: block; }
[data-module-id="example.sheet-name"] .tutorial-sheet-name input { display: block; box-sizing: border-box; width: 100%; max-width: 400px; }
[data-module-id="example.sheet-name"] .tutorial-sheet-name :is(input,button) { font: inherit; padding: var(--space-2); margin: var(--space-1) var(--space-1) var(--space-1) var(--space-0); border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: inherit; }
[data-module-id="example.sheet-name"] .tutorial-sheet-name :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
[data-module-id="example.sheet-name"] .tutorial-sheet-name [role=status] { overflow-wrap: anywhere; }
`;
const readme=`Sheet name action, target Gravewright 0.3.0 / SDK 1.x.

ZIP the contents of this folder, with manifest.json directly at its root.
An installation owner reviews and installs the ZIP under Modules, Install module,
Install from ZIP. A GM activates example.sheet-name version 1.0.0 in the campaign.
Open an actor or token sheet and find Sheet name action below the existing sheet.

Save native sheet edits first. Click Reload server value, edit Sheet name, then
Save name. Do not edit the native form and this panel simultaneously. Every save
sends both revisions read by actors.sheet and preserves all other JSON data.
Snapshot tokens use data.token.name; linked tokens rename their actor. An existing
nonobject data.token is rejected rather than replaced. The server checks access.

Closing waits for a pending save. An unsaved name blocks closing until Save name
or Reload server value. Conflicts reload the server value and never retry a write.
On an uncertain network failure, reload before editing again. Deactivation aborts
pending client work but cannot undo a write the server already committed.

See the bilingual tutorial-sheet-module guide for complete instructions and tests.
`;
export const tutorialSheetPackages=[{id,slug:'tutorial-sheet-module',manifest,files:{'manifest.json':JSON.stringify(manifest,null,2)+'\n','main.mjs':main,'styles.css':css,'LICENSE.txt':tutorialLicense,'README.md':readme}}];
const fence=(lang,value)=>'```'+lang+'\n'+value.trimEnd()+'\n```';
const labels={en:{title:'How to create a module that acts on a sheet',summary:'Start with an empty folder and ship a working rename action on existing actor and token sheets.'},pt:{title:'Como criar um módulo que atua na ficha',summary:'Comece com uma pasta vazia e entregue uma ação real para renomear atores e tokens na ficha existente.'}};
function body(locale){
  const pt=locale==='pt',s=(en,br)=>pt?br:en;
  const file=name=>`../../assets/tutorials/${id}/${name}`;
  return [
    `## ${s('The result you will build','O resultado que você vai construir')}`,
    s('Add a **Sheet name action** form below the existing sheet. It reads the authorized document, enables editing only when `canEdit` is true, saves a new name and reloads the committed value. It registers both `actor.sheet` and `token.sheet`, so this is an action on real documents rather than a disconnected example label.','Adicione o formulário **Ação no nome da ficha** abaixo da ficha existente. Ele lê o documento autorizado, permite edição quando `canEdit` é verdadeiro, salva um nome novo e recarrega o valor confirmado. Registra `actor.sheet` e `token.sheet`: a ação atua em documentos reais.'),
    s('Use a disposable campaign on Gravewright **0.3.0**, SDK **1.x**, an owner account to install and a GM account to activate. Any system can use the actor rename. Independent tokens use the host presentation convention `data.token.name`; if a system occupies `token` with a nonobject value, the example refuses that snapshot change. No rulebook content or RPG attribute is added.','Use uma campanha descartável no Gravewright **0.3.0**, SDK **1.x**, uma conta de dono para instalar e uma de mestre para ativar. A renomeação de ator funciona em qualquer sistema. Tokens independentes usam a convenção de apresentação do host `data.token.name`; se um sistema ocupar `token` com um valor que não seja objeto, o exemplo recusa essa alteração de snapshot. Não acrescenta conteúdo de livro nem atributo de RPG.'),
    `## ${s('1. Create the folder and all five files','1. Crie a pasta e os cinco arquivos')}`,
    `[${s('Download the complete source ZIP','Baixar ZIP completo dos fontes')}](${file(id+'-source.zip')})`,
    fence('text',`${id}/\n  manifest.json\n  main.mjs\n  styles.css\n  LICENSE.txt\n  README.md`),
    s('Create a folder named `example.sheet-name`. Save the listings below as UTF-8 files. The package needs no npm, bundler, Python app or server restart. You can also download each original file:','Crie uma pasta chamada `example.sheet-name`. Salve os arquivos abaixo em UTF-8. O pacote não exige npm, bundler, app Python nem reinício do servidor. Você também pode baixar cada arquivo original:'),
    Object.keys(tutorialSheetPackages[0].files).map(name=>`[${name}](${file(name)})`).join(' · '),
    '### manifest.json',fence('json',JSON.stringify(manifest,null,2)),
    '### main.mjs',fence('javascript',main),
    '### styles.css',fence('css',css),
    '### LICENSE.txt',fence('text',tutorialLicense),
    '### README.md',fence('text',readme),
    `## ${s('2. Build a ZIP with the manifest at its root','2. Monte o ZIP com o manifesto na raiz')}`,
    s('From the directory containing `example.sheet-name`, run one of these commands. The output ZIP is a sibling of the source folder; it is never included inside itself.','A partir da pasta que contém `example.sheet-name`, execute um dos comandos. O ZIP de saída fica ao lado da pasta dos fontes e não entra dentro de si mesmo.'),
    fence('powershell',`Compress-Archive -LiteralPath './example.sheet-name/manifest.json','./example.sheet-name/main.mjs','./example.sheet-name/styles.css','./example.sheet-name/LICENSE.txt','./example.sheet-name/README.md' -DestinationPath './example.sheet-name-source.zip'`),
    fence('sh',`(cd example.sheet-name && zip ../example.sheet-name-source.zip manifest.json main.mjs styles.css LICENSE.txt README.md)`),
    `## ${s('3. Install, activate and open an existing sheet','3. Instale, ative e abra uma ficha existente')}`,
    s('1. Sign in as the installation owner. Open **Modules**, **Install module**, **Install from ZIP** and choose the ZIP. Review the trusted source before uploading. This local route does not require a catalog signature.\n2. Open the disposable campaign as GM. Open its **Modules / Extensions** list, activate **Sheet name action 1.0.0**, and keep the system that already owns the campaign. Installing a package alone does not activate it.\n3. Open **Actors**, create a character using that system or open an existing one, then open its sheet. Scroll below the original content to **Sheet name action**.\n4. Save any pending edits through the original sheet first, then click **Reload server value** in this panel. Change **Sheet name** to `Harbor Scout` and click **Save name**. Expect **Saved actor name.** Close and reopen the sheet and confirm the name.','1. Entre como dono da instalação. Abra **Módulos**, **Instalar módulo**, **Instalar por ZIP** e escolha o ZIP. Revise os fontes confiáveis antes do envio. Esse caminho local não exige assinatura de catálogo.\n2. Abra a campanha descartável como mestre. Na lista de **Módulos / Extensões**, ative **Sheet name action 1.0.0** e mantenha o sistema já escolhido pela campanha. Instalar o pacote não o ativa.\n3. Abra **Atores**, crie um personagem com o sistema ou abra um já existente e abra sua ficha. Role abaixo do conteúdo original até **Ação no nome da ficha**.\n4. Salve primeiro as edições pendentes na ficha original e clique em **Recarregar valor do servidor** neste painel. Troque **Nome da ficha** para `Batedor do Porto` e clique em **Salvar nome**. Espere **Nome do ator salvo.** Feche, reabra e confira o nome.'),
    `## ${s('4. Understand exactly what gets written','4. Entenda exatamente o que é gravado')}`,
    s('`actors.sheet(actorId, {tokenId}, {signal})` supplies the data and both revisions. For an actor, or a linked token, `saveSheet` receives the new `name`, the exact `version` and `sheetVersion`, and a deep copy of all existing `data`. For an independent token, the server returns its own `tokenId` and snapshot `sheetVersion`; the code changes only `data.token.name`, preserving all other snapshot fields and token hints. The actor is left untouched. The scoped API fixes campaign and scene identity; the server rechecks ownership.','`actors.sheet(actorId, {tokenId}, {signal})` fornece os dados e as duas revisões. Para ator ou token vinculado, `saveSheet` recebe o novo `name`, `version` e `sheetVersion` exatos e uma cópia profunda de todos os `data` existentes. Para token independente, o servidor devolve seu `tokenId` e `sheetVersion` do snapshot; o código altera somente `data.token.name`, preservando os demais dados e opções do token. O ator permanece intacto. A API da montagem fixa mesa e cena; o servidor verifica novamente a propriedade.'),
    s('This public API does not expose another package’s unsaved editor buffer. Save the original sheet before reloading this panel and avoid editing both forms at once. A concurrently committed edit produces `conflict`; the panel loads current state, discards its old name draft and requires a new explicit edit. It never substitutes a newer expected revision to force the failed write.','A API pública não expõe o rascunho não salvo do editor de outro pacote. Salve a ficha original antes de recarregar este painel e evite editar os dois formulários ao mesmo tempo. Uma alteração concorrente confirmada produz `conflict`; o painel carrega o estado atual, descarta seu rascunho antigo e exige nova edição explícita. Não troca a revisão esperada para forçar a gravação que falhou.'),
    `## ${s('5. Verify tokens, permissions, conflicts and closing','5. Verifique tokens, permissões, conflitos e fechamento')}`,
    s('1. Place a linked token and an independent token for the same actor. Rename the linked one: reopening the actor must show that name. Rename the independent one: only its own name must change. Compare existing sheet fields and token hints before and after.\n2. Use a player with read-only access. The form displays **Read-only sheet.** and disables editing. A player with ownership can use the action; the server remains the permission boundary.\n3. Open the same actor in two sessions. Save a name in one, then save the stale draft in the other. Expect the server value to reload and a conflict message, with no automatic overwrite.\n4. Type without saving, then close. The window stays open and asks you to save or reload. **Reload server value** explicitly discards that draft. During a pending save, the native `gravewright:sheet-flush` lifecycle waits for its promise; a failed save keeps the window open.\n5. Deactivate while a read is pending, reopen the sheet three times and switch scenes. No removed panel may reappear, no listener may survive disposal, and no duplicate form may accumulate. A server write already committed is not undone by browser cancellation.','1. Coloque um token vinculado e um independente do mesmo ator. Renomeie o vinculado: o ator reaberto deve ter esse nome. Renomeie o independente: somente seu próprio nome deve mudar. Compare dados da ficha e opções do token antes e depois.\n2. Use um jogador com acesso somente leitura. O formulário mostra **Ficha somente leitura.** e bloqueia edição. Um jogador proprietário pode usar a ação; o servidor continua responsável pela permissão.\n3. Abra o mesmo ator em duas sessões. Salve um nome em uma e tente salvar o rascunho desatualizado na outra. O valor do servidor deve ser recarregado com mensagem de conflito, sem sobrescrita automática.\n4. Digite sem salvar e tente fechar. A janela permanece aberta e pede salvar ou recarregar. **Recarregar valor do servidor** descarta esse rascunho explicitamente. Durante uma gravação pendente, `gravewright:sheet-flush` aguarda sua promessa; falhas mantêm a janela aberta.\n5. Desative durante uma leitura, abra a ficha três vezes e troque de cena. Painéis removidos não devem reaparecer, listeners devem encerrar e formulários não devem se acumular. Cancelar no navegador não desfaz uma gravação já confirmada no servidor.'),
    `## ${s('Augment, replace and release updates','Augment, replace e atualização de versão')}`,
    s('Use `augment` for an extra action on another system’s working sheet, as here. It gets a dedicated root after native content and does not hide the editor. Use `replace` only when you provide the whole sheet body, including loading, editing, saving, validation and navigation. A system can filter actor types with `types`; generic add-ons should not assume a type. The campaign system’s sheet takes precedence by default; competing replacement candidates use the table’s explicit replacement preferences. See the [complete replacement tutorial](docs:tutorial-system-sheet) and [SDK selection rules](docs:modules#available-surfaces).','Use `augment` para acrescentar uma ação à ficha funcional de outro sistema, como aqui. Ele recebe uma raiz própria depois do conteúdo nativo e mantém o editor. Use `replace` apenas ao implementar o corpo inteiro da ficha, com leitura, edição, gravação, validação e navegação. Sistemas podem filtrar tipos com `types`; complementos genéricos não devem presumir um tipo. A ficha do sistema da campanha tem preferência por padrão; candidatos concorrentes usam a preferência explícita de substituição da mesa. Veja o [tutorial de substituição completa](docs:tutorial-system-sheet) e as [regras do SDK](docs:modules).'),
    s('For a new package revision, change `version` to `1.0.1`, rebuild the ZIP, install it and select that exact version in the campaign. Do not edit extracted installed files or overwrite the same ID/version with different bytes. Read and verify existing data after the upgrade.','Para atualizar o pacote, mude `version` para `1.0.1`, gere o ZIP novamente, instale e selecione essa versão exata na campanha. Não edite arquivos instalados extraídos nem substitua o mesmo ID/versão por bytes diferentes. Leia e confira os dados existentes depois da atualização.'),
    `## ${s('How to use AI to add another sheet action','Como usar a IA para adicionar outra ação na ficha')}`,
    fence('text',s('Use this complete example.sheet-name package on Gravewright 0.3.0. Add [one concrete action] to actor.sheet and token.sheet without replacing their editor. Read actors/services.py, domain-api.js and both context schemas first. Explain actor versus linked and independent token writes, preserve data and both loaded revisions, allocate a new request UUID per logical save, handle conflict without forcing a write, support read-only ownership, native sheet-flush and disposal. Do not invent access to another package’s unsaved buffer. Deliver all files, ZIP instructions and behavior tests, with limitations and actual validation results.','Use este pacote completo example.sheet-name no Gravewright 0.3.0. Adicione [uma ação concreta] em actor.sheet e token.sheet sem substituir o editor. Leia actors/services.py, domain-api.js e os dois schemas de contexto antes. Explique gravação em ator, token vinculado e independente; preserve dados e as duas revisões lidas, gere UUID novo por salvamento lógico, trate conflito sem forçar gravação, suporte somente leitura, sheet-flush nativo e liberação de recursos. Não invente acesso ao rascunho de outro pacote. Entregue todos os arquivos, instruções de ZIP e testes de comportamento, com limitações e validações executadas.')),
    `[${s('All tutorials','Todos os tutoriais')}](docs:tutorial-index) · [${s('First module','Primeiro módulo')}](docs:tutorial-first-module) · [API](docs:api)`
  ].join('\n\n');
}
const replacement={
  en:{title:'How to build and replace a complete system sheet',summary:'Use the working Example Expedition package, install it, create actors and verify linked and independent tokens.',body:`## Start with the complete system package

The [Example Expedition package](docs:example-package-system) contains a complete original character/NPC sheet with a validated stamina field, its manifest, styles and license. Download that package rather than copying only a register call. Follow its exact file listings and ZIP instructions. This tutorial targets Gravewright 0.3.0 and adds no RPG catalog.

## Install and create a campaign

1. As the installation owner, open Systems, Install system, Install from ZIP and choose the reviewed system-source.zip. Its manifest declares system.actorTypes, system.itemTypes and the browser entry.
2. As GM, create a disposable campaign and select Example Expedition as its system. Open the table and confirm the exact installed release is active. An unrelated add-on does not become a system by registering a sheet.
3. In Actors, create a character and an NPC. Open both. The package registers replace for actor.sheet and token.sheet, filtered to character and npc. The host provides the window title and controls; the package renders the complete body.

## Exercise the complete editing flow

Enter stamina 17, save, close and reopen. Try empty, negative and greater-than-100 values; rejected drafts must not replace server data. Open a read-only player view. Create one linked and one independent token for the same character and change stamina separately. Linked sheets share actor data; the independent token uses its snapshot and its own sheetVersion. The package must preserve all other data and supply both revisions to saveSheet.

## Choose the correct replacement

With no explicit competing preference, a matching campaign system sheet wins. A system may register disjoint types lists; omit types only when it implements every actor type. If two modules compete for the same surface, review the table replacement preference rather than assuming load order. Explicit token.sheet handles tokens; an actor.sheet replacement can be the system fallback for tokens when there is no matching token registration. Native UI is restored after a failed selected mount. [Read the SDK rules](docs:modules).

Keep a rename add-on such as [Sheet name action](docs:tutorial-sheet-module) in augment mode. Two full replacements cannot display as one merged editor. Save the system sheet before using an add-on that sends its own complete sheet data.

## Validate an update

Change the package version, rebuild and install the new ZIP, then explicitly activate the new release. Do not mutate installed bytes. Open old characters and both token modes, preserve stamina, test two-session conflicts and close while saving. A failure must keep the window open or restore the native surface, with an actionable diagnostic. Deactivation must abort reads and remove DOM/listeners. Keep this system’s assets, translations and automation in one package and use only host APIs available in 0.3.0.

## How to use AI for a complete replacement

\`\`\`text
Use the full Example Expedition source package on Gravewright 0.3.0. Add one original sheet field and its validation while preserving character/NPC types, actor and token reads, revisions, native sheet-flush, permissions and disposal. Explain every changed file. Do not ship a placeholder replacement, split system rules into a companion package, import private host internals or upgrade the host. Verify create, edit, save, close, reopen, linked/snapshot tokens and conflicting sessions.
\`\`\`

[All tutorials](docs:tutorial-index) · [Complete source package](docs:example-package-system)`},
  pt:{title:'Como criar e substituir uma ficha completa de sistema',summary:'Use o pacote funcional Example Expedition, instale, crie atores e verifique tokens vinculados e independentes.',body:`## Comece pelo pacote completo do sistema

O [pacote Example Expedition](docs:example-package-system) contém uma ficha original completa de personagem/NPC, com campo de vigor validado, manifesto, estilos e licença. Baixe esse pacote em vez de copiar só uma chamada de registro. Siga os arquivos completos e as instruções de ZIP do guia. O alvo é o Gravewright 0.3.0, sem catálogo de RPG.

## Instale e crie uma campanha

1. Como dono, abra Sistemas, Instalar sistema, Instalar por ZIP e escolha system-source.zip depois de revisar os fontes. O manifesto declara system.actorTypes, system.itemTypes e a entrada de navegador.
2. Como mestre, crie uma campanha descartável e escolha Example Expedition como sistema. Abra a mesa e confira que a versão instalada está ativa. Registrar uma ficha não transforma um complemento em sistema.
3. Em Atores, crie um personagem e um NPC. Abra os dois. O pacote registra replace em actor.sheet e token.sheet com filtro character e npc. O host fornece título e controles da janela; o pacote desenha o corpo completo.

## Execute o fluxo completo de edição

Digite vigor 17, salve, feche e reabra. Teste vazio, negativo e acima de 100; rascunhos rejeitados não podem substituir dados do servidor. Abra como jogador somente leitura. Crie um token vinculado e outro independente do mesmo personagem e altere vigor separadamente. A ficha vinculada compartilha o ator; o token independente usa snapshot e sheetVersion próprios. O pacote deve preservar os demais dados e enviar as duas revisões a saveSheet.

## Escolha a substituição correta

Sem preferência concorrente explícita, a ficha correspondente do sistema da campanha tem prioridade. Um sistema pode registrar listas types separadas; omita types apenas se implementar todos os tipos de ator. Se dois módulos disputarem a mesma superfície, revise a preferência de substituição da mesa em vez de presumir ordem de carregamento. token.sheet explícito atende tokens; actor.sheet pode servir como alternativa do sistema quando não houver registro correspondente de token. Uma falha na substituição escolhida restaura a interface nativa. [Leia as regras do SDK](docs:modules).

Mantenha complementos como [Ação no nome da ficha](docs:tutorial-sheet-module) em augment. Duas substituições completas não se tornam um editor mesclado. Salve a ficha do sistema antes de usar um complemento que envia sua própria cópia completa dos dados.

## Valide uma atualização

Mude a versão do pacote, gere e instale outro ZIP e ative explicitamente a versão nova. Não altere arquivos instalados. Abra personagens antigos e os dois modos de token; preserve vigor, teste conflito entre sessões e feche durante a gravação. Falhas devem manter a janela aberta ou restaurar a superfície nativa, com diagnóstico útil. Desativar deve abortar leituras e remover elementos/listeners. Mantenha recursos, traduções e automações desse sistema no mesmo pacote e use somente as APIs disponíveis na 0.3.0.

## Como usar a IA para uma substituição completa

\`\`\`text
Use o pacote completo Example Expedition no Gravewright 0.3.0. Acrescente um campo original e sua validação, preservando tipos character/NPC, leitura de ator e token, revisões, sheet-flush nativo, permissões e liberação de recursos. Explique cada arquivo alterado. Não entregue uma substituição vazia, separe regras em pacote complementar, importe partes privadas do host nem atualize o VTT. Verifique criar, editar, salvar, fechar, reabrir, tokens vinculados/independentes e sessões conflitantes.
\`\`\`

[Todos os tutoriais](docs:tutorial-index) · [Pacote-fonte completo](docs:example-package-system)`}
};
const sourcePaths=['gravewright/actors/services.py','gravewright/actors/static/gravewright_actors/sheet.js','gravewright/modules/static/gravewright_modules/domain-api.js','gravewright/modules/contracts/schemas/actor.sheet.context.json','gravewright/modules/contracts/schemas/token.sheet.context.json','docs/en/modules.md'];
export const tutorialSheetArticles=[{slug:'tutorial-sheet-module',group:'tutorials',sourcePaths,en:{...labels.en,body:body('en')},pt:{...labels.pt,body:body('pt')}},{slug:'tutorial-system-sheet',group:'tutorials',sourcePaths,...replacement}];
