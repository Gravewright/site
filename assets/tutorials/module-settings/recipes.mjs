export const recipes=[
{
  id:"user-read",
  label:"Read personal settings and list their keys",
  description:"Run before saving. A missing key returns null; this is different from an unavailable storage service.",
  fields:[],
  run:async ({storage}) => {
  return {current:await storage.user.get('workshop.preferences'),keys:await storage.user.list('workshop.')};
}
},
{
  id:"user-set",
  label:"Save a versioned personal setting with CAS",
  description:"Choose a label. Read supplies the expected revision; a concurrent edit causes conflict. Do not replace that revision and retry automatically.",
  fields:[
  {
    "name": "label",
    "label": "Panel label",
    "value": "My campaign notes",
    "type": "text",
    "required": true
  }
],
  run:async ({storage},v) => {
  const current=await storage.user.get('workshop.preferences');
  if(current && current.value?.schema!==1) throw new Error('Unsupported settings schema; migrate explicitly');
  return storage.user.set('workshop.preferences',{schema:1,label:v.label},{expectedRevision:current?.revision??null});
}
},
{
  id:"user-delete",
  label:"Delete only this tutorial preference",
  description:"Delete uses the latest revision of one exact key. No other module or campaign preference is removed.",
  fields:[],
  run:async ({storage}) => {
  const current=await storage.user.get('workshop.preferences');
  if(current) await storage.user.delete('workshop.preferences',{expectedRevision:current.revision});
  return storage.user.get('workshop.preferences');
}
},
{
  id:"table-store",
  label:"Share one GM-authored setting with the table",
  description:"GM writes; players take the read-only branch. This is shared module JSON, not permission to change unrelated documents.",
  fields:[
  {
    "name": "label",
    "label": "Shared label",
    "value": "Workshop rules of courtesy",
    "type": "text",
    "required": true
  }
],
  run:async ({api,storage,signal},v) => {
  if(!(await api.actors.state({}, {signal})).is_gm) return {readOnly:true,current:await storage.table.get('workshop.shared')};
  const current=await storage.table.get('workshop.shared');
  const saved=await storage.table.set('workshop.shared',{schema:1,label:v.label},{expectedRevision:current?.revision??null});
  return {saved,keys:await storage.table.list('workshop.')};
}
},
{
  id:"table-delete",
  label:"Remove the shared tutorial key",
  description:"Run as GM after testing the shared value.",
  fields:[],
  run:async ({storage}) => {
  const current=await storage.table.get('workshop.shared');
  if(current)await storage.table.delete('workshop.shared',{expectedRevision:current.revision});
  return storage.table.get('workshop.shared');
}
},
{
  id:"local",
  label:"Use browser-local settings and clear them",
  description:"Only UI choices belong here. This namespace is module+browser origin, shared across accounts and tables in that browser.",
  fields:[
  {
    "name": "density",
    "label": "Local density",
    "value": "compact",
    "type": "text",
    "required": true
  }
],
  run:async ({storage},v) => {
  await storage.local.set('workshop.local',{schema:1,density:v.density});
  const value=await storage.local.get('workshop.local');
  await storage.local.delete('workshop.local');
  return {observed:value,afterDelete:await storage.local.get('workshop.local')};
}
}
];
