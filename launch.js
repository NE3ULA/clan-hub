/* Launch Control — Motion post sequence interface. Plain JS, localStorage only. */
(function(){
"use strict";
const POSTS=[
 {n:1,title:"THE NOTE",when:"Thu Nov 12 · 9:00 AM PST",format:"Feed post · photo",media:"The sticky note photo, unedited. Purple note, real desk, real hand.",caption:"Motion needs no explanation.",asset:"✅ Have it — photo shot Nov 11 (above)",thumb:"./assets/motion-note.jpg"},
 {n:2,title:"THE MIX MOVES",when:"Thu Nov 12 · 3:00 PM PST",format:"Reel · 15–20s",media:"Screen recording, no voiceover: tap Spotify → it plays → swipe to SoundCloud, waveform moving. Audio = the mix itself.",caption:"Lord of Kaos. Tomorrow.",asset:"📱 Capture: one phone screen recording (~2 min)"},
 {n:3,title:"THE HUB MOVES",when:"Thu Nov 12 · 8:00 PM PST",format:"Reel · 15s + Story",media:"Screen recording scrolling the Clan Hub: countdown ticking → Party Finder → Ready Check filling in. Mix underneath.",caption:"11.13 — 11AM PST",asset:"📱 Capture: hub screen recording (~2 min)"},
 {n:4,title:"THE CLAN MOVES",when:"Fri Nov 13 · 9:30 AM PST",format:"Stories · 3 frames, live",media:"As it happens: (1) desk + note on wall, (2) Discord voice names joining, (3) character select.",caption:"Overlays: “Ready.” → “In voice.” → nothing",asset:"📱 Capture live Friday morning — real, not staged"},
 {n:5,title:"MOTION, LIVE",when:"Fri Nov 13 · 11:00 AM PST",format:"No post — the stream IS the post",media:"Go live on Twitch at launch. One Story still of live gameplay + Twitch link. Going Live post in Discord from the hub.",caption:"Story overlay: LIVE",asset:"🔴 Twitch: twitch.tv/ne3ula_db"},
 {n:6,title:"PROOF",when:"Sat Nov 14 – Sun Nov 15",format:"Reel · 20–30s",media:"Weekend montage: best drop, first Wickerman, a boss Fate, clan in voice. Mix audio. End frame: “Next motion: Dec 11 — PoE2.”",caption:"Weekend 1. Lords of Chaos.",asset:"🎮 Clips from the run / stream VOD"}
];
const LS="clan-hub-v1-posts", STATES=["○ Planned","◐ Captured","✓ Approved","● Posted"];
const $=s=>document.querySelector(s);
function load(){try{return JSON.parse(localStorage.getItem(LS))||{}}catch(e){return{}}}
function save(v){try{localStorage.setItem(LS,JSON.stringify(v))}catch(e){}}
function toast(m){const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(t._h);t._h=setTimeout(()=>t.hidden=true,2400)}
async function copyText(text,msg){try{await navigator.clipboard.writeText(text)}catch(e){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand("copy")}catch(_){}ta.remove()}toast(msg||"Copied")}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
let state=load();
function render(){
 $("#postList").innerHTML=POSTS.map(p=>{
  const st=state[p.n]||0;
  return '<article class="card post-card"><div><div class="post-head"><div class="post-title"><span class="post-num">'+p.n+'</span><div><h3 style="margin:0">'+p.title+'</h3><p class="post-meta">'+p.when+" · "+p.format+'</p></div></div></div>'+
  (p.thumb?'<img src="'+p.thumb+'" alt="" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;border:1px solid var(--line);margin:8px 0" />':"")+
  '<p style="margin:.4rem 0">'+esc(p.media)+'</p><div class="caption-box">Caption: '+esc(p.caption)+'</div><p class="asset-tag">'+esc(p.asset)+'</p></div>'+
  '<div class="post-side"><p class="micro">Status — tap to advance</p><button class="status-btn s'+st+'" data-advance="'+p.n+'" type="button">'+STATES[st]+'</button><div class="row-actions"><button class="btn btn-small" data-copy="'+p.n+'" type="button">Copy caption</button></div></div></article>';
 }).join("");
 document.querySelectorAll("[data-advance]").forEach(b=>b.addEventListener("click",()=>{const n=b.dataset.advance;state[n]=((state[n]||0)+1)%4;save(state);render()}));
 document.querySelectorAll("[data-copy]").forEach(b=>b.addEventListener("click",()=>{const p=POSTS.find(x=>x.n==b.dataset.copy);copyText(p.caption,"Caption copied — Post "+p.n)}));
 const posted=POSTS.filter(p=>(state[p.n]||0)===3).length, approved=POSTS.filter(p=>(state[p.n]||0)>=2).length;
 $("#seqBar").style.width=Math.round(posted/POSTS.length*100)+"%";
 $("#seqSummary").textContent=posted+" of 6 posted · "+approved+" approved-or-later";
}
$("#copyAllBtn").addEventListener("click",()=>copyText("MOTION NEEDS NO EXPLANATION — PoE 3.30 launch sequence\n\n"+POSTS.map(p=>p.n+". "+p.title+" — "+p.when+" · "+p.format+"\n"+p.media+"\nCaption: "+p.caption).join("\n\n")+"\n\nHub: https://ne3ula.github.io/clan-hub/","Full sequence copied as text"));
$("#resetSeqBtn").addEventListener("click",()=>{state={};save(state);render();toast("Statuses reset")});
function tick(){const diff=new Date("2026-11-13T19:00:00Z").getTime()-Date.now();const d=Math.max(0,Math.floor(diff/86400000)),h=Math.max(0,Math.floor(diff%86400000/3600000)),m=Math.max(0,Math.floor(diff%3600000/60000)),s=Math.max(0,Math.floor(diff%60000/1000));$("#cdD").textContent=d;$("#cdH").textContent=h;$("#cdM").textContent=m;$("#cdS").textContent=s}
setInterval(tick,1000);tick();render();
})();
