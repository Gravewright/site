// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Sheet revision": "Sheet revision",
        "Data keys": "Data keys",
        "None": "None",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Actor sheet revision inspector": "Actor sheet revision inspector"
      },
      "pt-BR": {
        "Sheet revision": "Revisão da ficha",
        "Data keys": "Chaves dos dados",
        "None": "Nenhuma",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Actor sheet revision inspector": "Inspetor de revisão da ficha"
      }
    });
  },
  register({ register }) {
    register("actor.sheet", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Actor sheet revision inspector"));
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
        const value = await api.actors.sheet(context.actorId, {}, { signal });
        if (signal.aborted || current !== ticket) return;
        output.textContent = `${value.name} · ${t("Sheet revision")}: ${value.sheetVersion} · ${t("Data keys")}: ${Object.keys(value.data ?? {}).sort().join(", ") || t("None")}`;
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
