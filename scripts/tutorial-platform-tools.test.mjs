import test from 'node:test';
import assert from 'node:assert/strict';
import {platformToolPackages} from '../content/tutorial-platform-tools.mjs';
import {sdkTutorialPackages} from '../content/tutorial-sdk-compat.mjs';
import {customizeTutorialPackages} from '../content/tutorial-customize.mjs';

async function recipes(id){
  const p=[...platformToolPackages,...sdkTutorialPackages].find(p=>p.id===id);
  return (await import('data:text/javascript;base64,'+Buffer.from(p.files['recipes.mjs']).toString('base64'))).recipes;
}
const action=async(id,name)=>(await recipes(id)).find(r=>r.id===name).run;

test('actor organizer discovers types and does not create an unsupported system actor',async()=>{
  const run=await action('actor-workshop','create');let payload;
  const api={actors:{state:async()=>({is_gm:true,actorTypes:[{id:'original-type'}]}),create:async value=>{payload=value;return {id:'new'};},get:async id=>({id})}};
  assert.deepEqual(await run({api},{name:'New scout'}),{id:'new'});assert.equal(payload.type,'original-type');
  api.actors.state=async()=>({is_gm:false,actorTypes:[{id:'original-type'}]});payload=undefined;
  await assert.rejects(run({api},{name:'Denied'}),/GM required/);assert.equal(payload,undefined);
  api.actors.state=async()=>({is_gm:true,actorTypes:[]});
  await assert.rejects(run({api},{name:'Missing type'}),/declaring actor types/);
});

test('actor permission editing retains grants and the actual actor version',async()=>{
  const run=await action('actor-workshop','permissions');let written;
  const actor={id:'a',version:17,permissions:{default:'none',existing:'owner'}};
  await run({api:{actors:{get:async()=>actor,setPermissions:async payload=>{written=payload;}}}},{actorId:'a',userId:'player'});
  assert.deepEqual(written,{id:'a',version:17,permissions:{default:'none',existing:'owner',player:'read'}});
});

test('personal settings use CAS and never retry a conflicting write',async()=>{
  const run=await action('module-settings','user-set');let writes=0;
  const storage={user:{get:async()=>({value:{schema:1,label:'server'},revision:'r7'}),set:async(key,value,options)=>{writes++;assert.equal(options.expectedRevision,'r7');throw Object.assign(new Error('conflict'),{code:'conflict'});}}};
  await assert.rejects(run({storage},{label:'changed'}),{code:'conflict'});assert.equal(writes,1);
  storage.user.get=async()=>({value:{schema:9,label:'future'},revision:'r8'});
  await assert.rejects(run({storage},{label:'changed'}),/Unsupported settings schema/);assert.equal(writes,1);
});

test('multipart image recipe passes the File object and validates the exact image kind',async()=>{
  const run=await action('asset-workshop','actor-image');let call;
  const file=new File([new Uint8Array([1,2,3])],'original.png',{type:'image/png'});
  const host={call:async(...args)=>{call=args;return {url:'/synthetic'};}};
  await run({host},{id:'actor',kind:'portrait',file});
  assert.equal(call[0],'actor.image.upload');assert.equal(call[1].file,file);assert.equal(call[1].kind,'portrait');
  await assert.rejects(run({host},{id:'actor',kind:'image',file}),/portrait or token/);
});

test('legacy actor data writes preserve unrelated JSON and keep opaque data revisions',async()=>{
  const run=await action('sdk-compat','data');const calls=[];
  const host={call:async(name,payload)=>{calls.push({name,payload});return name==='actor.data.read'?{data:{inventory:[{id:'retained'}],other:5},revision:'opaque-data-r17'}:{data:payload.data};}};
  await run({host},{id:'a',note:'new'});
  assert.deepEqual(calls[1].payload,{id:'a',expectedRevision:'opaque-data-r17',data:{inventory:[{id:'retained'}],other:5,workshop:{note:'new'}}});
});

test('legacy paging follows nextCursor instead of assuming one actor page',async()=>{
  const run=await action('sdk-compat','pages');const seen=[];
  const result=await run({host:{call:async(name,payload)=>{seen.push(payload.cursor);return payload.cursor?{items:[{id:'b'}],nextCursor:null}:{items:[{id:'a'}],nextCursor:'a'};}},signal:new AbortController().signal});
  assert.deepEqual(seen,[null,'a']);assert.deepEqual(result,[{id:'a'},{id:'b'}]);
});

test('customize migrates legacy settings, preserves additional fields and rejects unknown schemas',async()=>{
  const source=customizeTutorialPackages[0].files['settings.mjs'];
  const {load,save}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
  let previous={value:'Legacy note',revision:'r1'},write;
  const storage={user:{get:async()=>previous,set:async(...args)=>{write=args;return {revision:'r2'};}}};
  const legacy=await load(storage);assert.deepEqual(legacy,{value:{schema:1,label:'Legacy note'},revision:'r1'});assert.equal(write,undefined);
  previous={value:{schema:1,label:'old',retained:{custom:true}},revision:'r3'};
  await save(storage,await load(storage),'  New note  ');
  assert.deepEqual(write,['panel-preferences',{schema:1,label:'New note',retained:{custom:true}},{expectedRevision:'r3'}]);
  previous={value:{schema:3,label:'future'},revision:'r4'};
  await assert.rejects(load(storage),/Unsupported preference schema/);
});
