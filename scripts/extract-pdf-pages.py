"""Extract selected one-based PDF pages with explicit page separators."""
from __future__ import annotations

import sys
from pathlib import Path

from pypdf import PdfReader


source = Path(sys.argv[1])
destination = Path(sys.argv[2])
pages = [int(value) for value in sys.argv[3:]]
reader = PdfReader(source)
chunks = [f"===== PDF PAGE {page} =====\n{reader.pages[page - 1].extract_text() or ''}" for page in pages]
destination.write_text("\n\n".join(chunks), encoding="utf-8")
