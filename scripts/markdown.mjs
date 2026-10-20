// Small, dependency-free Markdown renderer for the project's documentation.
// Supports prose, headings, nested lists, fences, quotes, GFM-style tables and
// inline links/images/code/emphasis. Raw HTML is escaped; MDX, HTML blocks,
// footnotes, reference-style links and executable diagram plugins are not used.
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function safeUrl(value, image = false) {
  const url = String(value).trim();
  if (/[\u0000-\u0020\u007f\\]/.test(url)) return null;
  const scheme = url.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme && !(image ? ['http', 'https'] : ['http', 'https', 'mailto']).includes(scheme)) return null;
  return url;
}

function plainText(value) {
  return value.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*_~]/g, '').replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~\\])/g, '$1');
}

function splitCells(line) {
  const cells = []; let current = ''; let code = 0;
  const source = line.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '');
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === '\\' && source[i + 1] === '|') { current += '|'; i++; continue; }
    if (char === '`') {
      const run = source.slice(i).match(/^`+/)[0];
      if (!code) code = run.length; else if (code === run.length) code = 0;
      current += run; i += run.length - 1; continue;
    }
    if (char === '|' && !code) { cells.push(current.trim()); current = ''; } else current += char;
  }
  cells.push(current.trim());
  return cells;
}

export function renderMarkdown(markdown, { resolveLink = href => href, copyLabel = 'Copy' } = {}) {
  const headings = [], ids = new Map(), usedIds = new Set(); let codeNumber = 0;
  const lines = String(markdown).replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
  const resolve = (href, image = false) => {
    // Validate before and after the caller's route transformation.
    const unsafeScheme = href.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
    if (unsafeScheme && !['http', 'https', 'mailto', 'wiki', 'docs'].includes(unsafeScheme)) return null;
    return safeUrl(resolveLink(href), image);
  };

  function inline(source) {
    let html = '';
    for (let i = 0; i < source.length;) {
      const rest = source.slice(i);
      if (rest[0] === '\\' && /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~\\]/.test(rest[1] || '')) { html += escape(rest[1]); i += 2; continue; }
      if (rest[0] === '`') {
        const marker = rest.match(/^`+/)[0], end = source.indexOf(marker, i + marker.length);
        if (end !== -1) { html += `<code>${escape(source.slice(i + marker.length, end).replace(/\n/g, ' '))}</code>`; i = end + marker.length; continue; }
      }
      const image = rest.startsWith('!['), opening = image ? 2 : rest[0] === '[' ? 1 : 0;
      if (opening) {
        let endLabel = i + opening, depth = 1;
        for (; endLabel < source.length; endLabel++) {
          if (source[endLabel] === '\\') { endLabel++; continue; }
          if (source[endLabel] === '[') depth++;
          if (source[endLabel] === ']' && --depth === 0) break;
          if (source[endLabel] !== ']') depth = Math.max(1, depth);
        }
        if (source[endLabel + 1] === '(') {
          let end = endLabel + 2, parentheses = 1;
          for (; end < source.length; end++) {
            if (source[end] === '\\') { end++; continue; }
            if (source[end] === '(') parentheses++;
            if (source[end] === ')' && --parentheses === 0) break;
            if (source[end] !== ')') parentheses = Math.max(1, parentheses);
          }
          if (parentheses === 0) {
            const label = source.slice(i + opening, endLabel);
            const target = source.slice(endLabel + 2, end).trim().replace(/^<([^>]+)>$/, '$1');
            const href = resolve(target, image);
            html += href === null ? escape(plainText(label)) : image ? `<img src="${escape(href)}" alt="${escape(plainText(label))}" loading="lazy">` : `<a href="${escape(href)}">${inline(label)}</a>`;
            i = end + 1; continue;
          }
        }
      }
      const emphasis = rest.match(/^(\*\*|__|\*|_)(?=\S)/);
      if (emphasis && !(emphasis[1].includes('_') && /[\p{L}\p{N}]/u.test(source[i - 1] || ''))) {
        const marker = emphasis[1], end = source.indexOf(marker, i + marker.length);
        if (end > i + marker.length && /\S/.test(source[end - 1])) {
          const tag = marker.length === 2 ? 'strong' : 'em';
          html += `<${tag}>${inline(source.slice(i + marker.length, end))}</${tag}>`; i = end + marker.length; continue;
        }
      }
      const autolink = rest.match(/^<(https?:\/\/[^<>\s]+|mailto:[^<>\s]+)>/i);
      if (autolink) { const href = resolve(autolink[1]); html += href ? `<a href="${escape(href)}">${escape(autolink[1])}</a>` : escape(autolink[0]); i += autolink[0].length; continue; }
      html += escape(rest[0]); i++;
    }
    return html;
  }

  const listMarker = line => /^( *)([-+*]|\d+[.)])\s+(.*)$/.exec(line);
  const tableRule = line => { const cells = splitCells(line); return cells.length > 1 && cells.every(cell => /^:?-{3,}:?$/.test(cell)); };
  const blockStart = (line, next = '') => /^\s*$/.test(line) || /^ {0,3}(#{1,6})\s+/.test(line) || /^\s*(`{3,}|~{3,})/.test(line) || /^ {0,3}>/.test(line) || !!listMarker(line) || /^ {0,3}(?:\*\s*){3,}$|^ {0,3}(?:-\s*){3,}$|^ {0,3}(?:_\s*){3,}$/.test(line) || tableRule(next);

  function blocks(source) {
    const output = []; let i = 0;
    while (i < source.length) {
      const line = source[i];
      if (!line.trim()) { i++; continue; }
      const fence = /^\s*(`{3,}|~{3,})([^`]*)$/.exec(line);
      if (fence) {
        const code = [], marker = fence[1][0], length = fence[1].length;
        i++;
        while (i < source.length && !new RegExp(`^\\s*${marker}{${length},}\\s*$`).test(source[i])) code.push(source[i++]);
        if (i < source.length) i++;
        const id = `code-${++codeNumber}`, language = fence[2].trim().split(/\s+/)[0].replace(/[^\w+-]/g, '');
        output.push(`<div class="code-block"><div class="code-toolbar"><span>${escape(language || 'text')}</span><button type="button" data-copy="${id}">${escape(copyLabel)}</button></div><pre><code data-code="${id}"${language ? ` class="language-${language}"` : ''}>${escape(code.join('\n'))}</code></pre></div>`); continue;
      }
      const heading = /^ {0,3}(#{1,6})\s+(.+?)\s*$/.exec(line);
      if (heading) {
        heading[2] = heading[2].replace(/\s+#+\s*$/, '');
        const level = heading[1].length, text = plainText(heading[2]);
        const base = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z\d\s_-]/g, '').trim().replace(/\s+/g, '-') || 'section';
        let count = ids.get(base) || 0, id = `${base}${count ? `-${count}` : ''}`;
        while (usedIds.has(id)) { count++; id = `${base}-${count}`; }
        ids.set(base, count + 1); usedIds.add(id);
        headings.push({ id, text, level }); output.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`); i++; continue;
      }
      if (/^ {0,3}(?:\*\s*){3,}$|^ {0,3}(?:-\s*){3,}$|^ {0,3}(?:_\s*){3,}$/.test(line)) { output.push('<hr>'); i++; continue; }
      if (/^ {0,3}>/.test(line)) {
        const quote = []; while (i < source.length && /^ {0,3}>/.test(source[i])) quote.push(source[i++].replace(/^ {0,3}> ?/, ''));
        output.push(`<blockquote>${blocks(quote)}</blockquote>`); continue;
      }
      if (i + 1 < source.length && tableRule(source[i + 1])) {
        const headers = splitCells(line), rules = splitCells(source[i + 1]); i += 2;
        const align = index => rules[index]?.startsWith(':') && rules[index]?.endsWith(':') ? 'center' : rules[index]?.endsWith(':') ? 'right' : 'left';
        const rows = [];
        while (i < source.length && source[i].includes('|') && source[i].trim()) {
          const cells = splitCells(source[i++]); rows.push(`<tr>${headers.map((_, n) => `<td style="text-align:${align(n)}">${inline(cells[n] || '')}</td>`).join('')}</tr>`);
        }
        output.push(`<div class="table-wrap"><table><thead><tr>${headers.map((cell,n) => `<th scope="col" style="text-align:${align(n)}">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`); continue;
      }
      const first = listMarker(line);
      if (first) {
        const indent = first[1].length, ordered = /^\d/.test(first[2]), tag = ordered ? 'ol' : 'ul', start = ordered ? Number.parseInt(first[2], 10) : 1;
        const items = [];
        while (i < source.length) {
          const marker = listMarker(source[i]);
          if (!marker || marker[1].length !== indent || /^\d/.test(marker[2]) !== ordered) break;
          const body = [marker[3]], contentIndent = marker[0].length - marker[3].length; i++;
          while (i < source.length) {
            const nextMarker = listMarker(source[i]);
            if (nextMarker && nextMarker[1].length <= indent) break;
            if (!source[i].trim()) {
              let following = i + 1; while (following < source.length && !source[following].trim()) following++;
              if (following === source.length || ((source[following].match(/^ */)?.[0].length || 0) <= indent && !listMarker(source[following]))) break;
              body.push(''); i++; continue;
            }
            const leading = source[i].match(/^ */)[0].length;
            if (leading <= indent && blockStart(source[i], source[i + 1])) break;
            body.push(source[i].slice(Math.min(contentIndent, leading))); i++;
          }
          items.push(`<li>${blocks(body)}</li>`);
        }
        output.push(`<${tag}${ordered && start !== 1 ? ` start="${start}"` : ''}>${items.join('')}</${tag}>`); continue;
      }
      const paragraph = [line]; i++;
      while (i < source.length && !blockStart(source[i], source[i + 1])) paragraph.push(source[i++]);
      output.push(`<p>${inline(paragraph.join('\n')).replace(/ {2}\n/g, '<br>\n')}</p>`);
    }
    return output.join('\n');
  }
  return { html: blocks(lines), headings };
}
