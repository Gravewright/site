export const recipes=[
{
  id:"create-quest",
  label:"Create a complete original quest",
  description:"As GM, enter a title, summary and objective. Create allocates an empty quest; the next independent command fills its complete original data. If setup fails, the error includes the created ID so you can repair that document.",
  fields:[
  {
    "name": "title",
    "label": "Original quest title",
    "type": "text",
    "value": "Light the Harbor Beacon",
    "required": true
  },
  {
    "name": "summary",
    "label": "Public summary",
    "type": "text",
    "value": "Bring the lighthouse back into service.",
    "required": true
  },
  {
    "name": "objective",
    "label": "Visible objective",
    "type": "text",
    "value": "Reach the beacon platform",
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required for the complete seed.');const created=await api.journals.create({title:v.title,journal_type:'quest'},{signal,requestId:crypto.randomUUID()});try{const data={status:'available',public:{summary:v.summary},gm:{},objectives:[{id:'beacon_platform',text:v.objective,completed:false,optional:false,visibleToPlayers:true,sortOrder:10}],rewards:[],tags:['tutorial'],assignees:[]};await api.journals.update({journal_id:created.journal_id,version:created.version,title:v.title,visibility:'private',data},{signal,requestId:crypto.randomUUID()});return api.journals.get(created.journal_id,{}, {signal});}catch(error){throw new Error('Quest '+created.journal_id+' was created; setup failed: '+(error.code||error.message)+'. Inspect it before creating another.');}}
},
{
  id:"read-quest",
  label:"Read quest fields and objective IDs",
  description:"Paste the created journal_id. Copy quest.objectives[].id for the completion action; the GM projection also includes gm notes and secrets that players never receive.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,signal},v)=>{const row=await api.journals.get(v.id,{}, {signal});if(row.type!=='quest')throw new Error('Choose a quest.');return row;}
},
{
  id:"status",
  label:"Advance a quest status with its revision",
  description:"Choose one of the six status values. This reads the current version once, performs one command and reads the result. A conflict is reported rather than retried.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "status",
    "label": "draft/available/active/completed/failed/archived",
    "type": "text",
    "value": "active",
    "required": true
  }
],
  run:async ({api,signal},v)=>{const row=await api.journals.get(v.id,{}, {signal});if(row.type!=='quest'||!['draft','available','active','completed','failed','archived'].includes(v.status))throw new Error('Choose a quest and valid status.');await api.journals.setStatus({journal_id:row.id,version:row.version,status:v.status},{signal,requestId:crypto.randomUUID()});return api.journals.get(row.id,{}, {signal});}
},
{
  id:"objective",
  label:"Complete or reopen an objective",
  description:"Use the ID from the read recipe, not the objective label. Completed is a boolean. The server prevents players from choosing hidden objective IDs.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "objectiveId",
    "label": "Objective ID",
    "type": "text",
    "value": "beacon_platform",
    "required": true
  },
  {
    "name": "completed",
    "label": "Completed",
    "type": "checkbox",
    "value": true
  }
],
  run:async ({api,signal},v)=>{const row=await api.journals.get(v.id,{}, {signal});if(row.type!=='quest')throw new Error('Choose a quest.');await api.journals.setObjective({journal_id:row.id,version:row.version,objective_id:v.objectiveId,completed:v.completed},{signal,requestId:crypto.randomUUID()});return api.journals.get(row.id,{}, {signal});}
},
{
  id:"assign",
  label:"Assign a readable character without dropping existing assignments",
  description:"Use an actor UUID from the Actors directory or actor API. The recipe keeps visible assignees and adds one unique ID; the server preserves assignments hidden from non-GM editors.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "actorId",
    "label": "Readable actor UUID to assign",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,signal},v)=>{await api.actors.get(v.actorId,{}, {signal});const row=await api.journals.get(v.id,{}, {signal});if(row.type!=='quest')throw new Error('Choose a quest.');await api.journals.assignCharacters({journal_id:row.id,version:row.version,assignees:[...new Set([...(row.quest.assignees||[]),v.actorId])]},{signal,requestId:crypto.randomUUID()});return api.journals.get(row.id,{}, {signal});}
},
{
  id:"create-board",
  label:"Create an empty quest board",
  description:"Create a quest_board document. Its data is empty; links to quests are separate server-owned board entries. Copy its ID for the next actions.",
  fields:[
  {
    "name": "title",
    "label": "Quest board title",
    "type": "text",
    "value": "Harbor jobs",
    "required": true
  }
],
  run:async ({api,signal},v)=>{const created=await api.journals.create({title:v.title,journal_type:'quest_board'},{signal,requestId:crypto.randomUUID()});return api.journals.get(created.journal_id,{}, {signal});}
},
{
  id:"board-create-quest",
  label:"Create and link a quest through the board",
  description:"Paste the board UUID. The native board-create command creates an available quest in the board folder and links it in one server operation.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "title",
    "label": "New linked quest title",
    "type": "text",
    "value": "Repair the harbor bell",
    "required": true
  }
],
  run:async ({api,signal},v)=>{const board=await api.journals.get(v.id,{}, {signal});if(board.type!=='quest_board')throw new Error('Choose a quest board.');const result=await api.journals.createBoardQuest({journal_id:board.id,title:v.title},{signal,requestId:crypto.randomUUID()});return {result,board:await api.journals.get(board.id,{}, {signal})};}
},
{
  id:"board-add",
  label:"Link an existing quest",
  description:"Use the board UUID and an existing readable quest UUID. This adds a board relationship; it does not copy quest content.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "questId",
    "label": "Existing quest UUID",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,signal},v)=>{await api.journals.addQuest({journal_id:v.id,quest_id:v.questId},{signal,requestId:crypto.randomUUID()});return api.journals.get(v.id,{}, {signal});}
},
{
  id:"board-pin",
  label:"Pin or unpin a board card",
  description:"Use a quest already linked to the chosen board. Pinned is boolean; pinned entries are displayed before ordinary entries.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "questId",
    "label": "Linked quest UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "pinned",
    "label": "Pinned",
    "type": "checkbox",
    "value": true
  }
],
  run:async ({api,signal},v)=>{await api.journals.pinQuest({journal_id:v.id,quest_id:v.questId,pinned:v.pinned},{signal,requestId:crypto.randomUUID()});return api.journals.get(v.id,{}, {signal});}
},
{
  id:"board-reorder",
  label:"Reverse the complete board order",
  description:"As GM, read every entry and submit every quest ID exactly once in reversed sort_order. A player’s filtered list is not a complete order. The native command validates the set and rejects concurrent membership changes.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('Use GM to read the complete board order.');const board=await api.journals.get(v.id,{}, {signal});if(board.type!=='quest_board')throw new Error('Choose a quest board.');const ids=[...board.board_entries].sort((a,b)=>a.sort_order-b.sort_order).map(entry=>entry.quest_id).reverse();await api.journals.reorderQuests({journal_id:board.id,ordered_quest_ids:ids},{signal,requestId:crypto.randomUUID()});return api.journals.get(board.id,{}, {signal});}
},
{
  id:"board-remove",
  label:"Unlink a card while preserving its quest",
  description:"Choose the board and quest relationship to remove. This is not journal deletion.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "questId",
    "label": "Quest UUID to unlink",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,signal},v)=>{await api.journals.removeQuest({journal_id:v.id,quest_id:v.questId},{signal,requestId:crypto.randomUUID()});return {board:await api.journals.get(v.id,{}, {signal}),quest:await api.journals.get(v.questId,{}, {signal})};}
}
];
