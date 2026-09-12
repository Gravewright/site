// Keep social previews and structured data aligned with the visible product copy.
export const origin = 'https://gravewright.com';
export const pageUrl = locale => `${origin}/${locale === 'en' ? '' : 'pt-br.html'}`;
export function seoHead(locale, t, media, project, download) {
  const url = pageUrl(locale);
  const image = `${origin}/${media.find(item => item.id === 'session').poster}`;
  const alt = locale === 'en'
    ? 'Gravewright — The Dragon’s Legacy: a red dragon above a fortress surrounded by lava.'
    : 'Gravewright — The Dragon’s Legacy: um dragão vermelho sobre uma fortaleza cercada por lava.';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const meta = (key, value, property = false) => `<meta ${property ? 'property' : 'name'}="${key}" content="${escape(value)}">`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {'@type':'WebSite', '@id':`${origin}/#website`, url:`${origin}/`, name:'Gravewright', inLanguage:['en','pt-BR']},
      {'@type':'WebPage', '@id':`${url}#webpage`, url, name:t.title, description:t.description, inLanguage:t.lang,
        isPartOf:{'@id':`${origin}/#website`}, mainEntity:{'@id':`${origin}/#software`},
        primaryImageOfPage:{'@type':'ImageObject', url:image, width:1672, height:941, caption:alt}},
      {'@type':'SoftwareApplication', '@id':`${origin}/#software`, name:'Gravewright', url:`${origin}/`,
        description:t.description, applicationCategory:'GameApplication', operatingSystem:'Windows, Linux, macOS',
        softwareVersion:'0.1.0-alpha.0', inLanguage:'en', isAccessibleForFree:true,
        license:'https://spdx.org/licenses/GPL-3.0-only.html', downloadUrl:download, sameAs:project,
        image, screenshot:`${origin}/${media.find(item => item.id === 'table').file}`}
    ]
  };
  return [
    `<link rel="canonical" href="${url}">`,
    ...[['en',pageUrl('en')],['pt-BR',pageUrl('pt')],['x-default',pageUrl('en')]].map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${href}">`),
    meta('robots','index, follow, max-image-preview:large'),
    ...Object.entries({type:'website',site_name:'Gravewright',url,title:t.title,description:t.description,
      locale:locale === 'en' ? 'en_US' : 'pt_BR','locale:alternate':locale === 'en' ? 'pt_BR' : 'en_US',
      image,'image:secure_url':image,'image:type':'image/png','image:width':1672,'image:height':941,'image:alt':alt})
      .map(([key,value]) => meta(`og:${key}`,value,true)),
    ...Object.entries({card:'summary_large_image',title:t.title,description:t.description,image,'image:alt':alt})
      .map(([key,value]) => meta(`twitter:${key}`,value)),
    `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g,'\\u003c')}</script>`
  ].join('\n  ');
}
