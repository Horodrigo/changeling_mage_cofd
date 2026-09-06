"""Extract page-delimited text while retaining two-column page geometry."""

from __future__ import annotations

import argparse
from pathlib import Path

import pdfplumber


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with pdfplumber.open(args.input) as document, args.output.open("w", encoding="utf-8") as stream:
        for number, page in enumerate(document.pages, start=1):
            stream.write(f"\n<<<PDF_PAGE {number}>>>\n")
            stream.write(page.extract_text(layout=True, x_tolerance=2, y_tolerance=3) or "")
            stream.write("\n")

    print(f"pages={len(document.pages)} output={args.output}")


if __name__ == "__main__":
    main()
