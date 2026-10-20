export default {
  start({styles}) { styles.use('styles.css'); },
  register({register}) {
    const sheet={
      mode:'replace',types:['character','npc'],
      async mount({root,context,api,signal,onDispose}) {
        const doc=root.ownerDocument;
        const form=doc.createElement('form');form.className='example-panel';
        form.setAttribute('aria-label','Example Expedition sheet');
        const title=doc.createElement('h2');
        const label=doc.createElement('label');label.textContent='Stamina (0–100)';
        const input=doc.createElement('input');input.type='number';input.min='0';input.max='100';
        label.append(input);
        const saveButton=doc.createElement('button');saveButton.type='submit';saveButton.textContent='Save';
        const reloadButton=doc.createElement('button');reloadButton.type='button';reloadButton.textContent='Reload server value';
        input.disabled=true;saveButton.disabled=true;reloadButton.disabled=true;
        const status=doc.createElement('p');status.setAttribute('role','status');
        form.append(title,label,saveButton,reloadButton,status);root.append(form);
        let current,dirty=false,pending;
        const token=context.tokenId ? {tokenId:context.tokenId} : {};
        async function load() {
          input.disabled=true;saveButton.disabled=true;reloadButton.disabled=true;
          try {
            const sheet=await api.actors.sheet(context.actorId,token,{signal});
            if(signal.aborted) return;
            current=sheet;title.textContent=sheet.name;
            input.value=String(sheet.data.stamina ?? 10);
            input.disabled=!sheet.canEdit;saveButton.disabled=!sheet.canEdit;
            dirty=false;
          } finally { if(!signal.aborted) reloadButton.disabled=false; }
        }
        function save() {
          if(pending) return pending;
          if(!dirty || !current?.canEdit) return Promise.resolve();
          const stamina=Number(input.value);
          if(input.value.trim()==='' || !Number.isInteger(stamina) || stamina<0 || stamina>100) {
            status.textContent='Enter an integer from 0 to 100.';
            return Promise.reject(new Error('Invalid stamina'));
          }
          const payload={actorId:context.actorId,name:current.name,version:current.version,
            sheetVersion:current.sheetVersion,data:{...current.data,stamina},
            ...(current.tokenId ? {tokenId:current.tokenId} : {})};
          const requestId=crypto.randomUUID();
          input.disabled=true;saveButton.disabled=true;reloadButton.disabled=true;
          pending=(async()=>{
            try {
              await api.actors.saveSheet(payload,{requestId,signal});
              if(signal.aborted) return;
              await load();status.textContent='Saved.';
            } catch(error) {
              if(!signal.aborted) {
                if(error.code==='conflict') {
                  await load();
                  status.textContent='Conflict: server value loaded. Review it before editing again.';
                } else status.textContent=error.code || 'Save failed. Reload before retrying.';
              }
              throw error;
            } finally {
              pending=undefined;
              if(!signal.aborted){input.disabled=!current?.canEdit;saveButton.disabled=!current?.canEdit;reloadButton.disabled=false;}
            }
          })();
          return pending;
        }
        input.addEventListener('input',()=>{dirty=true;},{signal});
        form.addEventListener('submit',event=>{event.preventDefault();void save().catch(()=>{});},{signal});
        reloadButton.addEventListener('click',()=>{
          void load().then(()=>{if(!signal.aborted)status.textContent='Server value loaded.';})
            .catch(error=>{if(!signal.aborted)status.textContent=error.code||'unavailable';});
        },{signal});
        root.closest('.gw-window')?.addEventListener('gravewright:sheet-flush',event=>{
          if(pending || dirty) event.detail.waitUntil(save());
        },{signal});
        onDispose(()=>form.remove());
        await load();
      }
    };
    register('actor.sheet',sheet);
    register('token.sheet',sheet);
  },
  stop() {}
};
