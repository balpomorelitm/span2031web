/* Same-page presenter tools. Direct window messaging also supports file://. */
(() => {
 'use strict';
 const CHANNEL='glas3112-presenter-v1', NAME='glas3112-audience:';
 const params=new URLSearchParams(location.search);
 const mode=params.get('preview')==='1'?'preview':params.get('presenter')==='1'?'presenter':'audience';
 const origin=location.protocol==='file:'?'*':location.origin;
 const validToken=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{16,96}$/.test(value);
 const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(18)),n=>n.toString(16).padStart(2,'0')).join('');
 let config,slides,session,popup=null,timer={elapsed:0,running:false,startedAt:0};
 const title=slide=>slide.dataset.title||slide.querySelector('h1,h2').textContent.trim();
 const index=()=>Math.max(0,Math.min(slides.length-1,config.getCurrent()));
 const elapsed=()=>timer.elapsed+(timer.running?Date.now()-timer.startedAt:0);
 const valid=event=>event.origin===(origin==='*'?'null':origin)&&event.data&&event.data.channel===CHANNEL&&event.data.session===session;
 function post(destination,action,extra={}) {
  try {destination?.postMessage({channel:CHANNEL,session,action,...extra},origin);} catch (_) { /* A window may be reloading. */ }
 }
 function url(view,id) {
  const result=new URL(location.href);
  ['presenter','preview','presenterSession'].forEach(key=>result.searchParams.delete(key));
  if(view){result.searchParams.set(view,'1');result.searchParams.set('presenterSession',session);}
  result.hash=id||'';return result.href;
 }
 function publish() {
  if(mode==='audience'&&popup&&!popup.closed)post(popup,'state',{state:{slideId:slides[index()].id,route:window.PresentationRoute?.getState(),timer:{elapsed:elapsed(),running:timer.running,sentAt:Date.now()}}});
 }
 function show(id){if(slides.some(slide=>slide.id===id))config.show(id);}
 function audience() {
  const saved=window.name.startsWith(NAME)?window.name.slice(NAME.length):'';
  session=validToken(saved)?saved:token();window.name=NAME+session;
  window.addEventListener('message',event=>{
   if(!valid(event))return;
   if(event.source!==popup){
    // A reload forgets the popup reference. Accept its first valid command too,
    // so the first click after a reload is not lost before the next heartbeat.
    if((popup&&!popup.closed)||!['hello','navigate','timer','route'].includes(event.data.action)||!event.source)return;
    try{if(event.source.opener!==window)return;}catch(_){return;}
    popup=event.source;
   }
   const data=event.data;
   if(data.action==='navigate'){
    if(typeof data.slideId==='string')show(data.slideId);
    else if(data.delta===1||data.delta===-1)show(slides[Math.max(0,Math.min(slides.length-1,index()+data.delta))].id);
   }else if(data.action==='route'&&slides[index()].id==='slide-2'){
    if(['toggle','restart','full'].includes(data.command))window.PresentationRoute?.command(data.command);
   }else if(data.action==='timer'){
    if(data.command==='reset')timer={elapsed:0,running:false,startedAt:0};
    else if(data.command==='toggle'){
     if(timer.running){timer.elapsed=elapsed();timer.running=false;}
     else{timer.startedAt=Date.now();timer.running=true;}
    }
   }
   if(['hello','navigate','timer','route'].includes(data.action))publish();
  });
  document.getElementById('presenter-view').addEventListener('click',()=>{
   if(popup&&!popup.closed){popup.focus();publish();return;}
   popup=window.open(url('presenter',slides[index()].id),'glas3112-notes-'+session,'popup=yes,width=1320,height=900,resizable=yes,scrollbars=yes');
   let notice=document.getElementById('presenter-notice');
   if(!popup){
    if(!notice){notice=document.createElement('p');notice.id='presenter-notice';notice.setAttribute('role','status');document.body.append(notice);}
    notice.textContent='The notes window was blocked. Allow pop-ups for this page and click Presenter view again.';
   }else{notice?.remove();popup.focus();}
  });
 }
 function preview() {
  document.body.classList.add('preview-mode');
  window.addEventListener('message',event=>{
   if(event.source===window.parent&&valid(event)&&event.data.action==='preview'){
    show(event.data.slideId);
    if(event.data.slideId==='slide-2')window.PresentationRoute?.setState(event.data.route);
   }
  });
  post(window.parent,'preview-ready');
 }
 const format=ms=>{const seconds=Math.max(0,Math.floor(ms/1000));return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');};
 function node(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
 function presenter() {
  document.body.classList.add('presenter-mode');document.documentElement.lang='en';
  document.title='Speaker notes · GLAS3112';
  const workspace=node('main',undefined,'presenter-workspace');
  workspace.innerHTML=`
   <header class="presenter-header"><div><p class="presenter-eyebrow">GLAS3112 · SPAIN 2027</p><h1>Speaker notes</h1><p id="presenter-connection" role="status">Connecting…</p></div>
    <div class="presenter-clock"><div><strong id="presenter-elapsed">00:00</strong><span id="presenter-remaining">Goal: 10:00</span></div><progress id="presenter-progress" max="600" value="0" aria-label="Presentation time"></progress><div class="presenter-timer-buttons"><button id="presenter-timer-toggle" type="button" disabled>Start</button><button id="presenter-timer-reset" type="button" disabled>Reset</button></div></div>
   </header>
   <nav class="presenter-nav" aria-label="Slides"><button id="presenter-prev" type="button" disabled>← Previous</button><label class="sr-only" for="presenter-slide-select">Slide</label><select id="presenter-slide-select" disabled></select><span id="presenter-position"></span><button id="presenter-next" type="button" disabled>Next →</button></nav>
   <div class="presenter-columns"><section class="presenter-views" aria-label="Slide previews">
    <section id="presenter-route-controls" class="presenter-route-controls" aria-label="Route animation" hidden><h2>Route animation</h2><p id="presenter-route-status"></p><div><button id="presenter-route-toggle" type="button">Play route</button><button id="presenter-route-replay" type="button">Replay</button><button id="presenter-route-full" type="button">Full route</button></div></section>
    <div class="presenter-preview-card"><h2>Current <span id="presenter-current-title"></span></h2><div class="presenter-frame"><iframe id="presenter-current-frame" title="Current slide" tabindex="-1"></iframe></div></div>
    <div class="presenter-preview-card presenter-next-card"><h2>Next <span id="presenter-next-title"></span></h2><div id="presenter-next-wrapper" class="presenter-frame"><iframe id="presenter-next-frame" title="Next slide" tabindex="-1"></iframe></div><p id="presenter-end" hidden>End of presentation · Questions</p></div>
    <p class="presenter-zoom-help">In Zoom, share only the other window: the audience slides. Move these notes to your second screen. The timer starts when you click Start.</p><a id="presenter-return">Back to the slides</a>
   </section><section id="presenter-notes" class="presenter-notes" aria-label="Speaker support" tabindex="0"></section></div>`;
  document.body.append(workspace);
  const find=id=>document.getElementById('presenter-'+id);
  const select=find('slide-select'),prev=find('prev'),next=find('next'),toggle=find('timer-toggle'),reset=find('timer-reset');
  const notes=find('notes'),currentFrame=find('current-frame'),nextFrame=find('next-frame');
  let currentIndex=0,lastId='',lastState=0,connected=false,clock={elapsed:0,running:false,sentAt:Date.now()},routeState=null;
  for(const [i,slide]of slides.entries()){const option=node('option',`${String(i+1).padStart(2,'0')} · ${title(slide)}`);option.value=slide.id;select.append(option);}
  find('return').href=url(null,slides[0].id);
  currentFrame.src=url('preview',slides[0].id);nextFrame.src=url('preview',slides[1].id);
  function command(action,extra){if(window.opener&&!window.opener.closed)post(window.opener,action,extra);}
  function setEnabled(enabled){select.disabled=!enabled;prev.disabled=!enabled||currentIndex===0;next.disabled=!enabled||currentIndex===slides.length-1;toggle.disabled=reset.disabled=!enabled;for(const name of ['route-toggle','route-replay','route-full'])find(name).disabled=!enabled;}
  function updatePreviews(){
   post(currentFrame.contentWindow,'preview',{slideId:slides[currentIndex].id,route:routeState});
   const following=slides[currentIndex+1];find('next-wrapper').hidden=!following;find('end').hidden=Boolean(following);
   if(following)post(nextFrame.contentWindow,'preview',{slideId:following.id});
  }
  function expandable(label,text){const detail=node('details',undefined,'presenter-detail');detail.append(node('summary',label),node('p',text));notes.append(detail);}
  function renderNotes(id){
   const entry=(window.PRESENTER_NOTES||{})[id]||{};notes.replaceChildren(node('h2',title(slides[currentIndex])));
   if(entry.seconds)notes.append(node('p','Suggested time: '+format(entry.seconds*1000),'presenter-note-duration'));
   notes.append(node('h3','Speaking outline'));
   for(const text of entry.script||['No notes for this slide.'])notes.append(node('p',text,'presenter-script'));
   if(entry.transition){const transition=node('div',undefined,'presenter-transition');transition.append(node('h3','Transition'),node('p',entry.transition));notes.append(transition);}
   if(entry.details?.length){notes.append(node('h3','Background'));for(const item of entry.details)expandable(item.title,item.text);}
   if(entry.qa?.length){notes.append(node('h3','Questions to anticipate'));for(const item of entry.qa)expandable(item.question,item.answer);}
   if(entry.sources?.length){const sources=node('div',undefined,'presenter-sources');sources.append(node('h3','Sources'));for(const source of entry.sources){const link=node('a',source.title);link.href=source.url;link.target='_blank';link.rel='noopener';sources.append(link);}notes.append(sources);}
   notes.scrollTop=0;
  }
  function updateClock(){
   const amount=Math.max(0,clock.elapsed+(clock.running?Date.now()-clock.sentAt:0));
   find('elapsed').textContent=format(amount);find('remaining').textContent=amount<600000?'Remaining '+format(600000-amount):'Overtime +'+format(amount-600000);
   find('progress').value=Math.min(600,amount/1000);find('elapsed').classList.toggle('is-over',amount>=600000);toggle.textContent=clock.running?'Pause':'Start';
  }
  function receive(state){
   const i=slides.findIndex(slide=>slide.id===state?.slideId);if(i<0)return;
   currentIndex=i;lastState=Date.now();connected=true;find('connection').textContent='Connected to the audience window';find('connection').classList.remove('is-disconnected');
   select.value=state.slideId;find('position').textContent=`${i+1} / ${slides.length}`;find('current-title').textContent=title(slides[i]);find('next-title').textContent=slides[i+1]?title(slides[i+1]):'';find('return').href=url(null,state.slideId);setEnabled(true);
   if(Number.isFinite(state.timer?.elapsed)&&Number.isFinite(state.timer?.sentAt))clock=state.timer;updateClock();
   routeState=state.route;
   find('route-controls').hidden=state.slideId!=='slide-2';
   find('route-status').textContent=routeState?.stageLabel||'';
   find('route-toggle').textContent=routeState?.playing?'Pause route':'Play route';
   if(lastId!==state.slideId){lastId=state.slideId;renderNotes(lastId);updatePreviews();}
   else if(state.slideId==='slide-2')updatePreviews();
  }
  prev.addEventListener('click',()=>command('navigate',{delta:-1}));next.addEventListener('click',()=>command('navigate',{delta:1}));
  select.addEventListener('change',()=>command('navigate',{slideId:select.value}));
  toggle.addEventListener('click',()=>command('timer',{command:'toggle'}));reset.addEventListener('click',()=>command('timer',{command:'reset'}));
  find('route-toggle').addEventListener('click',()=>command('route',{command:'toggle'}));
  find('route-replay').addEventListener('click',()=>command('route',{command:'restart'}));
  find('route-full').addEventListener('click',()=>command('route',{command:'full'}));
  currentFrame.addEventListener('load',updatePreviews);nextFrame.addEventListener('load',updatePreviews);
  window.addEventListener('message',event=>{
   if(!valid(event))return;
   if(event.source===window.opener&&event.data.action==='state')receive(event.data.state);
   else if((event.source===currentFrame.contentWindow||event.source===nextFrame.contentWindow)&&event.data.action==='preview-ready')updatePreviews();
  });
  document.addEventListener('keydown',event=>{
   if(event.ctrlKey||event.metaKey||event.altKey||/^(INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY|A)$/.test(event.target.tagName)||event.target.isContentEditable||!connected)return;
   const delta=['ArrowRight','PageDown'].includes(event.key)?1:['ArrowLeft','PageUp'].includes(event.key)?-1:0;
   if(delta){event.preventDefault();command('navigate',{delta});}
   else if(event.key==='Home'||event.key==='End'){event.preventDefault();command('navigate',{slideId:slides[event.key==='Home'?0:slides.length-1].id});}
  });
  function heartbeat(){
   const hasOpener=window.opener&&!window.opener.closed;
   if(hasOpener)command('hello');
   if(!hasOpener||(!lastState||Date.now()-lastState>4500)){
    connected=false;find('connection').textContent=hasOpener?'Connecting to the audience window…':'Open the slides and click Presenter view to connect the notes.';
    find('connection').classList.add('is-disconnected');setEnabled(false);
   }
  }
  heartbeat();setInterval(heartbeat,1000);setInterval(updateClock,200);
 }
 window.PresenterBridge={mode,init(options){
  config=options;slides=Array.from(options.slides);
  if(mode==='audience'){audience();window.addEventListener('presentation-route-state',publish);}
  else{session=validToken(params.get('presenterSession'))?params.get('presenterSession'):token();if(mode==='preview')preview();else presenter();}
  return mode;
 },slideChanged:publish};
})();
