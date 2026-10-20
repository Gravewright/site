const options = signal => ({signal, requestId: crypto.randomUUID()});
const editable = packId => {
  if (packId.startsWith("native:")) throw Object.assign(new Error("Installed packs are read only"), {code: "invalid_data"});
};
export async function shareCampaignPack(api, packId, signal) {
  editable(packId);
  const pack = (await api.compendiums.state({}, {signal})).packs.find(row => row.id === packId);
  if (!pack) throw Object.assign(new Error("Pack not found"), {code: "not_found"});
  return api.compendiums.configure({packId, version: pack.version, name: "Harbor Library revised", shared: true, locked: false}, options(signal));
}
export async function grantInstalledPackRead(api, packId, signal) {
  if (!packId.startsWith("native:")) throw new Error("Use configure.shared or the native ownership editor for a table pack");
  return api.compendiums.setPermissions({packId, level: "read"}, options(signal));
}
export async function readBatch(api, packId, entryIds, signal) {
  return api.compendiums.read({packId, ids: entryIds}, {signal});
}
export async function removeSnapshot(api, packId, entryId, signal) {
  editable(packId);
  const entry = await api.compendiums.read({packId, id: entryId}, {signal});
  return api.compendiums.remove({packId, id: entryId, version: entry.version}, options(signal));
}
export async function deleteCampaignPack(api, packId, signal) {
  editable(packId);
  const pack = (await api.compendiums.state({}, {signal})).packs.find(row => row.id === packId);
  if (!pack) throw Object.assign(new Error("Pack not found"), {code: "not_found"});
  return api.compendiums.delete({packId, version: pack.version}, options(signal));
}
