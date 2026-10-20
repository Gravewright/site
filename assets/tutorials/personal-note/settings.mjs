export const key='panel-preferences';
export function migrate(value){
  if(value===null || value===undefined)return {schema:1,label:'My campaign note'};
  if(typeof value==='string')return {schema:1,label:value};
  if(value?.schema===1 && typeof value.label==='string')return {...value};
  throw new Error('Unsupported preference schema. Export/migrate before saving.');
}
export async function load(storage){
  const current=await storage.user.get(key);
  return {value:migrate(current?.value),revision:current?.revision??null};
}
export async function save(storage,current,label){
  if(typeof label!=='string' || !label.trim() || label.length>120)throw new Error('Enter 1–120 characters');
  return storage.user.set(key,{...current.value,schema:1,label:label.trim()},{expectedRevision:current.revision});
}
