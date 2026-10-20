import test from 'node:test';
import assert from 'node:assert/strict';
import {packageExamples} from '../content/examples-packages.mjs';

class Element {
  constructor(tag,doc){this.tag=tag;this.ownerDocument=doc;}
  children=[];listeners=new Map();attributes={};textContent='';disabled=false;value='';
  append(...children){this.children.push(...children);}
  setAttribute(name,value){this.attributes[name]=value;}
  remove(){this.removed=true;}
  closest(){return this.ownerDocument.window;}
  addEventListener(name,callback,{signal}={}){
    if(signal?.aborted)return;
    const handlers=this.listeners.get(name)||new Set();handlers.add(callback);this.listeners.set(name,handlers);
    signal?.addEventListener('abort',()=>handlers.delete(callback),{once:true});
  }
  async fire(name,event={}){await Promise.all([...(this.listeners.get(name)||[])].map(callback=>callback({preventDefault(){},...event})));}
}
function dom(){
  const doc={createElement:tag=>new Element(tag,doc)};
  doc.window=new Element('section',doc);
  return {doc,root:new Element('div',doc)};
}
async function moduleFor(id){
  const source=packageExamples.find(example=>example.id===id).files['main.mjs'];
  return (await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
}
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};
const sheet=(stamina=10,version=1,canEdit=true)=>({id:'actor',name:'Scout',version,sheetVersion:version,canEdit,data:{stamina,other:{retained:true}}});
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));

async function sheetMount(api,{surface='actor.sheet',context={actorId:'actor'}}={}){
  const {doc,root}=dom(),controller=new AbortController(),disposers=[];
  const module=await moduleFor('system'),definitions=new Map();
  module.register({register:(domain,definition)=>definitions.set(domain,definition)});
  const mounting=definitions.get(surface).mount({root,context,api,signal:controller.signal,onDispose:fn=>disposers.push(fn)});
  const form=root.children[0],input=form.children[1].children[0];
  return {doc,root,controller,disposers,mounting,form,input,save:form.children[2],status:form.children[4]};
}

test('system sheet waits for its authorized read, preserves data and flushes the pending save',async()=>{
  const first=deferred(),write=deferred(),calls=[];let reads=0;
  const mounted=await sheetMount({actors:{sheet:()=>++reads===1?first.promise:Promise.resolve(sheet(17,2)),saveSheet:(payload,options)=>{calls.push({payload,options});return write.promise;}}});
  assert.equal(mounted.input.disabled,true);assert.equal(mounted.save.disabled,true);
  first.resolve(sheet());await mounted.mounting;
  assert.equal(mounted.input.value,'10');assert.equal(mounted.input.disabled,false);
  mounted.input.value='17';await mounted.input.fire('input');await mounted.form.fire('submit');
  assert.equal(calls.length,1);
  assert.deepEqual(calls[0].payload,{actorId:'actor',name:'Scout',version:1,sheetVersion:1,data:{stamina:17,other:{retained:true}}});
  assert.match(calls[0].options.requestId,/^[a-f0-9-]{36}$/);
  const waiting=[];
  await mounted.doc.window.fire('gravewright:sheet-flush',{detail:{waitUntil:promise=>waiting.push(promise)}});
  assert.equal(waiting.length,1);assert.equal(calls.length,1,'closing must join the existing write');
  write.resolve({version:2,sheetVersion:2});await waiting[0];
  assert.equal(mounted.input.value,'17');assert.equal(mounted.status.textContent,'Saved.');
  mounted.controller.abort();for(const dispose of mounted.disposers)dispose();
  assert.equal(mounted.form.removed,true);
});

test('system sheet refreshes a genuine conflict without resubmitting or overwriting the server value',async()=>{
  let reads=0,writes=0;
  const mounted=await sheetMount({actors:{sheet:async()=>++reads===1?sheet():sheet(21,2),saveSheet:async()=>{writes++;throw Object.assign(new Error('conflict'),{code:'conflict'});}}});
  await mounted.mounting;mounted.input.value='19';await mounted.input.fire('input');
  await mounted.form.fire('submit');await tick();
  assert.equal(writes,1);assert.equal(reads,2);assert.equal(mounted.input.value,'21');
  assert.match(mounted.status.textContent,/Conflict: server value loaded/);
  await mounted.form.fire('submit');await tick();assert.equal(writes,1,'reviewed server value is not an automatic retry');
});

test('read-only sheet keeps controls disabled and refuses a scripted submit',async()=>{
  let writes=0;
  const mounted=await sheetMount({actors:{sheet:async()=>sheet(10,1,false),saveSheet:async()=>{writes++;}}});
  await mounted.mounting;assert.equal(mounted.input.disabled,true);assert.equal(mounted.save.disabled,true);
  mounted.input.value='99';await mounted.input.fire('input');await mounted.form.fire('submit');await tick();
  assert.equal(writes,0);
});

for(const snapshot of [false,true])test(`token sheet routes ${snapshot?'independent snapshots':'linked actors'} using the server response`,async()=>{
  const reads=[],writes=[];
  const mounted=await sheetMount({actors:{
    sheet:async(actorId,token)=>{reads.push({actorId,token});return {...sheet(),...(snapshot?{tokenId:'token'}:{})};},
    saveSheet:async payload=>{writes.push(payload);}
  }},{surface:'token.sheet',context:{actorId:'actor',tokenId:'token'}});
  await mounted.mounting;mounted.input.value='24';await mounted.input.fire('input');
  await mounted.form.fire('submit');await tick();
  assert.deepEqual(reads[0],{actorId:'actor',token:{tokenId:'token'}});
  assert.equal(writes.length,1);assert.equal(writes[0].data.stamina,24);
  assert.equal(writes[0].tokenId,snapshot?'token':undefined);
});

test('browser summary cannot open a modal after its mount is aborted during loading',async()=>{
  const module=await moduleFor('browser'),{root}=dom(),controller=new AbortController(),read=deferred();let mount,modals=0;
  module.register({register:(surface,callback)=>{assert.equal(surface,'table.interface');mount=callback;}});
  mount({root,api:{actors:{list:()=>read.promise},ui:{openModal:()=>{modals++;}}},signal:controller.signal,onDispose(){}});
  const click=root.children[0].children[0].fire('click');controller.abort();
  read.resolve([{canOpen:true}]);await click;assert.equal(modals,0);
});
