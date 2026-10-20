import {createLibrary} from "./library.mjs";

export default {
  start({styles}) { styles.use("styles.css"); },
  register({register}) {
    register("table.interface", async ({root, api, storage, signal, onDispose}) => {
      const library = createLibrary({api, storage, signal});
      const el = (tag, text) => {
        const node = root.ownerDocument.createElement(tag);
        if (text !== undefined) node.textContent = text;
        return node;
      };
      const panel = el("section"); panel.className = "harbor-library";
      const prepare = el("button", "Prepare my library");
      const refresh = el("button", "Refresh list");
      const read = el("button", "Read snapshot");
      const copy = el("button", "Import copy");
      for (const button of [prepare, refresh, read, copy]) button.type = "button";
      const packLabel = el("label", "Compendium");
      const packs = el("select"); packLabel.append(packs);
      const entryLabel = el("label", "Entry");
      const entries = el("select"); entryLabel.append(entries);
      const output = el("pre"); output.setAttribute("role", "status");
      panel.append(el("h3", "Harbor library"), prepare, refresh, packLabel, entryLabel, read, copy, output);
      root.append(panel); onDispose(() => panel.remove());
      let state, busy = true, importAttempt;
      const controls = () => {
        prepare.disabled = busy || !state?.isGM;
        refresh.disabled = busy;
        read.disabled = busy || !entries.value;
        copy.disabled = busy || !state?.isGM || !entries.value;
        packs.disabled = busy; entries.disabled = busy;
      };
      const options = (select, rows, selected) => {
        select.replaceChildren();
        const empty = el("option", "Choose..."); empty.value = ""; select.append(empty);
        for (const row of rows) { const option = el("option", row.name); option.value = row.id; select.append(option); }
        select.value = rows.some(row => row.id === selected) ? selected : "";
      };
      const chooseEntries = selected => {
        options(entries, state?.packs.find(pack => pack.id === packs.value)?.entries ?? [], selected);
        controls();
      };
      const load = async (packId = packs.value, entryId = entries.value) => {
        const next = await api.compendiums.state({}, {signal});
        if (signal.aborted) return;
        state = next; options(packs, state.packs, packId); chooseEntries(entryId);
      };
      const run = async task => {
        if (busy || signal.aborted) return;
        busy = true; controls(); output.textContent = "Working...";
        try { await task(); }
        catch (error) { if (!signal.aborted) output.textContent = "Error: " + (error.code ?? "unavailable") + ". Refresh and review before retrying."; }
        finally { if (!signal.aborted) {busy = false; controls();} }
      };
      prepare.addEventListener("click", () => void run(async () => {
        const saved = await library.prepare();
        await load(saved.packId, saved.entryId);
        if (!signal.aborted) output.textContent = "Library ready. Select Read snapshot or Import copy.";
      }), {signal});
      refresh.addEventListener("click", () => void run(async () => {await load(); if (!signal.aborted) output.textContent = "List refreshed.";}), {signal});
      packs.addEventListener("change", () => {chooseEntries(""); importAttempt = undefined;}, {signal});
      entries.addEventListener("change", () => {importAttempt = undefined; controls();}, {signal});
      read.addEventListener("click", () => void run(async () => {
        const value = await library.read(packs.value, entries.value);
        if (!signal.aborted) output.textContent = JSON.stringify(value, null, 2);
      }), {signal});
      copy.addEventListener("click", () => void run(async () => {
        importAttempt ??= {packId: packs.value, entryId: entries.value, requestId: crypto.randomUUID()};
        const created = await library.importCopy(importAttempt.packId, importAttempt.entryId, importAttempt.requestId);
        importAttempt = undefined;
        if (!signal.aborted) output.textContent = "Imported " + created.kind + ": " + created.id + ". Open Journals to inspect it.";
      }), {signal});
      controls();
      try { await load(); }
      catch (error) { if (!signal.aborted) output.textContent = "Error: " + (error.code ?? "unavailable"); }
      finally { if (!signal.aborted) {busy = false; controls();} }
    });
  },
  stop() {},
};
