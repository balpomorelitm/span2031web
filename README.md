# GLAS3112 Spain 2027

Public student website and 12-slide English presentation for HKU’s proposed Language, Heritage and Cultural Mediation Field Trip, Subclass 2A.

- Website: https://balpomorelitm.github.io/span2031web/estudiantes.html
- Presentation: https://balpomorelitm.github.io/span2031web/presentacion.html
- The root URL redirects to the student website. The former public staff landing page has been replaced; staff material is maintained separately outside this public repository.

## Content

`js/trip-public.js` contains public trip data shared by the website and presentation, including the proposed assessment and per-student budget. Academic details remain provisional. The revised preliminary budget supplied by the coordinators controls travel estimates. Current official HKUArts funding guidance takes precedence over older FGEF statements in planning documents; checked 4 November 2026.

The itinerary is presented as stages, without unconfirmed daily dates, hotels or night allocations. Application deadlines and an application form have not been invented. No student data is collected here.

All photographs are local and licensed. Authors, source links, licences and modifications are in `assets/image-credits.html` and `assets/image-credits.json`. Preserve these credits in downloads and derivatives. Institutional logos retain their original artwork.

## Use and update

Open `estudiantes.html` or `presentacion.html` directly. The optional online map and external links require Internet access; the presentation, route diagram, photographs and data work offline.

Presentation: Left/Right or PageUp/PageDown; Home/End; F for fullscreen. Reading view shows all twelve slides. The PDF is 16:9 with one slide per page. The ZIP includes the website, presentation, PDF, photography and credits.

After editing public data or slides:

1. Review the website at desktop and mobile sizes and all twelve slides at 16:9.
2. Export the presentation using a Chromium browser’s PDF print output, with background graphics and no browser headers/footers. CSS defines the page size. Save to `assets/downloads/GLAS3112-Spain-2027.pdf`; keep links pointing to the public website rather than local files.
3. Run `python tools/package-offline.py` to refresh the ZIP (Python standard library only).
4. Run `node tools/check.mjs` and `node tools/build.mjs` (Node 24).
5. Inspect the staged diff and publish only the intended public files. Never add internal documents, mail drafts or staff data.

## Deployment boundary

`public-files.json` enumerates every deployed file. `tools/build.mjs` validates these paths and copies only those resources to `_site/`. GitHub Actions deploys that directory as the Pages artifact. Pages must use **GitHub Actions** as its publishing source, not the repository root. No framework, dependency installation or backend is needed.

Internal documents, local backups, `.vscode`, `tmp`, `output` and `_site` are ignored. The staff guide and original working-copy backups are stored outside this repository and must remain private. Hiding a link or a JavaScript property would not protect private information.
