export const recipes=[
{
  id:"inspect",
  label:"Inspect tracks, scene transport and score revisions",
  description:"Prepare original audio through the native Library. Run without a scene to discover scene UUIDs, then run again with the chosen one. A GM may specify an existing token UUID to preview its spatial listening position. Copy track, playlist and source IDs from this result.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID, optional",
    "value": "",
    "type": "text",
    "required": false
  },
  {
    "name": "previewTokenId",
    "label": "GM listener token UUID, optional",
    "value": "",
    "type": "text",
    "required": false
  }
],
  run:async ({api,signal},values) => {
  const maps = await api.maps.state({}, {signal});
  const audio = await api.audio.state({...(values.sceneId ? {sceneId:values.sceneId} : {}),...(values.previewTokenId ? {previewTokenId:values.previewTokenId} : {})}, {signal});
  return {scenes:maps.maps.map(row=>({id:row.id,name:row.name})),...audio};
}
},
{
  id:"track",
  label:"Configure a real track",
  description:"Paste a native-uploaded track UUID. Set music/ambience/effect, gain 0–1 and loop. effect always disables looping on the server.",
  fields:[
  {
    "name": "trackId",
    "label": "Track UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "kind",
    "label": "Kind: music, ambience or effect",
    "value": "ambience",
    "type": "text",
    "required": true
  },
  {
    "name": "volume",
    "label": "Default volume",
    "value": 0.5,
    "type": "number",
    "required": true
  },
  {
    "name": "loop",
    "label": "Loop",
    "value": true,
    "type": "checkbox",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const track=(await api.audio.state({}, {signal})).tracks.find(row=>row.id===values.trackId);
  if (!track) throw new Error("Upload an original track through the native Library first");
  return api.audio.updateTrack({id:track.id,version:track.version,name:"Harbor atmosphere",kind:values.kind,volume:values.volume,loop:values.loop}, {signal});
}
},
{
  id:"playback",
  label:"Control one scene voice",
  description:"Run play, pause, seek, play, setVolume and stop as separate explicit actions. Click Enable audio on this device before expecting sound. Seek must stay within the actual track duration.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "trackId",
    "label": "Track UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "action",
    "label": "Action: play, pause, stop, seek or setVolume",
    "value": "play",
    "type": "text",
    "required": true
  },
  {
    "name": "volume",
    "label": "Voice volume",
    "value": 0.4,
    "type": "number",
    "required": true
  },
  {
    "name": "position",
    "label": "Seek seconds",
    "value": 1,
    "type": "number",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const state=await api.audio.state({sceneId:values.sceneId}, {signal});
  const payload={sceneId:values.sceneId,trackId:values.trackId,version:state.version};
  switch(values.action) {
    case "play": return api.audio.play({...payload,volume:values.volume,loop:true}, {signal});
    case "pause": return api.audio.pause(payload, {signal});
    case "stop": return api.audio.stop(payload, {signal});
    case "seek": return api.audio.seek({...payload,position:values.position}, {signal});
    case "setVolume": return api.audio.setVolume({...payload,volume:values.volume}, {signal});
    default: throw new Error("Choose a documented scene transport action");
  }
}
},
{
  id:"playlist-create",
  label:"Compose an arrival playlist or simultaneous preset",
  description:"Paste two native track UUIDs and choose playlist for sequential music or preset for simultaneous looping layers. Duration must be 1–86400 seconds. Run once and copy the returned id.",
  fields:[
  {
    "name": "trackId",
    "label": "First track UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "secondTrackId",
    "label": "Second track UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "kind",
    "label": "Composition kind: playlist or preset",
    "value": "playlist",
    "type": "text",
    "required": true
  },
  {
    "name": "duration",
    "label": "Each entry duration in seconds",
    "value": 30,
    "type": "number",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  return api.audio.createPlaylist({name:"Harbor arrival",kind:values.kind,mode:"sequential",fade:2,tracks:[
    {soundId:values.trackId,duration:values.duration,gain:0.5},
    {soundId:values.secondTrackId,duration:values.duration,gain:0.35},
  ]}, {signal});
}
},
{
  id:"playlist-update",
  label:"Revise a composition without discarding its tracks",
  description:"Use the created composition id. This edits the definition, retaining its track list and kind while changing name, mode and fade.",
  fields:[
  {
    "name": "id",
    "label": "Composition UUID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const current=(await api.audio.state({}, {signal})).playlists.find(row=>row.id===values.id);
  if (!current) throw new Error("Composition unavailable");
  return api.audio.updatePlaylist({id:current.id,version:current.version,name:"Harbor arrival revised",kind:current.kind,mode:"shuffle",fade:1,tracks:current.tracks}, {signal});
}
},
{
  id:"score-start",
  label:"Start the composition as a score",
  description:"Choose the scene and the composition UUID. The kind comes from the actual definition; it is not guessed from its name.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Composition UUID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const state=await api.audio.state({sceneId:values.sceneId}, {signal});
  const definition=state.playlists.find(row=>row.id===values.id);
  if (!definition) throw new Error("Composition unavailable");
  return api.audio.startScore({sceneId:values.sceneId,id:definition.id,kind:definition.kind,repeat:true,expectedVersion:state.score.version}, {signal});
}
},
{
  id:"score-control",
  label:"Pause, resume, navigate and stop the score",
  description:"Start a playlist first. Run pause, resume, next, previous, then stop one at a time. next/previous apply to playlist, not a simultaneous preset. A stopped composition needs Start rather than Resume.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "action",
    "label": "Action: pause, resume, next, previous or stop",
    "value": "pause",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const state=await api.audio.state({sceneId:values.sceneId}, {signal});
  const payload={sceneId:values.sceneId,expectedVersion:state.score.version};
  switch(values.action) {
    case "pause": return api.audio.pauseScore(payload, {signal});
    case "resume": return api.audio.resumeScore(payload, {signal});
    case "next": return api.audio.nextScore(payload, {signal});
    case "previous": return api.audio.previousScore(payload, {signal});
    case "stop": return api.audio.stopScore(payload, {signal});
    default: throw new Error("Choose a documented score action");
  }
}
},
{
  id:"spatial-create",
  label:"Place an audible harbor beacon",
  description:"Enter scene, track and logical scene-pixel center. Radius is in the scene's configured distance units. The eligible token/listener determines received gain.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "trackId",
    "label": "Track UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "x",
    "label": "Scene x pixels",
    "value": 140,
    "type": "number",
    "required": true
  },
  {
    "name": "y",
    "label": "Scene y pixels",
    "value": 140,
    "type": "number",
    "required": true
  },
  {
    "name": "radius",
    "label": "Radius in scene distance units",
    "value": 10,
    "type": "number",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  return api.audio.createSpatialSound({sceneId:values.sceneId,trackId:values.trackId,x:values.x,y:values.y,radius:values.radius,gain:0.7,falloff:"smooth",loop:true,enabled:true,occlusion:true}, {signal});
}
},
{
  id:"spatial-update",
  label:"Adjust the source range or disable it",
  description:"Use the created source UUID in its own scene. This preserves the source track/location while changing radius, enabled and falloff.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Spatial source UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "radius",
    "label": "New radius",
    "value": 15,
    "type": "number",
    "required": true
  },
  {
    "name": "enabled",
    "label": "Enabled",
    "value": true,
    "type": "checkbox",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const state=await api.audio.state({sceneId:values.sceneId}, {signal});
  const source=state.spatialSounds.find(row=>row.id===values.id);
  if (!source) throw new Error("Source unavailable in this scene");
  return api.audio.updateSpatialSound({sceneId:values.sceneId,id:source.id,version:source.version,radius:values.radius,enabled:values.enabled,falloff:"linear"}, {signal});
}
},
{
  id:"spatial-delete",
  label:"Remove the test spatial source",
  description:"Use only the source created for this tutorial.",
  fields:[
  {
    "name": "sceneId",
    "label": "Scene UUID",
    "value": "",
    "type": "text",
    "required": true
  },
  {
    "name": "id",
    "label": "Disposable spatial source UUID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const source=(await api.audio.state({sceneId:values.sceneId}, {signal})).spatialSounds.find(row=>row.id===values.id);
  if (!source) throw new Error("Source unavailable");
  return api.audio.deleteSpatialSound({sceneId:values.sceneId,id:source.id,version:source.version}, {signal});
}
},
{
  id:"playlist-delete",
  label:"Remove the test composition",
  description:"Stop its score first, then delete only the demonstration definition.",
  fields:[
  {
    "name": "id",
    "label": "Disposable composition UUID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const current=(await api.audio.state({}, {signal})).playlists.find(row=>row.id===values.id);
  if (!current) throw new Error("Composition unavailable");
  return api.audio.deletePlaylist({id:current.id,version:current.version}, {signal});
}
},
{
  id:"track-delete",
  label:"Delete only the disposable uploaded audio",
  description:"Use an original track uploaded for this tutorial after finishing playback/source/composition tests. This deletes its file and detaches native references.",
  fields:[
  {
    "name": "trackId",
    "label": "Disposable original track UUID",
    "value": "",
    "type": "text",
    "required": true
  }
],
  run:async ({api,signal},values) => {
  const track=(await api.audio.state({}, {signal})).tracks.find(row=>row.id===values.trackId);
  if (!track) throw new Error("Track unavailable");
  return api.audio.deleteTrack({id:track.id,version:track.version}, {signal});
}
}
];
