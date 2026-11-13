import {readFile,writeFile,mkdir,copyFile,rm,stat,realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.join(root,'_site');
if(path.dirname(target)!==root||path.basename(target)!=='_site')throw new Error('Unsafe output directory');
const files=JSON.parse(await readFile(path.join(root,'public-files.json'),'utf8'));
if(!Array.isArray(files)||new Set(files).size!==files.length)throw new Error('Invalid or duplicate public files');
for(const name of files){
 if(typeof name!=='string'||name.includes('\\')||path.isAbsolute(name)||name.split('/').some(x=>x==='..'||x==='.'||!x))throw new Error('Unsafe public path: '+name);
 const allowed=/^(index\.html|estudiantes\.html|presentacion\.html|credits\.html|favicon\.svg|SMLCLogo_edited\.webp|logosp\.webp|css\/(styles|presentation|glas-fonts|city-maps|presenter|presentation-route)\.css|js\/(trip-public|app|presentation|presenter|presenter-notes|presentation-route)\.js|assets\/(images\/[^/]+\.(jpg|webp|svg)|downloads\/GLAS3112-Spain-2027(?:\.pdf|-offline\.zip)|image-credits\.(html|json)|fonts\/(wix-madefor-(display|text)-latin(-ext)?\.woff2|OFL\.txt|README\.txt)|branding\/(glas-logo-white\.png|README\.txt)|vendor\/leaflet\/(leaflet\.(js|css)|LICENSE|images\/(layers(-2x)?|marker-icon(-2x)?|marker-shadow)\.png)))$/;
 if(!allowed.test(name))throw new Error('Not a permitted public resource: '+name);
 const resolved=await realpath(path.join(root,name));
 if(path.relative(root,resolved).startsWith('..')||path.isAbsolute(path.relative(root,resolved)))throw new Error('Public resource resolves outside checkout: '+name);
 if(!(await stat(path.join(root,name))).isFile())throw new Error('Not a file: '+name);
}
// Only remove the fixed, resolved staging directory, never a path from the manifest.
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
for(const name of files){const dest=path.join(target,name);await mkdir(path.dirname(dest),{recursive:true});await copyFile(path.join(root,name),dest);}
await writeFile(path.join(target,'.nojekyll'),'');
console.log(`Packaged ${files.length} explicitly allowed public files in _site/`);
