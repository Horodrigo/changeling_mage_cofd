#!/usr/bin/env python3
"""Validate every generated Mage spell title against its cited local PDF."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path

import pdfplumber


def normalized(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def read_catalog(path: Path) -> list[dict]:
    shards = [candidate for candidate in path.glob("*.json") if candidate.name != "index.json"]
    if not shards:
        raise SystemExit(f"Could not find spell JSON shards in {path}")
    return [item for shard in sorted(shards) for item in json.loads(shard.read_text(encoding="utf-8"))]


def pdf_text(path: Path) -> str:
    with pdfplumber.open(path) as pdf:
        return normalized("\n".join(page.extract_text() or "" for page in pdf.pages))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, default=Path("public/data/mage/spells"))
    parser.add_argument("--mage", type=Path, required=True)
    parser.add_argument("--signs", type=Path, required=True)
    parser.add_argument("--dark-eras-2", type=Path, required=True)
    args = parser.parse_args()

    documents = {
        "mta-2ed": pdf_text(args.mage),
        "mta-signs-of-sorcery": pdf_text(args.signs),
        "core-dark-eras-2": pdf_text(args.dark_eras_2),
    }
    spells = read_catalog(args.catalog)
    missing: list[str] = []
    for spell in spells:
        title = spell["name"].replace(" (Death Substitute)", "")
        source_text = documents.get(spell["sourceId"])
        if source_text is None or normalized(title) not in source_text:
            missing.append(f'{spell["name"]} ({spell["source"]}, p. {spell["page"]})')

    if missing:
        raise SystemExit("Titles absent from their cited PDFs:\n- " + "\n- ".join(missing))
    print(f"Validated all {len(spells)} spell records against their cited PDFs.")


if __name__ == "__main__":
    main()
