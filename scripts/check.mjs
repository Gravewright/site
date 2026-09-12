// Validate the generated pages and report the exact media still needed by the author.
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { locales, download, release } from '../content/site.mjs';
import { socialImage } from './seo.mjs';
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
  const canonical = `https://gravewright.com/${t.file === 'index.html' ? '' : t.file}`;
  assert(html.includes(`<link rel="canonical" href="${canonical}">`), 'Missing canonical URL');
  assert(html.includes(`<meta property="og:url" content="${canonical}">`));
  const poster = socialImage.file;
  assert(html.includes(`<meta property="og:image" content="https://gravewright.com/${poster}">`));
  assert(html.includes(`<meta name="twitter:image" content="https://gravewright.com/${poster}">`));
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  for (const lang of ['en', 'pt-BR', 'x-default']) {
    assert(html.includes(`hreflang="${lang}" href="https://gravewright.com/`));
  }
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]);
  const webPage = schema['@graph'].find(item => item['@type'] === 'WebPage');
  const software = schema['@graph'].find(item => item['@type'] === 'SoftwareApplication');
  assert.equal(webPage.url, canonical);
  assert.equal(webPage.inLanguage, t.lang);
  assert.equal(software.downloadUrl, download);
  assert.equal(software.inLanguage, 'en');
  const preview = await readFile(resolve(root, poster));
  assert.equal(preview.readUInt16BE(0), 0xffd8, 'Social preview must be JPEG');
  assert(preview.length < 300000, 'Keep social preview under 300 KB');
  assert.equal(webPage.primaryImageOfPage.width, socialImage.width);
  assert.equal(webPage.primaryImageOfPage.height, socialImage.height);
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
