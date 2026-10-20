// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "No readable items": "No readable items",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Item counts by type": "Item counts by type"
      },
      "pt-BR": {
        "No readable items": "Nenhum item legível",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Item counts by type": "Contagem de itens por tipo"
      }
    });
  },
  register({ register }) {
    register("item.directory", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Item counts by type"));
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
        const value = await api.items.list({}, { signal });
        if (signal.aborted || current !== ticket) return;
        const counts = new Map(); for (const item of value.filter(item => item.canOpen)) counts.set(item.type, (counts.get(item.type) ?? 0) + 1); output.textContent = [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([type, count]) => `${type}: ${count}`).join(" · ") || t("No readable items");
      } catch (error) { if (current === ticket) report(error); }
    };
    const refreshButton = el("button", t("Refresh")); refreshButton.type = "button";
    panel.append(refreshButton);
    refreshButton.addEventListener("click", () => void refresh(), { signal });
    onDispose(api.events.on("items.changed", () => void refresh()));

    await refresh();
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
