// Generate the product wiki and developer reference as readable, standalone HTML.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, posix } from 'node:path';
import { wikiArticles } from '../content/wiki.mjs';
import { aiArticles } from '../content/ai-guides.mjs';
import { renderMarkdown } from './markdown.mjs';
import { project, publicVersion, locales } from '../content/site.mjs';
import { origin, socialImage } from './seo.mjs';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const copy = {
  en: {wiki:'Product wiki', docs:'Developer docs', ai:'Build with AI', home:'Home', search:'Search the wiki and docs', placeholder:'Try “tokens”, “API” or “AI”…', clear:'Clear search', results:'results', empty:'No matches. Try another term or browse the topics below.', loading:'Searching…', error:'Search is unavailable. Browse the navigation below.', all:'All topics', contents:'On this page', browse:'Browse topics', source:'Source in the project', based:'Based on Gravewright', previous:'Previous', next:'Next', related:'Continue reading', image:'Open full screenshot', reading:'min read', wikiTitle:'Everything you need for your next session.', wikiIntro:'Learn to install Gravewright, prepare your campaign and run the table. Practical guides for game masters, players and hosts.', docsTitle:'Understand the platform. Build your own tools.', docsIntro:'The complete project reference, public APIs and extension contracts, plus practical AI workflows for building and validating changes.', aiTitle:'Use AI with the project as context.', aiIntro:'Choose a task, copy a prompt and check the result against the real code and supported contracts.', start:'Start here', topics:'guides', nojs:'You can browse every guide below without JavaScript. Search requires JavaScript.', workflow:'A practical starting point', contextual:'How to use AI for this task', contextualCopy:'Give the assistant the relevant files, a concrete goal and the validation steps. These guides include prompts you can adapt.', version:'Reference version', copied:'Copied', copy:'Copy', selected:'Selected', copiedMessage:'Copied to clipboard.', selectedMessage:'Text selected. Use your keyboard to copy.', nav:'Main navigation', menu:'Menu', skip:'Skip to content', language:'Português', top:'Back to top', screenshot:'Screenshot', reference:'Project reference'},
  pt: {wiki:'Wiki do produto', docs:'Docs para devs', ai:'Desenvolva com IA', home:'Início', search:'Buscar na wiki e na documentação', placeholder:'Tente “tokens”, “API” ou “IA”…', clear:'Limpar busca', results:'resultados', empty:'Nenhum resultado. Tente outro termo ou navegue pelos assuntos abaixo.', loading:'Buscando…', error:'A busca está indisponível. Use a navegação abaixo.', all:'Todos os assuntos', contents:'Nesta página', browse:'Explorar assuntos', source:'Fonte no projeto', based:'Baseado no Gravewright', previous:'Anterior', next:'Próximo', related:'Continue a leitura', image:'Abrir captura completa', reading:'min de leitura', wikiTitle:'Tudo para a sua próxima sessão.', wikiIntro:'Aprenda a instalar o Gravewright, preparar sua campanha e conduzir a mesa. Guias práticos para mestres, jogadores e administradores.', docsTitle:'Entenda a plataforma. Crie suas ferramentas.', docsIntro:'A referência completa do projeto, APIs públicas e contratos de extensão, com fluxos de IA para desenvolver e validar alterações.', aiTitle:'Use a IA com o projeto como contexto.', aiIntro:'Escolha uma tarefa, copie um prompt e confira o resultado no código real e nos contratos suportados.', start:'Comece por aqui', topics:'guias', nojs:'Todos os guias abaixo funcionam sem JavaScript. A busca precisa de JavaScript.', workflow:'Um caminho para começar', contextual:'Como usar a IA para esta tarefa', contextualCopy:'Forneça os arquivos relevantes, um objetivo concreto e os passos de validação. Estes guias trazem prompts adaptáveis.', version:'Versão de referência', copied:'Copiado', copy:'Copiar', selected:'Selecionado', copiedMessage:'Copiado para a área de transferência.', selectedMessage:'Texto selecionado. Use o teclado para copiar.', nav:'Navegação principal', menu:'Menu', skip:'Pular para o conteúdo', language:'English', top:'Voltar ao topo', screenshot:'Captura de tela', reference:'Referência do projeto'}
};
const groups = {
  en:{start:'Getting started', setup:'Installation & access', campaign:'Campaigns & people', table:'At the table', tools:'Tabletop tools', builder:'Map Builder', content:'Content & extensions', hosting:'Hosting & recovery', reference:'Project reference', ai:'How to use AI', operations:'Hosting & operations', development:'Development', extensions:'APIs & extensions'},
  pt:{start:'Primeiros passos', setup:'Instalação e acesso', campaign:'Campanhas e pessoas', table:'Durante a sessão', tools:'Ferramentas da mesa', builder:'Map Builder', content:'Conteúdo e extensões', hosting:'Hospedagem e recuperação', reference:'Referência do projeto', ai:'Como usar a IA', operations:'Hospedagem e operação', development:'Desenvolvimento', extensions:'APIs e extensões'}
};
const localePath = locale => locale === 'pt' ? 'pt-BR' : 'en';
const articlePath = (article, locale) => `${article.area}/${localePath(locale)}/${article.slug}.html`;
const hubPath = (area, locale) => `${area}/${localePath(locale)}/index.html`;
const relative = (from, to) => posix.relative(posix.dirname(from), to) || posix.basename(to);
const link = (href, text, attrs='') => `<a href="${esc(href)}"${attrs}>${esc(text)}</a>`;

// Keep the source snapshot exact while presenting the current distribution policy.
function publicationCopy(article, locale, markdown) {
  if(article.area!=='docs' || !article[locale]?.file) return markdown;
  let text=markdown.replace(/\r\n/g,'\n');
  if(article.slug==='modules') {
    if(locale==='en') text=text.replace('installed system or its trusted companion app','installed system package')
      .replace(/A system may distribute its browser UI and server rules as\nseparate packages\./,'Each new RPG system must use one installable system package and the automation\nAPIs supported by the requested host release. This release does not allow a\nbrowser system manifest to also declare a Django app. Document unsupported\nserver-side requirements as limitations; do not create a separately installed\ncompanion or require a host upgrade to solve a system-package task. The Python\nprovider contract remains a reference for trusted server integrations.');
    else text=text.replace('sistema instalado ou ao app complementar confiável','pacote do sistema instalado')
      .replace(/Um sistema pode distribuir sua interface e suas regras de servidor\nem pacotes separados\./,'Cada novo sistema de RPG deve usar um único pacote de sistema instalável e as\nAPIs de automação suportadas pela versão solicitada do host. Esta release não\npermite que um manifesto de sistema de navegador também declare um app Django.\nRegistre requisitos de servidor sem suporte como limitações; não crie um\ncomplemento instalado separadamente nem exija uma atualização do host para\nresolver uma tarefa de pacote de sistema. O contrato de provedores Python\ncontinua como referência de integrações confiáveis de servidor.');
  }
  if(article.slug==='map-builder') {
    if(locale==='en') text=text.replace(/This guide describes the current checkout being documented for the next\n\*\*0\.3\.0\*\* release; it does not announce publication\./,'This guide describes the Map Builder implementation in the documented\n**0.3.0** source revision.');
    else text=text.replace('Este guia descreve o código atual que está sendo documentado para a próxima\nversão **0.3.0**; não anuncia sua publicação.','Este guia descreve a implementação do Map Builder na revisão documentada\nda **0.3.0**.');
  }
  return text;
}

export async function buildKnowledge(root) {
  const catalog = JSON.parse(await readFile(resolve(root, 'content/reference/catalog.json'), 'utf8'));
  const productMedia = JSON.parse(await readFile(resolve(root, 'content/media.json'), 'utf8'));
  let wikiMedia = [];
  try { wikiMedia = JSON.parse(await readFile(resolve(root, 'content/wiki-media.json'), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const articles = [...wikiArticles.map(a=>({...a,area:'wiki'})), ...catalog.articles.map(a=>({...a,area:'docs'})), ...aiArticles.map(a=>({...a,area:'docs'}))];
  const paths = new Set();
  const search = [];
  const manifest = [];
  const sourceRevision = catalog.sourceRevision;
  const sourceUrl = path => `${project}/blob/${sourceRevision}/${path}`;
  const sourceMap = new Map();
  for (const article of articles) for (const path of article.sourcePaths || []) {
    if (article.area === 'docs' && article.en.file) sourceMap.set(path, article);
  }
  const family = (area, aiOnly=false) => articles.filter(a=>a.area===area && (!aiOnly || a.group==='ai'));
  const titleForGroup = (locale, group) => groups[locale][group] || (locale === 'pt' ? 'Guia do produto' : 'Product guide');

  function resolveLink(href, article, locale, current) {
    if (/^(https?:|mailto:)/.test(href)) return href;
    const normalizeHash = value => decodeURIComponent(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if (href.startsWith('#')) return '#'+normalizeHash(href.slice(1));
    const [path, hash] = href.split('#');
    const sourcePath = article[locale]?.file ? (article.sourcePaths?.find(p=>p.includes(locale === 'pt' ? 'pt-BR' : '/en/')) || article.sourcePaths?.[0]) : null;
    const target = sourcePath ? posix.normalize(posix.join(posix.dirname(sourcePath), decodeURI(path))) : path;
    const mapped = sourceMap.get(target);
    if (mapped) {
      const targetLocale = target.includes('/pt-BR/') || /\.pt-BR\.md$/.test(target) ? 'pt' : target.includes('/en/') ? 'en' : locale;
      return relative(current, articlePath(mapped, targetLocale)) + (hash ? `#${normalizeHash(hash)}` : '');
    }
    if (/^(\.\.\/)?README(?:\.pt-BR)?\.md$/.test(path) || target === 'docs/README.md' || target === 'docs/README.pt-BR.md') return relative(current, hubPath(article.area, locale));
    if (path.startsWith('wiki:') || path.startsWith('docs:')) {
      const [area, slug] = path.split(':');
      return relative(current, `${area}/${localePath(locale)}/${slug}.html`) + (hash ? `#${normalizeHash(hash)}` : '');
    }
    if (sourcePath) return sourceUrl(target) + (hash ? `#${hash}` : '');
    return href;
  }

  function navigation(locale, current, area, active) {
    const grouped = Map.groupBy(family(area), a=>a.group);
    return [...grouped].map(([group, entries])=>`<div class="kb-nav-group"><p>${esc(titleForGroup(locale, group))}</p><ul>${entries.map(a=>`<li>${link(relative(current, articlePath(a, locale)), a[locale].title, active === a.slug ? ' aria-current="page"' : '')}</li>`).join('')}</ul></div>`).join('');
  }
  function cards(entries, locale, current) {
    return `<div class="kb-cards">${entries.map((article,i)=>`<a class="kb-card" href="${relative(current, articlePath(article,locale))}"><span class="kb-card-label">${esc(titleForGroup(locale,article.group))}<span aria-hidden="true">↗</span></span><h2>${esc(article[locale].title)}</h2><p>${esc(article[locale].summary)}</p></a>`).join('')}</div>`;
  }
  function shell({locale, area, current, title, description, active, body, headings=[], translated, article}) {
    const t=copy[locale], lang=localePath(locale), to=path=>relative(current,path);
    const home=locale==='en'?'index.html':'pt-br.html';
    const alternate=translated || current.replace(`/${lang}/`, `/${locale==='en'?'pt-BR':'en'}/`);
    const canonical=`${origin}/${current}`;
    const searchWidget=`<div class="kb-search" data-search data-index="${to('knowledge-search.json')}" data-locale="${locale}" data-results-label="${t.results}" data-empty-label="${esc(t.empty)}" data-loading-label="${t.loading}" data-error-label="${esc(t.error)}"><label for="knowledge-search">${t.search}</label><div class="kb-search-control"><span aria-hidden="true">⌕</span><input id="knowledge-search" type="search" placeholder="${esc(t.placeholder)}" autocomplete="off" aria-controls="search-results"><button type="button" data-search-clear aria-label="${t.clear}" hidden>×</button></div><p class="kb-search-status" role="status" aria-live="polite"></p><ol id="search-results" class="kb-search-results" hidden></ol><noscript><p>${t.nojs}</p></noscript></div>`;
    const contextual = article?.area==='docs' && article.group!=='ai' ? `<aside class="kb-ai-callout"><span class="kb-eyebrow">${t.ai}</span><h2>${t.contextual}</h2><p>${t.contextualCopy}</p><div class="kb-ai-links">${aiArticles.filter(a=>{
      const combined=`${article.slug} ${(article.sourcePaths||[]).join(' ')}`;
      return /module|api|frontend/.test(combined) ? /system|browser|module/.test(a.slug) : /test/.test(combined) ? /test|bug|debug/.test(a.slug) : /map|universal/.test(combined) ? /map|blueprint/.test(a.slug) : /bug|debug|contribut/.test(a.slug);
    }).slice(0,3).map(a=>link(to(articlePath({...a,area:'docs'},locale)),a[locale].title)).join('')}${link(to(`docs/${lang}/ai.html`),locale==='pt'?'Ver todos os guias de IA →':'Explore all AI guides →')}</div></aside>` : '';
    const sourcePaths=article?.sourcePaths || [];
    const sourceLinks=sourcePaths.length?`<div class="kb-sources"><p>${t.source}</p>${sourcePaths.map(p=>link(sourceUrl(p),p)).join('')}</div>`:'';
    const schema={'@context':'https://schema.org','@type':article?(article.area==='docs'?'TechArticle':'Article'):'CollectionPage',headline:title,description,inLanguage:lang,url:canonical,isPartOf:{'@type':'WebSite',name:'Gravewright',url:origin}};
    return `<!doctype html>
<html lang="${lang}" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} | Gravewright</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#0b0d10"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="${origin}/${locale==='en'?current:alternate}"><link rel="alternate" hreflang="pt-BR" href="${origin}/${locale==='pt'?current:alternate}"><link rel="alternate" hreflang="x-default" href="${origin}/${locale==='en'?current:alternate}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)} | Gravewright"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/${socialImage.file}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${to('assets/icon.svg')}" type="image/svg+xml"><link rel="stylesheet" href="${to('styles.css')}"><link rel="stylesheet" href="${to('knowledge.css')}"><script src="${to('script.js')}" defer></script><script src="${to('knowledge.js')}" defer></script><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>
<body class="knowledge-page" data-copy-label="${t.copy}" data-copied-label="${t.copied}" data-selected-label="${t.selected}" data-copied-message="${t.copiedMessage}" data-selected-message="${t.selectedMessage}"><a class="skip-link" href="#main-content">${t.skip}</a><header class="site-header" data-header><div class="shell header-inner"><a class="brand" href="${to(home)}"><span class="brand-icon"><img src="${to('assets/icon.svg')}" width="34" height="34" alt=""></span><span>Gravewright</span></a><button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" data-menu-toggle><span></span><span></span><span class="sr-only">${t.menu}</span></button><nav class="main-nav" id="main-nav" data-nav aria-label="${t.nav}">${link(to(hubPath('wiki',locale)),t.wiki,area==='wiki'?' aria-current="page"':'')}${link(to(hubPath('docs',locale)),t.docs,area==='docs'?' aria-current="page"':'')}${link(to(`docs/${lang}/ai.html`),t.ai)}<a class="language-link" data-language href="${to(alternate)}" lang="${locale==='en'?'pt-BR':'en'}" hreflang="${locale==='en'?'pt-BR':'en'}">${t.language}</a>${link(project,'GitHub ↗',' class="nav-button"')}</nav></div></header>
<div class="kb-shell"><aside class="kb-sidebar">${searchWidget}<details class="kb-topic-menu" open><summary>${t.browse}</summary><nav aria-label="${t.browse}">${link(to(hubPath(area,locale)),t.all,' class="kb-all-topics"')}${navigation(locale,current,area,active)}</nav></details></aside><main id="main-content" class="kb-main"><div class="kb-breadcrumb">${link(to(home),t.home)}<span aria-hidden="true">/</span>${link(to(hubPath(area,locale)),t[area])}${article?`<span aria-hidden="true">/</span><span>${esc(title)}</span>`:''}</div>${body}${contextual}${sourceLinks}<footer class="kb-page-footer"><p>${t.based} <strong>${esc(catalog.version || publicVersion)}</strong> · ${link(`${project}/commit/${sourceRevision}`,sourceRevision.slice(0,7))}</p>${link('#main-content',t.top+' ↑')}</footer></main><aside class="kb-toc"><nav aria-label="${t.contents}"><p>${t.contents}</p><ul>${headings.filter(h=>h.level===2).map(h=>`<li>${link('#'+h.id,h.text)}</li>`).join('')}</ul></nav><div class="kb-reference-version"><span>${t.version}</span><strong>${esc(catalog.version||publicVersion)}</strong><span>${esc(area==='wiki'?t.wiki:t.docs)}</span></div></aside></div><div class="toast" role="status" aria-live="polite" data-toast></div></body></html>`;
  }
  async function emit(path, html, entry) {
    if(paths.has(path)) throw new Error(`Duplicate knowledge route: ${path}`);
    paths.add(path);
    await mkdir(resolve(root,posix.dirname(path)),{recursive:true});
    await writeFile(resolve(root,path),html);
    manifest.push({path,...entry});
  }
  function figures(article, locale, current) {
    const newMedia=wikiMedia.filter(m=>m.articleSlugs?.includes(article.slug));
    const oldMedia=(article.mediaIds||[]).map(id=>productMedia.find(m=>m.id===id)).filter(m=>m?.type==='image');
    const media=newMedia.length?newMedia:oldMedia;
    return media.slice(0,3).map(m=>{
      const file=m.files?.[locale]||m.file;
      const caption=m.caption?.[locale]||`${m.title?.[locale]||copy[locale].screenshot} · ${m.id==='builder'?'0.3.0':'0.2.1'}`;
      return `<figure class="kb-screenshot"><a href="${relative(current,file)}" aria-label="${esc(copy[locale].image+': '+caption)}"><img src="${relative(current,file)}" width="${m.width}" height="${m.height}" alt="${esc(m.alt[locale])}" loading="lazy" decoding="async"></a><figcaption>${esc(caption)} · ${copy[locale].image} ↗</figcaption></figure>`;
    });
  }
  for(const locale of ['en','pt']) {
    const t=copy[locale];
    for(const area of ['wiki','docs']) {
      const current=hubPath(area,locale), entries=family(area), starts=entries.slice(0,3);
      const body=`<header class="kb-intro"><span class="kb-eyebrow">GRAVEWRIGHT / ${t[area]}</span><h1>${t[area+'Title']}</h1><p class="kb-lead">${t[area+'Intro']}</p><div class="kb-stats"><span>${entries.length} ${t.topics}</span><span>${esc(catalog.version||publicVersion)}</span><span>English / Português</span></div></header><section class="kb-start"><p class="kb-eyebrow">${t.workflow}</p><ol>${starts.map((a,i)=>`<li><span>0${i+1}</span>${link(relative(current,articlePath(a,locale)),a[locale].title)}</li>`).join('')}</ol></section><section aria-label="${t.browse}">${cards(entries,locale,current)}</section>`;
      await emit(current,shell({locale,area,current,title:t[area],description:t[area+'Intro'],body}),{locale,area,hub:true});
    }
    const current=`docs/${localePath(locale)}/ai.html`;
    await emit(current,shell({locale,area:'docs',current,title:t.ai,description:t.aiIntro,body:`<header class="kb-intro"><span class="kb-eyebrow">GRAVEWRIGHT / ${t.docs}</span><h1>${t.aiTitle}</h1><p class="kb-lead">${t.aiIntro}</p></header>${cards(family('docs',true),locale,current)}`}),{locale,area:'docs',hub:true});
    for(const article of articles) {
      const data=article[locale];
      if(!data?.title || !data?.summary) throw new Error(`Missing ${locale} article data: ${article.slug}`);
      const markdown=data.body || await readFile(resolve(root,data.file),'utf8');
      const current=articlePath(article,locale);
      // The article title belongs to the shell; source-document navigation stays in the body.
      const clean=publicationCopy(article,locale,markdown).replace(/^# [^\n]+\n/,'');
      const rendered=renderMarkdown(clean,{copyLabel:t.copy,resolveLink:href=>resolveLink(href,article,locale,current)});
      const minutes=Math.max(1,Math.ceil(clean.split(/\s+/).length/220));
      const related=(article.related||[]).map(slug=>articles.find(a=>a.slug===slug && a.area===article.area)).filter(Boolean);
      const siblings=family(article.area), index=siblings.findIndex(a=>a.slug===article.slug);
      const screenshots=figures(article,locale,current);
      const additionalScreenshots=screenshots.length>1?`<details class="kb-more-screenshots"><summary>${locale==='pt'?'Mais capturas deste guia':'More screenshots for this guide'} (${screenshots.length-1})</summary>${screenshots.slice(1).join('')}</details>`:'';
      const pager=`<nav class="kb-pagination" aria-label="${t.related}">${[siblings[index-1],siblings[index+1]].map((a,i)=>a?`<a href="${relative(current,articlePath(a,locale))}"><span>${i?t.next:t.previous} ${i?'→':'←'}</span><strong>${esc(a[locale].title)}</strong></a>`:'<span></span>').join('')}</nav>`;
      const body=`<article><header class="kb-article-header"><span class="kb-eyebrow">${esc(titleForGroup(locale,article.group))} <span aria-hidden="true">/</span> ${minutes} ${t.reading}</span><h1>${esc(data.title)}</h1><p class="kb-lead">${esc(data.summary)}</p></header>${screenshots[0]||''}<div class="kb-prose">${rendered.html}</div>${additionalScreenshots}${related.length?`<section class="kb-related"><h2>${t.related}</h2><ul>${related.map(a=>`<li>${link(relative(current,articlePath(a,locale)),a[locale].title)}</li>`).join('')}</ul></section>`:''}</article>${pager}`;
      await emit(current,shell({locale,area:article.area,current,title:data.title,description:data.summary,active:article.slug,body,headings:rendered.headings,article}),{locale,area:article.area,slug:article.slug,images:(body.match(/<img /g)||[]).length});
      search.push({locale,area:article.area,title:data.title,summary:data.summary,url:current,group:titleForGroup(locale,article.group),text:clean.replace(/[`#*|>\[\]]/g,' ').replace(/\s+/g,' ').trim()});
    }
  }
  await writeFile(resolve(root,'knowledge-search.json'),JSON.stringify(search));
  await writeFile(resolve(root,'content/knowledge-manifest.json'),JSON.stringify({version:catalog.version,sourceRevision,pages:manifest},null,2)+'\n');
  const allPaths=['','pt-br.html',...paths];
  await writeFile(resolve(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPaths.map(path=>`  <url><loc>${origin}/${path}</loc></url>`).join('\n')}\n</urlset>\n`);
  console.log(`Generated ${paths.size} wiki/docs pages and ${search.length} search entries.`);
}
