export const recipes=[
{
  id:"inspect",
  label:"Inspect this scene encounter",
  description:"Paste the disposable scene ID. It need not contain an encounter yet. Copy combatant IDs from the projected list after adding participants.",
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
    return await api.combat.state({sceneId:v.mapId},read);
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"add",
  label:"Add a placed token or an actor to combat",
  description:"Use tokenId with the two token IDs from the token tutorial, one run per token. Or use actorId for an actor without a scene token. Each Run action is one operation.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "identityType",
    "label": "Identity field: tokenId or actorId",
    "value": "tokenId",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Combatant token/actor ID",
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
    if(!['tokenId','actorId'].includes(v.identityType)) throw new Error('Use tokenId or actorId');
    const identity={[v.identityType]:v.id};
    const before=await api.combat.state({sceneId:v.mapId},read);
    return await api.combat.add({sceneId:v.mapId,version:before.version,...identity},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"configure",
  label:"Set an explicit encounter initiative formula",
  description:"On the disposable encounter only, set the generic dice expression1d20. The selected system owns its default formula/provider; this explicit native encounter override does not implement new RPG rules. Clear the input to use manual mode.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "formula",
    "label": "Formula, blank to restore manual input",
    "value": "1d20",
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
    const before=await api.combat.state({sceneId:v.mapId},read);
    return await api.combat.configure({sceneId:v.mapId,version:before.version,formula:v.formula.trim()},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"initiative",
  label:"Set one combatant initiative value",
  description:"Use a participating identity. The recipe follows the current config: text input stays text; numeric/rolled input becomes a finite number. Do not hardcode a system attribute.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "identityType",
    "label": "Identity field: tokenId or actorId",
    "value": "tokenId",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Combatant token/actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "value",
    "label": "Initiative value",
    "value": "12",
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
    if(!['tokenId','actorId'].includes(v.identityType)) throw new Error('Use tokenId or actorId');
    const identity={[v.identityType]:v.id};
    const before=await api.combat.state({sceneId:v.mapId},read);
    const value=before.config?.input==='text'?v.value:Number(v.value);
    if(typeof value==='number'&&!Number.isFinite(value)) throw new Error('Enter a finite initiative number');
    return await api.combat.setInitiative({sceneId:v.mapId,version:before.version,...identity,value},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"roll",
  label:"Roll initiative for a chosen scope",
  description:"Configure an explicit valid formula first. Missing rolls only unset entries; all rerolls all; npcs uses native player-ownership rules; one uses the supplied participating identity.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "scope",
    "label": "all, missing, npcs or one",
    "value": "missing",
    "type": "text",
    "required": true
  },
  {
    "name": "identityType",
    "label": "For one: tokenId or actorId",
    "value": "tokenId",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "For one: combatant ID",
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
    if(!['all','missing','npcs','one'].includes(v.scope)) throw new Error('Choose an initiative scope');
    const before=await api.combat.state({sceneId:v.mapId},read);
    if(!before.config?.formula) throw new Error('Configure an initiative formula first');
    const identity={};
    if(v.scope==='one'){
      if(!v.id||!['tokenId','actorId'].includes(v.identityType)) throw new Error('Supply the selected combatant identity');
      identity[v.identityType]=v.id;
    }
    return await api.combat.rollInitiative({sceneId:v.mapId,version:before.version,scope:v.scope,...identity},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"order",
  label:"Move a participant up or down",
  description:"Use a combatant and run up, then down. Manual reordering preserves the active combatant identity rather than silently granting the turn to another entry.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "identityType",
    "label": "Identity field: tokenId or actorId",
    "value": "tokenId",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Combatant token/actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "direction",
    "label": "up or down",
    "value": "up",
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
    if(!['tokenId','actorId'].includes(v.identityType)) throw new Error('Use tokenId or actorId');
    const identity={[v.identityType]:v.id};
    const before=await api.combat.state({sceneId:v.mapId},read);
    const payload={sceneId:v.mapId,version:before.version,...identity};
    if(v.direction==='up') return await api.combat.moveUp(payload,write());
    if(v.direction==='down') return await api.combat.moveDown(payload,write());
    throw new Error('Choose up or down');
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"toggle",
  label:"Set hidden and defeated flags deliberately",
  description:"The two checkboxes set exact booleans; they do not invert an unknown state. Defeated entries are skipped by forward next-turn processing. Clear both to restore the tutorial participant.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "identityType",
    "label": "Identity field: tokenId or actorId",
    "value": "tokenId",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Combatant token/actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "hidden",
    "label": "Hide combat entry from players",
    "value": false,
    "type": "checkbox",
    "required": false
  },
  {
    "name": "defeated",
    "label": "Mark defeated",
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
    if(!['tokenId','actorId'].includes(v.identityType)) throw new Error('Use tokenId or actorId');
    const identity={[v.identityType]:v.id};
    const before=await api.combat.state({sceneId:v.mapId},read);
    return await api.combat.toggle({sceneId:v.mapId,version:before.version,...identity,hidden:v.hidden,defeated:v.defeated},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"start-stop",
  label:"Start or stop the disposable encounter",
  description:"Add at least two participants. Start creates an encounter identity and begins round1/turn0. Stop resets the active cursor/history but retains participants. Use only this tutorial encounter.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "action",
    "label": "start or stop",
    "value": "start",
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
    const before=await api.combat.state({sceneId:v.mapId},read);
    const payload={sceneId:v.mapId,version:before.version};
    if(v.action==='start') return await api.combat.start(payload,write());
    if(v.action==='stop') return await api.combat.stop(payload,write());
    throw new Error('Choose start or stop');
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"set-turn",
  label:"Select a specific current participant",
  description:"Start the encounter first, then use a participating identity. This selects its position without pretending that skipped turns ran normal forward effects.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "identityType",
    "label": "Identity field: tokenId or actorId",
    "value": "tokenId",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Combatant token/actor ID",
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
    if(!['tokenId','actorId'].includes(v.identityType)) throw new Error('Use tokenId or actorId');
    const identity={[v.identityType]:v.id};
    const before=await api.combat.state({sceneId:v.mapId},read);
    return await api.combat.setTurn({sceneId:v.mapId,version:before.version,...identity},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"turns",
  label:"Advance or return one turn",
  description:"Start first. Next advances valid native turn clocks and skips defeated entries. An authorized player may end their own current turn; previous is GM-only and requires history.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "direction",
    "label": "next or previous",
    "value": "next",
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
    const before=await api.combat.state({sceneId:v.mapId},read);
    if(!before.active) throw new Error('Start combat first');
    const payload={sceneId:v.mapId,version:before.version};
    if(v.direction==='next') return await api.combat.nextTurn(payload,write());
    if(v.direction==='previous'){
      if(context.role!=='gm') throw new Error('GM required for previous turn');
      return await api.combat.previousTurn(payload,write());
    }
    throw new Error('Choose next or previous');
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"rounds",
  label:"Advance or return one round",
  description:"Use next to move forward a round, then previous to inspect the native cursor behavior. Forward rounds can advance condition/effect clocks. Previous is navigation, not an undo of persisted effects.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "direction",
    "label": "next or previous",
    "value": "next",
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
    const before=await api.combat.state({sceneId:v.mapId},read);
    if(!before.active) throw new Error('Start combat first');
    const payload={sceneId:v.mapId,version:before.version};
    if(v.direction==='next') return await api.combat.nextRound(payload,write());
    if(v.direction==='previous') return await api.combat.previousRound(payload,write());
    throw new Error('Choose next or previous');
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
},
{
  id:"remove",
  label:"Remove only a tutorial combat participant",
  description:"Stop the disposable encounter and remove its participants one at a time. This removes tracker membership, not the token or actor.",
  fields:[
  {
    "name": "mapId",
    "label": "Scene ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "identityType",
    "label": "Identity field: tokenId or actorId",
    "value": "tokenId",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Combatant token/actor ID",
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
    if(!['tokenId','actorId'].includes(v.identityType)) throw new Error('Use tokenId or actorId');
    const identity={[v.identityType]:v.id};
    if(!v.confirm) throw new Error('Confirm the tutorial participant');
    const before=await api.combat.state({sceneId:v.mapId},read);
    return await api.combat.remove({sceneId:v.mapId,version:before.version,...identity},write());
  } catch(problem) {
    if(problem.code==='conflict'&&!signal?.aborted) await api.combat.state({sceneId:v.mapId},read);
    throw problem;
  }
}
}
];
