"""Reproduce the October 2026 archive additions from the reviewed Downloads PDFs."""

import hashlib
import json
import logging
import subprocess
from pathlib import Path

from pypdf import PdfReader, PdfWriter, Transformation

ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path.home() / "Downloads"
OUT = ROOT / "public/reports"
logging.getLogger("pypdf").setLevel(logging.ERROR)

COPIES = {
    "vipan garg myeloma report May 2026.pdf": "2026-may-myeloma-final-report.pdf",
    "349fb33c-0c27-41f1-9c49-233ef8e8ff3a.pdf": "2026-august-myeloma-final-report.pdf",
    "Papa EHR/Mr Vipin Kumar Garg (1).pdf": "2024-december-23-nephrology-labs.pdf",
    "Papa EHR/Mr Vipin Kumar Garg (2).pdf": "2025-january-23-nephrology-labs.pdf",
    "Papa EHR/WhatsApp Document.pdf": "2025-march-03-max-labs.pdf",
    "Papa EHR/Vipin Kumar Garg (1).pdf": "2025-march-31-nephrology-labs.pdf",
    "Papa EHR/Mr. Vipin Kumar Garg.pdf": "2025-april-08-renal-labs.pdf",
    "Papa EHR/Mr. Vipin Kumar Garg (1).pdf": "2025-april-29-max-labs.pdf",
    "Reading & Research/WhatsApp Report May 21 2025.pdf": "2025-may-21-kidney-function.pdf",
    "Health Records/20 Aug Lalpath Report.pdf": "2025-august-20-liver-function.pdf",
    "IBKR Papa Account/Mr VIPIN KUMAR GARG.pdf": "2025-august-27-kidney-urine-screening.pdf",
    "IBKR Papa Account/Mr VIPIN KUMAR GARG (1).pdf": "2025-august-27-iron-ferritin.pdf",
    "IBKR Papa Account/1Mr VIPIN KUMAR GARG ANTI 1.pdf": "2025-august-29-anti-hbs.pdf",
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def record(source, target, transformation):
    path = OUT / target
    return {"source": source, "sourceSha256": digest(DOWNLOADS / source),
            "file": f"/reports/{target}", "sha256": digest(path),
            "pages": len(PdfReader(path).pages), "transformation": transformation}


def select_pages(source, target, indices):
    reader, writer = PdfReader(DOWNLOADS / source), PdfWriter()
    for index in indices:
        writer.add_page(reader.pages[index])
    writer.write(OUT / target)
    return record(source, target, {"sourcePages": [index + 1 for index in indices]})


def paginate_july():
    source = "444713279_Report_F_SL_2026-08-01T160203_report.pdf"
    target = "2026-july-myeloma-final-report.pdf"
    reader, writer = PdfReader(DOWNLOADS / source), PdfWriter()
    assert len(reader.pages) == 1
    original = reader.pages[0]
    assert tuple(float(x) for x in original.mediabox) == (0, 0, 375, 6681)
    # This iOS export stacks 13 report sheets at a fixed 512.5598-point pitch.
    # Boundaries fall in the blank gutters, preserving all printed content.
    boundaries = [6681] + [6162.459 - 512.5598 * i for i in range(12)] + [0]
    for top, bottom in zip(boundaries, boundaries[1:]):
        page = writer.add_blank_page(375, top - bottom)
        page.merge_transformed_page(original, Transformation().translate(0, -bottom))
        page.scale_by(595.28 / 375)
    writer.write(OUT / target)
    extracted = subprocess.check_output(["pdftotext", "-layout", str(OUT / target), "-"], text=True)
    original_text = subprocess.check_output(["pdftotext", "-layout", str(DOWNLOADS / source), "-"], text=True)
    normalize = lambda text: "".join(text.split())
    assert normalize(extracted) == normalize(original_text), "Pagination must preserve all report text"
    return record(source, target, {"operation": "13 lossless page crops at blank gutters"})


if __name__ == "__main__":
    records = []
    for source, target in COPIES.items():
        (OUT / target).write_bytes((DOWNLOADS / source).read_bytes())
        records.append(record(source, target, "byte-identical copy"))
    records.append(paginate_july())
    records.append(select_pages("PGI Reports_merged.pdf", "2026-june-pgi-reports.pdf", range(30, 67)))
    records.append(select_pages("discharge-summary_organized.pdf", "2026-july-pgi-discharge-original.pdf", range(3)))
    (ROOT / "testing/report-sources.json").write_text(json.dumps(records, indent=2) + "\n")
    print(f"Prepared and recorded {len(records)} reviewed report assets")
