import {load,save} from './settings.mjs';
export default {
  start({styles,i18n}){
    styles.use('styles.css');
    i18n.register({en:{title:'Personal note',refresh:'Refresh'},'pt-BR':{title:'Nota pessoal',refresh:'Atualizar'},es:{title:'Nota personal',refresh:'Actualizar'}});
  },
  register({register}){
    register('table.interface',ctx=>this.mount(ctx,true));
    register('preferences',ctx=>this.mount(ctx,false));
  },
  async mount({root,api,storage,signal,onDispose},floating){
    const doc=root.ownerDocument,panel=doc.createElement('aside');
    panel.className='personal-note'+(floating?' personal-note--floating':'');
    const title=doc.createElement('strong'),text=doc.createElement('p'),refresh=doc.createElement('button');
    title.textContent=api.i18n.t('title');refresh.type='button';refresh.textContent=api.i18n.t('refresh');
    panel.append(title,text,refresh);root.append(panel);
    let generation=0;
    async function read(){
      const ticket=++generation;refresh.disabled=true;
      try {const current=await load(storage);if(!signal.aborted&&ticket===generation)text.textContent=current.value.label;}
      catch(error){if(!signal.aborted&&ticket===generation)text.textContent=error.code||error.message;}
      finally{if(!signal.aborted&&ticket===generation)refresh.disabled=false;}
    }
    refresh.addEventListener('click',()=>void read(),{signal});
    onDispose(()=>{generation++;panel.remove();});await read();
  },
  async customize({api,storage,signal,onDispose}){
    const panel=document.createElement('section');panel.className='personal-note-settings';
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Personal note settings');
    const heading=document.createElement('h2');heading.textContent='Personal note settings';
    const form=document.createElement('form'),label=document.createElement('label');label.textContent='Note text';
    const input=document.createElement('input');input.maxLength=120;label.append(input);
    const submit=document.createElement('button');submit.type='submit';submit.textContent='Save preference';
    const preview=document.createElement('button');preview.type='button';preview.textContent='Preview table for 2 seconds';
    const close=document.createElement('button');close.type='button';close.textContent='Close';
    const status=document.createElement('p');status.setAttribute('role','status');
    form.append(label,submit,preview,close,status);panel.append(heading,form);
    let current,pending,timer;
    function enabled(value){input.disabled=!value;submit.disabled=!value;preview.disabled=!value;close.disabled=!value;}
    enabled(false);
    const modal=api.ui.openModal(panel,{canClose:()=>!pending});
    async function refresh(){current=await load(storage);if(!signal.aborted)input.value=current.value.label;}
    panel.addEventListener('gravewright:sheet-flush',event=>{if(pending)event.detail.waitUntil(pending);},{signal});
    form.addEventListener('submit',event=>{
      event.preventDefault();if(pending||!current)return;enabled(false);
      pending=(async()=>{
        try{await save(storage,current,input.value);await refresh();if(!signal.aborted)status.textContent='Saved. Close and refresh the note panel.';}
        catch(error){
          if(!signal.aborted){
            if(error.code==='conflict'){await refresh();status.textContent='Conflict: current server preference loaded. Review before saving again.';}
            else status.textContent=error.code||error.message;
          }
          throw error;
        }finally{pending=undefined;if(!signal.aborted)enabled(true);}
      })();void pending.catch(()=>{});
    },{signal});
    preview.addEventListener('click',()=>{
      modal.suspend();clearTimeout(timer);
      timer=setTimeout(()=>{if(!signal.aborted)modal.resume();},2000);
    },{signal});
    close.addEventListener('click',()=>void modal.close(),{signal});
    onDispose(()=>{clearTimeout(timer);void modal.close();});
    try{await refresh();if(!signal.aborted)enabled(true);}
    catch(error){if(!signal.aborted){status.textContent=error.code||error.message;close.disabled=false;}}
  },
  stop(){}
};
