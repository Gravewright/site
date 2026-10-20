import test from 'node:test';
import assert from 'node:assert/strict';
import {tutorialCompendiumPackages} from '../content/tutorial-compendiums.mjs';

const source = tutorialCompendiumPackages.find(p => p.id === 'campaign-library').files;
const load = name => import('data:text/javascript;base64,'+Buffer.from(source[name]).toString('base64'));
const {createLibrary, journalData} = await load('library.mjs');
const maintenance = await load('maintenance.mjs');
const clone = value => structuredClone(value);
const failure = code => Object.assign(new Error(code), {code});

function fixture() {
  let record = null, failCheckpoint = false, gm = true;
  const calls = [], receipts = new Map(), journals = new Map(), packs = new Map();
  const mutate = async (method, payload, options, apply) => {
    calls.push(method);
    const previous = receipts.get(options.requestId);
    if (previous) {
      assert.deepEqual(previous.payload, payload, 'A retry must retain the original payload');
      return clone(previous.value);
    }
    if (!gm) throw failure('permission_denied');
    const value = apply(); receipts.set(options.requestId,{payload:clone(payload),value:clone(value)});
    return value;
  };
  const storage = {user:{
    async get() {return clone(record);},
    async set(key,value,{expectedRevision}) {
      if (expectedRevision !== (record?.revision ?? null)) throw failure('conflict');
      if (failCheckpoint && value.journalId) {failCheckpoint=false; throw failure('unavailable');}
      record = {value:clone(value), revision:String(Number(record?.revision ?? 0)+1)};
      return clone(record);
    },
  }};
  const api = {
    journals:{
      create:(p,o)=>mutate('journal.create',p,o,()=>{
        const id='journal-'+(journals.size+1);journals.set(id,{id,version:1,data:{}});return {journal_id:id,version:1};
      }),
      update:(p,o)=>mutate('journal.update',p,o,()=>{
        const journal=journals.get(p.journal_id);if(journal.version!==p.version)throw failure('conflict');
        journal.data=clone(p.data);journal.version++;return {journal_id:journal.id,version:journal.version};
      }),
    },
    compendiums:{
      async state(){return {isGM:gm,packs:[...packs.values()].map(clone)};},
      create:(p,o)=>mutate('pack.create',p,o,()=>{
        const id='pack-'+(packs.size+1);packs.set(id,{id,name:p.name,version:1,entries:[]});return {id};
      }),
      add:(p,o)=>mutate('pack.add',p,o,()=>{
        const pack=packs.get(p.packId);const entry={id:'entry-'+(pack.entries.length+1),kind:p.kind,name:p.name,data:clone(journals.get(p.resourceId).data),version:1};
        pack.entries.push(entry);pack.version++;return {id:entry.id};
      }),
      async read(p){const pack=packs.get(p.packId);if(!pack)throw failure('not_found');return clone(pack.entries.find(e=>e.id===p.id));},
      import:(p,o)=>mutate('pack.import',p,o,()=>{
        const entry=packs.get(p.packId).entries.find(e=>e.id===p.id),id='journal-'+(journals.size+1);
        journals.set(id,{id,version:1,data:clone(entry.data)});return {id,kind:entry.kind};
      }),
    },
  };
  return {api,storage,journals,packs,calls,
    controller:createLibrary({api,storage,signal:new AbortController().signal}),
    failNextJournalCheckpoint(){failCheckpoint=true;},
    asPlayer(){gm=false;},
  };
}

test('preparation resumes a successful write after a lost checkpoint without duplicating resources',async()=>{
  const f=fixture();f.failNextJournalCheckpoint();
  await assert.rejects(f.controller.prepare(),{code:'unavailable'});
  assert.equal(f.journals.size,1);assert.equal(f.packs.size,1);
  const saved=await f.controller.prepare();
  assert.equal(f.journals.size,1);assert.equal(f.packs.size,1);
  assert.equal(f.packs.get(saved.packId).entries.length,1);
  assert.deepEqual((await f.controller.read(saved.packId,saved.entryId)).data,journalData);
  await f.controller.prepare();assert.equal(f.packs.get(saved.packId).entries.length,1);
});

test('snapshot reading/importing preserves captured content after the source changes',async()=>{
  const f=fixture(),saved=await f.controller.prepare();
  f.journals.get(saved.journalId).data={sections:[]};
  assert.deepEqual((await f.controller.read(saved.packId,saved.entryId)).data,journalData);
  const requestId=crypto.randomUUID();
  const imported=await f.controller.importCopy(saved.packId,saved.entryId,requestId);
  assert.deepEqual(f.journals.get(imported.id).data,journalData);
  assert.deepEqual(await f.controller.importCopy(saved.packId,saved.entryId,requestId),imported);
  assert.equal(f.journals.size,2);
});

test('player preparation/imports are rejected while authorized snapshot reads still work',async()=>{
  const f=fixture(),saved=await f.controller.prepare();f.asPlayer();
  await assert.rejects(f.controller.prepare(),{code:'permission_denied'});
  await assert.rejects(f.controller.importCopy(saved.packId,saved.entryId,crypto.randomUUID()),{code:'permission_denied'});
  assert.equal((await f.controller.read(saved.packId,saved.entryId)).kind,'journal');
  assert.equal(f.journals.size,1);
});

test('maintenance uses current pack/entry versions and restricts installed-pack mutations',async()=>{
  const calls=[];
  const api={compendiums:{
    async state(){return {packs:[{id:'campaign-pack',version:7}]};},
    async read(p){return p.ids?{entries:[]}:{id:p.id,version:3};},
    ...Object.fromEntries(['configure','setPermissions','remove','delete'].map(method=>[method,async(p,o)=>{calls.push({method,p,o});return {};}])),
  }};
  await maintenance.shareCampaignPack(api,'campaign-pack');
  await maintenance.removeSnapshot(api,'campaign-pack','entry');
  await maintenance.deleteCampaignPack(api,'campaign-pack');
  await maintenance.grantInstalledPackRead(api,'native:example');
  assert.equal(calls[0].p.version,7);assert.equal(calls[1].p.version,3);assert.equal(calls[2].p.version,7);
  assert.deepEqual(calls[3].p,{packId:'native:example',level:'read'});
  assert.equal(new Set(calls.map(c=>c.o.requestId)).size,4);
  await assert.rejects(maintenance.removeSnapshot(api,'native:example','entry'),{code:'invalid_data'});
});
