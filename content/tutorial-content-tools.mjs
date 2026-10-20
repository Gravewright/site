import {makeWorkbenchTutorial} from './tutorial-workbench.mjs';

const field = (name, label, value='', type='text', required=true) => ({name,label,value,type,required});
const make = (id, fields, code, en, pt) => ({id,fields,code,
  en:Object.fromEntries(['title','instruction','expected','verify'].map((key,i)=>[key,en[i]])),
  pt:Object.fromEntries(['title','instruction','expected','verify'].map((key,i)=>[key,pt[i]])),
});
const scene = () => field('sceneId','Scene UUID');
const identifier = (name, label) => field(name,label);

const itemRecipes = [
  make('inspect',[],`async ({api,signal}) => {
  return {...await api.items.state({}, {signal}),readableItems:await api.items.list({}, {signal})};
}`,
    ['Inspect real item types and folders','Choose this first and Run action. Copy a registered type ID from types; the creation recipe defaults to gear, supplied by the tutorial systems.','The authorized items, folder tree, registered types and isGM flag. A listing-only row has no readable body.','Compare the same state as GM and a read-only player; no hidden item data may appear.'],
    ['Inspecione tipos e pastas reais','Execute primeiro. Copie um ID de types; a criação usa gear por padrão, disponível nos sistemas dos tutoriais.','Itens autorizados, árvore de pastas, tipos registrados e isGM. Uma entrada só de listagem não tem corpo legível.','Compare GM e jogador com leitura; dados ocultos não devem aparecer.']),
  make('create-kit',[field('type','Registered item type','gear')],`async ({api,signal},values) => {
  const state = await api.items.state({}, {signal});
  if (!state.types.some(type => type.id === values.type)) throw new Error("Choose an item type registered by this campaign system");
  const folder = await api.items.createFolder({name:"Expedition supplies",color:"#6498cc",parentId:null}, {signal});
  const created = await api.items.create({name:"Survey kit",type:values.type,folderId:folder.id,data:{quantity:1,description:"An original compass and a blank notebook."},permissions:{default:"none"}}, {signal});
  const duplicate = await api.items.duplicate({id:created.id,version:created.item.version,name:"Spare survey kit"}, {signal});
  return {folderId:folder.id,itemId:created.id,duplicateId:duplicate.id};
}`,
    ['Create and duplicate an expedition kit','Enter a real registered item type, then Run action once. Copy folderId, itemId and duplicateId from the result for the next recipes.','A folder and two separate items containing original system-owned JSON. Each explicit run creates another set.','Open Items. Edit one kit and verify the duplicate remains independent.'],
    ['Crie e duplique um kit de expedição','Informe um tipo registrado e execute uma vez. Copie folderId, itemId e duplicateId para as próximas receitas.','Uma pasta e dois itens separados com JSON original pertencente ao sistema. Cada execução explícita cria outro conjunto.','Abra Itens, edite um kit e confira que a cópia permanece independente.']),
  make('update-kit',[identifier('id','Item UUID'),field('name','New name','Prepared survey kit'),field('quantity','Quantity',2,'number'),field('folderId','Destination folder UUID, blank for root','','text',false)],`async ({api,signal},values) => {
  const current = await api.items.get(values.id, {}, {signal});
  return api.items.update({id:current.id,version:current.version,name:values.name,folderId:values.folderId || null,data:{...current.data,quantity:values.quantity}}, {signal});
}`,
    ['Edit and move the kit','Use itemId, set a name/quantity and paste the created folderId, or leave the destination blank to move to root.','The item changes atomically using its current version; unrelated data keys remain. Quantity is an example system field, not a core inventory rule.','Verify the folder and quantity, then attempt a stale direct payload from a second session: the server must report conflict.'],
    ['Edite e mova o kit','Use itemId, defina nome/quantidade e cole folderId; destino vazio move para a raiz.','O item muda atomicamente com a versão atual e preserva outros campos. Quantity é campo de exemplo do sistema, não regra de inventário do core.','Confira pasta e quantidade; um payload antigo em outra sessão deve receber conflict.']),
  make('permissions',[identifier('id','Item UUID'),field('level','Access: none, limited, read or owner','read'),field('userId','Member UUID, blank for default','','text',false)],`async ({api,signal},values) => {
  const current = await api.items.get(values.id, {}, {signal});
  const permissions = {...current.permissions,[values.userId || "default"]:values.level};
  return api.items.setPermissions({id:current.id,version:current.version,permissions}, {signal});
}`,
    ['Grant reading or editing deliberately','As GM enter the kit UUID. Use read for the default grant or a real member UUID for a specific override; owner grants editing.','Versioned permission changes. limited permits listing rather than opening; none removes the selected grant.','Test read, limited and none in a player session. A reader cannot update data; a hidden button is not the security boundary.'],
    ['Conceda leitura ou edição conscientemente','Como GM, use o UUID do kit. Read concede leitura padrão; um UUID real de membro cria exceção. Owner permite edição.','Permissões com versão. Limited permite apenas listagem; none remove a concessão selecionada.','Teste read, limited e none com jogador. Leitura não autoriza edição; esconder botão não é a barreira de segurança.']),
  make('folder',[identifier('id','Folder UUID'),field('name','Folder name','Prepared supplies'),field('parentId','Parent folder UUID, blank for root','','text',false)],`async ({api,signal},values) => {
  return api.items.updateFolder({id:values.id,name:values.name,parentId:values.parentId || null,color:"#6498cc"}, {signal});
}`,
    ['Rename or reparent the folder','Paste folderId. A blank parent keeps this folder at root; another campaign folder UUID reparents it.','The folder is renamed/moved; the server rejects parent cycles and foreign-campaign IDs. Folder commands have no version field in this contract.','Refresh Items, inspect the tree and try setting the folder as its own parent.'],
    ['Renomeie ou reorganize a pasta','Cole folderId. Pai vazio deixa a pasta na raiz; outro UUID da campanha muda seu pai.','A pasta é renomeada/movida. O servidor rejeita ciclos e IDs de outra campanha. Este contrato de pasta não tem campo version.','Atualize Itens, confira a árvore e tente usar a própria pasta como pai.']),
  make('delete-item',[identifier('id','Disposable item UUID')],`async ({api,signal},values) => {
  const current = await api.items.get(values.id, {}, {signal});
  return api.items.delete({id:current.id,version:current.version}, {signal});
}`,
    ['Delete the spare kit','Use only duplicateId from this demonstration. This action deletes that item and requires GM.','The spare disappears; the original kit remains.','Refresh the directory and confirm the original UUID still opens.'],
    ['Exclua o kit reserva','Use apenas duplicateId desta demonstração. A ação exclui esse item e exige GM.','A reserva desaparece e o kit original permanece.','Atualize o diretório e confira que o UUID original ainda abre.']),
  make('delete-folder',[identifier('id','Disposable folder UUID')],`async ({api,signal},values) => {
  return api.items.deleteFolder({id:values.id}, {signal});
}`,
    ['Remove the demonstration folder','Move items you want to retain to root with the update recipe before removing your test folder.','The selected folder is removed through the native service.','Refresh Items and inspect remaining items/folders instead of assuming client-side state stayed current.'],
    ['Remova a pasta de demonstração','Mova os itens que deseja manter à raiz pela receita de edição antes de remover sua pasta de teste.','A pasta selecionada é removida pelo serviço nativo.','Atualize Itens e confira os recursos restantes em vez de confiar no estado antigo do cliente.']),
];

const cardRecipes = [
  make('inspect', [field('sceneId','Scene UUID, optional','','text',false)], `async ({api,signal},values) => {
  const maps = await api.maps.state({}, {signal});
  const cards = await api.cards.state(values.sceneId ? {sceneId:values.sceneId} : {}, {signal});
  return {scenes:maps.maps.map(row=>({id:row.id,name:row.name})),...cards};
}`,
    ['Find decks, your hand and scene cards','Run without a scene first. Copy a scene UUID from scenes, run again with it, and keep the IDs/versions from hand or cards.','Authorized decks, this account\'s hand and cards on the chosen scene. Private faces remain filtered.','Compare recipient and nonrecipient accounts. A deck count does not reveal concealed front images.'],
    ['Encontre baralhos, sua mão e cartas da cena','Execute sem cena. Copie um UUID de scenes, execute com ele e use IDs/versões de hand ou cards.','Baralhos autorizados, mão desta conta e cartas na cena escolhida. Faces privadas continuam filtradas.','Compare destinatário e outra conta. A contagem do baralho não revela imagens ocultas.']),
  make('create', [], `async ({api,signal}) => {
  return api.cards.create({name:"Harbor signals",cards:["Blue lantern","Return to harbor","Hold position"]}, {signal});
}`,
    ['Create a text-only deck','Run once as GM. This route creates an instance directly, without image assets or a reusable definition. Copy id as your deck UUID.','A three-card deck instance. Another explicit run creates another deck.','Inspect draw_count 3 in the state recipe and find the native deck list.'],
    ['Crie um baralho apenas com nomes','Execute uma vez como GM. Este caminho cria uma instância diretamente, sem imagens ou definição reutilizável. Copie id como UUID do baralho.','Instância com três cartas. Outra execução explícita cria outro baralho.','Confira draw_count 3 e a lista nativa de baralhos.']),
  make('define', [field('front','Optional original front image','','file',false),field('back','Optional original back image','','file',false)], `async ({api,host,signal},values) => {
  const front = values.front ? await host.call("card.asset.upload", {purpose:"card_front",file:values.front}, {signal}) : null;
  const back = values.back ? await host.call("card.asset.upload", {purpose:"card_back",file:values.back}, {signal}) : null;
  const definition = await api.cards.define({name:"Reusable harbor signals",default_back_asset_id:back?.assetId ?? null,cards:[
    {name:"Blue lantern",front_asset_id:front?.assetId ?? null},
    {name:"Hold position",front_asset_id:front?.assetId ?? null},
  ]}, {signal});
  const instance = await api.cards.instantiate({deck_definition_id:definition.deck.id}, {signal});
  return {deckDefinitionId:definition.deck.id,deckId:instance.id};
}`,
    ['Define and instantiate a deck with optional artwork','Choose original PNG/JPEG/WebP images or leave both files empty. The host uploads real File objects, defines two cards and creates an instance. Keep deckDefinitionId to instantiate another copy with the same public method.','Reusable definition plus a separate two-card instance. Images belong to the campaign/uploader and are referenced by assetId.','Draw a card and compare private hand versus revealed scene presentation. Image limits are 10 MiB and 16 megapixels; the native server converts valid images to WebP.'],
    ['Defina e instancie um baralho com arte opcional','Escolha imagens originais PNG/JPEG/WebP ou deixe ambos vazios. O host recebe File reais, define duas cartas e cria uma instância. Guarde deckDefinitionId para instanciar outra cópia pelo mesmo método público.','Definição reutilizável e instância separada com duas cartas. Imagens pertencem à campanha/usuário e são referenciadas por assetId.','Compre uma carta e compare mão privada com cena revelada. Limites: 10 MiB e 16 megapixels; o servidor converte imagens válidas para WebP.']),
  make('members', [], `async ({api,signal}) => {
  const lobby = await api.table.lobby({signal});
  return lobby.members.map(row=>({userId:row.user_id,name:row.name,role:row.role}));
}`,
    ['Find a recipient for a transfer','Use this if the host has the ready-check/lobby feature enabled. Copy a real member userId for Draw recipient or Give. If disabled, obtain the authorized member UUID from your controlled test fixture; do not guess IDs.','Current campaign member IDs and names, without account credentials.','Give to an actual participant. A UUID from another campaign must fail.'],
    ['Encontre o destinatário de uma transferência','Use com lobby/ready-check habilitado. Copie userId de um membro para Draw recipient ou Give. Se desabilitado, use UUID autorizado de sua fixture controlada; não invente IDs.','IDs e nomes dos membros atuais, sem credenciais.','Transfira para participante real. UUID de outra campanha deve falhar.']),
  make('draw', [identifier('deckId','Deck instance UUID'),field('count','Count',1,'number'),field('destination','Destination: hand, scene, table or chat','hand'),field('sceneId','Scene UUID for scene/table','','text',false),field('recipient','Recipient UUID, blank for yourself','','text',false)], `async ({api,signal},values) => {
  return api.cards.draw({deck_instance_id:values.deckId,count:values.count,destination:values.destination,
    ...(values.sceneId ? {sceneId:values.sceneId} : {}),...(values.recipient ? {recipient:values.recipient} : {}),
    face_state:"face_up",x:140,y:140}, {signal});
}`,
    ['Draw cards into a real destination','Use a deck instance UUID, count 1 and destination hand for the first run. scene/table need a scene UUID. chat deliberately publishes a card event and discards the drawn cards; use it only when that is the intended action. Only GM can choose another recipient.','The selected count leaves the draw pile and enters the requested destination. A direct hand draw remains private to its owner.','Inspect draw_count and hand/cards as the recipient; insufficient cards fail instead of returning a partial draw.'],
    ['Compre cartas para um destino real','Use UUID de instância, count 1 e destination hand primeiro. Scene/table exigem cena. Chat publica um evento de cartas e descarta as compradas; escolha quando esse for o efeito desejado. Só GM define outro destinatário.','A quantidade sai da pilha para o destino solicitado. Compra para mão continua privada ao dono.','Confira draw_count e hand/cards como destinatário; cartas insuficientes causam erro, sem compra parcial.']),
  make('card-actions', [identifier('id','Controlled card UUID'),field('action','Action: place, move, flip, take, give, discard or return','place'),field('sceneId','Scene UUID, needed for scene cards','','text',false),field('recipient','Recipient UUID for give','','text',false),field('x','Scene x',140,'number'),field('y','Scene y',140,'number')], `async ({api,signal},values) => {
  const state = await api.cards.state(values.sceneId ? {sceneId:values.sceneId} : {}, {signal});
  const card = [...state.hand,...state.cards].find(row=>row.id===values.id);
  if (!card?.canControl) throw Object.assign(new Error("Card is not controllable in this view"),{code:"permission_denied"});
  const payload = {id:card.id,version:card.version};
  switch (values.action) {
    case "place": return api.cards.place({...payload,sceneId:values.sceneId,x:values.x,y:values.y,reveal:true,scale:1,z_index:0}, {signal});
    case "move": return api.cards.move({...payload,x:values.x,y:values.y,rotation:45,scale:1,z_index:1}, {signal});
    case "flip": return api.cards.flip(payload, {signal});
    case "take": return api.cards.take(payload, {signal});
    case "give": return api.cards.give({...payload,recipient:values.recipient}, {signal});
    case "discard": return api.cards.discard(payload, {signal});
    case "return": return api.cards.return(payload, {signal});
    default: throw new Error("Choose a documented card action");
  }
}`,
    ['Play, move, reveal and transfer a controlled card','After Draw to your hand, paste its card UUID and a scene UUID. Run place, then move, flip and take one at a time. Give needs a real recipient; switch to that account to continue. Discard sends to discard; return sends back to draw.','Each click reads the current card version and applies exactly one action. Move requires a scene card; ownership and face visibility remain server-enforced.','Follow hand → scene → hand → another participant, then discard/return a controlled card. Read fresh state after every action. Another player cannot control your hand.'],
    ['Jogue, mova, revele e transfira uma carta controlada','Após Draw para sua mão, cole UUID da carta e da cena. Execute place, move, flip e take separadamente. Give exige destinatário real; passe à conta dele para continuar. Discard envia ao descarte; return devolve à pilha.','Cada clique lê a versão atual e aplica uma ação. Move exige carta na cena; posse e visibilidade da face continuam no servidor.','Acompanhe mão → cena → mão → outro participante; depois descarte/devolva uma carta controlada. Releia estado a cada ação. Outro jogador não controla sua mão.']),
  make('deck-actions', [identifier('deckId','Deck instance UUID'),field('action','Action: shuffle, reset or deleteDeck','shuffle')], `async ({api,signal},values) => {
  const deck = (await api.cards.state({}, {signal})).decks.find(row=>row.id===values.deckId);
  if (!deck) throw new Error("Deck unavailable");
  const payload={deck_instance_id:deck.id,version:deck.version};
  switch(values.action) {
    case "shuffle": return api.cards.shuffle(payload, {signal});
    case "reset": return api.cards.reset(payload, {signal});
    case "deleteDeck": return api.cards.deleteDeck(payload, {signal});
    default: throw new Error("Choose shuffle, reset or deleteDeck");
  }
}`,
    ['Shuffle, gather or delete the test deck','As GM use the instance UUID. shuffle randomizes the draw pile; reset gathers all cards, clears owners/scenes/faces and shuffles; deleteDeck removes the instance.','A version-checked deck operation. Definitions and reusable image assets have their own lifetime.','Draw/discard, then reset and confirm all cards return to draw. Delete only your disposable deck and verify it disappears.'],
    ['Embaralhe, reúna ou exclua o baralho de teste','Como GM, use UUID de instância. Shuffle embaralha a pilha; reset reúne cartas, limpa donos/cenas/faces e embaralha; deleteDeck remove a instância.','Operação de baralho com versão. Definições e imagens reutilizáveis têm ciclo próprio.','Compre/descarte, execute reset e confira toda a pilha. Exclua apenas o baralho descartável e confira sua remoção.']),
];

const audioRecipes = [
  make('inspect',[field('sceneId','Scene UUID, optional','','text',false),field('previewTokenId','GM listener token UUID, optional','','text',false)],`async ({api,signal},values) => {
  const maps = await api.maps.state({}, {signal});
  const audio = await api.audio.state({...(values.sceneId ? {sceneId:values.sceneId} : {}),...(values.previewTokenId ? {previewTokenId:values.previewTokenId} : {})}, {signal});
  return {scenes:maps.maps.map(row=>({id:row.id,name:row.name})),...audio};
}`,
    ['Inspect tracks, scene transport and score revisions','Prepare original audio through the native Library. Run without a scene to discover scene UUIDs, then run again with the chosen one. A GM may specify an existing token UUID to preview its spatial listening position. Copy track, playlist and source IDs from this result.','scenes, tracks, playlists, spatialSounds, playback, score, version and serverTime. Ambient commands use top-level version; score commands use score.version.','Players only receive related tracks. GM spatial effectiveGain is zero without an eligible preview listener; that is not a missing sound source.'],
    ['Inspecione faixas, transporte e revisão da trilha','Prepare áudio original pela Library. Execute sem cena para descobrir UUIDs e depois com a escolhida. GM pode indicar token existente para simular sua posição de escuta. Copie IDs de faixas, listas e fontes do resultado.','scenes, tracks, playlists, spatialSounds, playback, score, version e serverTime. Ambiente usa version da raiz; trilha usa score.version.','Jogadores só recebem faixas relacionadas. EffectiveGain do GM sem ouvinte de preview elegível é zero; isso não significa fonte ausente.']),
  make('track',[identifier('trackId','Track UUID'),field('kind','Kind: music, ambience or effect','ambience'),field('volume','Default volume',0.5,'number'),field('loop','Loop',true,'checkbox')],`async ({api,signal},values) => {
  const track=(await api.audio.state({}, {signal})).tracks.find(row=>row.id===values.trackId);
  if (!track) throw new Error("Upload an original track through the native Library first");
  return api.audio.updateTrack({id:track.id,version:track.version,name:"Harbor atmosphere",kind:values.kind,volume:values.volume,loop:values.loop}, {signal});
}`,
    ['Configure a real track','Paste a native-uploaded track UUID. Set music/ambience/effect, gain 0–1 and loop. effect always disables looping on the server.','The track metadata changes with its current version; no upload API or external audio URL is invented.','Inspect the library again and play it with the next recipe. Changing defaults is different from changing an existing scene voice.'],
    ['Configure uma faixa real','Cole UUID de faixa enviada pela biblioteca. Defina music/ambience/effect, volume 0–1 e loop. Effect sempre desabilita repetição no servidor.','Metadados mudam com versão atual; não há API de upload ou URL externa inventada.','Releia a biblioteca e toque pela próxima receita. Alterar padrões é diferente de alterar uma voz já tocando na cena.']),
  make('playback',[scene(),identifier('trackId','Track UUID'),field('action','Action: play, pause, stop, seek or setVolume','play'),field('volume','Voice volume',0.4,'number'),field('position','Seek seconds',1,'number')],`async ({api,signal},values) => {
  const state=await api.audio.state({sceneId:values.sceneId}, {signal});
  const payload={sceneId:values.sceneId,trackId:values.trackId,version:state.version};
  switch(values.action) {
    case "play": return api.audio.play({...payload,volume:values.volume,loop:true}, {signal});
    case "pause": return api.audio.pause(payload, {signal});
    case "stop": return api.audio.stop(payload, {signal});
    case "seek": return api.audio.seek({...payload,position:values.position}, {signal});
    case "setVolume": return api.audio.setVolume({...payload,volume:values.volume}, {signal});
    default: throw new Error("Choose a documented scene transport action");
  }
}`,
    ['Control one scene voice','Run play, pause, seek, play, setVolume and stop as separate explicit actions. Click Enable audio on this device before expecting sound. Seek must stay within the actual track duration.','The scene voice uses authoritative server-clock position and a fresh transport version. Local device mute/volume remains independent.','Compare two clients on the scene. A paused voice retains position; stop returns it to zero. A stale version must conflict.'],
    ['Controle uma voz da cena','Execute play, pause, seek, play, setVolume e stop separadamente. Clique Enable audio neste dispositivo para ouvir. Seek deve respeitar a duração real da faixa.','A voz usa posição do relógio do servidor e revisão atual do transporte. Mute/volume local continuam independentes.','Compare dois clientes na cena. Pause conserva posição; stop zera. Uma versão antiga deve gerar conflito.']),
  make('playlist-create',[identifier('trackId','First track UUID'),identifier('secondTrackId','Second track UUID'),field('kind','Composition kind: playlist or preset','playlist'),field('duration','Each entry duration in seconds',30,'number')],`async ({api,signal},values) => {
  return api.audio.createPlaylist({name:"Harbor arrival",kind:values.kind,mode:"sequential",fade:2,tracks:[
    {soundId:values.trackId,duration:values.duration,gain:0.5},
    {soundId:values.secondTrackId,duration:values.duration,gain:0.35},
  ]}, {signal});
}`,
    ['Compose an arrival playlist or simultaneous preset','Paste two native track UUIDs and choose playlist for sequential music or preset for simultaneous looping layers. Duration must be 1–86400 seconds. Run once and copy the returned id.','A composition definition with two explicit soundId/duration/gain entries and a two-second transition fade. It does not start playback.','Inspect playlists; then start it with the score recipe. Each repeated create is a separate definition.'],
    ['Monte playlist de chegada ou preset simultâneo','Cole dois UUIDs nativos. Playlist toca sequência; preset reúne camadas simultâneas em loop. Duração deve ficar entre 1 e 86400 segundos. Execute uma vez e copie id.','Definição com soundId/duration/gain e fade de dois segundos. A ação não inicia reprodução.','Confira playlists e inicie pela receita de trilha. Repetir criação produz outra definição.']),
  make('playlist-update',[identifier('id','Composition UUID')],`async ({api,signal},values) => {
  const current=(await api.audio.state({}, {signal})).playlists.find(row=>row.id===values.id);
  if (!current) throw new Error("Composition unavailable");
  return api.audio.updatePlaylist({id:current.id,version:current.version,name:"Harbor arrival revised",kind:current.kind,mode:"shuffle",fade:1,tracks:current.tracks}, {signal});
}`,
    ['Revise a composition without discarding its tracks','Use the created composition id. This edits the definition, retaining its track list and kind while changing name, mode and fade.','A versioned definition update. Already running score snapshots do not rewrite themselves.','Inspect the definition, then explicitly start it again to use the revised definition.'],
    ['Revise a composição sem perder suas faixas','Use id criado. A receita conserva lista e kind, alterando nome, modo e fade da definição.','Atualização com versão. A trilha já em execução não é reescrita sozinha.','Confira definição e inicie novamente explicitamente para usar a revisão.']),
  make('score-start',[scene(),identifier('id','Composition UUID')],`async ({api,signal},values) => {
  const state=await api.audio.state({sceneId:values.sceneId}, {signal});
  const definition=state.playlists.find(row=>row.id===values.id);
  if (!definition) throw new Error("Composition unavailable");
  return api.audio.startScore({sceneId:values.sceneId,id:definition.id,kind:definition.kind,repeat:true,expectedVersion:state.score.version}, {signal});
}`,
    ['Start the composition as a score','Choose the scene and the composition UUID. The kind comes from the actual definition; it is not guessed from its name.','A playing score with its own revision and timed playbacks. Starting another composition can crossfade from the current one.','Inspect score.state/playbacks on two clients. Use expectedVersion from score, not the ambient transport version.'],
    ['Inicie a composição como trilha','Informe cena e UUID da composição. Kind vem da definição real; não é deduzido pelo nome.','Trilha playing com revisão própria e vozes temporizadas. Iniciar outra composição pode fazer transição da atual.','Confira score.state/playbacks em dois clientes. Use expectedVersion da trilha, não version do ambiente.']),
  make('score-control',[scene(),field('action','Action: pause, resume, next, previous or stop','pause')],`async ({api,signal},values) => {
  const state=await api.audio.state({sceneId:values.sceneId}, {signal});
  const payload={sceneId:values.sceneId,expectedVersion:state.score.version};
  switch(values.action) {
    case "pause": return api.audio.pauseScore(payload, {signal});
    case "resume": return api.audio.resumeScore(payload, {signal});
    case "next": return api.audio.nextScore(payload, {signal});
    case "previous": return api.audio.previousScore(payload, {signal});
    case "stop": return api.audio.stopScore(payload, {signal});
    default: throw new Error("Choose a documented score action");
  }
}`,
    ['Pause, resume, navigate and stop the score','Start a playlist first. Run pause, resume, next, previous, then stop one at a time. next/previous apply to playlist, not a simultaneous preset. A stopped composition needs Start rather than Resume.','Each action preserves the server timeline and checks the score revision.','Inspect position/state after each action; a missing score or wrong kind fails clearly.'],
    ['Pause, retome, navegue e pare a trilha','Inicie playlist primeiro. Execute pause, resume, next, previous e stop separadamente. Next/previous não servem a preset simultâneo. Após stop, use Start em vez de Resume.','Cada ação conserva a linha temporal do servidor e verifica revisão da trilha.','Confira posição/estado a cada ação; trilha ausente ou kind incompatível falham claramente.']),
  make('spatial-create',[scene(),identifier('trackId','Track UUID'),field('x','Scene x pixels',140,'number'),field('y','Scene y pixels',140,'number'),field('radius','Radius in scene distance units',10,'number')],`async ({api,signal},values) => {
  return api.audio.createSpatialSound({sceneId:values.sceneId,trackId:values.trackId,x:values.x,y:values.y,radius:values.radius,gain:0.7,falloff:"smooth",loop:true,enabled:true,occlusion:true}, {signal});
}`,
    ['Place an audible harbor beacon','Enter scene, track and logical scene-pixel center. Radius is in the scene\'s configured distance units. The eligible token/listener determines received gain.','A native spatial sound source, with smooth falloff and wall occlusion. This is separate from an ambient voice or composition.','Use a player-controlled token near/far; as GM set previewTokenId in Inspect. Confirm effectiveGain changes and hidden data remains filtered.'],
    ['Posicione um sinal sonoro no porto','Informe cena, faixa e centro em pixels lógicos. Raio usa a unidade de distância configurada da cena. Token/ouvinte elegível determina ganho recebido.','Fonte sonora espacial nativa com queda suave e oclusão por paredes, separada de voz ambiente ou composição.','Mova token controlado pelo jogador para perto/longe; GM usa previewTokenId em Inspect. Confira effectiveGain.']),
  make('spatial-update',[scene(),identifier('id','Spatial source UUID'),field('radius','New radius',15,'number'),field('enabled','Enabled',true,'checkbox')],`async ({api,signal},values) => {
  const state=await api.audio.state({sceneId:values.sceneId}, {signal});
  const source=state.spatialSounds.find(row=>row.id===values.id);
  if (!source) throw new Error("Source unavailable in this scene");
  return api.audio.updateSpatialSound({sceneId:values.sceneId,id:source.id,version:source.version,radius:values.radius,enabled:values.enabled,falloff:"linear"}, {signal});
}`,
    ['Adjust the source range or disable it','Use the created source UUID in its own scene. This preserves the source track/location while changing radius, enabled and falloff.','Versioned native source edit, without restarting the entire campaign audio library.','Inspect source fields and effectiveGain. With enabled false the effective gain is zero.'],
    ['Ajuste alcance ou desabilite a fonte','Use UUID da fonte em sua própria cena. A receita preserva faixa/local, alterando raio, enabled e falloff.','Edição da fonte com versão, sem reiniciar toda a biblioteca da campanha.','Confira campos e effectiveGain; enabled false resulta em ganho efetivo zero.']),
  make('spatial-delete',[scene(),identifier('id','Disposable spatial source UUID')],`async ({api,signal},values) => {
  const source=(await api.audio.state({sceneId:values.sceneId}, {signal})).spatialSounds.find(row=>row.id===values.id);
  if (!source) throw new Error("Source unavailable");
  return api.audio.deleteSpatialSound({sceneId:values.sceneId,id:source.id,version:source.version}, {signal});
}`,
    ['Remove the test spatial source','Use only the source created for this tutorial.','The source disappears; its reusable track remains in the library.','Refresh spatialSounds and confirm that track metadata is still available to GM.'],
    ['Remova a fonte espacial de teste','Use somente a fonte criada neste tutorial.','A fonte desaparece; a faixa reutilizável continua na biblioteca.','Releia spatialSounds e confira que GM ainda vê a faixa.']),
  make('playlist-delete',[identifier('id','Disposable composition UUID')],`async ({api,signal},values) => {
  const current=(await api.audio.state({}, {signal})).playlists.find(row=>row.id===values.id);
  if (!current) throw new Error("Composition unavailable");
  return api.audio.deletePlaylist({id:current.id,version:current.version}, {signal});
}`,
    ['Remove the test composition','Stop its score first, then delete only the demonstration definition.','The composition definition is removed with its version. Track files remain reusable.','Refresh playlists and confirm the native track library remains intact.'],
    ['Remova a composição de teste','Pare a trilha antes e exclua somente a definição de demonstração.','A definição é removida com sua versão; arquivos das faixas permanecem reutilizáveis.','Atualize playlists e confirme que a biblioteca nativa continua intacta.']),
  make('track-delete',[identifier('trackId','Disposable original track UUID')],`async ({api,signal},values) => {
  const track=(await api.audio.state({}, {signal})).tracks.find(row=>row.id===values.trackId);
  if (!track) throw new Error("Track unavailable");
  return api.audio.deleteTrack({id:track.id,version:track.version}, {signal});
}`,
    ['Delete only the disposable uploaded audio','Use an original track uploaded for this tutorial after finishing playback/source/composition tests. This deletes its file and detaches native references.','Versioned track removal with native reference cleanup.','Refresh tracks, playlists and scene sources. This action is not a volume control or merely hiding an asset.'],
    ['Exclua somente o áudio descartável enviado','Use faixa original enviada para o tutorial depois dos testes de reprodução/fontes/composição. A ação exclui seu arquivo e remove referências nativas.','Remoção com versão e limpeza nativa de referências.','Confira tracks, playlists e fontes. A ação não apenas abaixa volume ou esconde recurso.']),
];

const configs = [
  {id:'items',slug:'tutorial-items',label:'Expedition item tools',recipes:itemRecipes,
    sourcePaths:['gravewright/modules/contracts/frontend.json','gravewright/items/services.py','gravewright/table/domain.py','gravewright/table/ownership.py'],
    en:{title:'How to build item and inventory tools',summary:'Create, organize, duplicate, share and edit original items with native revisions and permissions.',intro:'Build an Expedition item tools module. First discover this campaign\'s registered types, create a Survey kit and a spare, then organize and grant access. The core has no generic actor inventory/equip transaction: these recipes manage campaign item documents; a system must own inventory rules and relationships. Every available item mutation is demonstrated below.',prerequisites:'Use a disposable campaign with an installed system declaring an item type, such as gear in the compendium-system tutorial. Create/duplicate/permissions/folder/deletion require GM; an item owner may update permitted data. The workbench uses concrete UUID inputs copied from its authorized outputs.',validation:'Run create once, edit the original, inspect its independent duplicate, move folders and test read/limited/none with a player. Repeating create intentionally creates another set. Writes receive fresh operation UUIDs from the SDK; do not blindly rerun a multi-step creation after a lost response, because its earlier steps may have committed. Inspect state and resume deliberately. Conflicts require reading and reviewing current state; this code never changes the revision on a rejected request. A listing-only item is not openable. Test foreign-campaign UUIDs, aborted mounts and empty type lists. Delete only test resources at the end.',prompt:'Extend tutorial-items for [system-owned fields]. Inspect items/services.py and frontend.json for this target release. Preserve registered types, data fields, version checks, permissions and folder containment. Do not invent actor-inventory, equip or transfer endpoints. Provide complete files and GM/player tests, including stale edits and repeated actions.'},
    pt:{title:'Como criar ferramentas de itens e inventário',summary:'Crie, organize, duplique, compartilhe e edite itens originais com revisões e permissões nativas.',intro:'Crie Expedition item tools. Descubra tipos registrados na campanha, crie Survey kit e reserva, organize pastas e conceda acesso. O core não oferece transação genérica de equipar/inventário do ator: estas receitas gerenciam documentos de item da campanha; relações e regras de inventário pertencem ao sistema. Todas as mutações públicas de itens aparecem abaixo.',prerequisites:'Use campanha descartável com sistema que declare tipo de item, como gear do tutorial de sistema com compêndios. Criar/duplicar/permissões/pastas/excluir exige GM; proprietário de item pode alterar dados autorizados. Cole nos campos os UUIDs retornados pelas ações autorizadas.',validation:'Crie uma vez, edite o original, compare a cópia, reorganize pastas e teste read/limited/none com jogador. Repetir criação produz outro conjunto de propósito. O SDK gera UUID novo por ação; não repita cegamente uma criação em várias etapas após resposta perdida, pois etapas anteriores podem ter sido confirmadas. Inspecione estado e retome conscientemente. Conflict exige ler/revisar estado; o código não troca revisão em uma requisição rejeitada. Item só de listagem não abre. Teste UUID de outra campanha, cancelamento e lista vazia de tipos. Exclua só os recursos de teste ao final.',prompt:'Amplie tutorial-items para [campos do sistema]. Confira items/services.py e frontend.json da release alvo. Preserve tipos registrados, dados, version, permissões e contenção de pastas. Não invente endpoints de inventário/equipar/transferir de ator. Entregue arquivos completos e testes GM/jogador com edição antiga e ações repetidas.'}},
  {id:'cards',slug:'tutorial-cards',label:'Harbor card tools',recipes:cardRecipes,
    sourcePaths:['gravewright/modules/contracts/frontend.json','gravewright/modules/contracts/schemas/card.asset.upload.input.json','gravewright/cards/services.py','gravewright/table/media.py','gravewright/table/services.py'],
    en:{title:'How to build deck and card tools',summary:'Create reusable deck definitions, draw, reveal, move, transfer and recover cards with real ownership.',intro:'Build Harbor card tools with original signaling cards. Choose a text-only deck or define a reusable two-card deck with optional uploaded front/back images. Draw to your hand, place/reveal/move a card, take it back, give it to another member, discard/return and finally shuffle/reset/delete the test instance.',prerequisites:'Use a disposable campaign, GM account and one player account. A scene is needed for table placement; Inspect returns authorized scene IDs. GM creates definitions/instances and manages decks. A player with a deck read grant can draw to their own hand and control their own cards; knowing a UUID does not grant control.',validation:'Follow the recipes in order and inspect fresh state after each click. Use the definition route and verify its instance has two cards; use direct create for three text-only cards. Compare the two accounts before and after Give. Test hidden fronts, face-down scene cards, wrong ownership, stale card/deck versions and insufficient draws. A card operation checks the card version; shuffle/reset/delete checks the deck version; draw is a native serialized draw action. Each repeated successful Draw removes another card, and Import-like creation actions are not a refresh. After an unknown write result inspect state before running again. Uploads may have completed even when a later define fails; use only original disposable artwork.',prompt:'Adapt tutorial-cards for an original [deck idea]. Inspect cards/services.py and card.asset.upload schemas. Preserve instance versus definition IDs, card/deck revisions, File upload, ownership and front visibility. Do not return another player\'s hand or make private faces visible in logs. Provide the full package and two-account draw/place/give/reset checks.'},
    pt:{title:'Como criar ferramentas de cartas e baralhos',summary:'Crie definições reutilizáveis, compre, revele, mova, transfira e reúna cartas com posse real.',intro:'Crie Harbor card tools com cartas originais de sinalização. Escolha baralho só de nomes ou definição reutilizável com duas cartas e arte opcional de frente/verso. Compre para a mão, coloque/revele/mova na cena, recolha, entregue a outro membro, descarte/devolva e finalize com shuffle/reset/exclusão da instância.',prerequisites:'Use campanha descartável, conta GM e conta de jogador. Colocar cartas exige cena; Inspect retorna IDs autorizados. GM cria definições/instâncias e gerencia baralhos. Jogador com leitura do baralho pode comprar para a própria mão e controlar suas cartas; conhecer UUID não concede controle.',validation:'Siga as receitas e releia estado a cada clique. A definição gera instância com duas cartas; criação direta gera três nomes. Compare contas antes/depois de Give. Teste faces privadas, cartas viradas para baixo, posse errada, versões antigas e cartas insuficientes. Ação de carta verifica versão da carta; shuffle/reset/excluir verifica versão do baralho; Draw é compra nativa serializada. Cada Draw confirmado compra outra carta; criar não é atualizar lista. Após resultado desconhecido, inspecione estado antes de repetir. Upload pode ter confirmado mesmo que define posterior falhe; use só arte original descartável.',prompt:'Adapte tutorial-cards para [baralho original]. Confira cards/services.py e schemas card.asset.upload. Preserve IDs de instância/definição, revisões, File, posse e visibilidade das faces. Não exponha mão de outro jogador nem faces privadas em logs. Entregue pacote completo e testes em duas contas para draw/place/give/reset.'}},
  {id:'audio',slug:'tutorial-audio',label:'Harbor audio tools',recipes:audioRecipes,
    sourcePaths:['gravewright/modules/contracts/frontend.json','gravewright/audio/services.py','gravewright/audio/soundtrack.py','gravewright/audio/metadata.py','gravewright/table/media.py','gravewright/maps/frontend/features/table-library/ui/AssetUploadLibrary.native.js'],
    en:{title:'How to build scene audio and soundtrack tools',summary:'Configure native tracks, playlists, spatial sources, scene voices and timed scores with the correct revisions.',intro:'Build Harbor audio tools. Prepare two original tracks through the real Library, then configure a harbor ambience, operate one scene voice, compose arrival music, navigate its score and position a spatial beacon. These are separate layers of audio state, with different revisions and listener projections.',prerequisites:'Use a disposable campaign, a scene and two short original WAV/Ogg/FLAC/MP3 files. As GM open the native table Library and use Ambient audio or Sound effect to upload them; this browser domain API has no uploadTrack method, so the package starts from existing tracks. Inspect returns UUIDs. Click Enable audio on each client and check local volume. All audio mutations require GM; players receive only their authorized listening projection.',validation:'Test track defaults separately from active voices. Verify ambient version versus score.version, playlist versus preset, time/volume ranges and stale versions. Compare GM previewTokenId with an owned player token near/far from the spatial source. Silent effectiveGain without a listener is expected; a failed request is not. Native upload validates actual file metadata and size; follow its displayed limits rather than inventing an upload endpoint. Each Create makes another definition/source. Multi-step actions are not one transaction; after a network failure inspect state before repeating. Stop audio before cleanup, delete only sample resources and confirm players cannot invoke GM transport operations.',prompt:'Extend tutorial-audio for an original harbor scene. Inspect audio/services.py, soundtrack.py and frontend.json on 0.3.0. Use real uploaded track IDs, sceneId, native file preparation, ambient version and score expectedVersion correctly. Preserve listener privacy, server clock and cancellations. Do not invent audio upload APIs or require a newer host. Return complete source, sequential clicks and GM/player spatial/playback checks.'},
    pt:{title:'Como criar ferramentas de áudio e trilha da cena',summary:'Configure faixas nativas, playlists, fontes espaciais, vozes da cena e trilhas temporizadas com revisões corretas.',intro:'Crie Harbor audio tools. Prepare duas faixas originais na Library real, configure ambiente do porto, controle uma voz da cena, componha música de chegada, navegue a trilha e posicione um sinal espacial. São camadas diferentes de estado, com revisões e projeções de ouvinte próprias.',prerequisites:'Use campanha descartável, cena e dois áudios curtos originais WAV/Ogg/FLAC/MP3. Como GM, abra Library na mesa e envie por Ambient audio ou Sound effect; a API de domínio não tem uploadTrack, então o pacote começa com faixas existentes. Inspect retorna UUIDs. Clique Enable audio em cada cliente e confira volume local. Toda mutação de áudio exige GM; jogadores recebem só a projeção de escuta autorizada.',validation:'Teste padrões da faixa separados de vozes ativas. Confira version do ambiente versus score.version, playlist versus preset, limites de tempo/volume e versões antigas. Compare previewTokenId do GM com token controlado por jogador perto/longe da fonte. EffectiveGain zero sem ouvinte é esperado; erro de requisição não é silêncio normal. Upload nativo valida metadados e tamanho; respeite os limites da tela sem inventar endpoint. Cada Create cria definição/fonte nova. Etapas não formam transação única; após falha de rede, inspecione antes de repetir. Pare áudio antes de limpar, exclua apenas exemplos e confira que jogador não executa transporte do GM.',prompt:'Amplie tutorial-audio para cena original de porto. Confira audio/services.py, soundtrack.py e frontend.json da 0.3.0. Use IDs reais de faixas enviadas, sceneId, preparo nativo, version de ambiente e expectedVersion de trilha corretamente. Preserve privacidade de ouvintes, relógio do servidor e cancelamento. Não invente upload nem exija host novo. Entregue fontes completos, sequência de cliques e testes espaciais/reprodução de GM/jogador.'}},
];

const built = configs.map(makeWorkbenchTutorial);
export const contentToolPackages = built.map(item=>item.package);
export const contentToolArticles = built.map(item=>item.article);
export const contentToolRecipes = Object.fromEntries(configs.map(config=>[config.id,config.recipes]));
