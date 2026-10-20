// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Search": "Search",
        "Search documents": "Search documents",
        "No results": "No results",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Authorized document search": "Authorized document search"
      },
      "pt-BR": {
        "Search": "Buscar",
        "Search documents": "Buscar documentos",
        "No results": "Nenhum resultado",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Authorized document search": "Busca de documentos autorizados"
      }
    });
  },
  register({ register }) {
    register("table.interface", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Authorized document search"));
    const output = el("pre"); output.setAttribute("role", "status");
    panel.append(heading, output); root.append(panel);
    onDispose(() => panel.remove());
    const report = error => {
      if (!signal.aborted) output.textContent = t("Error: {code}", { code: error.code ?? "unavailable" });
    };
    const form = el("form");
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
        output.textContent = value.map(result => result.title + " (" + result.kind + ") · " + (result.snippet ?? "")).join("\n") || t("No results");
      } catch (error) { if (current === ticket) report(error); }
    }, { signal });
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
