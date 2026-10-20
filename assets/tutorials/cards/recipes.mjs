export const recipes=[
{
  id:"inspect",
  label:"Find decks, your hand and scene cards",
  description:"Run without a scene first. Copy a scene UUID from scenes, run again with it, and keep the IDs/versions from hand or cards.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID, optional",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,signal},values) => {
  const maps = await api.maps.state({}, {signal});
  const cards = await api.cards.state(values.sceneId ? {sceneId:values.sceneId} : {}, {signal});
  return {scenes:maps.maps.map(row=>({id:row.id,name:row.name})),...cards};
}
},
{
  id:"create",
  label:"Create a text-only deck",
  description:"Run once as GM. This route creates an instance directly, without image assets or a reusable definition. Copy id as your deck UUID.",
  fields:[],
  run:async ({api,signal}) => {
  return api.cards.create({name:"Harbor signals",cards:["Blue lantern","Return to harbor","Hold position"]}, {signal});
}
},
{
  id:"define",
  label:"Define and instantiate a deck with optional artwork",
  description:"Choose original PNG/JPEG/WebP images or leave both files empty. The host uploads real File objects, defines two cards and creates an instance. Keep deckDefinitionId to instantiate another copy with the same public method.",
  fields:[
  {
    "name": "front",
    "label": "Optional original front image",
    "value": "",
    "type": "file",
    "required": false
  },
  {
    "name": "back",
    "label": "Optional original back image",
    "value": "",
    "type": "file",
    "required": false
  }
],
  run:async ({api,host,signal},values) => {
  const front = values.front ? await host.call("card.asset.upload", {purpose:"card_front",file:values.front}, {signal}) : null;
  const back = values.back ? await host.call("card.asset.upload", {purpose:"card_back",file:values.back}, {signal}) : null;
  const definition = await api.cards.define({name:"Reusable harbor signals",default_back_asset_id:back?.assetId ?? null,cards:[
    {name:"Blue lantern",front_asset_id:front?.assetId ?? null},
    {name:"Hold position",front_asset_id:front?.assetId ?? null},
  ]}, {signal});
  const instance = await api.cards.instantiate({deck_definition_id:definition.deck.id}, {signal});
  return {deckDefinitionId:definition.deck.id,deckId:instance.id};
}
},
{
  id:"members",
  label:"Find a recipient for a transfer",
  description:"Use this if the host has the ready-check/lobby feature enabled. Copy a real member userId for Draw recipient or Give. If disabled, obtain the authorized member UUID from your controlled test fixture; do not guess IDs.",
  fields:[],
  run:async ({api,signal}) => {
  const lobby = await api.table.lobby({signal});
  return lobby.members.map(row=>({userId:row.user_id,name:row.name,role:row.role}));
}
},
{
  id:"draw",
  label:"Draw cards into a real destination",
  description:"Use a deck instance UUID, count 1 and destination hand for the first run. scene/table need a scene UUID. chat deliberately publishes a card event and discards the drawn cards; use it only when that is the intended action. Only GM can choose another recipient.",
  fields:[
  {
    "name": "deckId",
    "label": "Deck instance UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "count",
    "label": "Count",
    "value": 1,
    "type": "number",
    "required": true
  },
  {
    "name": "destination",
    "label": "Destination: hand, scene, table or chat",
    "value": "hand",
    "type": "text",
    "required": true
  },
  {
    "name": "sceneId",
    "label": "Scene UUID for scene/table",
    "value": "",
    "type": "text",
    "required": false
  },
  {
    "name": "recipient",
    "label": "Recipient UUID, blank for yourself",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,signal},values) => {
  return api.cards.draw({deck_instance_id:values.deckId,count:values.count,destination:values.destination,
    ...(values.sceneId ? {sceneId:values.sceneId} : {}),...(values.recipient ? {recipient:values.recipient} : {}),
    face_state:"face_up",x:140,y:140}, {signal});
}
},
{
  id:"card-actions",
  label:"Play, move, reveal and transfer a controlled card",
  description:"After Draw to your hand, paste its card UUID and a scene UUID. Run place, then move, flip and take one at a time. Give needs a real recipient; switch to that account to continue. Discard sends to discard; return sends back to draw.",
  fields:[
  {
    "name": "id",
    "label": "Controlled card UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "action",
    "label": "Action: place, move, flip, take, give, discard or return",
    "value": "place",
    "type": "text",
    "required": true
  },
  {
    "name": "sceneId",
    "label": "Scene UUID, needed for scene cards",
    "value": "",
    "type": "text",
    "required": false
  },
  {
    "name": "recipient",
    "label": "Recipient UUID for give",
    "value": "",
    "type": "text",
    "required": false
  },
  {
    "name": "x",
    "label": "Scene x",
    "value": 140,
    "type": "number",
    "required": true
  },
  {
    "name": "y",
    "label": "Scene y",
    "value": 140,
    "type": "number",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const state = await api.cards.state(values.sceneId ? {sceneId:values.sceneId} : {}, {signal});
  const card = [...state.hand,...state.cards].find(row=>row.id===values.id);
  if (!card?.canControl) throw Object.assign(new Error("Card is not controllable in this view"),{code:"permission_denied"});
  const payload = {id:card.id,version:card.version};
  switch (values.action) {
    case "place": return api.cards.place({...payload,sceneId:values.sceneId,x:values.x,y:values.y,reveal:true,scale:1,z_index:0}, {signal});
    case "move": return api.cards.move({...payload,x:values.x,y:values.y,rotation:45,scale:1,z_index:1}, {signal});
    case "flip": return api.cards.flip(payload, {signal});
    case "take": return api.cards.take(payload, {signal});
    case "give": return api.cards.give({...payload,recipient:values.recipient}, {signal});
    case "discard": return api.cards.discard(payload, {signal});
    case "return": return api.cards.return(payload, {signal});
    default: throw new Error("Choose a documented card action");
  }
}
},
{
  id:"deck-actions",
  label:"Shuffle, gather or delete the test deck",
  description:"As GM use the instance UUID. shuffle randomizes the draw pile; reset gathers all cards, clears owners/scenes/faces and shuffles; deleteDeck removes the instance.",
  fields:[
  {
    "name": "deckId",
    "label": "Deck instance UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "action",
    "label": "Action: shuffle, reset or deleteDeck",
    "value": "shuffle",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const deck = (await api.cards.state({}, {signal})).decks.find(row=>row.id===values.deckId);
  if (!deck) throw new Error("Deck unavailable");
  const payload={deck_instance_id:deck.id,version:deck.version};
  switch(values.action) {
    case "shuffle": return api.cards.shuffle(payload, {signal});
    case "reset": return api.cards.reset(payload, {signal});
    case "deleteDeck": return api.cards.deleteDeck(payload, {signal});
    default: throw new Error("Choose shuffle, reset or deleteDeck");
  }
}
}
];
