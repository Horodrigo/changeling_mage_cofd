"""Extract a page range one column at a time to preserve reading order."""

from __future__ import annotations

import argparse
from pathlib import Path

import pdfplumber


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--first", type=int, required=True, help="First physical PDF page, one-based")
    parser.add_argument("--last", type=int, required=True, help="Last physical PDF page, one-based")
    parser.add_argument("--gutter", type=float, default=0.025, help="Half-gutter as a fraction of page width")
    args = parser.parse_args()

    chunks: list[str] = []
    with pdfplumber.open(args.pdf) as document:
        for physical_page in range(args.first, args.last + 1):
            page = document.pages[physical_page - 1]
            midpoint = page.width / 2
            gap = page.width * args.gutter
            left = page.crop((0, 0, midpoint - gap, page.height))
            right = page.crop((midpoint + gap, 0, page.width, page.height))
            chunks.extend([
                f"<<<PDF_PAGE {physical_page} LEFT>>>",
                left.extract_text(layout=True) or "",
                f"<<<PDF_PAGE {physical_page} RIGHT>>>",
                right.extract_text(layout=True) or "",
            ])

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(chunks), encoding="utf-8")


if __name__ == "__main__":
    main()
