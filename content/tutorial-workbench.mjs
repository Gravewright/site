// Shared source for complete, dependency-free tutorial packages.
export const tutorialLicense=`MIT License

Copyright (c) 2026 Gravewright contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
const fence=(language,value)=>'```'+language+'\n'+value.trimEnd().replace(/^[ \t]+$/gm,'')+'\n```';

function mainSource(config){
  return `import {recipes} from './recipes.mjs';
export default {
  start({styles}) { styles.use('styles.css'); },
  register({register}) {
    register(${JSON.stringify(config.surface||'table.interface')}, ({root,api,host,assets,storage,context,events,viewport,signal,onDispose}) => {
      const doc=root.ownerDocument;
      const button=doc.createElement('button');
      button.type='button';button.className='tutorial-launcher';
      button.textContent=${JSON.stringify(config.label||config.en.title)};
      root.append(button);
      for(const type of ['pointerdown','mousedown'])button.addEventListener(type,event=>event.stopPropagation(),{signal});
      let modal,pending=false;
      button.addEventListener('click',event=>{
        event.stopPropagation();
        if(modal?.isConnected) { modal.focus();return; }
        const panel=doc.createElement('section');
        panel.className=${JSON.stringify('tutorial-workbench-'+config.id)};
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
`;
}

// A recipe owns its literal source and its concrete user-facing instructions.
// No eval/Function compilation or arbitrary RPC editor is shipped to the host.
export function makeWorkbenchTutorial(config){
  const manifest={id:'tutorial.'+config.id,name:config.label||config.en.title,version:'1.0.0',sdk:{requires:'>=1.0.0 <2.0.0',tested:'1.0.0'},entry:'main.mjs',description:config.en.summary,author:'Gravewright documentation',license:'MIT'};
  const recipes='export const recipes=[\n'+config.recipes.map(recipe=>'{\n  id:'+JSON.stringify(recipe.id)+',\n  label:'+JSON.stringify(recipe.en.title)+',\n  description:'+JSON.stringify(recipe.en.instruction)+',\n  fields:'+JSON.stringify(recipe.fields||[],null,2)+',\n  run:'+recipe.code.trim().replace(/^[ \t]+$/gm,'')+'\n}').join(',\n')+'\n];\n';
  const scope='.tutorial-workbench-'+config.id;
  const css=`.gw-module-root[data-module-id="${manifest.id}"] .tutorial-launcher { position: fixed; left: 16px; bottom: 112px; z-index: 10; padding: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text); font-size: 14px; pointer-events: auto; max-width: min(440px, calc(100vw - 32px)); white-space: normal; }
${scope} { width: min(640px, calc(100vw - 48px)); padding: var(--space-5); font-size: 14px; }
${scope} label { display: block; margin: var(--space-3) 0; }
${scope} input, ${scope} select { display: block; width: 100%; margin-top: var(--space-2); }
${scope} pre { max-height: 360px; max-width: 100%; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; }
${scope} button { margin-right: var(--space-3); }
`;
  const files={'main.mjs':mainSource(config),'recipes.mjs':recipes,'styles.css':css,'LICENSE.txt':tutorialLicense,...config.files};
  const pkg={id:config.id,slug:config.slug,manifest,files};
  function article(locale){
    const pt=locale==='pt',text=config[locale],base='../../assets/tutorials/'+config.id+'/';
    const intro=pt?`## O projeto que você vai criar\n\n${text.intro}\n\nHost alvo: **Gravewright 0.3.0**. As ações rodam somente quando você clica Run action; leituras e escritas usam a conta conectada. O painel de demonstração está em inglês. Cada receita abaixo informa os dados de entrada e o resultado concreto.\n\n## 1. Crie os arquivos\n\nCrie uma pasta ${config.id}. Salve os arquivos mostrados abaixo em UTF-8, ou [baixe o projeto completo](${base}${config.id}-source.zip). manifest.json fica na raiz. Não há dependências npm nem build de JavaScript.\n\n`:`## The project you will build\n\n${text.intro}\n\nTarget host: **Gravewright 0.3.0**. Actions run only when you click Run action, using the signed-in account. The demonstration panel is English. Each recipe specifies inputs and an observable result.\n\n## 1. Create the files\n\nCreate a folder named ${config.id}. Save the complete files below as UTF-8, or [download the project](${base}${config.id}-source.zip). manifest.json belongs at the root. No npm dependencies or JavaScript build is required.\n\n`;
    const tree=fence('text',config.id+'/\n'+['manifest.json',...Object.keys(files)].map(name=>'  '+name).join('\n'));
    const zipFiles=['manifest.json',...Object.keys(files)].join(' ');
    const installation=pt?`## 2. Empacote, instale e ative\n\nPartindo da pasta do projeto, execute no PowerShell:\n\n${fence('powershell',`python -m json.tool manifest.json\npython -m zipfile -c ../${config.id}-1.0.0.zip ${zipFiles}\npython -m zipfile -l ../${config.id}-1.0.0.zip`)}\n\nNo Linux/macOS, substitua python por python3 no mesmo comando. A listagem precisa mostrar manifest.json na raiz. Como proprietário, abra Inside → Módulos → Instalar módulo → Instalar de ZIP, selecione o ZIP e clique Instalar. Como GM, abra a campanha, use o botão Gravewright da mesa → Extensions e clique Activate na versão 1.0.0 de ${manifest.name}. Feche o menu e clique no botão ${manifest.name}. Se precisar de detalhes de cada tela, veja [seu primeiro módulo](docs:tutorial-first-module).\n\nO projeto fica inativo até a seleção na mesa. Teste uma extensão de demonstração por vez, pois seus botões usam a mesma posição. Para novos bytes, mude version para 1.0.1, gere outro ZIP, instale e ative essa versão; não edite o pacote instalado.\n\n`:`## 2. Package, install and activate\n\nFrom the project folder, run in PowerShell:\n\n${fence('powershell',`python -m json.tool manifest.json\npython -m zipfile -c ../${config.id}-1.0.0.zip ${zipFiles}\npython -m zipfile -l ../${config.id}-1.0.0.zip`)}\n\nOn Linux/macOS, replace python with python3 in the same commands. The archive listing must show manifest.json at its root. As installation owner, open Inside → Modules → Install module → Install from ZIP, select the ZIP and click Install. As GM, open the campaign, select its Gravewright button → Extensions and Activate version 1.0.0 of ${manifest.name}. Close that menu and click ${manifest.name}. See [your first module](docs:tutorial-first-module) for screen-by-screen instructions.\n\nThe package stays inactive until selected for the table. Test one demonstration extension at a time because their launchers share a position. For changed bytes, increment version to 1.0.1, build another ZIP, install and activate that version; do not edit installed files.\n\n`;
    const recipeSections=config.recipes.map(recipe=>{const r=recipe[locale];return '### '+r.title+'\n\n'+r.instruction+'\n\n'+fence('javascript',recipe.code)+'\n\n'+(pt?'**Resultado esperado:** ':'**Expected result:** ')+r.expected+'\n\n'+(pt?'**Como conferir:** ':'**How to verify:** ')+r.verify;}).join('\n\n');
    const sourceFiles='### manifest.json\n\n'+fence('json',JSON.stringify(manifest,null,2))+'\n\n'+Object.entries(files).map(([name,value])=>'### '+name+'\n\n'+fence(name.endsWith('.css')?'css':name.endsWith('.mjs')?'javascript':name.endsWith('.json')?'json':'text',value)).join('\n\n');
    const lifecycle=pt?'main.mjs desenha apenas o lançador e o formulário. recipes.mjs contém as ações: para adaptar o comportamento, altere a função run da receita desejada, mantendo sua assinatura. O formulário passa tipos reais (number, boolean e File), bloqueia requisições simultâneas e desenha resultados com textContent. Não há avaliação de código fornecido pelo usuário. api, host, assets e storage pertencem à montagem; signal cancela trabalho ao desativar. O modal não fecha durante uma operação pendente e é liberado ao abortar a montagem. A função de negócio continua responsável por revisões, permissões e sequência transacional.':'main.mjs renders the launcher and form. recipes.mjs owns behavior: change the chosen recipe’s run function while keeping its signature. The form passes real number, boolean and File values, blocks overlapping requests and renders using textContent. It does not evaluate user-provided code. api, host, assets and storage belong to the mount; signal cancels work on deactivation. The modal stays open during pending work and is released when the mount aborts. Each business function remains responsible for revisions, permissions and transaction sequencing.';
    return {title:text.title,summary:text.summary,body:intro+tree+'\n\n'+(text.prerequisites||'')+'\n\n'+installation+'## 3. '+(pt?'Execute cada receita':'Run each recipe')+'\n\n'+recipeSections+'\n\n## 4. '+(pt?'Entenda e adapte os arquivos completos':'Understand and adapt the complete files')+'\n\n'+lifecycle+'\n\n'+sourceFiles+'\n\n## 5. '+(pt?'Permissões, falhas e teste final':'Permissions, failures and final test')+'\n\n'+text.validation+'\n\n## '+(pt?'Como usar a IA para estender este projeto':'How to use AI to extend this project')+'\n\n'+fence('text',text.prompt)+'\n\n['+(pt?'Todos os tutoriais':'All tutorials')+'](docs:tutorial-index) · [API](docs:api)\n'};
  }
  return {package:pkg,article:{slug:config.slug,group:'tutorials',sourcePaths:config.sourcePaths,en:article('en'),pt:article('pt')}};
}
