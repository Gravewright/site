import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { surfaceExamplePackages, surfaceExampleArticles } from '../content/examples-surfaces.mjs';

// Standalone: node --test scripts/examples-surfaces.test.mjs
// Host integration (POSIX): GRAVEWRIGHT_SOURCE=/path/to/gravewright node --test scripts/examples-surfaces.test.mjs
// PowerShell: set $env:GRAVEWRIGHT_SOURCE='C:/path/to/gravewright', then run the same node command.
// An explicitly supplied, invalid host path fails; there is no implicit parent-tree dependency.
const hostRoot = process.env.GRAVEWRIGHT_SOURCE ? resolve(process.env.GRAVEWRIGHT_SOURCE) : null;
let ModuleRuntime, createDomainApi;
if (hostRoot) {
  [{ ModuleRuntime }, { createDomainApi }] = await Promise.all([
    import(pathToFileURL(resolve(hostRoot,'gravewright/modules/static/gravewright_modules/module-runtime.js')).href),
    import(pathToFileURL(resolve(hostRoot,'gravewright/modules/static/gravewright_modules/domain-api.js')).href)
  ]);
}
const integrationTest = (name, run) => test(name, {skip:hostRoot ? false : 'Set GRAVEWRIGHT_SOURCE to run against the real Gravewright runtime.'}, run);

const assetUrl = example => new URL(`../assets/examples/surfaces/${example.directory}/`, import.meta.url);
if (process.argv.includes('--write')) {
  for (const example of surfaceExamplePackages) {
    await mkdir(assetUrl(example), { recursive:true });
    for (const [file, source] of Object.entries(example.files)) await writeFile(new URL(file, assetUrl(example)), source);
  }
}

class Element {
  constructor(localName, ownerDocument) { this.localName = localName; this.ownerDocument = ownerDocument; }
  children = []; dataset = {}; style = {}; attributes = {}; listeners = new Map(); _text = ''; className = '';
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set textContent(value) { this._text = String(value); this.children = []; }
  classList = { toggle:(name, on) => { const classes = new Set(this.className.split(' ').filter(Boolean)); on ? classes.add(name) : classes.delete(name); this.className = [...classes].join(' '); } };
  append(...children) { for (const child of children) { child.parent = this; this.children.push(child); } }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); this.parent = null; }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, callback, { signal } = {}) {
    if (signal?.aborted) return;
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(callback);
    signal?.addEventListener('abort', () => this.listeners.get(name).delete(callback), { once:true });
  }
  async fire(name) { await Promise.all([...this.listeners.get(name) ?? []].map(callback => callback({ preventDefault(){} }))); }
  all(tag) { return this.children.flatMap(child => [ ...(child.localName === tag ? [child] : []), ...child.all(tag) ]); }
}
const document = { createElement:tag => new Element(tag, document) };
Object.assign(globalThis, { document, location:{origin:'https://gravewright.example'} });
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
const clone = value => structuredClone(value);
const context = {tableId:'table',mountId:'initial',moduleSetRevision:'1',actorId:'actor',tokenId:'token',itemId:'item',journalId:'journal',sceneId:'scene',width:1200,height:800,grid:{size:64,distance:5,unit:'m',offsetX:0,offsetY:0},role:'gm',systemId:'example.system',actorType:'hero',canEdit:true};
const states = {
  actors:{actors:[{id:'actor',name:'Aster <img>',canOpen:true,canEdit:true,sheetVersion:3},{id:'limited',name:'Listed only',canOpen:false}]},
  tokens:{tokens:[{id:'token',name:'Snapshot',linkMode:'snapshot'}]},
  items:{items:[{id:'item',name:'Lantern',type:'gear',version:2,canOpen:true,data:{light:4}},{id:'item2',name:'Rope',type:'gear',canOpen:true},{id:'item3',name:'Hidden',type:'secret',canOpen:false}]},
  maps:{maps:[{id:'scene',name:'Harbor'},{id:'scene2',name:'Tower'}],activeMapId:'scene',navigatingMapId:'scene2'},
  journals:{journals:[{id:'journal',title:'Log',type:'diary',can_open:true,sections:[{title:'Public section'}]}]},
  combat:{active:true,round:2,version:1,combatants:[{name:'Aster',is_current:true}]},
  chat:[{from:{id:'one',name:'One'},text:'hello'},{from:{id:'one',name:'One'},text:'again'},{from:{id:'two',name:'Two'},text:'hi'}],
  search:[{title:'Aster',kind:'actor',snippet:'Visible <b>text</b>'}]
};
async function fixture(surface, {read, store} = {}) {
  const example = surfaceExamplePackages.find(example => example.surface === surface);
  const loaded = (await import(new URL('main.mjs', assetUrl(example)))).default;
  const events = new Map(), mountEvents = new Map(), calls = [], reports = [], modals = [];
  const subscriptions = set => ({ on(name, callback) {
    if (!set.has(name)) set.set(name, new Set());
    set.get(name).add(callback);
    return () => set.get(name).delete(callback);
  }});
  const ownStore = store ?? {record:null,revision:0,writes:[]};
  let scale = 1, offset = {x:0,y:0}, styled = 0;
  const ui = { openModal(section) { section.close = () => { section.closed = true; }; modals.push(section); return section; } };
  const translator = {register(){},t:(key, params={}) => key.replace(/\{(\w+)\}/g, (_,name) => params[name] ?? '{'+name+'}')};
  const bridge = {
    api:(_identity, life) => createDomainApi(async (domain, method, payload, options = {}) => life.wait(async signal => {
      calls.push({domain,method,payload});
      if (read) { const value = await read(domain,method,payload,signal); if (value !== undefined) return value; }
      if (domain === 'actors' && method === 'sheet') return {name:payload.tokenId ? 'Snapshot' : 'Aster',sheetVersion:payload.tokenId ? 8 : 3,data:{stamina:7}};
      if (domain === 'table' && method === 'search') return clone(states.search);
      if (domain === 'chat') return clone(states.chat);
      return clone(states[domain]);
    }, options.signal), {events:subscriptions(events),ui,i18n:translator}),
    context:(_descriptor, identity, life) => ({
      signal:life.signal,onDispose:life.onDispose,styles:{use(){ styled++; life.onDispose(()=>styled--); }},
      api:bridge.api(identity,life),
      storage:{user:{
        async get() { life.check(); return clone(ownStore.record); },
        async set(key,value,{expectedRevision}) {
          life.check(); ownStore.writes.push({key,value:clone(value),expectedRevision});
          if ((ownStore.record?.revision ?? null) !== expectedRevision) throw Object.assign(new Error('conflict'),{code:'conflict'});
          ownStore.record = {value:clone(value),revision:String(++ownStore.revision)};
          return clone(ownStore.record);
        }
      }}
    }),
    host:()=>({}),events:()=>subscriptions(mountEvents),acknowledge:async()=>{}
  };
  const runtime = new ModuleRuntime(bridge, error => reports.push(error), async()=>({default:loaded}));
  const root = document.createElement('div'); const visible = [];
  const detach = runtime.attach({domain:surface,root,context,defaultVisible:async value=>visible.push(value),viewport:{
    sceneToViewport:point=>({x:point.x*scale+offset.x,y:point.y*scale+offset.y}),
    viewportToScene:point=>({x:(point.x-offset.x)/scale,y:(point.y-offset.y)/scale})
  }});
  await runtime.reconcile({tableId:'table',moduleSetRevision:'1',role:'gm',replacements:{},modules:[{id:JSON.parse(example.files['manifest.json']).id,baseUrl:'/api/module-packages/example/1.0.0/hash/',entry:'main.mjs'}]});
  return {runtime,root,visible,reports,calls,modals,store:ownStore,events,mountEvents,detach,
    get styled(){return styled;},
    async emit(name) { await Promise.all([...events.get(name) ?? [],...mountEvents.get(name) ?? []].map(callback=>callback({}))); await flush(); },
    setViewport(nextScale,nextOffset){scale=nextScale;offset=nextOffset;}
  };
}

test('downloaded sources parse, register their documented surface and match the displayed articles', async()=>{
  if (hostRoot) {
    const registry = JSON.parse(await readFile(resolve(hostRoot,'gravewright/modules/contracts/registry.json'),'utf8'));
    assert.deepEqual(surfaceExamplePackages.map(example=>example.surface).sort(),Object.keys(registry.domains).sort());
  }
  assert.equal(surfaceExampleArticles.length,13);
  const registered = new Set();
  for (const example of surfaceExamplePackages) {
    for (const [name,source] of Object.entries(example.files)) assert.equal(await readFile(new URL(name,assetUrl(example)),'utf8'),source);
    const manifest = JSON.parse(await readFile(new URL('manifest.json',assetUrl(example)),'utf8'));
    assert.equal(manifest.entry,'main.mjs');
    const module = (await import(new URL(manifest.entry,assetUrl(example)))).default;
    for (const lifecycle of ['start','register','stop']) assert.equal(typeof module[lifecycle],'function');
    let count = 0;
    module.register({register(surface, declaration) {
      count++;
      assert.equal(surface,example.surface);
      assert.equal(declaration.mode,'augment');
      assert.equal(typeof declaration.mount,'function');
      registered.add(surface);
    }});
    assert.equal(count,1);
    const article=surfaceExampleArticles.find(article=>article.slug===`example-surface-${example.directory}`);
    assert.ok(article.en.body.includes(example.files['main.mjs'].trimEnd()));
    assert.ok(article.pt.body.includes(example.files['main.mjs'].trimEnd()));
  }
  assert.equal(registered.size,13);
});

for (const example of surfaceExamplePackages) integrationTest(`${example.surface} mounts through ModuleRuntime and disposes owned UI and styles`,async()=>{
  const fixtureState = await fixture(example.surface);
  assert.deepEqual(fixtureState.reports,[]);
  assert.equal(fixtureState.root.children.length,1);
  assert.equal(fixtureState.styled,1);
  assert.ok(fixtureState.visible.every(Boolean));
  await fixtureState.runtime.close();
  assert.equal(fixtureState.root.children.length,0);
  assert.equal(fixtureState.styled,0);
  assert.ok([...fixtureState.events.values(),...fixtureState.mountEvents.values()].every(handlers=>handlers.size===0));
});

integrationTest('actor/item/chat summaries use projected readable documents and actual response shapes',async()=>{
  for (const [surface,expected] of [['actor.directory','Readable actors: 1'],['item.directory','gear: 2'],['chat.log','Visible messages: 3; authors: 2'],['journal.sheet','Public section'],['combat.tracker','Round: 2'],['scene.directory','Broadcast: Harbor · Navigating: Tower']]) {
    const f=await fixture(surface);
    assert.ok(f.root.textContent.includes(expected),f.root.textContent);
    assert.equal(f.root.textContent.includes('secret:'),false);
    await f.runtime.close();
  }
});

integrationTest('token sheet explicitly reads its own independent snapshot',async()=>{
  const f=await fixture('token.sheet');
  assert.ok(f.root.textContent.includes('Snapshot · Link mode: snapshot · Sheet revision: 8'));
  assert.ok(f.calls.some(call=>call.domain==='actors'&&call.method==='sheet'&&call.payload.id==='actor'&&call.payload.tokenId==='token'));
  await f.runtime.close();
});

integrationTest('old asynchronous actor responses cannot replace newer state or survive disposal',async()=>{
  let requests=0,resolveOld,resolvePending;
  const f=await fixture('actor.directory',{read:async(domain)=>{
    if(domain!=='actors')return undefined;
    requests++;
    if(requests===2)return new Promise(resolve=>{resolveOld=resolve;});
    if(requests===4)return new Promise(resolve=>{resolvePending=resolve;});
    return {actors:Array.from({length:requests},()=>({canOpen:true}))};
  }});
  const button=f.root.all('button')[0];
  const old=button.fire('click');await flush();
  await button.fire('click');await flush();
  assert.ok(f.root.textContent.includes('Readable actors: 3'));
  resolveOld({actors:[]});await old;await flush();
  assert.ok(f.root.textContent.includes('Readable actors: 3'));
  const pending=button.fire('click');await flush();
  await f.runtime.close(); resolvePending({actors:[]});await pending;await flush();
  assert.equal(f.root.children.length,0);
  assert.deepEqual(f.reports,[]);
});

integrationTest('overlay transforms center in CSS pixels and repositions after viewport changes',async()=>{
  const f=await fixture('scene.overlay'); const marker=f.root.all('span')[0];
  assert.equal(marker.style.left,'600px');assert.equal(marker.style.top,'400px');
  f.setViewport(2,{x:50,y:-10});await f.emit('scene.viewport.changed');
  assert.equal(marker.style.left,'1250px');assert.equal(marker.style.top,'790px');
  await f.runtime.close();assert.equal(marker.parent,null);
});

integrationTest('scene control reads the mounted scene and closes its native modal during teardown',async()=>{
  const f=await fixture('scene.controls');
  await f.root.all('button')[0].fire('click');
  assert.equal(f.modals.length,1);assert.ok(f.modals[0].textContent.includes('Harbor'));
  assert.ok(f.modals[0].textContent.includes('1200 × 800'));
  await f.runtime.close();assert.equal(f.modals[0].closed,true);
});

integrationTest('personal preference uses CAS and reloads a conflict without overwriting another tab',async()=>{
  const store={record:null,revision:0,writes:[]};
  const a=await fixture('preferences',{store}),b=await fixture('preferences',{store});
  a.root.all('select')[0].value='compact';await a.root.all('button')[0].fire('click');
  assert.equal(store.record.value.density,'compact');assert.equal(store.writes[0].expectedRevision,null);
  b.root.all('select')[0].value='comfortable';await b.root.all('button')[0].fire('click');
  assert.ok(b.root.textContent.includes('Conflict: latest value reloaded'));
  assert.equal(store.record.value.density,'compact');assert.equal(b.root.all('select')[0].value,'compact');
  assert.equal(store.writes.length,2);
  b.root.all('select')[0].value='comfortable';await b.root.all('button')[0].fire('click');
  assert.equal(store.writes[2].expectedRevision,'1');assert.equal(store.record.value.density,'comfortable');
  await Promise.all([a.runtime.close(),b.runtime.close()]);
});

integrationTest('personal preference rejects an unsupported stored format without overwriting it',async()=>{
  const store={record:{value:{version:2,density:'compact'},revision:'4'},revision:4,writes:[]};
  const f=await fixture('preferences',{store});
  assert.ok(f.root.textContent.includes('Error: invalid_data'));
  assert.equal(f.root.all('button')[0].disabled,true);
  assert.equal(store.writes.length,0);
  assert.equal(store.record.value.version,2);
  await f.runtime.close();
});

integrationTest('workspace search renders real array responses as text and prevents stale results',async()=>{
  let resolveOld;
  const f=await fixture('table.interface',{read:async(domain,method,payload)=>{
    if(domain!=='table')return undefined;
    if(payload.query==='old')return new Promise(resolve=>{resolveOld=resolve;});
    return [{title:'Latest <img>',kind:'journal',snippet:'Readable <b>text</b>'}];
  }});
  const input=f.root.all('input')[0],form=f.root.all('form')[0];
  input.value='old';const old=form.fire('submit');await flush();
  input.value='new';await form.fire('submit');
  assert.ok(f.root.textContent.includes('Latest <img> (journal) · Readable <b>text</b>'));
  resolveOld([{title:'Old',kind:'actor'}]);await old;
  assert.equal(f.root.textContent.includes('Old (actor)'),false);
  assert.equal(f.root.all('img').length,0);
  await f.runtime.close();
});
