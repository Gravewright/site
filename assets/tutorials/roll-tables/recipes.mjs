export const recipes=[
{
  id:"create-table",
  label:"Create a weighted original roll table",
  description:"As GM, create journal_type roll_table and configure its two complete entries. Weights 3 and 1 give different probabilities. Without replacement, drawn entries stop being eligible until reset.",
  fields:[
  {
    "name": "title",
    "label": "Roll table title",
    "type": "text",
    "value": "Harbor weather",
    "required": true
  },
  {
    "name": "secret",
    "label": "GM-only results",
    "type": "checkbox",
    "value": false
  },
  {
    "name": "replacement",
    "label": "Allow replacement",
    "type": "checkbox",
    "value": false
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required.');const created=await api.journals.create({title:v.title,journal_type:'roll_table'},{signal,requestId:crypto.randomUUID()});try{await api.journals.update({journal_id:created.journal_id,version:created.version,title:v.title,visibility:'private',data:{withReplacement:v.replacement,resultVisibility:v.secret?'gm':'public',entries:[{id:'clear',name:'Clear sky',weight:3,result:'The beacon is visible across the bay.',active:true,drawn:false,sortOrder:10},{id:'fog',name:'Fog',weight:1,result:'The boats wait for the fog to lift.',active:true,drawn:false,sortOrder:20}]}},{signal,requestId:crypto.randomUUID()});return api.journals.get(created.journal_id,{}, {signal});}catch(error){throw new Error('Roll table '+created.journal_id+' exists; configuration failed: '+(error.code||error.message)+'. Repair this table before creating another.');}}
},
{
  id:"read-table",
  label:"Read weights, results and draw flags",
  description:"Use the table UUID. The projected roll_table contains entries and totalWeight; GM-only result text is removed for other members.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,signal},v)=>{const row=await api.journals.get(v.id,{}, {signal});if(row.type!=='roll_table')throw new Error('Choose a roll_table journal.');return row;}
},
{
  id:"set-weight",
  label:"Change one weight while preserving every other entry",
  description:"As GM, use the exact entry ID. Copy the complete projected table and alter one weight; totalWeight is derived and omitted from the submitted data.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "entryId",
    "label": "Entry ID",
    "type": "text",
    "value": "fog",
    "required": true
  },
  {
    "name": "weight",
    "label": "Weight, integer 1 to 1000000",
    "type": "number",
    "value": 2,
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required to preserve complete results.');if(!Number.isInteger(v.weight)||v.weight<1||v.weight>1000000)throw new Error('Invalid weight.');const row=await api.journals.get(v.id,{}, {signal});if(row.type!=='roll_table')throw new Error('Choose a roll_table.');const data=structuredClone(row.roll_table);if(!data.entries.some(entry=>entry.id===v.entryId))throw new Error('Entry not found.');data.entries=data.entries.map(entry=>entry.id===v.entryId?{...entry,weight:v.weight}:entry);delete data.totalWeight;await api.journals.update({journal_id:row.id,version:row.version,title:row.title,visibility:row.visibility,data},{signal,requestId:crypto.randomUUID()});return api.journals.get(row.id,{}, {signal});}
},
{
  id:"roll",
  label:"Draw and publish one table result",
  description:"Run as GM. The native command uses a secure weighted draw, persists drawn when needed and publishes a chat result. Its payload uses mapId for an explicit scene.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "sceneId",
    "label": "Authorized scene UUID, optional",
    "type": "text",
    "value": "",
    "required": false
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required.');return api.journals.roll({journal_id:v.id,...(v.sceneId.trim()?{mapId:v.sceneId.trim()}:{})},{signal,requestId:crypto.randomUUID()});}
},
{
  id:"reset",
  label:"Reset drawn flags without changing results",
  description:"Use the exhausted table UUID. Reset changes drawn to false for every entry; it does not clear native chat or replace table text.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required.');await api.journals.reset({journal_id:v.id},{signal,requestId:crypto.randomUUID()});return api.journals.get(v.id,{}, {signal});}
}
];
