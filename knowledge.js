// Local search only: no account, remote API, or external search service.
(() => {
  const topics=document.querySelector('.kb-topic-menu');
  if(topics && matchMedia('(max-width: 680px)').matches) topics.open=false;
  const widget=document.querySelector('[data-search]');
  if(!widget) return;
  const input=widget.querySelector('input'), clear=widget.querySelector('[data-search-clear]');
  const results=widget.querySelector('ol'), status=widget.querySelector('[role="status"]');
  const normalize=text=>text.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
  let indexPromise, request=0, timer;
  const load=()=> indexPromise ||= fetch(widget.dataset.index).then(response=>{
    if(!response.ok) throw new Error(`Search index: ${response.status}`);
    return response.json();
  }).then(entries=>entries.filter(e=>e.locale===widget.dataset.locale).map(e=>({...e,normalized:normalize(e.title+' '+e.summary+' '+e.text)}))).catch(error=>{indexPromise=undefined;throw error;});
  async function search() {
    const generation=++request, query=normalize(input.value.trim());
    clear.hidden=!query;
    results.replaceChildren();
    results.hidden=!query;
    if(!query){status.textContent='';return;}
    status.textContent=widget.dataset.loadingLabel;
    try {
      const entries=await load();
      if(generation!==request) return;
      const terms=query.split(/\s+/);
      const matches=entries.filter(e=>terms.every(term=>e.normalized.includes(term))).sort((a,b)=>{
        const rank=e=>terms.reduce((n,term)=>n+(normalize(e.title).includes(term)?4:0)+(normalize(e.summary).includes(term)?1:0),0);
        return rank(b)-rank(a);
      });
      status.textContent=matches.length?`${matches.length} ${widget.dataset.resultsLabel}`:widget.dataset.emptyLabel;
      const base=new URL(widget.dataset.index,location.href);
      for(const entry of matches.slice(0,20)) {
        const li=document.createElement('li'), a=document.createElement('a'), label=document.createElement('small');
        a.href=new URL(entry.url,base).href;
        a.textContent=entry.title;
        label.textContent=entry.group;
        li.append(a,label);
        results.append(li);
      }
    } catch { if(generation===request) status.textContent=widget.dataset.errorLabel; }
  }
  input.addEventListener('input',()=>{clearTimeout(timer);++request;timer=setTimeout(search,130);});
  clear.addEventListener('click',()=>{clearTimeout(timer);input.value='';search();input.focus();});
  input.addEventListener('keydown',event=>{if(event.key==='Escape'){input.value='';search();}if(event.key==='ArrowDown'){event.preventDefault();results.querySelector('a')?.focus();}});
  results.addEventListener('keydown',event=>{
    if(event.key==='Escape'){input.focus();return;}
    if(!['ArrowDown','ArrowUp'].includes(event.key))return;
    const links=[...results.querySelectorAll('a')], at=links.indexOf(document.activeElement);
    event.preventDefault();
    (links[at+(event.key==='ArrowDown'?1:-1)]||input).focus();
  });
})();
