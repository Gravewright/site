// Complete original source packages. The build creates unsigned ZIPs for review/signing.
const sdk={requires:'>=1.0.0 <2.0.0',tested:'1.0.0'};
const manifest=(id,name,description,extra)=>({id,name,version:'1.0.0',sdk,description,author:'Gravewright documentation examples',license:'GPL-3.0-only',...extra});
const styles='.gw-module-root .example-panel { padding: var(--space-4, 16px); font-size: 14px; }\n.gw-module-root .example-panel label { display: block; margin-bottom: var(--space-3, 12px); }\n.gw-module-root .example-panel button { margin-right: var(--space-2, 8px); }\n.gw-module-root[data-module-id="example.campaign-summary"] .example-panel { position: fixed; left: 16px; bottom: 112px; z-index: 20; max-width: min(360px, calc(100vw - 32px)); border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text); pointer-events: auto; }\n';
const browserMain=String.raw`export default {
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
`;
const systemMain=String.raw`export default {
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
`;
const localeMain='export default { start() {}, register() {}, stop() {} };\n';
const djangoFiles={
  'example_status/__init__.py':'',
  'example_status/apps.py':`from django.apps import AppConfig\n\n\nclass ExampleStatusConfig(AppConfig):\n    name = "example_status"\n    label = "example_status"\n    gravewright_urlconf = "example_status.urls"\n`,
  'example_status/urls.py':`from django.urls import path\nfrom .views import status\n\nurlpatterns = [path("examples/status/", status, name="example_status")]\n`,
  'example_status/views.py':`from django.contrib.auth.decorators import login_required\nfrom django.http import JsonResponse\nfrom django.views.decorators.http import require_GET\nfrom api import API_VERSION\n\n\n@login_required\n@require_GET\ndef status(request):\n    if request.user.role != "owner":\n        return JsonResponse({"error": "permission_denied"}, status=403)\n    return JsonResponse({"ok": True, "apiVersion": API_VERSION})\n`,
};
const packages=[
  {id:'browser',slug:'example-package-browser',
    manifest:manifest('example.campaign-summary','Example campaign summary','Adds an authorized read-only summary in a native modal.',{entry:'main.mjs'}),
    files:{'main.mjs':browserMain,'styles.css':styles},
    en:{title:'Browser module: a campaign summary',summary:'A complete package with a table action, authorized API read and native modal.',goal:'Add a Campaign summary button to table.interface. Clicking it reads only the actors visible to the signed-in user and opens the result in the existing modal component.',
      run:['Review the source ZIP and install it through Modules → Install from ZIP on a disposable host, then enable its exact installed version for a campaign.','Open the table and click Campaign summary. A native modal displays the readable actor count. Close it with the button or Escape.','Repeat as a player with access to fewer actors. Reopen/close and deactivate the module while a read is pending.'],
      expected:'The GM and player can receive different counts. There is no write operation. The host owns modal cleanup, focus and background state; mount disposal removes the panel and aborts its listeners.',
      errors:'permission_denied indicates the caller lacks access; stale_context indicates an ended mount/activation. A network failure is shown in the status paragraph. The button stays disabled while loading to prevent duplicate requests.',
      verify:['Check the real count against the caller’s actor directory.','Verify Escape restores focus and native UI remains available.','Leave the table or deactivate the module during loading; no modal may open afterward.'],
      prompt:'Adapt the campaign-summary example to show [authorized read-only metric]. Keep table.interface, the supplied scoped API, native modal and abort/disposal behavior. Verify the target release signatures and test GM/player results.'},
    pt:{title:'Módulo de navegador: resumo da campanha',summary:'Pacote completo com ação na mesa, leitura autorizada da API e modal nativo.',goal:'Adicione o botão Campaign summary em table.interface. Ao clicar, ele lê somente os atores visíveis ao usuário conectado e mostra o resultado no modal existente.',
      run:['Revise o ZIP-fonte e use Módulos → Instalar de ZIP em um host descartável; depois habilite a versão exata na campanha.','Abra a mesa e clique em Campaign summary. Um modal nativo mostra a contagem de atores legíveis. Feche pelo botão ou Escape.','Repita como jogador com acesso a menos atores. Abra/feche novamente e desative o módulo durante uma leitura pendente.'],
      expected:'GM e jogador podem receber contagens diferentes. O exemplo não grava dados. O host libera o modal e gerencia foco/fundo; o descarte da montagem remove o painel e cancela seus listeners.',
      errors:'permission_denied indica falta de acesso; stale_context indica montagem/ativação encerrada. Falhas de rede aparecem no parágrafo de status. O botão fica desabilitado durante a leitura para impedir requisições duplicadas.',
      verify:['Compare a contagem com o diretório de atores daquele usuário.','Confira que Escape devolve o foco e os controles nativos continuam disponíveis.','Saia da mesa ou desative durante o carregamento; nenhum modal deve abrir depois.'],
      prompt:'Adapte o exemplo campaign-summary para mostrar [métrica autorizada somente leitura]. Preserve table.interface, a API do contexto, o modal nativo e o cancelamento/descarte. Confira assinaturas na release alvo e teste resultados de GM/jogador.'}},
  {id:'system',slug:'example-package-system',
    manifest:manifest('example.expedition','Example Expedition','Original character/NPC sheets with a saved stamina field and an empty gear type.',{entry:'main.mjs',system:{actorTypes:[{id:'character',label:'Character'},{id:'npc',label:'NPC'}],itemTypes:[{id:'gear',label:'Gear'}]}}),
    files:{'main.mjs':systemMain,'styles.css':styles},
    en:{title:'System package: an editable character sheet',summary:'A single original system package with actor types, a complete minimal sheet and revision-aware saving.',goal:'Create a campaign using Example Expedition. The package declares character and npc actors, an empty gear item type, and replaces the actor sheet with an editable stamina field. It provides no published game rules or catalogs.',
      run:['Review and install the source ZIP through Systems → Install from ZIP on a disposable host; select Example Expedition for a new campaign.','Create a Character or NPC, open its sheet, change Stamina and press Save. Close and reopen the window.','Assign a player read access and then edit access to the actor. Compare disabled/enabled controls and the server response.','Open the same actor in two sessions. Save one, then save the stale one. Review the refreshed server value before editing again.'],
      expected:'The saved value survives reopening. The payload keeps version and sheetVersion from the same read. Linked tokens use the actor; independent tokens use the returned tokenId snapshot. Pending saves participate in gravewright:sheet-flush.',
      errors:'A conflict reloads the authoritative sheet and asks the user to review it. Validation rejects blank/noninteger/out-of-range stamina in the sample UI; external system JSON remains subject to host JSON limits and permissions. Add authoritative rule validation only through contracts actually supported by the target host.',
      verify:['Create/edit/save/reopen both actor types.','Verify read-only access cannot write, including a direct attempted call.','Test linked and independent tokens separately.','Close during a slow save and during an invalid edit; failed flush must keep the window open.'],
      prompt:'Extend Example Expedition with [original fields]. Keep one installable system package, the declared actor/item types and sheet-flush/version behavior. Preserve unrelated data fields. Do not add a Server Rules companion or require a newer host. State unsupported backend requirements explicitly.'},
    pt:{title:'Pacote de sistema: ficha de personagem editável',summary:'Um sistema original em pacote único, com tipos de ator, ficha mínima completa e salvamento por revisão.',goal:'Crie uma campanha com Example Expedition. O pacote declara atores character e npc, um tipo vazio de item gear e substitui a ficha por um campo de vigor editável. Não inclui regras publicadas nem catálogos.',
      run:['Revise e instale o ZIP-fonte por Sistemas → Instalar de ZIP em um host descartável; selecione Example Expedition em uma campanha nova.','Crie Character ou NPC, abra a ficha, altere Stamina e clique em Save. Feche e reabra.','Conceda ao jogador primeiro leitura e depois edição do ator. Compare controles e resposta do servidor.','Abra o mesmo ator em duas sessões. Salve em uma e depois na desatualizada. Revise o valor recarregado antes de editar novamente.'],
      expected:'O valor salvo permanece ao reabrir. O payload usa version e sheetVersion da mesma leitura. Tokens vinculados usam o ator; independentes usam o tokenId retornado. Salvamentos pendentes participam de gravewright:sheet-flush.',
      errors:'Um conflito recarrega a ficha autoritativa e pede revisão. A interface de exemplo recusa vigor vazio, não inteiro ou fora dos limites; o JSON de sistemas externos continua sujeito a limites e permissões do host. Validação autoritativa de regras deve usar apenas contratos realmente disponíveis na release alvo.',
      verify:['Crie/edite/salve/reabra os dois tipos de ator.','Confira que acesso de leitura não grava, inclusive por chamada direta.','Teste tokens vinculados e independentes separadamente.','Feche durante salvamento lento e edição inválida; falha no flush deve manter a janela aberta.'],
      prompt:'Amplie Example Expedition com [campos originais]. Preserve pacote único, tipos declarados e comportamento de revisão/sheet-flush. Preserve campos não relacionados dos dados. Não crie Server Rules separado nem exija host mais novo. Declare explicitamente requisitos de backend sem suporte.'}},
  {id:'language',slug:'example-package-language',
    manifest:manifest('example.language-demo','Example language demo','Partial original interface catalogs for Portuguese and Spanish.',{entry:'main.mjs',locales:{'pt-BR':{name:'Português (Brasil)',path:'locales/pt-BR.json'},es:{name:'Español',path:'locales/es.json'}}}),
    files:{'main.mjs':localeMain,'locales/pt-BR.json':JSON.stringify({Actors:'Personagens',Items:'Itens',Settings:'Configurações',Close:'Fechar',Save:'Salvar',Search:'Buscar'},null,2)+'\n','locales/es.json':JSON.stringify({Actors:'Personajes',Items:'Objetos',Settings:'Ajustes',Close:'Cerrar',Save:'Guardar',Search:'Buscar'},null,2)+'\n'},
    en:{title:'Language package: Portuguese and Spanish catalogs',summary:'A minimal installation-wide language package with valid catalogs, activation and English fallback.',goal:'Ship a deliberately partial catalog for six original interface strings in pt-BR and es. This demonstrates package structure and fallback; it is not a complete translation or a replacement release of the official Translator.',
      run:['Use an isolated host with no other globally enabled language package providing these locales. As owner, review/install the source ZIP through Modules → Install from ZIP, then enable it for the installation.','Choose Portuguese or Spanish in account Settings and reload the page. Native strings present in the catalogs can translate; absent strings stay English.','Disable the example and reload. Confirm English fallback and that campaign-authored names did not change.'],
      expected:'locales is package metadata, not a kind field. The no-op browser entry satisfies the browser package contract but does not mount a campaign module. Do not combine system and locales or include en as an override.',
      errors:'Invalid locale/catalog JSON, altered interpolation placeholders or a system/locales combination are rejected at installation. Global activation is owner-only. Installed language catalogs are omitted from campaign module selection.',
      verify:['Validate both nonempty catalogs with the native catalog validator.','Switch accounts and ensure each retains its explicit locale choice.','Check untranslated strings fall back to English and authored text remains unchanged.'],
      prompt:'Expand the language-demo catalogs with [interface strings] from the current host. Preserve placeholders and English fallback, use pt-BR/es matching keys, and leave authored content and exact legal notices unchanged. Validate with the native catalog parser and real account language switching.'},
    pt:{title:'Pacote de idioma: catálogos em português e espanhol',summary:'Pacote mínimo de idioma para a instalação, com catálogos válidos, ativação e alternativa em inglês.',goal:'Distribua um catálogo propositalmente parcial de seis textos de interface em pt-BR e es. Ele demonstra estrutura e alternativa de idioma; não é tradução completa nem nova release do Translator oficial.',
      run:['Use um host isolado sem outro pacote global ativo fornecendo esses idiomas. Como proprietário, revise/instale o ZIP-fonte por Módulos → Instalar de ZIP e ative-o na instalação.','Escolha português ou espanhol nas Configurações da conta e recarregue. Textos nativos presentes no catálogo podem ser traduzidos; os ausentes ficam em inglês.','Desative o exemplo e recarregue. Confira retorno ao inglês e preservação dos nomes escritos na campanha.'],
      expected:'locales é metadado do pacote, não um campo kind. A entrada JavaScript sem ações atende ao contrato de pacote de navegador, sem montar um módulo na campanha. Não combine system e locales nem declare en como substituição.',
      errors:'JSON inválido de idioma/catálogo, variáveis de interpolação alteradas ou combinação system/locales são rejeitados na instalação. Ativação global exige proprietário. Idiomas instalados ficam fora da seleção de módulos da campanha.',
      verify:['Valide os dois catálogos não vazios com o validador nativo.','Troque de conta e confira que cada uma conserva a própria escolha explícita.','Confira alternativa em inglês para chaves ausentes e preservação de texto autoral.'],
      prompt:'Amplie os catálogos language-demo com [textos da interface] do host atual. Preserve variáveis e alternativa em inglês, use chaves alinhadas em pt-BR/es e mantenha conteúdo autoral e avisos legais exatos. Valide com o parser nativo e troca real de idioma por conta.'}},
  {id:'django',slug:'example-package-django',
    manifest:manifest('example.server-status','Example server status','Trusted owner-only read endpoint with no models or background tasks.',{django:{apps:['example_status.apps.ExampleStatusConfig']}}),files:djangoFiles,
    en:{title:'Django package: an owner-only server endpoint',summary:'A trusted server app with a valid manifest, AppConfig, URL and permission-checked read view.',goal:'Expose GET /examples/status/ for the authenticated installation owner. It returns the public Python API version and no campaign content. This is an independent generic server integration, not a companion for an RPG system.',
      run:['Review all Python sources. In an isolated host, install the source ZIP through Modules → Install from ZIP. For Marketplace publication, the signed catalog record must carry type: django.','Installation validates/extracts only. Activate the trusted app explicitly using the managed Runner or main.py and the documented uv-backed supervisor.','After restart, open /examples/status/ as owner, participant and an anonymous browser. Deactivate and restart to remove the route.'],
      expected:'Owner GET returns 200 with ok and apiVersion. An authenticated participant receives 403. An anonymous request follows the normal login redirect. An authenticated non-GET receives 405. No models, migrations or background tasks are added.',
      errors:'Missing AppConfig package, duplicate app labels or invalid manifest/pins fail installation/activation. Django manifests cannot include entry, system or locales. Python execution requires owner activation; do not paste server code into a browser manifest.',
      verify:['Use Django RequestFactory or an isolated Client to check owner/participant/anonymous/method behavior.','Confirm the route appears only after activation and no database content changes during reads.','Review supervisor checks/recovery; deactivation does not generally undo app migrations, although this example defines none.'],
      prompt:'Adapt example_status into a read-only owner administration endpoint for [generic task]. Keep authentication, require_GET, explicit owner authorization, a distinct AppConfig label and no startup side effects. If campaign data is needed, call the supported Python API with a real authorized Context. Do not bypass permissions with ORM writes.'},
    pt:{title:'Pacote Django: endpoint exclusivo do proprietário',summary:'App confiável de servidor com manifesto, AppConfig, URL e leitura com verificação de permissão.',goal:'Disponibilize GET /examples/status/ ao proprietário autenticado da instalação. A resposta contém a versão pública da API Python e nenhum dado de campanha. É uma integração genérica independente, sem função de complemento de sistema de RPG.',
      run:['Revise todos os fontes Python. No host isolado, use Módulos → Instalar de ZIP com o ZIP-fonte. Para publicar no Marketplace, o registro assinado do catálogo precisa de type: django.','A instalação apenas valida/extrai. Ative o app confiável explicitamente pelo Runner gerenciado ou main.py, com o supervisor e uv documentados.','Após reiniciar, abra /examples/status/ como proprietário, participante e usuário anônimo. Desative e reinicie para remover a rota.'],
      expected:'GET do proprietário retorna 200 com ok e apiVersion. Participante autenticado recebe 403. Usuário anônimo segue o redirecionamento normal de login. Outro método autenticado recebe 405. O exemplo não cria modelos, migrações nem tarefas em segundo plano.',
      errors:'AppConfig ausente, labels duplicados ou manifesto/pins inválidos impedem instalação/ativação. Manifestos Django não podem conter entry, system ou locales. Execução Python exige ativação pelo proprietário; não coloque código de servidor em manifesto de navegador.',
      verify:['Use RequestFactory ou Client isolado para conferir proprietário/participante/anônimo/método.','Confirme que a rota aparece só após ativação e leituras não alteram dados.','Revise checks/recuperação do supervisor; desativação normalmente não desfaz migrações, embora este exemplo não possua nenhuma.'],
      prompt:'Adapte example_status para um endpoint administrativo somente leitura do proprietário para [tarefa genérica]. Preserve autenticação, require_GET, autorização explícita, label AppConfig exclusivo e ausência de efeitos na inicialização. Para dados de campanha, use a API Python pública com Context autorizado real. Não contorne permissões com gravações ORM.'}}
];
const list=items=>items.map(item=>'- '+item).join('\n');
const sourcePaths=['docs/en/modules.md','docs/pt-BR/modules.md','gravewright/modules/contracts/schemas/manifest.json','gravewright/modules/packages.py'];
function article(p,locale){
  const t=p[locale],pt=locale==='pt',base='../../assets/examples/packages/'+p.id+'/';
  const headings=pt?['Objetivo e pré-requisitos','Arquivos completos','Manifesto completo','Código do exemplo','Como executar','Resultado esperado e ciclo de vida','Erros e limites','Como validar','Como usar a IA neste exemplo']:['Goal and prerequisites','Complete files','Complete manifest','Example code','How to run','Expected result and lifecycle','Errors and limits','How to validate','How to use AI with this example'];
  const fileList=['manifest.json',...Object.keys(p.files),'LICENSE.txt','README.md'];
  const blocks=Object.entries(p.files).map(([file,code])=>'### '+file+'\n\n```'+(file.endsWith('.py')?'python':file.endsWith('.json')?'json':file.endsWith('.css')?'css':'javascript')+'\n'+code+'```').join('\n\n');
  const note=pt?'Estes são fontes completos, sem assinatura. Depois de revisar o código, teste por **Instalar de ZIP** em um host descartável. Para publicar pelo Marketplace, prepare a assinatura e o catálogo da [referência de assinatura e ativação](docs:modules#catalogo-assinado-e-ativacao). Nenhuma chave privada acompanha o download.':'These are complete unsigned sources. After reviewing the code, test with **Install from ZIP** on a disposable host. Marketplace publication uses the signature/catalog described in [signing and activation](docs:modules#signed-catalog-and-activation). No private signing key is included.';
  return {title:t.title,summary:t.summary,body:'## '+headings[0]+'\n\n'+t.goal+'\n\n'+(pt?'Host alvo: **0.3.0**, SDK **1.0.0**. Textos da interface do exemplo estão em inglês. Preserve a versão solicitada ao adaptar.':'Target host: **0.3.0**, SDK **1.0.0**. Sample interface strings are English. Preserve the requested version when adapting.')+'\n\n## '+headings[1]+'\n\n['+(pt?'Baixar pacote-fonte ZIP':'Download source package ZIP')+']('+base+p.id+'-source.zip)\n\n'+note+'\n\n'+fileList.map(file=>'- ['+file+']('+base+file+')').join('\n')+'\n\n## '+headings[2]+'\n\n```json\n'+JSON.stringify(p.manifest,null,2)+'\n```\n\n## '+headings[3]+'\n\n'+blocks+'\n\n## '+headings[4]+'\n\n'+t.run.map((item,i)=>(i+1)+'. '+item).join('\n')+'\n\n## '+headings[5]+'\n\n'+t.expected+'\n\n## '+headings[6]+'\n\n'+t.errors+'\n\n## '+headings[7]+'\n\n'+list(t.verify)+'\n\n## '+headings[8]+'\n\n```text\n'+t.prompt+'\n```\n'};
}
export const packageExamples=packages;
export const packageExampleArticles=packages.map(p=>({slug:p.slug,group:'examples',sourcePaths:[...sourcePaths,...(p.id==='system'?['gravewright/actors/services.py']:p.id==='django'?['api/__init__.py']:p.id==='language'?['gravewright/modules/localization.py']:[])],en:article(p,'en'),pt:article(p,'pt'),related:['examples-index','modules','api']}));
