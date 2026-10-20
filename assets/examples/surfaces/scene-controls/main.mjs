// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Scene information": "Scene information",
        "Close": "Close",
        "Grid": "Grid",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Scene information control": "Scene information control"
      },
      "pt-BR": {
        "Scene information": "Informações da cena",
        "Close": "Fechar",
        "Grid": "Grade",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Scene information control": "Controle de informações da cena"
      }
    });
  },
  register({ register }) {
    register("scene.controls", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Scene information control"));
    const output = el("pre"); output.setAttribute("role", "status");
    panel.append(heading, output); root.append(panel);
    onDispose(() => panel.remove());
    const report = error => {
      if (!signal.aborted) output.textContent = t("Error: {code}", { code: error.code ?? "unavailable" });
    };
    const button = el("button", t("Scene information"));
    button.type = "button";
    panel.append(button);
    for (const type of ["pointerdown", "mousedown", "click"]) {
      panel.addEventListener(type, event => event.stopPropagation(), { signal });
    }
    let modal;
    onDispose(() => modal?.close(true));
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        const scene = await api.maps.get(context.sceneId, {}, { signal });
        if (signal.aborted) return;
        modal?.close(true);
        const section = el("section");
        section.className = "gw-example";
        section.setAttribute("aria-label", t("Scene information"));
        section.append(el("h3", scene.name), el("p", context.width + " × " + context.height + " · " + t("Grid") + ": " + context.grid.size + "px / " + context.grid.distance + " " + context.grid.unit));
        const close = el("button", t("Close"));
        close.type = "button";
        close.addEventListener("click", () => section.close(), { signal });
        section.append(close);
        modal = api.ui.openModal(section);
      } catch (error) { report(error); }
      finally { if (!signal.aborted) button.disabled = false; }
    }, { signal });
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
