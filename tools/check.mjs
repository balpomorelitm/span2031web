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
for(const f of ['js/app.js','js/presentation.js','js/trip-public.js'])new vm.Script(await read(f),{filename:f});
const manifest=JSON.parse(await read('public-files.json'));
for(const f of manifest)await access(path.join(root,f));
for(const f of ['estudiantes.html','presentacion.html','credits.html']){
 const html=await read(f);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);if(new Set(ids).size!==ids.length)throw new Error('Duplicate id in '+f);
 if(/ACTUALIZAR-URL|B1\.3|SPAN2002|23[,.]690|226[,.]601|Michelle|Loretta/.test(html))throw new Error('Obsolete or internal content in '+f);
 for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
   const resource=m[1];if(/^(https?:|mailto:|data:)/.test(resource))continue;
   if(resource.startsWith('#')){if(!ids.includes(resource.slice(1)))throw new Error('Broken anchor '+resource+' in '+f);continue;}
   await access(path.resolve(root,resource.split('#')[0].split('?')[0]));
 }
 if(f==='presentacion.html'&&(html.match(/class="slide /g)||[]).length!==12)throw new Error('Expected exactly 12 slides');
}
console.log('Public content, local resources, script syntax, 12 slides, budget and assessment checks passed.');
