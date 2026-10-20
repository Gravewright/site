import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {contentToolPackages} from '../content/tutorial-content-tools.mjs';

const groups=Object.fromEntries(await Promise.all(contentToolPackages.map(async p=>[
  p.id,(await import('data:text/javascript;base64,'+Buffer.from(p.files['recipes.mjs']).toString('base64'))).recipes,
])));
const run=(family,id,api,values={},rest={})=>groups[family].find(recipe=>recipe.id===id).run({api,signal:new AbortController().signal,...rest},values);

test('item creation uses registered types and duplication references the created item revision',async()=>{
  const calls=[];
  const api={items:{
    async state(){return {types:[{id:'gear'}]};},
    async createFolder(p){calls.push(['folder',p]);return {id:'folder-id'};},
    async create(p){calls.push(['create',p]);return {id:'item-id',item:{version:6}};},
    async duplicate(p){calls.push(['duplicate',p]);return {id:'duplicate-id'};},
  }};
  assert.deepEqual(await run('items','create-kit',api,{type:'gear'}),{folderId:'folder-id',itemId:'item-id',duplicateId:'duplicate-id'});
  assert.equal(calls[1][1].folderId,'folder-id');assert.equal(calls[1][1].type,'gear');
  assert.deepEqual(calls[2][1],{id:'item-id',version:6,name:'Spare survey kit'});
  const count=calls.length;
  await assert.rejects(run('items','create-kit',api,{type:'unregistered'}));
  assert.equal(calls.length,count,'Invalid types must fail before any creation');
});

test('item updates retain system data and permissions preserve unrelated grants',async()=>{
  const calls=[];const item={id:'item-id',version:8,data:{description:'Kept',quantity:1},permissions:{default:'none','member-a':'read'}};
  const api={items:{async get(){return item;},async update(p){calls.push(p);return p;},async setPermissions(p){calls.push(p);return p;}}};
  await run('items','update-kit',api,{id:'item-id',name:'Updated',quantity:2,folderId:''});
  assert.deepEqual(calls[0].data,{description:'Kept',quantity:2});assert.equal(calls[0].version,8);assert.equal(calls[0].folderId,null);
  await run('items','permissions',api,{id:'item-id',level:'owner',userId:'member-b'});
  assert.deepEqual(calls[1].permissions,{default:'none','member-a':'read','member-b':'owner'});
});

test('card commands use the visible controlled card revision and correct native payload keys',async()=>{
  const calls=[];
  const methods=['place','move','flip','take','give','discard','return'];
  const api={cards:{async state(){return {hand:[{id:'card-id',version:12,canControl:true}],cards:[]};},
    ...Object.fromEntries(methods.map(method=>[method,async p=>{calls.push({method,p});return {card:{id:p.id}};}]))}};
  for(const action of methods)await run('cards','card-actions',api,{id:'card-id',action,sceneId:'scene-id',recipient:'member-id',x:140,y:210});
  assert.equal(calls.length,7);for(const call of calls){assert.equal(call.p.id,'card-id');assert.equal(call.p.version,12);}
  assert.equal(calls.find(c=>c.method==='place').p.sceneId,'scene-id');
  assert.equal(calls.find(c=>c.method==='give').p.recipient,'member-id');
  assert.equal(calls.find(c=>c.method==='move').p.rotation,45);
  api.cards.state=async()=>({hand:[{id:'card-id',version:12,canControl:false}],cards:[]});
  await assert.rejects(run('cards','card-actions',api,{id:'card-id',action:'give'}),{code:'permission_denied'});
  assert.equal(calls.length,7);
});

test('card definition uploads actual Files and separates definition and instance identifiers',async()=>{
  const calls=[];const front=new File(['synthetic'],'front.png',{type:'image/png'}),back=new File(['synthetic'],'back.png',{type:'image/png'});
  const host={async call(name,p){calls.push({name,p});return {assetId:p.purpose==='card_front'?'front-id':'back-id'};}};
  const api={cards:{async define(p){calls.push({name:'define',p});return {deck:{id:'definition-id'}};},async instantiate(p){calls.push({name:'instantiate',p});return {id:'instance-id'};}}};
  const result=await run('cards','define',api,{front,back},{host});
  assert.equal(calls[0].p.file,front);assert.equal(calls[1].p.file,back);
  assert.equal(calls[2].p.default_back_asset_id,'back-id');assert.equal(calls[2].p.cards[0].front_asset_id,'front-id');
  assert.deepEqual(calls[3].p,{deck_definition_id:'definition-id'});
  assert.deepEqual(result,{deckDefinitionId:'definition-id',deckId:'instance-id'});
});

test('ambient and score transport revisions remain separate on every action',async()=>{
  const calls=[];
  const ambient=['play','pause','stop','seek','setVolume'],score=['pause','resume','next','previous','stop'];
  const api={audio:{async state(){return {version:31,score:{version:7},playlists:[{id:'composition-id',kind:'playlist'}]};},
    ...Object.fromEntries([...ambient,'startScore',...score.map(a=>a+'Score')].map(method=>[method,async p=>{calls.push({method,p});return {};}]))}};
  for(const action of ambient)await run('audio','playback',api,{sceneId:'scene-id',trackId:'track-id',action,volume:.4,position:1});
  for(const call of calls){assert.equal(call.p.version,31);assert.equal(call.p.expectedVersion,undefined);}
  calls.length=0;
  await run('audio','score-start',api,{sceneId:'scene-id',id:'composition-id'});
  for(const action of score)await run('audio','score-control',api,{sceneId:'scene-id',action});
  for(const call of calls){assert.equal(call.p.expectedVersion,7);assert.equal(call.p.version,undefined);assert.equal(call.p.sceneId,'scene-id');}
});

test('playlist revisions preserve track structure and spatial revisions come from the requested scene',async()=>{
  const calls=[],tracks=[{soundId:'track-id',duration:30,gain:.5}];
  const api={audio:{async state(p){return {playlists:[{id:'composition',version:4,kind:'preset',tracks}],spatialSounds:p.sceneId==='scene-id'?[{id:'source-id',version:9}]:[]};},
    async updatePlaylist(p){calls.push(p);return {};},async updateSpatialSound(p){calls.push(p);return {};}}};
  await run('audio','playlist-update',api,{id:'composition'});
  assert.deepEqual(calls[0].tracks,tracks);assert.equal(calls[0].kind,'preset');assert.equal(calls[0].version,4);
  await run('audio','spatial-update',api,{sceneId:'scene-id',id:'source-id',radius:15,enabled:false});
  assert.equal(calls[1].version,9);assert.equal(calls[1].enabled,false);
  await assert.rejects(run('audio','spatial-update',api,{sceneId:'wrong-scene',id:'source-id'}));
});

test('all three families cover the actual released frontend methods and use the real SDK adapter when supplied', {skip:!process.env.GRAVEWRIGHT_SOURCE}, async()=>{
  const root=resolve(process.env.GRAVEWRIGHT_SOURCE);
  const contract=JSON.parse(await readFile(resolve(root,'gravewright/modules/contracts/frontend.json'),'utf8'));
  const {createDomainApi}=await import(pathToFileURL(resolve(root,'gravewright/modules/static/gravewright_modules/domain-api.js')));
  for(const family of ['items','cards','audio']){
    const pkg=contentToolPackages.find(p=>p.id===family),code=pkg.files['recipes.mjs'];
    for(const method of Object.keys(contract.domains[family]))assert.ok(code.includes('api.'+family+'.'+method+'('),family+'.'+method+' needs a real recipe');
  }
  const calls=[];
  const api=createDomainApi(async(domain,method,payload,options)=>{calls.push({domain,method,payload,options});return method==='state'?{version:31,score:{version:7}}:{};});
  await run('audio','playback',api,{sceneId:'scene-id',trackId:'track-id',action:'seek',volume:.4,position:1});
  assert.deepEqual(calls[1].payload,{sceneId:'scene-id',trackId:'track-id',version:31,position:1});
});
