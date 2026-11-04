(() => {
  'use strict';
  const trip = window.TRIP;
  const fmt = n => n.toLocaleString('en-GB', {minimumFractionDigits:2,maximumFractionDigits:2});
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  menu.addEventListener('click', () => { const open=menu.getAttribute('aria-expanded')!=='true'; menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open); });
  nav.addEventListener('click', e => { if(e.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');} });
  const selector = document.getElementById('route-selector');
  const feature = document.getElementById('destination-feature');
  function showCity(id) {
    const stage = trip.stages.find(s=>s.id===id) || trip.stages[0];
    selector.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.city===stage.id)));
    feature.innerHTML=`<figure><img src="${stage.image}" alt="${stage.city}: planned field-trip destination" width="1920" height="1280"></figure><div class="destination-copy"><p class="eyebrow">${stage.city.toUpperCase()}</p><h3>${stage.title}</h3><p class="destination-subtitle">${stage.subtitle}</p><p>${stage.description}</p><a class="text-link" href="#learning">Explore the learning approach ↓</a></div>`;
  }
  trip.stages.forEach(stage=>{const b=document.createElement('button');b.type='button';b.textContent=stage.city;b.dataset.city=stage.id;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>showCity(stage.id));selector.append(b);});
  showCity('granada');
  document.getElementById('assessment-list').innerHTML=trip.assessment.map(a=>`<div class="assessment-row"><strong>${a.weight}%</strong><span>${a.label}</span></div>`).join('');
  const budget = trip.budget;
  document.getElementById('budget-rows').innerHTML=budget.items.map(a=>`<tr><td>${a.label}</td><td>${fmt(a.eur)}</td><td>${fmt(a.eur*budget.rate)}</td></tr>`).join('');
  document.getElementById('budget-totals').innerHTML=[['Subtotal',budget.subtotalEUR],['Contingency · 10%',budget.contingencyEUR],['Estimated total',budget.totalEUR]].map(a=>`<tr><td>${a[0]}</td><td>${fmt(a[1])}</td><td>${fmt(a[1]*budget.rate)}</td></tr>`).join('');
  document.getElementById('print-page').addEventListener('click',()=>window.print());
  const load = document.getElementById('load-map');
  const status = document.getElementById('map-status');
  load.addEventListener('click', async () => {
    load.disabled=true;load.textContent='Loading map…';
    try {
      if(!window.L){const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.append(css);await new Promise((resolve,reject)=>{const script=document.createElement('script');const timer=setTimeout(()=>reject(new Error('Map unavailable')),10000);script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=()=>{clearTimeout(timer);resolve();};script.onerror=()=>{clearTimeout(timer);reject(new Error('Map unavailable'));};document.head.append(script);});}
      const el=document.getElementById('route-map');el.hidden=false;
      const map=L.map(el,{scrollWheelZoom:false}).setView([39,-3.8],6);
      const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
      let failures=0;tiles.on('tileerror',()=>{if(++failures>2)status.textContent='Map tiles are unavailable. Use the offline route diagram above.';});
      trip.stages.forEach(s=>L.marker(s.coords).addTo(map).bindPopup(`<strong>${s.city}</strong><br>${s.subtitle}`));
      const point=id=>trip.stages.find(s=>s.id===id).coords;
      L.polyline(['madrid','granada','cordoba','madrid'].map(point),{color:'#bc583d',weight:3}).addTo(map);
      ['toledo','alcala'].forEach(id=>L.polyline([point('madrid'),point(id)],{color:'#102c42',dashArray:'5,7',weight:2}).addTo(map));
      map.fitBounds(trip.stages.map(s=>s.coords),{padding:[30,30]});
      load.hidden=true;status.textContent='Main route in terracotta · day trips in navy. The diagram remains available above.';
    } catch {status.textContent='The online map is unavailable. All destinations and the route remain available in the offline diagram.';load.disabled=false;load.textContent='Retry interactive map ↗';}
  });
})();
