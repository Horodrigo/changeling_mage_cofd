---
name: cofd-pdf-review
description: Review official Chronicles of Darkness source PDFs in this repository for rules verification, localization, catalog reconstruction, and editorial audits.
---

# CofD PDF Review

Use this project-local workflow instead of depending on a versioned plugin-cache path.

1. Locate the official source under `pdfSources/`.
2. Use `mcp__codex_app__load_workspace_dependencies` when bundled Python or PDF-library paths are needed.
3. Use Python PDF libraries such as `pypdf`, `pdfplumber`, or PyMuPDF to locate candidate pages and extract working text. Never use the system `pdftotext` executable.
4. Render only the relevant pages into a temporary directory and inspect them visually with `view_image`.
5. Map physical PDF pages to printed page numbers and inspect neighboring columns or pages when text continues.
6. Treat extraction as an index. The visually reviewed official page is authoritative for wording, fields, exceptions, and mechanics.
7. Keep temporary renders outside the repository or under an existing ignored temporary path; do not commit them.
