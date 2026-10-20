import test from 'node:test';
import assert from 'node:assert/strict';
import {tutorialSheetPackages,tutorialSheetArticles} from '../content/tutorial-sheets.mjs';
const pkg=tutorialSheetPackages[0];
const module=await import('data:text/javascript;base64,'+Buffer.from(pkg.files['main.mjs']).toString('base64'));
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
class Element {
  constructor(tag,doc){this.localName=tag;this.ownerDocument=doc;}
  children=[];listeners=new Map();textContent='';dataset={};
  append(...children){for(const child of children){child.parent=this;this.children.push(child);}}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this);}
  setAttribute(){}
  addEventListener(name,fn,{signal}={}){if(signal?.aborted)return;if(!this.listeners.has(name))this.listeners.set(name,new Set());this.listeners.get(name).add(fn);signal?.addEventListener('abort',()=>this.listeners.get(name).delete(fn),{once:true});}
  fire(name,event={preventDefault(){}}){for(const fn of this.listeners.get(name)||[])fn(event);}
  find(tag){for(const child of this.children){if(child.localName===tag)return child;const found=child.find(tag);if(found)return found;}}
  all(tag){return this.children.flatMap(child=>[...(child.localName===tag?[child]:[]),...child.all(tag)]);}
  closest(){return this.ownerDocument.window;}
}
function fixture({snapshot=false,linked=false,editable=true,tokenData={size:2,vision:{range:8}},deferSave}={}){
  const doc={createElement:tag=>new Element(tag,doc)};doc.window=new Element('div',doc);
  const root=doc.createElement('div'),controller=new AbortController(),cleanups=[],writes=[];
  let actor={name:'Scout',version:2,sheetVersion:4,data:{stamina:17,inventory:[{id:'rope',qty:2}],token:tokenData}},token={name:'Scout',sheetVersion:9,data:structuredClone(actor.data)};
  if(snapshot&&token.data.token&&typeof token.data.token==='object')token.data.token.name='Independent';
  const read=()=>({name:snapshot?(token.data.token?.name||actor.name):actor.name,version:actor.version,sheetVersion:snapshot?token.sheetVersion:actor.sheetVersion,data:structuredClone(snapshot?token.data:actor.data),canEdit:editable,...(snapshot?{tokenId:'token'}:{})});
  const api={i18n:{t:key=>key},actors:{
    sheet:async(id,payload,options)=>{assert.equal(id,'actor');assert.equal(options.signal,controller.signal);if(snapshot||linked)assert.equal(payload.tokenId,'token');return read();},
    saveSheet:async(payload,options)=>{
      writes.push({payload:structuredClone(payload),options});
      if(deferSave)await deferSave();
      if(!editable)throw Object.assign(new Error('permission_denied'),{code:'permission_denied'});
      if(payload.sheetVersion!==(snapshot?token.sheetVersion:actor.sheetVersion)||!snapshot&&payload.version!==actor.version)throw Object.assign(new Error('conflict'),{code:'conflict'});
      if(snapshot){token.data=structuredClone(payload.data);token.sheetVersion++;}
      else{actor.name=payload.name;actor.data=structuredClone(payload.data);actor.version++;actor.sheetVersion++;}
      return {};
    }
  }};
  const block={root,api,context:{actorId:'actor',...(snapshot||linked?{tokenId:'token',sceneId:'scene'}:{})},signal:controller.signal,onDispose:fn=>cleanups.push(fn)};
  return {root,doc,writes,read,get actor(){return actor;},get token(){return token;},async mount(){await module.mountSheetName(block);},async edit(name){const input=root.find('input');input.value=name;input.fire('input');root.find('form').fire('submit');await tick();},externalRename(name){actor.name=name;actor.version++;actor.sheetVersion++;},async flush(){const pending=[];doc.window.fire('gravewright:sheet-flush',{detail:{waitUntil:promise=>pending.push(promise)}});return Promise.all(pending);},dispose(){controller.abort();for(const cleanup of cleanups.reverse())cleanup();}};
}
test('package has a complete lifecycle and registers two real augmentations',()=>{
  const declarations=[];module.default.register({register:(surface,value)=>declarations.push([surface,value])});
  assert.deepEqual(declarations.map(([surface])=>surface),['actor.sheet','token.sheet']);
  assert.ok(declarations.every(([,value])=>value.mode==='augment'&&value.mount===module.mountSheetName));
  assert.equal(pkg.manifest.entry,'main.mjs');assert.ok(pkg.files['LICENSE.txt']);
  assert.equal(tutorialSheetArticles.length,2);
});
test('actor rename preserves all sheet data and uses exact loaded revisions with new UUIDs',async()=>{
  const f=fixture();await f.mount();const original=structuredClone(f.actor.data);
  await f.edit('Harbor Scout');assert.equal(f.actor.name,'Harbor Scout');assert.deepEqual(f.actor.data,original);
  assert.equal(f.writes[0].payload.version,2);assert.equal(f.writes[0].payload.sheetVersion,4);
  await f.edit('Tower Scout');assert.equal(f.writes[1].payload.version,3);
  assert.notEqual(f.writes[0].options.requestId,f.writes[1].options.requestId);
  f.dispose();assert.equal(f.root.children.length,0);
});
test('linked tokens rename their actor; independent tokens only change their own nested name',async()=>{
  const linked=fixture({linked:true});await linked.mount();await linked.edit('Linked name');assert.equal(linked.actor.name,'Linked name');assert.equal(linked.writes[0].payload.tokenId,'token');linked.dispose();
  const f=fixture({snapshot:true});await f.mount();const actor=structuredClone(f.actor),before=structuredClone(f.token.data);
  await f.edit('Independent name');assert.deepEqual(f.actor,actor);assert.equal(f.token.data.token.name,'Independent name');
  before.token.name='Independent name';assert.deepEqual(f.token.data,before);assert.equal(f.writes[0].payload.sheetVersion,9);f.dispose();
});
test('read-only and incompatible snapshot data cannot write',async()=>{
  const player=fixture({editable:false});await player.mount();assert.equal(player.root.find('input').disabled,true);await player.edit('Forged submit');assert.equal(player.writes.length,0);player.dispose();
  const snapshot=fixture({snapshot:true,tokenData:'system-owned-string'});await snapshot.mount();await snapshot.edit('Wrong');assert.equal(snapshot.writes.length,0);assert.equal(snapshot.token.data.token,'system-owned-string');snapshot.dispose();
});
test('a stale draft reloads conflict state without another write',async()=>{
  const f=fixture();await f.mount();f.externalRename('Other client');await f.edit('Stale name');
  assert.equal(f.actor.name,'Other client');assert.equal(f.writes.length,1);assert.equal(f.root.find('input').value,'Other client');
  assert.match(f.root.find('p').textContent,/conflict/i);f.dispose();
});
test('closing blocks dirty drafts and awaits a pending write; disposal removes listeners',async()=>{
  let release;const f=fixture({deferSave:()=>new Promise(resolve=>{release=resolve;})});await f.mount();
  const input=f.root.find('input');input.value='Unsaved';input.fire('input');await assert.rejects(f.flush(),/Save the name/);
  f.root.find('form').fire('submit');await tick();let closed=false;const closing=f.flush().then(()=>{closed=true;});await tick();assert.equal(closed,false);
  release();await closing;assert.equal(closed,true);f.dispose();assert.ok([...f.doc.window.listeners.values()].every(set=>set.size===0));
});
