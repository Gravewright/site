// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Scene center": "Scene center",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Scene center marker": "Scene center marker"
      },
      "pt-BR": {
        "Scene center": "Centro da cena",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Scene center marker": "Marcador do centro da cena"
      }
    });
  },
  register({ register }) {
    register("scene.overlay", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Scene center marker"));
    const output = el("pre"); output.setAttribute("role", "status");
    panel.append(heading, output); root.append(panel);
    onDispose(() => panel.remove());
    const report = error => {
      if (!signal.aborted) output.textContent = t("Error: {code}", { code: error.code ?? "unavailable" });
    };
    panel.remove();
    const marker = el("span", t("Scene center"));
    marker.className = "gw-example-center";
    root.append(marker);
    onDispose(() => marker.remove());
    const center = { x: context.width / 2, y: context.height / 2 };
    const position = () => {
      if (signal.aborted) return;
      const point = viewport.sceneToViewport(center);
      const inverse = viewport.viewportToScene(point);
      if (Math.abs(inverse.x - center.x) > 0.01 || Math.abs(inverse.y - center.y) > 0.01) throw new Error("Invalid viewport transform");
      marker.style.left = point.x + "px";
      marker.style.top = point.y + "px";
    };
    position();
    onDispose(events.on("scene.viewport.changed", position));
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
