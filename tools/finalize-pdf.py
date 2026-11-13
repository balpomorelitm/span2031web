"""Finalize a Chromium presentation export without changing its visual resources.

Requires PyMuPDF. Usage: python tools/finalize-pdf.py tmp/qa/presentation-raw.pdf
"""
from pathlib import Path
import sys
import fitz

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "tmp/qa/presentation-raw.pdf"
destination = root / "assets/downloads/GLAS3112-Spain-2027.pdf"
public_base = "https://balpomorelitm.github.io/span2031web/"
document = fitz.open(stream=source.read_bytes(), filetype="pdf")
if len(document) != 15:
    raise ValueError(f"Expected 15 presentation pages, found {len(document)}")
for page in document:
    for link in page.get_links():
        local = link.get("file", "")
        if local or link.get("uri", "").startswith("file:"):
            target = local or link["uri"]
            if "/span2031web/" not in target:
                raise ValueError("Unexpected local link in presentation PDF")
            target = public_base + target.split("/span2031web/", 1)[1]
            rectangle = link["from"]
            page.delete_link(link)
            page.insert_link({"kind": fitz.LINK_URI, "from": rectangle, "uri": target})
document.set_metadata({
    "title": "GLAS3112 Spain 2027",
    "author": "HKU Spanish Programme / Global and Area Studies",
    "subject": "Student information session, 13 November 2026",
})
# Preserve Chromium's patterns, gradients and editable text; do not rewrite images.
document.save(destination, garbage=4, deflate=True, use_objstms=1)
final = fitz.open(destination)
if any(link.get("file") or link.get("uri", "").startswith("file:") for page in final for link in page.get_links()):
    raise ValueError("A local file link remains in the PDF")
if any(abs(page.rect.width / page.rect.height - 16 / 9) > 0.001 for page in final):
    raise ValueError("The presentation PDF is not 16:9")
print(f"Finalized {len(final)} pages with public links: {destination.name}")
