# GLAS3112 Spain 2027

Public student website and 15-slide English presentation for HKU’s proposed Language, Heritage and Cultural Mediation Field Trip, Subclass 2A. Original photographs, IDs and printed numbers are retained; slide 2 now shows the website’s animated six-stage route, and three city-map slides follow Granada, Córdoba and Madrid. English speaker support opens in a separate window. Transport copy uses “public transport” throughout, with a small blue bus as the moving marker in both maps. The other original slides retain their layout.

- Website: https://balpomorelitm.github.io/span2031web/estudiantes.html
- Presentation: https://balpomorelitm.github.io/span2031web/presentacion.html
- Netlify sharing link: https://glas3112-spain-2027.netlify.app/
- Netlify presentation: https://glas3112-spain-2027.netlify.app/presentacion.html
- The root URL redirects to the student website. The former public staff landing page has been replaced; staff material is maintained separately outside this public repository.

The student portal has no links to the presentation, its PDF or the offline bundle, including on its source/photograph-credit pages. Open the presentation directly with the existing URL; it requests no search indexing. This is an unlisted static page, not password-protected access. Programme photographs are integrated into their stages in both list and timeline views. Portal sections and navigation run: Overview, Map & route, Programme, Assessment, Field tasks, Budget & tools, What to bring, Safety, Climate, Emergencies. Local sun, temperature and rain symbols accompany the climate labels.

## Content

`js/trip-public.js` contains public trip data shared by the website and presentation, including the proposed assessment and per-student budget. Academic details remain provisional. The revised preliminary budget supplied by the coordinators controls travel estimates. Current official HKUArts funding guidance takes precedence over older FGEF statements in planning documents; checked 4 November 2026.

The itinerary is presented as stages, without unconfirmed daily dates, hotels or night allocations. Application deadlines and an application form have not been invented. No student data is collected here.

The complete student portal restores the original practical tools: animated route map with six stages (including separate Madrid arrival and return), city filters, itinerary list/timeline, gallery/lightbox, countdown in calendar days, climate, packing, safety, fieldwork tasks and emergency contacts. Both Alcalá de Henares and Toledo remain planned day trips.

The editable HKD/EUR converter starts at the planning rate of 9. The meals/extras calculator defaults to the documented 15 days × €22 = €330 / HK$2,970 already included in the trip estimate. Its two presets are €22/day (included budget) and €30/day (personal planning scenario); days, daily spending, extras and exchange rate remain editable. The illustrative trip total adjusts the documented €1,878.80 only by the difference from the included €330 meals, with 10% contingency on that difference, plus personal extras at cost. At 15 days, €30/day, no extras and HK$9/€1: meals are €450 / HK$4,050; the meal increase is €120 / HK$1,080; the illustrative trip total is €2,010.80 / HK$18,097.20. The documented budget remains €1,878.80 / HK$16,909.20. The calculator never adds the included €330 a second time.

Source priority: the revised preliminary Spain 2027 budget (4 November 2026) records a documentary group of 10–14 students and €22 daily meals (€4 breakfast + €8 lunch + €10 dinner). The earlier revised academic proposal (30 September 2026) gives a provisional group of 8–10. The current presentation and portal use 8–12 students, explicitly updated by the coordinators on 13 November 2026. The €30/day option is an illustrative personal planning scenario, not a revised documentary allowance or a supplier quote. Public meal assumptions are centralised in `TRIP.budget.meals`; documentary budget items and totals remain unchanged.

Climate figures are AEMET monthly normals with station and reference period, not a forecast. Emergency numbers include their regional scope and official sources. Homestays are being explored in Madrid only, with availability, prices and meal arrangements still unconfirmed.

All photographs are local and licensed. Authors, source links, licences and modifications are in `assets/image-credits.html` and `assets/image-credits.json`. Preserve these credits in downloads and derivatives. Institutional logos retain their original artwork.

The identity follows the official GLAS website: local Wix Madefor Display/Text fonts, white, navy and blues. Font OFL licences, original GLAS logo provenance and Leaflet licence are included with their assets.

## Use and update

Open `estudiantes.html` or `presentacion.html` directly. The map controller, Leaflet library, markers, route diagram, photographs, fonts and data are local. Online basemap tiles and external links require Internet access; the route controls and fallback diagram remain useful offline.

Presentation: Left/Right or PageUp/PageDown; Home/End; F for fullscreen. Reading view shows all fifteen slides. The PDF is 16:9 with one slide per page and no speaker notes. The ZIP includes the website, presentation, PDF, local city maps, notes, photography and credits. Viewer positions count all 15 slides; printed numbers and links such as `#slide-8` still identify the original slides.

## Presentar por Zoom con dos pantallas

1. Abre `presentacion.html` y pulsa **Presenter view**. Si el navegador lo bloquea, permite la ventana emergente y vuelve a pulsar el botón.
2. Mueve las notas a tu segunda pantalla. Incluyen la diapositiva actual, la siguiente, guion en inglés, recuadros de apoyo siempre visibles junto a cada párrafo y preguntas previstas en la última diapositiva. La interfaz de ayuda también está en inglés. Puedes avanzar desde cualquiera de las dos ventanas.
3. En Zoom, comparte **solo la ventana de las diapositivas**. Pulsa **F** para pantalla completa; los controles reaparecen al acercar el puntero al borde inferior. En las notas, pulsa **Start** cuando empieces a hablar.

La diapositiva 2 reproduce una vez el recorrido al entrar: Madrid → Granada → Córdoba → Madrid → excursión a Alcalá → excursión a Toledo. Puedes pausarlo, repetirlo (**Replay**) o mostrarlo entero (**Full route**) desde la diapositiva o desde tus notas. Mantiene todo el circuito visible, sin acercamientos entre ciudades. Las líneas indican conexiones esquemáticas, no trayectos exactos del transporte público. Un pequeño autobús azul recorre el mapa de la web y el de la presentación. Utiliza el mismo Leaflet y los mismos datos de la web; si las teselas de OpenStreetMap no cargan, continúa con el diagrama local animado. Con movimiento reducido se muestra primero el recorrido completo. La vista de lectura y el PDF muestran el recorrido completo sin animación.

El guion orientativo suma 9:30, con 30 segundos de margen. El cronómetro no arranca solo y se puede pausar o reiniciar. Las notas se recuperan al recargar o reabrir su ventana; al recargar la ventana del público se conserva la diapositiva y se reinicia el cronómetro. Las dos ventanas deben permanecer abiertas. Funciona al abrir el archivo local directamente, sin servidor ni conexión. Usa **Reading view** para leer las diapositivas seguidas, sin notas.

Los mapas de Granada y Córdoba incluyen cuatro puntos; Madrid incluye Prado, Reina Sofía, Barrio de las Letras, Plaza Mayor y El Rastro, más un localizador regional con Toledo y Alcalá. Son lugares propuestos, no reservas confirmadas. El Rastro requiere encaje en domingo o festivo. Las fotografías adicionales y la atribución a OpenStreetMap están en los créditos.

The additional notes contain public information only. `js/presenter.js` uses direct `postMessage` communication with session/source checks; it needs no server, storage service or framework. `tools/prepare-map-assets.py` prepares real OSM geometry and licensed photographs ahead of time (Python + Pillow; source cache in ignored `tmp/map-sources`). `tools/compose-city-slides.py` composes only the three city-map sections. Those three maps need no map service at runtime; slide 2 can use online tiles and falls back to its local route diagram.

After editing public data or slides:

1. Review the website at desktop and mobile sizes and all fifteen slides at 16:9. `python tools/check-presenter.py` checks English notes, navigation over HTTP and offline files, previews, reloads, timer, route playback and speaker controls, reading view and maps using installed Edge (Playwright + Pillow required only for QA). If pre-edit captures are present in ignored `tmp/qa`, it also compares the other ten original slides, allowing the requested route animation and public-transport wording in slides 2 and 10. Set `BROWSER_EXECUTABLE` to override the browser path.
2. Export the presentation using a Chromium browser’s PDF print output, with background graphics and no browser headers/footers. CSS defines the page size. The browser QA also writes `tmp/qa/presentation-raw.pdf`. Run `python tools/finalize-pdf.py tmp/qa/presentation-raw.pdf` (requires PyMuPDF). This preserves the visual resources, checks fifteen 16:9 pages and converts local file links to public links.
3. Run `python tools/package-offline.py` to refresh the ZIP (Python standard library only).
4. Run `node tools/check.mjs` and `node tools/build.mjs` (Node 24).
5. Inspect the staged diff and publish only the intended public files. Never add internal documents, mail drafts or staff data.

For Netlify, `netlify.toml` sets Node 24, runs the public checks/build and publishes only `_site`. The local Netlify project association is kept in ignored `.netlify/state.json`. After a reviewed build, `netlify deploy --prod --dir=_site` updates the same sharing link.

## Deployment boundary

`public-files.json` enumerates every deployed file. `tools/build.mjs` validates these paths and copies only those resources to `_site/`. GitHub Actions deploys that directory as the Pages artifact. Pages must use **GitHub Actions** as its publishing source, not the repository root. No framework, dependency installation or backend is needed.

Internal documents, local backups, `.vscode`, `tmp`, `output` and `_site` are ignored. The staff guide and original working-copy backups are stored outside this repository and must remain private. Hiding a link or a JavaScript property would not protect private information.
