// Validate the generated pages and report the exact media still needed by the author.
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { locales, download, release } from '../content/site.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const media = JSON.parse(await readFile(resolve(root, 'content/media.json'), 'utf8'));
const exists = async path => { try { await access(resolve(root, path)); return true; } catch { return false; } };
const pages = new Map();
assert.deepEqual(Object.keys(locales.en), Object.keys(locales.pt), 'Locale keys differ');
for (const t of Object.values(locales)) {
  const html = await readFile(resolve(root, t.file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate ID in ${t.file}`);
  assert.equal([...html.matchAll(/<h1>/g)].length, 1);
  assert(html.includes(`<html lang="${t.lang}"`));
  assert(html.includes(download) && html.includes(release));
  assert(!/Beta 4|SDK 1 RC|v1\.0\.0-beta|PowerShell|127\.0\.0\.1:8000|wiki\/pages/.test(html));
  for (const image of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt="[^"]*"/.test(image[0]), 'Missing image alt');
  for (const video of html.matchAll(/<video\b[^>]*>/g)) {
    assert(/\bcontrols\b/.test(video[0]) && /\baria-label="[^"]+"/.test(video[0]));
    assert(!/\bautoplay\b/.test(video[0]));
  }
  for (const item of media) {
    assert(item.alt.en && item.alt.pt && item.title.en && item.title.pt);
    assert(html.includes(`data-media="${item.id}" data-state="${await exists(item.file) ? 'ready' : 'placeholder'}"`), `Rebuild after changing ${item.file}`);
  }
  pages.set(t.file, { html, ids });
}
let links = 0;
for (const [name, { html, ids }] of pages) {
  for (const [, attr, target] of html.matchAll(/\b(href|src|poster)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    const [path, hash] = target.split('#');
    if (path) assert(await exists(path), `${name}: missing ${attr} ${path}`);
    if (hash) assert((path ? pages.get(path)?.ids : ids)?.includes(hash), `${name}: missing anchor ${target}`);
    links++;
  }
}
const missing = [];
for (const item of media) {
  for (const path of [item.file, item.poster, ...Object.values(item.captions || {}), ...Object.values(item.transcripts || {})].filter(Boolean)) {
    if (!(await exists(path))) missing.push(path);
    else if (path.endsWith('.vtt')) {
      const text = await readFile(resolve(root, path), 'utf8');
      assert(text.startsWith('WEBVTT') && text.includes('-->'), `Add real timed captions: ${path}`);
    }
  }
}
console.log(`Validated 2 pages, matching locale keys, ${links} local links/assets and ${media.length} media slots.`);
if (missing.length) console.log(`\nMedia to supply (${missing.length} files):\n${missing.map(path => '  ' + path).join('\n')}`);
if (process.argv.includes('--require-media') && missing.length) process.exitCode = 1;
else console.log('\nSite check passed. Placeholder mode is intentional.');
