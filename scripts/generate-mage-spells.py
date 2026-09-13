#!/usr/bin/env python3
"""Generate Arcana-sharded Mage spell JSON from the offline Codex archive."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
import zipfile
from pathlib import Path

from bs4 import BeautifulSoup

ARCANA = ("Death", "Fate", "Forces", "Life", "Matter", "Mind", "Prime", "Space", "Spirit", "Time")
MEMBER = "codexofdarkness.com/wiki/Spells,_All_(2nd_Edition).html"
NAME_CORRECTIONS = {
    "Craftsmen's Eye": "Craftsman's Eye",
    "Fractured Grimoire": "Fracture Grimoire",
    "Goetic Evocatuion": "Goetic Evocation",
    "Goetic Evocatuion (Death Substitute)": "Goetic Evocation (Death Substitute)",
    "Shared Mage Sight": "Shared Sight",
}
ROTE_SKILL_CORRECTIONS = {
    "Craft": ["Crafts"],
    "Computers": ["Computer"],
    "Empathy Survival": ["Empathy", "Survival"],
    "Intimidate": ["Intimidation"],
    "Investigation Subterfuge": ["Investigation", "Subterfuge"],
    "Leadership?(awaiting Errata)": ["Leadership"],
}


def slug(value: str) -> str:
    plain = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", plain.lower()).strip("-")


def sources(value: str) -> list[tuple[str, str, int]]:
    books = {
        "MtAw2": ("mta-2ed", "Mage the Awakening"),
        "SoS": ("mta-signs-of-sorcery", "Signs of Sorcery"),
        "DE2": ("core-dark-eras-2", "Dark Eras 2"),
    }
    found = []
    for code, page in re.findall(r"(MtAw2(?:ed)?|SoS|DE2)\s*p?\s*(\d+)", value):
        code = "MtAw2" if code.startswith("MtAw2") else code
        source_id, book = books[code]
        found.append((source_id, book, int(page)))
    if not found:
        raise ValueError(f"Unknown source: {value}")
    return found


def parse(archive: Path) -> list[dict[str, object]]:
    with zipfile.ZipFile(archive) as bundle:
        soup = BeautifulSoup(bundle.read(MEMBER), "html.parser")
    result: list[dict[str, object]] = []
    for table in soup.find_all("table")[:10]:
        arcanum, level = "", 0
        for row in table.find_all("tr"):
            cells = row.find_all(["th", "td"], recursive=False)
            if len(cells) == 1 and cells[0].name == "th":
                match = re.match(rf"({'|'.join(ARCANA)})\s+([1-5])", cells[0].get_text(" ", strip=True))
                if match:
                    arcanum, level = match.group(1), int(match.group(2))
                continue
            if len(cells) < 8 or cells[0].name != "td":
                continue
            values = [cell.get_text(" ", strip=True) for cell in cells[:8]]
            secondary = values[1]
            requirements = {arcanum: level}
            if secondary != "-":
                secondary_name = secondary.split()[0]
                requirements[secondary_name] = sum(character in "•●" for character in secondary)
            citations = sources(values[7])
            source_id, book, page = citations[0]
            name = NAME_CORRECTIONS.get(values[0], values[0])
            rote_skills = []
            for item in (part.strip() for part in values[5].split(",")):
                if item and item != "-":
                    rote_skills.extend(ROTE_SKILL_CORRECTIONS.get(item, [item]))
            result.append({
                "id": f"{source_id}:{slug(arcanum)}-{level}-{slug(name)}",
                "name": name,
                "originalName": name,
                "requirements": requirements,
                "practice": values[2],
                "primaryFactor": values[3],
                "withstand": "" if values[4] == "-" else values[4],
                "roteSkills": rote_skills,
                "description": values[6],
                "sourceId": source_id,
                "source": book,
                "page": page,
                **({"additionalSources": [
                    {"sourceId": extra_id, "source": extra_book, "page": extra_page}
                    for extra_id, extra_book, extra_page in citations[1:]
                ]} if len(citations) > 1 else {}),
            })
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    spells = parse(args.archive)
    if len(spells) != 360 or len({item["id"] for item in spells}) != 360:
        raise SystemExit(f"Expected 360 unique spell records, got {len(spells)} records/{len({item['id'] for item in spells})} IDs")
    args.output.mkdir(parents=True, exist_ok=True)
    reviewed: dict[str, dict[str, object]] = {}
    for path in args.output.glob("*.json"):
        if path.name == "index.json":
            continue
        for item in json.loads(path.read_text(encoding="utf-8")):
            reviewed[item["id"]] = item
    for spell in spells:
        previous = reviewed.get(spell["id"], {})
        for key in ("summary", "summaryReviewed"):
            if key in previous:
                spell[key] = previous[key]
    for arcanum in ARCANA:
        shard = [item for item in spells if next(iter(item["requirements"])) == arcanum]
        (args.output / f"{arcanum.lower()}.json").write_text(
            json.dumps(shard, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
    index = [
        {
            key: item[key]
            for key in ("id", "name", "originalName", "requirements", "sourceId", "source", "page")
        }
        | {"shard": next(iter(item["requirements"])).lower()}
        for item in spells
    ]
    (args.output / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
