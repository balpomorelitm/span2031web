"""Browser QA for preserved slides, local maps and the two-window presenter.

Requires Playwright + Pillow in the QA environment, not on the deployed site.
Uses installed Microsoft Edge by default; set BROWSER_EXECUTABLE to override.
"""
from pathlib import Path
from threading import Thread
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import json, os, re
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'tmp/qa';OUT.mkdir(parents=True,exist_ok=True)
BROWSER=os.environ.get('BROWSER_EXECUTABLE',r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe')
ORDER=['slide-1','slide-2','slide-3','map-granada','slide-4','map-cordoba','slide-5','map-madrid','slide-6','slide-7','slide-8','slide-9','slide-10','slide-11','slide-12']

class QuietHandler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def active(page,id):page.wait_for_function('(id)=>document.querySelector(".slide.is-active")?.id===id',arg=id)
def notes_active(page,id):page.wait_for_function('(id)=>document.querySelector("#presenter-slide-select")?.value===id',arg=id)
def assert_connected(popup):popup.wait_for_function('document.querySelector("#presenter-connection")?.textContent.startsWith("Connected")')

def check_windows(browser,base,offline=False):
 context=browser.new_context(viewport={'width':1366,'height':768},device_scale_factor=1)
 errors=[];context.on('page',lambda page:page.on('pageerror',lambda error:errors.append(str(error))))
 context.route('https://tile.openstreetmap.org/**',lambda route:route.abort())
 if offline:context.route('http://**/*',lambda route:route.abort());context.route('https://**/*',lambda route:route.abort())
 page=context.new_page();page.goto(base+'#slide-3');active(page,'slide-3')
 assert page.locator('#slide-select option').count()==15
 with page.expect_popup() as opened:page.locator('#presenter-view').click()
 popup=opened.value;popup.wait_for_load_state();assert_connected(popup);notes_active(popup,'slide-3')
 popup.locator('#presenter-next').click();active(page,'map-granada');notes_active(popup,'map-granada')
 popup.wait_for_function('document.querySelector("#presenter-current-frame").contentWindow !== null')
 frame=popup.frame_locator('#presenter-current-frame')
 frame.locator('#map-granada.is-active').wait_for(state='visible')
 popup.frame_locator('#presenter-next-frame').locator('#slide-4.is-active').wait_for(state='visible')
 page.locator('body').click(position={'x':2,'y':2});page.keyboard.press('ArrowRight');active(page,'slide-4');notes_active(popup,'slide-4')
 popup.locator('#presenter-slide-select').select_option('map-madrid');active(page,'map-madrid')
 assert 'El Rastro' in popup.locator('#presenter-notes').inner_text()
 popup.locator('#presenter-timer-toggle').click()
 popup.wait_for_function('document.querySelector("#presenter-timer-toggle").textContent==="Pause"')
 popup.wait_for_function('document.querySelector("#presenter-elapsed").textContent!=="00:00"')
 popup.reload();assert_connected(popup);notes_active(popup,'map-madrid')
 assert popup.locator('#presenter-timer-toggle').inner_text()=='Pause'
 page.reload();active(page,'map-madrid');assert_connected(popup)
 popup.locator('#presenter-prev').click();active(page,'slide-5')
 # Slide 2: website stages, auto-play, audience + speaker controls, previews.
 popup.locator('#presenter-slide-select').select_option('slide-2');active(page,'slide-2')
 page.wait_for_function('window.PresentationRoute.getState().playing')
 assert page.locator('#presentation-route-stage option').count()==6
 popup.locator('#presenter-route-toggle').click();page.wait_for_function('!window.PresentationRoute.getState().playing')
 paused=page.evaluate('window.PresentationRoute.getState().phase');page.wait_for_timeout(200)
 assert page.evaluate('window.PresentationRoute.getState().phase')==paused
 popup.locator('#presenter-route-full').click();page.wait_for_function('window.PresentationRoute.getState().full')
 page.locator('#presentation-route-stage').select_option('4')
 assert page.evaluate('window.PresentationRoute.getState().index')==4
 point=page.locator('#presentation-route-traveller').evaluate('(bus)=>{const m=bus.transform.baseVal.consolidate().matrix;return [m.e,m.f]}')
 assert abs(point[0]-340)<.001 and abs(point[1]-155)<.001,'Day trip must return to Madrid'
 popup.locator('#presenter-route-replay').click();page.wait_for_function('window.PresentationRoute.getState().index===1')
 popup.wait_for_function('document.querySelector("#presenter-route-status").textContent.includes("Granada")')
 popup.frame_locator('#presenter-current-frame').locator('#presentation-route[data-route-index="1"]').wait_for()
 if offline:
  page.wait_for_function('window.PresentationRoute.getState().full&&!window.PresentationRoute.getState().playing',timeout=22000)
  assert page.evaluate('window.PresentationRoute.getState().index')==5
 page.locator('#presentation-route-full').click()
 page.locator('#slide-2').screenshot(path=str(OUT/('route-slide-offline.png' if offline else 'route-slide-http.png')))
 assert popup.locator('html').get_attribute('lang')=='en'
 assert 'Speaking outline' in popup.locator('#presenter-notes').text_content()
 popup.locator('#presenter-slide-select').select_option('slide-12');active(page,'slide-12');notes_active(popup,'slide-12')
 popup.locator('#presenter-notes summary').filter(has_text='Do I need to speak Spanish?').click()
 assert popup.locator('#presenter-notes details[open]').count()==1
 popup.set_viewport_size({'width':1320,'height':900});popup.screenshot(path=str(OUT/('presenter-offline.png' if offline else 'presenter-http.png')))
 if not offline:
  popup.pdf(path=str(OUT/'presenter-print-raw.pdf'),print_background=True,prefer_css_page_size=True)
 popup.close()
 with page.expect_popup() as reopened:page.locator('#presenter-view').click()
 popup=reopened.value;assert_connected(popup);notes_active(popup,'slide-12');popup.close()
 page.evaluate('window.savedWindowOpen=window.open;window.open=()=>null')
 page.locator('#presenter-view').click();assert page.locator('#presenter-notice').is_visible()
 page.evaluate('window.open=window.savedWindowOpen');page.locator('#presenter-notice').evaluate('(el)=>el.remove()')
 page.locator('#reading-view').click();assert page.locator('.slide:visible').count()==15
 assert page.locator('.presenter-workspace').count()==0
 assert not errors,errors
 context.close();print(('Offline' if offline else 'HTTP')+' presenter checks passed',flush=True)
 return {'offline' if offline else 'http':'English notes, two-way navigation, previews, reload/reopen, timer, route animation and speaker controls, popup warning and reading view passed'}

def main():
 report={}
 # This local-only baseline is captured before edits; it is never published.
 baseline=OUT/'original-presentation.html'
 if baseline.exists():
  old=baseline.read_text(encoding='utf-8');new=(ROOT/'presentacion.html').read_text(encoding='utf-8')
  for i in range(1,13):
   pattern=r'<section class="slide [^>]* id="slide-'+str(i)+r'"[\s\S]*?</section>'
   current=re.search(pattern,new)[0]
   previous=re.search(pattern,old)[0]
   if i==2:
    current=re.sub(r'        <!-- Route animation -->[\s\S]*?        <!-- /Route animation -->\n','',current)
    normalise=lambda text:re.sub(r'<p class="route-note">[\s\S]*?</p>','<!-- Public transport wording -->',text)
    current,previous=normalise(current),normalise(previous)
   if i==10:
    normalise=lambda text:re.sub(r'<div><dt>[^<]*transport</dt><dd>[^<]+</dd></div>','<!-- Public transport wording -->',text,flags=re.I)
    current,previous=normalise(current),normalise(previous)
   assert previous==current,f'Unrequested original slide {i} copy changed'
  report['original_markup']='10 sections identical; requested slide 2 route animation and public-transport wording in slides 2/10 updated'
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(ROOT)))
 Thread(target=server.serve_forever,daemon=True).start()
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path=BROWSER,headless=True)
   report.update(check_windows(browser,f'http://127.0.0.1:{server.server_port}/presentacion.html'))
   report.update(check_windows(browser,(ROOT/'presentacion.html').as_uri(),offline=True))
   page=browser.new_page(viewport={'width':1600,'height':976},device_scale_factor=1)
   page.route('https://tile.openstreetmap.org/**',lambda route:route.abort())
   page.goto((ROOT/'presentacion.html').as_uri());page.evaluate('document.fonts.ready')
   pixels=[];raster_variance={}
   for i in range(1,13):
    page.evaluate('(id)=>location.hash=id','slide-'+str(i));active(page,'slide-'+str(i))
    actual=OUT/f'current-slide-{i}.png';page.locator('#slide-'+str(i)).screenshot(path=str(actual))
    original=OUT/f'original-slide-{i}.png'
    if original.exists() and i not in [2,10]:
     difference=ImageChops.difference(Image.open(original).convert('RGB'),Image.open(actual).convert('RGB'))
     # Chromium may vary a few antialiasing samples by one RGB level between
     # browser processes; section markup is also checked byte for byte above.
     maximum=max(value[1] for value in difference.getextrema())
     changed=sum(1 for pixel in difference.getdata() if pixel!=(0,0,0))
     assert maximum<=1 and changed<=1000,f'Visual change in original slide {i}: max={maximum}, pixels={changed}'
     if changed:raster_variance[str(i)]={'maximum_rgb_difference':maximum,'pixels':changed}
     pixels.append(i)
   report['original_pixels']=f'{len(pixels)} visually unchanged screenshots (at most one RGB level in antialiasing samples)'
   report['raster_variance']=raster_variance
   for width,height in [(1280,720),(1366,768)]:
    page.set_viewport_size({'width':width,'height':height})
    for id in ['map-granada','map-cordoba','map-madrid']:
     page.evaluate('(id)=>location.hash=id',id);active(page,id)
     assert page.locator('#'+id+' img').evaluate_all('(images)=>images.every(im=>im.complete&&im.naturalWidth>0)')
     clipped=page.locator('#'+id+' .map-place').evaluate_all('(cards)=>cards.filter(c=>c.scrollHeight>c.clientHeight+1).length')
     assert clipped==0,f'Clipped card in {id}'
     page.locator('#'+id).screenshot(path=str(OUT/f'{id}-{width}.png'))
   page.locator('body').click(position={'x':2,'y':2});page.keyboard.press('f');page.wait_for_function('Boolean(document.fullscreenElement)')
   page.locator('#map-madrid').screenshot(path=str(OUT/'map-madrid-fullscreen.png'))
   # Browser UI Escape is not dispatched by headless keyboard emulation. F is
   # the viewer's own supported fullscreen toggle in both directions.
   page.keyboard.press('f');page.wait_for_function('!document.fullscreenElement')
   page.pdf(path=str(OUT/'presentation-raw.pdf'),print_background=True,prefer_css_page_size=True)
   report['maps']='3 maps at 1280×720 and 1366×768, all images loaded, no clipped cards; fullscreen passed'
   browser.close()
 finally:server.shutdown();server.server_close()
 (OUT/'presenter-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
