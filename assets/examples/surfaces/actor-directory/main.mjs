// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Readable actors: {count}": "Readable actors: {count}",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Readable actor counter": "Readable actor counter"
      },
      "pt-BR": {
        "Readable actors: {count}": "Atores legíveis: {count}",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Readable actor counter": "Contador de atores legíveis"
      }
    });
  },
  register({ register }) {
    register("actor.directory", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Readable actor counter"));
    const output = el("pre"); output.setAttribute("role", "status");
    panel.append(heading, output); root.append(panel);
    onDispose(() => panel.remove());
    const report = error => {
      if (!signal.aborted) output.textContent = t("Error: {code}", { code: error.code ?? "unavailable" });
    };
    let ticket = 0;
    const refresh = async () => {
      const current = ++ticket;
      try {
        const value = await api.actors.list({}, { signal });
        if (signal.aborted || current !== ticket) return;
        output.textContent = t("Readable actors: {count}", { count: value.filter(actor => actor.canOpen).length });
      } catch (error) { if (current === ticket) report(error); }
    };
    const refreshButton = el("button", t("Refresh")); refreshButton.type = "button";
    panel.append(refreshButton);
    refreshButton.addEventListener("click", () => void refresh(), { signal });
    onDispose(api.events.on("actors.changed", () => void refresh()));

    await refresh();
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
