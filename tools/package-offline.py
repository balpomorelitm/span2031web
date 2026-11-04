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
    bundle.writestr("START-HERE.txt", "GLAS3112 Spain 2027\n\nOpen presentacion.html for the 12-slide presentation.\nOpen estudiantes.html for the student website.\nArrow keys / Home / End: navigate. F: fullscreen. Reading view: scroll.\n\nPhotographs, trip data, credits and the PDF are included locally.\nOnly the optional interactive map and external links need Internet access.\nProgramme and estimates remain subject to confirmation.\n")
print(f"Packaged {output.name}: {output.stat().st_size:,} bytes")
