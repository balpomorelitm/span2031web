/* Presentation-sized adaptation of the website's six-stage route animation.
 * Shared data and local Leaflet; the same local diagram works offline/printed.
 */
(() => {
 'use strict';
 const root=document.getElementById('presentation-route');
 if(!root||!window.TRIP)return;
 const $=id=>document.getElementById('presentation-route-'+id);
 const cities=window.TRIP.stages,steps=window.TRIP.routeSteps;
 const byId=Object.fromEntries(cities.map(city=>[city.id,city]));
 const points={madrid:[340,155],granada:[352,368],cordoba:[282,307],toledo:[300,212],alcala:[440,139]};
 const labels={madrid:[328,126,'end'],granada:[370,380,'start'],cordoba:[264,300,'end'],toledo:[280,225,'end'],alcala:[455,134,'start']};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const preview=window.PresenterBridge?.mode==='preview';
 const svgNS='http://www.w3.org/2000/svg',STAGE_MS=3000,MOVE_MS=1800;
 let index=0,playing=false,full=true,phase=0,frame=null,lastTime=0,active=false;
 let map=null,layers=null,traveller=null,tilesAvailable=false,tileFailures=0;
 let forceDiagram=false,cityMarkers={};
 const routePaths=[];
 function svg(name,attrs){const node=document.createElementNS(svgNS,name);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,value);return node;}
 function notify(){if(!preview)window.dispatchEvent(new Event('presentation-route-state'));}
 function pointOnPath(values,t){
  if(values.length<2)return values[0];
  const amount=Math.max(0,Math.min(values.length-1-1e-7,t*(values.length-1))),part=Math.floor(amount),fraction=amount-part;
  return values[part].map((value,i)=>value+(values[part+1][i]-value)*fraction);
 }
 for(const [i,step]of steps.entries()){
  if(step.route.length<2)continue;
  const path=svg('polyline',{points:step.route.map(id=>points[id].join(',')).join(' '),class:'presentation-route-line'+(step.mode==='Day trip'?' day-trip':''),'data-route-index':i});
  $('lines').append(path);routePaths.push({path,i,step});
 }
 for(const city of cities){
  const [x,y]=points[city.id],[tx,ty,anchor]=labels[city.id];
  const group=svg('g',{'data-city':city.id,class:'presentation-route-city'});
  const text=svg('text',{x:tx,y:ty,'text-anchor':anchor});text.textContent=city.city;
  group.append(svg('circle',{cx:x,cy:y,r:7}),text);$('cities').append(group);
 }
 for(const [i,step]of steps.entries()){const option=document.createElement('option');option.value=i;option.textContent=`${i+1}. ${step.label}`;$('stage').append(option);}
 function setView(){
  const online=tilesAvailable&&!forceDiagram;
  root.dataset.mapState=online?'online':'diagram';
  $('view').hidden=!tilesAvailable;$('view').textContent=online?'Route diagram':'Online map';
 }
 function renderPosition(){
  const step=steps[index],t=reduced?1:Math.min(1,phase/MOVE_MS);
  const point=pointOnPath(step.route.map(id=>points[id]),t);
  $('traveller').setAttribute('transform',`translate(${point[0]} ${point[1]})`);
  $('traveller').style.display=full?'none':'';
  if(traveller){traveller.setLatLng(pointOnPath(step.route.map(id=>byId[id].coords),t));traveller.setOpacity(full?0:1);}
 }
 function render(){
  const step=steps[index];
  root.dataset.routeIndex=String(index);root.dataset.playing=String(playing);
  $('stage').value=String(index);$('play').textContent=playing?'Pause route':'Play route';$('play').setAttribute('aria-pressed',String(playing));
  $('status').textContent=full?'Full route · 6 stages':`Stage ${index+1} of ${steps.length} · ${step.label}`;
  $('badge').textContent=full?'Madrid → Granada → Córdoba → Madrid':step.label;
  root.querySelectorAll('.presentation-route-city').forEach(node=>node.classList.toggle('is-current',!full&&node.dataset.city===step.cityId));
  document.querySelectorAll('#slide-2 .route-stop').forEach((node,i)=>node.classList.toggle('is-current',!full&&i===(index===0?0:index===1?1:index===2?2:3)));
  for(const {path,i}of routePaths)path.classList.toggle('completed',full||i<=index);
  if(layers){
   layers.clearLayers();
   for(const {i,step:routeStep}of routePaths)L.polyline(routeStep.route.map(id=>byId[id].coords),{color:routeStep.mode==='Day trip'?'#122345':'#1a6aff',weight:routeStep.mode==='Day trip'?3:4,opacity:(full||i<=index) ? .95 : .22,dashArray:routeStep.mode==='Day trip'?'7 8':null}).addTo(layers);
   for(const [id,marker]of Object.entries(cityMarkers))marker.getElement()?.classList.toggle('is-current',!full&&id===step.cityId);
  }
  renderPosition();notify();
 }
 function stopFrame(){if(frame!==null)cancelAnimationFrame(frame);frame=null;lastTime=0;}
 function tick(now){
  if(!playing||!active){frame=null;return;}
  if(lastTime)phase+=Math.max(0,now-lastTime);lastTime=now;
  if(phase>=STAGE_MS){
   phase-=STAGE_MS;
   if(index===steps.length-1){playing=false;full=true;phase=0;stopFrame();render();return;}
   index++;render();
  }
  renderPosition();frame=requestAnimationFrame(tick);
 }
 function run(){stopFrame();if(playing&&active)frame=requestAnimationFrame(tick);}
 function command(action,value){
  if(action==='full'){playing=false;full=true;phase=0;}
  else if(action==='restart'){index=0;phase=0;full=false;playing=true;}
  else if(action==='toggle'){
   if(full){index=0;phase=0;full=false;playing=true;}else playing=!playing;
  }else if(action==='select'&&Number.isInteger(value)&&value>=0&&value<steps.length){index=value;phase=MOVE_MS;playing=false;full=false;}
  render();run();
 }
 function fitMap(){if(map){map.invalidateSize({animate:false});map.fitBounds(cities.map(city=>city.coords),{paddingTopLeft:[140,75],paddingBottomRight:[170,45],animate:false});}}
 function initMap(){
  if(map||!window.L)return;
  try{
   map=L.map('presentation-route-map',{scrollWheelZoom:false,dragging:false,doubleClickZoom:false,boxZoom:false,keyboard:false,touchZoom:false,zoomControl:false,attributionControl:true});
   layers=L.layerGroup().addTo(map);
   const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'}).addTo(map);
   tiles.on('tileload',()=>{if(!tilesAvailable){tilesAvailable=true;setView();}});
   tiles.on('tileerror',()=>{if(++tileFailures>=3){forceDiagram=true;setView();}});
   for(const city of cities){
    const icon=L.divIcon({className:'presentation-route-pin pin-'+city.id,html:'<i></i><span>'+city.city+'</span>',iconSize:[1,1],iconAnchor:[0,0]});
    cityMarkers[city.id]=L.marker(city.coords,{icon,interactive:false,keyboard:false}).addTo(map);
   }
   traveller=L.marker(cities[0].coords,{interactive:false,keyboard:false,zIndexOffset:1000,icon:L.divIcon({className:'presentation-route-traveller',html:'<img src="assets/images/route-bus.svg" alt="Blue bus" width="56" height="42">',iconSize:[56,42],iconAnchor:[28,35]})}).addTo(map);
   fitMap();render();
  }catch(_){map=null;layers=null;traveller=null;setView();}
 }
 $('play').addEventListener('click',()=>command('toggle'));
 $('replay').addEventListener('click',()=>command('restart'));
 $('full').addEventListener('click',()=>command('full'));
 $('stage').addEventListener('change',()=>command('select',Number($('stage').value)));
 $('view').addEventListener('click',()=>{forceDiagram=!forceDiagram;setView();});
 window.addEventListener('resize',()=>{if(active)fitMap();});
 window.PresentationRoute={
  command,
  getState:()=>({index,playing,full,phase,stageLabel:full?'Full route · 6 stages':`Stage ${index+1} of ${steps.length} · ${steps[index].label}`}),
  setState(state){
   if(!preview||!state||!Number.isInteger(state.index)||state.index<0||state.index>=steps.length)return;
   index=state.index;full=Boolean(state.full);playing=Boolean(state.playing);phase=Math.max(0,Math.min(STAGE_MS,Number(state.phase)||0));render();run();
  },
  onSlideChange(id,reading=false){
   const entering=id==='slide-2'&&!reading;
   if(entering&&!active){
    active=true;
    requestAnimationFrame(()=>{if(active){initMap();fitMap();}});
    if(!preview){if(reduced)command('full');else command('restart');}
   }else if(!entering&&active){active=false;playing=false;stopFrame();render();}
   if(reading){playing=false;full=true;stopFrame();render();}
  }
 };
 setView();render();
})();
