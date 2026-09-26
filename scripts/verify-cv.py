#!/usr/bin/env python3
"""Verify the shared CV exports without editing them.

Requires Python 3.10+, pdfplumber, pypdf and Poppler's pdftotext.
Run from any directory: python3 scripts/verify-cv.py [exported-data.json]
With no JSON argument, Node.js 22.18+ reads lib/cv.ts directly.
Set PDFTOTEXT_PATH or CV_NODE_PATH if those executables are not on PATH.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import sys
import uuid
import xml.etree.ElementTree as ET
from zipfile import ZipFile

import pdfplumber
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
HEADINGS = ["Summary", "Technical Skills", "Projects", "Experience", "Education"]
MAX_UPLOAD_BYTES = 2_500_000
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"w": W, "r": R}
logging.getLogger("pdfminer").setLevel(logging.ERROR)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def executable(env_name, name):
    candidate = os.environ.get(env_name) or shutil.which(name)
    require(candidate is not None, f"Install {name} or set {env_name} to its executable path.")
    require(Path(candidate).is_file(), f"Executable not found: {candidate}")
    return str(candidate)


def normalize(text):
    # Ignore wrapping/whitespace and the intentional ASCII-dash conversion only.
    return re.sub(r"\s+", "", re.sub(r"[\u2013\u2014\u2212]", "-", text))


def all_fields(value):
    if isinstance(value, str):
        return [value] if value else []
    if isinstance(value, list):
        return [field for item in value for field in all_fields(item)]
    if isinstance(value, dict):
        return [field for key, item in value.items() if key != "label" for field in all_fields(item)]
    return []


def ordered(text, markers, label):
    value = normalize(text)
    cursor = 0
    for marker in markers:
        position = value.find(normalize(marker), cursor)
        require(position >= 0, f"{label}: missing or out-of-order item: {marker}")
        cursor = position + len(normalize(marker))


def check_text(text, data, label):
    value = normalize(text)
    missing = [field for field in all_fields(data) if normalize(field) not in value]
    require(not missing, f"{label}: missing shared fields: {missing}")
    require(value.startswith(normalize(data["name"])), f"{label}: name is not first in reading order")
    require(not re.search(r"[\ue000-\uf8ff\ufffd]", text), f"{label}: private-use/replacement characters found")
    ordered(text, HEADINGS, label + " sections")
    project_text = text[text.index("Projects"):text.index("Experience")]
    job_text = text[text.index("Experience"):text.index("Education")]
    education_text = text[text.index("Education"):]
    ordered(project_text, [item["name"] + ":" for item in data["selectedWork"]], label + " projects")
    ordered(job_text, [item["role"] + " | " + item["company"] for item in data["experience"]], label + " jobs")
    ordered(education_text, [item["title"] + " | " + item["org"] for item in data["education"]], label + " education")


def check_pdf(file, data, pdftotext):
    poppler_text = subprocess.run([pdftotext, str(file), "-"], check=True, capture_output=True, text=True).stdout
    check_text(poppler_text, data, file.name + " / pdftotext")
    with pdfplumber.open(file) as document:
        require(bool(document.pages), file.name + ": no pages")
        plumber_text = "\n".join(page.extract_text(x_tolerance=2) or "" for page in document.pages)
        check_text(plumber_text, data, file.name + " / pdfplumber")
        minimum_font = min(char["size"] for page in document.pages for char in page.chars)
        require(minimum_font >= 10.49, file.name + ": text smaller than 10.5 pt")
        for number, page in enumerate(document.pages, 1):
            require(page.chars, f"{file.name} page {number}: no selectable text")
            require(abs(page.width - 595.28) < 1 and abs(page.height - 841.89) < 1,
                    f"{file.name} page {number}: not A4")
            # Mechanical bounds are supplemented by the documented visual review.
            require(all(char["x0"] >= 18 and char["x1"] <= page.width - 18 and
                        char["top"] >= 18 and char["bottom"] <= page.height - 18
                        for char in page.chars), f"{file.name} page {number}: text outside safe page bounds")
        count = len(document.pages)
    reader = PdfReader(file)
    root = reader.trailer["/Root"]
    require(root.get("/StructTreeRoot") is not None and root.get("/MarkInfo", {}).get("/Marked"),
            file.name + ": missing PDF structure tags")
    for number, page in enumerate(reader.pages, 1):
        fonts = page["/Resources"].get("/Font", {})
        require(bool(fonts), f"{file.name} page {number}: no font resources")
        for reference in fonts.values():
            font = reference.get_object()
            require("/ToUnicode" in font, file.name + ": font lacks Unicode mapping")
            descendants = font.get("/DescendantFonts", [font])
            for descendant in descendants:
                descriptor_ref = descendant.get_object().get("/FontDescriptor")
                require(descriptor_ref is not None, file.name + ": missing font descriptor")
                descriptor = descriptor_ref.get_object()
                require("/FontFile2" in descriptor or "/FontFile3" in descriptor,
                        file.name + ": font is not embedded")
    source = ROOT / "Cem Bilen CV 2026 HTML/PDF" / file.name
    require(source.read_bytes() == file.read_bytes(), file.name + ": source/public copies differ")
    return {"file": file.name, "bytes": file.stat().st_size, "pages": count,
            "minimum_font_pt": round(minimum_font, 2), "parsers": ["pdftotext", "pdfplumber"]}


def check_docx(file, data):
    with ZipFile(file) as archive:
        document = ET.fromstring(archive.read("word/document.xml"))
        body = document.find("w:body", NS)
        require(body is not None, "DOCX: missing document body")
        paragraphs = body.findall("w:p", NS)
        text = "\n".join("".join(t.text or "" for t in p.iter(f"{{{W}}}t"))
                         for p in paragraphs)
        check_text(text, data, "DOCX body paragraphs")
        title_style = paragraphs[0].find("w:pPr/w:pStyle", NS)
        require(title_style is not None and title_style.get(f"{{{W}}}val") == "Title", "DOCX: missing Title style")
        for tag in ["tbl", "txbxContent", "drawing", "pict", "headerReference", "footerReference"]:
            require(document.find(".//w:" + tag, NS) is None, "DOCX: unsupported layout element " + tag)
        for columns in document.findall(".//w:cols", NS):
            require(int(columns.get(f"{{{W}}}num", "1")) == 1, "DOCX: multiple columns")
        styles = ET.fromstring(archive.read("word/styles.xml"))
        require(styles.find(".//w:pBdr", NS) is None, "DOCX: paragraph-border residue")
        for style_id in ["Normal", "Title", "Heading1", "Heading2"]:
            size = styles.find(f"w:style[@w:styleId='{style_id}']/w:rPr/w:sz", NS)
            require(size is not None and int(size.get(f"{{{W}}}val")) >= 21,
                    "DOCX: missing or too-small style size " + style_id)
        for run_size in document.findall(".//w:sz", NS):
            require(int(run_size.get(f"{{{W}}}val")) >= 21, "DOCX: run text smaller than 10.5 pt")
        table = ET.fromstring(archive.read("word/fontTable.xml"))
        inter = table.find("w:font[@w:name='Inter']", NS)
        require(inter is not None, "DOCX: Inter font entry missing")
        relations = ET.fromstring(archive.read("word/_rels/fontTable.xml.rels"))
        targets = {element.get("Id"): element.get("Target") for element in relations}
        for label in ["Regular", "Bold"]:
            embedded = inter.find("w:embed" + label, NS)
            require(embedded is not None, "DOCX: missing embedded Inter " + label)
            key = uuid.UUID(embedded.get(f"{{{W}}}fontKey").strip("{}"))
            mask = bytes.fromhex(key.hex)[::-1]
            target = targets[embedded.get(f"{{{R}}}id")]
            payload = bytearray(archive.read(str(PurePosixPath("word") / target)))
            for index in range(32):
                payload[index] ^= mask[index % 16]
            font_source = ROOT / "Cem Bilen CV 2026 HTML/fonts" / f"Inter-{label}.ttf"
            require(bytes(payload) == font_source.read_bytes(), "DOCX: embedded font mismatch " + label)
    return {"file": file.name, "bytes": file.stat().st_size, "body_paragraphs": len(paragraphs), "fonts_embedded": True}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("data_json", nargs="?", type=Path, help="Optional JSON written by CV_DATA_JSON during export")
    parser.add_argument("--json", action="store_true", help="Print machine-readable validation results")
    args = parser.parse_args()
    if args.data_json:
        data = json.loads(args.data_json.read_text())
    else:
        node = executable("CV_NODE_PATH", "node")
        code = "const { cvData } = await import(process.argv[1]); process.stdout.write(JSON.stringify(cvData));"
        result = subprocess.run([node, "--input-type=module", "-e", code, (ROOT / "lib/cv.ts").as_uri()],
                                check=True, capture_output=True, text=True, cwd=ROOT)
        data = json.loads(result.stdout)
    pdftotext = executable("PDFTOTEXT_PATH", "pdftotext")
    output = ROOT / "public/cv"
    names = ["Cem Bilen CV 2026.pdf", "Cem Bilen CV 2026 Light.pdf", "Cem Bilen CV 2026 Dark.pdf",
             "Cem Bilen CV 2026.docx", "Cem Bilen CV 2026.txt"]
    for name in names:
        file = output / name
        require(file.is_file(), "Missing export: " + name)
        require(0 < file.stat().st_size < MAX_UPLOAD_BYTES, name + ": empty or exceeds 2.5 MB upload budget")
    results = [check_pdf(output / name, data, pdftotext) for name in names if name.endswith(".pdf")]
    results.append(check_docx(output / "Cem Bilen CV 2026.docx", data))
    check_text((output / "Cem Bilen CV 2026.txt").read_text(), data, "TXT")
    require((output / "Cem Bilen CV 2026.pdf").read_bytes() == (output / "Cem Bilen CV 2026 Light.pdf").read_bytes(),
            "Canonical PDF differs from the white/light PDF")
    report = {"status": "PASS", "shared_fields_checked": len(all_fields(data)), "artifacts": results,
              "cv_source_sha256": hashlib.sha256((ROOT / "lib/cv.ts").read_bytes()).hexdigest(),
              "checks": ["all shared fields", "section/project/job/education order", "two PDF parsers",
                         "selectable text and page bounds", "10.5 pt minimum PDF text", "embedded fonts and Unicode maps",
                         "source/public PDF equality", "DOCX body-only single-column structure", "all uploads below 2.5 MB"]}
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        for item in results:
            pages = f", {item['pages']} A4 page(s)" if "pages" in item else f", {item['body_paragraphs']} body paragraphs"
            print(f"PASS {item['file']}: {item['bytes']:,} bytes{pages}")
        print(f"PASS TXT ({(output / names[-1]).stat().st_size:,} bytes) and all {report['shared_fields_checked']} shared fields; section/item order, font, layout and size checks.")
        print("Parser checks reduce compatibility risks; they do not guarantee parsing or ranking in every ATS.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError, KeyError) as error:
        print(f"CV verification FAILED: {error}", file=sys.stderr)
        sys.exit(1)
