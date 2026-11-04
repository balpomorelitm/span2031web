(() => {
  'use strict';
  const trip = window.TRIP;
  if (!trip) return;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const fmt = value => Number(value).toLocaleString('en-GB', {minimumFractionDigits:2, maximumFractionDigits:2});
  const cities = trip.stages || [];
  const cityById = Object.fromEntries(cities.map(city => [city.id, city]));
  const steps = trip.routeSteps?.length ? trip.routeSteps : cities.map(city => ({id:city.id,cityId:city.id,label:city.city,mode:'Stage',title:city.title,description:city.description,task:'Record observations linked to a course question.',route:[city.id]}));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const photoRecords = [
    {file:'granada-alhambra.jpg',title:'Granada · the Alhambra',alt:'The Alhambra and Sierra Nevada seen from the Mirador de San Nicolás',author:'Diego Delso',license:'CC BY-SA 4.0',source:'https://commons.wikimedia.org/wiki/File:Granada_-_View_from_Mirador_de_San_Nicol%C3%A1s_-_02.jpg'},
    {file:'granada-albaicin.jpg',title:'Granada · the Albaicín',alt:'White houses and streets of the Albaicín seen from the Alhambra',author:'Ввласенко',license:'CC BY-SA 3.0',source:'https://commons.wikimedia.org/wiki/File:View_of_Albaic%C3%ADn_from_Alhambra._Granada,_Spain.jpg'},
    {file:'cordoba-mezquita.jpg',title:'Córdoba · Mezquita-Catedral',alt:'Red and white arches inside the Mosque-Cathedral of Córdoba',author:'Benjamin Smith',license:'CC BY-SA 4.0',source:'https://commons.wikimedia.org/wiki/File:C%C3%B3rdoba_-_Mezquita-Catedral_-_Interior_-_10.jpg'},
    {file:'madrid-plaza-mayor.jpg',title:'Madrid · Plaza Mayor',alt:'Madrid Plaza Mayor at dusk with illuminated arcades',author:'Sebastian Dubiel',license:'CC BY-SA 3.0 de',source:'https://commons.wikimedia.org/wiki/File:Plaza_Mayor_de_Madrid_06.jpg'},
    {file:'madrid-prado.jpg',title:'Madrid · Museo del Prado',alt:'The columned facade and gardens of the Museo del Prado',author:'Brian Snelson',license:'CC BY 2.0',source:'https://commons.wikimedia.org/wiki/File:Museo_del_Prado_(Madrid)_04.jpg'},
    {file:'toledo-panorama.jpg',title:'Toledo · historic skyline',alt:'The historic skyline of Toledo above the River Tagus',author:'Diliff',license:'CC BY 2.5',source:'https://commons.wikimedia.org/wiki/File:Toledo_Skyline_Panorama,_Spain_-_Dec_2006_edit.jpg'},
    {file:'alcala-university.jpg',title:'Alcalá de Henares · university heritage',alt:'The facade of the Colegio Mayor de San Ildefonso at the University of Alcalá',author:'Zarateman',license:'CC0',source:'https://commons.wikimedia.org/wiki/File:Alcal%C3%A1_de_Henares_-_Colegio_Mayor_de_San_Ildefonso_(UAH)_01.jpg'},
    {file:'madrid-street.jpg',title:'Madrid · Barrio de las Letras',alt:'A street in the literary quarter of Madrid',author:'Jorge Láscar',license:'CC BY-SA 2.0',source:'https://commons.wikimedia.org/wiki/File:Barrio_de_las_Letras_(Madrid)_01.jpg'},
    {file:'madrid-rastro.jpg',title:'Madrid · El Rastro',alt:'Visitors browsing market stalls on Ribera de Curtidores',author:'Javier Perez Montes',license:'CC BY-SA 4.0',source:'https://commons.wikimedia.org/wiki/File:Rastro_-_Ribera_de_Curtidores_-_Madrid_04.jpg'}
  ];
  const photoFor = image => photoRecords.find(photo => image?.endsWith(photo.file)) || photoRecords[0];

  const menu = document.querySelector('.menu-toggle');
  const nav = $('main-nav');
  const closeMenu = () => {menu.setAttribute('aria-expanded','false');nav.classList.remove('open');};
  menu.addEventListener('click', () => {const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  nav.addEventListener('click', event => {if(event.target.closest('a')) closeMenu();});
  document.addEventListener('keydown', event => {if(event.key==='Escape') closeMenu();});
  for (const [id,value] of Object.entries({languageTitle:trip.languages?.title,languageMain:trip.languages?.main,languageNote:trip.languages?.note,accommodationTitle:trip.accommodation?.title,accommodationDescription:trip.accommodation?.description,accommodationHomestays:trip.accommodation?.homestays})) if(value) $(id).textContent=value;

  function updateCountdown() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Hong_Kong',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
    const today = Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day));
    const [year,month,day] = trip.startDate.split('-').map(Number);
    $('cdDays').textContent=String(Math.max(0,Math.round((Date.UTC(year,month-1,day)-today)/86400000)));
  }
  updateCountdown();setInterval(updateCountdown,60000);

  $('studentRouteCards').innerHTML=photoRecords.map(photo=>`<article class="route-card"><button type="button" class="image-open" data-photo="${esc(photo.file)}" aria-label="Enlarge ${esc(photo.title)}"><img src="assets/images/${esc(photo.file)}" alt="${esc(photo.alt)}" width="1920" height="1280" loading="lazy"></button><div class="body"><h4>${esc(photo.title)}</h4><p class="credit"><a href="${esc(photo.source)}" target="_blank" rel="noopener noreferrer">${esc(photo.author)} · ${esc(photo.license)}</a></p></div></article>`).join('');
  const dialog=$('lightbox');
  document.addEventListener('click', event=>{
    const button=event.target.closest('.image-open');if(!button)return;
    const photo=photoRecords.find(item=>item.file===button.dataset.photo);if(!photo)return;
    $('lightboxImage').src='assets/images/'+photo.file;$('lightboxImage').alt=photo.alt;
    $('lightboxCaption').textContent=photo.title+' · '+photo.author+' · '+photo.license;
    $('lightboxCredit').href=photo.source;dialog.showModal();
  });
  document.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});

  let currentStep=0,playing=false,playTimer=null,animationFrame=null,routeMap=null,routeLayers=null,traveller=null;
  let tilesAvailable=false,forceDiagram=false,showAll=false;
  const markers={};
  const schematicPoints={madrid:[340,155],granada:[352,368],cordoba:[282,307],toledo:[300,212],alcala:[440,139]};
  const labelPositions={madrid:[330,127,'end'],granada:[370,380,'start'],cordoba:[264,300,'end'],toledo:[280,225,'end'],alcala:[455,134,'start']};
  const svgNS='http://www.w3.org/2000/svg';
  function svgElement(name,attributes){const node=document.createElementNS(svgNS,name);Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,String(value)));return node;}
  for(const city of cities){
    const point=schematicPoints[city.id];if(!point)continue;
    const group=svgElement('g',{class:'schematic-city','data-city':city.id,tabindex:0,role:'button','aria-label':'View '+city.city+' stage'});
    group.append(svgElement('circle',{cx:point[0],cy:point[1],r:7}));
    const [x,y,anchor]=labelPositions[city.id];const text=svgElement('text',{x,y,'text-anchor':anchor});text.textContent=city.city;group.append(text);
    const choose=()=>selectStep(steps.findIndex(step=>step.cityId===city.id));
    group.addEventListener('click',choose);group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose();}});
    $('schematicCities').append(group);
  }
  function stopPlayback(){playing=false;clearTimeout(playTimer);playTimer=null;if(animationFrame)cancelAnimationFrame(animationFrame);animationFrame=null;$('playRoute').textContent='Play route ▶';$('playRoute').setAttribute('aria-pressed','false');}
  function setMapView(){const online=tilesAvailable&&!forceDiagram;$('mapStage').dataset.mapState=online?'online':'schematic';$('mapViewToggle').disabled=!tilesAvailable;$('mapViewToggle').textContent=online?'Show route diagram':'Show online map';}
  function pointOnPath(points,progress){if(points.length<2)return points[0];const scaled=Math.min(points.length-1-.000001,Math.max(0,progress)*(points.length-1));const index=Math.floor(scaled),t=scaled-index;return[points[index][0]+(points[index+1][0]-points[index][0])*t,points[index][1]+(points[index+1][1]-points[index][1])*t];}
  function animateStage(step){
    if(animationFrame)cancelAnimationFrame(animationFrame);
    const cityIds=(step.route||[]).filter(id=>schematicPoints[id]);
    if(!cityIds.length)return;
    const svgPoints=cityIds.map(id=>schematicPoints[id]);
    const geoPoints=cityIds.map(id=>cityById[id].coords);
    const dot=$('routeDot');dot.style.display='';
    const setPosition=progress=>{const svgPoint=pointOnPath(svgPoints,progress);dot.setAttribute('cx',svgPoint[0]);dot.setAttribute('cy',svgPoint[1]);if(traveller){traveller.setLatLng(pointOnPath(geoPoints,progress));traveller.setOpacity(cityIds.length>1?1:0);}};
    if(cityIds.length<2||reducedMotion){setPosition(1);return;}
    const began=performance.now();
    function frame(now){const progress=Math.min(1,(now-began)/1800);setPosition(progress);if(progress<1)animationFrame=requestAnimationFrame(frame);else animationFrame=null;}
    animationFrame=requestAnimationFrame(frame);
  }
  function drawRoutes(){
    $('schematicRoutes').replaceChildren();if(routeLayers)routeLayers.clearLayers();
    steps.forEach((step,index)=>{
      const route=(step.route||[]).filter(id=>schematicPoints[id]);if(route.length<2)return;
      const active=showAll||index<=currentStep,isDay=step.mode==='Day trip';
      const points=route.map(id=>schematicPoints[id]);
      $('schematicRoutes').append(svgElement('polyline',{points:points.map(point=>point.join(',')).join(' '),class:'schematic-route'+(isDay?' day':'')+(active?' completed':'')}));
      if(routeLayers) L.polyline(route.map(id=>cityById[id].coords),{color:isDay?'#122345':'#1a6aff',weight:isDay?3:4,opacity:active?.95:.22,dashArray:isDay?'7 8':null}).addTo(routeLayers);
    });
  }
  function renderStage(){
    const step=steps[currentStep],city=cityById[step.cityId];if(!city)return;
    const photo=photoFor(city.image);
    $('mapStageLabel').textContent=showAll?'Full route · '+steps.length+' stages':'Stage '+(currentStep+1)+' of '+steps.length;
    $('mapMode').textContent=step.mode;$('mapCity').textContent=step.label;$('mapActivityTitle').textContent=step.title;$('mapActivity').textContent=step.description;
    $('mapPhoto').src=city.image;$('mapPhoto').alt=photo.alt;$('mapImageButton').dataset.photo=photo.file;
    $('mapCredit').innerHTML=`<a href="${esc(photo.source)}" target="_blank" rel="noopener noreferrer">${esc(photo.author)} · ${esc(photo.license)}</a>`;
    $('citySelect').value=step.id;
    document.querySelectorAll('.schematic-city').forEach(node=>node.classList.toggle('active',node.dataset.city===step.cityId));
    Object.entries(markers).forEach(([id,marker])=>marker.getElement()?.querySelector('.leaflet-marker-label')?.classList.toggle('active',id===step.cityId));
    drawRoutes();
    if(showAll){if(animationFrame)cancelAnimationFrame(animationFrame);animationFrame=null;$('routeDot').style.display='none';if(traveller)traveller.setOpacity(0);if(routeMap)routeMap.fitBounds(cities.map(item=>item.coords),{padding:[35,45],animate:!reducedMotion});}
    else{animateStage(step);if(routeMap)routeMap.flyTo(city.coords,step.cityId==='madrid'?7:8,{animate:!reducedMotion,duration:.65});}
  }
  function selectStep(index){stopPlayback();currentStep=(index+steps.length)%steps.length;showAll=false;renderStage();}
  function advancePlayback(){if(!playing)return;currentStep=(currentStep+1)%steps.length;showAll=false;renderStage();playTimer=setTimeout(advancePlayback,4000);}
  $('citySelect').innerHTML=steps.map(step=>`<option value="${esc(step.id)}">${esc(step.label)}</option>`).join('');
  $('citySelect').addEventListener('change',()=>selectStep(steps.findIndex(step=>step.id===$('citySelect').value)));
  $('prevStep').addEventListener('click',()=>selectStep(currentStep-1));$('nextStep').addEventListener('click',()=>selectStep(currentStep+1));
  $('showFullRoute').addEventListener('click',()=>{stopPlayback();showAll=true;renderStage();});
  $('playRoute').addEventListener('click',()=>{if(playing){stopPlayback();return;}playing=true;showAll=false;renderStage();$('playRoute').textContent='Pause route ❚❚';$('playRoute').setAttribute('aria-pressed','true');playTimer=setTimeout(advancePlayback,4000);});
  $('mapViewToggle').addEventListener('click',()=>{forceDiagram=!forceDiagram;setMapView();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback();});
  function initAnimatedMap(){
    if(!window.L){$('map-status').textContent='The interactive library is unavailable. The animated route diagram and all stage controls remain available.';return;}
    try{
      routeMap=L.map('routeMap',{scrollWheelZoom:false,attributionControl:true,zoomControl:true}).setView([39.15,-3.8],6);
      routeLayers=L.layerGroup().addTo(routeMap);
      const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(routeMap);
      let failures=0;
      tiles.on('tileload',()=>{if(!tilesAvailable){tilesAvailable=true;setMapView();$('map-status').textContent='Online map available. Switch to the route diagram at any time; stage controls work in both views.';}});
      tiles.on('tileerror',()=>{if(++failures>=3){forceDiagram=true;setMapView();$('map-status').textContent='Online map tiles are unavailable or incomplete. The animated diagram and all stage controls remain available.';}});
      cities.forEach(city=>{const marker=L.marker(city.coords,{icon:L.divIcon({className:'map-city-marker',html:'<span class="leaflet-marker-label">'+esc(city.city)+'</span>',iconSize:[1,1],iconAnchor:[10,10]})}).addTo(routeMap);marker.bindPopup('<strong>'+esc(city.city)+'</strong><br>'+esc(city.subtitle));marker.on('click',()=>selectStep(steps.findIndex(step=>step.cityId===city.id)));markers[city.id]=marker;});
      traveller=L.marker(cities[0].coords,{interactive:false,opacity:0,icon:L.divIcon({className:'map-train-marker',html:'<span class="route-train">TRIP</span>',iconSize:[38,24],iconAnchor:[19,12]})}).addTo(routeMap);
      routeMap.fitBounds(cities.map(city=>city.coords),{padding:[35,45],animate:false});
    }catch{routeMap=null;routeLayers=null;$('map-status').textContent='The online map is unavailable. Use the animated diagram and stage controls.';}
  }

  let cityFilter='all',programmeView='list';
  function renderProgramme(){
    const visible=steps.map((step,index)=>({...step,index})).filter(step=>cityFilter==='all'||step.cityId===cityFilter);
    $('studentDayList').innerHTML=visible.map((step,index)=>`<details class="day-card" id="day-${esc(step.id)}" ${index<2?'open':''}><summary><span class="day-number">STAGE ${step.index+1}</span><span class="day-title">${esc(step.label)} · ${esc(step.title)}</span><span class="day-city">${esc(step.mode)}</span></summary><div class="day-content"><div><p>${esc(step.description)}</p><div class="task-box"><strong>FIELDWORK FOCUS</strong>${esc(step.task)}</div></div><aside class="day-reminder"><h4>Keep in mind</h4><ul><li>Follow the confirmed meeting instructions.</li><li>Carry water, your phone and notes.</li><li>Gather evidence for your course question.</li></ul><button class="text-button" type="button" data-map-step="${esc(step.id)}">Show this stage on the map ↑</button></aside></div></details>`).join('');
    $('studentTimeline').innerHTML=visible.map(step=>`<article class="timeline-card"><span class="day-number">STAGE ${step.index+1}</span><span class="mode-tag">${esc(step.mode)}</span><h3>${esc(step.label)}</h3><p><strong>${esc(step.title)}</strong></p><p>${esc(step.description)}</p><div class="task-box"><strong>FIELDWORK FOCUS</strong>${esc(step.task)}</div><button class="text-button" type="button" data-map-step="${esc(step.id)}">Show on map ↑</button></article>`).join('');
    document.querySelectorAll('#dayFilters button').forEach(button=>{const active=button.dataset.city===cityFilter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  }
  function setProgrammeView(view){programmeView=view;$('studentDayList').hidden=view!=='list';$('studentTimeline').hidden=view!=='timeline';document.querySelectorAll('[data-view-toggle]').forEach(button=>{const active=button.dataset.viewToggle===view;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});}
  $('dayFilters').innerHTML=[{id:'all',city:'All stages'},...cities].map(city=>`<button type="button" data-city="${esc(city.id)}" aria-pressed="${city.id==='all'}" class="${city.id==='all'?'active':''}">${esc(city.city)}</button>`).join('');
  $('dayFilters').addEventListener('click',event=>{const button=event.target.closest('button[data-city]');if(button){cityFilter=button.dataset.city;renderProgramme();}});
  document.querySelectorAll('[data-view-toggle]').forEach(button=>button.addEventListener('click',()=>setProgrammeView(button.dataset.viewToggle)));
  document.addEventListener('click',event=>{const button=event.target.closest('[data-map-step]');if(!button)return;selectStep(steps.findIndex(step=>step.id===button.dataset.mapStep));$('student-route').scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});});
  renderProgramme();

  const climateValue=value=>value===null||value===undefined?'—':Number(value).toLocaleString('en-GB',{maximumFractionDigits:1});
  const weather=trip.weather||[];
  $('weatherRows').innerHTML=weather.length?weather.map(item=>`<tr><td><strong>${esc(cityById[item.cityId]?.city||item.cityId)}</strong><small>${esc(item.station)} · ${esc(item.period)}</small></td>${['may','june'].map(month=>['max','min','rain'].map(key=>`<td>${climateValue(item[month]?.[key])}</td>`).join('')).join('')}</tr>`).join(''):'<tr><td colspan="7">Verified climate reference data will be added here before travel.</td></tr>';
  $('weatherSources').innerHTML=weather.map(item=>`<p><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">${esc(cityById[item.cityId]?.city||item.cityId)} · ${esc(item.station)}</a> · normals ${esc(item.period)}${item.cityId==='alcala'?' · Torrejón reference station used as a nearby climate proxy.':''}</p>`).join('');
  $('assessment-list').innerHTML=(trip.assessment||[]).map(item=>`<div class="assessment-row"><strong>${esc(item.weight)}%</strong><span>${esc(item.label)}</span></div>`).join('');
  const budget=trip.budget;
  $('budget-rows').innerHTML=budget.items.map(item=>`<tr><td>${esc(item.label)}</td><td class="num">${fmt(item.eur)}</td><td class="num">${fmt(item.eur*budget.rate)}</td></tr>`).join('');
  $('budget-totals').innerHTML=[['Subtotal',budget.subtotalEUR],['Contingency · 10%',budget.contingencyEUR],['Estimated total',budget.totalEUR]].map(([label,value])=>`<tr><td>${label}</td><td class="num">${fmt(value)}</td><td class="num">${fmt(value*budget.rate)}</td></tr>`).join('');
  $('convRate').value=String(budget.rate);$('budgetRate').value=String(budget.rate);
  const numberInput=id=>{const raw=$(id).value;return raw.trim()===''?NaN:Number(raw);};
  let conversionSource='convHKD';
  function convert(source=conversionSource){conversionSource=source;const destination=source==='convHKD'?'convEUR':'convHKD';const amount=numberInput(source),rate=numberInput('convRate');if(!Number.isFinite(rate)||rate<=0||(!Number.isNaN(amount)&&amount<0)){$(destination).value='';$('converterStatus').textContent='Enter a positive exchange rate and a non-negative amount.';return;}if(!Number.isFinite(amount)){$(destination).value='';$('converterStatus').textContent='Planning rate, not a live quote. Enter an amount in either currency.';return;}$(destination).value=(source==='convHKD'?amount/rate:amount*rate).toFixed(2);$('converterStatus').textContent='Converted at HK$'+rate.toFixed(2)+' per €1. This is not a live exchange quote.';}
  $('convHKD').addEventListener('input',()=>convert('convHKD'));$('convEUR').addEventListener('input',()=>convert('convEUR'));$('convRate').addEventListener('input',()=>convert());
  function calculateBudget(){const days=numberInput('budgetDays'),meals=numberInput('budgetEurDay'),extras=numberInput('budgetExtra'),rate=numberInput('budgetRate');const valid=[days,meals,extras,rate].every(Number.isFinite)&&Number.isInteger(days)&&days>=1&&days<=30&&meals>=0&&extras>=0&&rate>0;$('budgetResult').classList.toggle('invalid',!valid);$('budgetResult').textContent=valid?'€'+fmt(days*meals+extras)+' ≈ HK$'+fmt((days*meals+extras)*rate):'Enter 1–30 whole days, non-negative costs and a positive exchange rate.';}
  ['budgetDays','budgetEurDay','budgetExtra','budgetRate'].forEach(id=>$(id).addEventListener('input',calculateBudget));calculateBudget();
  const emergencies=trip.emergency?.length?trip.emergency:[{number:'112',label:'Emergency assistance',scope:'Spain',url:'https://administracion.gob.es/pag_Home/en/Tu-espacio-europeo/derechos-obligaciones/ciudadanos/asistencia-sanitaria/numeros-urgencia.html'}];
  $('emergencyNumbers').innerHTML=emergencies.map(item=>`<div class="emergency-item"><a href="tel:${esc(item.number)}">${esc(item.number)}</a><div><strong>${esc(item.label)}</strong><p>${esc(item.scope)}</p><a class="credit" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Official source ↗</a></div></div>`).join('');

  let printState=null;
  window.addEventListener('beforeprint',()=>{if(printState)return;stopPlayback();printState={filter:cityFilter,view:programmeView,openIds:Array.from(document.querySelectorAll('.day-card[open]')).map(detail=>detail.id),otherDetails:Array.from(document.querySelectorAll('details:not(.day-card)')).map(detail=>({element:detail,open:detail.open}))};cityFilter='all';renderProgramme();setProgrammeView('list');document.querySelectorAll('details').forEach(detail=>{detail.open=true;});});
  window.addEventListener('afterprint',()=>{if(!printState)return;cityFilter=printState.filter;renderProgramme();setProgrammeView(printState.view);document.querySelectorAll('.day-card').forEach(detail=>{detail.open=printState.openIds.includes(detail.id);});printState.otherDetails.forEach(({element,open})=>{element.open=open;});printState=null;});
  $('print-page').addEventListener('click',()=>window.print());
  initAnimatedMap();renderStage();
})();
