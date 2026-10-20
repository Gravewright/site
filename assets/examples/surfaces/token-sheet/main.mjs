// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Link mode": "Link mode",
        "Sheet revision": "Sheet revision",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Linked or independent token inspector": "Linked or independent token inspector"
      },
      "pt-BR": {
        "Link mode": "Modo de vínculo",
        "Sheet revision": "Revisão da ficha",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Linked or independent token inspector": "Inspetor de token vinculado ou independente"
      }
    });
  },
  register({ register }) {
    register("token.sheet", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Linked or independent token inspector"));
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
        const value = await Promise.all([api.tokens.get(context.tokenId, {}, { signal }), api.actors.sheet(context.actorId, { tokenId: context.tokenId }, { signal })]);
        if (signal.aborted || current !== ticket) return;
        const [token, sheet] = value; output.textContent = `${sheet.name} · ${t("Link mode")}: ${token.linkMode} · ${t("Sheet revision")}: ${sheet.sheetVersion}`;
      } catch (error) { if (current === ticket) report(error); }
    };
    const refreshButton = el("button", t("Refresh")); refreshButton.type = "button";
    panel.append(refreshButton);
    refreshButton.addEventListener("click", () => void refresh(), { signal });
    onDispose(api.events.on("tokens.changed", () => void refresh()));

    await refresh();
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
