export const recipes=[
{
  id:"history",
  label:"Read visible chat history",
  description:"Leave Scene UUID empty to use the broadcast scene, or enter an authorized scene UUID. The returned array is the visible recent history, not every message ever sent.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID, optional",
    "type": "text",
    "value": "",
    "required": false
  }
],
  run:async ({api,signal},v)=>api.chat.history(v.sceneId.trim()?{sceneId:v.sceneId.trim()}:{},{signal})
},
{
  id:"public-message",
  label:"Send one public message",
  description:"Enter original text. This recipe rejects a leading slash so the public action cannot accidentally become a command. Optional scene selection uses sceneId.",
  fields:[
  {
    "name": "text",
    "label": "Public message",
    "type": "text",
    "value": "The harbor gates are open.",
    "required": true
  },
  {
    "name": "sceneId",
    "label": "Scene UUID, optional",
    "type": "text",
    "value": "",
    "required": false
  }
],
  run:async ({api,signal},v)=>{const text=v.text.trim();if(text.startsWith('/'))throw new Error('Use a dedicated command recipe.');return api.chat.send({text,...(v.sceneId.trim()?{sceneId:v.sceneId.trim()}:{})},{signal,requestId:crypto.randomUUID()});}
},
{
  id:"whisper",
  label:"Send a recipient-bound whisper",
  description:"Enter the exact display name of a member in this campaign, including spaces. Native /w parsing resolves members, not a client-supplied audience list. Identical display names can resolve multiple matching members.",
  fields:[
  {
    "name": "recipient",
    "label": "Exact member display name",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "text",
    "label": "Private message",
    "type": "text",
    "value": "Meet me at the lighthouse.",
    "required": true
  }
],
  run:async ({api,signal},v)=>api.chat.send({text:'/w '+v.recipient.trim()+' '+v.text.trim()},{signal,requestId:crypto.randomUUID()})
},
{
  id:"gm-message",
  label:"Send a message to the GMs",
  description:"The /gm native command addresses campaign GMs plus the sender. It is a chat command, not a visibility field on chat.send.",
  fields:[
  {
    "name": "text",
    "label": "Message to GMs",
    "type": "text",
    "value": "A hidden passage was found.",
    "required": true
  }
],
  run:async ({api,signal},v)=>api.chat.send({text:'/gm '+v.text.trim()},{signal,requestId:crypto.randomUUID()})
},
{
  id:"emote",
  label:"Publish an emote",
  description:"Enter an action. The native /me command marks the message as an emote and retains normal public delivery.",
  fields:[
  {
    "name": "text",
    "label": "Emote text",
    "type": "text",
    "value": "lights the harbor beacon.",
    "required": true
  }
],
  run:async ({api,signal},v)=>api.chat.send({text:'/me '+v.text.trim()},{signal,requestId:crypto.randomUUID()})
},
{
  id:"dice",
  label:"Roll and publish public or GM-only dice",
  description:"Enter an expression supported by the native parser, label and repeat count. GM-only result chooses visibility gm. This action persists and publishes a roll; it is not a local calculator.",
  fields:[
  {
    "name": "expression",
    "label": "Dice expression",
    "type": "text",
    "value": "2d6+1",
    "required": true
  },
  {
    "name": "label",
    "label": "Label, up to 48 characters",
    "type": "text",
    "value": "Harbor check",
    "required": true
  },
  {
    "name": "repeat",
    "label": "Repeat, integer 1 to 12",
    "type": "number",
    "value": 1,
    "required": true
  },
  {
    "name": "secret",
    "label": "GM-only result",
    "type": "checkbox",
    "value": false
  }
],
  run:async ({api,signal},v)=>{if(!Number.isInteger(v.repeat)||v.repeat<1||v.repeat>12)throw new Error('Repeat must be 1 to 12.');return api.dice.roll(v.expression,{label:v.label,repeat:v.repeat,visibility:v.secret?'gm':'public'},{signal,requestId:crypto.randomUUID()});}
},
{
  id:"remove-message",
  label:"Moderate one message",
  description:"As GM, copy the numeric ID from history. This removes that message content and attachments while preserving retry identity.",
  fields:[
  {
    "name": "messageId",
    "label": "Numeric message ID",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required.');if(!/^\d+$/.test(v.messageId))throw new Error('Use the numeric chat ID from history.');return api.chat.remove(v.messageId,{signal});}
},
{
  id:"clear-chat",
  label:"Clear the disposable campaign chat",
  description:"Use only a disposable campaign. Type CLEAR CHAT. This GM moderation operation is campaign-wide, including scenes, rather than just the history currently displayed.",
  fields:[
  {
    "name": "confirmation",
    "label": "Type CLEAR CHAT",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required.');if(v.confirmation!=='CLEAR CHAT')throw new Error('Type CLEAR CHAT to clear the whole campaign chat.');return api.chat.clear({signal});}
},
{
  id:"lobby",
  label:"Inspect the ready check and selectable actors",
  description:"The installation must have its native ready check enabled. Read members, summary and the actors this account may select.",
  fields:[],
  run:async ({api,signal})=>api.table.lobby({signal})
},
{
  id:"set-ready",
  label:"Update this member’s ready state",
  description:"Set the checkbox, a selectable actor UUID from the lobby result, and assets_state. Leave actor UUID blank to clear the selection. The API chooses the current member; no user ID can impersonate someone else.",
  fields:[
  {
    "name": "ready",
    "label": "I am ready",
    "type": "checkbox",
    "value": true
  },
  {
    "name": "actorId",
    "label": "Selected owned actor UUID, optional",
    "type": "text",
    "value": "",
    "required": false
  },
  {
    "name": "assets",
    "label": "Asset state: unknown/loading/ready/error",
    "type": "text",
    "value": "ready",
    "required": true
  }
],
  run:async ({api,signal},v)=>{if(!['unknown','loading','ready','error'].includes(v.assets))throw new Error('Choose a native assets_state.');if(v.actorId.trim()){const lobby=await api.table.lobby({signal});if(!lobby.actors.some(actor=>actor.id===v.actorId.trim()))throw new Error('Actor is not selectable.');}return api.table.updateLobby({is_ready:v.ready,assets_state:v.assets,selected_actor_id:v.actorId.trim()||null},{signal});}
},
{
  id:"search",
  label:"Search all seven document kinds",
  description:"Use at least two characters. Blank kind searches all; accepted filters are actor, item, journal, quest, quest_board, scene and compendium. A result is a search projection with title, kind, snippet and actions, not a full document.",
  fields:[
  {
    "name": "query",
    "label": "At least two search characters",
    "type": "text",
    "value": "Harbor",
    "required": true
  },
  {
    "name": "kind",
    "label": "Kind, optional",
    "type": "text",
    "value": "",
    "required": false
  }
],
  run:async ({api,signal},v)=>{const kind=v.kind.trim();if(!['','actor','item','journal','quest','quest_board','scene','compendium'].includes(kind))throw new Error('Unknown search kind.');return api.table.search(v.query,{...(kind?{kind}:{}),signal});}
},
{
  id:"recent",
  label:"Revalidate a recent document",
  description:"Use one previously read result ID. Recent references use type journal for quests and quest boards, while search kind distinguishes those categories. Up to 12 unique references can be supplied in an array.",
  fields:[
  {
    "name": "type",
    "label": "Reference type: actor/item/journal/scene/compendium",
    "type": "text",
    "value": "journal",
    "required": true
  },
  {
    "name": "id",
    "label": "Previously seen document UUID",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,signal},v)=>{if(!['actor','item','journal','scene','compendium'].includes(v.type))throw new Error('Invalid reference type.');return api.table.search('',{recent:[{id:v.id,type:v.type}],signal});}
}
];
