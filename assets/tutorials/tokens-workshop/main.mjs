import {recipes} from './recipes.mjs';
export default {
  start({styles}) { styles.use('styles.css'); },
  register({register}) {
    register("table.interface", ({root,api,host,assets,storage,context,events,viewport,signal,onDispose}) => {
      const doc=root.ownerDocument;
      const button=doc.createElement('button');
      button.type='button';button.className='tutorial-launcher';
      button.textContent="Token workshop";
      root.append(button);
      for(const type of ['pointerdown','mousedown'])button.addEventListener(type,event=>event.stopPropagation(),{signal});
      let modal,pending=false;
      button.addEventListener('click',event=>{
        event.stopPropagation();
        if(modal?.isConnected) { modal.focus();return; }
        const panel=doc.createElement('section');
        panel.className="tutorial-workbench-tokens-workshop";
        panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
        panel.setAttribute('aria-label',button.textContent);panel.tabIndex=-1;
        const title=doc.createElement('h2');title.textContent=button.textContent;panel.append(title);
        const choose=doc.createElement('select');choose.setAttribute('aria-label','Action');
        for(const recipe of recipes) {
          const option=doc.createElement('option');option.value=recipe.id;option.textContent=recipe.label;choose.append(option);
        }
        const form=doc.createElement('form'),fields=doc.createElement('div');
        const description=doc.createElement('p');
        const run=doc.createElement('button');run.type='submit';run.textContent='Run action';
        const close=doc.createElement('button');close.type='button';close.textContent='Close';
        const output=doc.createElement('pre');output.setAttribute('role','status');output.setAttribute('aria-live','polite');
        form.append(description,fields,run,close,output);panel.append(choose,form);
        function renderFields(){
          const recipe=recipes.find(item=>item.id===choose.value);fields.replaceChildren();
          description.textContent=recipe.description;
          for(const field of recipe.fields||[]) {
            const label=doc.createElement('label');label.textContent=field.label;
            const input=doc.createElement('input');input.name=field.name;input.type=field.type||'text';
            if(field.type==='number')input.step=String(field.step??'any');
            if(field.type==='checkbox')input.checked=!!field.value;
            else if(field.type!=='file')input.value=String(field.value??'');
            input.required=!!field.required;
            if(field.accept)input.accept=field.accept;
            label.append(input);fields.append(label);
          }
          output.textContent='';
        }
        choose.addEventListener('change',renderFields,{signal});renderFields();
        form.addEventListener('submit',async event=>{
          event.preventDefault();if(pending)return;
          const recipe=recipes.find(item=>item.id===choose.value),values={};
          for(const input of fields.querySelectorAll('input')) {
            values[input.name]=input.type==='file'?input.files[0]:input.type==='checkbox'?input.checked:input.type==='number'?Number(input.value):input.value;
          }
          pending=true;choose.disabled=true;run.disabled=true;close.disabled=true;
          for(const input of fields.querySelectorAll('input'))input.disabled=true;
          output.textContent='Running…';
          try {
            const value=await recipe.run({api,host,assets,storage,context,events,viewport,signal,onDispose},values);
            if(!signal.aborted)output.textContent=typeof value==='string'?value:JSON.stringify(value??null,null,2);
          } catch(error) {
            if(!signal.aborted)output.textContent=String(error.code||error.message||'unavailable');
          } finally {
            pending=false;
            if(!signal.aborted){choose.disabled=false;run.disabled=false;close.disabled=false;for(const input of fields.querySelectorAll('input'))input.disabled=false;}
          }
        },{signal});
        close.addEventListener('click',()=>void modal.close(),{signal});
        modal=api.ui.openModal(panel,{canClose:()=>!pending||signal.aborted});
      },{signal});
      onDispose(()=>{button.remove();if(modal)void modal.close();});
    });
  },
  stop() {}
};
