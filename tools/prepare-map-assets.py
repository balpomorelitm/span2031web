"""Prepare local OSM map art and licensed photo thumbnails. No runtime services.

Run from any folder with Python 3 and Pillow. Source responses are cached under
ignored tmp/map-sources. Generated SVGs retain real Web Mercator coordinates.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib, html, io, json, math, re, time
import urllib.request, urllib.parse, urllib.error
import xml.etree.ElementTree as ET
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / 'tmp/map-sources'
ASSETS = ROOT / 'assets/images'
CACHE.mkdir(parents=True, exist_ok=True)
UA = 'GLAS3112SpainPresentation/1.0 (educational local map preparation)'
MAPS = {
 'granada': {'bounds': [-3.606,37.168,-3.579,37.189], 'label':'Granada',
  'points': [[37.1760,-3.5881],[37.1811,-3.5926],[37.1764,-3.5987],[37.1787,-3.5918]]},
 'cordoba': {'bounds': [-4.7875,37.8728,-4.7708,37.8858], 'label':'Córdoba',
  'points': [[37.8789,-4.7794],[37.8799,-4.7820],[37.8762,-4.7781],[37.8770,-4.7820]]},
 'madrid': {'bounds': [-3.7118,40.4030,-3.6863,40.4230], 'label':'Madrid',
  'points': [[40.4138,-3.6921],[40.4079,-3.6946],[40.4144,-3.6997],[40.4154,-3.7074],[40.4085,-3.7078]]}
}
PHOTO_SEARCHES = {
 'granada-cathedral': 'Granada cathedral facade Plaza Pasiegas',
 'granada-darro': 'Carrera del Darro Granada river',
 'cordoba-juderia': 'Judería Córdoba street',
 'cordoba-bridge': 'Puente Romano Córdoba bridge Guadalquivir',
 'cordoba-alcazar': 'Alcázar Reyes Cristianos Córdoba gardens',
 'madrid-reina-sofia': '"Reina Sofía" facade'
}

def fetch(url, timeout=40):
 req = urllib.request.Request(url, headers={'User-Agent':UA})
 with urllib.request.urlopen(req, timeout=timeout) as response:
  return response.read()

def osm_data(key, spec):
 cache = CACHE / (key+'.json')
 if cache.exists(): return json.loads(cache.read_text(encoding='utf-8'))
 w,s,e,n = spec['bounds']
 query = f'[out:json][timeout:30];(way[highway]({s},{w},{n},{e});way[waterway]({s},{w},{n},{e});way[natural=water]({s},{w},{n},{e});way[leisure=park]({s},{w},{n},{e});way[landuse=grass]({s},{w},{n},{e}););out geom;'
 import sys
 endpoints=[] if '--main-api' in sys.argv else ['https://overpass.private.coffee/api/interpreter','https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter']
 for endpoint in endpoints:
  try:
   data = json.loads(fetch(endpoint+'?'+urllib.parse.urlencode({'data':query})))
   if data.get('elements'):
    cache.write_text(json.dumps(data),encoding='utf-8');print(key, 'Overpass features',len(data['elements']),flush=True);return data
  except Exception as error: print(key,endpoint,str(error),flush=True)
 # Small main-API extracts avoid the 50,000-node cap in highly detailed cities.
 nodes, ways = {}, {}
 for row in range(4):
  for col in range(4):
   piece = CACHE / f'{key}-{row}-{col}.osm'
   a,b = w+(e-w)*col/4, s+(n-s)*row/4
   c,d = w+(e-w)*(col+1)/4, s+(n-s)*(row+1)/4
   if not piece.exists():
    piece.write_bytes(fetch('https://api.openstreetmap.org/api/0.6/map?bbox='+','.join(map(str,[a,b,c,d]))))
   print(key,'extract',row+1,col+1,flush=True)
   tree = ET.fromstring(piece.read_bytes())
   for node in tree.findall('node'):nodes[node.attrib['id']]={'lat':float(node.attrib['lat']),'lon':float(node.attrib['lon'])}
   for way in tree.findall('way'):ways[way.attrib['id']]=way
 elements=[]
 for id,way in ways.items():
  tags={t.attrib['k']:t.attrib['v'] for t in way.findall('tag')}
  if not ('highway' in tags or 'waterway' in tags or tags.get('natural')=='water' or tags.get('leisure')=='park' or tags.get('landuse')=='grass'):continue
  refs=[nd.attrib['ref'] for nd in way.findall('nd')]
  if all(ref in nodes for ref in refs):elements.append({'id':id,'tags':tags,'geometry':[nodes[ref] for ref in refs]})
 data={'elements':elements};cache.write_text(json.dumps(data),encoding='utf-8');return data

def project(spec, width=850, height=650):
 w,s,e,n=spec['bounds']
 merc=lambda lat:math.log(math.tan(math.pi/4+math.radians(lat)/2))
 x0,x1=math.radians(w),math.radians(e);y0,y1=merc(s),merc(n)
 scale=min((width-48)/(x1-x0),(height-48)/(y1-y0))
 left=(width-(x1-x0)*scale)/2;top=(height-(y1-y0)*scale)/2
 return lambda lat,lon:(left+(math.radians(lon)-x0)*scale, top+(y1-merc(lat))*scale)

def render(key,spec,data):
 xy=project(spec); water=[];parks=[];roads=[]
 for element in data['elements']:
  geom=element.get('geometry',[]);tags=element.get('tags',{})
  if len(geom)<2:continue
  coords=[xy(p['lat'],p['lon']) for p in geom]
  path='M'+' L'.join(f'{x:.2f},{y:.2f}' for x,y in coords)
  if tags.get('natural')=='water':water.append(f'<path d="{path} Z" fill="#c9dff0"/>')
  elif tags.get('waterway') in ['river','canal','stream']:water.append(f'<path d="{path}" fill="none" stroke="#b1d0e6" stroke-width="{9 if tags["waterway"]=="river" else 3}"/>')
  elif tags.get('leisure')=='park' or tags.get('landuse')=='grass':parks.append(f'<path d="{path} Z" fill="#dfeadf"/>')
  elif 'highway' in tags:
   kind=tags['highway']
   if kind in ['construction','proposed','steps','platform','raceway']:continue
   thickness=3.4 if kind in ['primary','secondary','trunk'] else 2.4 if kind in ['tertiary','residential','unclassified','pedestrian'] else 1.1
   color='#7589a1' if thickness>3 else '#a2afc0' if thickness>2 else '#c0cad6'
   roads.append(f'<path d="{path}" stroke="{color}" stroke-width="{thickness}"/>')
 north='<path d="M817 54V25m0 0-7 12m7-12 7 12" fill="none" stroke="#122345" stroke-width="2"/><text x="817" y="77" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" fill="#122345">N</text>'
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="850" height="650" viewBox="0 0 850 650"><title>{html.escape(spec["label"])} · OpenStreetMap street map</title><desc>Real street, park and water geometry. North is up. Landmarks are overlaid in the presentation using the same projection.</desc><defs><clipPath id="map-clip"><rect x="0" y="0" width="850" height="650" rx="12"/></clipPath></defs><g clip-path="url(#map-clip)"><rect width="850" height="650" fill="#f1f4f8"/>{"".join(parks)}{"".join(water)}<g fill="none" stroke-linecap="round" stroke-linejoin="round">{"".join(roads)}</g></g>{north}</svg>'
 (ASSETS/f'map-{key}.svg').write_text(svg,encoding='utf-8')
 return [xy(lat,lon) for lat,lon in spec['points']]

def photo(key,search):
 cache=CACHE/(key+'-photo.json')
 if cache.exists(): meta=json.loads(cache.read_text(encoding='utf-8'))
 else:
  # On a clean checkout, query the exact credited file rather than allowing
  # search ranking changes to attach new metadata to an existing photograph.
  credited=json.loads((ROOT/'assets/image-credits.json').read_text(encoding='utf-8'))
  existing=next((e for e in credited if e['file']=='images/'+key+'.jpg'),None)
  params={'action':'query','format':'json','prop':'imageinfo','iiprop':'url|size|extmetadata','iiurlwidth':800}
  if existing:params['titles']='File:'+existing['title']
  else:params.update({'generator':'search','gsrsearch':search,'gsrnamespace':6,'gsrlimit':5})
  result=json.loads(fetch('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
  pages=sorted(result['query']['pages'].values(),key=lambda p:p.get('index',99))
  candidates=[]
  for p in pages:
   ii=p.get('imageinfo',[{}])[0];ext=ii.get('extmetadata',{});lic=ext.get('LicenseShortName',{}).get('value','')
   if any(lic.startswith(x) for x in ['CC BY','CC0','Public domain']):candidates.append(p)
  if not candidates:raise ValueError('No verified compatible photo: '+key)
  meta=candidates[0];cache.write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
 ii=meta['imageinfo'][0];ext=ii['extmetadata'];get=lambda k:ext.get(k,{}).get('value','')
 dest=ASSETS/(key+'.jpg')
 if not dest.exists():
  raw=fetch(ii.get('thumburl',ii['url']));im=Image.open(io.BytesIO(raw)).convert('RGB');im.thumbnail((900,700));im.save(dest,quality=88,optimize=True)
 with Image.open(dest) as im:width,height=im.size
 plain=lambda x:html.unescape(re.sub('<[^>]+>','',x)).strip()
 entry={'file':'images/'+key+'.jpg','title':meta['title'].removeprefix('File:'),'alt':plain(get('ImageDescription'))[:350] or search,'author':plain(get('Artist')),'license':plain(get('LicenseShortName')),'license_url':get('LicenseUrl'),'source':ii['descriptionurl'],'source_image':ii['url'],'downloaded_image':ii.get('thumburl',ii['url']),'width':width,'height':height,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'license_verified':'2026-11-13','metadata_source':'https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','prop':'imageinfo','iiprop':'url|extmetadata','titles':meta['title']}),'changes':'Resized and JPEG-compressed; display crops may apply. No subject matter altered.'}
 print('Photo:',key,entry['title'],entry['license'],flush=True);return entry

def update_credits(entries):
 file=ROOT/'assets/image-credits.json';credits=json.loads(file.read_text(encoding='utf-8'))
 names={e['file'] for e in entries};credits=[e for e in credits if e['file'] not in names]+entries
 file.write_text(json.dumps(credits,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 page=ROOT/'assets/image-credits.html';doc=page.read_text(encoding='utf-8');doc=doc.split('<!-- City map additions -->')[0] if '<!-- City map additions -->' in doc else doc.split('<footer>')[0]
 esc=lambda x:html.escape(x,quote=True)
 doc+='<!-- City map additions -->\n<h2>City-map photographs · added 13 November 2026</h2><p>License metadata checked against Wikimedia Commons. Existing photographs and credits above are unchanged.</p>'
 for e in entries:
  license_markup=f'<a href="{esc(e["license_url"])}">{esc(e["license"])}</a>' if e['license_url'] else esc(e['license'])
  doc+=f'<article><a href="{esc(e["source"])}"><img src="{esc(e["file"])}" alt="{esc(e["alt"])}" loading="lazy"></a><div><h2>{esc(e["title"])}</h2><p>Photograph by {esc(e["author"])}. {license_markup}.</p><p><a href="{esc(e["source"])}">Original and license details on Wikimedia Commons</a></p><p class="small">{esc(e["changes"])}</p></div></article>'
 doc+='<h2>City-map cartography</h2><p>Street, water and park data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, available under the Open Database License. Maps prepared 13 November 2026; positions use Web Mercator. These are orientation maps, not accessible-route or navigation instructions. The three cities and regional locator use separate scales.</p><p>Visual inspiration: <a href="https://github.com/redradman/cartographix">Cartographix</a>. No Cartographix code is bundled.</p><footer><p><a href="../credits.html">Course information sources</a> · <a href="../presentacion.html">View the presentation</a></p><p>Machine-readable photography attribution: <a href="image-credits.json">image-credits.json</a>.</p></footer></main></body></html>\n'
 page.write_text(doc,encoding='utf-8')

if __name__=='__main__':
 import sys
 mode=sys.argv[1] if len(sys.argv)>1 else 'all'
 if mode in ['photos','all']:
  with ThreadPoolExecutor(max_workers=3) as pool:entries=list(pool.map(lambda item:photo(*item),PHOTO_SEARCHES.items()))
  update_credits(entries)
 if mode in ['maps','all']:
  positions={}
  with ThreadPoolExecutor(max_workers=3) as pool:
   future={pool.submit(osm_data,k,s):(k,s) for k,s in MAPS.items()}
   for f in as_completed(future):
    k,s=future[f];positions[k]=render(k,s,f.result());print('Map:',k,positions[k],flush=True)
  (CACHE/'positions.json').write_text(json.dumps(positions,indent=2),encoding='utf-8')
