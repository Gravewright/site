// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Item data inspector": "Item data inspector"
      },
      "pt-BR": {
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Item data inspector": "Inspetor de dados do item"
      }
    });
  },
  register({ register }) {
    register("item.sheet", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Item data inspector"));
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
        const value = await api.items.get(context.itemId, {}, { signal });
        if (signal.aborted || current !== ticket) return;
        if (!value.canOpen) throw Object.assign(new Error("permission_denied"), { code: "permission_denied" }); output.textContent = JSON.stringify({ name: value.name, type: value.type, version: value.version, data: value.data }, null, 2);
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
