export const recipes=[
{
  id:"catalog",
  label:"Translate a module without changing host catalogs",
  description:"The package includes messages.json with en/pt-BR/es keys. This uses the module namespace and does not require replacing the official language pack.",
  fields:[],
  run:async ({api,assets,onDispose}) => {
  const catalogs=await assets.json('messages.json');
  const changes=[];
  const unsubscribe=api.i18n.onChange(locale=>changes.push(locale));onDispose(unsubscribe);
  const release=api.i18n.register(catalogs);onDispose(release);
  const result={locale:api.i18n.locale,has:api.i18n.has('welcome'),message:api.i18n.t('welcome',{name:'Ari'}),number:api.i18n.number(1234.5,{maximumFractionDigits:1})};
  release();unsubscribe();return {...result,changes};
}
},
{
  id:"package-assets",
  label:"Read package assets safely",
  description:"Package paths are relative and installation-version bound. Use assets.url for a local package image and styles.use for its stylesheet.",
  fields:[],
  run:async ({assets}) => {
  const text=await assets.text('messages.json');
  const bytes=await assets.bytes('messages.json');
  return {url:assets.url('messages.json'),characters:text.length,bytes:bytes.byteLength,catalogs:await assets.json('messages.json')};
}
},
{
  id:"events",
  label:"Observe authorized changes and stop listening",
  description:"Run while changing a disposable actor from another browser. This brief subscription samples authorized state, then unsubscribes. For a permanent panel, subscribe once during mount and pass the disposer to onDispose.",
  fields:[],
  run:async ({api,signal,onDispose}) => {
  const observed=[];
  const unsubscribe=api.events.on('actors.changed',snapshot=>{if(!signal.aborted)observed.push(snapshot.actors.map(actor=>({id:actor.id,name:actor.name})));});
  onDispose(unsubscribe);
  await new Promise(resolve=>{
    const timer=setTimeout(done,1500);
    function done(){clearTimeout(timer);signal.removeEventListener('abort',done);resolve();}
    signal.addEventListener('abort',done,{once:true});
    if(signal.aborted)done();
  });
  unsubscribe();return {observed};
}
},
{
  id:"locale-compat",
  label:"Apply a legacy page language overlay",
  description:"Use only when maintaining locale.apply code. This legacy helper changes the current page language/catalog until its context is disposed; it does not persist an account setting. New modules should use their private api.i18n namespace.",
  fields:[],
  run:async ({host}) => host.call('locale.apply',{id:'es',messages:{greeting:'Hola, {name}'}})
}
];
