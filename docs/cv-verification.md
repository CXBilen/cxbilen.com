# CV export verification

Last successful verification: **26 September 2026**.

The CV uses a single column with body text in reading order, visible contact details and URLs, and the headings Summary, Technical Skills, Projects, Experience and Education. The canonical application file is `public/cv/Cem Bilen CV 2026.pdf`. An editable DOCX and plain text copy are also available. Actual employment titles, dates and education are preserved from `lib/cv.ts`.

Typography follows [COSS's default Inter preset](https://coss.com/ui/docs/get-started), with the [default neutral palette](https://coss.com/ui/docs/styling). Inter is stored locally under its SIL Open Font License and embedded in the PDF and DOCX. Export does not require a font download.

## Recorded results

| Artifact in `public/cv` | File size | Pages | Result |
| --- | ---: | ---: | --- |
| `Cem Bilen CV 2026.pdf` | 33,679 bytes | 1 A4 | Pass |
| `Cem Bilen CV 2026 Light.pdf` | 33,679 bytes | 1 A4 | Pass |
| `Cem Bilen CV 2026 Dark.pdf` | 33,683 bytes | 1 A4 | Pass |
| `Cem Bilen CV 2026.docx` | 367,377 bytes | 1 A4 in LibreOffice | Pass |
| `Cem Bilen CV 2026.txt` | 2,557 bytes | Not applicable | Pass |

All **69 non-empty shared content fields** were found in both PDF text extractors, the DOCX body paragraphs, and TXT. Verification also passed for:

- Section order and the order of every project, employment entry and education entry.
- Selectable PDF text, A4 geometry, text bounds, and a minimum PDF font size of 10.5 pt.
- Embedded TrueType fonts with Unicode maps in every PDF; no private-use or replacement characters in extracted text.
- Identical source-folder and public PDF copies. The canonical PDF is identical to the white/light version.
- DOCX content in 29 ordinary body paragraphs, with no tables, text boxes, drawings, header/footer contact blocks, or multiple columns.
- Embedded Inter Regular and Bold in the DOCX; deobfuscated font bytes match the bundled source fonts.
- Every download below the conservative 2,500,000-byte budget.

The content source at verification had SHA-256:

```text
65d8ad1b33561162322cff7e5e22b5f63adde3c20657bd7121c8045bbcdf581a
```

The canonical PDF, dark PDF and DOCX render were visually inspected for clipping, missing glyphs, overlap and spacing. Review images: [white PDF](screenshots/cv-ats-pdf-light.png), [dark PDF](screenshots/cv-ats-pdf-dark.png), [DOCX](screenshots/cv-ats-docx.png). DOCX was rendered with the bundled LibreOffice renderer; its resulting PDF uses only Inter fonts. These images record this verification run, so regenerate them after changing the content or layout.

## Repeat the automated checks

Install Python dependencies `pdfplumber` and `pypdf`, and make Poppler's `pdftotext` available. The default command reads the current `lib/cv.ts` using Node.js 22.18 or later:

```sh
python3 scripts/verify-cv.py
```

If Poppler is outside `PATH`, set `PDFTOTEXT_PATH` to its executable. Use `CV_NODE_PATH` similarly for Node. These are machine-specific settings; the verifier has no personal runtime paths.

To verify using the JSON written by `CV_DATA_JSON` during export:

```sh
python3 scripts/verify-cv.py /tmp/cxbilen-cv-data.json
```

Use a freshly exported JSON file after any copy change. Add `--json` for machine-readable results. The verifier reads artifacts and does not re-export them. Export instructions are in the [README](../README.md#update-the-cv).

DOCX pagination and visual appearance require a separate document renderer; paragraph/XML checks alone do not establish its page layout. After any authoring change, re-render and inspect each final page as well as rerunning the verifier.

## ATS compatibility scope

Greenhouse documents parsing failures caused by files over **2.5 MB**, image-based resumes, complex tables, columns, unclear sections, and contact details inside headers, footers or text boxes. The export structure and size checks address those documented risks. The 2.5 MB value is a parsing threshold, not a claim about every upload limit. [Greenhouse resume parsing guidance](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse)

Workable recommends readable fonts, clear sections and document files instead of image-only resumes; its applicant guidance accepts PDF and DOCX up to **5 MB**. The PDF and DOCX meet those format and size conditions. [Workable applicant guidance](https://jobseekers.workable.com/hc/en-us/articles/360036231313-Import-your-resume-details-to-autofill-the-application)

The TXT export is useful for copying text and inspecting extraction. It is not a universal upload alternative: Workable's standard resume-upload list does not include TXT. Follow each application form's accepted formats. [Workable upload formats](https://help.workable.com/hc/en-us/articles/115012238108-What-types-of-files-can-be-uploaded-on-the-application-form)

These are local extraction and document checks. The files were not submitted to an employer's live ATS during this task. Parser versions and employer settings can differ, so this is not a guarantee that every field will auto-fill correctly, nor a scoring or hiring-outcome claim. Review the fields after uploading.
