#!/usr/bin/env python3
"""Build the Changeling-only webfont family from the vendored EB Garamond sources.

Requirements:
    pip install fonttools brotli

The modified family remains covered by assets/fonts/changeling/OFL.txt.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "assets" / "fonts" / "changeling" / "source"
DEFAULT_OUTPUT = ROOT / "public" / "fonts" / "changeling"


@dataclass(frozen=True)
class Face:
    source: str
    output: str
    family: str
    subfamily: str
    postscript: str


FACES = (
    Face("EBGaramond12-Regular.ttf", "changeling-regular.woff2", "Changeling Sheet", "Regular", "ChangelingSheet-Regular"),
    Face("EBGaramond12-Italic.ttf", "changeling-italic.woff2", "Changeling Sheet", "Italic", "ChangelingSheet-Italic"),
    Face("EBGaramond12-AllSC.ttf", "changeling-small-caps.woff2", "Changeling Sheet Small Caps", "Regular", "ChangelingSheetSmallCaps-Regular"),
)


def set_name(font: TTFont, name_id: int, value: str) -> None:
    for record in font["name"].names:
        if record.nameID != name_id:
            continue
        try:
            record.string = value.encode(record.getEncoding())
        except (LookupError, UnicodeEncodeError):
            record.string = value.encode("utf-16-be")


def rename(font: TTFont, face: Face) -> None:
    full_name = f"{face.family} {face.subfamily}"
    set_name(font, 1, face.family)
    set_name(font, 2, face.subfamily)
    set_name(font, 4, full_name)
    set_name(font, 6, face.postscript)
    set_name(font, 16, face.family)
    set_name(font, 17, face.subfamily)


def condense_outlines(font: TTFont, x_scale: float) -> None:
    if "glyf" not in font:
        raise RuntimeError("Expected TrueType outlines in the EB Garamond source")

    glyph_table = font["glyf"]
    glyph_set = font.getGlyphSet()
    for glyph_name in font.getGlyphOrder():
        pen = TTGlyphPen(glyph_set)
        glyph_set[glyph_name].draw(TransformPen(pen, (x_scale, 0, 0, 1, 0, 0)))
        glyph_table[glyph_name] = pen.glyph()

    metrics = font["hmtx"].metrics
    for glyph_name, (advance, left_bearing) in tuple(metrics.items()):
        metrics[glyph_name] = (round(advance * x_scale), round(left_bearing * x_scale))


def build(face: Face, source_dir: Path, output_dir: Path, x_scale: float) -> Path:
    source = source_dir / face.source
    if not source.is_file():
        raise FileNotFoundError(f"Missing source font: {source}")

    font = TTFont(source, recalcTimestamp=False)
    rename(font, face)
    condense_outlines(font, x_scale)
    font.flavor = "woff2"

    destination = output_dir / face.output
    output_dir.mkdir(parents=True, exist_ok=True)
    font.save(destination, reorderTables=True)
    return destination


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--x-scale", type=float, default=0.965)
    args = parser.parse_args()

    if not 0.8 <= args.x_scale <= 1.0:
        raise SystemExit("--x-scale must be between 0.8 and 1.0")

    for face in FACES:
        print(f"Built {build(face, args.source_dir, args.output_dir, args.x_scale)}")


if __name__ == "__main__":
    main()
