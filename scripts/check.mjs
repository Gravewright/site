// Validate the generated pages and report the exact media still needed by the author.
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { locales, download, release, publicVersion, dndProject, dndRelease, swadeProject, swadeRelease } from '../content/site.mjs';
import { socialImage } from './seo.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const media = JSON.parse(await readFile(resolve(root, 'content/media.json'), 'utf8'));
const exists = async path => { try { await access(resolve(root, path)); return true; } catch { return false; } };
const mediaFile = (item, locale) => item.files?.[locale] || item.file;
const mediaPaths = item => [...new Set([item.file, ...Object.values(item.files || {}), item.poster,
  ...Object.values(item.captions || {}), ...Object.values(item.transcripts || {})].filter(Boolean))];
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
assert(Array.isArray(media) && media.length > 0, 'Media metadata must be a nonempty array');
assert.equal(new Set(media.map(item => item.id)).size, media.length, 'Duplicate media ID');
for (const item of media) {
  assert(/^[a-z][a-z0-9-]*$/.test(item.id), 'Invalid media ID');
  assert(['image', 'video'].includes(item.type), `${item.id}: invalid media type`);
  assert(nonempty(item.file), `${item.id}: missing fallback file`);
  assert(Number.isInteger(item.width) && item.width > 0 && Number.isInteger(item.height) && item.height > 0,
    `${item.id}: dimensions must be positive integers`);
  for (const locale of Object.keys(locales)) {
    assert(nonempty(item.alt?.[locale]) && nonempty(item.title?.[locale]), `${item.id}: missing ${locale} title/alt`);
  }
  if (item.files) {
    assert(typeof item.files === 'object' && !Array.isArray(item.files), `${item.id}: files must map locales to paths`);
    for (const [locale, path] of Object.entries(item.files)) {
      assert(locale in locales && nonempty(path), `${item.id}: invalid localized file ${locale}`);
    }
  }
  for (const path of mediaPaths(item)) {
    assert(nonempty(path) && !/[\\?#]/.test(path) && !path.startsWith('/') && !path.split('/').includes('..') && !path.includes(':'),
      `${item.id}: media paths must stay within the site: ${path}`);
  }
  if (item.durationSeconds !== undefined) {
    assert(item.type === 'video' && Number.isFinite(item.durationSeconds) && item.durationSeconds > 0,
      `${item.id}: invalid video duration`);
  }
  if (item.type === 'video') {
    assert(nonempty(item.poster), `${item.id}: missing video poster`);
    for (const locale of Object.keys(locales)) {
      assert(nonempty(item.captions?.[locale]) && nonempty(item.transcripts?.[locale]),
        `${item.id}: missing ${locale} caption/transcript path`);
    }
    if (item.music) for (const key of ['title', 'artist', 'url', 'license', 'licenseUrl']) {
      assert(nonempty(item.music[key]), `${item.id}: missing music ${key}`);
    }
  }
}
const pages = new Map();
assert.deepEqual(Object.keys(locales.en), Object.keys(locales.pt), 'Locale keys differ');
for (const [locale, t] of Object.entries(locales)) {
  const html = await readFile(resolve(root, t.file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate ID in ${t.file}`);
  assert.equal([...html.matchAll(/<h1>/g)].length, 1);
  assert(html.includes(`<html lang="${t.lang}"`));
  assert(html.includes(download) && html.includes(release));
  assert(html.includes(dndProject) && html.includes(dndRelease), 'Missing available DnD system links');
  assert(html.includes(swadeProject) && html.includes(swadeRelease), 'Missing available Savage Worlds package links');
  assert(!/Beta 4|SDK 1 RC|v1\.0\.0-beta|PowerShell|127\.0\.0\.1:8000|wiki\/pages/.test(html));
  for (const image of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt="[^"]*"/.test(image[0]), 'Missing image alt');
  for (const video of html.matchAll(/<video\b[^>]*>/g)) {
    assert(/\bcontrols\b/.test(video[0]) && /\baria-label="[^"]+"/.test(video[0]));
    assert(!/\bautoplay\b/.test(video[0]));
  }
  for (const item of media) {
    const path = mediaFile(item, locale);
    const ready = await exists(path);
    const figure = [...html.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/g)].find(match => match[0].includes(`data-media="${item.id}"`))?.[0];
    assert(figure?.includes(`data-state="${ready ? 'ready' : 'placeholder'}"`), `Rebuild ${t.file} after changing ${path}`);
    if (ready) {
      assert(figure.includes(`src="${path}"`), `${t.file}: wrong ${locale} media file for ${item.id}`);
      if (item.type === 'video') {
        for (const [captionLocale, caption] of Object.entries(item.captions)) {
          if (await exists(caption)) assert(figure.includes(`src="${caption}" srclang="${locales[captionLocale].lang}"`),
            `${t.file}: missing ${captionLocale} captions`);
        }
        if (await exists(item.transcripts[locale])) assert(figure.includes(`href="${item.transcripts[locale]}"`),
          `${t.file}: missing localized transcript`);
      }
    }
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
  assert.equal(software.softwareVersion, publicVersion);
  assert.equal(software.inLanguage, 'en');
  assert.equal(software.screenshot, `https://gravewright.com/${mediaFile(media.find(item => item.id === 'builder'), locale)}`);
  const preview = await readFile(resolve(root, poster));
  assert.equal(preview.readUInt16BE(0), 0xffd8, 'Social preview must be JPEG');
  assert(preview.length < 300000, 'Keep social preview under 300 KB');
  assert.equal(webPage.primaryImageOfPage.width, socialImage.width);
  assert.equal(webPage.primaryImageOfPage.height, socialImage.height);
  pages.set(t.file, { html, ids });
}
let links = 0;
const knowledge = JSON.parse(await readFile(resolve(root, 'content/knowledge-manifest.json'), 'utf8'));
const searchIndex = JSON.parse(await readFile(resolve(root, 'knowledge-search.json'), 'utf8'));
assert.equal(knowledge.version, publicVersion, 'Project reference and public version differ');
assert(/^[a-f0-9]{40}$/.test(knowledge.sourceRevision), 'Missing pinned project revision');
const contracts = JSON.parse(await readFile(resolve(root, 'content/extension-contracts.json'), 'utf8'));
assert.equal(contracts.hostVersion, knowledge.version, 'SDK snapshot and project reference versions differ');
assert.equal(contracts.sourceRevision, knowledge.sourceRevision, 'SDK snapshot and project reference revisions differ');
assert(knowledge.pages.length > 60, 'Missing wiki/docs articles');
for (const entry of knowledge.pages) {
  const html = await readFile(resolve(root, entry.path), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${entry.path}: duplicate IDs`);
  assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length, 1, `${entry.path}: expected one h1`);
  assert(html.includes(`<html lang="${entry.locale === 'pt' ? 'pt-BR' : 'en'}"`));
  assert(html.includes(`<link rel="canonical" href="https://gravewright.com/${entry.path}">`));
  assert(html.includes('data-search') && html.includes('data-language'));
  assert(!/<dialog\b|\balert\(/.test(html), `${entry.path}: unsupported modal`);
  for (const image of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt="[^"]*"/.test(image[0]), `${entry.path}: image alt`);
  if (!entry.hub) {
    assert(html.includes('class="kb-prose"') && html.includes('class="kb-sources"'), `${entry.path}: missing article content/provenance`);
    const indexed = searchIndex.find(item => item.url === entry.path);
    assert(indexed?.text.length > 250, `${entry.path}: missing full-text search entry`);
  }
  pages.set(entry.path, { html, ids });
}
const productPages=knowledge.pages.filter(page=>page.area==='wiki' && !page.hub);
assert(productPages.filter(page=>page.images>0).length > productPages.length/2, 'Most wiki guides should have relevant screenshots');
const wikiMedia=JSON.parse(await readFile(resolve(root,'content/wiki-media.json'),'utf8'));
assert.equal(new Set(wikiMedia.map(item=>item.id)).size,wikiMedia.length,'Duplicate wiki screenshot IDs');
for(const item of wikiMedia){
  assert(nonempty(item.file) && !item.file.includes('..') && !item.file.startsWith('/'),'Invalid wiki media path');
  assert(await exists(item.file),`Missing wiki screenshot ${item.file}`);
  assert(Number.isInteger(item.width) && item.width>0 && Number.isInteger(item.height) && item.height>0,'Wiki screenshot dimensions must be positive integers');
  assert(/^\d+\.\d+\.\d+$/.test(item.version) && nonempty(item.origin),'Wiki screenshot needs a captured version and provenance');
  // Captures retain their real version when the documented release advances.
  const captured=item.version.split('.').map(Number), current=publicVersion.split('.').map(Number);
  const difference=captured.map((part,index)=>part-current[index]).find(value=>value!==0) || 0;
  assert(captured.every(Number.isSafeInteger) && difference<=0,'Wiki screenshot cannot claim an unreleased version');
  for(const locale of ['en','pt']) {
    assert(nonempty(item.alt?.[locale]) && nonempty(item.caption?.[locale]),`Missing ${locale} screenshot text`);
    assert(item.alt[locale].includes(item.version) && item.caption[locale].includes(item.version),`Disclose the captured version in ${locale} screenshot text`);
  }
}
const sitemap=await readFile(resolve(root, 'sitemap.xml'), 'utf8');
for(const path of pages.keys()) assert(sitemap.includes(`https://gravewright.com/${path==='index.html'?'':path}</loc>`), `Missing sitemap page ${path}`);
for (const [name, { html, ids }] of pages) {
  for (const [, attr, target] of html.matchAll(/\b(href|src|poster)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    const [rawPath, hash] = target.split('#');
    const path=rawPath ? posix.normalize(posix.join(posix.dirname(name), decodeURI(rawPath))) : '';
    if (path) assert(await exists(path), `${name}: missing ${attr} ${path}`);
    if (hash) assert((path ? pages.get(path)?.ids : ids)?.includes(decodeURIComponent(hash)), `${name}: missing anchor ${target}`);
    links++;
  }
}
const missing = new Set();
for (const item of media) {
  for (const path of mediaPaths(item)) {
    if (!(await exists(path))) missing.add(path);
    else if (path.endsWith('.vtt')) {
      const text = await readFile(resolve(root, path), 'utf8');
      assert(text.startsWith('WEBVTT') && text.includes('-->'), `Add real timed captions: ${path}`);
      const timing = /((?:\d{2}:)?\d{2}:\d{2}\.\d{3}) --> ((?:\d{2}:)?\d{2}:\d{2}\.\d{3})/g;
      const seconds = timestamp => timestamp.split(':').reduce((total, value) => total * 60 + Number(value), 0);
      const cues = [...text.matchAll(timing)];
      assert(cues.length > 0, `Missing valid WebVTT cue times: ${path}`);
      let previous = -1;
      for (const [, startTime, endTime] of cues) {
        const start = seconds(startTime), end = seconds(endTime);
        assert(start >= previous && end > start, `Invalid or unordered caption timing: ${path}`);
        if (item.durationSeconds) assert(end <= item.durationSeconds + 0.1, `Caption exceeds video duration: ${path}`);
        previous = start;
      }
    } else if (Object.values(item.transcripts || {}).includes(path)) {
      const transcript = await readFile(resolve(root, path), 'utf8');
      assert(nonempty(transcript), `Empty transcript: ${path}`);
      if (item.music) for (const credit of [item.music.title, item.music.artist, item.music.licenseUrl]) {
        assert(transcript.includes(credit), `Missing soundtrack credit in ${path}: ${credit}`);
      }
    }
  }
}
console.log(`Validated ${pages.size} pages, matching locale keys, ${links} local links/assets and ${media.length} product media slots.`);
if (missing.size) console.log(`\nMedia to supply (${missing.size} files):\n${[...missing].map(path => '  ' + path).join('\n')}`);
if (process.argv.includes('--require-media') && missing.size) process.exitCode = 1;
else console.log(missing.size ? '\nSite check passed with intentional placeholders.' : '\nSite check passed. All planned media are present.');
