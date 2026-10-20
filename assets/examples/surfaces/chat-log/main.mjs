// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Visible messages: {count}; authors: {authors}": "Visible messages: {count}; authors: {authors}",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Visible chat statistics": "Visible chat statistics"
      },
      "pt-BR": {
        "Visible messages: {count}; authors: {authors}": "Mensagens visíveis: {count}; autores: {authors}",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Visible chat statistics": "Estatísticas do chat visível"
      }
    });
  },
  register({ register }) {
    register("chat.log", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Visible chat statistics"));
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
        const value = await api.chat.history({}, { signal });
        if (signal.aborted || current !== ticket) return;
        output.textContent = t("Visible messages: {count}; authors: {authors}", { count: value.length, authors: new Set(value.map(message => message.from.id ?? message.from.name)).size });
      } catch (error) { if (current === ticket) report(error); }
    };
    const refreshButton = el("button", t("Refresh")); refreshButton.type = "button";
    panel.append(refreshButton);
    refreshButton.addEventListener("click", () => void refresh(), { signal });
    onDispose(api.events.on("chat.changed", () => void refresh()));
    onDispose(api.events.on("chat.message", () => void refresh()));
    await refresh();
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
