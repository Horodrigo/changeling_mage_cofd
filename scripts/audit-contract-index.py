"""Extract the offline Codex of Darkness Contract index without using network access."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path

from lxml import html


SPACE = re.compile(r"\s+")


def clean(node) -> str:
    return SPACE.sub(" ", " ".join(node.itertext())).strip()


def infer_category(section: str) -> tuple[str, str]:
    normalized = section.strip()
    if normalized.lower().startswith("royal contracts of "):
        return "Royal", normalized[len("Royal Contracts of ") :]
    if normalized.lower().startswith("goblin contracts"):
        return "Goblin", "Goblin"
    if normalized.lower().startswith("common independent contracts"):
        return "Common", "Independent"
    if normalized.lower().startswith("royal independent contracts"):
        return "Royal", "Independent"
    if normalized.lower().startswith("contracts of "):
        return "Common", normalized[len("Contracts of ") :]
    return "Unknown", normalized


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("html", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    document = html.parse(str(args.html))
    records: list[dict] = []
    for table in document.xpath('//div[contains(@class,"mw-parser-output")]//table'):
        section = ""
        current = None
        for row in table.xpath(".//tr"):
            cells = row.xpath("./th|./td")
            if not cells:
                continue
            if all(cell.tag == "th" for cell in cells):
                heading = clean(cells[0])
                if heading and heading not in {"Contract", "Contract Cost Dice Pool Loopholes Description Book"}:
                    section = heading
                continue

            data = row.xpath("./td")
            if len(data) >= 6:
                contract_type, category = infer_category(section)
                current = {
                    "name": clean(data[0]),
                    "type": contract_type,
                    "category": category,
                    "cost_index": clean(data[1]),
                    "dice_pool_index": clean(data[2]),
                    "loophole_index": clean(data[3]),
                    "summary_index": clean(data[4]),
                    "reference": clean(data[5]),
                    "benefits_index": {},
                }
                records.append(current)
            elif len(data) >= 2 and current is not None:
                label = clean(data[0])
                if label in {"Beast", "Darkling", "Elemental", "Fairest", "Ogre", "Wizened"}:
                    current["benefits_index"][label] = clean(data[1])

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"records={len(records)}")
    print("types=" + json.dumps(Counter(item["type"] for item in records), sort_keys=True))
    print("sources=" + json.dumps(Counter(re.sub(r"\s+\d+(?:-\d+)?$", "", item["reference"]) for item in records), sort_keys=True))


if __name__ == "__main__":
    main()
