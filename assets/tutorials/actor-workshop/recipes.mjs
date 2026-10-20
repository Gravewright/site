export const recipes=[
{
  id:"inspect",
  label:"Inspect actor types, documents and folders",
  description:"Run this first. The actorType comes from the selected system; copy an existing actor ID for later steps.",
  fields:[],
  run:async ({api,signal}) => {
  const state=await api.actors.state({}, {signal});
  return {actorTypes:state.actorTypes,actors:state.actors,folders:state.folders,players:state.players,isGM:state.is_gm};
}
},
{
  id:"create",
  label:"Create an actor using the selected system",
  description:"Enter a fictional name; create only a disposable actor. This uses the first real registered type, not an assumed RPG type.",
  fields:[
  {
    "name": "name",
    "label": "Actor name",
    "value": "Workshop scout",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},v) => {
  const state=await api.actors.state({}, {signal});
  if(!state.is_gm) throw new Error('GM required');
  const type=state.actorTypes[0]?.id;
  if(!type) throw new Error('Select a system declaring actor types first');
  const created=await api.actors.create({name:v.name,type,data:{}},{requestId:crypto.randomUUID(),signal});
  return api.actors.get(created.id,{}, {signal});
}
},
{
  id:"rename",
  label:"Rename an actor with an explicit revision",
  description:"Paste the ID created above and a new name. Only metadata changes; use saveSheet when editing system data.",
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
    "value": "Workshop navigator",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},v) => {
  const before=await api.actors.get(v.id,{}, {signal});
  await api.actors.update(v.id,{name:v.name,version:before.version},{requestId:crypto.randomUUID(),signal});
  return api.actors.get(v.id,{}, {signal});
}
},
{
  id:"folder-create",
  label:"Create and identify an actor folder",
  description:"Choose an original folder name. The service does not promise an ID in every command result, so find the newly added folder in state.",
  fields:[
  {
    "name": "name",
    "label": "Folder name",
    "value": "Workshop actors",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},v) => {
  const before=await api.actors.state({}, {signal});
  if(!before.is_gm) throw new Error('GM required');
  await api.actors.createFolder({name:v.name,color:'#b49a5a'},{requestId:crypto.randomUUID(),signal});
  const after=await api.actors.state({}, {signal});
  return after.folders.filter(folder=>!before.folders.some(old=>old.id===folder.id));
}
},
{
  id:"folder-edit",
  label:"Rename a folder and move an actor into it",
  description:"Use the disposable folder and actor IDs. parentId:null moves the folder to the root. Nesting is bounded by the service.",
  fields:[
  {
    "name": "folderId",
    "label": "Folder ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "actorId",
    "label": "Actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "name",
    "label": "Folder name",
    "value": "Workshop party",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},v) => {
  await api.actors.updateFolder({id:v.folderId,name:v.name,parentId:null,color:'#b49a5a'},{requestId:crypto.randomUUID(),signal});
  const actor=await api.actors.get(v.actorId,{}, {signal});
  await api.actors.update(actor.id,{folderId:v.folderId,version:actor.version},{requestId:crypto.randomUUID(),signal});
  return api.actors.state({}, {signal});
}
},
{
  id:"permissions",
  label:"Grant one player read access",
  description:"Copy a real player ID from Inspect, not an actor ID. Merge the existing permission map to preserve other grants.",
  fields:[
  {
    "name": "actorId",
    "label": "Actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "userId",
    "label": "Player user ID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},v) => {
  const actor=await api.actors.get(v.actorId,{}, {signal});
  if(!actor.permissions) throw new Error('GM projection required');
  await api.actors.setPermissions({id:actor.id,version:actor.version,permissions:{...actor.permissions,[v.userId]:'read'}},{requestId:crypto.randomUUID(),signal});
  return api.actors.get(actor.id,{}, {signal});
}
},
{
  id:"delete-folder",
  label:"Remove only the disposable actor folder",
  description:"Confirm a folder you created in this tutorial. recursive:false preserves actors; never use recursive:true as an unrelated cleanup shortcut.",
  fields:[
  {
    "name": "folderId",
    "label": "Folder ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "confirm",
    "label": "I chose the disposable folder",
    "value": false,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({api,signal},v) => {
  if(!v.confirm) throw new Error('Select the disposable folder confirmation');
  await api.actors.deleteFolder({id:v.folderId,recursive:false},{requestId:crypto.randomUUID(),signal});
  return api.actors.state({}, {signal});
}
},
{
  id:"delete-actor",
  label:"Delete the disposable actor",
  description:"Use only the actor created above. Deleting an actor can also remove its tokens through native domain services.",
  fields:[
  {
    "name": "id",
    "label": "Actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "confirm",
    "label": "I chose the disposable actor",
    "value": false,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({api,signal},v) => {
  if(!v.confirm) throw new Error('Select the disposable actor confirmation');
  await api.actors.delete({id:v.id},{requestId:crypto.randomUUID(),signal});
  return api.actors.list({}, {signal});
}
}
];
