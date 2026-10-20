import {makeWorkbenchTutorial} from './tutorial-workbench.mjs';
const field=(name,label,value='',type='text',required=true)=>({name,label,value,type,required});
function recipe(id,en,pt,fields,code,instructions,expected,verify){
  return {id,fields,code,en:{title:en,instruction:instructions[0],expected:expected[0],verify:verify[0]},pt:{title:pt,instruction:instructions[1],expected:expected[1],verify:verify[1]}};
}
const actorRecipes=[
  recipe('inspect','Inspect actor types, documents and folders','Consultar tipos, documentos e pastas',[],`async ({api,signal}) => {
  const state=await api.actors.state({}, {signal});
  return {actorTypes:state.actorTypes,actors:state.actors,folders:state.folders,players:state.players,isGM:state.is_gm};
}`,['Run this first. The actorType comes from the selected system; copy an existing actor ID for later steps.','Execute primeiro. actorType vem do sistema selecionado; copie um ID de ator existente para as próximas ações.'],['A projected directory, registered type IDs and player IDs. Sheet bodies are read separately.','Diretório projetado, tipos registrados e IDs dos jogadores. O corpo da ficha é lido separadamente.'],['Compare with Actors as GM and as player. Listing-only entries have canOpen:false.','Compare com Actors como GM e jogador. Entradas só de listagem têm canOpen:false.']),
  recipe('create','Create an actor using the selected system','Criar ator com o tipo do sistema selecionado',[field('name','Actor name','Workshop scout')],`async ({api,signal},v) => {
  const state=await api.actors.state({}, {signal});
  if(!state.is_gm) throw new Error('GM required');
  const type=state.actorTypes[0]?.id;
  if(!type) throw new Error('Select a system declaring actor types first');
  const created=await api.actors.create({name:v.name,type,data:{}},{requestId:crypto.randomUUID(),signal});
  return api.actors.get(created.id,{}, {signal});
}`,['Enter a fictional name; create only a disposable actor. This uses the first real registered type, not an assumed RPG type.','Informe nome fictício; crie apenas um ator descartável. A receita usa o primeiro tipo registrado de verdade, sem presumir um RPG.'],['The created actor metadata including its ID.','Metadados do novo ator e seu ID.'],['Open Actors, find Workshop scout and open its native/system sheet.','Abra Actors, encontre Workshop scout e abra a ficha nativa/do sistema.']),
  recipe('rename','Rename an actor with an explicit revision','Renomear ator com revisão explícita',[field('id','Actor ID'),field('name','New name','Workshop navigator')],`async ({api,signal},v) => {
  const before=await api.actors.get(v.id,{}, {signal});
  await api.actors.update(v.id,{name:v.name,version:before.version},{requestId:crypto.randomUUID(),signal});
  return api.actors.get(v.id,{}, {signal});
}`,['Paste the ID created above and a new name. Only metadata changes; use saveSheet when editing system data.','Cole o ID criado acima e um novo nome. Só os metadados mudam; dados do sistema usam saveSheet.'],['The same ID, new name and a new version.','Mesmo ID, novo nome e nova versão.'],['Refresh the directory. An old version must return conflict, never a silent forced update.','Atualize o diretório. Revisão antiga deve retornar conflict, sem gravação forçada.']),
  recipe('folder-create','Create and identify an actor folder','Criar e identificar pasta de atores',[field('name','Folder name','Workshop actors')],`async ({api,signal},v) => {
  const before=await api.actors.state({}, {signal});
  if(!before.is_gm) throw new Error('GM required');
  await api.actors.createFolder({name:v.name,color:'#b49a5a'},{requestId:crypto.randomUUID(),signal});
  const after=await api.actors.state({}, {signal});
  return after.folders.filter(folder=>!before.folders.some(old=>old.id===folder.id));
}`,['Choose an original folder name. The service does not promise an ID in every command result, so find the newly added folder in state.','Escolha nome original. Nem todo comando retorna ID, por isso a receita encontra a pasta nova no state.'],['A newly created folder and its real UUID.','Pasta criada e seu UUID real.'],['Find the same folder in Actors; copy its ID.','Encontre a pasta em Actors e copie o ID.']),
  recipe('folder-edit','Rename a folder and move an actor into it','Renomear pasta e mover ator para ela',[field('folderId','Folder ID'),field('actorId','Actor ID'),field('name','Folder name','Workshop party')],`async ({api,signal},v) => {
  await api.actors.updateFolder({id:v.folderId,name:v.name,parentId:null,color:'#b49a5a'},{requestId:crypto.randomUUID(),signal});
  const actor=await api.actors.get(v.actorId,{}, {signal});
  await api.actors.update(actor.id,{folderId:v.folderId,version:actor.version},{requestId:crypto.randomUUID(),signal});
  return api.actors.state({}, {signal});
}`,['Use the disposable folder and actor IDs. parentId:null moves the folder to the root. Nesting is bounded by the service.','Use IDs da pasta e ator descartáveis. parentId:null coloca a pasta na raiz; a profundidade é limitada pelo serviço.'],['Actor folderId now matches the folder.','folderId do ator aponta para a pasta.'],['Expand the folder in Actors and find the actor inside.','Expanda a pasta em Actors e confira o ator dentro.']),
  recipe('permissions','Grant one player read access','Conceder leitura a um jogador',[field('actorId','Actor ID'),field('userId','Player user ID')],`async ({api,signal},v) => {
  const actor=await api.actors.get(v.actorId,{}, {signal});
  if(!actor.permissions) throw new Error('GM projection required');
  await api.actors.setPermissions({id:actor.id,version:actor.version,permissions:{...actor.permissions,[v.userId]:'read'}},{requestId:crypto.randomUUID(),signal});
  return api.actors.get(actor.id,{}, {signal});
}`,['Copy a real player ID from Inspect, not an actor ID. Merge the existing permission map to preserve other grants.','Copie ID de jogador em Consultar, não ID de personagem. A receita mescla o mapa para preservar as demais permissões.'],['The GM sees the retained permission map with the new read grant.','GM vê o mapa preservado com a nova permissão de leitura.'],['Open a second player session: reading succeeds, saving the sheet remains denied.','Abra segunda sessão do jogador: leitura funciona e gravação da ficha continua negada.']),
  recipe('delete-folder','Remove only the disposable actor folder','Remover apenas a pasta de teste',[field('folderId','Folder ID'),field('confirm','I chose the disposable folder',false,'checkbox',false)],`async ({api,signal},v) => {
  if(!v.confirm) throw new Error('Select the disposable folder confirmation');
  await api.actors.deleteFolder({id:v.folderId,recursive:false},{requestId:crypto.randomUUID(),signal});
  return api.actors.state({}, {signal});
}`,['Confirm a folder you created in this tutorial. recursive:false preserves actors; never use recursive:true as an unrelated cleanup shortcut.','Confirme a pasta criada no tutorial. recursive:false preserva atores; não use recursive:true como atalho para limpeza.'],['The folder disappears; its actors survive with native folder-removal behavior.','Pasta desaparece; atores permanecem conforme remoção nativa.'],['Check that your disposable actor remains in Actors.','Confira que o ator descartável continua em Actors.']),
  recipe('delete-actor','Delete the disposable actor','Excluir o ator de teste',[field('id','Actor ID'),field('confirm','I chose the disposable actor',false,'checkbox',false)],`async ({api,signal},v) => {
  if(!v.confirm) throw new Error('Select the disposable actor confirmation');
  await api.actors.delete({id:v.id},{requestId:crypto.randomUUID(),signal});
  return api.actors.list({}, {signal});
}`,['Use only the actor created above. Deleting an actor can also remove its tokens through native domain services.','Use apenas o ator criado acima. A exclusão também pode remover tokens pelos serviços nativos.'],['The actor no longer appears in the authorized list.','Ator ausente da lista autorizada.'],['Refresh Actors and the test scene. No user data outside this test should be selected.','Atualize Actors e a cena de teste. Não selecione dados fora deste exemplo.']),
];

const storageRecipes=[
  recipe('user-read','Read personal settings and list their keys','Ler preferências pessoais e listar chaves',[],`async ({storage}) => {
  return {current:await storage.user.get('workshop.preferences'),keys:await storage.user.list('workshop.')};
}`,['Run before saving. A missing key returns null; this is different from an unavailable storage service.','Execute antes de salvar. Chave ausente retorna null; isso não é falha de armazenamento.'],['null on first use and a key/revision list.','null no primeiro uso e lista de chaves/revisões.'],['Repeat as another account or in another campaign; server-backed user storage is separated.','Repita em outra conta ou campanha; armazenamento pessoal do servidor é separado.']),
  recipe('user-set','Save a versioned personal setting with CAS','Salvar preferência pessoal versionada com CAS',[field('label','Panel label','My campaign notes')],`async ({storage},v) => {
  const current=await storage.user.get('workshop.preferences');
  if(current && current.value?.schema!==1) throw new Error('Unsupported settings schema; migrate explicitly');
  return storage.user.set('workshop.preferences',{schema:1,label:v.label},{expectedRevision:current?.revision??null});
}`,['Choose a label. Read supplies the expected revision; a concurrent edit causes conflict. Do not replace that revision and retry automatically.','Escolha o rótulo. A leitura fornece expectedRevision; alteração concorrente gera conflict. Não substitua a revisão para repetir automaticamente.'],['Stored value and new opaque revision, retained across deactivation.','Valor e nova revisão opaca, preservados ao desativar.'],['Read again, deactivate/reactivate and compare. Simulate two reads before two writes; the second stale write must fail.','Leia novamente, desative/ative e compare. Faça duas leituras antes de duas gravações; a segunda desatualizada deve falhar.']),
  recipe('user-delete','Delete only this tutorial preference','Apagar apenas a preferência deste tutorial',[],`async ({storage}) => {
  const current=await storage.user.get('workshop.preferences');
  if(current) await storage.user.delete('workshop.preferences',{expectedRevision:current.revision});
  return storage.user.get('workshop.preferences');
}`,['Delete uses the latest revision of one exact key. No other module or campaign preference is removed.','A exclusão usa a revisão atual de uma chave exata. Nenhuma preferência de outro módulo/campanha é removida.'],['null.','null.'],['Read and list again; the tutorial key is absent.','Leia e liste novamente; a chave do tutorial desapareceu.']),
  recipe('table-store','Share one GM-authored setting with the table','Compartilhar uma configuração do GM com a mesa',[field('label','Shared label','Workshop rules of courtesy')],`async ({api,storage,signal},v) => {
  if(!(await api.actors.state({}, {signal})).is_gm) return {readOnly:true,current:await storage.table.get('workshop.shared')};
  const current=await storage.table.get('workshop.shared');
  const saved=await storage.table.set('workshop.shared',{schema:1,label:v.label},{expectedRevision:current?.revision??null});
  return {saved,keys:await storage.table.list('workshop.')};
}`,['GM writes; players take the read-only branch. This is shared module JSON, not permission to change unrelated documents.','GM grava; jogadores seguem o ramo de leitura. É JSON compartilhado do módulo, sem autorizar alterações de documentos.'],['GM receives the saved revision; player receives that same shared value.','GM recebe a revisão; jogador recebe o mesmo valor compartilhado.'],['Use two accounts in the same campaign. Direct player storage.table.set must be rejected server-side.','Use duas contas na mesma campanha. storage.table.set direto de jogador deve ser recusado no servidor.']),
  recipe('table-delete','Remove the shared tutorial key','Remover a chave compartilhada do tutorial',[],`async ({storage}) => {
  const current=await storage.table.get('workshop.shared');
  if(current)await storage.table.delete('workshop.shared',{expectedRevision:current.revision});
  return storage.table.get('workshop.shared');
}`,['Run as GM after testing the shared value.','Execute como GM depois de conferir o valor compartilhado.'],['null; a player cannot delete this key.','null; jogador não pode apagar esta chave.'],['Read as a player after GM deletion.','Leia como jogador depois da exclusão pelo GM.']),
  recipe('local','Use browser-local settings and clear them','Usar configuração local do navegador e limpá-la',[field('density','Local density','compact')],`async ({storage},v) => {
  await storage.local.set('workshop.local',{schema:1,density:v.density});
  const value=await storage.local.get('workshop.local');
  await storage.local.delete('workshop.local');
  return {observed:value,afterDelete:await storage.local.get('workshop.local')};
}`,['Only UI choices belong here. This namespace is module+browser origin, shared across accounts and tables in that browser.','Guarde apenas escolha de interface aqui. O namespace é módulo+origem e é compartilhado entre contas e mesas no navegador.'],['observed contains the choice and afterDelete is null. Local storage has no CAS revision.','observed contém a escolha e afterDelete é null. Armazenamento local não usa revisão CAS.'],['Do not store private notes, permissions or account secrets in this namespace.','Não armazene notas privadas, permissões ou segredos da conta neste namespace.']),
];

const assetRecipes=[
  recipe('list','List reusable campaign assets','Listar arquivos reutilizáveis da campanha',[],`async ({host,signal}) => host.call('asset.list',{}, {signal})`,['Use a test campaign with a native-supported asset, such as an original PDF in the PDF system. This operation lists unattached actor-template assets, not every map/audio file.','Use campanha com arquivo nativo suportado, como PDF original no sistema PDF. A operação lista arquivos de modelo de ator sem ator associado, não todo mapa/áudio.'],['items with id, name, contentType and createdAt.','items com id, name, contentType e createdAt.'],['Compare the native asset/template library; an empty array is valid.','Compare com a biblioteca nativa de modelos/arquivos; array vazio é válido.']),
  recipe('upload','Upload a real provider-supported file','Enviar arquivo real suportado por um provedor',[field('file','Original supported file','','file')],`async ({host,signal},v) => {
  if(!(v.file instanceof File)) throw new Error('Choose a file');
  return host.call('asset.upload',{file:v.file},{signal});
}`,['Choose your own small valid PDF on a PDF campaign. asset.upload selects a registered content provider and its validator; it is not an arbitrary binary file store.','Escolha PDF pequeno e válido de sua autoria em campanha PDF. asset.upload seleciona provedor e validador registrados; não é armazenamento de binário arbitrário.'],['An asset DTO with its new ID; unsupported content fails invalid_data.','DTO com ID do arquivo; conteúdo sem suporte falha com invalid_data.'],['List again and compare its name. Test a text file and verify rejection.','Liste novamente e confira o nome. Teste arquivo de texto e confira a recusa.']),
  recipe('download','Read a downloadable file as a Blob','Ler arquivo baixável como Blob',[field('id','Reusable asset ID')],`async ({host,signal},v) => {
  const result=await host.call('asset.download',{id:v.id},{signal});
  return {name:result.name,contentType:result.contentType,size:result.size,blobBytes:result.blob.size};
}`,['Paste an asset ID from List. The result contains a Blob; it is not a URL string. A UI may create an object URL for download and must revoke it afterward.','Cole ID retornado em Listar. O retorno contém Blob, não URL. Uma interface pode criar URL de objeto para download e deve revogá-la ao terminar.'],['Metadata and equal size/blobBytes without dumping file contents into the page.','Metadados e size/blobBytes iguais, sem expor conteúdo do arquivo na página.'],['Compare size with the original. Another campaign’s ID must not be readable.','Compare o tamanho com o original. ID de outra campanha não deve ser legível.']),
  recipe('actor-image','Upload portrait or token artwork','Enviar retrato ou arte de token',[field('id','Actor ID'),field('kind','Image kind','portrait'),field('file','Original PNG/JPEG/WebP','','file')],`async ({host,signal},v) => {
  if(!['portrait','token'].includes(v.kind))throw new Error('kind must be portrait or token');
  if(!(v.file instanceof File))throw new Error('Choose an image');
  return host.call('actor.image.upload',{id:v.id,kind:v.kind,file:v.file},{signal});
}`,['Use portrait, then token, with an editable disposable actor. Multipart requires a real File. Limits and conversion are enforced by the host.','Use portrait e depois token com ator descartável editável. Multipart exige File real. Host valida limites e faz conversão.'],['The saved image URL. actor.version changes; re-read before subsequent writes.','URL da imagem salva. actor.version muda; releia antes de gravar novamente.'],['Reopen the actor and inspect both images. Read-only player and invalid image must fail.','Reabra ator e confira ambas imagens. Jogador só de leitura e imagem inválida devem falhar.']),
  recipe('card-image','Upload front/back artwork for a deck','Enviar frente/verso para um baralho',[field('purpose','Purpose','card_front'),field('file','Original PNG/JPEG/WebP','','file')],`async ({host,signal},v) => {
  if(!['card_front','card_back'].includes(v.purpose))throw new Error('Choose card_front or card_back');
  return host.call('card.asset.upload',{purpose:v.purpose,file:v.file},{signal});
}`,['As GM, choose an original image and purpose. Paste the returned assetId into the card-definition tutorial, not an external URL.','Como GM, escolha imagem original e finalidade. Use assetId retornado no tutorial de definição de cartas, não URL externa.'],['assetId for the native card asset library.','assetId da biblioteca nativa de imagens de carta.'],['Define a deck with front_asset_id/back_asset_id using this ID and inspect it in Cards.','Defina baralho com front_asset_id/back_asset_id usando esse ID e confira em Cards.']),
  recipe('delete','Delete only a reusable tutorial asset','Apagar apenas arquivo reutilizável de teste',[field('id','Reusable asset ID'),field('confirm','This is my disposable asset',false,'checkbox',false)],`async ({api,signal},v) => {
  if(!v.confirm)throw new Error('Confirm the disposable asset');
  await api.actors.deleteAsset({id:v.id},{requestId:crypto.randomUUID(),signal});
  return {deleted:v.id};
}`,['Select only the unattached reusable asset you uploaded. Native deletion checks provider support and updates references. This does not delete arbitrary media paths.','Selecione só o arquivo reutilizável sem ator que você enviou. Remoção nativa verifica provedor e referências. Não exclui caminhos arbitrários de mídia.'],['The asset is removed through the native actor domain.','Arquivo removido pelo domínio nativo de atores.'],['List it again; it must be absent. Actor-owned artwork IDs are not accepted here.','Liste novamente; deve estar ausente. IDs de imagem pertencente ao ator não são aceitos aqui.']),
];

const localRecipes=[
  recipe('catalog','Translate a module without changing host catalogs','Traduzir módulo sem alterar catálogo do host',[],`async ({api,assets,onDispose}) => {
  const catalogs=await assets.json('messages.json');
  const changes=[];
  const unsubscribe=api.i18n.onChange(locale=>changes.push(locale));onDispose(unsubscribe);
  const release=api.i18n.register(catalogs);onDispose(release);
  const result={locale:api.i18n.locale,has:api.i18n.has('welcome'),message:api.i18n.t('welcome',{name:'Ari'}),number:api.i18n.number(1234.5,{maximumFractionDigits:1})};
  release();unsubscribe();return {...result,changes};
}`,['The package includes messages.json with en/pt-BR/es keys. This uses the module namespace and does not require replacing the official language pack.','O pacote inclui messages.json com en/pt-BR/es. O catálogo usa namespace do módulo e não substitui o pacote oficial de idioma.'],['Localized message, placeholder substitution and formatted number.','Mensagem traduzida, placeholder substituído e número formatado.'],['Switch account language and rerun. Authored names are not translated.','Troque idioma da conta e repita. Nomes autorais não são traduzidos.']),
  recipe('package-assets','Read package assets safely','Ler arquivos do próprio pacote',[],`async ({assets}) => {
  const text=await assets.text('messages.json');
  const bytes=await assets.bytes('messages.json');
  return {url:assets.url('messages.json'),characters:text.length,bytes:bytes.byteLength,catalogs:await assets.json('messages.json')};
}`,['Package paths are relative and installation-version bound. Use assets.url for a local package image and styles.use for its stylesheet.','Caminhos são relativos e vinculados à versão instalada. Use assets.url para imagem do pacote e styles.use para sua folha de estilos.'],['Same file through URL/text/bytes/json helpers.','Mesmo arquivo lido por URL/text/bytes/json.'],['Try ../private.json; traversal must fail instead of reading installation data.','Tente ../private.json; travessia deve falhar sem ler dados da instalação.']),
  recipe('events','Observe authorized changes and stop listening','Observar alterações autorizadas e encerrar escuta',[],`async ({api,signal,onDispose}) => {
  const observed=[];
  const unsubscribe=api.events.on('actors.changed',snapshot=>{if(!signal.aborted)observed.push(snapshot.actors.map(actor=>({id:actor.id,name:actor.name})));});
  onDispose(unsubscribe);
  await new Promise(resolve=>{
    const timer=setTimeout(done,1500);
    function done(){clearTimeout(timer);signal.removeEventListener('abort',done);resolve();}
    signal.addEventListener('abort',done,{once:true});
    if(signal.aborted)done();
  });
  unsubscribe();return {observed};
}`,['Run while changing a disposable actor from another browser. This brief subscription samples authorized state, then unsubscribes. For a permanent panel, subscribe once during mount and pass the disposer to onDispose.','Execute enquanto altera ator de teste em outro navegador. A escuta curta observa estado autorizado e depois encerra. Em painel permanente, assine uma vez na montagem e entregue disposer a onDispose.'],['Snapshots may coalesce changes and include the initial authorized read. They are refresh hints, not an audit log.','Snapshots podem agrupar alterações e incluir leitura inicial. São avisos para atualizar, não log de auditoria.'],['Deactivate during the wait; no old data should render afterward.','Desative durante a espera; nenhum dado antigo deve aparecer depois.']),
  recipe('locale-compat','Apply a legacy page language overlay','Aplicar idioma temporário pelo contrato antigo',[],`async ({host}) => host.call('locale.apply',{id:'es',messages:{greeting:'Hola, {name}'}})`,['Use only when maintaining locale.apply code. This legacy helper changes the current page language/catalog until its context is disposed; it does not persist an account setting. New modules should use their private api.i18n namespace.','Use apenas ao manter código antigo com locale.apply. O helper altera idioma/catálogo da página enquanto o contexto existe; não salva preferência da conta. Módulos novos devem usar namespace privado de api.i18n.'],['null, a temporary es page language and a legacy locale event.','null, idioma temporário es na página e evento antigo de idioma.'],['Deactivate the module and reload to return to the explicitly chosen account locale.','Desative o módulo e recarregue para voltar ao idioma escolhido na conta.']),
];

const sharedValidation={
  en:'Perform writes only in a new development campaign with original resources. The server remains authoritative when controls are hidden. Test GM, read-only player, a missing UUID, another campaign’s ID, network failure and deactivation during a pending request. A conflict requires a fresh read and a user decision; do not silently force retries. Every new logical write needs a new requestId. Only reuse one to retry that exact operation when the service supports receipts. Read and write steps are separate transactions, so inspect persisted state after a partial failure.',
  pt:'Execute gravações apenas em campanha nova de desenvolvimento com recursos originais. Esconder controles não substitui autorização no servidor. Teste GM, jogador só de leitura, UUID ausente, ID de outra campanha, falha de rede e desativação durante requisição. conflict exige nova leitura e decisão do usuário; não force repetição silenciosa. Cada nova ação lógica precisa de requestId novo. Reutilize um UUID apenas para repetir aquela operação quando o serviço suporta recibos. Leitura e escrita são transações separadas; confira estado salvo após falha parcial.',
};
function config(id,slug,titles,summaries,intros,recipes,extra={}){
  return {id,slug,label:titles[0],recipes,sourcePaths:['gravewright/modules/contracts/frontend.json','gravewright/modules/static/gravewright_modules/domain-api.js',...(extra.sourcePaths||[])],
    en:{title:titles[0],summary:summaries[0],intro:intros[0],prerequisites:extra.enPrerequisites||'',validation:sharedValidation.en,prompt:'Adapt this complete '+id+' module for [specific goal] on Gravewright 0.3.0. Read the corresponding public service and recipe. Preserve authorized projections, opaque revisions, request UUIDs, cancellation and cleanup. Provide complete files and a new immutable version, plus explicit GM/player and failure tests.'},
    pt:{title:titles[1],summary:summaries[1],intro:intros[1],prerequisites:extra.ptPrerequisites||'',validation:sharedValidation.pt,prompt:'Adapte o módulo completo '+id+' para [objetivo] no Gravewright 0.3.0. Leia o serviço público e a receita correspondente. Preserve projeções autorizadas, revisões opacas, UUIDs, cancelamento e descarte. Entregue arquivos completos, nova versão imutável e testes explícitos de GM/jogador e falhas.'},...extra};
}
const configs=[
  config('actor-workshop','tutorial-actors',['Build an actor-directory module','Criar um módulo de personagens e pastas'],['Create, organize, rename and authorize actors using system-owned types.','Criar, organizar, renomear e autorizar atores com tipos do sistema.'],['Build a GM actor organizer. Start by inspecting actual types, create one disposable actor and folder, move/rename them and grant one player read access. The sheet tutorial covers full sheet data and independent tokens.','Crie um organizador de atores para o GM. Consulte tipos reais, crie ator e pasta de teste, mova/renomeie e conceda leitura a um jogador. O tutorial de ficha trata os dados completos e tokens independentes.'],actorRecipes,{sourcePaths:['gravewright/actors/services.py']}),
  config('module-settings','tutorial-storage',['Persist module settings safely','Salvar configurações e preferências do módulo'],['Implement personal, shared and browser-local JSON with revisions and cleanup.','Implementar JSON pessoal, compartilhado e local com revisões e descarte.'],['Create a settings lab. Its actions show the complete lifecycle of one key in each storage scope, including reads, writes, listing and removal. Use these primitives inside preferences or customize to build your actual settings form.','Crie um laboratório de configurações. As ações mostram o ciclo completo de uma chave em cada escopo, com leitura, gravação, listagem e exclusão. Use esses elementos em preferences ou customize para montar seu formulário real.'],storageRecipes,{sourcePaths:['gravewright/modules/static/gravewright_modules/browser-bridge.js','gravewright/modules/packages.py']}),
  config('asset-workshop','tutorial-assets',['Upload and use module and campaign files','Enviar e usar arquivos de módulos e campanhas'],['Use File/Blob, actor images, card assets, native file providers and downloads.','Usar File/Blob, imagens de ator, cartas, provedores nativos e downloads.'],['Create a file-handling module, not a URL-writing shortcut. Its forms pass real File objects to the public multipart SDK. Each recipe explains which native library owns the resulting ID. Package assets are covered by the next localization/events tutorial.','Crie módulo que trabalha com arquivos reais. Formulários enviam objetos File ao SDK multipart público. Cada receita explica a biblioteca nativa que possui o ID retornado. Arquivos do pacote ficam no tutorial seguinte de tradução/eventos.'],assetRecipes,{sourcePaths:['gravewright/modules/operations.py','gravewright/modules/static/gravewright_modules/browser-bridge.js']}),
  config('localization-events','tutorial-localization-events',['Translate a module and react to changes','Traduzir um módulo e reagir a eventos'],['Read package files, format translated UI and subscribe without leaking listeners.','Ler arquivos do pacote, traduzir interface e assinar eventos sem acumular listeners.'],['Create a translated extension with original en/pt-BR/es catalogs. Reuse the lifecycle for persistent live panels. Local catalogs belong to this module; installation-wide language packs use the separate language-package tutorial. The common runner itself demonstrates a native accessible modal with close guard and disposal.','Crie extensão traduzida com catálogos originais en/pt-BR/es. Reutilize o ciclo para painéis vivos. Catálogos locais pertencem ao módulo; pacotes globais de idioma têm tutorial próprio. O lançador comum já demonstra modal nativo acessível, guarda de fechamento e descarte.'],localRecipes,{sourcePaths:['gravewright/modules/static/gravewright_modules/i18n.js','gravewright/modules/static/gravewright_modules/browser-bridge.js'],files:{'messages.json':JSON.stringify({en:{welcome:'Welcome, {name}'},'pt-BR':{welcome:'Boas-vindas, {name}'},es:{welcome:'Bienvenido, {name}'}},null,2)+'\n'} }),
];
const built=configs.map(makeWorkbenchTutorial);
export const platformToolPackages=built.map(item=>item.package);
export const platformToolArticles=built.map(item=>item.article);
