// Original tutorial. MIT. Target host: Gravewright 0.3.0, SDK 1.x.
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
