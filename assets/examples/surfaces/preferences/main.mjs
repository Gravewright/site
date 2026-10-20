// Original documentation example. License: MIT. Target: Gravewright 0.3.0, SDK 1.x.
export default {
  start({ api, styles }) {
    styles.use("styles.css");
    api.i18n.register({
      "en": {
        "Density": "Density",
        "Comfortable": "Comfortable",
        "Compact": "Compact",
        "Save": "Save",
        "Saved": "Saved",
        "Conflict: latest value reloaded. Choose again and save.": "Conflict: latest value reloaded. Choose again and save.",
        "Refresh": "Refresh",
        "Loading…": "Loading…",
        "Error: {code}": "Error: {code}",
        "Persistent personal density preference": "Persistent personal density preference"
      },
      "pt-BR": {
        "Density": "Densidade",
        "Comfortable": "Confortável",
        "Compact": "Compacta",
        "Save": "Salvar",
        "Saved": "Salvo",
        "Conflict: latest value reloaded. Choose again and save.": "Conflito: valor recente recarregado. Escolha novamente e salve.",
        "Refresh": "Atualizar",
        "Loading…": "Carregando…",
        "Error: {code}": "Erro: {code}",
        "Persistent personal density preference": "Preferência pessoal persistente de densidade"
      }
    });
  },
  register({ register }) {
    register("preferences", { mode: "augment", mount: this.mount });
  },
  async mount({ root, context, api, storage, viewport, events, signal, onDispose }) {
    const el = (tag, text) => {
      const node = root.ownerDocument.createElement(tag);
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const t = (key, params) => api.i18n.t(key, params);
    const panel = el("section"); panel.className = "gw-example";
    const heading = el("h3", t("Persistent personal density preference"));
    const output = el("pre"); output.setAttribute("role", "status");
    panel.append(heading, output); root.append(panel);
    onDispose(() => panel.remove());
    const report = error => {
      if (!signal.aborted) output.textContent = t("Error: {code}", { code: error.code ?? "unavailable" });
    };
    const label = el("label", t("Density"));
    const select = el("select");
    for (const [value, title] of [["comfortable", "Comfortable"], ["compact", "Compact"]]) {
      const option = el("option", t(title)); option.value = value; select.append(option);
    }
    label.append(select);
    const save = el("button", t("Save")); save.type = "button";
    save.disabled = true;
    panel.append(label, save);
    let previous = null, ready = false;
    const apply = record => {
      if (record && (!record.value || record.value.version !== 1 || !["comfortable", "compact"].includes(record.value.density))) {
        throw Object.assign(new Error("Unsupported preference data"), { code: "invalid_data" });
      }
      previous = record;
      const density = record?.value.density ?? "comfortable";
      select.value = density;
      panel.classList.toggle("gw-example--compact", density === "compact");
    };
    try { const record = await storage.user.get("density"); if (!signal.aborted) { apply(record); ready = true; save.disabled = false; } }
    catch (error) { report(error); }
    save.addEventListener("click", async () => {
      save.disabled = true;
      try {
        const saved = await storage.user.set("density", { version: 1, density: select.value }, { expectedRevision: previous?.revision ?? null });
        if (!signal.aborted) { apply(saved); output.textContent = t("Saved"); }
      } catch (error) {
        if (error.code === "conflict") {
          try { const latest = await storage.user.get("density"); if (!signal.aborted) { apply(latest); output.textContent = t("Conflict: latest value reloaded. Choose again and save."); } }
          catch (refreshError) { ready = false; report(refreshError); return; }
        } else report(error);
      } finally { if (!signal.aborted) save.disabled = !ready; }
    }, { signal });
  },
  stop() {
    // Mount and module lifetimes already dispose styles, catalogs and subscriptions.
  }
};
