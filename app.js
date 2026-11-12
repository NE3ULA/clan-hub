/* Clan Hub app — plain JS, localStorage only, no build step. */
(function(){
"use strict";
const DATA = window.CLAN_HUB_DATA;
const LS_SETTINGS="clan-hub-v1-settings", LS_LFG="clan-hub-v1-lfg", LS_READY="clan-hub-v1-ready", LS_CHECK="clan-hub-v1-checklist", LS_EVENT="clan-hub-v1-event", LS_LIVE="clan-hub-v1-live";
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
function load(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(t._h);t._h=setTimeout(()=>t.hidden=true,2600)}
async function copyText(text,msg){
  try{await navigator.clipboard.writeText(text)}
  catch(e){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(_){}ta.remove()}
  toast(msg||"Copied — paste it in Discord");
}
function hubUrl(){return location.href.split("#")[0]}

/* ---- Event selection ---- */
let eventId = load(LS_EVENT, DATA.events[0].id);
function currentEvent(){ return DATA.events.find(e=>e.id===eventId) || DATA.events[0]; }

function renderEvent(){
  const ev=currentEvent(), clan=DATA.clan;
  $("#clanTagline").textContent=clan.tagline;
  $("#eventKicker").textContent=ev.game+" · "+ev.expansion;
  $("#eventTitle").textContent=ev.title+" — "+ev.clanRun;
  $("#eventDesc").textContent=ev.description;
  $("#launchLabel").textContent=ev.launchLabel+" · "+ev.weekendLabel;
  $("#officialBtn").href=ev.officialUrl;
  $("#mechanicChips").innerHTML=ev.mechanics.map(m=>"<span>"+m+"</span>").join("");
  $("#scheduleList").innerHTML=ev.schedule.map(s=>'<div class="schedule-item"><span class="when">'+s.day+" · "+s.time+'</span><strong>'+s.title+"</strong><span>"+s.detail+"</span></div>").join("");
  // event select
  const sel=$("#eventSelect");
  sel.innerHTML=DATA.events.map(e=>'<option value="'+e.id+'"'+(e.id===ev.id?" selected":"")+">"+e.game+" — "+e.expansion+(e.status==="upcoming"?" (upcoming)":"")+"</option>").join("");
  // music
  const hasMix=!!(ev.spotify||ev.soundcloud);
  $("#noMixNote").hidden=hasMix;
  if(ev.spotify){ $("#spotifyTitle").textContent="Spotify — "+ev.spotify.title; $("#spotifyMeta").textContent="by "+ev.spotify.by+" · "+(ev.spotify.tracksLabel||"Playlist"); $("#spotifyEmbed").src=ev.spotify.embedUrl; $("#spotifyOpen").href=ev.spotify.url; }
  if(ev.soundcloud){ $("#scTitle").textContent="SoundCloud — "+ev.soundcloud.title; $("#scMeta").textContent="by "+ev.soundcloud.by+" · Playlist"; $("#scEmbed").src=ev.soundcloud.embedUrl; $("#scOpen").href=ev.soundcloud.url; }
  $("#pane-spotify").hidden=!ev.spotify; $("#pane-soundcloud").hidden=true;
  $$(".togglebtn").forEach(b=>b.classList.toggle("is-active", b.dataset.player==="spotify"));
  if(!ev.spotify && ev.soundcloud){ $("#pane-soundcloud").hidden=false; $("#pane-spotify").hidden=true; }
  renderChecklist(); tickCountdown();
}
function playlistText(){
  const ev=currentEvent();
  let lines=["🎧 **"+ev.clanRun+" — Soundtrack by NE3ULA**","**"+ev.game+" · "+ev.expansion+"** · "+ev.launchLabel,""];
  if(ev.spotify) lines.push("Spotify — "+ev.spotify.title+": "+ev.spotify.url);
  if(ev.soundcloud) lines.push("SoundCloud — "+ev.soundcloud.title+": "+ev.soundcloud.url);
  lines.push("","Clan Hub (music, stream, party finder): "+hubUrl());
  return lines.join("\n");
}
function scheduleText(){
  const ev=currentEvent();
  return ["🗓️ **"+ev.clanRun+" — "+ev.weekendLabel+"**",""].concat(ev.schedule.map(s=>"**"+s.day+"** · "+s.time+" — **"+s.title+"**: "+s.detail)).concat(["","Hub: "+hubUrl()]).join("\n");
}

/* ---- Countdown ---- */
function tickCountdown(){
  const ev=currentEvent(), target=new Date(ev.launchISO).getTime(), now=Date.now(), diff=target-now;
  const live=diff<=0;
  $("#livePill").hidden=!live; $("#countdownLabel").textContent=live?"League is live — see you in Wraeclast":"League launches in";
  const d=Math.max(0,Math.floor(diff/86400000)), h=Math.max(0,Math.floor(diff%86400000/3600000)), m=Math.max(0,Math.floor(diff%3600000/60000)), s=Math.max(0,Math.floor(diff%60000/1000));
  $("#cdD").textContent=live?"0":d; $("#cdH").textContent=live?"0":h; $("#cdM").textContent=live?"0":m; $("#cdS").textContent=live?"0":s;
}
setInterval(tickCountdown,1000);

/* ---- Views / nav ---- */
function gotoView(name){
  $$(".view").forEach(v=>v.classList.toggle("is-active", v.id==="view-"+name));
  $$(".navbtn").forEach(b=>b.classList.toggle("is-active", b.dataset.view===name));
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".navbtn").forEach(b=>b.addEventListener("click",()=>gotoView(b.dataset.view)));
$$("[data-goto]").forEach(b=>b.addEventListener("click",()=>gotoView(b.dataset.goto)));
$$(".togglebtn").forEach(b=>b.addEventListener("click",()=>{
  $$(".togglebtn").forEach(x=>x.classList.toggle("is-active",x===b));
  $("#pane-spotify").hidden=b.dataset.player!=="spotify";
  $("#pane-soundcloud").hidden=b.dataset.player!=="soundcloud";
}));
$("#eventSelect").addEventListener("change",e=>{eventId=e.target.value;save(LS_EVENT,eventId);renderEvent();toast("Event switched: "+currentEvent().expansion)});

/* ---- Copy / share ---- */
$$("[data-copy-playlists]").forEach(b=>b.addEventListener("click",()=>copyText(playlistText(),"Playlist pack copied for Discord")));
$("#copyScheduleBtn").addEventListener("click",()=>copyText(scheduleText(),"Schedule copied for Discord"));
$("#shareHubBtn").addEventListener("click",async()=>{
  const ev=currentEvent(), data={title:document.title,text:ev.clanRun+" — "+ev.game+" "+ev.expansion+" · Music, stream & party finder",url:hubUrl()};
  if(navigator.share){try{await navigator.share(data);return}catch(e){}}
  copyText(data.text+"\n"+data.url,"Hub link copied");
});

/* ---- Settings: Discord + Stream ---- */
let settings=load(LS_SETTINGS,{discordInvite:"",discordServerId:"",discordVoice:"",twitchChannel:DATA.clan.twitchDefault,streamTitle:""});
function applySettings(){
  $("#discordInviteInput").value=settings.discordInvite||"";
  $("#discordServerIdInput").value=settings.discordServerId||"";
  $("#discordVoiceInput").value=settings.discordVoice||"";
  $("#twitchChannelInput").value=settings.twitchChannel||DATA.clan.twitchDefault;
  $("#streamTitleInput").value=settings.streamTitle||"";
  if(settings.discordInvite) $("#topDiscordBtn").href=settings.discordInvite;
  const chan=(settings.twitchChannel||DATA.clan.twitchDefault).trim();
  $("#twitchOpen").href="https://www.twitch.tv/"+chan; $("#topLiveBtn").href="https://www.twitch.tv/"+chan;
  // Twitch embed needs parent = current hostname
  const parent=location.hostname||"localhost";
  $("#twitchEmbed").src="https://player.twitch.tv/?channel="+encodeURIComponent(chan)+"&parent="+encodeURIComponent(parent)+"&muted=true";
  $("#twitchFallback").textContent="Watching on "+parent+" — if the player blocks embedding there, use Open on Twitch. Channel: "+chan+(settings.discordVoice?" · Discord voice: "+settings.discordVoice:"");
  // Discord widget
  if(settings.discordServerId){
    $("#discordWidget").src="https://discord.com/widget?id="+encodeURIComponent(settings.discordServerId)+"&theme=dark";
    $("#discordWidgetWrap").hidden=false; $("#discordWidgetHint").hidden=true;
  } else { $("#discordWidgetWrap").hidden=true; $("#discordWidgetHint").hidden=false; }
}
function readSettingsFromInputs(){
  settings.discordInvite=$("#discordInviteInput").value.trim();
  settings.discordServerId=$("#discordServerIdInput").value.trim();
  settings.discordVoice=$("#discordVoiceInput").value.trim();
  settings.twitchChannel=$("#twitchChannelInput").value.trim()||DATA.clan.twitchDefault;
  settings.streamTitle=$("#streamTitleInput").value.trim();
  save(LS_SETTINGS,settings); applySettings();
}
$("#saveDiscordBtn").addEventListener("click",()=>{readSettingsFromInputs();toast("Discord settings saved on this device")});
$("#saveStreamBtn").addEventListener("click",()=>{readSettingsFromInputs();toast("Stream settings saved")});
$("#copyStreamBtn").addEventListener("click",()=>{
  const ev=currentEvent(), chan=(settings.twitchChannel||DATA.clan.twitchDefault).trim();
  const title=settings.streamTitle||(ev.game+" "+ev.expansion+" — "+ev.clanRun);
  copyText("@everyone 🔴 **LIVE NOW — "+title+"**\nWatch: https://www.twitch.tv/"+chan+"\n"+playlistText(),"Going Live post copied for Discord");
});
let isLive=load(LS_LIVE,false);
function renderLive(){ $("#liveBadge").textContent=isLive?"🔴 LIVE NOW on Twitch":"Offline — check schedule"; $("#liveBadge").classList.toggle("on",!!isLive); $("#toggleLiveBtn").textContent=isLive?"Host: mark stream offline":"Host: mark stream LIVE"; }
$("#toggleLiveBtn").addEventListener("click",()=>{isLive=!isLive;save(LS_LIVE,isLive);renderLive();toast(isLive?"Marked LIVE":"Marked offline")});

/* ---- LFG Board ---- */
let lfg=load(LS_LFG,[]);
function lfgPostText(p){
  const ev=currentEvent();
  return "**LFG — "+p.activity+"** ⚔️\nIGN: **"+p.name+"** · Build: "+p.build+(p.level?" · Lv "+p.level:"")+"\nSpots open: "+(p.spots||"—")+(p.notes?"\nNotes: "+p.notes:"")+"\nGame: "+ev.game+" "+ev.expansion+"\nJoin us — Hub & mixes: "+hubUrl();
}
function renderLFG(){
  const f=$("#lfgFilter").value;
  const list=lfg.filter(p=>f==="all"||p.activity===f);
  $("#lfgEmpty").hidden=list.length>0; $("#lfgEmpty").style.display=list.length?"none":"block";
  $("#lfgList").innerHTML=list.map(p=>{
    const i=lfg.indexOf(p);
    return '<article class="lfg-card"><h4>'+escapeHtml(p.name)+' — '+escapeHtml(p.build)+'</h4><p class="small dim">'+escapeHtml(p.activity)+(p.level?" · Lv "+escapeHtml(p.level):"")+" · Spots: "+escapeHtml(p.spots||"—")+'</p>'+(p.notes?'<p class="small">'+escapeHtml(p.notes)+"</p>":"")+'<div class="row-actions"><button class="btn btn-small" data-copy-lfg="'+i+'" type="button">Copy Discord LFG Post</button><button class="btn btn-small" data-del-lfg="'+i+'" type="button">Remove</button></div></article>';
  }).join("");
  $$("[data-copy-lfg]").forEach(b=>b.addEventListener("click",()=>copyText(lfgPostText(lfg[+b.dataset.copyLfg]),"LFG post copied for Discord")));
  $$("[data-del-lfg]").forEach(b=>b.addEventListener("click",()=>{lfg.splice(+b.dataset.delLfg,1);save(LS_LFG,lfg);renderLFG()}));
}
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#lfgForm").addEventListener("submit",e=>{e.preventDefault();lfg.unshift({name:$("#lfgName").value.trim(),build:$("#lfgBuild").value.trim(),level:$("#lfgLevel").value.trim(),activity:$("#lfgActivity").value,spots:$("#lfgSpots").value.trim(),notes:$("#lfgNotes").value.trim()});save(LS_LFG,lfg);e.target.reset();renderLFG();toast("Posted to the board — copy it to Discord")});
$("#lfgFilter").addEventListener("change",renderLFG);
$("#copyRosterBtn").addEventListener("click",()=>{
  if(!lfg.length){toast("Board is empty — post an LFG first");return}
  copyText("⚔️ **"+currentEvent().clanRun+" — Party Roster**\n\n"+lfg.map((p,i)=>(i+1)+". **"+p.name+"** — "+p.build+" ("+p.activity+")").join("\n")+"\n\nHub: "+hubUrl(),"Full roster copied for Discord");
});

/* ---- Ready Check ---- */
let ready=load(LS_READY,[]);
function renderReady(){
  const done=ready.filter(r=>r.ready).length;
  $("#readyBar").style.width=ready.length?Math.round(done/ready.length*100)+"%":"0%";
  $("#readySummary").textContent=done+" / "+ready.length+" ready";
  $("#readyList").innerHTML=ready.map((r,i)=>'<div class="ready-card"><span><strong>'+escapeHtml(r.name)+"</strong>"+(r.build?' <span class="dim small">'+escapeHtml(r.build)+"</span>":"")+'</span><span class="row-actions"><button class="btn btn-small" data-ready-toggle="'+i+'" type="button">'+(r.ready?"✅ Ready":"⏳ Not ready")+'</button><button class="btn btn-small" data-ready-del="'+i+'" type="button">Remove</button></span></div>').join("");
  $$("[data-ready-toggle]").forEach(b=>b.addEventListener("click",()=>{ready[+b.dataset.readyToggle].ready=!ready[+b.dataset.readyToggle].ready;save(LS_READY,ready);renderReady()}));
  $$("[data-ready-del]").forEach(b=>b.addEventListener("click",()=>{ready.splice(+b.dataset.readyDel,1);save(LS_READY,ready);renderReady()}));
}
$("#readyForm").addEventListener("submit",e=>{e.preventDefault();ready.push({name:$("#readyName").value.trim(),build:$("#readyBuild").value.trim(),ready:false});save(LS_READY,ready);e.target.reset();renderReady()});
$("#copyReadyBtn").addEventListener("click",()=>{
  if(!ready.length){toast("Ready list is empty");return}
  copyText("✅ **Ready Check — "+currentEvent().clanRun+"**\n"+ready.map(r=>(r.ready?"✅ ":"⏳ ")+r.name+(r.build?" — "+r.build:"")).join("\n")+"\n\n"+ready.filter(r=>r.ready).length+"/"+ready.length+" ready · Hub: "+hubUrl(),"Ready check copied for Discord");
});

/* ---- Checklist ---- */
function renderChecklist(){
  const ev=currentEvent(), saved=load(LS_CHECK+":"+ev.id,{});
  $("#checklist").innerHTML=ev.checklist.map((item,i)=>'<label class="check-item"><input type="checkbox" data-check="'+i+'" '+(saved[i]?"checked":"")+' /><span>'+escapeHtml(item)+"</span></label>").join("");
  $$("[data-check]").forEach(c=>c.addEventListener("change",()=>{const s=load(LS_CHECK+":"+ev.id,{});s[c.dataset.check]=c.checked;save(LS_CHECK+":"+ev.id,s)}));
}
$("#resetChecklistBtn").addEventListener("click",()=>{save(LS_CHECK+":"+currentEvent().id,{});renderChecklist();toast("Checklist reset")});

/* ---- Init ---- */
$("#buildStamp").textContent="Clan Hub v1.0 · Event system: data.js · Repo: NE3ULA/clan-hub";
applySettings(); renderEvent(); renderLFG(); renderReady(); renderLive();
})();
