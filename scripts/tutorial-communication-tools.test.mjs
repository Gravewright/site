import test from 'node:test';
import assert from 'node:assert/strict';
import {communicationToolPackages,communicationToolArticles} from '../content/tutorial-communication-tools.mjs';
const groups=new Map();
for(const pkg of communicationToolPackages){
  const module=await import('data:text/javascript;base64,'+Buffer.from(pkg.files['recipes.mjs']).toString('base64'));
  groups.set(pkg.id,new Map(module.recipes.map(recipe=>[recipe.id,recipe])));
}
const run=(group,id,block,values={})=>groups.get(group).get(id).run(block,values);
const copy=value=>structuredClone(value);
function fixture(){
  const documents=new Map(),folders=new Map(),calls=[],access=new Map();
  const controller=new AbortController();
  const block={signal:controller.signal,context:{role:'gm'}};
  const command=(method,payload,options)=>{assert.equal(options.signal,controller.signal);assert.match(options.requestId,/^[a-f0-9-]{36}$/);calls.push({method,payload:copy(payload),requestId:options.requestId});};
  const row=id=>{const value=documents.get(id);if(!value)throw Object.assign(new Error('not_found'),{code:'not_found'});return value;};
  const project=document=>{
    const base={id:document.id,title:document.title,type:document.type,version:document.version,visibility:document.visibility,folder_id:document.folder_id};
    if(document.type==='quest')base.quest=copy(document.data);
    if(document.type==='quest_board')base.board_entries=copy(document.links);
    if(document.type==='roll_table')base.roll_table={...copy(document.data),totalWeight:document.data.entries.filter(e=>e.active&&(document.data.withReplacement||!e.drawn)).reduce((n,e)=>n+e.weight,0)};
    if(document.type==='diary')Object.assign(base,{content_doc:copy(document.data.content),cover_image:copy(document.data.cover),sections:copy(document.data.sections),diary:{gm:copy(document.data.gm)}});
    return base;
  };
  block.api={actors:{get:async id=>({id})},journals:{
    async create(payload,options){command('create',payload,options);assert.ok(['quest','quest_board','roll_table','diary'].includes(payload.journal_type));const id=crypto.randomUUID();documents.set(id,{id,title:payload.title,type:payload.journal_type,version:0,visibility:'private',folder_id:null,data:payload.journal_type==='diary'?{content:{},cover:{},sections:[],gm:{}}:{},links:[]});return {journal_id:id,version:0};},
    async get(id){return project(row(id));},
    async list(){return [...documents.values()].map(project);},
    async state(){return {journals:[...documents.values()].map(project),folders:[...folders.values()],members:[{id:'player',role:'player'}]};},
    async update(payload,options){command('update',payload,options);const document=row(payload.journal_id);if(document.version!==payload.version)throw Object.assign(new Error('conflict'),{code:'conflict'});document.title=payload.title;document.data=copy(payload.data);document.visibility=payload.visibility??document.visibility;document.version++;return {journal_id:document.id,version:document.version};},
    async setStatus(payload,options){command('setStatus',payload,options);const document=row(payload.journal_id);assert.equal(document.version,payload.version);document.data.status=payload.status;document.version++;},
    async setObjective(payload,options){command('setObjective',payload,options);const document=row(payload.journal_id);assert.equal(document.version,payload.version);const objective=document.data.objectives.find(e=>e.id===payload.objective_id);assert.ok(objective);objective.completed=payload.completed;document.version++;},
    async assignCharacters(payload,options){command('assignCharacters',payload,options);const document=row(payload.journal_id);assert.equal(document.version,payload.version);document.data.assignees=copy(payload.assignees);document.version++;},
    async createBoardQuest(payload,options){command('createBoardQuest',payload,options);const board=row(payload.journal_id),id=crypto.randomUUID();documents.set(id,{id,title:payload.title,type:'quest',version:0,visibility:'private',data:{status:'available'},links:[]});board.links.push({quest_id:id,pinned:false,sort_order:board.links.length*10+10});return {created_quest_id:id};},
    async addQuest(payload,options){command('addQuest',payload,options);row(payload.quest_id);const board=row(payload.journal_id);if(!board.links.some(e=>e.quest_id===payload.quest_id))board.links.push({quest_id:payload.quest_id,pinned:false,sort_order:board.links.length*10+10});},
    async pinQuest(payload,options){command('pinQuest',payload,options);row(payload.journal_id).links.find(e=>e.quest_id===payload.quest_id).pinned=payload.pinned;},
    async reorderQuests(payload,options){command('reorderQuests',payload,options);const links=row(payload.journal_id).links;assert.deepEqual([...payload.ordered_quest_ids].sort(),links.map(e=>e.quest_id).sort());for(const [index,id] of payload.ordered_quest_ids.entries())links.find(e=>e.quest_id===id).sort_order=(index+1)*10;},
    async removeQuest(payload,options){command('removeQuest',payload,options);const board=row(payload.journal_id);board.links=board.links.filter(e=>e.quest_id!==payload.quest_id);},
    async roll(payload,options){command('roll',payload,options);const document=row(payload.journal_id);const entry=document.data.entries.find(e=>e.active&&(document.data.withReplacement||!e.drawn));if(!entry)throw new Error('This table has no available entries.');if(!document.data.withReplacement)entry.drawn=true;return {entry:copy(entry),message_id:1};},
    async reset(payload,options){command('reset',payload,options);for(const entry of row(payload.journal_id).data.entries)entry.drawn=false;},
    async move(payload,options){command('move',payload,options);row(payload.journal_id).folder_id=payload.target_folder_id;},
    async setAccess(payload,options){command('setAccess',payload,options);assert.equal(payload.target_user_id,'player');access.set(payload.journal_id,payload.access_level);},
    async present(payload,options){command('present',payload,options);return {presentation:copy(payload)};},
    async createFolder(payload,options){command('createFolder',payload,options);const id=crypto.randomUUID();folders.set(id,{id,name:payload.name,color:payload.color,parent_id:payload.parent_id});return {folder_id:id};},
    async updateFolder(payload,options){command('updateFolder',payload,options);Object.assign(folders.get(payload.folder_id),{name:payload.name,color:payload.color});},
    async moveFolder(payload,options){command('moveFolder',payload,options);folders.get(payload.folder_id).parent_id=payload.target_parent_id;},
    async deleteFolder(payload,options){command('deleteFolder',payload,options);const folder=folders.get(payload.folder_id);for(const document of documents.values())if(document.folder_id===folder.id)document.folder_id=folder.parent_id;for(const child of folders.values())if(child.parent_id===folder.id)child.parent_id=folder.parent_id;folders.delete(folder.id);},
    async delete(payload,options){command('delete',payload,options);documents.delete(payload.journal_id);}
  }};
  return {block,documents,folders,calls,access,project};
}
test('all four standalone recipe modules parse and provide executable form actions',()=>{
  assert.equal(communicationToolPackages.length,4);assert.equal(communicationToolArticles.length,4);
  const recipes=[...groups.values()].flatMap(map=>[...map.values()]);assert.equal(recipes.length,39);
  for(const recipe of recipes){assert.equal(typeof recipe.run,'function');assert.ok(recipe.description);for(const field of recipe.fields)assert.ok(['text','checkbox','number'].includes(field.type));}
});
test('chat sends native commands, validates dice repeats and guards campaign-wide moderation',async()=>{
  const calls=[];const block={context:{role:'gm'},signal:new AbortController().signal,api:{chat:{send:async(p,o)=>{calls.push({p,o});return p;},remove:async id=>({removed:id}),clear:async()=>({removed:3})},dice:{roll:async(...args)=>args}}};
  await run('chat-dice','public-message',block,{text:'Harbor open',sceneId:''});
  await run('chat-dice','whisper',block,{recipient:'Aster Willow',text:'Meet at dusk'});
  await run('chat-dice','gm-message',block,{text:'Secret'});await run('chat-dice','emote',block,{text:'waves'});
  assert.deepEqual(calls.map(call=>call.p.text),['Harbor open','/w Aster Willow Meet at dusk','/gm Secret','/me waves']);
  assert.equal(new Set(calls.map(call=>call.o.requestId)).size,4);
  assert.deepEqual(await run('chat-dice','remove-message',block,{messageId:'123'}),{removed:'123'});
  await assert.rejects(run('chat-dice','remove-message',block,{messageId:'abc'}),/numeric chat ID/);
  await assert.rejects(run('chat-dice','public-message',block,{text:'/gm wrong',sceneId:''}),/dedicated/);
  await assert.rejects(run('chat-dice','dice',block,{expression:'1d6',repeat:13,label:'',secret:false}),/1 to 12/);
  const roll=await run('chat-dice','dice',block,{expression:'2d6+1',repeat:2,label:'Check',secret:true});assert.equal(roll[1].visibility,'gm');assert.equal(roll[1].repeat,2);
  await assert.rejects(run('chat-dice','clear-chat',block,{confirmation:'clear'}),/CLEAR CHAT/);
  assert.deepEqual(await run('chat-dice','clear-chat',block,{confirmation:'CLEAR CHAT'}),{removed:3});
});
test('lobby and search send actual native shapes and reject an unselectable actor',async()=>{
  let update,search;const block={signal:new AbortController().signal,api:{table:{lobby:async()=>({actors:[{id:'owned'}]}),updateLobby:async payload=>(update=payload),search:async(...args)=>(search=args)}}};
  await run('chat-dice','set-ready',block,{ready:true,actorId:'owned',assets:'ready'});assert.deepEqual(update,{is_ready:true,assets_state:'ready',selected_actor_id:'owned'});
  await assert.rejects(run('chat-dice','set-ready',block,{ready:true,actorId:'foreign',assets:'ready'}),/selectable/);
  await run('chat-dice','search',block,{query:'Harbor',kind:'quest_board'});assert.equal(search[1].kind,'quest_board');
  await run('chat-dice','recent',block,{type:'journal',id:'quest-id'});assert.equal(search[0],'');assert.deepEqual(search[1].recent,[{id:'quest-id',type:'journal'}]);
  await assert.rejects(run('chat-dice','recent',block,{type:'quest',id:'quest-id'}),/Invalid reference/);
});
test('quests preserve their content through status, objective and assignment actions; board unlink keeps the quest',async()=>{
  const f=fixture(),b=f.block;
  const quest=await run('quests','create-quest',b,{title:'Beacon',summary:'Repair it',objective:'Climb the tower'});
  await run('quests','status',b,{id:quest.id,status:'active'});
  await run('quests','objective',b,{id:quest.id,objectiveId:'beacon_platform',completed:true});
  await run('quests','assign',b,{id:quest.id,actorId:'actor'});await run('quests','assign',b,{id:quest.id,actorId:'actor'});
  const current=f.documents.get(quest.id);assert.equal(current.data.public.summary,'Repair it');assert.equal(current.data.objectives[0].completed,true);assert.deepEqual(current.data.assignees,['actor']);
  const board=await run('quests','create-board',b,{title:'Jobs'});
  await run('quests','board-add',b,{id:board.id,questId:quest.id});const second=await run('quests','board-create-quest',b,{id:board.id,title:'Bell'});
  await run('quests','board-pin',b,{id:board.id,questId:quest.id,pinned:true});
  await run('quests','board-reorder',b,{id:board.id});assert.equal(f.documents.get(board.id).links.find(e=>e.quest_id===second.result.created_quest_id).sort_order,10);
  await run('quests','board-remove',b,{id:board.id,questId:quest.id});assert.ok(f.documents.has(quest.id));assert.equal(f.documents.get(board.id).links.length,1);
  assert.equal(new Set(f.calls.map(call=>call.requestId)).size,f.calls.length);
});
test('roll tables preserve entries through weight changes, exhaust without replacement and reset draw flags',async()=>{
  const f=fixture(),b=f.block;const table=await run('roll-tables','create-table',b,{title:'Weather',secret:true,replacement:false});
  await run('roll-tables','set-weight',b,{id:table.id,entryId:'fog',weight:4});
  assert.equal(f.documents.get(table.id).data.entries[0].result,'The beacon is visible across the bay.');assert.equal(f.documents.get(table.id).data.resultVisibility,'gm');
  const first=await run('roll-tables','roll',b,{id:table.id,sceneId:''}),second=await run('roll-tables','roll',b,{id:table.id,sceneId:'scene'});assert.notEqual(first.entry.id,second.entry.id);
  await assert.rejects(run('roll-tables','roll',b,{id:table.id,sceneId:''}),/no available/);
  const reset=await run('roll-tables','reset',b,{id:table.id});assert.equal(reset.roll_table.totalWeight,7);assert.ok(reset.roll_table.entries.every(e=>!e.drawn));
});
test('diary title changes preserve rich content, pages and GM secrets; grants and presentations use distinct payloads',async()=>{
  const f=fixture(),b=f.block;const diary=await run('journal-management','create-diary',b,{title:'Log',body:'Visible text'});
  const stored=f.documents.get(diary.id);stored.data.sections=[{id:'page',title:'Page',audience:'public',content:{example:true}}];stored.data.gm={notes:{private:'GM only'},secrets:{private:'Never shown'}};const data=copy(stored.data);
  await run('journal-management','rename-diary',b,{id:diary.id,title:'Renamed'});assert.deepEqual(stored.data,data);
  await run('journal-management','access',b,{id:diary.id,userId:'player',level:'read'});assert.equal(f.access.get(diary.id),'read');
  const presentation=await run('journal-management','present',b,{id:diary.id,userId:'player',pageId:'page'});assert.deepEqual(presentation.presentation.targets,['player']);assert.equal(presentation.presentation.ownership,'unchanged');assert.equal(presentation.presentation.page_id,'page');
  const folder=await run('journal-management','folder-create',b,{name:'Harbor',parentId:''});
  await run('journal-management','move-document',b,{id:diary.id,folderId:folder.result.folder_id});
  await assert.rejects(run('journal-management','folder-delete',b,{folderId:folder.result.folder_id,confirmation:'wrong'}),/exact folder name/);
  await run('journal-management','folder-delete',b,{folderId:folder.result.folder_id,confirmation:'Harbor'});assert.ok(f.documents.has(diary.id));assert.equal(stored.folder_id,null);
  await run('journal-management','delete-document',b,{id:diary.id,confirmation:'Renamed'});assert.equal(f.documents.has(diary.id),false);
});
test('setup failures expose the already-created document instead of silently duplicating it',async()=>{
  const f=fixture();f.block.api.journals.update=async()=>{throw Object.assign(new Error('conflict'),{code:'conflict'});};
  await assert.rejects(run('quests','create-quest',f.block,{title:'Partial',summary:'Test',objective:'One'}),error=>/was created; setup failed: conflict/.test(error.message)&&error.message.includes([...f.documents.keys()][0]));
  assert.equal(f.documents.size,1);
});
