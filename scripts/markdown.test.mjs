import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown } from './markdown.mjs';

test('escapes raw HTML, code and hostile link targets', () => {
  const { html } = renderMarkdown('<script>alert(1)</script>\n\n[x](javascript:alert(1)) ![bad](data:image/svg+xml,a)\n\n`<img onerror=x>`');
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('<code>&lt;img onerror=x&gt;</code>'));
  assert.doesNotMatch(html, /<script|onerror=x>|href="javascript:|src="data:/);
  assert.equal(renderMarkdown('[x](safe)', { resolveLink: () => 'javascript:bad' }).html, '<p>x</p>');
});

test('assigns stable ASCII heading anchors with duplicates', () => {
  const result = renderMarkdown('## Instalação e **ação**\n\n## Instalação e ação\n\n### API `actors`');
  assert.deepEqual(result.headings, [
    { id: 'instalacao-e-acao', text: 'Instalação e ação', level: 2 },
    { id: 'instalacao-e-acao-1', text: 'Instalação e ação', level: 2 },
    { id: 'api-actors', text: 'API actors', level: 3 },
  ]);
  assert.deepEqual(renderMarkdown('## Setup\n## Setup\n## Setup-1\n## Setup').headings.map(h => h.id), ['setup', 'setup-1', 'setup-1-1', 'setup-2']);
});

test('renders fenced examples verbatim with unique copy controls', () => {
  const { html } = renderMarkdown('```js\nconst x = "<b>";\n```\n\n~~~text\nsecond\n~~~', { copyLabel: 'Copiar' });
  assert.match(html, /data-copy="code-1">Copiar/);
  assert.match(html, /data-code="code-1" class="language-js">const x = &quot;&lt;b&gt;&quot;;/);
  assert.match(html, /data-copy="code-2"/);
  assert.match(html, /data-code="code-2"/);
});

test('keeps nested ordered/unordered lists and fenced examples within items', () => {
  const { html } = renderMarkdown('1. First\n   - Nested **child**\n   - Second child\n2. Next\n\n   ```sh\n   node --test\n   ```\n\nAfter.');
  assert.match(html, /<ol><li><p>First<\/p>\n<ul>/);
  assert.match(html, /<strong>child<\/strong>/);
  assert.match(html, /<li><p>Next<\/p>\n<div class="code-block">/);
  assert.match(html, /<\/ol>\n<p>After\.<\/p>$/);
});

test('preserves pipes inside code and escaped table cells', () => {
  const { html } = renderMarkdown('| API | Value |\n| --- | ---: |\n| `a|b` | x \\| y |');
  assert.match(html, /class="table-wrap"/);
  assert.match(html, /<td style="text-align:left"><code>a\|b<\/code><\/td>/);
  assert.match(html, /<td style="text-align:right">x \| y<\/td>/);
});

test('resolves relative links and images, preserves inline code and balanced URLs', () => {
  const seen = [];
  const { html } = renderMarkdown('[`API`](api.md#python-interface) ![A & B](../shot.png) [nested](https://example.org/a(b)) `C:\\path\\file`', { resolveLink: href => { seen.push(href); return href.startsWith('http') ? href : `/docs/${href}`; } });
  assert.deepEqual(seen, ['api.md#python-interface', '../shot.png', 'https://example.org/a(b)']);
  assert.match(html, /<a href="\/docs\/api.md#python-interface"><code>API<\/code><\/a>/);
  assert.match(html, /alt="A &amp; B"/);
  assert.match(html, /href="https:\/\/example.org\/a\(b\)"/);
  assert.ok(html.includes('<code>C:\\path\\file</code>'));
});
