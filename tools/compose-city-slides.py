"""Compose only the three added slides; original section markup is untouched."""
from pathlib import Path
import html, importlib.util, re
ROOT=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('maps',ROOT/'tools/prepare-map-assets.py');maps=importlib.util.module_from_spec(spec);spec.loader.exec_module(maps)
esc=html.escape
DATA={
 'granada':{'after':'slide-3','title':'Granada','subtitle':'Architecture, water and the life of a historic city', 'cards':[
  ('Alhambra & Generalife','Palaces, gardens and water','granada-alhambra.jpg','The Alhambra and its landscape',1240,535),
  ('Albaicín · San Nicolás','A neighbourhood and its views','granada-albaicin.jpg','The Albaicín neighbourhood in Granada',1240,230),
  ('Cathedral & Royal Chapel','The city after 1492','granada-cathedral.jpg','The façade of Granada Cathedral',60,535),
  ('Paseo del Darro','River, streets and landscape','granada-darro.jpg','The Carrera del Darro alongside the river',60,230)]},
 'cordoba':{'after':'slide-4','title':'Córdoba','subtitle':'Read the city through its buildings, streets and river', 'cards':[
  ('Mezquita-Catedral','Layers of history and belief','cordoba-mezquita.jpg','Arches inside the Mezquita-Catedral',1240,230),
  ('Judería','Streets and cultural memory','cordoba-juderia.jpg','A street in the historic centre of Córdoba',60,230),
  ('Puente Romano','The city and the Guadalquivir','cordoba-bridge.jpg','Córdoba’s Roman Bridge over the Guadalquivir',1240,535),
  ('Alcázar','Power, architecture and gardens','cordoba-alcazar.jpg','The Alcázar de los Reyes Cristianos in Córdoba',60,535)]},
 'madrid':{'after':'slide-5','title':'Madrid & beyond','subtitle':'Art, neighbourhoods and everyday life · plus two day trips', 'cards':[
  ('Museo del Prado','Art and representation','madrid-prado.jpg','The Museo del Prado in Madrid',1240,205),
  ('Reina Sofía','Modern art and memory','madrid-reina-sofia.jpg','The exterior of the Museo Reina Sofía',1240,410),
  ('Barrio de las Letras','Literature and urban life','madrid-street.jpg','A street in Madrid’s Barrio de las Letras',60,410),
  ('Plaza Mayor','A shared public space','madrid-plaza-mayor.jpg','Plaza Mayor in Madrid',60,205),
  ('El Rastro','Street market · proposed','madrid-rastro.jpg','The street market at Ribera de Curtidores',60,615)]}
}

def region():
 # A separate north-up geographic locator, not a route or same-scale extension.
 places=[('Madrid',40.4168,-3.7038),('Alcalá',40.4818,-3.3641),('Toledo',39.8628,-4.0273)]
 xy=maps.project({'bounds':[-4.24,39.70,-3.12,40.65]},300,104)
 svg='<svg class="regional-locator" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 104" role="img" aria-label="Regional locator: Alcalá is northeast of Madrid, Toledo southwest; separate scale">'
 for label,lat,lon in places:
  x,y=xy(lat,lon)
  tx,ty,anchor=(x-8,y-2,'end') if label=='Madrid' else (x+8,y-5,'start') if label=='Alcalá' else (x+8,y+6,'start')
  svg+=f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="#1a6aff"/><text x="{tx:.1f}" y="{ty:.1f}" text-anchor="{anchor}" fill="#122345" font-size="19" font-family="Arial,sans-serif">{label}</text>'
 svg+='</svg>'
 return f'''<aside class="map-region" aria-label="Day trips from Madrid"><h3>Day trips · separate scale</h3>{svg}<div class="region-photos"><div><img src="assets/images/toledo-panorama.jpg" alt="Toledo’s historic skyline"><strong>Toledo</strong><span>Historic city</span></div><div><img src="assets/images/alcala-university.jpg" alt="The historic university in Alcalá de Henares"><strong>Alcalá</strong><span>University · Cervantes</span></div></div></aside>'''

def compose(key,data):
 compact=key=='madrid';xy=maps.project(maps.MAPS[key]);points=[xy(*p) for p in maps.MAPS[key]['points']]
 overlay=[];cards=[]
 for i,((name,caption,photo,alt,left,top),(px,py)) in enumerate(zip(data['cards'],points),1):
  x,y=375+px,185+py;attach=left-10 if left>1000 else left+310;cy=top+(90 if compact else 130)
  # Connecting strokes remain behind readable photographic cards and markers.
  elbow=(x+attach)/2
  overlay.append(f'<path d="M{x:.1f} {y:.1f} H{elbow:.1f} V{cy:.1f} H{attach:.1f}"/>')
  cards.append(f'<article class="map-place{" compact" if compact else ""}" style="left:{left}px;top:{top}px"><img src="assets/images/{photo}" alt="{esc(alt)}"><span class="map-card-index">{i:02}</span><div><h3>{esc(name)}</h3><p>{esc(caption)}</p></div></article>')
 lines=''.join(overlay);markers=''.join(f'<g transform="translate({375+x:.1f},{185+y:.1f})"><circle r="20"/><text text-anchor="middle" dy="7">{i:02}</text></g>' for i,(x,y) in enumerate(points,1))
 return f'''      <section class="slide city-map-slide {key}-map-slide" id="map-{key}" aria-labelledby="map-title-{key}" data-title="{data['title']} · map" hidden>
        <header class="city-map-heading"><p class="eyebrow">PLACES TO EXPLORE · PROPOSED</p><h2 id="map-title-{key}">{data['title']}</h2><p class="city-map-subtitle">{data['subtitle']}</p></header>
        <img class="city-street-map" src="assets/images/map-{key}.svg" alt="North-up street map of {esc(data['title'])}; numbered places correspond to the photographs">
        <svg class="map-connections" viewBox="0 0 1600 900" aria-hidden="true"><g class="map-lines">{lines}</g><g class="map-markers">{markers}</g></svg>
        {''.join(cards)}
        {region() if compact else ''}
        <footer class="city-map-footer"><span>Proposed places · final visits and access to be confirmed</span><span>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a> · <a href="assets/image-credits.html" target="_blank" rel="noopener">Photos &amp; map sources</a></span></footer>
      </section>'''.replace('\n        \n','\n')

if __name__=='__main__':
 path=ROOT/'presentacion.html';doc=path.read_text(encoding='utf-8')
 for key,data in DATA.items():
  doc=re.sub(r'      <section class="slide city-map-slide[^>]* id="map-'+key+r'"[\s\S]*?</section>\n*','',doc)
  pattern=r'(<section class="slide [^>]* id="'+data['after']+r'"[\s\S]*?</section>)'
  doc,count=re.subn(pattern,lambda m:m.group(1)+'\n\n'+compose(key,data),doc,count=1)
  if count!=1:raise ValueError('Original slide not found: '+data['after'])
 path.write_text(doc,encoding='utf-8',newline='\n')
 print('Inserted three map slides; original section markup preserved.')
