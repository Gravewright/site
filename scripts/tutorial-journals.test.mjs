import test from 'node:test';
import assert from 'node:assert/strict';
import { tutorialJournalPackages } from '../content/tutorial-journals.mjs';

const source = tutorialJournalPackages[0].files['main.js'];
const module = (await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))).default;
const declarations = new Map();
module.register({ register: (surface, declaration) => declarations.set(surface, declaration.mount) });
const flush = async () => { for (let i = 0; i < 4; i++) await new Promise(resolve => setImmediate(resolve)); };
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

class Element extends EventTarget {
  constructor(tag, doc) { super(); this.tag = tag; this.ownerDocument = doc; this.children = []; this.dataset = {}; this.disabled = false; this.textContent = ''; }
  append(...nodes) { for (const node of nodes) { node.parent = this; this.children.push(node); } }
  setAttribute(key, value) { this[key] = value; }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(node => node !== this); this.parent = null; }
}
const document = { createElement: tag => new Element(tag, document) };
function find(root, predicate) { if (predicate(root)) return root; for (const child of root.children) { const found = find(child, predicate); if (found) return found; } }
const button = (root, text) => find(root, node => node.tag === 'button' && node.textContent === text);
const click = node => node.dispatchEvent(new Event('click'));
const doc = text => ({ format: 'gw-journal-doc-v1', version: 1, doc: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] } });
function projection(extra = {}) {
  return { id: 'journal-a', type: 'diary', title: 'Existing journal', visibility: 'shared', version: 7, can_edit: true, can_open: true,
    content_doc: doc('Introduction with a GM block'), cover_image: { assetId: 'cover-id', src: '/game/journal/asset/cover-id' },
    sections: [
      { id: 'public', title: 'Public page', kind: 'text', audience: 'public', sortOrder: 10, content: doc('Public original'), can_edit: true },
      { id: 'private', title: 'GM page', kind: 'text', audience: 'gm', sortOrder: 30, content: doc('Private original'), can_edit: true }
    ], diary: { gm: { notes: doc('GM notes'), secrets: doc('GM secrets') } }, ...extra };
}
function fixture(view = projection(), role = 'gm') {
  const controller = new AbortController(), cleanup = [], calls = [];
  const state = { is_gm: true, journals: [view] };
  const api = { i18n: { t: (key, values = {}) => key.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '{' + name + '}') }, journals: {
    state: async (payload, options) => { calls.push({ method: 'state', payload, options }); return structuredClone(state); },
    update: async (payload, options) => { calls.push({ method: 'update', payload, options }); return { journal_id: view.id, version: payload.version + 1 }; },
    create: async (payload, options) => { calls.push({ method: 'create', payload, options }); return { journal_id: 'new-journal', version: 1 }; }
  } };
  const root = document.createElement('div');
  const block = { root, context: { role, journalId: view.id }, api, signal: controller.signal, onDispose: callback => cleanup.push(callback) };
  const dispose = () => { controller.abort(); for (const callback of cleanup.reverse()) callback(); };
  return { block, api, root, state, view, calls, dispose };
}

test('GM action appends one private page and preserves every existing content field and revision', async () => {
  const f = fixture(), before = structuredClone(f.view);
  await declarations.get('journal.sheet')(f.block);
  click(button(f.root, 'Add session section'));
  await flush();
  const writes = f.calls.filter(call => call.method === 'update');
  assert.equal(writes.length, 1);
  const { payload, options } = writes[0];
  assert.equal(payload.version, 7);
  assert.equal(payload.title, before.title);
  assert.equal(payload.visibility, 'shared');
  assert.deepEqual(payload.data.content, before.content_doc);
  assert.deepEqual(payload.data.cover, before.cover_image);
  assert.deepEqual(payload.data.gm, before.diary.gm);
  assert.equal(payload.data.sections.length, 3);
  for (let i = 0; i < 2; i++) {
    const { can_edit, ...expected } = before.sections[i];
    assert.deepEqual(payload.data.sections[i], expected);
  }
  const added = payload.data.sections[2];
  assert.equal(added.audience, 'gm'); assert.equal(added.kind, 'text'); assert.equal(added.sortOrder, 40);
  assert.equal(added.content.format, 'gw-journal-doc-v1');
  assert.match(added.content.doc.content[0].content[0].text, /^Draft: record the date/);
  assert.match(options.requestId, /^[a-f0-9-]{36}$/);
  assert.equal(options.signal, f.block.signal);
  assert.deepEqual(f.view, before, 'the received projection must not be mutated');
  f.dispose();
});

test('players, filtered projections, read-only documents, unsupported types and page limits never write', async () => {
  const player = fixture(projection(), 'player');
  await declarations.get('journal.sheet')(player.block);
  await declarations.get('table.interface')(player.block);
  assert.equal(player.root.children.length, 0); assert.equal(player.calls.length, 0);
  for (const [view, isGm] of [[projection(), false], [projection({ can_edit: false }), true], [projection({ type: 'quest' }), true], [projection({ diary: undefined }), true], [projection({ sections: Array.from({ length: 64 }, (_, n) => ({ id: String(n), sortOrder: n })) }), true]]) {
    const f = fixture(view); f.state.is_gm = isGm;
    await declarations.get('journal.sheet')(f.block);
    const add = button(f.root, 'Add session section');
    assert.equal(add.disabled, true);
    click(add); await flush();
    assert.equal(f.calls.filter(call => call.method === 'update').length, 0);
    f.dispose();
  }
});

test('conflict reloads but requires review; a later new write preserves the other editor page', async () => {
  const f = fixture(); let writes = 0;
  f.api.journals.update = async (payload, options) => {
    f.calls.push({ method: 'update', payload, options });
    if (++writes === 1) {
      f.state.journals[0].version = 8;
      f.state.journals[0].sections.push({ id: 'remote', title: 'Other editor', kind: 'text', audience: 'gm', sortOrder: 50, content: doc('Concurrent text') });
      throw Object.assign(new Error('changed'), { code: 'conflict' });
    }
    return { journal_id: 'journal-a', version: 9 };
  };
  await declarations.get('journal.sheet')(f.block);
  const add = button(f.root, 'Add session section');
  click(add); await flush();
  assert.equal(writes, 1); assert.equal(add.disabled, true);
  assert.match(find(f.root, node => node.role === 'status').textContent, /Conflict: server version 8 loaded/);
  click(add); await flush(); assert.equal(writes, 1, 'must not silently retry');
  click(button(f.root, 'Review latest journal')); await flush();
  assert.equal(add.disabled, false);
  click(add); await flush();
  const requests = f.calls.filter(call => call.method === 'update');
  assert.equal(requests[1].payload.version, 8);
  assert.ok(requests[1].payload.data.sections.some(page => page.id === 'remote'));
  assert.notEqual(requests[0].options.requestId, requests[1].options.requestId);
  f.dispose();
});

test('creation uses the real native payload and blocks overlapping submits', async () => {
  const f = fixture(), pending = deferred();
  f.api.journals.create = async (payload, options) => { f.calls.push({ method: 'create', payload, options }); return pending.promise; };
  await declarations.get('table.interface')(f.block);
  const form = find(f.root, node => node.tag === 'form');
  find(f.root, node => node.tag === 'input').value = '  Lighthouse expedition  ';
  form.dispatchEvent(new Event('submit', { cancelable: true }));
  form.dispatchEvent(new Event('submit', { cancelable: true }));
  await flush();
  const writes = f.calls.filter(call => call.method === 'create');
  assert.equal(writes.length, 1);
  assert.deepEqual(writes[0].payload, { title: 'Lighthouse expedition', journal_type: 'diary', folder_id: null });
  assert.equal(writes[0].options.signal, f.block.signal);
  pending.resolve({ journal_id: 'new-journal', version: 1 }); await flush();
  assert.match(find(f.root, node => node.role === 'status').textContent, /Created "Lighthouse expedition"/);
  f.dispose();
});

test('aborted reads never proceed to a write or update disposed DOM; repeated mounts release their panels', async () => {
  const f = fixture(), read = deferred();
  f.api.journals.state = () => read.promise;
  await declarations.get('table.interface')(f.block);
  const form = find(f.root, node => node.tag === 'form');
  form.dispatchEvent(new Event('submit', { cancelable: true }));
  f.dispose(); read.resolve(f.state); await flush();
  assert.equal(f.root.children.length, 0);
  assert.equal(f.calls.filter(call => call.method === 'create').length, 0);
  form.dispatchEvent(new Event('submit', { cancelable: true })); await flush();
  assert.equal(f.calls.filter(call => call.method === 'create').length, 0);
  for (let i = 0; i < 5; i++) {
    const mounted = fixture();
    await declarations.get('journal.sheet')(mounted.block);
    assert.equal(mounted.root.children.length, 1);
    const stale = button(mounted.root, 'Add session section');
    mounted.dispose(); click(stale); await flush();
    assert.equal(mounted.root.children.length, 0);
    assert.equal(mounted.calls.filter(call => call.method === 'update').length, 0);
  }
});

test('catalog registration is scoped to a live start and preserves placeholders across all locales', async () => {
  const pkg = tutorialJournalPackages[0], catalog = JSON.parse(pkg.files['messages.json']);
  const controller = new AbortController(); let registered;
  await module.start({ api: { i18n: { register: value => { registered = value; } } }, assets: { json: async () => catalog }, styles: { use: () => {} }, signal: controller.signal });
  assert.deepEqual(registered, catalog);
  for (const locale of ['pt-BR', 'es']) for (const [key, text] of Object.entries(catalog[locale])) {
    assert.deepEqual([...text.matchAll(/\{\w+\}/g)].map(value => value[0]).sort(), [...catalog.en[key].matchAll(/\{\w+\}/g)].map(value => value[0]).sort());
  }
  controller.abort(); registered = undefined;
  await module.start({ api: { i18n: { register: value => { registered = value; } } }, assets: { json: async () => catalog }, styles: { use: () => {} }, signal: controller.signal });
  assert.equal(registered, undefined);
});
