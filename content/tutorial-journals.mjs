// Complete original browser tutorial package; importing performs no writes.
const id = 'session-journal';
const slug = 'tutorial-journal-module';
const manifest = {
  id: 'example.session-notebook', name: 'Session notebook', version: '1.0.0',
  sdk: { requires: '>=1.0.0 <2.0.0', tested: '1.0.0' },
  entry: 'main.js',
  description: 'Create private journals and append GM-only session drafts while preserving existing journal content.',
  author: 'Gravewright documentation examples', license: 'MIT'
};

const main = String.raw`// Original tutorial. MIT. Target host: Gravewright 0.3.0, SDK 1.x.
const error = key => Object.assign(new Error(key), { tutorialKey: key });
const alive = signal => !signal.aborted;

function elements({ root, signal, onDispose, api }, kind) {
  const el = (tag, text) => {
    const node = root.ownerDocument.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const t = (key, params) => api.i18n.t(key, params);
  const panel = el('section');
  panel.className = 'gw-session-tools gw-session-tools--' + kind;
  const heading = el('h3', t('Session notebook'));
  const status = el('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  panel.append(heading);
  root.append(panel);
  onDispose(() => panel.remove());
  const report = problem => {
    if (!alive(signal)) return;
    status.textContent = problem.tutorialKey ? t(problem.tutorialKey) :
      t('Request failed: {code}. Review the journal before trying again.', { code: problem.code || 'unavailable' });
  };
  return { el, t, panel, status, report };
}

async function journalSnapshot(api, signal, journalId) {
  const snapshot = await api.journals.state({}, { signal });
  if (!alive(signal)) return null;
  // Only the server's GM projection contains all pages, hidden blocks and GM docs.
  if (snapshot.is_gm !== true) throw error('This tool requires a GM.');
  const view = snapshot.journals.find(row => row.id === journalId);
  if (!view || view.can_open === false) throw error('Journal is unavailable.');
  if (view.type !== 'diary') throw error('This tool only edits Journal documents (diary).');
  if (!view.can_edit) throw error('This journal is read-only.');
  if (!Array.isArray(view.sections) || !view.content_doc || !view.cover_image ||
      !view.diary?.gm?.notes || !view.diary?.gm?.secrets || !Number.isInteger(view.version)) {
    throw error('The complete GM journal projection is unavailable.');
  }
  return view;
}

function appendPayload(view) {
  if (view.sections.length >= 64) throw error('This journal already has 64 pages.');
  const last = Math.max(0, ...view.sections.map(page => Number(page.sortOrder) || 0));
  if (!Number.isSafeInteger(last + 10)) throw error('Page order is outside the supported range.');
  const page = {
    id: 'section_' + crypto.randomUUID().replaceAll('-', '').slice(0, 12),
    title: 'Session notes', category: 'Sessions', kind: 'text',
    assetId: '', src: '', level: 1, audience: 'gm', sortOrder: last + 10,
    content: { format: 'gw-journal-doc-v1', version: 1, doc: { type: 'doc', content: [
      { type: 'paragraph', attrs: { visibility: 'public' }, content: [
        { type: 'text', text: 'Draft: record the date, discoveries, decisions and loose ends from this session.' }
      ] }
    ] } }
  };
  const sections = view.sections.map(({ can_edit, ...section }) => structuredClone(section));
  return {
    journal_id: view.id, title: view.title, visibility: view.visibility, version: view.version,
    data: {
      content: structuredClone(view.content_doc), cover: structuredClone(view.cover_image),
      sections: [...sections, page], gm: structuredClone(view.diary.gm)
    }
  };
}

async function mountCreate(block) {
  const { context, api, signal } = block;
  if (context.role !== 'gm' || !alive(signal)) return;
  const { el, t, panel, status, report } = elements(block, 'table');
  const form = el('form');
  const label = el('label', t('Journal title'));
  const input = el('input');
  input.type = 'text'; input.required = true; input.maxLength = 120;
  input.value = 'Session notebook';
  const create = el('button', t('Create session journal'));
  create.type = 'submit';
  label.append(input); form.append(label, create); panel.append(form, status);
  let busy = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !alive(signal)) return;
    const title = input.value.trim();
    if (!title || title.length > 120) { report(error('Enter a title from 1 to 120 characters.')); return; }
    busy = true; create.disabled = true; input.disabled = true;
    status.textContent = t('Creating journal...');
    try {
      const snapshot = await api.journals.state({}, { signal });
      if (!alive(signal)) return;
      if (snapshot.is_gm !== true) throw error('This tool requires a GM.');
      const result = await api.journals.create({ title, journal_type: 'diary', folder_id: null },
        { requestId: crypto.randomUUID(), signal });
      if (!alive(signal)) return;
      status.textContent = t('Created "{title}". Open it in Journals, then add a session section.', { title });
      status.dataset.journalId = result.journal_id;
    } catch (problem) { report(problem); }
    finally { if (alive(signal)) { busy = false; create.disabled = false; input.disabled = false; } }
  }, { signal });
}

async function mountAppend(block) {
  const { context, api, signal } = block;
  if (context.role !== 'gm' || !alive(signal)) return;
  const { el, t, panel, status, report } = elements(block, 'journal');
  const add = el('button', t('Add session section'));
  const review = el('button', t('Review latest journal'));
  add.type = review.type = 'button';
  add.disabled = review.disabled = true;
  const hint = el('p', t('Save pending native edits first. New session drafts are GM-only.'));
  panel.append(hint, add, review, status);
  let busy = false, ready = false, needsReview = false;
  const controls = () => {
    if (!alive(signal)) return;
    add.disabled = busy || !ready || needsReview;
    review.disabled = busy;
  };
  async function refresh() {
    if (busy || !alive(signal)) return;
    busy = true; ready = false; controls();
    try {
      const view = await journalSnapshot(api, signal, context.journalId);
      if (!view || !alive(signal)) return;
      ready = view.sections.length < 64;
      needsReview = false;
      status.textContent = t('Latest saved version: {version}. Pages: {count}.', { version: view.version, count: view.sections.length });
      if (!ready) report(error('This journal already has 64 pages.'));
    } catch (problem) { report(problem); }
    finally { if (alive(signal)) { busy = false; controls(); } }
  }
  review.addEventListener('click', () => void refresh(), { signal });
  add.addEventListener('click', async () => {
    if (busy || !ready || needsReview || !alive(signal)) return;
    busy = true; controls();
    status.textContent = t('Saving session section...');
    try {
      const view = await journalSnapshot(api, signal, context.journalId);
      if (!view || !alive(signal)) return;
      const payload = appendPayload(view);
      await api.journals.update(payload, { requestId: crypto.randomUUID(), signal });
      if (!alive(signal)) return;
      ready = payload.data.sections.length < 64;
      status.textContent = t('Added GM-only "Session notes". Open it under Sessions in the native journal.');
    } catch (problem) {
      if (!alive(signal)) return;
      needsReview = true;
      if (problem.code === 'conflict') {
        try {
          const latest = await journalSnapshot(api, signal, context.journalId);
          if (!latest || !alive(signal)) return;
          ready = latest.sections.length < 64;
          status.textContent = t('Conflict: server version {version} loaded. Review native content, then choose Review latest journal. No automatic retry.', { version: latest.version });
        } catch (refreshProblem) { ready = false; report(refreshProblem); }
      } else report(problem);
    } finally { if (alive(signal)) { busy = false; controls(); } }
  }, { signal });
  await refresh();
}

export default {
  async start({ api, assets, styles, signal }) {
    styles.use('styles.css');
    const messages = await assets.json('messages.json');
    if (!alive(signal)) return;
    api.i18n.register(messages);
  },
  register({ register }) {
    register('table.interface', { mode: 'augment', mount: mountCreate });
    register('journal.sheet', { mode: 'augment', mount: mountAppend });
  },
  stop() {}
};
`;

const labels = {
  'Session notebook': ['Caderno de sessão', 'Cuaderno de sesión'],
  'Journal title': ['Título do diário', 'Título del diario'],
  'Create session journal': ['Criar diário de sessão', 'Crear diario de sesión'],
  'Add session section': ['Adicionar seção de sessão', 'Añadir sección de sesión'],
  'Review latest journal': ['Revisar diário atual', 'Revisar diario actual'],
  'Save pending native edits first. New session drafts are GM-only.': ['Salve as alterações pendentes do editor nativo antes. Novos rascunhos de sessão são privados do GM.', 'Guarda primero los cambios pendientes del editor nativo. Los borradores nuevos son privados del GM.'],
  'This tool requires a GM.': ['Esta ferramenta exige GM.', 'Esta herramienta requiere GM.'],
  'Journal is unavailable.': ['O diário está indisponível.', 'El diario no está disponible.'],
  'This tool only edits Journal documents (diary).': ['Esta ferramenta só edita documentos do tipo Diário (diary).', 'Esta herramienta solo edita documentos Diario (diary).'],
  'This journal is read-only.': ['Este diário permite apenas leitura.', 'Este diario es de solo lectura.'],
  'The complete GM journal projection is unavailable.': ['A projeção completa do diário para GM está indisponível.', 'La proyección completa del diario para GM no está disponible.'],
  'This journal already has 64 pages.': ['Este diário já tem 64 páginas.', 'Este diario ya tiene 64 páginas.'],
  'Page order is outside the supported range.': ['A ordem das páginas está fora do intervalo suportado.', 'El orden de páginas está fuera del intervalo permitido.'],
  'Enter a title from 1 to 120 characters.': ['Digite um título de 1 a 120 caracteres.', 'Escribe un título de 1 a 120 caracteres.'],
  'Creating journal...': ['Criando diário...', 'Creando diario...'],
  'Created "{title}". Open it in Journals, then add a session section.': ['Diário "{title}" criado. Abra em Diários e adicione uma seção de sessão.', 'Diario "{title}" creado. Ábrelo en Diarios y añade una sección de sesión.'],
  'Latest saved version: {version}. Pages: {count}.': ['Versão salva atual: {version}. Páginas: {count}.', 'Versión guardada actual: {version}. Páginas: {count}.'],
  'Saving session section...': ['Salvando seção de sessão...', 'Guardando sección de sesión...'],
  'Added GM-only "Session notes". Open it under Sessions in the native journal.': ['Página privada "Session notes" adicionada. Abra em Sessions no diário nativo.', 'Página privada "Session notes" añadida. Ábrela en Sessions en el diario nativo.'],
  'Conflict: server version {version} loaded. Review native content, then choose Review latest journal. No automatic retry.': ['Conflito: versão {version} do servidor carregada. Revise o conteúdo nativo e escolha Revisar diário atual. Sem repetição automática.', 'Conflicto: versión {version} del servidor cargada. Revisa el contenido nativo y elige Revisar diario actual. Sin repetición automática.'],
  'Request failed: {code}. Review the journal before trying again.': ['Falha na solicitação: {code}. Revise o diário antes de tentar novamente.', 'Solicitud fallida: {code}. Revisa el diario antes de intentar otra vez.']
};
const messages = { en: Object.fromEntries(Object.keys(labels).map(key => [key, key])), 'pt-BR': Object.fromEntries(Object.entries(labels).map(([key, values]) => [key, values[0]])), es: Object.fromEntries(Object.entries(labels).map(([key, values]) => [key, values[1]])) };
const styles = `.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools {
  padding: var(--space-3, 12px); border: 1px solid var(--border);
  border-radius: var(--radius-md); background: var(--surface); color: var(--text);
  font-size: 14px; line-height: 1.5; pointer-events: auto;
}
.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools--table {
  position: fixed; left: 16px; bottom: 128px; z-index: 10;
  width: min(320px, calc(100vw - 32px)); max-height: 40vh; overflow: auto;
}
.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools h3 {
  margin: 0 0 var(--space-2, 8px); font-size: 16px;
}
.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools p {
  margin: var(--space-2, 8px) 0 0; font-size: 14px;
}
.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools label {
  display: grid; gap: var(--space-1, 4px); margin-bottom: var(--space-2, 8px);
}
.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools input,
.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools button {
  font: inherit; max-width: 100%; box-sizing: border-box;
}
.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools button {
  margin-right: var(--space-2, 8px); margin-top: var(--space-2, 8px);
}
.gw-module-root[data-module-id="example.session-notebook"] .gw-session-tools input { width: 100%; }
`;
const license = `MIT License

Copyright (c) 2026 Gravewright documentation contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to
do so, subject to the following conditions:

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
const files = { 'manifest.json': JSON.stringify(manifest, null, 2) + '\n', 'main.js': main, 'styles.css': styles, 'messages.json': JSON.stringify(messages, null, 2) + '\n', 'LICENSE.txt': license };
export const tutorialJournalPackages = [{ id, slug, manifest, files }];
const fence = (language, value) => '```' + language + '\n' + value.trimEnd() + '\n```';
const base = '../../assets/tutorials/session-journal/';
const sourcePaths = ['gravewright/modules/contracts/frontend.json', 'gravewright/modules/contracts/schemas/journal.sheet.context.json', 'gravewright/modules/static/gravewright_modules/domain-api.js', 'gravewright/modules/static/gravewright_modules/module-runtime.js', 'gravewright/journals/services.py', 'gravewright/journals/data.py', 'gravewright/journals/documents.py', 'docs/en/modules.md', 'docs/pt-BR/modules.md'];
const fileBlocks = '### manifest.json\n\n' + fence('json', files['manifest.json']) + '\n\n' + ['main.js', 'styles.css', 'messages.json', 'LICENSE.txt'].map(name => '### ' + name + '\n\n' + fence(name.endsWith('.js') ? 'javascript' : name.endsWith('.css') ? 'css' : name.endsWith('.json') ? 'json' : 'text', files[name])).join('\n\n');
const tree = fence('text', 'session-journal/\n  manifest.json\n  main.js\n  styles.css\n  messages.json\n  LICENSE.txt');
const psZip = fence('powershell', 'python -m json.tool manifest.json\nCompress-Archive -LiteralPath manifest.json,main.js,styles.css,messages.json,LICENSE.txt -DestinationPath ../session-journal-1.0.0.zip\npython -m zipfile -l ../session-journal-1.0.0.zip');
const posixZip = fence('sh', 'python3 -m json.tool manifest.json\npython3 -m zipfile -c ../session-journal-1.0.0.zip manifest.json main.js styles.css messages.json LICENSE.txt\npython3 -m zipfile -l ../session-journal-1.0.0.zip');
const downloads = locale => '[ ' + (locale === 'pt' ? 'Baixar projeto completo' : 'Download complete project') + ' ](' + base + id + '-source.zip)\n\n' + Object.keys(files).map(name => '- [' + name + '](' + base + name + ')').join('\n');
const body = locale => {
  const pt = locale === 'pt';
  return pt ? `## O que você vai construir\n\nUm módulo comum para **Gravewright 0.3.0** com duas ações reais: criar um diário privado a partir da mesa e acrescentar uma página de rascunho a um diário já existente. O botão da ficha é **Adicionar seção de sessão**. Ele grava uma página chamada **Session notes**, no capítulo **Sessions**, com texto original e público **gm**. O texto das páginas já existentes não é traduzido nem substituído.\n\nO exemplo usa as APIs públicas \`api.journals.state\`, \`create\` e \`update\`; não importa código privado do host, não escreve no banco diretamente e não precisa de aplicativo Django. O módulo preserva o editor nativo por meio de \`mode: augment\`.\n\n## 1. Comece pelos arquivos\n\nUse uma instalação de desenvolvimento descartável da versão 0.3.0 e uma conta proprietária para instalar. Para executar o módulo, entre em uma campanha como GM. Você precisa apenas de um editor de texto e do Python já preparado para o projeto. Não há npm, compilação nem dependências externas. Crie uma pasta \`session-journal\` dentro de \`data/\` ou outra pasta de desenvolvimento explicitamente escolhida. Salve os cinco arquivos em UTF-8.\n\n${tree}\n\n${downloads('pt')}\n\n## 2. Entenda os tipos antes de editar\n\n| Conceito | Valor deste exemplo | Significado |\n| --- | --- | --- |\n| Tipo de pacote | módulo de navegador | Manifesto com entry, sem system/django/locales; não existe kind: journal no manifesto |\n| Superfícies | table.interface e journal.sheet | Pontos de montagem do módulo |\n| Tipo de documento | diary | Diário nativo; os outros tipos são quest, quest_board e roll_table |\n| Tipo da página | text | A nova seção contém texto; páginas também podem ser image ou pdf |\n| Público da página | gm | O rascunho não é enviado a jogadores |\n\nNão troque o tipo do documento existente para adaptar o exemplo. Para missões ou tabelas de rolagem, use seus próprios contratos e dados. A ferramenta recusa esses tipos de forma explícita.\n\n## 3. Empacote o projeto\n\nNa pasta que contém os cinco arquivos, execute no PowerShell:\n\n${psZip}\n\nNo Linux/macOS:\n\n${posixZip}\n\nA listagem precisa mostrar \`manifest.json\` diretamente na raiz, junto de main.js. O ZIP acima é um pacote-fonte local sem assinatura. Você também pode revisar e instalar o ZIP para download. Não envie a pasta inteira com outro nível externo.\n\n## 4. Instale como proprietário e ative como GM\n\n1. Como proprietário da instalação, abra **Inside → Módulos → Instalar módulo → Instalar de ZIP**. Na interface em inglês: **Inside → Modules → Install module → Install from ZIP**.\n2. Selecione \`session-journal-1.0.0.zip\` e clique **Instalar / Install**. A instalação local é a decisão de confiança do proprietário.\n3. Abra a campanha como GM. No botão **Gravewright** da mesa, abra **Extensions** e clique **Activate** na versão **1.0.0** de **Session notebook**. Instalar não ativa automaticamente na campanha.\n4. Feche Extensions. O painel do módulo aparece no canto inferior esquerdo com campo **Título do diário** e botão **Criar diário de sessão**. Em inglês: **Journal title** e **Create session journal**.\n5. Para modificar os arquivos depois, gere versão **1.0.1** com novo ZIP e selecione-a na campanha. Pacotes instalados são imutáveis; não edite sua pasta extraída.\n\nO [primeiro módulo](docs:tutorial-first-module) explica cada tela de instalação com mais detalhes.\n\n## 5. Crie e abra um diário do zero\n\n1. Deixe o título padrão **Session notebook** e clique **Criar diário de sessão** uma vez. A ação envia \`{title, journal_type: "diary", folder_id: null}\` a create, com UUID novo para essa operação.\n2. Aguarde a confirmação. Abra **Journals / Diários** na mesa e abra **Session notebook**. O host cria um diário vazio e privado na raiz do diretório.\n3. A criação nativa não usa um campo data do módulo. É a próxima ação, na ficha aberta, que grava o rascunho. Não invente um parâmetro de conteúdo inicial em create.\n\nSe a resposta da criação não for confirmada, confira o diretório antes de clicar outra vez: cancelamento ou perda de conexão não desfaz uma gravação que já tenha sido confirmada pelo servidor.\n\n## 6. Atue no diário existente\n\n1. Com o diário aberto, encontre o bloco **Caderno de sessão** acrescentado à ficha. O editor nativo permanece disponível.\n2. Se estava editando, aguarde **Saved / Salvo** no editor nativo antes de executar a ação do módulo. A API não fornece ao módulo um comando público para salvar o rascunho local de outro editor.\n3. Clique **Adicionar seção de sessão**. O módulo consulta uma projeção atual do servidor, preserva o título, visibility, content_doc, capa, páginas e documentos GM, e acrescenta uma página.\n4. No índice nativo, abra **Sessions → Session notes**. O texto é: \`Draft: record the date, discoveries, decisions and loose ends from this session.\`\n5. A página é privada do GM. Edite o rascunho pelo editor nativo. Se quiser compartilhá-lo, escolha conscientemente a opção nativa **Make public** e as permissões do diário. O módulo não publica nem apresenta conteúdo automaticamente.\n6. Feche e reabra o diário para confirmar persistência. Um segundo clique, após a primeira gravação terminar, cria outra página independente com ID novo. Cliques simultâneos na mesma montagem são bloqueados.\n\n## 7. Entenda a gravação e o conflito\n\n\`journals.update\` recebe \`journal_id\`, \`title\`, \`visibility\`, a \`version\` inteira lida do servidor e o objeto \`data\` completo. Para diary, os campos são \`content\`, \`cover\`, \`sections\` e \`gm\`. Não envie a projeção inteira como data: ela usa nomes diferentes, como content_doc e cover_image. A propriedade can_edit de uma página é metadado da projeção e é retirada antes de salvar.\n\nEste exemplo escreve somente como GM porque uma projeção de jogador é filtrada e não representa todo o documento. O código verifica context.role para desenhar os controles e também \`state.is_gm\` imediatamente antes de qualquer gravação. Mesmo assim, o servidor revalida usuário, campanha, permissão e revisão. Um jogador com permissão própria de edição continua usando o editor nativo.\n\nSe outra janela salvar entre leitura e escrita, update retorna **conflict**. O módulo lê a versão atual, mantém **Adicionar seção** bloqueado e pede **Revisar diário atual**. Revise o conteúdo nativo, resolva eventuais alterações locais e só então confirme essa revisão. Não existe repetição automática nem substituição silenciosa de version. Cada novo clique aprovado é uma nova operação com UUID novo.\n\n## 8. Código completo\n\nO start carrega CSS e mensagens pelo mecanismo oficial de tradução. register declara as duas superfícies de forma síncrona. Cada montagem mantém seu próprio estado; todas as leituras e gravações recebem signal. Ao fechar a janela ou desativar, o host aborta a montagem, remove ouvintes e chama onDispose para remover o painel. A tradução do módulo cobre en, pt-BR e es; nomes e texto do rascunho original permanecem iguais nos três idiomas.\n\n${fileBlocks}\n\n## 9. Valide antes de adaptar\n\n| Cenário | Como executar | Resultado esperado |\n| --- | --- | --- |\n| Gravação básica | Criar, abrir, adicionar e reabrir | Uma nova página GM com texto original persistido |\n| Conteúdo existente | Diário com capa, introdução, página pública, página GM e notas/segredos | Todos permanecem iguais; só uma página é acrescentada |\n| Jogador | Compartilhe o diário e abra em outra conta | Nenhum botão do módulo; rascunho GM e segredos ausentes da projeção |\n| Somente leitura | Abra como leitor; revogue edição durante uma montagem | Nenhuma escrita permitida; servidor continua como limite de autorização |\n| Outros tipos | Abra Quest, Quest board ou Roll table | Aviso de tipo incompatível, sem update |\n| Limite | Diário com 64 páginas | Adicionar bloqueado; nenhuma página descartada |\n| Conflito | Duas sessões; uma grava enquanto a outra tem requisição pendente | Releitura, botão bloqueado e revisão explícita; sem reenvio automático |\n| Ciclo de vida | Abrir/fechar cinco vezes; desativar durante leitura | Um painel por janela, nenhum retorno tardio alterando DOM encerrado |\n| Operação já enviada | Fechar durante update | Cancelamento não promete desfazer commit; reabrir e conferir |\n\nPara executar os testes de comportamento do projeto do site, use \`node --test scripts/tutorial-journals.test.mjs\`. Eles executam o código do pacote com API/DOM isolados e verificam os payloads de escrita e o cancelamento; não substituem a conferência visual na mesa.\n\n## Como usar a IA para estender este módulo\n\n${fence('text', 'Adapte example.session-notebook para Gravewright 0.3.0: [descreva uma ação de diário]. Leia frontend.json, domain-api.js, journal.sheet.context.json e os validadores de diário dessa versão. Preserve conteúdo, capa, páginas privadas, notas/segredos GM, visibility e version. Mantenha a escrita de documento completo restrita à projeção GM e o editor nativo em augment. Mostre o pacote inteiro, tradução en/pt-BR/es, passos para instalar/ativar e testes de gravação, limite de páginas, jogador, conflito e encerramento durante requisição. Não invente kind journal, não use endpoints privados e não reenvie com versão substituída.')}\n\n[Todos os tutoriais](docs:tutorial-index) · [Criar apenas o diário](docs:tutorial-create-journal) · [API pública](docs:api)` :
`## What you will build\n\nA normal browser module for **Gravewright 0.3.0** with two working actions: create a private journal from the table, then append a session draft to an existing journal. The sheet action is **Add session section**. It writes a **Session notes** page under **Sessions**, containing original draft text with audience **gm**. It preserves the existing authored text.\n\nThe package uses public \`api.journals.state\`, \`create\` and \`update\`. It imports no private host code and requires no Django app. Both surfaces use \`mode: augment\`, retaining the native editor.\n\n## 1. Start with the files\n\nUse a disposable development installation of host0.3.0, an installation-owner account for installation and a GM account in a campaign. You need a text editor and the project's prepared Python environment. There are no npm dependencies or frontend build. Create a \`session-journal\` folder under \`data/\` or another explicitly chosen development directory. Save the five files as UTF-8.\n\n${tree}\n\n${downloads('en')}\n\n## 2. Understand the different types\n\n| Concept | This example | Meaning |\n| --- | --- | --- |\n| Package type | browser module | Manifest has entry and no system/django/locales; there is no manifest kind: journal |\n| Surfaces | table.interface and journal.sheet | Where the module mounts |\n| Document type | diary | Native Journal; the other types are quest, quest_board and roll_table |\n| Page kind | text | New section contains text; image/pdf pages have different resource needs |\n| Page audience | gm | Draft page is omitted from player projections |\n\nDo not change an existing document's type to fit this example. Quests and roll tables require their own data contracts. The tool explicitly refuses those types.\n\n## 3. Package the project\n\nFrom the directory containing the five files, run in PowerShell:\n\n${psZip}\n\nOn Linux/macOS:\n\n${posixZip}\n\nThe archive listing must show \`manifest.json\` at its root beside main.js. This is an unsigned local source package. You can instead review and install the downloadable source ZIP. Do not add an extra outer directory.\n\n## 4. Install as owner and activate as GM\n\n1. As installation owner, open **Inside → Modules → Install module → Install from ZIP**.\n2. Select \`session-journal-1.0.0.zip\` and click **Install**. Local installation is the owner's explicit trust decision.\n3. Open the campaign as GM. Select the table's **Gravewright** button → **Extensions**, then **Activate** version **1.0.0** of **Session notebook**. Installation alone does not activate a campaign module.\n4. Close Extensions. The bottom-left panel contains **Journal title** and **Create session journal**.\n5. When changing the source later, increment to **1.0.1**, build/install a new ZIP and activate that version. Installed releases are immutable; do not edit their extracted files.\n\n[Your first module](docs:tutorial-first-module) explains each installation screen.\n\n## 5. Create and open a journal from scratch\n\n1. Keep the default title **Session notebook** and click **Create session journal** once. It sends \`{title, journal_type: "diary", folder_id: null}\` to create with a fresh operation UUID.\n2. Wait for confirmation. Open **Journals** at the table and open **Session notebook**. The host creates an empty private journal at the directory root.\n3. Native creation does not consume a module data field. The next sheet action writes the session draft. Do not invent a create parameter for initial content.\n\nIf creation is not confirmed, inspect Journals before clicking again. Cancellation or a lost response cannot undo a write already committed by the server.\n\n## 6. Act on an existing journal\n\n1. In the opened journal, find the added **Session notebook** panel. The native editor remains available.\n2. If you were editing, wait for the native **Saved** indicator first. The public module API does not supply a command to flush another editor's local draft.\n3. Click **Add session section**. It reads a current server projection, preserves title, visibility, introduction, cover, pages and GM documents, then appends a page.\n4. In the native index, open **Sessions → Session notes**. It reads: \`Draft: record the date, discoveries, decisions and loose ends from this session.\`\n5. The page is GM-only. Edit it using the native editor. To share it, deliberately choose the native **Make public** option and suitable journal permissions. The module does not automatically publish or present content.\n6. Close/reopen to verify persistence. A second click after the first operation finishes creates another independent page with a fresh ID. Overlapping clicks in one mount are blocked.\n\n## 7. Understand writes and conflicts\n\n\`journals.update\` takes \`journal_id\`, \`title\`, \`visibility\`, the integer \`version\` read from the server and the complete \`data\` object. For diary, data contains \`content\`, \`cover\`, \`sections\` and \`gm\`. Do not use the entire projection as data: its field names differ, including content_doc and cover_image. Each page's can_edit is projection metadata and is removed before saving.\n\nThis example writes only from a GM projection because a player's filtered projection is incomplete. The UI checks context.role, and each write separately verifies \`state.is_gm\`. The server still checks the authenticated member, campaign, permissions and revision. A player with journal editing rights continues to use the native editor.\n\nIf another window saves between reading and writing, update returns **conflict**. The module rereads current state, blocks Add and requests **Review latest journal**. Review native content and resolve local drafts before confirming the review. It never automatically retries or silently replaces version. Each later approved click is a fresh logical operation with a new UUID.\n\n## 8. Complete source\n\nstart loads CSS and catalogs through the official translation API. register synchronously declares both surfaces. Every mount owns its state; every read/write receives signal. Closing or deactivating aborts the mount, removes its listeners and disposes its panel. Labels support en, pt-BR and es; original draft titles/text remain unchanged across locales.\n\n${fileBlocks}\n\n## 9. Validate before adapting\n\n| Case | Procedure | Expected result |\n| --- | --- | --- |\n| Basic write | Create, open, add, reopen | One persisted GM page containing the original draft |\n| Existing content | Use a cover, introduction, public page, GM page and GM notes/secrets | Existing fields survive unchanged; exactly one page is appended |\n| Player | Share the journal and open another account | No module write controls; GM draft and secrets absent from projection |\n| Read-only | Open as reader; revoke editing during a mount | No allowed write; server remains the authorization boundary |\n| Other types | Open Quest, Quest board or Roll table | Type warning and no update |\n| Limit | Use a64-page diary | Add blocked; no existing page discarded |\n| Conflict | Two sessions; interleave a save between the other's read/write | Reread and explicit review, without automatic retry |\n| Lifecycle | Open/close five times; deactivate during a read | One panel per window; no late DOM updates |\n| Submitted write | Close during update | Abort does not promise rollback; reopen and inspect |\n\nFrom the website source, run \`node --test scripts/tutorial-journals.test.mjs\`. The behavioral tests execute this package against isolated API/DOM adapters and check writes/lifecycle. They complement visual testing at the table.\n\n## How to use AI to extend this module\n\n${fence('text', 'Adapt example.session-notebook for Gravewright 0.3.0 to [describe a journal action]. Read frontend.json, domain-api.js, journal.sheet.context.json and this release journal validators. Preserve introduction, cover, public/private pages, GM notes/secrets, visibility and version. Keep full-document writes restricted to the complete GM projection and the native editor augmented. Deliver the whole package, en/pt-BR/es labels, installation/activation steps and tests for writes, page limits, player access, conflict and disposal during a request. Do not invent package kind journal, call private endpoints or retry by replacing the expected version.')}\n\n[All tutorials](docs:tutorial-index) · [Create only the journal](docs:tutorial-create-journal) · [Public API](docs:api)`;
};
const createBody = locale => locale === 'pt' ? `## Crie um diário por um módulo comum\n\nEste exercício usa o mesmo pacote **Session notebook**, sem instalar um segundo módulo. O objetivo é partir da mesa sem diário aberto e criar um documento privado persistente. Para árvore, código completo, ZIP, instalação e ativação, siga [Como criar um módulo de diário](docs:tutorial-journal-module).\n\n## Execute\n\n1. Baixe o [pacote completo](${base}${id}-source.zip), instale em Módulos como proprietário e ative **Session notebook1.0.0** em **Gravewright → Extensions** como GM.\n2. No painel do módulo, preencha **Título do diário** com **Expedição do Farol** e clique **Criar diário de sessão**.\n3. Aguarde a confirmação e abra **Journals / Diários**. **Expedição do Farol** aparece na raiz, vazio e privado.\n4. Abra o documento e clique **Adicionar seção de sessão** para gravar o primeiro rascunho original. Salve o texto pelo editor nativo e reabra o diário.\n\n## A chamada pública concreta\n\nA função abaixo é o núcleo de mountCreate, executada com api/context/signal da montagem. O pacote completo inclui formulário, validação, tradução e bloqueio de duplo envio.\n\n${fence('javascript', 'const state = await api.journals.state({}, { signal });\nif (signal.aborted) return;\nif (context.role !== "gm" || state.is_gm !== true) throw new Error("GM required");\nconst result = await api.journals.create({\n  title: "Expedição do Farol", journal_type: "diary", folder_id: null\n}, { requestId: crypto.randomUUID(), signal });\nif (signal.aborted) return;\n// result.journal_id identifies the created document; result.version is its revision.')}\n\nCreate não aceita um novo tipo de pacote journal nem grava um objeto data inicial neste contrato. Para acrescentar conteúdo, leia a projeção completa GM e faça update como no tutorial principal. A conta criadora recebe acesso de proprietário ao documento; o documento começa privado.\n\n## Confira\n\nAbra outra conta como jogador e confirme que o diário privado não é listado. Clique uma vez e confirme que só um documento é criado. Desative antes de a leitura terminar e confirme que create não é enviado. Se a resposta de create se perder, confira o diretório antes de decidir criar outro documento. Não reutilize o UUID de uma operação para um diário diferente.\n\n## Como usar a IA para mudar a criação\n\n${fence('text', 'Adapte o formulário mountCreate do pacote example.session-notebook para solicitar um título original e uma pasta já existente no Gravewright0.3.0. Verifique folder_id e as permissões reais do servidor. Preserve a confirmação GM, signal e UUID por operação. Não acrescente data nem campos de manifesto inventados. Entregue código completo e testes para pasta ausente, outra campanha e duplo clique.')}\n\n[Tutorial completo](docs:tutorial-journal-module) · [Todos os tutoriais](docs:tutorial-index)` : `## Create a journal through a normal module\n\nUse the same **Session notebook** package without installing a second module. Start at the table with no journal open and create a persistent private document. Follow [the complete journal module tutorial](docs:tutorial-journal-module) for the tree, source, ZIP, installation and activation.\n\n## Run it\n\n1. Download the [complete package](${base}${id}-source.zip), install through Modules as owner and Activate **Session notebook1.0.0** under **Gravewright → Extensions** as GM.\n2. Enter **Lighthouse expedition** in **Journal title**, then click **Create session journal**.\n3. Wait for confirmation and open **Journals**. **Lighthouse expedition** appears at the root, empty and private.\n4. Open it and choose **Add session section** to write the original first draft. Edit using the native editor and reopen the journal.\n\n## The concrete public call\n\nThis is the core of mountCreate, using api/context/signal supplied by the mount. The full package adds form validation, translations and duplicate-submit prevention.\n\n${fence('javascript', 'const state = await api.journals.state({}, { signal });\nif (signal.aborted) return;\nif (context.role !== "gm" || state.is_gm !== true) throw new Error("GM required");\nconst result = await api.journals.create({\n  title: "Lighthouse expedition", journal_type: "diary", folder_id: null\n}, { requestId: crypto.randomUUID(), signal });\nif (signal.aborted) return;\n// result.journal_id identifies the created document; result.version is its revision.')}\n\nCreate does not add a package type named journal or accept initial data in this contract. To add content, read the full GM projection and call update as in the main tutorial. The creating account receives ownership access and the new document starts private.\n\n## Verify\n\nOpen a player account and verify the private journal is absent. Click once and confirm one document. Deactivate before the read completes and confirm create is never sent. If the create response is lost, inspect Journals before deciding to create another document. Never reuse the operation UUID for a different journal.\n\n## How to use AI to change creation\n\n${fence('text', 'Adapt mountCreate in example.session-notebook to request an original title and an existing folder in Gravewright0.3.0. Verify folder_id and actual server permissions. Preserve the GM check, signal and one UUID per logical operation. Do not add data or invented manifest fields. Deliver complete code and tests for missing folder, another campaign and double submission.')}\n\n[Complete tutorial](docs:tutorial-journal-module) · [All tutorials](docs:tutorial-index)`;
export const tutorialJournalArticles = [
  { slug, group: 'tutorials', sourcePaths, en: { title: 'How to create a journal module', summary: 'Build, install and run a normal module that creates private journals and appends saved GM session drafts.', body: body('en') }, pt: { title: 'Como criar um módulo de diário', summary: 'Crie, instale e execute um módulo comum que cria diários privados e acrescenta rascunhos de sessão persistentes.', body: body('pt') } },
  { slug: 'tutorial-create-journal', group: 'tutorials', sourcePaths, en: { title: 'Create a journal from a module, from scratch', summary: 'Use the public create operation from a table.interface form and open the resulting private document.', body: createBody('en') }, pt: { title: 'Como criar um diário do zero por um módulo', summary: 'Use create pelo formulário table.interface e abra o documento privado criado.', body: createBody('pt') } }
];
