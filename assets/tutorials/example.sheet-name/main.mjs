export async function mountSheetName({root,context,api,signal,onDispose}) {
  const doc=root.ownerDocument;
  const t=key=>api.i18n.t(key);
  const el=(tag,text)=>{const node=doc.createElement(tag);if(text)node.textContent=text;return node;};
  const form=el('form');form.className='tutorial-sheet-name';
  form.setAttribute('aria-label',t('Sheet name action'));
  const title=el('h3',t('Sheet name action'));
  const label=el('label',t('Sheet name'));
  const input=el('input');input.type='text';input.maxLength=120;input.required=true;label.append(input);
  const saveButton=el('button',t('Save name'));saveButton.type='submit';
  const reloadButton=el('button',t('Reload server value'));reloadButton.type='button';
  const status=el('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  form.append(title,label,saveButton,reloadButton,status);root.append(form);
  onDispose(()=>form.remove());
  let current,dirty=false,pending,loading=false,ready=false,generation=0;
  const token=context.tokenId?{tokenId:context.tokenId}:{};
  function controls(){
    const edit=ready&&!loading&&!pending&&current?.canEdit;
    input.disabled=!edit;saveButton.disabled=!edit||!dirty;
    reloadButton.disabled=loading||!!pending;
  }
  function report(error){if(!signal.aborted)status.textContent=error.code||error.message||'unavailable';}
  function reject(message){const error=new Error(message);report(error);return Promise.reject(error);}
  async function load(){
    const ticket=++generation;loading=true;ready=false;controls();
    try {
      const sheet=await api.actors.sheet(context.actorId,token,{signal});
      if(signal.aborted||ticket!==generation)return;
      if(typeof sheet.name!=='string'||!sheet.data||typeof sheet.data!=='object'||Array.isArray(sheet.data))throw new Error('invalid_data');
      current=sheet;input.value=sheet.name;dirty=false;ready=true;
      status.textContent=t(sheet.canEdit?'Server value loaded.':'Read-only sheet.');
    } finally {if(ticket===generation&&!signal.aborted){loading=false;controls();}}
  }
  function save(){
    if(pending)return pending;
    if(!dirty)return Promise.resolve();
    if(!ready||!current?.canEdit)return reject('permission_denied');
    const name=input.value.trim();
    if(!name||Array.from(name).length>120)return reject(t('Use a name with 1 to 120 characters.'));
    const data=structuredClone(current.data),snapshot=!!current.tokenId;
    if(snapshot){
      if(current.tokenId!==context.tokenId)return reject('stale_context');
      if(data.token!==undefined&&(!data.token||typeof data.token!=='object'||Array.isArray(data.token)))return reject(t('This system uses an incompatible token field.'));
      data.token={...(data.token||{}),name};
    }
    const payload={actorId:context.actorId,...token,name:snapshot?current.name:name,
      version:current.version,sheetVersion:current.sheetVersion,data};
    const requestId=crypto.randomUUID();
    pending=(async()=>{
      try {
        await api.actors.saveSheet(payload,{requestId,signal});
        if(signal.aborted)return;
        await load();
        if(!signal.aborted)status.textContent=t(snapshot?'Saved independent token name.':'Saved actor name.');
      } catch(error){
        if(!signal.aborted){
          if(error.code==='conflict'){
            try {await load();if(!signal.aborted)status.textContent=t('Conflict: server value loaded. Review it and edit again.');}
            catch(refreshError){ready=false;report(refreshError);}
          } else {ready=false;report(error);}
        }
        throw error;
      } finally {pending=undefined;if(!signal.aborted)controls();}
    })();
    controls();return pending;
  }
  input.addEventListener('input',()=>{dirty=true;controls();},{signal});
  form.addEventListener('submit',event=>{event.preventDefault();void save().catch(()=>{});},{signal});
  reloadButton.addEventListener('click',()=>{void load().catch(report);},{signal});
  root.closest('.gw-window')?.addEventListener('gravewright:sheet-flush',event=>{
    if(pending)event.detail.waitUntil(pending);
    else if(dirty)event.detail.waitUntil(Promise.reject(new Error(t('Save the name or reload the server value before closing.'))));
  },{signal});
  controls();await load();
}

export default {
  start({styles,api}){
    styles.use('styles.css');
    const en={};
    const pt={
      'Sheet name action':'Ação no nome da ficha','Sheet name':'Nome da ficha',
      'Save name':'Salvar nome','Reload server value':'Recarregar valor do servidor',
      'Server value loaded.':'Valor do servidor carregado.','Read-only sheet.':'Ficha somente leitura.',
      'Saved actor name.':'Nome do ator salvo.','Saved independent token name.':'Nome do token independente salvo.',
      'Use a name with 1 to 120 characters.':'Use um nome com 1 a 120 caracteres.',
      'This system uses an incompatible token field.':'Este sistema usa um campo token incompatível.',
      'Conflict: server value loaded. Review it and edit again.':'Conflito: valor do servidor carregado. Revise e edite novamente.',
      'Save the name or reload the server value before closing.':'Salve o nome ou recarregue o valor do servidor antes de fechar.'
    };
    for(const key of Object.keys(pt))en[key]=key;
    api.i18n.register({en,'pt-BR':pt});
  },
  register({register}){
    register('actor.sheet',{mode:'augment',mount:mountSheetName});
    register('token.sheet',{mode:'augment',mount:mountSheetName});
  },
  stop(){}
};
