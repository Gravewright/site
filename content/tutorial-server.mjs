import {tutorialLicense} from './tutorial-workbench.mjs';
const manifest={id:'example.server-workshop',name:'Server integration workshop',version:'1.0.0',sdk:{requires:'>=1.0.0 <2.0.0',tested:'1.0.0'},description:'Authenticated campaign reads, native actor commands and bounded process-local event counters.',author:'Gravewright documentation',license:'MIT',django:{apps:['example_workshop.apps.ExampleWorkshopConfig']}};
const files={
  'example_workshop/__init__.py':'',
  'example_workshop/apps.py':`from django.apps import AppConfig


class ExampleWorkshopConfig(AppConfig):
    name = "example_workshop"
    label = "example_workshop"
    gravewright_urlconf = "example_workshop.urls"

    def ready(self):
        from api.events import resource_changed
        from .hooks import observe
        resource_changed.connect(observe, dispatch_uid="example.server-workshop.observe", weak=False)
`,
  'example_workshop/hooks.py':`from collections import Counter
from threading import Lock

counts = Counter()
lock = Lock()


def observe(sender, change, **kwargs):
    # Only fixed resource names are retained, never campaign/user/document IDs.
    if change.resource not in {"actors", "tokens", "maps", "journals", "items", "combat", "cards", "audio", "compendiums"}:
        return
    with lock:
        counts[change.resource] += 1


def snapshot():
    with lock:
        return dict(counts)
`,
  'example_workshop/urls.py':`from django.urls import path
from . import views

urlpatterns = [
    path("api/tutorials/campaign/<uuid:campaign_id>/actors/", views.read_actors),
    path("api/tutorials/campaign/<uuid:campaign_id>/rename/", views.rename_actor),
    path("api/tutorials/event-counts/", views.event_counts),
]
`,
  'example_workshop/views.py':`import json
from uuid import UUID, uuid4
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from api import Context, actors
from api.errors import AuthError, JournalError, MapError
from .hooks import snapshot


def failure(error):
    code = getattr(error, "code", "invalid_data")
    code = {"not_a_member": "permission_denied", "forbidden": "permission_denied", "invalid_input": "invalid_data"}.get(code, code)
    status = {"permission_denied": 403, "not_found": 404, "conflict": 409}.get(code, getattr(error, "status", 400))
    return JsonResponse({"error": code}, status=status)


@login_required
@require_GET
def read_actors(request, campaign_id):
    try:
        context = Context.from_request(request, campaign_id)
        value = actors.state(context.campaign_id, context.user_id)
        return JsonResponse({"actors": value["actors"], "actorTypes": value["actorTypes"]})
    except (AuthError, JournalError, MapError) as error:
        return failure(error)


@login_required
@require_POST
def rename_actor(request, campaign_id):
    # Normal Django CSRF middleware remains active; never mark this csrf_exempt.
    if len(request.body) > 8192:
        return JsonResponse({"error": "invalid_data"}, status=400)
    try:
        body = json.loads(request.body)
        if not isinstance(body, dict) or set(body) != {"id", "version", "name"}:
            raise ValueError("Invalid payload")
        identifier = str(UUID(body["id"]))
        if not str(body["version"]).isdigit():
            raise ValueError("Invalid version")
        if not isinstance(body["name"], str) or not 2 <= len(body["name"].strip()) <= 120:
            raise ValueError("Invalid name")
        context = Context.from_request(request, campaign_id)
        result = actors.command(context.campaign_id, context.user_id, "actor.update", {
            "id": identifier, "version": body["version"], "name": body["name"].strip(),
        }, uuid4())
        return JsonResponse({"result": result})
    except (ValueError, TypeError, KeyError, AttributeError):
        return JsonResponse({"error": "invalid_data"}, status=400)
    except (AuthError, JournalError, MapError) as error:
        return failure(error)


@login_required
@require_GET
def event_counts(request):
    if request.user.role != "owner":
        return JsonResponse({"error": "permission_denied"}, status=403)
    return JsonResponse({"processLocal": True, "resources": snapshot()})
`,
  'LICENSE.txt':tutorialLicense,
};
const pkg={id:'server-workshop',slug:'tutorial-server-integration',manifest,files};
const fence=(lang,text)=>'```'+lang+'\n'+text.trimEnd()+'\n```';
const listing=Object.entries({'manifest.json':JSON.stringify(manifest,null,2),...files}).map(([name,text])=>'### '+name+'\n\n'+fence(name.endsWith('.py')?'python':name.endsWith('.json')?'json':'text',text)).join('\n\n');
const fetchExample=fence('javascript',`// Run on your own development host in an authenticated browser tab.
const campaignId = "REPLACE_WITH_YOUR_TEST_CAMPAIGN_UUID";
const state = await fetch('/api/tutorials/campaign/'+campaignId+'/actors/').then(r=>r.json());
const actor = state.actors.find(row=>row.canOpen);
const csrf = await fetch('/__gravewright/csrf').then(r=>r.json());
const response = await fetch('/api/tutorials/campaign/'+campaignId+'/rename/', {
  method:'POST',
  headers:{'Content-Type':'application/json',[csrf.header]:csrf.token},
  body:JSON.stringify({id:actor.id,version:actor.version,name:'Original workshop navigator'}),
});
console.log(response.status,await response.json());`);
function body(pt){return pt?`## O que este pacote faz

Crie uma integração de servidor genérica que expõe leitura autorizada de atores, renomeia ator pelos serviços públicos e observa sinais depois do commit. É código Python confiável ativado pelo dono para a instalação, separado dos módulos JavaScript de campanha. Não é um pacote complementar de regras de um RPG. Um sistema novo continua sendo um único pacote e precisa respeitar os contratos da release solicitada.

## 1. Escolha corretamente navegador ou servidor

Use navegador quando a ação cabe em api.actors, api.journals ou outro domínio público. Use Django somente para uma integração explicitamente confiável que precise de rotas/serviços de servidor. Um manifesto Django não aceita entry, system ou locales. O navegador não pode pedir ao host para importar Python nem executar SQL. O pacote abaixo não cria modelos, migrações, dependências extras ou gravações na inicialização.

## 2. Crie a pasta server-workshop com estes arquivos

${listing}

## 3. Empacote e ative no host de desenvolvimento

Baixe o [ZIP completo](../../assets/tutorials/server-workshop/server-workshop-source.zip), ou salve a árvore mostrada e compacte manifest.json, LICENSE.txt e a pasta example_workshop juntos. Na raiz do projeto:

${fence('powershell','python -m zipfile -c ../server-workshop-1.0.0.zip manifest.json LICENSE.txt example_workshop')}

No Linux/macOS use python3. Entre como dono, instale em Inside → Módulos → Instalar módulo → Instalar de ZIP. Use a ação de ativação para a instalação, não Activate da mesa. O Runner prepara a seleção e reinicia o servidor pelo mecanismo gerenciado; espere a conclusão e reabra a página. Num servidor iniciado diretamente sem supervisor, managed_start_required significa que a ativação precisa ocorrer pelo Runner. Não contorne isso importando o pacote por um módulo browser.

## 4. Teste leitura e gravação autenticadas

Abra /api/tutorials/campaign/SEU_UUID/actors/ numa aba autenticada. Substitua SEU_UUID pelo UUID da campanha descartável. A lista já é filtrada pelo serviço para sua conta. Como GM dessa campanha, abra Console nessa instalação e execute o trecho, usando um ator descartável:

${fetchExample}

A resposta bem-sucedida é 200. Abra Actors e confira o nome salvo. Repetir o trecho com a revisão antiga deve gerar conflict; releia antes de decidir outra alteração. Um jogador não recebe poderes de GM porque passou um UUID de GM: Context.from_request usa a conta autenticada e a associação da campanha. POST sem CSRF válido é recusado pelo middleware.

## 5. Observe o sinal sem vazar dados

AppConfig.ready registra observe uma vez. O receiver só conta nove nomes fixos de recurso, sem IDs de usuário/campanha/documento e sem consultar banco. Abra /api/tutorials/event-counts/ como proprietário. Depois de um comando público confirmado, a contagem correspondente pode aumentar. Ela é local ao processo e desaparece ao reiniciar; não é fila durável, auditoria completa nem total agregado de múltiplos workers. Nem toda gravação de chat/dados emite esse sinal.

Uma falha de receiver depois do commit não desfaz uma transação concluída. Não faça integrações externas irreversíveis dentro desse callback esperando rollback. Para tarefa durável, um app confiável precisa implementar sua própria fila transacional; isso não vem do browser SDK.

## 6. Use as demais fachadas Python

O padrão é sempre autenticar Context, chamar a fachada pública e deixar o serviço validar domínio/revisão. As assinaturas diferem, então consulte a tabela da [API Python](docs:api#interface-python): actors/tokens/maps/journals; items/combat/cards/audio/compendiums; resources como roteador genérico; chat/dice/table para mensagens, rolagens e busca; events para sinais. Não use importações privadas nem gravações ORM como substituto desses comandos.

As receitas de cada família no [índice de implementação](docs:tutorial-index) mostram os payloads reais das ações. No servidor, os mesmos dados passam em command(campaign_id,user_id,action,data,request_id), com os nomes de ação nativos declarados em frontend.json, e estados em state. Exemplos: journals.update corresponde a action update; combat.nextTurn corresponde a next. Não envie o nome JavaScript como action sem conferir o registro.

## 7. Testes antes de distribuir

Teste proprietário, GM, jogador, conta fora da campanha, sessão ausente, CSRF ausente, corpo inválido, revisão desatualizada e ator de outra campanha. As rotas GET não devem gravar nem importar apps do operador. Revise os arquivos do ZIP e publique nova versão para alterar bytes. Desativar pelo dono usa novamente o Runner e reinício; não remova arquivos de uma instalação ativa à força.

## Como usar a IA para uma integração de servidor

${fence('text','Parta do Server integration workshop para [integração genérica] no Gravewright 0.3.0. Use Context.from_request e fachadas api; mantenha login, CSRF, permissões e revisão. Nenhuma query no ready/import. Documente sinais depois do commit, limite por processo e caminho de ativação pelo Runner. Não transforme isso em companion de sistema nem exija novo host. Entregue todos arquivos e testes de contas/campanhas distintas.')}\n`:
`## What this package does

Build a generic trusted server integration with authorized actor reads, native-command renaming and after-commit event observation. Python code is owner-activated for the installation, separately from campaign browser modules. It is not a separately installed RPG rules companion. A new system remains one package using the requested host contracts.

## 1. Choose browser or server correctly

Use browser code when an action fits the public domain API. Use Django only for an explicitly trusted integration requiring server routes/services. A Django manifest cannot contain entry, system or locales. Browser modules cannot ask the host to import Python or execute SQL. This example creates no models, migrations, extra dependencies or startup writes.

## 2. Create server-workshop with these files

${listing}

## 3. Package and activate on a development host

Download the [complete ZIP](../../assets/tutorials/server-workshop/server-workshop-source.zip) or save the files and archive manifest.json, LICENSE.txt and example_workshop together. From the project root:

${fence('powershell','python -m zipfile -c ../server-workshop-1.0.0.zip manifest.json LICENSE.txt example_workshop')}

Use python3 on Linux/macOS. As owner, install through Inside → Modules → Install module → Install from ZIP. Choose installation activation rather than the table’s Activate action. The Runner stages selection and restarts through managed supervision; await completion and reload. managed_start_required on a directly launched server means activation must use the Runner. Do not bypass it through a browser module import.

## 4. Test authenticated reads and writes

Open /api/tutorials/campaign/YOUR_UUID/actors/ in an authenticated tab with your disposable campaign UUID. The native service filters the list for that caller. As campaign GM, use a disposable actor and execute in that host’s Console:

${fetchExample}

A successful response is 200. Inspect the persisted name in Actors. An old version yields conflict; reread before deciding another change. Passing a GM UUID does not grant GM access: Context.from_request uses authenticated identity and membership. Middleware rejects POST without valid CSRF.

## 5. Observe events without exposing data

AppConfig.ready connects observe once. The receiver only counts nine fixed resource names without storing user/campaign/document IDs or querying the database. As owner, open /api/tutorials/event-counts/. A completed public command may increment its counter. Counts are process-local and reset on restart; they are neither durable audit history nor multi-worker totals. Chat/dice writes do not all emit this signal.

An after-commit receiver failure does not undo a committed transaction. Do not perform irreversible external work expecting rollback. Durable integrations require their own transactional queue in a trusted app; the browser SDK does not supply it.

## 6. Use the remaining Python facades

Authenticate Context, invoke the public facade and let its service enforce permissions/revisions. Signatures differ; consult the [Python API table](docs:api#python-interface): actors/tokens/maps/journals; items/combat/cards/audio/compendiums; resources as a generic dispatcher; chat/dice/table for messages, rolls and search; events for signals. Private imports and direct ORM writes do not replace native commands.

Family recipes in the [implementation index](docs:tutorial-index) supply concrete action payloads. Server command(campaign_id,user_id,action,data,request_id) uses native action names declared in frontend.json, with state for reads. For example journals.update uses action update, while combat.nextTurn uses next. Do not pass JavaScript method names as native actions without checking the registry.

## 7. Test before distribution

Check owner, GM, player, nonmember, anonymous session, missing CSRF, malformed body, stale revision and another campaign’s actor. GET routes must not write or import operator apps. Inspect the ZIP and publish a new version for changed bytes. Owner deactivation also uses the Runner and restart; do not remove active package files forcibly.

## How to use AI for server integration

${fence('text','Start from Server integration workshop for [generic integration] on Gravewright 0.3.0. Use Context.from_request and public api facades; preserve authentication, CSRF, permissions and revisions. No ready/import queries. Document after-commit signals, process-local limits and Runner activation. Do not introduce a system companion or require a newer host. Deliver complete files and cross-account/campaign tests.')}\n`;}
export const serverTutorialPackages=[pkg];
export const serverTutorialArticles=[{slug:pkg.slug,group:'tutorials',sourcePaths:['api/context.py','api/actors.py','api/events.py','gravewright/modules/server_apps.py','config/marketplace_apps.py'],en:{title:'Create a trusted Django integration and server hooks',summary:'Complete Python app with authenticated routes, native mutations and after-commit signals.',body:body(false)},pt:{title:'Criar integração Django confiável e hooks de servidor',summary:'App Python completo com rotas autenticadas, alterações nativas e sinais depois do commit.',body:body(true)}}];
