import test from 'node:test';
import assert from 'node:assert/strict';
import { worldToolPackages } from '../content/tutorial-world-tools.mjs';
const loaded = new Map();
for (const pkg of worldToolPackages) {
  const source = pkg.files['recipes.mjs'];
  loaded.set(pkg.id, (await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))).recipes);
}
const run = (family, id) => loaded.get(family + '-workshop').find(recipe => recipe.id === id).run;
const block = api => ({ api, context: { role: 'gm' }, signal: new AbortController().signal });

test('scene metadata sends only the requested settings and actual scene revision; conflict rereads without retry', async () => {
  const calls = [];
  const api = { maps: {
    get: async () => ({ id: 'scene', version: 19, imageScale: 2, gridSize: 70 }),
    update: async (payload, options) => { calls.push({ payload, options }); },
    state: async () => { calls.push('refresh'); return {}; }
  } };
  const ctx = block(api);
  await run('maps', 'metadata')(ctx, { mapId: 'scene', name: 'Original chamber', gridVisible: false });
  assert.deepEqual(calls[0].payload, { mapId: 'scene', version: 19, settings: { name: 'Original chamber', gridVisible: false } });
  assert.equal(calls[0].options.signal, ctx.signal);
  api.maps.update = async () => { calls.push('write-conflict'); throw Object.assign(new Error('changed'), { code: 'conflict' }); };
  await assert.rejects(run('maps', 'metadata')(ctx, { mapId: 'scene', name: 'Stale', gridVisible: true }), { code: 'conflict' });
  assert.deepEqual(calls.slice(1), ['write-conflict', 'refresh']);
});

test('door edits/deletion use the native object revision rather than scene/environment versions', async () => {
  const writes = [];
  const api = { maps: { layers: async () => ({ version: 100, walls: [{ id: 'door', kind: 'door', version: 7, x1: 70, y1: 70, x2: 210, y2: 70 }] }),
    updateObjects: async payload => { writes.push(payload); } } };
  await run('maps', 'door-update')(block(api), { mapId: 'scene', doorId: 'door', x2: 280 });
  assert.deepEqual(writes[0], { mapId: 'scene', area: 'walls', action: 'update', data: { wall_id: 'door', version: 7, x2: 280 } });
  await run('maps', 'door-delete')(block(api), { mapId: 'scene', doorId: 'door', confirm: true });
  assert.equal(writes[1].data.expected_version, 7);
  api.maps.layers = async () => ({ walls: [{ id: 'door', kind: 'door', blueprint: { version: 2 } }] });
  await assert.rejects(run('maps', 'door-operate')(block(api), { mapId: 'scene', doorId: 'door', state: 'open' }), /plain tutorial door/);
  assert.equal(writes.length, 2);
});

test('broadcast/cleanup require explicit confirmation and folder cleanup preserves scenes', async () => {
  const writes = [];
  const api = { maps: { get: async () => ({ id: 's' }), state: async () => ({}), activate: async p => writes.push(p), deleteFolder: async p => writes.push(p) } };
  await assert.rejects(run('maps', 'activate')(block(api), { mapId: 's', confirm: false }), /Confirm/);
  assert.equal(writes.length, 0);
  await run('maps', 'activate')(block(api), { mapId: 's', confirm: true });
  assert.deepEqual(writes[0], { mapId: 's' });
  await run('maps', 'folder-delete')(block(api), { folderId: 'folder', confirm: true });
  assert.deepEqual(writes[1], { folderId: 'folder', recursive: false });
});

test('token movement keeps cell coordinates, real revision and native player control/lock boundaries', async () => {
  const writes = [];
  const token = { id: 'token', version: 11, canControl: true, locked: false };
  const api = { tokens: { get: async () => ({ ...token }), move: async (p, options) => { writes.push({ p, options }); return {}; } } };
  const ctx = block(api); ctx.context.role = 'player';
  await run('tokens', 'move')(ctx, { mapId: 'scene', id: 'token', x: 3, y: 2 });
  assert.deepEqual(writes[0].p, { mapId: 'scene', id: 'token', expectedVersion: 11, gridX: 3, gridY: 2, path: [] });
  token.locked = true;
  await assert.rejects(run('tokens', 'move')(ctx, { mapId: 'scene', id: 'token', x: 4, y: 2 }), /unlocked/);
  token.locked = false; token.canControl = false;
  await assert.rejects(run('tokens', 'move')(ctx, { mapId: 'scene', id: 'token', x: 4, y: 2 }), /controlled/);
  assert.equal(writes.length, 1);
});

test('token configuration/conditions retain exact server field names and hidden condition rule', async () => {
  const writes = [];
  const api = { tokens: { get: async () => ({ id: 't', version: 23, conditions: [{ condition_id: 'chosen' }, { condition_id: 'retained' }] }),
    configure: async p => writes.push(p), addCondition: async p => writes.push(p), removeCondition: async p => writes.push(p) } };
  await run('tokens', 'configure')(block(api), { mapId: 's', id: 't', rotation: 90, elevation: 2, disposition: 'friendly', locked: false });
  assert.deepEqual(writes[0], { mapId: 's', tokenIds: ['t'], expectedVersion: 23, values: { rotation: 90, elevation: 2, disposition: 'friendly', locked: false } });
  const player = block(api); player.context.role = 'player';
  await assert.rejects(run('tokens', 'condition-add')(player, { mapId: 's', id: 't', label: 'Original', visibility: 'gm', rounds: 2 }), /GM required/);
  await run('tokens', 'condition-add')(player, { mapId: 's', id: 't', label: 'Original', visibility: 'everyone', rounds: 2 });
  assert.deepEqual(writes[1].duration, { type: 'rounds', value: 2, expires: 'end' });
  assert.equal(writes[1].visibility, 'everyone');
  await run('tokens', 'condition-remove')(player, { mapId: 's', id: 't', conditionId: 'chosen' });
  assert.deepEqual(writes[2], { mapId: 's', tokenIds: ['t'], conditionId: 'chosen' });
  await assert.rejects(run('tokens', 'condition-remove')(player, { mapId: 's', id: 't', conditionId: 'not-visible' }), /visible condition/);
  assert.equal(writes.length, 3);
});

test('all fifteen combat write methods execute with scene identity and exact encounter revision', async () => {
  const seen = new Map();
  const methods = ['add', 'remove', 'configure', 'setInitiative', 'rollInitiative', 'toggle', 'moveUp', 'moveDown', 'setTurn', 'nextRound', 'previousRound', 'start', 'stop', 'nextTurn', 'previousTurn'];
  const api = { combat: { state: async () => ({ version: 17, active: true, config: { input: 'number', formula: '1d20' }, combatants: [{ id: 't' }] }) } };
  for (const method of methods) api.combat[method] = async (p, options) => { seen.set(method, { p, options }); return {}; };
  const values = { mapId: 'scene', identityType: 'tokenId', id: 't', confirm: true, formula: '1d20', value: '12', scope: 'one', hidden: false, defeated: true };
  for (const id of ['add', 'remove', 'configure', 'initiative', 'roll', 'toggle', 'set-turn']) await run('combat', id)(block(api), values);
  for (const direction of ['up', 'down']) await run('combat', 'order')(block(api), { ...values, direction });
  for (const direction of ['next', 'previous']) {
    await run('combat', 'turns')(block(api), { ...values, direction });
    await run('combat', 'rounds')(block(api), { ...values, direction });
  }
  for (const action of ['start', 'stop']) await run('combat', 'start-stop')(block(api), { ...values, action });
  assert.deepEqual([...seen.keys()].sort(), methods.sort());
  for (const { p, options } of seen.values()) {
    assert.equal(p.sceneId, 'scene'); assert.equal(p.version, 17); assert.ok(options.signal);
    assert.match(options.requestId, /^[a-f0-9-]{36}$/);
  }
  assert.equal(new Set([...seen.values()].map(row => row.options.requestId)).size, 15);
  assert.equal(seen.get('setInitiative').p.value, 12);
  assert.equal(seen.get('rollInitiative').p.scope, 'one');
  assert.equal(seen.get('rollInitiative').p.tokenId, 't');
});

test('manual text initiative remains text; current player can request next, never previous', async () => {
  const writes = [];
  const api = { combat: { state: async () => ({ version: 2, active: true, config: { input: 'text' } }), setInitiative: async p => writes.push(p), nextTurn: async p => writes.push(p), previousTurn: async p => writes.push(p) } };
  await run('combat', 'initiative')(block(api), { mapId: 's', identityType: 'actorId', id: 'actor', value: 'Fast' });
  assert.equal(writes[0].value, 'Fast'); assert.equal(writes[0].actorId, 'actor'); assert.equal(writes[0].tokenId, undefined);
  const player = block(api); player.context.role = 'player';
  await run('combat', 'turns')(player, { mapId: 's', direction: 'next' });
  await assert.rejects(run('combat', 'turns')(player, { mapId: 's', direction: 'previous' }), /GM required/);
  assert.equal(writes.length, 2);
});

test('a mount abort after a read prevents subsequent writes; a combat conflict never retries', async () => {
  const controller = new AbortController(); let writes = 0, reads = 0;
  const api = { tokens: { get: async () => { controller.abort(); return { id: 't', version: 9 }; }, configure: async () => { writes++; } }, combat: { state: async () => { reads++; return { version: 9 }; }, add: async () => { writes++; throw Object.assign(new Error('changed'), { code: 'conflict' }); } } };
  await assert.rejects(run('tokens', 'configure')({ api, context: { role: 'gm' }, signal: controller.signal }, { mapId: 's', id: 't' }), { code: 'cancelled' });
  assert.equal(writes, 0);
  await assert.rejects(run('combat', 'add')(block(api), { mapId: 's', identityType: 'tokenId', id: 't' }), { code: 'conflict' });
  assert.equal(writes, 1); assert.equal(reads, 2);
});
