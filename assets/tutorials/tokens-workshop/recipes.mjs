export const recipes=[
{
  id:"inspect",
  label:"Inspect available actors and scene tokens",
  description:"Paste the test Scene ID from the maps tutorial. Copy a readable actor ID for Place, then a token ID for later actions.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,context,signal},v) => {

  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    return {actors:await api.actors.list({},read),tokens:await api.tokens.list({mapId:v.mapId},read)};
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"place",
  label:"Place an actor token in the test scene",
  description:"Create an original disposable actor using the native/system sheet first. Coordinates use cell-space gridX/gridY for token placement, not scene pixels. The host validates bounds and token size.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
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
    "name": "x",
    "label": "Grid x",
    "value": 2,
    "type": "number",
    "required": true
  },
  {
    "name": "y",
    "label": "Grid y",
    "value": 2,
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
    await api.actors.get(v.actorId,{},read);
    const created=await api.tokens.place({mapId:v.mapId,actorId:v.actorId,gridX:v.x,gridY:v.y},write());
    return {createdIds:created.createdIds,tokens:created.tokens};
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"move",
  label:"Move a controlled unlocked token",
  description:"Enter the token ID and a nearby destination. path:[] requests the direct segment; intermediate waypoints must use the same grid coordinates. Player movement still checks walls and ownership.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "x",
    "label": "Destination grid x",
    "value": 3,
    "type": "number",
    "required": true
  },
  {
    "name": "y",
    "label": "Destination grid y",
    "value": 2,
    "type": "number",
    "required": true
  }
],
  run:async ({api,context,signal},v) => {

  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    const token=await api.tokens.get(v.id,{mapId:v.mapId},read);
    if(!token.canControl||token.locked) throw new Error('Choose a controlled unlocked token');
    return await api.tokens.move({mapId:v.mapId,id:token.id,expectedVersion:token.version,gridX:v.x,gridY:v.y,path:[]},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"duplicate",
  label:"Duplicate one tutorial token",
  description:"Use the token placed above. The native service creates an independent snapshot and chooses its bounded offset.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
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
    await api.tokens.get(v.id,{mapId:v.mapId},read);
    const result=await api.tokens.duplicate({mapId:v.mapId,tokenIds:[v.id]},write());
    return {createdIds:result.createdIds,tokens:result.tokens};
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"configure",
  label:"Configure rotation, elevation and disposition",
  description:"Configure a single disposable token. Keep locked false for the movement recipe. Elevation can affect region eligibility. A player may rotate a controlled token only with the rotation-only values variant; this multi-field recipe is GM-only.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "rotation",
    "label": "Rotation degrees",
    "value": 90,
    "type": "number",
    "required": true
  },
  {
    "name": "elevation",
    "label": "Elevation",
    "value": 0,
    "type": "number",
    "required": true
  },
  {
    "name": "disposition",
    "label": "friendly, neutral, hostile or unknown",
    "value": "friendly",
    "type": "text",
    "required": true
  },
  {
    "name": "locked",
    "label": "Lock token movement",
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
    const token=await api.tokens.get(v.id,{mapId:v.mapId},read);
    await api.tokens.configure({mapId:v.mapId,tokenIds:[token.id],expectedVersion:token.version,values:{rotation:v.rotation,elevation:v.elevation,disposition:v.disposition,locked:v.locked}},write());
    return await api.tokens.get(token.id,{mapId:v.mapId},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"vision",
  label:"Enable and configure token vision",
  description:"Use the placed token; range is a nonnegative cell distance. To observe line-of-sight, configure dynamic lighting in the native scene and use the token controlling player.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "enabled",
    "label": "Enable vision",
    "value": true,
    "type": "checkbox",
    "required": false
  },
  {
    "name": "range",
    "label": "Vision range in cells",
    "value": 6,
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
    await api.tokens.get(v.id,{mapId:v.mapId},read);
    await api.tokens.setVision({mapId:v.mapId,tokenIds:[v.id],enabled:v.enabled,range:v.range},write());
    return await api.tokens.get(v.id,{mapId:v.mapId},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"hidden",
  label:"Hide and show the tutorial token",
  description:"Run with Hidden selected, inspect the player account, then clear it and run again. This changes token visibility, not the actor permission map.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "hidden",
    "label": "Hide from players",
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
    await api.tokens.get(v.id,{mapId:v.mapId},read);
    await api.tokens.setHidden({mapId:v.mapId,tokenIds:[v.id],hidden:v.hidden},write());
    return await api.tokens.get(v.id,{mapId:v.mapId},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"condition-add",
  label:"Add an original timed token condition",
  description:"Use an original label. This is a generic marker, not a bundled rule. Copy condition_id from the result for Remove condition. Duration advances through real forward combat events when the token participates.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "label",
    "label": "Condition label",
    "value": "Workshop focus",
    "type": "text",
    "required": true
  },
  {
    "name": "visibility",
    "label": "everyone or gm",
    "value": "everyone",
    "type": "text",
    "required": true
  },
  {
    "name": "rounds",
    "label": "Duration in rounds",
    "value": 2,
    "type": "number",
    "required": true
  }
],
  run:async ({api,context,signal},v) => {

  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    await api.tokens.get(v.id,{mapId:v.mapId},read);
    if(!['everyone','gm'].includes(v.visibility)) throw new Error('Use everyone or gm');
    if(!Number.isInteger(v.rounds)||v.rounds<1) throw new Error('Use a positive integer duration');
    if(v.visibility==='gm'&&context.role!=='gm') throw new Error('GM required for hidden conditions');
    await api.tokens.addCondition({mapId:v.mapId,tokenIds:[v.id],label:v.label,description:'Original tutorial marker with no RPG rules.',kind:'positive',visibility:v.visibility,duration:{type:'rounds',value:v.rounds,expires:'end'}},write());
    return await api.tokens.get(v.id,{mapId:v.mapId},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"condition-remove",
  label:"Remove the chosen token condition",
  description:"Paste the exact condition_id, not its display label. Remove only the marker created in this tutorial.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Token ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "conditionId",
    "label": "condition_id from Inspect",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,context,signal},v) => {

  const read={signal};
  const write=()=>{
    if(signal?.aborted) throw Object.assign(new Error('Mount closed'),{code:'cancelled'});
    return {signal,requestId:crypto.randomUUID()};
  };
  try {
    const token=await api.tokens.get(v.id,{mapId:v.mapId},read);
    if(!token.conditions.some(item=>item.condition_id===v.conditionId)) throw new Error('Choose a visible condition from this token');
    await api.tokens.removeCondition({mapId:v.mapId,tokenIds:[v.id],conditionId:v.conditionId},write());
    return await api.tokens.get(v.id,{mapId:v.mapId},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"remove",
  label:"Remove the disposable token",
  description:"Use only the tutorial token/duplicate. Run after combat cleanup. Removing a token does not delete its actor.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Token ID",
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
    if(!v.confirm) throw new Error('Confirm the disposable token');
    await api.tokens.get(v.id,{mapId:v.mapId},read);
    await api.tokens.remove({mapId:v.mapId,tokenIds:[v.id]},write());
    return await api.tokens.list({mapId:v.mapId},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.tokens.state({mapId:v.mapId},read);
    throw problem;
  }
}
}
];
