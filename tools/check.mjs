import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>readFile(path.join(root,f),'utf8');
const context={window:{}};vm.runInNewContext(await read('js/trip-public.js'),context);const t=context.window.TRIP;
const close=(a,b)=>Math.abs(a-b)<.001;
if(!close(t.budget.items.reduce((s,x)=>s+x.eur,0),1708)||!close(t.budget.subtotalEUR*.1,t.budget.contingencyEUR)||!close(t.budget.totalEUR,t.budget.subtotalEUR+t.budget.contingencyEUR)||!close(t.budget.totalHKD,t.budget.totalEUR*t.budget.rate))throw new Error('Budget does not reconcile');
if(t.assessment.reduce((s,x)=>s+x.weight,0)!==100)throw new Error('Assessment must total 100%');
const cityIds=new Set(t.stages.map(s=>s.id));
if(t.routeSteps.length!==6||new Set(t.routeSteps.map(s=>s.id)).size!==6||!t.routeSteps.some(s=>s.id==='madrid-arrival')||!t.routeSteps.some(s=>s.id==='madrid-return'))throw new Error('Route stages must preserve both Madrid stays and both day trips');
for(const stage of t.routeSteps)if(!cityIds.has(stage.cityId)||stage.route.some(id=>!cityIds.has(id)))throw new Error('Unknown route destination');
if(t.weather.length!==5||t.weather.some(w=>!cityIds.has(w.cityId)||w.may.max<w.may.min||w.june.max<w.june.min||w.may.rain<0||w.june.rain<0))throw new Error('Climate data is incomplete or invalid');
for(const f of ['js/app.js','js/presentation.js','js/trip-public.js'])new vm.Script(await read(f),{filename:f});
const manifest=JSON.parse(await read('public-files.json'));
for(const f of manifest)await access(path.join(root,f));
for(const f of ['estudiantes.html','presentacion.html','credits.html']){
 const html=await read(f);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);if(new Set(ids).size!==ids.length)throw new Error('Duplicate id in '+f);
 if(/ACTUALIZAR-URL|B1\.3|SPAN2002|23[,.]690|226[,.]601|Michelle|Loretta/.test(html))throw new Error('Obsolete or internal content in '+f);
 for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
   const resource=m[1];if(/^(https?:|mailto:|tel:|data:)/.test(resource))continue;
   if(resource.startsWith('#')){if(!ids.includes(resource.slice(1)))throw new Error('Broken anchor '+resource+' in '+f);continue;}
   await access(path.resolve(root,resource.split('#')[0].split('?')[0]));
 }
 if(f==='presentacion.html'&&(html.match(/class="slide /g)||[]).length!==12)throw new Error('Expected exactly 12 slides');
 if(f==='estudiantes.html'){
  const required=['student-overview','student-route','student-itinerary','student-weather','student-bring','student-safety','student-assessment','student-tasks','student-costs','student-emergency','prevStep','playRoute','nextStep','showFullRoute','citySelect','studentRouteCards','studentDayList','studentTimeline','convHKD','convEUR','convRate','budgetDays','budgetEurDay','budgetExtra','budgetRate','budgetResult','emergencyNumbers','lightbox','overview','journey','learning','assessment','budget','prepare','next'];
  for(const id of required)if(!ids.includes(id))throw new Error('Restored portal feature or compatible anchor missing: '+id);
 }
}
for(const f of ['css/styles.css','css/presentation.css','css/glas-fonts.css','assets/vendor/leaflet/leaflet.css']){
 const css=await read(f);for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
  if(/^(https?:|data:|#)/.test(m[1]))continue;
  const file=path.relative(root,path.resolve(root,path.dirname(f),m[1])).replaceAll('\\','/');
  if(!manifest.includes(file))throw new Error('CSS asset missing from public manifest: '+file);
 }
}
console.log('Public content, local resources, script syntax, 12 slides, budget and assessment checks passed.');
