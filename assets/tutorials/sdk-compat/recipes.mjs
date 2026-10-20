export const recipes=[
{
  id:"pages",
  label:"Read every authorized actor page",
  description:"This is the original SDK DTO list, not api.actors.list. It paginates and includes opaque revision strings.",
  fields:[],
  run:async ({host,signal}) => {
  const items=[];let cursor=null;
  do {
    const page=await host.call('actor.list',{limit:50,cursor},{signal});
    items.push(...page.items);cursor=page.nextCursor;
  } while(cursor&&!signal.aborted);
  return items;
}
},
{
  id:"read",
  label:"Read one actor DTO and its data revision",
  description:"Paste a readable actor UUID. Actor metadata and sheet data have different revision domains.",
  fields:[
  {
    "name": "id",
    "label": "Actor ID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({host,signal},v) => ({
  actor:await host.call('actor.read',{id:v.id},{signal}),
  sheet:await host.call('actor.data.read',{id:v.id},{signal})
})
},
{
  id:"create",
  label:"Create a disposable actor through host.call",
  description:"The domain API discovers the selected system type. The legacy create schema accepts name/type, not an arbitrary actor data payload.",
  fields:[
  {
    "name": "name",
    "label": "Actor name",
    "value": "SDK workshop scout",
    "type": "text",
    "required": true
  }
],
  run:async ({api,host,signal},v) => {
  const type=(await api.actors.state({}, {signal})).actorTypes[0]?.id;
  if(!type)throw new Error('Choose a system with an actor type');
  return host.call('actor.create',{name:v.name,type},{signal});
}
},
{
  id:"rename",
  label:"Rename with the legacy metadata revision",
  description:"Use the disposable actor. changes contains only supported metadata changes.",
  fields:[
  {
    "name": "id",
    "label": "Actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "name",
    "label": "New name",
    "value": "SDK navigator",
    "type": "text",
    "required": true
  }
],
  run:async ({host,signal},v) => {
  const before=await host.call('actor.read',{id:v.id},{signal});
  return host.call('actor.update',{id:v.id,expectedRevision:before.revision,changes:{name:v.name}},{signal});
}
},
{
  id:"data",
  label:"Preserve a complete actor JSON while changing one owned field",
  description:"Use an external example system that accepts opaque original JSON, such as Example Expedition. workshop is owned by this example; do not overwrite fields belonging to another package.",
  fields:[
  {
    "name": "id",
    "label": "Actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "note",
    "label": "Original workshop note",
    "value": "Original test note",
    "type": "text",
    "required": true
  }
],
  run:async ({host,signal},v) => {
  const before=await host.call('actor.data.read',{id:v.id},{signal});
  const data={...before.data,workshop:{note:v.note}};
  return host.call('actor.data.update',{id:v.id,expectedRevision:before.revision,data},{signal});
}
},
{
  id:"token-read",
  label:"Read token center coordinates and its own sheet data",
  description:"Activate an existing scene and use a token from that scene. This package mounts scene.controls so the legacy scene scope is present.",
  fields:[
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({host,signal},v) => ({
  token:await host.call('token.read',{id:v.id},{signal}),
  sheet:await host.call('token.data.read',{id:v.id},{signal})
})
},
{
  id:"token-move",
  label:"Move a token using its own opaque revision",
  description:"Use a token you control and an in-bounds target center. The server converts scene pixels into its grid geometry.",
  fields:[
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "x",
    "label": "Center X in scene pixels",
    "value": 160,
    "type": "number",
    "required": true
  },
  {
    "name": "y",
    "label": "Center Y in scene pixels",
    "value": 160,
    "type": "number",
    "required": true
  }
],
  run:async ({host,signal},v) => {
  const token=await host.call('token.read',{id:v.id},{signal});
  return host.call('token.move',{id:v.id,expectedRevision:token.revision,position:{x:v.x,y:v.y}},{signal});
}
},
{
  id:"token-data",
  label:"Update the token’s resolved data without replacing unrelated fields",
  description:"For a linked token this edits actor data; for an independent token it edits its snapshot. Use only the original opaque-JSON example system.",
  fields:[
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "note",
    "label": "Original workshop note",
    "value": "Snapshot-only note",
    "type": "text",
    "required": true
  }
],
  run:async ({host,signal},v) => {
  const before=await host.call('token.data.read',{id:v.id},{signal});
  return host.call('token.data.update',{id:v.id,expectedRevision:before.revision,data:{...before.data,workshop:{note:v.note}}},{signal});
}
},
{
  id:"delete",
  label:"Delete the disposable legacy actor",
  description:"Remove only an unused actor created by this tutorial, with no scene tokens. New integrations should prefer the domain API, whose native deletion includes token/automation cleanup.",
  fields:[
  {
    "name": "id",
    "label": "Disposable actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "confirm",
    "label": "I selected the disposable actor",
    "value": false,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({host,signal},v) => {
  if(!v.confirm)throw new Error('Confirm the disposable actor');
  const actor=await host.call('actor.read',{id:v.id},{signal});
  return host.call('actor.delete',{id:v.id,expectedRevision:actor.revision},{signal});
}
}
];
