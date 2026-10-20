export const recipes=[
{
  id:"directory",
  label:"Read documents, folders and campaign member IDs",
  description:"Run first as GM to obtain journals[].id, folders[].id and members[].id. The last field is a user UUID for setAccess and presentation, not an actor UUID. Player projections omit the GM member directory and private content.",
  fields:[],
  run:async ({api,signal})=>api.journals.state({}, {signal})
},
{
  id:"create-diary",
  label:"Create a real block-document diary",
  description:"Create a diary, then fill content using the supported gw-journal-doc-v1 envelope. Plain HTML or a Markdown string is not that rich-document format. Copy the returned ID.",
  fields:[
  {
    "name": "title",
    "label": "Original diary title",
    "type": "text",
    "value": "Harbor log",
    "required": true
  },
  {
    "name": "body",
    "label": "Original body text",
    "type": "text",
    "value": "The harbor beacon needs repair.",
    "required": true
  }
],
  run:async ({api,signal},v)=>{const created=await api.journals.create({title:v.title,journal_type:'diary'},{signal,requestId:crypto.randomUUID()});try{const doc=text=>({format:'gw-journal-doc-v1',version:1,doc:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text}]}]}});await api.journals.update({journal_id:created.journal_id,version:created.version,title:v.title,data:{content:doc(v.body),cover:{},sections:[],gm:{}}},{signal,requestId:crypto.randomUUID()});return api.journals.get(created.journal_id,{}, {signal});}catch(error){throw new Error('Diary '+created.journal_id+' exists; setup failed: '+(error.code||error.message)+'. Inspect it before creating another.');}}
},
{
  id:"rename-diary",
  label:"Rename a diary without erasing its pages or GM notes",
  description:"As GM, reconstruct the write shape from the read projection: content_doc becomes content, cover_image becomes cover, and diary.gm becomes gm. Preserve sections and the exact read version. This example deliberately targets diary, not quest/table shapes.",
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
    "label": "New diary title",
    "type": "text",
    "value": "Harbor log, reviewed",
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('Use GM to preserve the full diary projection.');const row=await api.journals.get(v.id,{}, {signal});if(row.type!=='diary')throw new Error('Choose a diary.');const data={content:row.content_doc,cover:row.cover_image,sections:row.sections,gm:row.diary.gm};await api.journals.update({journal_id:row.id,version:row.version,title:v.title,visibility:row.visibility,data},{signal,requestId:crypto.randomUUID()});return api.journals.get(row.id,{}, {signal});}
},
{
  id:"move-document",
  label:"Move a document into a folder or the root",
  description:"As GM, use a folder UUID from the directory. Blank target selects the root. This changes organization rather than visibility or content.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "folderId",
    "label": "Target folder UUID, blank for root",
    "type": "text",
    "value": "",
    "required": false
  }
],
  run:async ({api,signal},v)=>{await api.journals.move({journal_id:v.id,target_folder_id:v.folderId.trim()||null},{signal,requestId:crypto.randomUUID()});return api.journals.get(v.id,{}, {signal});}
},
{
  id:"access",
  label:"Grant or revoke one member’s journal access",
  description:"Use members[].id from the GM directory. none denies access, limited allows listing, read opens authorized content, and owner permits editing under server rules. This persists a grant, unlike a temporary presentation.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "userId",
    "label": "Campaign user UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "level",
    "label": "none/limited/read/owner",
    "type": "text",
    "value": "read",
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required.');if(!['none','limited','read','owner'].includes(v.level))throw new Error('Invalid access level.');await api.journals.setAccess({journal_id:v.id,target_user_id:v.userId,access_level:v.level},{signal,requestId:crypto.randomUUID()});return api.journals.get(v.id,{}, {signal});}
},
{
  id:"present",
  label:"Present a player-filtered document or public page",
  description:"Leave user UUID blank to present to everyone, or target one campaign user when targeted handouts are enabled. Optional page ID must refer to a public diary page. ownership unchanged avoids a permanent access change.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "userId",
    "label": "Target user UUID, blank for everyone",
    "type": "text",
    "value": "",
    "required": false
  },
  {
    "name": "pageId",
    "label": "Public diary page ID, optional",
    "type": "text",
    "value": "",
    "required": false
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required.');const payload={journal_id:v.id,ownership:'unchanged',...(v.userId.trim()?{targets:[v.userId.trim()]}:{}),...(v.pageId.trim()?{page_id:v.pageId.trim()}:{})};return api.journals.present(payload,{signal,requestId:crypto.randomUUID()});}
},
{
  id:"folder-create",
  label:"Create a folder with a validated color",
  description:"Enter a name and optionally an existing parent UUID. The native color is a six-digit hexadecimal string. Copy result.folder_id.",
  fields:[
  {
    "name": "name",
    "label": "Folder name",
    "type": "text",
    "value": "Harbor notes",
    "required": true
  },
  {
    "name": "parentId",
    "label": "Parent folder UUID, optional",
    "type": "text",
    "value": "",
    "required": false
  }
],
  run:async ({api,signal},v)=>{const result=await api.journals.createFolder({name:v.name,color:'#c09a5a',parent_id:v.parentId.trim()||null},{signal,requestId:crypto.randomUUID()});return {result,directory:await api.journals.state({}, {signal})};}
},
{
  id:"folder-update",
  label:"Rename and recolor a folder",
  description:"Use the folder ID created above. This API requires both name and color, so send them explicitly.",
  fields:[
  {
    "name": "folderId",
    "label": "Folder UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "name",
    "label": "New folder name",
    "type": "text",
    "value": "Harbor archive",
    "required": true
  },
  {
    "name": "color",
    "label": "Six-digit color",
    "type": "text",
    "value": "#5f8fba",
    "required": true
  }
],
  run:async ({api,signal},v)=>{await api.journals.updateFolder({folder_id:v.folderId,name:v.name,color:v.color},{signal,requestId:crypto.randomUUID()});return api.journals.state({}, {signal});}
},
{
  id:"folder-move",
  label:"Move a folder without creating cycles",
  description:"Choose an existing folder and new parent. A blank parent moves to root. The server rejects moving a folder into itself or a descendant.",
  fields:[
  {
    "name": "folderId",
    "label": "Folder UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "parentId",
    "label": "New parent UUID, blank for root",
    "type": "text",
    "value": "",
    "required": false
  }
],
  run:async ({api,signal},v)=>{await api.journals.moveFolder({folder_id:v.folderId,target_parent_id:v.parentId.trim()||null},{signal,requestId:crypto.randomUUID()});return api.journals.state({}, {signal});}
},
{
  id:"folder-delete",
  label:"Delete a folder while retaining its contents",
  description:"Use only the synthetic folder and type its exact name. Native deletion reparents its child folders and documents to its former parent. It does not recursively delete journals.",
  fields:[
  {
    "name": "folderId",
    "label": "Folder UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "confirmation",
    "label": "Type the exact folder name",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,signal},v)=>{const state=await api.journals.state({}, {signal});const folder=state.folders.find(folder=>folder.id===v.folderId);if(!folder)throw new Error('Folder not found.');if(v.confirmation!==folder.name)throw new Error('Type the exact folder name.');await api.journals.deleteFolder({folder_id:folder.id},{signal,requestId:crypto.randomUUID()});return api.journals.state({}, {signal});}
},
{
  id:"delete-document",
  label:"Delete one disposable document and refresh the list",
  description:"As GM, type the exact title of the tutorial document. This deletes that journal and related native references; it is different from removing a board link.",
  fields:[
  {
    "name": "id",
    "label": "Document UUID",
    "type": "text",
    "value": "",
    "required": true
  },
  {
    "name": "confirmation",
    "label": "Type the exact document title",
    "type": "text",
    "value": "",
    "required": true
  }
],
  run:async ({api,context,signal},v)=>{if(context.role!=='gm')throw new Error('GM required.');const row=await api.journals.get(v.id,{}, {signal});if(v.confirmation!==row.title)throw new Error('Type the exact document title.');await api.journals.delete({journal_id:row.id},{signal,requestId:crypto.randomUUID()});return api.journals.list({}, {signal});}
}
];
