export const recipes=[
{
  id:"list",
  label:"List reusable campaign assets",
  description:"Use a test campaign with a native-supported asset, such as an original PDF in the PDF system. This operation lists unattached actor-template assets, not every map/audio file.",
  fields:[],
  run:async ({host,signal}) => host.call('asset.list',{}, {signal})
},
{
  id:"upload",
  label:"Upload a real provider-supported file",
  description:"Choose your own small valid PDF on a PDF campaign. asset.upload selects a registered content provider and its validator; it is not an arbitrary binary file store.",
  fields:[
  {
    "name": "file",
    "label": "Original supported file",
    "value": "",
    "type": "file",
    "required": true
  }
],
  run:async ({host,signal},v) => {
  if(!(v.file instanceof File)) throw new Error('Choose a file');
  return host.call('asset.upload',{file:v.file},{signal});
}
},
{
  id:"download",
  label:"Read a downloadable file as a Blob",
  description:"Paste an asset ID from List. The result contains a Blob; it is not a URL string. A UI may create an object URL for download and must revoke it afterward.",
  fields:[
  {
    "name": "id",
    "label": "Reusable asset ID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({host,signal},v) => {
  const result=await host.call('asset.download',{id:v.id},{signal});
  return {name:result.name,contentType:result.contentType,size:result.size,blobBytes:result.blob.size};
}
},
{
  id:"actor-image",
  label:"Upload portrait or token artwork",
  description:"Use portrait, then token, with an editable disposable actor. Multipart requires a real File. Limits and conversion are enforced by the host.",
  fields:[
  {
    "name": "id",
    "label": "Actor ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "kind",
    "label": "Image kind",
    "value": "portrait",
    "type": "text",
    "required": true
  },
  {
    "name": "file",
    "label": "Original PNG/JPEG/WebP",
    "value": "",
    "type": "file",
    "required": true
  }
],
  run:async ({host,signal},v) => {
  if(!['portrait','token'].includes(v.kind))throw new Error('kind must be portrait or token');
  if(!(v.file instanceof File))throw new Error('Choose an image');
  return host.call('actor.image.upload',{id:v.id,kind:v.kind,file:v.file},{signal});
}
},
{
  id:"card-image",
  label:"Upload front/back artwork for a deck",
  description:"As GM, choose an original image and purpose. Paste the returned assetId into the card-definition tutorial, not an external URL.",
  fields:[
  {
    "name": "purpose",
    "label": "Purpose",
    "value": "card_front",
    "type": "text",
    "required": true
  },
  {
    "name": "file",
    "label": "Original PNG/JPEG/WebP",
    "value": "",
    "type": "file",
    "required": true
  }
],
  run:async ({host,signal},v) => {
  if(!['card_front','card_back'].includes(v.purpose))throw new Error('Choose card_front or card_back');
  return host.call('card.asset.upload',{purpose:v.purpose,file:v.file},{signal});
}
},
{
  id:"delete",
  label:"Delete only a reusable tutorial asset",
  description:"Select only the unattached reusable asset you uploaded. Native deletion checks provider support and updates references. This does not delete arbitrary media paths.",
  fields:[
  {
    "name": "id",
    "label": "Reusable asset ID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "confirm",
    "label": "This is my disposable asset",
    "value": false,
    "type": "checkbox",
    "required": false
  }
],
  run:async ({api,signal},v) => {
  if(!v.confirm)throw new Error('Confirm the disposable asset');
  await api.actors.deleteAsset({id:v.id},{requestId:crypto.randomUUID(),signal});
  return {deleted:v.id};
}
}
];
