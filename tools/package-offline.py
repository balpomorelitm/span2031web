"""Package public resources only. Run from any directory after updating the PDF."""
from pathlib import Path
import json
import zipfile

root = Path(__file__).resolve().parent.parent
files = json.loads((root / "public-files.json").read_text(encoding="utf-8"))
output = root / "assets/downloads/GLAS3112-Spain-2027-offline.zip"
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
    for item in files:
        source = (root / item).resolve()
        if not source.is_relative_to(root):
            raise ValueError("Unsafe public resource: " + item)
        if source != output:
            bundle.write(source, item)
    bundle.writestr("START-HERE.txt", "GLAS3112 Spain 2027\n\nOpen presentacion.html for the 15-slide presentation (12 original slides and 3 city maps).\nOpen estudiantes.html for the student website.\nArrow keys / Home / End: navigate. F: fullscreen. Reading view: scroll.\n\nTWO SCREENS / ZOOM\nClick Presenter view to open English notes, current/next previews and a manual 10-minute timer. Allow the popup if blocked. Move the notes to your second display. In Zoom share only the audience/slides window. Navigation works in either window. Slide 2 plays the same six-stage route as the website; use Pause route, Replay or Full route on the slide or in Presenter view. Click Start when you begin speaking.\nThe original printed slide numbers and links are retained; the viewer counts all 15 slides.\n\nPhotographs, city street maps, notes, fonts, route animation, trip data, credits and the PDF are included locally.\nOnly the student portal online basemap tiles and external links need Internet access.\nProgramme and estimates remain subject to confirmation.\n")
print(f"Packaged {output.name}: {output.stat().st_size:,} bytes")
