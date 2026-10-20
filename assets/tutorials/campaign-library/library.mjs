// The source text and snapshot belong to this original example.
export const journalData = {
  sections: [{
    id: "harbor-notice", title: "Harbor notice", kind: "text", audience: "public",
    content: {
      format: "gw-journal-doc-v1", version: 1,
      doc: {type: "doc", content: [{type: "paragraph", content: [
        {type: "text", text: "At sunset, the harbor keeper lights a blue lantern. Bring a coil of rope to join the watch."},
      ]}]},
    },
  }],
};

const key = "harbor-library-workflow-v1";
const fail = code => Object.assign(new Error(code), {code});

export function createLibrary({api, storage, signal}) {
  return {
    async prepare() {
      if (!(await api.compendiums.state({}, {signal})).isGM) throw fail("permission_denied");
      let record = await storage.user.get(key);
      if (record && record.value?.schema !== 1) throw fail("invalid_data");
      if (!record) record = await storage.user.set(key, {
        schema: 1,
        requests: Object.fromEntries(["pack", "journal", "body", "snapshot"].map(name => [name, crypto.randomUUID()])),
      }, {expectedRevision: null});
      const checkpoint = async changes => {
        record = await storage.user.set(key, {...record.value, ...changes}, {expectedRevision: record.revision});
      };
      // Save request identities before making writes; retries reuse exact inputs.
      if (!record.value.packId) {
        const created = await api.compendiums.create({name: "Harbor Library"}, {signal, requestId: record.value.requests.pack});
        await checkpoint({packId: created.id});
      }
      if (!record.value.journalId) {
        const created = await api.journals.create({title: "Beacon Watch", journal_type: "diary"}, {signal, requestId: record.value.requests.journal});
        await checkpoint({journalId: created.journal_id, journalVersion: created.version});
      }
      if (!record.value.bodySaved) {
        await api.journals.update({
          journal_id: record.value.journalId, version: record.value.journalVersion,
          title: "Beacon Watch", visibility: "private", data: journalData,
        }, {signal, requestId: record.value.requests.body});
        await checkpoint({bodySaved: true});
      }
      if (!record.value.entryId) {
        const added = await api.compendiums.add({
          packId: record.value.packId, kind: "journal", resourceId: record.value.journalId,
          name: "Beacon Watch",
        }, {signal, requestId: record.value.requests.snapshot});
        await checkpoint({entryId: added.id});
      }
      return record.value;
    },
    async read(packId, entryId) {
      return api.compendiums.read({packId, id: entryId}, {signal});
    },
    async importCopy(packId, entryId, requestId) {
      return api.compendiums.import({packId, id: entryId}, {signal, requestId});
    },
  };
}
