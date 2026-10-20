export default {
  start({styles}) { styles.use('styles.css'); },
  register({register}) {
    register('table.interface', ({root, api, signal, onDispose}) => {
      const doc=root.ownerDocument;
      const panel=doc.createElement('section');
      panel.className='example-panel';
      const button=doc.createElement('button');
      button.type='button';
      button.textContent='Campaign summary';
      const status=doc.createElement('p');
      status.setAttribute('role','status');
      panel.append(button,status);
      root.append(panel);
      let modal;
      button.addEventListener('click', async () => {
        button.disabled=true;
        try {
          const actors=await api.actors.list({}, {signal});
          if(signal.aborted) return;
          if(modal) await modal.close();
          if(signal.aborted) return;
          const content=doc.createElement('section');
          content.setAttribute('role','dialog');
          content.setAttribute('aria-modal','true');
          content.setAttribute('aria-label','Campaign summary');
          const text=doc.createElement('p');
          text.textContent='Readable actors: '+actors.filter(actor=>actor.canOpen).length;
          const close=doc.createElement('button');
          close.type='button';close.textContent='Close';
          content.append(text,close);
          modal=api.ui.openModal(content);
          close.addEventListener('click',()=>void modal.close(),{signal});
          status.textContent='Summary loaded.';
        } catch(error) {
          if(!signal.aborted) status.textContent=error.code || 'unavailable';
        } finally { if(!signal.aborted) button.disabled=false; }
      },{signal});
      onDispose(()=>{panel.remove();});
    });
  },
  stop() {}
};
