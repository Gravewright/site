// Original end-to-end tutorials for the released 0.3.0 contracts.
const MIT = `MIT License

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
const sdk = {requires: '>=1.0.0 <2.0.0', tested: '1.0.0'};
const base = (id, name, description) => ({id, name, version:'1.0.0', sdk, entry:'main.mjs', description, author:'Gravewright documentation', license:'MIT'});

const libraryCode = String.raw`// The source text and snapshot belong to this original example.
export const journalData = {
  sections: [{
    id: "harbor-notice", title: "Harbor notice", kind: "text", audience: "public",
    content: {
      format: "gw-journal-doc-v1", version: 1,
      doc: {type: "doc", content: [{type: "paragraph", content: [
        {type: "text", text: "At sunset, the harbor keeper lights a blue lantern. Bring a coil of rope to join the watch."},
      ]}]},
    },
  }],
};

const key = "harbor-library-workflow-v1";
const fail = code => Object.assign(new Error(code), {code});

export function createLibrary({api, storage, signal}) {
  return {
    async prepare() {
      if (!(await api.compendiums.state({}, {signal})).isGM) throw fail("permission_denied");
      let record = await storage.user.get(key);
      if (record && record.value?.schema !== 1) throw fail("invalid_data");
      if (!record) record = await storage.user.set(key, {
        schema: 1,
        requests: Object.fromEntries(["pack", "journal", "body", "snapshot"].map(name => [name, crypto.randomUUID()])),
      }, {expectedRevision: null});
      const checkpoint = async changes => {
        record = await storage.user.set(key, {...record.value, ...changes}, {expectedRevision: record.revision});
      };
      // Save request identities before making writes; retries reuse exact inputs.
      if (!record.value.packId) {
        const created = await api.compendiums.create({name: "Harbor Library"}, {signal, requestId: record.value.requests.pack});
        await checkpoint({packId: created.id});
      }
      if (!record.value.journalId) {
        const created = await api.journals.create({title: "Beacon Watch", journal_type: "diary"}, {signal, requestId: record.value.requests.journal});
        await checkpoint({journalId: created.journal_id, journalVersion: created.version});
      }
      if (!record.value.bodySaved) {
        await api.journals.update({
          journal_id: record.value.journalId, version: record.value.journalVersion,
          title: "Beacon Watch", visibility: "private", data: journalData,
        }, {signal, requestId: record.value.requests.body});
        await checkpoint({bodySaved: true});
      }
      if (!record.value.entryId) {
        const added = await api.compendiums.add({
          packId: record.value.packId, kind: "journal", resourceId: record.value.journalId,
          name: "Beacon Watch",
        }, {signal, requestId: record.value.requests.snapshot});
        await checkpoint({entryId: added.id});
      }
      return record.value;
    },
    async read(packId, entryId) {
      return api.compendiums.read({packId, id: entryId}, {signal});
    },
    async importCopy(packId, entryId, requestId) {
      return api.compendiums.import({packId, id: entryId}, {signal, requestId});
    },
  };
}
`;

const mainCode = String.raw`import {createLibrary} from "./library.mjs";

export default {
  start({styles}) { styles.use("styles.css"); },
  register({register}) {
    register("table.interface", async ({root, api, storage, signal, onDispose}) => {
      const library = createLibrary({api, storage, signal});
      const el = (tag, text) => {
        const node = root.ownerDocument.createElement(tag);
        if (text !== undefined) node.textContent = text;
        return node;
      };
      const panel = el("section"); panel.className = "harbor-library";
      const prepare = el("button", "Prepare my library");
      const refresh = el("button", "Refresh list");
      const read = el("button", "Read snapshot");
      const copy = el("button", "Import copy");
      for (const button of [prepare, refresh, read, copy]) button.type = "button";
      const packLabel = el("label", "Compendium");
      const packs = el("select"); packLabel.append(packs);
      const entryLabel = el("label", "Entry");
      const entries = el("select"); entryLabel.append(entries);
      const output = el("pre"); output.setAttribute("role", "status");
      panel.append(el("h3", "Harbor library"), prepare, refresh, packLabel, entryLabel, read, copy, output);
      root.append(panel); onDispose(() => panel.remove());
      let state, busy = true, importAttempt;
      const controls = () => {
        prepare.disabled = busy || !state?.isGM;
        refresh.disabled = busy;
        read.disabled = busy || !entries.value;
        copy.disabled = busy || !state?.isGM || !entries.value;
        packs.disabled = busy; entries.disabled = busy;
      };
      const options = (select, rows, selected) => {
        select.replaceChildren();
        const empty = el("option", "Choose..."); empty.value = ""; select.append(empty);
        for (const row of rows) { const option = el("option", row.name); option.value = row.id; select.append(option); }
        select.value = rows.some(row => row.id === selected) ? selected : "";
      };
      const chooseEntries = selected => {
        options(entries, state?.packs.find(pack => pack.id === packs.value)?.entries ?? [], selected);
        controls();
      };
      const load = async (packId = packs.value, entryId = entries.value) => {
        const next = await api.compendiums.state({}, {signal});
        if (signal.aborted) return;
        state = next; options(packs, state.packs, packId); chooseEntries(entryId);
      };
      const run = async task => {
        if (busy || signal.aborted) return;
        busy = true; controls(); output.textContent = "Working...";
        try { await task(); }
        catch (error) { if (!signal.aborted) output.textContent = "Error: " + (error.code ?? "unavailable") + ". Refresh and review before retrying."; }
        finally { if (!signal.aborted) {busy = false; controls();} }
      };
      prepare.addEventListener("click", () => void run(async () => {
        const saved = await library.prepare();
        await load(saved.packId, saved.entryId);
        if (!signal.aborted) output.textContent = "Library ready. Select Read snapshot or Import copy.";
      }), {signal});
      refresh.addEventListener("click", () => void run(async () => {await load(); if (!signal.aborted) output.textContent = "List refreshed.";}), {signal});
      packs.addEventListener("change", () => {chooseEntries(""); importAttempt = undefined;}, {signal});
      entries.addEventListener("change", () => {importAttempt = undefined; controls();}, {signal});
      read.addEventListener("click", () => void run(async () => {
        const value = await library.read(packs.value, entries.value);
        if (!signal.aborted) output.textContent = JSON.stringify(value, null, 2);
      }), {signal});
      copy.addEventListener("click", () => void run(async () => {
        importAttempt ??= {packId: packs.value, entryId: entries.value, requestId: crypto.randomUUID()};
        const created = await library.importCopy(importAttempt.packId, importAttempt.entryId, importAttempt.requestId);
        importAttempt = undefined;
        if (!signal.aborted) output.textContent = "Imported " + created.kind + ": " + created.id + ". Open Journals to inspect it.";
      }), {signal});
      controls();
      try { await load(); }
      catch (error) { if (!signal.aborted) output.textContent = "Error: " + (error.code ?? "unavailable"); }
      finally { if (!signal.aborted) {busy = false; controls();} }
    });
  },
  stop() {},
};
`;

const libraryStyles = `.gw-module-root[data-module-id="example.harbor-library"] .harbor-library { position: fixed; top: 64px; left: var(--space-4); z-index: 10; box-sizing: border-box; width: 400px; max-width: calc(100vw - 32px); max-height: 50vh; overflow: auto; padding: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text); font: 14px/1.5 system-ui, sans-serif; }
.gw-module-root[data-module-id="example.harbor-library"] .harbor-library h3 { font-size: 16px; margin: var(--space-0) var(--space-0) var(--space-2); }
.gw-module-root[data-module-id="example.harbor-library"] .harbor-library label { display: block; margin-top: var(--space-2); }
.gw-module-root[data-module-id="example.harbor-library"] .harbor-library button, .gw-module-root[data-module-id="example.harbor-library"] .harbor-library select { font: inherit; margin: var(--space-1); padding: var(--space-1); max-width: 100%; }
.gw-module-root[data-module-id="example.harbor-library"] .harbor-library pre { white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }
`;
const collection = {
  name:'Beacon Expedition Library',
  packs:[
    {id:'scouts', label:'Scouts', type:'actor_pack', entries:[{id:'harbor-scout', name:'Harbor Scout', type:'character', systemId:'example.beacon-library', data:{stamina:8, role:'Watch keeper'}}]},
    {id:'equipment', label:'Equipment', type:'item_pack', entries:[{id:'signal-rope', name:'Signal Rope', type:'gear', systemId:'example.beacon-library', data:{length:12, description:'An original training rope with blue knots.'}}]},
    {id:'signals', label:'Signals', type:'spell_pack', entries:[{id:'blue-glow', name:'Blue Glow', type:'spell', systemId:'example.beacon-library', data:{color:'blue', duration:1, description:'An original fictional signal, with no host automation.'}}]},
  ],
};

const maintenanceCode = String.raw`const options = signal => ({signal, requestId: crypto.randomUUID()});
const editable = packId => {
  if (packId.startsWith("native:")) throw Object.assign(new Error("Installed packs are read only"), {code: "invalid_data"});
};
export async function shareCampaignPack(api, packId, signal) {
  editable(packId);
  const pack = (await api.compendiums.state({}, {signal})).packs.find(row => row.id === packId);
  if (!pack) throw Object.assign(new Error("Pack not found"), {code: "not_found"});
  return api.compendiums.configure({packId, version: pack.version, name: "Harbor Library revised", shared: true, locked: false}, options(signal));
}
export async function grantInstalledPackRead(api, packId, signal) {
  if (!packId.startsWith("native:")) throw new Error("Use configure.shared or the native ownership editor for a table pack");
  return api.compendiums.setPermissions({packId, level: "read"}, options(signal));
}
export async function readBatch(api, packId, entryIds, signal) {
  return api.compendiums.read({packId, ids: entryIds}, {signal});
}
export async function removeSnapshot(api, packId, entryId, signal) {
  editable(packId);
  const entry = await api.compendiums.read({packId, id: entryId}, {signal});
  return api.compendiums.remove({packId, id: entryId, version: entry.version}, options(signal));
}
export async function deleteCampaignPack(api, packId, signal) {
  editable(packId);
  const pack = (await api.compendiums.state({}, {signal})).packs.find(row => row.id === packId);
  if (!pack) throw Object.assign(new Error("Pack not found"), {code: "not_found"});
  return api.compendiums.delete({packId, version: pack.version}, options(signal));
}
`;

export const tutorialCompendiumPackages = [
  {id:'campaign-library', slug:'tutorial-compendium-module', manifest:base('example.harbor-library', 'Harbor campaign library', 'Creates an original journal and reusable campaign snapshot through the public API.'), files:{
    'main.mjs':mainCode, 'library.mjs':libraryCode, 'maintenance.mjs':maintenanceCode, 'styles.css':libraryStyles, 'LICENSE.txt':MIT,
  }},
  {id:'system-library', slug:'tutorial-system-compendiums', manifest:{...base('example.beacon-library', 'Beacon Expedition Library', 'Original actor and item types with three installed read-only compendium packs.'),
    system:{actorTypes:[{id:'character',label:'Character'}],itemTypes:[{id:'gear',label:'Gear'},{id:'spell',label:'Spell'}]},
    content:{compendiums:['compendiums/beacon.json']},
  }, files:{'main.mjs':'export default {\n  start() {},\n  register() {},\n  stop() {},\n};\n', 'compendiums/beacon.json':JSON.stringify(collection,null,2)+'\n', 'LICENSE.txt':MIT}},
];

const fence = (language, code) => '\n```'+language+'\n'+code.trimEnd()+'\n```\n';
const asset = (p, file) => '../../assets/tutorials/'+p.id+'/'+file;
const allFiles = p => ({'manifest.json':JSON.stringify(p.manifest,null,2)+'\n', ...p.files});
const filesBody = p => Object.entries(allFiles(p)).map(([name, text])=>'### '+name+'\n\n'+fence(name.endsWith('.json')?'json':name.endsWith('.css')?'css':name.endsWith('.txt')?'text':'javascript',text)).join('\n');
const downloadBody = (p, pt) => '['+(pt?'Baixar o ZIP completo':'Download the complete ZIP')+']('+asset(p,p.id+'-source.zip')+')\n\n'+Object.keys(allFiles(p)).map(file=>'- ['+file+']('+asset(p,file)+')').join('\n');
const tree = p => fence('text', p.id+'/\n'+Object.keys(allFiles(p)).map(file=>'  '+file).join('\n'));
const zipBody = p => `### POSIX\n`+fence('sh', `cd ${p.id}\npython -m zipfile -c ../${p.id}-source.zip ${Object.keys(allFiles(p)).map(file=>'"'+file+'"').join(' ')}`)+`\n### PowerShell\n`+fence('powershell', `Set-Location -LiteralPath .\\${p.id}\npython -m zipfile -c ..\\${p.id}-source.zip ${Object.keys(allFiles(p)).map(file=>'"'+file+'"').join(' ')}`);

function moduleTutorial(p, pt) {
  const intro = pt ? `## O que você vai construir

Você começa com uma pasta vazia e termina com um módulo instalável. Na mesa ele mostra **Harbor library**. O GM clica **Prepare my library** e obtém um compêndio Harbor Library com uma entrada de diário Beacon Watch. Depois lê o snapshot e importa uma cópia pela própria interface do módulo.

Este é o caminho para um módulo comum que trabalha com documentos da campanha. O conteúdo nasce por ações autorizadas da API e fica salvo na campanha. Um manifesto de módulo comum não aceita content.compendiums sem system: esse outro caminho é ensinado em [Como incluir compêndios em um sistema](docs:tutorial-system-compendiums).

Use Gravewright 0.3.0 e uma campanha descartável. Você precisa da conta proprietária para instalar e do papel GM na campanha para preparar/importar. Não precisa de npm, acesso ao banco, biblioteca de RPG ou módulo de regras. Os textos de exemplo são originais. Os botões do pacote estão em inglês.

## 1. Crie a pasta e entenda os arquivos

Crie uma pasta chamada campaign-library. Salve em UTF-8 todos os arquivos completos da seção 4, preservando os nomes e os caminhos. Alternativamente, extraia o ZIP abaixo. manifest.json identifica o pacote; main.mjs desenha o painel; library.mjs faz a sequência de gravações; maintenance.mjs contém funções opcionais de manutenção; styles.css limita os estilos ao módulo; LICENSE.txt autoriza o uso do exemplo.` : `## What you will build

Start with an empty directory and finish with an installable module. It displays **Harbor library** on the table. The GM clicks **Prepare my library** to create a Harbor Library compendium containing a Beacon Watch journal entry, then reads the snapshot and imports a copy through the module's own interface.

Use this route for an ordinary module working with campaign documents. Authorized API actions create the content, which persists in the campaign. An ordinary module cannot declare content.compendiums without system; learn that separate route in [How to include compendiums in a system](docs:tutorial-system-compendiums).

Use Gravewright 0.3.0 and a disposable campaign. You need the installation owner's account to install and the campaign GM role to prepare/import. No npm, database access, RPG catalog or rules module is required. All sample text is original. Package buttons are English.

## 1. Create the directory and understand the files

Create a directory named campaign-library. Save every complete file from section 4 as UTF-8 with the exact names and paths, or extract the ZIP below. manifest.json identifies the package; main.mjs renders its panel; library.mjs owns the write sequence; maintenance.mjs contains optional maintenance functions; styles.css scopes the module styling; LICENSE.txt permits reuse of this example.`;
  const install = pt ? `## 2. Empacote e instale

Use um Python já disponível no ambiente de desenvolvimento. Os comandos abaixo partem da pasta que contém campaign-library. No POSIX, use python3 se esse for o nome do seu interpretador. Eles compactam somente os arquivos listados, com manifest.json na raiz, sem incluir estado local.
` : `## 2. Package and install

Use Python already available in your development environment. These commands start in the directory containing campaign-library. On POSIX use python3 if that is your interpreter name. They archive only the listed files with manifest.json at the root, excluding local state.
`;
  const run = pt ? `Confira o ZIP com python -m zipfile -l ../campaign-library-source.zip enquanto ainda estiver dentro da pasta. Como proprietário, abra **Inside → Módulos → Instalar módulo → Instalar de ZIP**. Escolha o ZIP e clique **Instalar**. Em inglês: **Modules → Install module → Install from ZIP → Install**. Não é necessário assinar este upload local; publicação via catálogo exige o fluxo de assinatura documentado.

Abra sua campanha de teste como GM. No botão Gravewright da mesa, abra **Extensions**, encontre **Harbor campaign library 1.0.0** e clique **Activate**. Feche o menu. O painel **Harbor library** aparece abaixo da barra superior. Veja [seu primeiro módulo](docs:tutorial-first-module) se precisar localizar essas telas.

## 3. Prepare, leia e importe

1. Clique **Prepare my library**. O controlador confirma isGM, reserva quatro UUIDs de operação em storage.user e cria o compêndio.
2. Ele cria um diário nativo, usa journal_id e version retornados para salvar uma página com formato gw-journal-doc-v1 e adiciona o diário ao pack usando kind journal e resourceId. O corpo não é enviado diretamente para compendiums.add.
3. Aguarde **Library ready**. Os seletores passam a mostrar Harbor Library e Beacon Watch. Clique **Read snapshot**: aparece o envelope com kind journal e a página original sobre a lanterna azul.
4. Clique **Import copy**. O resultado informa o ID criado. Abra **Journals** na mesa e confira o diário importado e a mesma página. A importação usa a campanha da montagem; nenhum campo permite apontar para outra campanha.
5. Clique **Prepare my library** novamente e depois desative/reative o módulo. O mesmo GM recupera o registro e não cria outro pack nem outra entrada. Recarregue a lista para conferir. Clicar **Import copy** novamente após um sucesso é uma nova ação e pode criar outra cópia.

O registro de preparação pertence ao usuário, módulo e campanha. Outro GM tem seu próprio registro e, se clicar preparar, cria sua própria biblioteca. Isso mantém os UUIDs de retry na mesma conta que executou as operações. O compêndio resultante pertence à campanha e permanece após desativar o módulo.

## 4. Copie todos os arquivos

Para mudar o conteúdo distribuído pelo exemplo, edite journalData em library.mjs antes de preparar uma biblioteca nova. Cada seção tem ID estável, título, audience e um documento rico. Para mudar nomes do pack/diário, altere os literais nas chamadas create/update/add. Alterar o código não atualiza automaticamente snapshots já capturados: eles são cópias, não links vivos para o diário.` : `List the ZIP using python -m zipfile -l ../campaign-library-source.zip while still in the project directory. As owner open **Inside → Modules → Install module → Install from ZIP**, choose it and click **Install**. This local upload requires no signature; catalog publication uses the documented signing workflow.

Open your test campaign as GM. Use its Gravewright button → **Extensions**, find **Harbor campaign library 1.0.0** and click **Activate**. Close the menu. **Harbor library** appears below the top bar. See [your first module](docs:tutorial-first-module) to locate these screens.

## 3. Prepare, read and import

1. Click **Prepare my library**. The controller checks isGM, saves four operation UUIDs in storage.user and creates the compendium.
2. It creates a native journal, uses the returned journal_id/version to save a page in gw-journal-doc-v1 format, then snapshots the journal with kind journal and resourceId. It does not send the journal body directly to compendiums.add.
3. Wait for **Library ready**. The selectors show Harbor Library and Beacon Watch. Click **Read snapshot** to see the kind journal envelope and the original blue-lantern page.
4. Click **Import copy**. The result identifies the created document. Open **Journals** and inspect the imported diary and its page. Import uses the mounted campaign; there is no payload field for a different campaign.
5. Click **Prepare my library** again, then deactivate/reactivate the module. The same GM resumes the stored workflow without creating another pack or entry. Refresh to verify. Clicking **Import copy** again after success is a new action and may create another copy.

Preparation belongs to the user, module and campaign. A different GM has their own workflow and creates their own library if they click prepare. This keeps retry UUIDs with the account that performed the operations. The resulting compendium belongs to the campaign and survives deactivation.

## 4. Copy every complete file

To change sample content edit journalData in library.mjs before preparing a new library. Every section has a stable ID, title, audience and rich document. To rename documents, change the create/update/add literals. Changing the module code does not rewrite existing snapshots: they are captured copies rather than live journal links.`;
  const end = pt ? `## 5. Compartilhe e mantenha a biblioteca

O pack começa privado. Para compartilhá-lo como GM, integre a função shareCampaignPack de maintenance.mjs a uma ação explícita no seu módulo e passe o packId retornado por prepare. Ela lê a versão atual antes de configure e marca shared true, deixando o pack desbloqueado. Na interface nativa de permissões, confira se concessões explícitas não restringem a conta de teste. Como jogador com leitura, clique Refresh list, selecione o pack e use Read snapshot. Prepare e Import ficam desabilitados; o servidor também rejeita escrita/importação.

maintenance.mjs também inclui readBatch para 1 a 100 IDs únicos (não misture id e ids), removeSnapshot e deleteCampaignPack. Use-as apenas em sua biblioteca de teste após conferir os IDs. Remover uma entrada usa a versão da entrada; excluir o pack usa a versão do pack lida depois das alterações. Nenhuma dessas ações remove o diário original ou os documentos que já foram importados. Um pack bloqueado precisa ser desbloqueado por configure antes de editar/excluir.

setPermissions é mostrado em grantInstalledPackRead porque esse método configura packs nativos/instalados, identificados por native:. Para um pack criado na mesa, use configure.shared ou o editor nativo de propriedade. Os arquivos completos acima contêm os payloads reais de todas essas ações.

## 6. Valide repetição, falhas e permissões

Prepare duas vezes com o mesmo GM e conte um pack e uma entrada. Edite o diário original pela interface, leia o snapshot e confira que ele preserva o conteúdo capturado. Importe, feche/reabra e compare a página. Compartilhe para um jogador, teste leitura e tente importação diretamente pela API: a negação precisa vir do servidor.

Se uma resposta de escrita se perder, Prepare retoma na mesma conta usando os UUIDs persistidos e o mesmo payload. Cada checkpoint usa expectedRevision; em conflict, atualize a lista/estado antes de tentar novamente. Se o diário foi editado antes do passo de salvar corpo, a revisão antiga é rejeitada e não é substituída silenciosamente: revise o diário e a operação pendente antes de ajustar código/estado. Import copy conserva seu UUID enquanto a tentativa fica no painel; se fechar com resultado desconhecido, inspecione os diários antes de pedir outra importação. Cancelar o contexto não desfaz escrita já confirmada.

Um erro de rede é erro, não lista vazia. IDs excluídos ou acesso revogado causam not_found/permission_denied; não apague o registro automaticamente nem crie substitutos para esconder o problema. Não reinicialize o workflow para atualizar conteúdo. Para novos bytes de pacote, use version 1.0.1, instale e ative a nova versão; os documentos e o workflow continuam salvos.

## Como usar a IA para adaptar esta biblioteca

> Adapte tutorial-compendium-module para uma biblioteca de avisos originais. Leia frontend.json, journals/services.py e compendiums/services.py da release 0.3.0. Preserve journal_id/version, documento rico, snapshot por resourceId, UUIDs de retry e expectedRevision. Mostre todos os arquivos, cliques e testes GM/jogador. Não acrescente content ao manifesto de módulo comum nem atualize snapshots automaticamente. Inclua batch read e manutenção com versões sem excluir conteúdo da campanha.` : `## 5. Share and maintain the library

The pack starts private. As GM integrate maintenance.mjs's shareCampaignPack into an explicit module action and pass the packId returned by prepare. It reads the current version before configure, sets shared true and leaves the pack unlocked. Check that native ownership grants do not further restrict the test account. As a player with reading permission click Refresh list, select the pack and Read snapshot. Prepare and Import are disabled; the server also rejects writes/importing.

maintenance.mjs includes readBatch for 1–100 unique IDs (never combine id and ids), removeSnapshot and deleteCampaignPack. Use them only for your test library after verifying the IDs. Removing an entry uses the entry version; deleting a pack reads its version after other changes. Neither removes the source diary or already imported documents. Unlock a locked pack through configure before editing/deleting it.

grantInstalledPackRead demonstrates setPermissions for native/installed packs identified by native:. For table-created packs use configure.shared or native ownership controls. The complete file above contains actual payloads for all these actions.

## 6. Verify repetition, failures and permissions

Prepare twice with the same GM and count one pack and one entry. Edit the source diary through the interface, read the snapshot and confirm its captured text stays unchanged. Import, reopen and inspect the page. Grant a player reading permission, test reading and attempt a direct API import: the server must reject it.

If a write response is lost, Prepare resumes with the same account's saved UUIDs and exact payloads. Every checkpoint uses expectedRevision; on conflict reload before retrying. If someone edited the diary before the body-save step, its old revision is rejected without silently replacing it: review the source and pending operation before changing code/state. Import copy retains its UUID for a pending attempt in the panel; if the context closes with an unknown outcome, inspect journals before requesting another import. Cancelling a context cannot undo a committed write.

A network failure is an error rather than an empty list. Deleted IDs or revoked access produce not_found/permission_denied; do not erase workflow state or create replacements to conceal failures. Do not reset the workflow to update content. For changed package bytes use version 1.0.1, install and activate it; existing documents and workflow data remain saved.

## How to use AI to adapt this library

> Adapt tutorial-compendium-module into a library of original notices. Inspect frontend.json, journals/services.py and compendiums/services.py for release 0.3.0. Preserve journal_id/version, rich documents, snapshots by resourceId, retry UUIDs and expectedRevision. Provide every file, click and GM/player checks. Do not add content to an ordinary module manifest or update snapshots automatically. Include batch reading and versioned maintenance without deleting campaign content.`;
  return intro+'\n\n'+tree(p)+'\n'+downloadBody(p,pt)+'\n\n'+install+zipBody(p)+'\n'+run+'\n\n'+filesBody(p)+'\n\n'+end+'\n\n[API](docs:api) · ['+(pt?'Todos os tutoriais':'All tutorials')+'](docs:tutorial-index)';
}

function systemTutorial(p, pt) {
  const intro = pt ? `## O que você vai construir

Você vai criar um único pacote de sistema chamado **Beacon Expedition Library**, contendo descritores de ator/item e um arquivo físico de compêndios. Depois da instalação e seleção na campanha, a aba Compendiums mostrará três packs: Scouts, Equipment e Signals. O GM importará Harbor Scout, Signal Rope e Blue Glow.

Esse é o caminho para conteúdo original distribuído junto de um sistema. Diferentemente do [módulo de biblioteca](docs:tutorial-compendium-module), a coleção não é criada por um clique JavaScript: a instalação valida o JSON declarado e o host o oferece apenas quando aquela versão do sistema está ativa na campanha. O catálogo instalado é somente leitura; importar cria documentos da campanha que podem evoluir separadamente.

Use Gravewright 0.3.0, uma instalação descartável e a conta proprietária para instalar. O GM escolhe o sistema da campanha e importa os documentos. O pacote abaixo é completo como provedor de tipos e conteúdo; seu entry não registra fichas ou regras. Se quiser editar esses campos numa ficha personalizada, amplie o mesmo pacote usando o [exemplo de ficha editável](docs:example-package-system).

## 1. Comece em uma pasta vazia

Crie system-library e dentro dela compendiums. Salve todos os arquivos da seção 4. manifest.json registra system e content; main.mjs satisfaz start/register/stop sem executar ações; compendiums/beacon.json contém o conteúdo real; LICENSE.txt acompanha a distribuição. Não existe arquivo separado para instalar sob Módulos.` : `## What you will build

Create one system package named **Beacon Expedition Library**, containing actor/item descriptors and a physical compendium file. Once installed and selected for a campaign, Compendiums will show Scouts, Equipment and Signals. The GM imports Harbor Scout, Signal Rope and Blue Glow.

Use this route for original content shipped with a system. Unlike the [campaign library module](docs:tutorial-compendium-module), no JavaScript click creates the collection: installation validates its declared JSON and the host exposes it only with the campaign's active exact system version. Installed catalogs are read only; imports create campaign documents that evolve independently.

Use Gravewright 0.3.0, a disposable installation and the owner account for installation. The GM selects the campaign system and imports documents. This package is complete as a type/content provider; its entry registers no sheets or rules. For an editable custom sheet extend this same package using the [sheet example](docs:example-package-system).

## 1. Start with an empty directory

Create system-library and its compendiums subdirectory. Save every file from section 4. manifest.json registers system and content; main.mjs implements start/register/stop without running actions; compendiums/beacon.json contains the actual content; LICENSE.txt travels with the package. There is no separately installed Modules companion.`;
  const middle = pt ? `## 2. Entenda o vínculo antes de empacotar

O ID do sistema é example.beacon-library. Ele aparece no manifesto e no systemId de TODAS as entradas. actor_pack usa o tipo character de system.actorTypes. item_pack usa gear e spell_pack usa spell, ambos declarados em system.itemTypes. O core trata spell_pack como compatibilidade de item; ele não passa a implementar regras de magia.

content.compendiums aponta exatamente para compendiums/beacon.json. O arquivo tem nome de coleção e array packs; cada pack possui id, label, type e entries. Cada entrada tem id, name, type, systemId e data. Não acrescente campaigns: o host faz a associação à campanha ativa. Não use journal_pack, scene_pack, card_pack ou deck_pack neste pacote: a instalação aceita somente actor_pack, item_pack e spell_pack.

## 3. Empacote, instale e selecione

Partindo da pasta que contém system-library, use um dos comandos abaixo. Eles incluem o JSON aninhado com seu caminho correto, mantendo manifest.json na raiz. Use python3 em POSIX quando necessário.
` : `## 2. Understand the binding before packaging

The system ID is example.beacon-library. It appears in the manifest and every entry's systemId. actor_pack uses character from system.actorTypes. item_pack uses gear and spell_pack uses spell, both declared in system.itemTypes. The core routes spell_pack to items; it does not implement spell rules.

content.compendiums points exactly to compendiums/beacon.json. The file has a collection name and packs array; each pack has id, label, type and entries. Each entry has id, name, type, systemId and data. Do not add campaigns: the host associates the collection with the active campaign. Do not put journal_pack, scene_pack, card_pack or deck_pack in this package; installation accepts only actor_pack, item_pack and spell_pack.

## 3. Package, install and select

Start in the directory containing system-library and use one command below. Both include the nested JSON at its correct path with manifest.json at the root. Use python3 on POSIX where appropriate.
`;
  const run = pt ? `Confira a raiz e o caminho compendiums/beacon.json com python -m zipfile -l ../system-library-source.zip. Como proprietário, abra **Inside → Sistemas → Instalar sistema → Instalar de ZIP**, selecione o ZIP e clique **Instalar**. Em inglês: **Systems → Install system → Install from ZIP → Install**. Abra uma campanha de teste usando **Beacon Expedition Library** como sistema. Confira nas Extensions da mesa a versão exata 1.0.0 ativada; apenas instalar uma versão não troca automaticamente a versão de campanhas existentes.

Abra **Compendiums**. Localize **Beacon Expedition Library / Scouts**, **/ Equipment** e **/ Signals**. Leia Harbor Scout: type é character e stamina é 8. Importe pelo controle nativo do pack. Repita para Signal Rope (gear, length 12) e Blue Glow (spell, color blue). Atores/itens importados aparecem nos seus diretórios da campanha.

## 4. Copie todos os arquivos

Para acrescentar seu conteúdo original, edite as entradas do JSON, mantendo IDs estáveis. Adicione tipos ao manifesto antes de usá-los nas entradas. data pertence ao sistema; stamina, length, color e duration são exemplos originais, não campos mágicos interpretados pelo host. O entry noop não cria documentos na ativação e não cria um catálogo duplicado a cada recarga.` : `List the archive with python -m zipfile -l ../system-library-source.zip to check manifest.json and compendiums/beacon.json. As owner open **Inside → Systems → Install system → Install from ZIP**, select it and click **Install**. Open a test campaign using **Beacon Expedition Library** as its system. Verify the exact active 1.0.0 release in its Extensions; installing a version does not automatically switch existing campaigns.

Open **Compendiums** and find **Beacon Expedition Library / Scouts**, **/ Equipment** and **/ Signals**. Read Harbor Scout: type is character and stamina is 8. Import through the native pack control. Repeat for Signal Rope (gear, length 12) and Blue Glow (spell, color blue). Imported actors/items appear in the campaign's directories.

## 4. Copy every complete file

To add original content edit JSON entries while preserving stable IDs. Add document types to the manifest before using them in entries. data belongs to the system: stamina, length, color and duration are example fields rather than host-interpreted rules. The no-op entry creates no campaign documents on activation and no duplicate catalogs on reload.`;
  const end = pt ? `## 5. Leia pela API e conceda leitura

No contexto de um módulo montado na mesma campanha, descubra IDs autorizados com api.compendiums.state. O pack terá ID native: gerado pelo host; não monte esse ID com o nome do arquivo. Esta função completa lê uma entrada de Scouts e retorna também os IDs para conceder leitura como GM:
` : `## 5. Read through the API and grant reading

In a module mounted in the same campaign discover authorized IDs with api.compendiums.state. Packs have host-generated native: IDs; do not construct IDs from filenames. This complete function reads a Scouts entry and returns IDs usable by a GM for granting reading:
`;
  const read = fence('javascript', `export async function inspectScout(api, signal) {
  const state = await api.compendiums.state({}, {signal});
  const pack = state.packs.find(row => row.name === "Beacon Expedition Library / Scouts");
  if (!pack) throw new Error("Activate the system version and check read grants");
  const entry = pack.entries.find(row => row.id === "harbor-scout");
  if (!entry) throw new Error("Scout entry unavailable");
  const body = await api.compendiums.read({packId: pack.id, id: entry.id}, {signal});
  return {packId: pack.id, entryId: entry.id, body};
}
export async function shareScouts(api, packId, signal) {
  return api.compendiums.setPermissions({packId, level: "read"}, {signal, requestId: crypto.randomUUID()});
}`);
  const final = pt ? `state retorna metadados; read retorna o documento original da coleção, sem exigir o envelope kind de uma entrada criada na mesa. Para várias entradas do mesmo pack, use read({packId, ids:[...]}) com 1 a 100 IDs únicos. Como GM, use o controle nativo de permissões ou shareScouts com o packId descoberto. O jogador com leitura vê o conteúdo, mas não importa. Antes de compartilhar, confira todo o corpo: conceder leitura ao compêndio autoriza seu conteúdo.

## 6. Valide e publique uma atualização imutável

Na primeira execução, confira os três packs e importe cada entrada. Reabra a campanha: há os mesmos packs e nenhum novo documento foi importado sozinho. Teste em outra campanha com sistema diferente: essas coleções não devem aparecer como conteúdo daquele sistema. Revogue a leitura do jogador e confira que nova leitura é negada; a UI não é a fronteira de autorização.

Para atualizar, mantenha id do pacote, caminhos, IDs de pack e entrada; mude version para 1.0.1 e edite o JSON original. Gere outro ZIP, instale e selecione explicitamente 1.0.1 na campanha. Não edite a pasta extraída instalada: o host verifica seus bytes aprovados e rejeita substituir a mesma versão por conteúdo diferente. Os IDs estáveis permitem preservar referências/concessões. Documentos que já foram importados continuam sendo cópias e não são reescritos pela atualização. Um novo import usa o novo conteúdo.

Tipo não registrado, systemId diferente, caminho ausente, JSON inválido, IDs repetidos ou pack não permitido impedem a instalação. A coleção aceita até 8 MiB, 64 packs e 20.000 entradas; cada entrada até 256 KiB e profundidade 24. O manifesto aceita até 16 caminhos de coleção. Conteúdo aprovado ausente/alterado, pacote revogado ou versão não ativa tornam a coleção indisponível. Não contorne isso carregando o JSON por assets: coleções declaradas são lidas pela API autorizada.

## Como usar a IA para acrescentar um catálogo ao seu sistema

> Parta de tutorial-system-compendiums no Gravewright 0.3.0. Troque apenas os dados originais por [tipos/campos autorizados]. Entregue manifesto, entry, arquivo físico da coleção e licença completos. Confira todos systemId e tipos, valide com o instalador/validate_collection, mostre instalação por Sistemas e ativação da versão exata. Teste os três packs, jogador com/sem leitura, imports e atualização 1.0.1 sem modificar cópias já criadas. Mantenha tudo em um único pacote e não exija outro host.` : `state returns metadata; read returns the collection's original document without requiring the kind envelope of a table-created entry. For a batch in the same pack use read({packId, ids:[...]}) with 1–100 unique IDs. As GM use native permission controls or shareScouts with the discovered packId. A reader may view but cannot import. Inspect full bodies before sharing: a compendium read grant authorizes its content.

## 6. Verify and publish an immutable update

Check all three packs and import every entry. Reopen: the same packs remain and no document imported itself. Test a campaign using a different system; these collections must not appear as that system's content. Revoke a player's read access and check that fresh reads fail; UI controls are not the authorization boundary.

For an update preserve the package ID, file paths and pack/entry IDs; change version to 1.0.1 and edit the original JSON. Build another ZIP, install and explicitly select 1.0.1 for the campaign. Do not edit the installed extracted directory: the host verifies approved bytes and rejects different content under the same version. Stable IDs preserve references/grants. Already imported documents remain copies and are not rewritten. A new import uses the new content.

Unregistered types, mismatched systemId, missing files, invalid JSON, duplicate IDs or forbidden pack types prevent installation. A collection allows up to 8 MiB, 64 packs and 20,000 entries; an entry up to 256 KiB and depth 24. A manifest allows up to 16 collection paths. Missing/changed approved bytes, revoked packages or inactive versions make collections unavailable. Do not bypass this with assets helpers: declared collections use the authorized API.

## How to use AI to add a catalog to your system

> Start from tutorial-system-compendiums on Gravewright 0.3.0. Replace only original data with [authorized types/fields]. Provide the complete manifest, entry, physical collection and license. Check every systemId/type, validate with the installer/validate_collection and show Systems installation with exact-version activation. Test all three packs, players with/without reading, imports and a 1.0.1 update preserving existing copies. Keep one system package and the requested host.`;
  return intro+'\n\n'+tree(p)+'\n'+downloadBody(p,pt)+'\n\n'+middle+zipBody(p)+'\n'+run+'\n\n'+filesBody(p)+'\n\n'+end+read+'\n'+final+'\n\n['+(pt?'Todos os tutoriais':'All tutorials')+'](docs:tutorial-index) · [API](docs:api)';
}

export const tutorialCompendiumArticles = tutorialCompendiumPackages.map(p => ({
  slug:p.slug, group:'tutorials', sourcePaths:['gravewright/modules/contracts/schemas/manifest.json','gravewright/modules/contracts/frontend.json','gravewright/compendiums/services.py','gravewright/compendiums/content.py','gravewright/compendiums/catalog.py','gravewright/journals/services.py','gravewright/journals/data.py'],
  en:{title:p.id==='campaign-library'?'How to create a compendium module':'How to include compendiums in a system', summary:'Build the complete package from an empty directory, install it and verify its original content.', body:p.id==='campaign-library'?moduleTutorial(p,false):systemTutorial(p,false)},
  pt:{title:p.id==='campaign-library'?'Como criar um módulo de compêndio':'Como incluir compêndios em um sistema', summary:'Monte o pacote completo a partir de pasta vazia, instale e confira seu conteúdo original.', body:p.id==='campaign-library'?moduleTutorial(p,true):systemTutorial(p,true)},
}));
