export const recipes=[
{
  id:"inspect",
  label:"Inspect scenes, folders and native layers",
  description:"Run with the Scene ID blank first. Copy the test scene ID, enter it and run again to inspect walls, images, lights, fog, lighting and their returned versions.",
  fields:[
  {
    "name": "mapId",
    "label": "Optional scene ID",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,context,signal},v) => {

  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    const directory=await api.maps.state({},read);
    const layers=v.mapId.trim()?await api.maps.layers({mapId:v.mapId.trim()},read):null;
    return {directory,layers};
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"metadata",
  label:"Rename the test scene and set grid visibility",
  description:"Use a disposable scene. Name and gridVisible are supplied settings; other scene settings remain unchanged. Do not send the entire projected scene as settings.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "name",
    "label": "Scene name",
    "value": "Workshop chamber",
    "type": "text",
    "required": true
  },
  {
    "name": "gridVisible",
    "label": "Show grid",
    "value": true,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    const before=await api.maps.get(v.mapId,{},read);
    await api.maps.update({mapId:before.id,version:before.version,settings:{name:v.name,gridVisible:v.gridVisible}},write());
    return await api.maps.get(before.id,{},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"folder-create",
  label:"Create a scene folder",
  description:"Enter an original folder label. Copy created.folderId for the next two recipes.",
  fields:[
  {
    "name": "label",
    "label": "Folder label",
    "value": "Workshop scenes",
    "type": "text",
    "required": true
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    const created=await api.maps.createFolder({label:v.label,color:'#b49a5a',parentId:null},write());
    return {created,folders:(await api.maps.state({},read)).folders};
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"folder-update",
  label:"Rename or reparent a scene folder",
  description:"Use the folder created above. Blank Parent puts it at the root. The server rejects cycles, foreign folders and nesting deeper than its supported limit.",
  fields:[
  {
    "name": "folderId",
    "label": "Folder ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "label",
    "label": "New label",
    "value": "Workshop rooms",
    "type": "text",
    "required": true
  },
  {
    "name": "parentId",
    "label": "Parent folder ID, blank for root",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    await api.maps.updateFolder({folderId:v.folderId,label:v.label,color:'#b49a5a',parentId:v.parentId.trim()||null},write());
    return (await api.maps.state({},read)).folders;
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"move",
  label:"Move the scene into the tutorial folder",
  description:"Paste the test scene and folder IDs. This command uses groupId; it is not the journal folder_id contract.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "folderId",
    "label": "Folder ID, blank for root",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    await api.maps.get(v.mapId,{},read);
    await api.maps.move({mapId:v.mapId,groupId:v.folderId.trim()||null},write());
    return await api.maps.get(v.mapId,{},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"door-create",
  label:"Draw a native test door through updateObjects",
  description:"Use a scene at least 8 cells wide. Coordinates are scene pixels, not the cell coordinates used by token.move. The endpoints must differ. This creates a plain native door with no blueprint or image dependency.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "x1",
    "label": "Start x in scene pixels",
    "value": 70,
    "type": "number",
    "required": true
  },
  {
    "name": "y1",
    "label": "Start y in scene pixels",
    "value": 70,
    "type": "number",
    "required": true
  },
  {
    "name": "x2",
    "label": "End x in scene pixels",
    "value": 210,
    "type": "number",
    "required": true
  },
  {
    "name": "y2",
    "label": "End y in scene pixels",
    "value": 70,
    "type": "number",
    "required": true
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    await api.maps.get(v.mapId,{},read);
    const result=await api.maps.updateObjects({mapId:v.mapId,area:'walls',action:'create',data:{x1:v.x1,y1:v.y1,x2:v.x2,y2:v.y2,kind:'door',door_state:'closed'}},write());
    return {created:result.wall,layers:await api.maps.layers({mapId:v.mapId},read)};
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"door-update",
  label:"Adjust a door endpoint with its object version",
  description:"Use the door created above. Only x2 changes; the native validator retains its other fields. Scene version and object version are different.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "doorId",
    "label": "Door ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "x2",
    "label": "New end x in scene pixels",
    "value": 280,
    "type": "number",
    "required": true
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    const layers=await api.maps.layers({mapId:v.mapId},read);
    const door=layers.walls.find(row=>row.id===v.doorId&&row.kind==='door');
    if(!door) throw new Error('Choose a door from this scene');
    await api.maps.updateObjects({mapId:v.mapId,area:'walls',action:'update',data:{wall_id:door.id,version:door.version,x2:v.x2}},write());
    return (await api.maps.layers({mapId:v.mapId},read)).walls.find(row=>row.id===door.id);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"door-operate",
  label:"Open or close the plain test door",
  description:"Enter open, run, then enter closed and run again. This recipe deliberately uses a plain door. On a Smart Object the same interaction may execute authored graphs instead of applying a simple toggle.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "doorId",
    "label": "Door ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "state",
    "label": "Door state: open, closed or locked",
    "value": "open",
    "type": "text",
    "required": true
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    if(!['open','closed','locked'].includes(v.state)) throw new Error('Use open, closed or locked');
    const layers=await api.maps.layers({mapId:v.mapId},read);
    const door=layers.walls.find(row=>row.id===v.doorId&&row.kind==='door');
    if(!door||door.blueprint) throw new Error('Choose the plain tutorial door without a blueprint');
    return await api.maps.updateObjects({mapId:v.mapId,area:'walls',action:'door',data:{wall_id:door.id,door_state:v.state}},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"activate",
  label:"Broadcast the prepared test scene",
  description:"Choose the disposable prepared scene and explicitly check the broadcast box. activate makes the scene player-visible and changes the campaign broadcast.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "confirm",
    "label": "I intend to broadcast this test scene to players",
    "value": false,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    if(!v.confirm) throw new Error('Confirm the test scene broadcast');
    await api.maps.get(v.mapId,{},read);
    await api.maps.activate({mapId:v.mapId},write());
    return await api.maps.state({},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"door-delete",
  label:"Delete only the tutorial door",
  description:"Use only the door created in this tutorial and confirm. A Smart Object deletion can have authored destruction effects; the tutorial plain door has none.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "doorId",
    "label": "Door ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "confirm",
    "label": "I selected disposable tutorial data",
    "value": false,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    if(!v.confirm) throw new Error('Confirm the disposable door');
    const layers=await api.maps.layers({mapId:v.mapId},read);
    const door=layers.walls.find(row=>row.id===v.doorId&&row.kind==='door');
    if(!door) throw new Error('Door not found');
    await api.maps.updateObjects({mapId:v.mapId,area:'walls',action:'delete',data:{wall_id:door.id,expected_version:door.version}},write());
    return await api.maps.layers({mapId:v.mapId},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"folder-delete",
  label:"Remove the test folder while keeping scenes",
  description:"Use the folder created here. recursive:false moves contained scenes/child folders to the parent instead of deleting the scene tree.",
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
    "label": "I selected disposable tutorial data",
    "value": false,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    if(!v.confirm) throw new Error('Confirm the disposable folder');
    await api.maps.deleteFolder({folderId:v.folderId,recursive:false},write());
    return await api.maps.state({},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
},
{
  id:"delete",
  label:"Delete the disposable scene last",
  description:"Run last on the disposable scene only, after the token/combat tutorials. Scene deletion also removes its scene-owned content.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "confirm",
    "label": "I selected the disposable scene and its test contents",
    "value": false,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({api,context,signal},v) => {
  if(context.role!=='gm') throw new Error('GM required');
  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    if(!v.confirm) throw new Error('Confirm the disposable scene');
    await api.maps.get(v.mapId,{},read);
    await api.maps.delete({mapId:v.mapId},write());
    return await api.maps.list({},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.maps.state({},read);
    throw problem;
  }
}
}
];
