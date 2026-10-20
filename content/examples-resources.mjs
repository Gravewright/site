// Original, contract-based examples. The site renders these snippets; it never executes them.
const fence = (language, code) => '\n```' + language + '\n' + code.trim() + '\n```\n';
const copyablePrompts = markdown => markdown.replace(/^> (.+)$/gm, (_, prompt) => fence('text', prompt.replace(/\*\*/g, '')));
const json = value => fence('json', JSON.stringify(value, null, 2));

export const resourceSearchExamples = [
  { kind: '', fn: 'findAll', query: 'Beacon', en: 'All document kinds', pt: 'Todos os tipos de documento' },
  { kind: 'actor', fn: 'findActors', query: 'Beacon Scout', en: 'Actors', pt: 'Atores' },
  { kind: 'item', fn: 'findItems', query: 'Beacon Rope', en: 'Items', pt: 'Itens' },
  { kind: 'journal', fn: 'findJournals', query: 'Beacon Notes', en: 'Journals', pt: 'Diários' },
  { kind: 'quest', fn: 'findQuests', query: 'Beacon Rescue', en: 'Quests', pt: 'Missões' },
  { kind: 'quest_board', fn: 'findQuestBoards', query: 'Beacon Jobs', en: 'Quest boards', pt: 'Quadros de missões' },
  { kind: 'scene', fn: 'findScenes', query: 'Beacon Harbor', en: 'Scenes', pt: 'Cenas' },
  { kind: 'compendium', fn: 'findCompendiums', query: 'Beacon Collection', en: 'Compendiums', pt: 'Compêndios' },
];

export const resourceImageExamples = [
  { kind: 'portrait', fn: 'mountPortraitUpload', en: 'Upload a portrait', pt: 'Enviar um retrato' },
  { kind: 'token', fn: 'mountTokenUpload', en: 'Upload token artwork', pt: 'Enviar a imagem do token' },
];

export const resourceCompendiumKinds = [
  { kind: 'actor', fn: 'storeActor', en: 'Actor snapshot', pt: 'Cópia de ator', source: 'Beacon Scout', packType: 'actor_pack' },
  { kind: 'item', fn: 'storeItem', en: 'Item snapshot', pt: 'Cópia de item', source: 'Beacon Rope', packType: 'item_pack' },
  { kind: 'journal', fn: 'storeJournal', en: 'Journal snapshot', pt: 'Cópia de diário', source: 'Beacon Notes', packType: 'journal_pack' },
  { kind: 'scene', fn: 'storeScene', en: 'Scene snapshot', pt: 'Cópia de cena', source: 'Beacon Harbor', packType: 'scene_pack' },
  { kind: 'deck', fn: 'storeDeck', en: 'Deck snapshot', pt: 'Cópia de baralho', source: 'Beacon Signals', packType: 'deck_pack' },
];

const entry = (id, name, type, data) => ({ id, name, type, systemId: 'example.beacon', data });
export const installedCompendiumCollection = {
  name: 'Beacon Examples',
  packs: [
    { id: 'beacon-actors', label: 'Beacon Actors', type: 'actor_pack', entries: [entry('beacon-scout', 'Beacon Scout', 'character', { stamina: 6 })] },
    { id: 'beacon-items', label: 'Beacon Items', type: 'item_pack', entries: [entry('beacon-rope', 'Beacon Rope', 'gear', { length: 10 })] },
    { id: 'beacon-spells', label: 'Beacon Spells', type: 'spell_pack', entries: [entry('beacon-glow', 'Beacon Glow', 'spell', { color: 'blue' })] },
  ],
};

export const resourceSystemManifest = {
  id: 'example.beacon', name: 'Beacon Example System', version: '1.0.0',
  sdk: { requires: '>=1.0.0 <2.0.0', tested: '1.0.0' },
  entry: 'main.js', description: 'Original example document types and compendium data.',
  author: 'Example author', license: 'MIT',
  system: {
    actorTypes: [{ id: 'character', label: 'Character' }],
    itemTypes: [{ id: 'gear', label: 'Gear' }, { id: 'spell', label: 'Spell' }],
  },
  content: { compendiums: ['compendiums/beacon.json'] },
};

export const localCompendiumCollection = {
  name: 'Beacon Local Examples', systemId: 'example.beacon',
  campaigns: ['00000000-0000-4000-8000-000000000001'],
  packs: [
    ...structuredClone(installedCompendiumCollection.packs),
    { id: 'beacon-journals', label: 'Beacon Journals', type: 'journal_pack', entries: [entry('beacon-notes', 'Beacon Notes', 'diary', {})] },
    { id: 'beacon-scenes', label: 'Beacon Scenes', type: 'scene_pack', entries: [entry('beacon-harbor', 'Beacon Harbor', 'scene', { width: 1400, height: 980 })] },
    { id: 'beacon-cards', label: 'Beacon Cards', type: 'card_pack', entries: [entry('beacon-card-deck', 'Beacon Signals', 'deck', { cards: [{ name: 'Beacon Signal', artwork: 'artwork/beacon.webp', quantity: 1 }] })] },
    { id: 'beacon-decks', label: 'Beacon Decks', type: 'deck_pack', entries: [entry('beacon-deck', 'Beacon Watch', 'deck', { cards: [{ name: 'Beacon Watch', artwork: 'artwork/beacon.webp', quantity: 2 }] })] },
  ],
};

const sourcePaths = {
  search: ['gravewright/table/services.py', 'gravewright/modules/static/gravewright_modules/domain-api.js', 'gravewright/table/tests/test_command_search.py'],
  image: ['gravewright/modules/contracts/schemas/actor.image.upload.input.json', 'gravewright/modules/contracts/schemas/actor.image.upload.output.json', 'gravewright/modules/static/gravewright_modules/browser-bridge.js', 'gravewright/actors/views.py'],
  entries: ['gravewright/compendiums/services.py', 'gravewright/modules/contracts/frontend.json', 'gravewright/compendiums/test_batch_read.py'],
  packs: ['gravewright/compendiums/content.py', 'gravewright/compendiums/catalog.py', 'gravewright/modules/contracts/schemas/manifest.json', 'gravewright/compendiums/test_installed_packages.py'],
};

export function searchExampleCode(example) {
  return `export async function ${example.fn}(api, signal) {
  return api.table.search(${JSON.stringify(example.query)}, {
    kind: ${JSON.stringify(example.kind)},
    signal,
  });
}`;
}

function searchBody(lang) {
  const pt = lang === 'pt';
  const intro = pt
    ? `# Busca: um exemplo para cada \`kind\`

Use o \`api\` recebido por um bloco montado do módulo. Estas funções são trechos completos de JavaScript; importe uma delas em seu \`main.js\` e chame dentro de \`mount({ api, signal })\`. O exemplo de pacote mínimo está em [Sistemas e módulos](modules.html).

Como GM, crie documentos sintéticos com os nomes abaixo numa campanha descartável e conceda leitura ao jogador quando quiser testar visibilidade. A busca precisa estar habilitada no host. Cada consulta usa pelo menos dois caracteres. O filtro vazio pesquisa todas as categorias; omitir \`kind\` tem o mesmo efeito.

\`kind\` identifica a categoria do resultado. Missões e quadros continuam sendo documentos de diário: seu \`type\` no resultado é \`journal\`, enquanto o \`kind\` é \`quest\` ou \`quest_board\`. O filtro \`journal\` retorna os demais diários, não as missões e os quadros.`
    : `# Search: an example for every \`kind\`

Use the \`api\` supplied to a mounted module block. These are complete JavaScript functions; import one into \`main.js\` and call it inside \`mount({ api, signal })\`. See the [minimal package](modules.html#minimal-browser-package) for installation and lifecycle.

As GM, create synthetic documents with the names below in a disposable campaign. Grant a player read access when testing visibility. Command search must be enabled on the host. Every query has at least two characters. An empty filter searches all categories; omitting \`kind\` has the same effect.

\`kind\` describes the result category. Quests and boards remain journal documents: their result \`type\` is \`journal\`, while \`kind\` is \`quest\` or \`quest_board\`. The \`journal\` filter returns other journals, excluding quests and quest boards.`;
  const cases = resourceSearchExamples.map(example => {
    const category = example.kind || (pt ? 'vazio' : 'empty');
    const result = example.kind
      ? (pt ? `Documentos legíveis com \`kind: "${example.kind}"\` que correspondam a **${example.query}**.` : `Readable documents with \`kind: "${example.kind}"\` matching **${example.query}**.`)
      : (pt ? 'Até 20 documentos legíveis de qualquer categoria que correspondam a **Beacon**, ordenados por título.' : 'Up to 20 readable documents of any category matching **Beacon**, sorted by title.');
    return `## \`kind: ${JSON.stringify(example.kind)}\` — ${example[lang]}\n\n` +
      (pt ? `Pré-requisito: ${example.kind ? `crie **${example.query}** na categoria ${category}.` : 'crie ao menos dois documentos Beacon em categorias diferentes.'}` : `Prerequisite: ${example.kind ? `create **${example.query}** in the ${category} category.` : 'create at least two Beacon documents in different categories.'}`) +
      fence('javascript', searchExampleCode(example)) +
      (pt ? `**Resultado esperado:** ${result}\n\n**Valide:** execute \`${example.fn}(api, signal)\` como GM e jogador; remova a leitura de um documento e repita. A ausência de resultados é um array vazio, não um erro.` : `**Expected result:** ${result}\n\n**Validate:** run \`${example.fn}(api, signal)\` as GM and player; revoke access to one document and repeat. No matches returns an empty array, not an error.`);
  }).join('\n\n');
  const end = pt ? `## Resultados recentes e erros

Para recentes, use consulta vazia e até 12 referências previamente retornadas pela busca. Use \`type: "journal"\` para missão/quadro; não coloque \`quest\` em \`recent.type\`. O servidor verifica novamente campanha e leitura a cada chamada.` : `## Recent results and errors

For recents, use an empty query and up to 12 references previously returned by search. Use \`type: "journal"\` for a quest/board; \`quest\` is not a valid \`recent.type\`. Every call revalidates campaign and read access.`;
  const recent = fence('javascript', `export async function recentDocuments(api, previousResults, signal) {
  const recent = previousResults.slice(0, 12).map(({ id, type }) => ({ id, type }));
  return api.table.search("", { recent, signal });
}`);
  const notes = pt ? `Uma consulta de menos de dois caracteres sem \`recent\` retorna \`[]\`. Mais de 200 caracteres, filtro desconhecido ou referência inválida são entradas rejeitadas. Busca desabilitada ou vínculo revogado impedem a chamada; o adaptador expõe códigos como \`permission_denied\` e \`invalid_data\`. \`cancelled\`/\`stale_context\` indicam cancelamento ou fechamento do bloco. Não use a lista de resultados como cache de permissões.

## Como usar a IA para criar uma busca por tipo

> Na release alvo, confira table/services.py e domain-api.js. Adapte o exemplo de kind **quest_board** para um seletor de quadros legíveis. Mostre título com textContent, use signal do bloco e trate resultados vazios, permissões revogadas e cancelamento. Não invente api.quests nem exponha notas privadas. Entregue um teste de GM/jogador com dados Beacon.` : `A query shorter than two characters without \`recent\` returns \`[]\`. More than 200 characters, unknown filters and invalid references are rejected. Disabled search or revoked membership prevents the call; the adapter exposes codes such as \`permission_denied\` and \`invalid_data\`. \`cancelled\`/\`stale_context\` indicate cancellation or a disposed block. Do not cache permissions from search results.

## How to use AI to build a typed search

> On the target release, inspect table/services.py and domain-api.js. Adapt the **quest_board** example into a readable-board picker. Render titles with textContent, use the block signal and handle empty results, revoked permissions and cancellation. Do not invent api.quests or expose private notes. Include a GM/player check using Beacon fixtures.`;
  return intro + '\n\n' + cases + '\n\n' + end + recent + '\n' + notes;
}

export function imageExampleCode(example, lang = 'en') {
  const pt = lang === 'pt';
  return `export function ${example.fn}({ root, context, host, signal }) {
  const doc = root.ownerDocument;
  const label = doc.createElement("label");
  label.textContent = ${JSON.stringify(pt ? example.pt : example.en)};
  const input = doc.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp";
  const status = doc.createElement("output");
  status.setAttribute("aria-live", "polite");
  const preview = doc.createElement("img");
  preview.alt = ${JSON.stringify(pt ? 'Imagem enviada' : 'Uploaded image')};
  preview.width = 128;
  preview.height = 128;
  preview.hidden = true;
  label.append(input);
  root.append(label, status, preview);
  input.disabled = context.canEdit !== true;

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file || signal.aborted) return;
    input.disabled = true;
    status.textContent = ${JSON.stringify(pt ? 'Enviando…' : 'Uploading…')};
    try {
      const result = await host.call("actor.image.upload", {
        id: context.actorId,
        kind: ${JSON.stringify(example.kind)},
        file,
      }, { signal });
      if (signal.aborted) return;
      preview.src = result.url;
      preview.hidden = false;
      status.textContent = ${JSON.stringify(pt ? 'Imagem salva.' : 'Image saved.')};
    } catch (error) {
      if (!signal.aborted) status.textContent = ${JSON.stringify(pt ? 'Falha: ' : 'Failed: ')} + error.code;
    } finally {
      if (!signal.aborted) input.disabled = context.canEdit !== true;
    }
  }, { signal });
}`;
}

function imageBody(lang) {
  const pt = lang === 'pt';
  const intro = pt ? `# Imagens de ator: \`portrait\` e \`token\`

Estes dois exemplos usam \`host.call("actor.image.upload", payload)\`, uma operação do SDK de bloco. Eles não usam \`api.actors.update\` para transmitir arquivos. O retorno é \`{url}\` e o servidor valida campanha, edição do ator e imagem.

Prepare o [pacote mínimo](modules.html), um ator fictício e uma imagem original PNG/JPEG/WebP. Registre cada função na superfície \`actor.sheet\`: \`register("actor.sheet", mountPortraitUpload)\` ou \`register("actor.sheet", mountTokenUpload)\`. O contexto precisa conter \`actorId\` e \`canEdit\`; o usuário precisa ser GM ou ter permissão de edição do ator. O controle fica desabilitado quando \`canEdit\` não é verdadeiro; o servidor continua sendo a autoridade.

Copie uma função inteira para \`main.js\`. Não copie o descritor de arquivo do JSON Schema para o campo \`file\`: no navegador ele recebe o \`File\` real do seletor. O bridge produz multipart e metadados. Não use base64.` : `# Actor images: \`portrait\` and \`token\`

Both examples use \`host.call("actor.image.upload", payload)\`, a block SDK operation. File transmission is not an \`api.actors.update\` operation. The result is \`{url}\`; the server validates campaign, actor editing and image content.

Prepare the [minimal package](modules.html#minimal-browser-package), a synthetic actor and an original PNG/JPEG/WebP. Register each function on \`actor.sheet\`: \`register("actor.sheet", mountPortraitUpload)\` or \`register("actor.sheet", mountTokenUpload)\`. The context must provide \`actorId\` and \`canEdit\`; the user must be GM or have actor editing permission. The control is disabled unless \`canEdit\` is true; the server remains the authority.

Copy one complete function into \`main.js\`. Do not pass the JSON Schema file descriptor as \`file\`: browser code passes the real \`File\` from the picker. The bridge creates multipart data and metadata. Do not encode images as base64.`;
  const cases = resourceImageExamples.map(example => `## \`kind: "${example.kind}"\` — ${example[lang]}\n\n` +
    (pt ? `**Uso:** ${example.kind === 'portrait' ? 'trocar o retrato do ator exibido na ficha.' : 'trocar a imagem de token associada ao ator; isto não altera posição, escala ou tipo de vínculo de tokens já colocados.'}` : `**Use:** ${example.kind === 'portrait' ? 'change the actor portrait displayed by its sheet.' : 'change the actor token artwork; this does not set position, scale or linking of existing placed tokens.'}`) +
    fence('javascript', imageExampleCode(example, lang)) +
    (pt ? `**Resultado esperado:** o preview usa a URL autorizada retornada e o ator conserva a nova imagem \`${example.kind}\` após reabrir a ficha.\n\n**Valide:** envie uma imagem pequena, reabra a ficha e confira a imagem. Repita com jogador autorizado e somente leitura. Feche durante o envio e verifique que a interface encerrada não recebe atualizações.` : `**Expected result:** the preview uses the returned authorized URL and the actor retains its new \`${example.kind}\` image after reopening.\n\n**Validate:** upload a small image, reopen the sheet and check the image. Repeat as an authorized player and a read-only user. Close during upload and verify that the disposed UI receives no updates.`)
  ).join('\n\n');
  const end = pt ? `## Limites, erros e ciclo de vida

O servidor aceita PNG, JPEG ou WebP com até 10.000.000 bytes e 25.000.000 pixels. Ele normaliza a orientação e salva PNG. O atributo \`accept\` apenas orienta o seletor; não substitui essa validação.

Ator inacessível pode retornar \`not_found\` ou \`permission_denied\`; imagem inválida retorna \`invalid_data\`; falha de transporte pode retornar \`unavailable\`. O fechamento cancela o contexto: ignore atualizações de DOM após \`signal.aborted\`. Um envio já confirmado pelo servidor permanece salvo mesmo que a interface feche. O listener usa \`{signal}\` e é removido na desmontagem. Use \`api.actors.get(context.actorId)\` novamente antes de uma edição posterior que dependa da versão do ator.

## Como usar a IA para criar um seletor de imagem

> Confira o schema actor.image.upload e browser-bridge.js na release alvo. Adapte mountTokenUpload para exibir progresso acessível usando a opção onProgress de host.call. Preserve File multipart, permissões nativas, signal, limpeza e textContent. Não invente um endpoint ou grave URL do usuário diretamente no ator. Mostre testes de imagem inválida, fechamento durante envio e jogador somente leitura.` : `## Limits, errors and lifecycle

The server accepts PNG, JPEG or WebP up to 10,000,000 bytes and 25,000,000 pixels. It normalizes orientation and saves PNG. The \`accept\` attribute only guides the picker; it does not replace validation.

An inaccessible actor may produce \`not_found\` or \`permission_denied\`; invalid images produce \`invalid_data\`; transport failures may produce \`unavailable\`. Disposal cancels the context: skip DOM updates after \`signal.aborted\`. A server-committed upload remains saved even when the UI closes. The listener uses \`{signal}\` and is removed on disposal. Read \`api.actors.get(context.actorId)\` again before a later edit that depends on the actor version.

## How to use AI to build an image picker

> Inspect the actor.image.upload schemas and browser-bridge.js on the target release. Adapt mountTokenUpload to display accessible progress using host.call's onProgress option. Preserve multipart File data, native permissions, signal, cleanup and textContent. Do not invent an endpoint or write a user URL directly into the actor. Include invalid-image, close-during-upload and read-only-player checks.`;
  return intro + '\n\n' + cases + '\n\n' + end;
}

export function compendiumEntryExampleCode(example) {
  return `export async function ${example.fn}(api, packId, resourceId, signal, requestId = crypto.randomUUID()) {
  const added = await api.compendiums.add({
    packId,
    kind: ${JSON.stringify(example.kind)},
    resourceId,
    name: ${JSON.stringify(example.source)},
  }, { requestId, signal });
  return api.compendiums.read({ packId, id: added.id }, { signal });
}`;
}

function entryBody(lang) {
  const pt = lang === 'pt';
  const intro = pt ? `# Entradas de compêndio: os cinco \`kinds\`

\`api.compendiums.add\` captura um recurso que já existe na campanha. O campo \`kind\` escolhe o tipo do recurso; \`resourceId\` recebe seu UUID real. O servidor guarda um snapshot com dependências em um arquivo portátil. Ele não recebe um objeto arbitrário de ficha no lugar de \`resourceId\`.

Execute os exemplos em um módulo montado na campanha descartável, usando o \`api\` e o \`signal\` do bloco. É necessário ser GM, possuir os documentos de exemplo na mesma campanha e escolher um compêndio de mesa desbloqueado. Compêndios nativos e de sistema instalado são somente leitura. Crie o destino uma vez e guarde \`created.id\` como \`packId\`:` : `# Compendium entries: all five \`kinds\`

\`api.compendiums.add\` captures a resource that already exists in the campaign. \`kind\` selects its resource category; \`resourceId\` is its real UUID. The server stores a snapshot with dependencies in a portable bundle. It does not accept arbitrary sheet JSON instead of \`resourceId\`.

Run these examples in a module mounted in a disposable campaign using its \`api\` and \`signal\`. You must be GM, have the source documents in the same campaign and choose an unlocked table-created compendium. Native and installed-system compendiums are read only. Create the destination once and keep \`created.id\` as \`packId\`:`;
  const create = fence('javascript', `export async function createExamplePack(api, signal) {
  const created = await api.compendiums.create({ name: "Beacon Collection" }, {
    requestId: crypto.randomUUID(), signal,
  });
  return created.id;
}`);
  const specific = pt ? {
    actor: 'Use o UUID de um ator **Beacon Scout** criado no tipo character do sistema de exemplo. O snapshot preserva o tipo e os dados do ator.',
    item: 'Use o UUID do item **Beacon Rope**, do tipo gear registrado no sistema da campanha. O snapshot preserva tipo e dados do item.',
    journal: 'Use o UUID do diário **Beacon Notes**. O mesmo kind aceita os tipos nativos de diário; missão continua sendo kind journal ao entrar no compêndio.',
    scene: 'Use o UUID da cena **Beacon Harbor** da campanha. O corpo retornado por read pode mostrar apenas o nome; o bundle portátil conserva os recursos exportados e dependências.',
    deck: 'Use o UUID da instância de baralho **Beacon Signals**, obtido em api.cards.state().decks. Não use um deck_definition_id: add espera um baralho existente.',
  } : {
    actor: 'Use the UUID of a **Beacon Scout** actor created with the example system character type. The snapshot preserves actor type and data.',
    item: 'Use the UUID of a **Beacon Rope** item with the gear type registered by the campaign system. The snapshot preserves item type and data.',
    journal: 'Use the UUID of the **Beacon Notes** journal. The same kind accepts native journal document types; a quest still uses kind journal when stored in a compendium.',
    scene: 'Use the UUID of the campaign scene **Beacon Harbor**. The read body may show only its name; the portable bundle retains the exported resource and dependencies.',
    deck: 'Use the UUID of the existing **Beacon Signals** deck from api.cards.state().decks. Do not use a deck_definition_id: add expects a deck instance.',
  };
  const cases = resourceCompendiumKinds.map(example => `## \`kind: "${example.kind}"\` — ${example[lang]}\n\n${specific[example.kind]}` +
    fence('javascript', compendiumEntryExampleCode(example)) +
    (pt ? `**Resultado esperado:** \`${example.fn}(api, packId, resourceId, signal)\` retorna a entrada com \`kind: "${example.kind}"\`, \`id\`, \`name\`, \`data\` e \`version\`. O documento original permanece na campanha.\n\n**Valide:** confira a entrada no compêndio; importe uma cópia numa campanha de teste compatível e abra ${example.kind === 'deck' ? 'o baralho para conferir as cartas' : 'o documento criado'}.` : `**Expected result:** \`${example.fn}(api, packId, resourceId, signal)\` returns an entry with \`kind: "${example.kind}"\`, \`id\`, \`name\`, \`data\` and \`version\`. The source remains in the campaign.\n\n**Validate:** inspect the compendium entry; import a copy in a compatible test campaign and open ${example.kind === 'deck' ? 'the deck to check its cards' : 'the created document'}.`)
  ).join('\n\n');
  const imports = pt ? `## Ler e importar são ações diferentes

\`state\` lista metadados, sem os corpos nem os arquivos portáteis. \`read\` retorna dados autorizados; ele não cria documentos. \`import\` cria uma cópia e exige GM. Use o \`id\` da entrada retornada no exemplo acima:` : `## Reading and importing are different actions

\`state\` lists metadata without bodies or portable bundles. \`read\` returns authorized data without creating documents. \`import\` creates a copy and requires GM. Use the entry \`id\` returned by an example above:`;
  const importCode = fence('javascript', `export async function importExampleEntry(api, packId, entryId, signal) {
  return api.compendiums.import({ packId, id: entryId }, {
    requestId: crypto.randomUUID(), signal,
  });
}`);
  const end = pt ? `O destino da importação é a campanha do bloco atual; não existe um campo para escolher outra campanha nesta chamada. Para testar outra campanha, use um bloco montado nela e seus próprios IDs de recursos e compêndios. Cada ação lógica precisa de UUID próprio; conserve o UUID e passe o quinto argumento da função apenas para repetir o mesmo add após falha de transporte. Se add confirmou e read falhou, consulte state/read antes de adicionar novamente, pois as duas chamadas não formam uma única transação.

## Erros e validação

Sem GM, uma escrita é rejeitada. Recursos de outra campanha e packs inacessíveis ficam indisponíveis; um pack bloqueado rejeita edição; kind desconhecido rejeita add. Importar em sistema incompatível falha. Não confunda falha de leitura com ausência de dados nem tente forçar versões. Para configure/remove/delete, leia a versão atual do pack/entrada e use o campo version da operação documentada.

Valide cada kind com um recurso real, depois tente o mesmo add com jogador, pack bloqueado e UUID de outra campanha. Confirme que o original não mudou e que a cópia importada conserva seus recursos. Uma leitura com grant válido pode ser permitida ao jogador; importar continua sendo ação de GM.

## Como usar a IA para criar uma biblioteca de snapshots

> Confira frontend.json e compendiums/services.py na release alvo. Amplie storeScene para selecionar uma cena legível e um compêndio desbloqueado do GM. Use resourceId real, requestId novo por ação e leia o resultado. Mostre erros, estado vazio e retry sem duplicar a captura. Não envie JSON arbitrário de cena para add nem substitua o bundle por um nome.` : `The import destination is the mounted block's campaign; this call has no field for choosing a different campaign. To test another campaign, use a block mounted there and its own resource and compendium IDs. Each logical action needs its own UUID; retain it and pass the function's fifth argument only when retrying that same add after transport failure. If add committed but read failed, inspect state/read before adding again: these calls are separate transactions.

## Errors and validation

Writes require GM. Resources from another campaign and inaccessible packs are unavailable; locked packs reject editing; an unknown kind rejects add. A mismatched system rejects import. Do not treat a failed read as empty content or force versions. For configure/remove/delete, read the pack/entry version and use the operation's documented version field.

Validate every kind with a real source, then try the same add as a player, with a locked pack and with another campaign's UUID. Confirm that the original is unchanged and the imported copy retains its resources. A player with a valid read grant may read; importing remains a GM action.

## How to use AI to build a snapshot library

> Inspect frontend.json and compendiums/services.py on the target release. Extend storeScene with a readable scene selector and an unlocked GM compendium selector. Use a real resourceId, a new requestId per action and read the result. Handle errors, empty state and retry without duplicate captures. Do not send arbitrary scene JSON to add or replace the bundle with a name.`;
  return intro + create + '\n' + cases + '\n\n' + imports + importCode + '\n' + end;
}

function packBody(lang) {
  const pt = lang === 'pt';
  const intro = pt ? `# Packs de compêndio: exemplos por tipo

Um pack usa o campo \`type\`, chamado de “kind de pack” na documentação. Ele é diferente de \`entry.kind\` retornado pelo diretório e de \`entry.type\`, o tipo de documento do sistema. Não coloque \`kind\` na raiz de manifest.json.

Há duas origens com limites diferentes: coleções fornecidas por um pacote de sistema instalado e catálogos locais preparados pelo operador. Todos os dados Beacon abaixo são fictícios e originais.

| type do pack | kind no diretório | Em sistema instalado | Em catálogo local |
| --- | --- | --- | --- |
| actor_pack | actor | Sim | Sim |
| item_pack | item | Sim | Sim |
| spell_pack | item | Sim | Sim |
| journal_pack | journal | Não | Sim |
| scene_pack | scene | Não | Sim |
| card_pack | deck | Não | Sim |
| deck_pack | deck | Não | Sim |

## Preparação do sistema instalado

Use a release alvo que suporta \`content.compendiums\`; o recurso existe desde o VTT 0.2.1. O sistema precisa estar instalado, ativo na versão exata da campanha e não revogado. Comece com o [pacote mínimo](modules.html) e use este manifesto. Ele registra explicitamente character, gear e spell; esses nomes pertencem apenas ao sistema de exemplo.` : `# Compendium packs: an example for every type

A pack uses \`type\`, called a “pack kind” in documentation. It differs from \`entry.kind\` returned by the directory and from \`entry.type\`, the system's document type. Do not put \`kind\` at the root of manifest.json.

There are two origins with different limits: collections supplied by an installed system package and local catalogs prepared by the operator. All Beacon data below is original and synthetic.

| Pack type | Directory kind | Installed system | Local catalog |
| --- | --- | --- | --- |
| actor_pack | actor | Yes | Yes |
| item_pack | item | Yes | Yes |
| spell_pack | item | Yes | Yes |
| journal_pack | journal | No | Yes |
| scene_pack | scene | No | Yes |
| card_pack | deck | No | Yes |
| deck_pack | deck | No | Yes |

## Installed-system preparation

Use a target release supporting \`content.compendiums\`, available since VTT 0.2.1. The system must be installed, active at the campaign's exact pinned version and not revoked. Start from the [minimal package](modules.html#minimal-browser-package) and use this manifest. It explicitly registers character, gear and spell; these names belong to the example system.`;
  const manifest = json(resourceSystemManifest);
  const files = pt ? `Coloque a coleção em \`compendiums/beacon.json\` dentro do mesmo pacote. [Baixe a coleção com os três packs](../../assets/examples/compendiums/system-collection.json). O main.js mínimo abaixo apenas demonstra os tipos e os dados; adicione suas fichas pelas superfícies do SDK. Inclua a licença escolhida, adapte autor/nome e siga a instalação ZIP ou assinatura de [Sistemas e módulos](modules.html). Não altere arquivos depois que a release estiver instalada.` : `Place the collection at \`compendiums/beacon.json\` inside the same package. [Download the three-pack collection](../../assets/examples/compendiums/system-collection.json). The minimal main.js below only demonstrates types and data; add sheets through the SDK surfaces. Include the chosen license, customize author/name and follow [Systems and modules](modules.html) for ZIP installation or signing. Do not modify release files after installation.`;
  const main = fence('javascript', `export default {
  start() {},
  register() {},
  stop() {},
};`);
  const installed = installedCompendiumCollection.packs.map(pack => {
    const describe = {
      actor_pack: pt ? 'Importa Beacon Scout como ator character, com stamina 6.' : 'Imports Beacon Scout as a character actor with stamina 6.',
      item_pack: pt ? 'Importa Beacon Rope como item gear, com length 10.' : 'Imports Beacon Rope as a gear item with length 10.',
      spell_pack: pt ? 'Importa Beacon Glow como item spell, com color blue. spell_pack é um alias de compatibilidade para item; o core não ganha regras de magia.' : 'Imports Beacon Glow as a spell item with color blue. spell_pack is an item compatibility alias; it does not add spell rules to the core.',
    }[pack.type];
    return `## ${pt ? 'Sistema instalado' : 'Installed system'}: \`${pack.type}\`\n\n${describe}\n\n` +
      (pt ? 'Esta é uma coleção completa com um único pack; use-a sozinha ou combine packs no array packs do arquivo baixável.' : 'This is a complete single-pack collection; use it alone or combine packs in the downloadable collection packs array.') +
      json({ name: installedCompendiumCollection.name, packs: [pack] }) +
      (pt ? `**Valide:** confira \`${pack.entries[0].id}\` no pack do sistema e importe como GM. O diretório mostra \`kind: "${pack.type === 'actor_pack' ? 'actor' : 'item'}"\`; o documento importado usa \`type: "${pack.entries[0].type}"\`.` : `**Validate:** locate \`${pack.entries[0].id}\` in the system pack and import as GM. The directory shows \`kind: "${pack.type === 'actor_pack' ? 'actor' : 'item'}"\`; the imported document has \`type: "${pack.entries[0].type}"\`.`);
  }).join('\n\n');
  const limits = pt ? `## Validar o contrato antes da instalação

Cada coleção é limitada a 8 MiB, 64 packs e 20.000 entradas; cada entrada a 256 KiB e a profundidade JSON a 24 níveis. O manifesto aceita até 16 caminhos de coleção. IDs precisam ser únicos dentro do seu pack/coleção, ter até 120 caracteres e usar letras ASCII, números, ponto, sublinhado, dois-pontos ou hífen; precisam começar por letra ou número. Nome/label têm até 120 caracteres. Os tipos das entradas precisam estar registrados no manifesto e systemId precisa ser example.beacon neste exemplo.

Uma coleção de sistema instalado NÃO leva campanhas. O host vincula acesso à versão aprovada da campanha. Um jogador só a vê sob concessão válida; importar exige GM. As coleções declaradas não são servidas por assets.json: descubra os IDs por api.compendiums.state e leia pela API autorizada.

Para rodar o validador real no checkout de desenvolvimento, salve os JSONs como manifest.json e compendiums/beacon.json numa pasta descartável. Execute o código abaixo a partir de python manage.py shell, com essa pasta no diretório de trabalho ou ajustando os dois caminhos:` : `## Validate the contract before installation

Each collection is limited to 8 MiB, 64 packs and 20,000 entries; each entry is limited to 256 KiB and JSON nesting to 24 levels. A manifest accepts up to 16 collection paths. IDs must be unique within their pack/collection, up to 120 characters, use ASCII letters, digits, dots, underscores, colons or hyphens, and start with a letter or digit. Names/labels are limited to 120 characters. Entry document types must be registered by the manifest and systemId must be example.beacon for this example.

Installed-system collections have NO campaigns list. The host binds access to the campaign's approved version. A player needs a valid read grant; importing requires GM. Declared collections are not served through assets.json: discover IDs with api.compendiums.state and read through the authorized API.

To run the real validator in a development checkout, save the JSONs as manifest.json and compendiums/beacon.json in a disposable folder. Run this in python manage.py shell with that folder as the working directory, or adjust the two paths:`;
  const validate = fence('python', `import json
from pathlib import Path
from gravewright.compendiums.content import validate_collection

manifest = json.loads(Path("manifest.json").read_text(encoding="utf-8"))
collection = json.loads(Path("compendiums/beacon.json").read_text(encoding="utf-8"))
validate_collection(
    collection,
    manifest["id"],
    {row["id"] for row in manifest["system"]["actorTypes"]},
    {row["id"] for row in manifest["system"]["itemTypes"]},
)
print("Collection accepted")`);
  const localIntro = pt ? `## Catálogos locais: preparação do operador

Esta é uma integração de arquivos do operador do host, não uma capacidade de escrita oferecida ao módulo de navegador. No checkout de desenvolvimento, use a pasta configurada em settings.GRAVEWRIGHT_CONTENT_ROOT; não presuma um diretório global nem edite a .env para experimentar. A [configuração](configuration.html) e o Runner determinam a raiz efetiva.

O catálogo local usa uma subpasta com index.json e um array campaigns contendo UUIDs reais autorizados pelo operador. O UUID abaixo é fictício: troque-o pelo da sua campanha descartável, configurada com example.beacon. Esses catálogos são somente leitura na mesa. journal_pack/scene_pack/card_pack/deck_pack pertencem a esta origem e são rejeitados em content.compendiums de um pacote instalado.

[Baixe o index.json local completo](../../assets/examples/compendiums/local/index.json) e [a arte original beacon.webp](../../assets/examples/compendiums/local/artwork/beacon.webp). Preserve a árvore local/index.json e local/artwork/beacon.webp. Cada bloco abaixo é um pack completo para o array packs do index. A configuração mínima da coleção é:` : `## Local catalogs: operator preparation

This is a host-operator file integration, not a browser module write capability. In a development checkout use the directory configured by settings.GRAVEWRIGHT_CONTENT_ROOT; do not assume a global directory or edit .env for an experiment. [Configuration](configuration.html) and the Runner determine the effective root.

A local catalog uses a subdirectory with index.json and a campaigns array containing real campaign UUIDs authorized by the operator. The UUID below is synthetic: replace it with your disposable campaign using example.beacon. These catalogs are read only in the tabletop. journal_pack/scene_pack/card_pack/deck_pack belong to this origin and are rejected in an installed package's content.compendiums.

[Download the complete local index.json](../../assets/examples/compendiums/local/index.json) and [original beacon.webp artwork](../../assets/examples/compendiums/local/artwork/beacon.webp). Preserve local/index.json and local/artwork/beacon.webp. Each block below is one complete pack for the index packs array. The minimal collection wrapper is:`;
  const wrapper = json({ name: localCompendiumCollection.name, systemId: 'example.beacon', campaigns: localCompendiumCollection.campaigns, packs: [] });
  const localCases = localCompendiumCollection.packs.map(pack => {
    const expectation = {
      actor_pack: pt ? 'Cria um ator character. O tipo precisa existir no sistema da campanha; este exemplo usa stamina 6.' : 'Creates a character actor. The type must exist in the campaign system; this example uses stamina 6.',
      item_pack: pt ? 'Cria um item gear com length 10. Não use um tipo de item de outro sistema.' : 'Creates a gear item with length 10. Do not use an item type from a different system.',
      spell_pack: pt ? 'Cria um item spell. Continua sendo kind item no diretório e não uma entidade nativa de magia.' : 'Creates a spell item. The directory kind remains item rather than a native spell entity.',
      journal_pack: pt ? 'Cria um diário vazio diary chamado Beacon Notes. Preencha conteúdo original pela interface depois de importar.' : 'Creates an empty diary journal named Beacon Notes. Add original content through the interface after import.',
      scene_pack: pt ? 'Cria a cena Beacon Harbor com 1400 × 980 pixels. Esta entrada mínima não inclui mapa de fundo, paredes ou objetos.' : 'Creates the Beacon Harbor scene at 1400 × 980 pixels. This minimal entry has no background image, walls or objects.',
      card_pack: pt ? 'Cria uma instância de baralho com uma carta Beacon Signal. A arte WebP precisa existir relativa à pasta do index.' : 'Creates a deck instance with one Beacon Signal card. WebP artwork must exist relative to the index directory.',
      deck_pack: pt ? 'Cria uma instância de baralho com duas cartas Beacon Watch. quantity expande as cópias. card_pack e deck_pack usam o mesmo importador.' : 'Creates a deck instance with two Beacon Watch cards. quantity expands copies. card_pack and deck_pack use the same importer.',
    }[pack.type];
    return `## Catálogo local: \`${pack.type}\`\n\n`.replace('Catálogo local', pt ? 'Catálogo local' : 'Local catalog') +
      json(pack) + (pt ? `**Resultado esperado e validação:** ${expectation} Recarregue os compêndios, leia a entrada pelo ID e importe como GM; confira o recurso criado na campanha descartável.` : `**Expected result and validation:** ${expectation} Refresh compendiums, read the entry by ID and import as GM; inspect the created resource in the disposable campaign.`);
  }).join('\n\n');
  const localSetup = pt ? `## Instalar apenas o catálogo local de exemplo

Com os dois downloads salvos sob uma pasta local e a campanha de teste criada, execute o trecho no python manage.py shell da instalação descartável. Ajuste sample para o caminho onde os arquivos foram baixados e campaign_id para o UUID real. O script lê a raiz configurada e cria uma nova pasta beacon-examples; falha se ela já existir, preservando instalações e conteúdo anterior.` : `## Install only the local example catalog

With both downloads saved under a local folder and the test campaign created, run this in the disposable installation's python manage.py shell. Set sample to the download folder and campaign_id to the real UUID. It reads the configured root and creates a new beacon-examples directory; it fails if that directory already exists, preserving existing installations and content.`;
  const installCode = fence('python', `import json
import shutil
from pathlib import Path
from uuid import UUID
from django.conf import settings

sample = Path("downloaded-examples/local").resolve()
campaign_id = str(UUID("00000000-0000-4000-8000-000000000001"))
collection = json.loads((sample / "index.json").read_text(encoding="utf-8"))
artwork = sample / "artwork" / "beacon.webp"
if not artwork.is_file():
    raise FileNotFoundError(artwork)
collection["campaigns"] = [campaign_id]
root = Path(settings.GRAVEWRIGHT_CONTENT_ROOT).resolve()
destination = root / "beacon-examples"
destination.mkdir(parents=True, exist_ok=False)
(destination / "artwork").mkdir()
shutil.copy2(artwork, destination / "artwork" / "beacon.webp")
(destination / "index.json").write_text(
    json.dumps(collection, ensure_ascii=False, indent=2), encoding="utf-8"
)
print(destination)`);
  const end = pt ? `## Erros e verificações finais

Coleção de sistema com tipo não registrado, systemId errado, IDs repetidos ou um dos quatro packs exclusivos de catálogo local falha na validação antes da instalação. Na mesa, uma versão não ativa/revogada ou bytes alterados tornam o conteúdo indisponível. Não use falha de integridade como motivo para editar o pacote instalado: gere nova versão.

No catálogo local, campaigns ausente ou com UUID errado faz o catálogo não aparecer. Card/deck exige de 1 a 500 cartas, quantity inteiro entre 1 e 500, total de até 500 e WebP válido de até 10 MiB dentro da pasta do catálogo; caminho externo ou arquivo faltante falha. Confira a árvore e o resultado de cada importação. A visibilidade inicial é do GM; conceda leitura pelo fluxo de permissões e confirme que o jogador pode ler, mas não importar.

## Como usar a IA para criar packs de conteúdo original

> Confira content.py, catalog.py e o manifesto da release alvo. Crie um sistema instalado com um actor_pack, um item_pack e um spell_pack usando somente descritores declarados, systemId correto e conteúdo original. Gere JSONs completos, valide com validate_collection e mostre state/read/import. Explique por que journal_pack, scene_pack, card_pack e deck_pack não podem entrar nesse ZIP; se eu pedir catálogo local, use a setting efetiva e campanhas explícitas sem sobrescrever arquivos existentes.` : `## Errors and final checks

An installed-system collection with unregistered document types, a wrong systemId, duplicate IDs or one of the four local-only pack types fails validation before installation. In the tabletop, an inactive/revoked version or changed approved bytes makes content unavailable. Do not repair integrity failures by editing installed files: prepare a new version.

For local catalogs, missing campaigns or a wrong UUID hides the catalog. Cards/decks require 1–500 cards, integer quantity between 1 and 500, at most 500 expanded cards and valid WebP files up to 10 MiB inside the catalog directory; external paths and missing files fail. Check the directory tree and every import result. Packs start GM-visible; grant reading through the permission flow and confirm that a player may read but cannot import.

## How to use AI to create original-content packs

> Inspect content.py, catalog.py and the target release manifest. Build an installed system with one actor_pack, one item_pack and one spell_pack using only declared document types, the correct systemId and original content. Provide complete JSONs, validate with validate_collection and demonstrate state/read/import. Explain why journal_pack, scene_pack, card_pack and deck_pack cannot enter that ZIP; if I request a local catalog, use the effective setting and explicit campaigns without replacing existing files.`;
  return intro + manifest + '\n' + files + main + '\n' + installed + '\n\n' + limits + validate + '\n' + localIntro + wrapper + '\n' + localCases + '\n\n' + localSetup + installCode + '\n' + end;
}

const resourceArticles = [
  {
    slug: 'examples-search-kinds', group: 'examples', sourcePaths: sourcePaths.search,
    en: { title: 'Search: all 7 kinds and the empty filter', summary: 'Eight concrete browser functions, quest versus journal categories, authorized recents and validation.', body: searchBody('en') },
    pt: { title: 'Busca: os 7 kinds e o filtro vazio', summary: 'Oito funções concretas, categorias de missão/diário, recentes autorizados e validação.', body: searchBody('pt') },
  },
  {
    slug: 'examples-actor-image-kinds', group: 'examples', sourcePaths: sourcePaths.image,
    en: { title: 'Actor images: portrait and token', summary: 'Two complete File-picker mount functions using the actual multipart host.call operation.', body: imageBody('en') },
    pt: { title: 'Imagens de ator: portrait e token', summary: 'Duas funções completas de montagem com seletor File e a operação multipart real de host.call.', body: imageBody('pt') },
  },
  {
    slug: 'examples-compendium-entry-kinds', group: 'examples', sourcePaths: sourcePaths.entries,
    en: { title: 'Compendium entries: all five kinds', summary: 'Capture actor, item, journal, scene and deck resources with authorized reads and GM imports.', body: entryBody('en') },
    pt: { title: 'Entradas de compêndio: os cinco kinds', summary: 'Capture actor, item, journal, scene e deck com leitura autorizada e importação pelo GM.', body: entryBody('pt') },
  },
  {
    slug: 'examples-compendium-pack-kinds', group: 'examples', sourcePaths: sourcePaths.packs,
    en: { title: 'Compendium packs: 3 installed and 7 local types', summary: 'Complete original JSON for every pack type, exact manifest restrictions and downloadable fixtures.', body: packBody('en') },
    pt: { title: 'Packs de compêndio: 3 tipos instalados e 7 locais', summary: 'JSON original completo por tipo de pack, restrições reais do manifesto e arquivos de exemplo.', body: packBody('pt') },
  },
];

export const resourceExampleArticles = resourceArticles.map(article => ({
  ...article,
  en: {...article.en, body: copyablePrompts(article.en.body)},
  pt: {...article.pt, body: copyablePrompts(article.pt.body)},
}));
