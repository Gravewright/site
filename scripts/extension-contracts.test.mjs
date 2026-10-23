import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import contracts from '../content/extension-contracts.json' with {type:'json'};
import {documentedDomainMethods} from '../content/tutorial-capabilities.mjs';

// Host integration is opt-in; an explicitly supplied invalid source must fail.
// Without GRAVEWRIGHT_SOURCE the site remains an independent checkout.
const hostRoot = process.env.GRAVEWRIGHT_SOURCE ? resolve(process.env.GRAVEWRIGHT_SOURCE) : null;
const methodNames = documentedDomainMethods.map(({domain, method}) => `${domain}.${method}`);

test('the capability catalog names each method once and gives every entry a guide', () => {
  assert.equal(new Set(methodNames).size, methodNames.length, 'Duplicate domain method in the capability catalog');
  for (const {domain, method, slug} of documentedDomainMethods) {
    assert.equal(typeof domain, 'string');
    assert.equal(typeof method, 'string');
    assert(domain.length > 0 && method.length > 0, 'Domain and method names must be nonempty');
    assert.equal(typeof slug, 'string', `Missing guide for ${domain}.${method}`);
    assert(/^[a-z][a-z0-9-]*$/.test(slug), `Invalid guide for ${domain}.${method}: ${slug}`);
  }
});

test('the pinned contract and catalog cover the real host API, including convenience and file methods', {
  skip: hostRoot ? false : 'Set GRAVEWRIGHT_SOURCE to compare with the real Gravewright domain API.',
}, async () => {
  const [{createDomainApi}, sourceContract] = await Promise.all([
    import(pathToFileURL(resolve(hostRoot, 'gravewright/modules/static/gravewright_modules/domain-api.js')).href),
    readFile(resolve(hostRoot, 'gravewright/modules/contracts/frontend.json'), 'utf8'),
  ]);
  const forbiddenTransport = () => assert.fail('Catalog inspection must not read or mutate campaign data');
  const api = createDomainApi(forbiddenTransport, {files: forbiddenTransport});
  const exposedMethods = Object.entries(api).flatMap(([domain, resource]) =>
    resource && typeof resource === 'object'
      ? Object.entries(resource).filter(([, value]) => typeof value === 'function').map(([method]) => `${domain}.${method}`)
      : []);

  assert.deepEqual(api.capabilities(), JSON.parse(sourceContract), 'The host generated registry differs from its source contract');
  assert.deepEqual(api.capabilities(), contracts.frontend, 'Refresh the pinned frontend contract from the selected host');
  assert.equal(api.version, contracts.frontend.version);
  assert.deepEqual(methodNames.slice().sort(), exposedMethods.sort(),
    'The catalog must include exactly the public domain methods exposed by the host');
});
