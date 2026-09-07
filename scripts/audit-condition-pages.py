"""Locate Condition and Tilt headings in approved source PDFs.

This is an audit helper only: it deliberately reports every matching PDF page
so the operator can reject table-of-contents and cross-reference matches.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from pypdf import PdfReader


def main() -> None:
    source = Path(sys.argv[1])
    terms = sys.argv[2:]
    matches = {term: [] for term in terms}
    for index, page in enumerate(PdfReader(source).pages, start=1):
        text = page.extract_text() or ""
        lowered = text.lower()
        for term in terms:
            if term.lower() in lowered:
                matches[term].append(index)
    print(json.dumps(matches, ensure_ascii=True))


if __name__ == "__main__":
    main()
