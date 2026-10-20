export const recipes=[
{
  id:"inspect",
  label:"Inspect real item types and folders",
  description:"Choose this first and Run action. Copy a registered type ID from types; the creation recipe defaults to gear, supplied by the tutorial systems.",
  fields:[],
  run:async ({api,signal}) => {
  return {...await api.items.state({}, {signal}),readableItems:await api.items.list({}, {signal})};
}
},
{
  id:"create-kit",
  label:"Create and duplicate an expedition kit",
  description:"Enter a real registered item type, then Run action once. Copy folderId, itemId and duplicateId from the result for the next recipes.",
  fields:[
  {
    "name": "type",
    "label": "Registered item type",
    "value": "gear",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const state = await api.items.state({}, {signal});
  if (!state.types.some(type => type.id === values.type)) throw new Error("Choose an item type registered by this campaign system");
  const folder = await api.items.createFolder({name:"Expedition supplies",color:"#6498cc",parentId:null}, {signal});
  const created = await api.items.create({name:"Survey kit",type:values.type,folderId:folder.id,data:{quantity:1,description:"An original compass and a blank notebook."},permissions:{default:"none"}}, {signal});
  const duplicate = await api.items.duplicate({id:created.id,version:created.item.version,name:"Spare survey kit"}, {signal});
  return {folderId:folder.id,itemId:created.id,duplicateId:duplicate.id};
}
},
{
  id:"update-kit",
  label:"Edit and move the kit",
  description:"Use itemId, set a name/quantity and paste the created folderId, or leave the destination blank to move to root.",
  fields:[
  {
    "name": "id",
    "label": "Item UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "name",
    "label": "New name",
    "value": "Prepared survey kit",
    "type": "text",
    "required": true
  },
  {
    "name": "quantity",
    "label": "Quantity",
    "value": 2,
    "type": "number",
    "required": true
  },
  {
    "name": "folderId",
    "label": "Destination folder UUID, blank for root",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,signal},values) => {
  const current = await api.items.get(values.id, {}, {signal});
  return api.items.update({id:current.id,version:current.version,name:values.name,folderId:values.folderId || null,data:{...current.data,quantity:values.quantity}}, {signal});
}
},
{
  id:"permissions",
  label:"Grant reading or editing deliberately",
  description:"As GM enter the kit UUID. Use read for the default grant or a real member UUID for a specific override; owner grants editing.",
  fields:[
  {
    "name": "id",
    "label": "Item UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "level",
    "label": "Access: none, limited, read or owner",
    "value": "read",
    "type": "text",
    "required": true
  },
  {
    "name": "userId",
    "label": "Member UUID, blank for default",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,signal},values) => {
  const current = await api.items.get(values.id, {}, {signal});
  const permissions = {...current.permissions,[values.userId || "default"]:values.level};
  return api.items.setPermissions({id:current.id,version:current.version,permissions}, {signal});
}
},
{
  id:"folder",
  label:"Rename or reparent the folder",
  description:"Paste folderId. A blank parent keeps this folder at root; another campaign folder UUID reparents it.",
  fields:[
  {
    "name": "id",
    "label": "Folder UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "name",
    "label": "Folder name",
    "value": "Prepared supplies",
    "type": "text",
    "required": true
  },
  {
    "name": "parentId",
    "label": "Parent folder UUID, blank for root",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,signal},values) => {
  return api.items.updateFolder({id:values.id,name:values.name,parentId:values.parentId || null,color:"#6498cc"}, {signal});
}
},
{
  id:"delete-item",
  label:"Delete the spare kit",
  description:"Use only duplicateId from this demonstration. This action deletes that item and requires GM.",
  fields:[
  {
    "name": "id",
    "label": "Disposable item UUID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const current = await api.items.get(values.id, {}, {signal});
  return api.items.delete({id:current.id,version:current.version}, {signal});
}
},
{
  id:"delete-folder",
  label:"Remove the demonstration folder",
  description:"Move items you want to retain to root with the update recipe before removing your test folder.",
  fields:[
  {
    "name": "id",
    "label": "Disposable folder UUID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  return api.items.deleteFolder({id:values.id}, {signal});
}
}
];
