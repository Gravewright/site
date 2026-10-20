// Authored examples for the released browser contract. Generated packages are
// checked against this source; importing this file performs no filesystem writes.
const examples = [
  {
    surface:'actor.directory', name:['Readable actor counter','Contador de atores legíveis'],
    goal:['Count actors whose sheets the current member may open, and update after actor changes.','Conte atores cujas fichas o membro atual pode abrir e atualize após mudanças de atores.'],
    trigger:['Open the Actors directory.','Abra o diretório de Atores.'],
    context:['No document ID is needed: the mount is already bound to its table and member.','Nenhum ID de documento é necessário: a montagem já pertence à mesa e ao membro.'],
    verify:['Create an actor, revoke a player’s read access, and check that the count follows the authorized collection.','Crie um ator, revogue o acesso de leitura de um jogador e confira a contagem da coleção autorizada.'],
    event:'actors.changed', read:'api.actors.list({}, { signal })',
    render:'output.textContent = t("Readable actors: {count}", { count: value.filter(actor => actor.canOpen).length });',
    labels:{'Readable actors: {count}':'Atores legíveis: {count}'}
  },
  {
    surface:'actor.sheet', name:['Actor sheet revision inspector','Inspetor de revisão da ficha'],
    goal:['Read the real actor sheet and display its name, sheet revision and top-level data keys beneath the native sheet.','Leia a ficha real e mostre nome, revisão da ficha e chaves dos dados abaixo da ficha nativa.'],
    trigger:['Open an actor sheet.','Abra uma ficha de ator.'],
    context:['context.actorId selects the document; context.canEdit is a UI hint. The server checks read access.','context.actorId seleciona o documento; context.canEdit é uma indicação para a interface. O servidor verifica a leitura.'],
    verify:['Open actors from two types, save a native sheet change, and confirm the displayed sheetVersion changes. Try a read-only player.','Abra atores de dois tipos, salve uma alteração na ficha nativa e confira sheetVersion. Teste um jogador com acesso de leitura.'],
    event:'actors.changed', read:'api.actors.sheet(context.actorId, {}, { signal })',
    render:'output.textContent = `${value.name} · ${t("Sheet revision")}: ${value.sheetVersion} · ${t("Data keys")}: ${Object.keys(value.data ?? {}).sort().join(", ") || t("None")}`;',
    labels:{'Sheet revision':'Revisão da ficha','Data keys':'Chaves dos dados','None':'Nenhuma'}
  },
  {
    surface:'token.sheet', name:['Linked or independent token inspector','Inspetor de token vinculado ou independente'],
    goal:['Read the token’s own sheet context, so an independent snapshot is never replaced by actor data.','Leia a ficha no contexto do próprio token para não confundir um snapshot independente com dados do ator.'],
    trigger:['Open a token sheet in the current scene.','Abra a ficha de um token na cena atual.'],
    context:['context.actorId, tokenId and sceneId identify the mount. tokens.get uses the mounted scene; actors.sheet receives tokenId explicitly.','context.actorId, tokenId e sceneId identificam a montagem. tokens.get usa a cena da montagem; actors.sheet recebe tokenId explicitamente.'],
    verify:['Place one linked token and one independent token, edit their native sheets separately, and compare names, linkMode and revisions.','Coloque um token vinculado e outro independente, edite as fichas nativas separadamente e compare nomes, linkMode e revisões.'],
    event:'tokens.changed', read:'Promise.all([api.tokens.get(context.tokenId, {}, { signal }), api.actors.sheet(context.actorId, { tokenId: context.tokenId }, { signal })])',
    render:'const [token, sheet] = value; output.textContent = `${sheet.name} · ${t("Link mode")}: ${token.linkMode} · ${t("Sheet revision")}: ${sheet.sheetVersion}`;',
    labels:{'Link mode':'Modo de vínculo','Sheet revision':'Revisão da ficha'}
  },
  {
    surface:'item.directory', name:['Item counts by type','Contagem de itens por tipo'],
    goal:['Group readable items by their package-owned type, without assuming an RPG catalog.','Agrupe itens legíveis pelo tipo definido pelo pacote, sem presumir um catálogo de RPG.'],
    trigger:['Open the Items directory in a campaign with item types.','Abra Itens em uma campanha com tipos de item.'],
    context:['No item ID is needed. canOpen filters listing-only entries before their data is used.','Nenhum ID de item é necessário. canOpen filtra entradas que permitem apenas listagem antes de usar seus dados.'],
    verify:['Create two items of one type and one of another, then remove read access from one item and verify the groups.','Crie dois itens de um tipo e um de outro; retire a leitura de um item e confira os grupos.'],
    event:'items.changed', read:'api.items.list({}, { signal })',
    render:'const counts = new Map(); for (const item of value.filter(item => item.canOpen)) counts.set(item.type, (counts.get(item.type) ?? 0) + 1); output.textContent = [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([type, count]) => `${type}: ${count}`).join(" · ") || t("No readable items");',
    labels:{'No readable items':'Nenhum item legível'}
  },
  {
    surface:'item.sheet', name:['Item data inspector','Inspetor de dados do item'],
    goal:['Show the actual item name, type, version and system-owned data as safe JSON below its native editor.','Mostre nome, tipo, versão e dados reais do sistema como JSON seguro abaixo do editor nativo.'],
    trigger:['Open an item sheet.','Abra uma ficha de item.'],
    context:['context.itemId selects an item in the authorized collection. A listed item may still deny opening.','context.itemId seleciona um item da coleção autorizada. Um item listado ainda pode negar abertura.'],
    verify:['Save a native item edit and check the new version and data. Use a string containing HTML and confirm it is displayed as text.','Salve uma alteração nativa e confira versão e dados. Use uma string com HTML e confirme sua exibição como texto.'],
    event:'items.changed', read:'api.items.get(context.itemId, {}, { signal })',
    render:'if (!value.canOpen) throw Object.assign(new Error("permission_denied"), { code: "permission_denied" }); output.textContent = JSON.stringify({ name: value.name, type: value.type, version: value.version, data: value.data }, null, 2);',
    labels:{}
  },
  {
    surface:'scene.directory', name:['Scene broadcast status','Estado de transmissão das cenas'],
    goal:['Distinguish the scene broadcast to players from the scene the GM is navigating.','Diferencie a cena transmitida aos jogadores da cena em que o mestre está navegando.'],
    trigger:['Open the scene directory; as GM, navigate to a different scene without broadcasting it.','Abra o diretório de cenas; como mestre, navegue para outra cena sem transmiti-la.'],
    context:['The mount is table-scoped. maps.state projects only the scenes visible to this member.','A montagem pertence à mesa. maps.state projeta apenas cenas visíveis para o membro.'],
    verify:['With two GM scenes, compare activeMapId and navigatingMapId. A player should only see the authorized broadcast.','Com duas cenas do mestre, compare activeMapId e navigatingMapId. O jogador deve ver apenas a transmissão autorizada.'],
    event:'maps.changed', read:'api.maps.state({}, { signal })',
    render:'const name = id => value.maps.find(scene => scene.id === id)?.name ?? t("None"); output.textContent = `${t("Broadcast")}: ${name(value.activeMapId)} · ${t("Navigating")}: ${name(value.navigatingMapId)}`;',
    labels:{'Broadcast':'Transmissão','Navigating':'Navegação','None':'Nenhuma'}
  },
  {
    surface:'scene.controls', name:['Scene information control','Controle de informações da cena'],
    goal:['Add a working button that reads the mounted scene and opens its dimensions and grid in the native modal.','Adicione um botão funcional que leia a cena da montagem e mostre dimensões e grade no modal nativo.'],
    trigger:['Select a scene and click Scene information.','Selecione uma cena e clique em Informações da cena.'],
    context:['The mount supplies sceneId, width, height and grid. maps.get verifies the visible scene name; it never changes selection.','A montagem fornece sceneId, width, height e grid. maps.get verifica o nome da cena visível; não muda a seleção.'],
    verify:['Pan, zoom and switch scenes. Open and close the modal with keyboard controls, then deactivate while it is open.','Mova, amplie e troque a cena. Abra e feche o modal pelo teclado e desative o módulo enquanto ele estiver aberto.'],
    special:'controls', labels:{'Scene information':'Informações da cena','Close':'Fechar','Grid':'Grade'}
  },
  {
    surface:'scene.overlay', name:['Scene center marker','Marcador do centro da cena'],
    goal:['Mark the scene center and keep its position correct under pan and zoom without capturing pointer input.','Marque o centro da cena e mantenha a posição correta ao mover e ampliar, sem capturar o ponteiro.'],
    trigger:['Select a scene, then pan and zoom.','Selecione uma cena, mova e amplie a visão.'],
    context:['Coordinates are logical scene pixels. viewport.sceneToViewport returns CSS pixels inside the clipped viewport; the inverse verifies the conversion.','As coordenadas são pixels lógicos da cena. viewport.sceneToViewport retorna pixels CSS na área recortada; a inversa verifica a conversão.'],
    verify:['Use a scene with unequal width/height; pan and zoom with a high-DPI display and check that the marker remains at its center. Switch scenes and verify the old marker disappears.','Use uma cena com largura e altura diferentes; mova e amplie em tela de alta densidade e confira o centro. Troque a cena e confira a remoção do marcador antigo.'],
    special:'overlay', labels:{'Scene center':'Centro da cena'}
  },
  {
    surface:'chat.log', name:['Visible chat statistics','Estatísticas do chat visível'],
    goal:['Count only the messages returned by the authorized history and report their visible authors.','Conte apenas mensagens retornadas pelo histórico autorizado e informe seus autores visíveis.'],
    trigger:['Open the chat and send a message using the native composer.','Abra o chat e envie uma mensagem pelo compositor nativo.'],
    context:['The chat mount is table-scoped. This example summarizes the returned history, not all messages ever sent. Private messages remain server-filtered.','A montagem do chat pertence à mesa. O exemplo resume o histórico retornado, não todas as mensagens já enviadas. Mensagens privadas continuam filtradas pelo servidor.'],
    verify:['Send a public message and a whisper to another player. Compare the counts from recipient and nonrecipient accounts; delete a visible message and refresh.','Envie uma mensagem pública e um sussurro a outro jogador. Compare destinatário e não destinatário; apague uma mensagem visível e atualize.'],
    event:'chat.changed', extraEvent:'chat.message', read:'api.chat.history({}, { signal })',
    render:'output.textContent = t("Visible messages: {count}; authors: {authors}", { count: value.length, authors: new Set(value.map(message => message.from.id ?? message.from.name)).size });',
    labels:{'Visible messages: {count}; authors: {authors}':'Mensagens visíveis: {count}; autores: {authors}'}
  },
  {
    surface:'combat.tracker', name:['Current turn summary','Resumo do turno atual'],
    goal:['Show encounter activity, round and the current visible combatant, without implementing initiative rules.','Mostre atividade do encontro, rodada e combatente atual visível, sem implementar regras de iniciativa.'],
    trigger:['Select a scene and open the native combat tracker.','Selecione uma cena e abra o rastreador de combate nativo.'],
    context:['The mount supplies sceneId. combat.state reads that scene; its combatants are already permission-filtered.','A montagem fornece sceneId. combat.state lê essa cena e seus combatentes já vêm filtrados por permissão.'],
    verify:['Add combatants, start combat and advance a turn with native controls. Compare player and GM views when a combatant is hidden.','Adicione combatentes, inicie e avance o turno pelos controles nativos. Compare jogador e mestre com um combatente oculto.'],
    event:'combat.changed', read:'api.combat.state({}, { signal })',
    render:'output.textContent = `${t(value.active ? "Active" : "Stopped")} · ${t("Round")}: ${value.round} · ${t("Current")}: ${value.combatants.find(entry => entry.is_current)?.name || t("None")}`;',
    labels:{'Active':'Ativo','Stopped':'Parado','Round':'Rodada','Current':'Atual','None':'Nenhum'}
  },
  {
    surface:'journal.sheet', name:['Journal outline','Estrutura do diário'],
    goal:['Show the journal title, type and only the section titles in its authorized projection.','Mostre título, tipo e apenas títulos das seções na projeção autorizada do diário.'],
    trigger:['Open a journal with visible and GM-only sections.','Abra um diário com seções visíveis e exclusivas do mestre.'],
    context:['context.journalId identifies the open document. journals.get returns server-filtered sections; listing-only entries do not expose content.','context.journalId identifica o documento aberto. journals.get retorna seções filtradas pelo servidor; entradas só de listagem não expõem conteúdo.'],
    verify:['Compare GM and player accounts, including a private section. Rename a visible section and refresh. Test an empty journal and a quest document.','Compare mestre e jogador, incluindo uma seção privada. Renomeie uma seção visível e atualize. Teste diário vazio e documento de missão.'],
    event:'journals.changed', read:'api.journals.get(context.journalId, {}, { signal })',
    render:'if (!value.can_open) throw Object.assign(new Error("permission_denied"), { code: "permission_denied" }); output.textContent = `${value.title} (${value.type})\\n${(value.sections ?? []).map(section => section.title).join("\\n") || t("No visible sections")}`;',
    labels:{'No visible sections':'Nenhuma seção visível'}
  },
  {
    surface:'preferences', name:['Persistent personal density preference','Preferência pessoal persistente de densidade'],
    goal:['Save a personal compact/comfortable preference with compare-and-swap revisions, and make a concurrent conflict visible.','Salve uma preferência pessoal compacta/confortável com revisão compare-and-swap e mostre conflitos entre abas.'],
    trigger:['Open table preferences, choose a density and click Save.','Abra as preferências da mesa, escolha uma densidade e clique em Salvar.'],
    context:['storage.user is scoped to this module, table and signed-in user. It requires no GM role and survives module deactivation. The setting controls this example panel only.','storage.user pertence a módulo, mesa e usuário autenticado. Não exige mestre e sobrevive à desativação. A opção controla apenas o painel deste exemplo.'],
    verify:['Save, close and reopen. Use two tabs: save in the first and then in the stale second tab. The second must reload the latest value and ask for another explicit Save.','Salve, feche e reabra. Em duas abas, salve na primeira e depois na segunda desatualizada. A segunda deve recarregar o valor mais recente e exigir novo Salvar explícito.'],
    special:'preferences', labels:{'Density':'Densidade','Comfortable':'Confortável','Compact':'Compacta','Save':'Salvar','Saved':'Salvo','Conflict: latest value reloaded. Choose again and save.':'Conflito: valor recente recarregado. Escolha novamente e salve.'}
  },
  {
    surface:'table.interface', name:['Authorized document search','Busca de documentos autorizados'],
    goal:['Search table documents from a workspace panel and render their names, kinds and snippets as text.','Busque documentos da mesa em um painel e mostre nomes, kinds e trechos como texto.'],
    trigger:['Open the table workspace, type a query and submit Search.','Abra a mesa, digite uma consulta e envie Buscar.'],
    context:['The module-scoped api.table.search rechecks membership and access. The example only displays results; it does not invent document-opening APIs.','api.table.search do módulo verifica novamente vínculo e acesso. O exemplo apenas exibe resultados; não inventa APIs de abertura de documento.'],
    verify:['Search the same term as GM and as player; hidden documents must not appear. Submit quickly twice and check that the latest search wins.','Busque o mesmo termo como mestre e jogador; documentos ocultos não devem aparecer. Envie duas buscas rápidas e confira que prevalece a mais recente.'],
    special:'search', labels:{'Search':'Buscar','Search documents':'Buscar documentos','No results':'Nenhum resultado'}
  }
];

const styles = `.gw-example { box-sizing: border-box; max-width: 640px; padding: var(--space-3); margin: var(--space-2); border: 1px solid var(--border); border-radius: var(--radius-md); color: var(--text); background: var(--surface); font: 14px/1.5 system-ui, sans-serif; }
.gw-example h3 { font-size: 16px; margin: var(--space-0) var(--space-0) var(--space-2); }
.gw-example pre { white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }
.gw-example button, .gw-example select, .gw-example input { color: inherit; background: var(--surface); font: inherit; padding: var(--space-1) var(--space-2); margin: var(--space-1); border: 1px solid var(--border); border-radius: var(--radius-sm); }
.gw-example button:focus-visible, .gw-example input:focus-visible, .gw-example select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.gw-example--compact { padding: var(--space-1); }
.gw-example-center { position: absolute; transform: translate(-50%, -50%); pointer-events: none; color: var(--text); background: var(--surface); padding: var(--space-1); border-radius: var(--radius-sm); font: 14px/1.5 system-ui, sans-serif; }
`;

function stylesFor(example) {
  if (example.surface !== 'table.interface') return styles;
  const scope = '[data-module-id="example.surface-table-interface"]';
  // The workspace stage is absolutely positioned. Keep this intentional panel
  // above table chrome (7–15) and below host windows/modals (--z-modal: 1000).
  return styles.replaceAll('.gw-example', `${scope} .gw-example`) +
    `${scope} > .gw-example { position: fixed; top: 64px; left: var(--space-4); width: 360px; max-width: min(360px, calc(100vw - 32px)); max-height: 40vh; overflow: auto; margin: var(--space-0); z-index: 20; }\n`;
}

const specialMounts = {
  controls: `    const button = el("button", t("Scene information"));
    button.type = "button";
    panel.append(button);
    let modal;
    onDispose(() => modal?.close(true));
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        const scene = await api.maps.get(context.sceneId, {}, { signal });
        if (signal.aborted) return;
        modal?.close(true);
        const section = el("section");
        section.className = "gw-example";
        section.setAttribute("aria-label", t("Scene information"));
        section.append(el("h3", scene.name), el("p", context.width + " × " + context.height + " · " + t("Grid") + ": " + context.grid.size + "px / " + context.grid.distance + " " + context.grid.unit));
        const close = el("button", t("Close"));
        close.type = "button";
        close.addEventListener("click", () => section.close(), { signal });
        section.append(close);
        modal = api.ui.openModal(section);
      } catch (error) { report(error); }
      finally { if (!signal.aborted) button.disabled = false; }
    }, { signal });`,
  overlay: `    panel.remove();
    const marker = el("span", t("Scene center"));
    marker.className = "gw-example-center";
    root.append(marker);
    onDispose(() => marker.remove());
    const center = { x: context.width / 2, y: context.height / 2 };
    const position = () => {
      if (signal.aborted) return;
      const point = viewport.sceneToViewport(center);
      const inverse = viewport.viewportToScene(point);
      if (Math.abs(inverse.x - center.x) > 0.01 || Math.abs(inverse.y - center.y) > 0.01) throw new Error("Invalid viewport transform");
      marker.style.left = point.x + "px";
      marker.style.top = point.y + "px";
    };
    position();
    onDispose(events.on("scene.viewport.changed", position));`,
  preferences: `    const label = el("label", t("Density"));
    const select = el("select");
    for (const [value, title] of [["comfortable", "Comfortable"], ["compact", "Compact"]]) {
      const option = el("option", t(title)); option.value = value; select.append(option);
    }
    label.append(select);
    const save = el("button", t("Save")); save.type = "button";
    save.disabled = true;
    panel.append(label, save);
    let previous = null, ready = false;
    const apply = record => {
      if (record && (!record.value || record.value.version !== 1 || !["comfortable", "compact"].includes(record.value.density))) {
        throw Object.assign(new Error("Unsupported preference data"), { code: "invalid_data" });
      }
      previous = record;
      const density = record?.value.density ?? "comfortable";
      select.value = density;
      panel.classList.toggle("gw-example--compact", density === "compact");
    };
    try { const record = await storage.user.get("density"); if (!signal.aborted) { apply(record); ready = true; save.disabled = false; } }
    catch (error) { report(error); }
    save.addEventListener("click", async () => {
      save.disabled = true;
      try {
        const saved = await storage.user.set("density", { version: 1, density: select.value }, { expectedRevision: previous?.revision ?? null });
        if (!signal.aborted) { apply(saved); output.textContent = t("Saved"); }
      } catch (error) {
        if (error.code === "conflict") {
          try { const latest = await storage.user.get("density"); if (!signal.aborted) { apply(latest); output.textContent = t("Conflict: latest value reloaded. Choose again and save."); } }
          catch (refreshError) { ready = false; report(refreshError); return; }
        } else report(error);
      } finally { if (!signal.aborted) save.disabled = !ready; }
    }, { signal });`,
  search: `    const form = el("form");
    const label = el("label", t("Search documents"));
    const input = el("input"); input.type = "search"; input.maxLength = 200;
    const submit = el("button", t("Search")); submit.type = "submit";
    label.append(input); form.append(label, submit); panel.append(form);
    let ticket = 0;
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const current = ++ticket;
      try {
        const value = await api.table.search(input.value.trim(), { signal });
        if (signal.aborted || current !== ticket) return;
        output.textContent = value.map(result => result.title + " (" + result.kind + ") · " + (result.snippet ?? "")).join("\\n") || t("No results");
      } catch (error) { if (current === ticket) report(error); }
    }, { signal });`
};

// Keep package source visible in the articles and independently downloadable.
function source(example) {
  const en = Object.fromEntries(Object.keys(example.labels).map(key => [key,key]));
  const catalogs = {en, 'pt-BR':example.labels};
  for (const [key, pt] of Object.entries({'Refresh':'Atualizar','Loading…':'Carregando…','Error: {code}':'Erro: {code}',[example.name[0]]:example.name[1]})) {
    catalogs.en[key] = key; catalogs['pt-BR'][key] = pt;
  }
  const generic = `    let ticket = 0;
    const refresh = async () => {
      const current = ++ticket;
      try {
        const value = await ${example.read};
        if (signal.aborted || current !== ticket) return;
        ${example.render}
      } catch (error) { if (current === ticket) report(error); }
    };
    const refreshButton = el("button", t("Refresh")); refreshButton.type = "button";
    panel.append(refreshButton);
    refreshButton.addEventListener("click", () => void refresh(), { signal });
    onDispose(api.events.on(${JSON.stringify(example.event)}, () => void refresh()));
    ${example.extraEvent ? `onDispose(api.events.on(${JSON.stringify(example.extraEvent)}, () => void refresh()));` : ''}
    await refresh();`;
  return `// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register(${JSON.stringify(catalogs, null, 2).replace(/\n/g,'\n    ')});
  },
  register({ register }) {
    register(${JSON.stringify(example.surface)}, { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t(${JSON.stringify(example.name[0])}));
    const output = el("pre"); output.setAttribute("role", "status");
    panel.append(heading, output); root.append(panel);
    onDispose(() => panel.remove());
    const report = error => {
      if (!signal.aborted) output.textContent = t("Error: {code}", { code: error.code ?? "unavailable" });
    };
${example.special ? specialMounts[example.special] : generic}
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
`.replace(/[\t ]+$/gm,'');
}

export const surfaceExamplePackages = examples.map(example => ({
  ...example,
  directory:example.surface.replaceAll('.','-'),
  files:{
    'manifest.json':JSON.stringify({id:`example.surface-${example.surface.replaceAll('.','-')}`,name:example.name[0],version:'1.0.0',sdk:{requires:'>=1.0.0 <2.0.0',tested:'1.0.0'},description:example.goal[0],author:'Gravewright documentation',license:'MIT',entry:'main.mjs'},null,2)+'\n',
    'main.mjs':source(example),
    'styles.css':stylesFor(example),
    'LICENSE.txt':'MIT License\n\nCopyright (c) 2026 Gravewright contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n'
  }
}));

function article(example, language) {
  const pt = language === 'pt'; const index = pt ? 1 : 0;
  const heading = (en, br) => pt ? br : en;
  const download = file => `../../assets/examples/surfaces/${example.directory}/${file}`;
  const packageTree = `${example.directory}/\n  manifest.json\n  main.mjs\n  styles.css\n  LICENSE.txt`;
  const body = [
    `## ${heading('What you will build','O que você vai construir')}`,
    example.goal[index],
    `**${heading('Surface','Superfície')}:** \`${example.surface}\` · **${heading('Mode','Modo')}:** \`augment\` · Gravewright 0.3.0 / SDK 1.x.`,
    `## ${heading('When it mounts and who can use it','Quando monta e quem pode usar')}`,
    example.trigger[index]+' '+example.context[index],
    pt ? 'O dono instala o ZIP local em **Módulos → Instalar módulo → Instalar por ZIP**. Depois, o mestre ativa a versão na lista de extensões da mesa. O exemplo não pede permissões adicionais nem obtém um handle global; todas as leituras usam o `api` fornecido pela montagem. Mestre e jogador recebem somente os dados autorizados pelo servidor. Streamers não recebem esta montagem autenticada.' : 'The owner installs the local ZIP under **Modules → Install module → Install from ZIP**. The GM then activates the exact version in the table extension list. This example requests no extra permissions or global handle; all reads use the mount’s supplied `api`. GMs and players receive only server-authorized data. Streamers do not receive this authenticated mount.',
    `## ${heading('Download the complete package','Baixe o pacote completo')}`,
    `[${heading('Download source ZIP','Baixar ZIP dos fontes')}](${download(example.directory+'-source.zip')}) · `+['manifest.json','main.mjs','styles.css','LICENSE.txt'].map(file=>`[${file}](${download(file)})`).join(' · '),
    pt ? 'Salve os quatro arquivos na mesma pasta. Compacte **o conteúdo da pasta**, com `manifest.json` diretamente na raiz do ZIP. Não inclua uma pasta extra, estado local ou chaves privadas. O upload local é uma decisão de confiança do dono; para distribuição por catálogo, use o fluxo de assinatura da [referência de módulos](docs:modules).' : 'Save all four files in the same folder. ZIP **the folder contents**, with `manifest.json` directly at the archive root. Do not include a wrapper folder, local state or private keys. Local upload is the owner’s trust decision; for catalog distribution, use the signing workflow in the [module reference](docs:modules).',
    '```text\n'+packageTree+'\n```',
    `### manifest.json`, '```json\n'+example.files['manifest.json'].trimEnd()+'\n```',
    `### main.mjs`, '```javascript\n'+example.files['main.mjs'].trimEnd()+'\n```',
    `### styles.css`, '```css\n'+example.files['styles.css'].trimEnd()+'\n```',
    `## ${heading('Expected result and cleanup','Resultado esperado e liberação')}`,
    example.goal[index],
    pt ? 'A interface nativa continua funcionando. Fechar a ficha, trocar a cena, sair da mesa ou desativar o módulo aborta a montagem. Os listeners usam `signal`; os eventos e elementos próprios são liberados por `onDispose`. A leitura assíncrona verifica o aborto e descarta respostas antigas antes de desenhar. Erros autorizados aparecem por `error.code`, sem esconder falhas de rede.' : 'The native interface remains usable. Closing a sheet, switching scenes, leaving the table or deactivating the module aborts the mount. Listeners use `signal`; events and owned elements are released through `onDispose`. Async reads check cancellation and discard old responses before rendering. Errors are displayed through `error.code`, including network failures.',
    example.special === 'preferences' ? (pt ? 'A gravação usa a revisão lida por `get`. Em `conflict`, o exemplo recarrega o valor do servidor e não repete a escrita automaticamente. A preferência tem formato próprio versionado `{version: 1, density}` e altera somente o painel do exemplo, sem prometer controlar a densidade do host.' : 'Writes use the revision read by `get`. On `conflict`, the example reloads server state and never retries the write automatically. The preference owns a versioned `{version: 1, density}` shape and changes only the example panel, without claiming to control host density.') : '',
    example.special === 'overlay' ? (pt ? 'O marcador usa `viewport.sceneToViewport({x,y})` e confere a inversa com `viewport.viewportToScene`. `events.on("scene.viewport.changed", ...)` reposiciona após pan/zoom. Não multiplique por devicePixelRatio: a saída já está em pixels CSS. O marcador preserva `pointer-events: none`.' : 'The marker uses `viewport.sceneToViewport({x,y})` and checks the inverse with `viewport.viewportToScene`. `events.on("scene.viewport.changed", ...)` repositions after pan/zoom. Do not multiply by devicePixelRatio: the output is already CSS pixels. The marker preserves `pointer-events: none`.') : '',
    example.special === 'search' ? (pt ? 'O painel de busca flutua abaixo da barra superior, limitado à largura da janela e a 40% de sua altura, com rolagem própria. Seu `z-index: 20` fica acima dos controles da mesa e abaixo de janelas e modais. Todos os seletores deste pacote usam `data-module-id`, preservando os estilos do host e de outros módulos.' : 'The search panel floats below the top bar, constrained to the viewport width and 40% of its height, with its own scrolling. Its `z-index: 20` is above table controls and below windows and modals. Every selector in this package uses `data-module-id`, preserving host and other module styles.') : '',
    `## ${heading('Validate on a disposable table','Valide em uma mesa descartável')}`,
    `1. ${example.verify[index]}\n2. ${heading('Open/close three times, then deactivate while a read or modal is pending. Check that no old panel or error appears after disposal.','Abra/feche três vezes e desative durante uma leitura ou modal pendente. Confira que nenhum painel ou erro antigo reaparece após o encerramento.')}\n3. ${heading('Test empty state, long document names, keyboard navigation and a narrow viewport. Compare GM and player accounts.','Teste estado vazio, nomes longos, teclado e janela estreita. Compare contas de mestre e jogador.')}\n4. ${heading('Check the browser console. These source examples have runtime contract tests; installation and visual behavior still require validation on the target host.','Confira o console. Estes exemplos têm testes do contrato de runtime; instalação e aparência ainda precisam ser validadas no host alvo.')}`,
    `## ${heading('How to use AI for this surface','Como usar a IA para esta superfície')}`,
    '```text\n'+(pt ? `Adapte o exemplo ${example.surface} para [objetivo concreto] no Gravewright 0.3.0.\nLeia registry.json, o schema de contexto desta superfície, frontend.json e os serviços nativos usados.\nPreserve start/register/stop, api da montagem, signal, onDispose e os modais nativos.\nMostre manifesto e arquivos completos. Não use app.shell/inside.content em pacotes.\nNão invente campos de payload, regras de RPG no core, permissões ou APIs.\nTeste jogador/mestre, dados vazios, aborto, montagem repetida e o comportamento específico do exemplo.\nExplique limitações e o que foi realmente executado.` : `Adapt the ${example.surface} example for [concrete goal] on Gravewright 0.3.0.\nRead registry.json, this surface’s context schema, frontend.json and the native services used.\nKeep start/register/stop, mount-scoped api, signal, onDispose and native modals.\nProvide the complete manifest and files. Do not use app.shell/inside.content in packages.\nDo not invent payload fields, core RPG rules, permissions or APIs.\nTest player/GM, empty data, abort, repeated mounting and this example’s behavior.\nExplain limitations and which checks actually ran.`)+'\n```',
    `## ${heading('Continue','Continue')}`,
    '[SDK](docs:modules) · [API](docs:api) · '+(pt ? '[Exemplos por kind](docs:examples-index)' : '[Examples by kind](docs:examples-index)')
  ].filter(Boolean).join('\n\n');
  return {title:`${example.surface}: ${example.name[index]}`,summary:example.goal[index],body};
}

export const surfaceExampleArticles = surfaceExamplePackages.map(example=>({
  slug:`example-surface-${example.directory}`, group:'examples',
  sourcePaths:['docs/en/modules.md','docs/pt-BR/modules.md','gravewright/modules/contracts/registry.json',`gravewright/modules/contracts/schemas/${example.surface}.context.json`,'gravewright/modules/contracts/frontend.json','gravewright/modules/static/gravewright_modules/domain-api.js','gravewright/modules/static/gravewright_modules/module-runtime.js'],
  en:article(example,'en'), pt:article(example,'pt')
}));
