from __future__ import annotations

import html
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = Path(r"E:\Downloads\codexofdarkness.com.zip")
OUT = ROOT / "lib" / "merits-en.generated.ts"

PAGES = {
    "universal": "Merits,_Universal_(2nd_Edition)",
    "changeling": "Merits,_Changeling_(2nd_Edition)",
    "styles": "Merits,_Styles_(2nd_Edition)",
}
SOURCE = {
    "CofD": ("core-2ed", "Chronicles of Darkness"),
    "CTL 2e": ("ctl-2ed", "Changeling the Lost"),
    "Hedge": ("ctl-the-hedge", "The Hedge"),
    "MTA 2e": ("mta-2ed", "Mage the Awakening"),
    "DE2": ("de2", "Dark Eras 2"),
}


def wiki_text(archive: zipfile.ZipFile, page: str) -> str:
    path = f"codexofdarkness.com/wiki/{page}@action=edit.html"
    raw = archive.read(path).decode("utf-8")
    match = re.search(r"<textarea[^>]*>(.*?)</textarea>", raw, re.S)
    if not match:
        raise RuntimeError(f"No source textarea in {path}")
    return html.unescape(match.group(1))


def clean(value: str) -> str:
    value = re.sub(r"\[\[([^]|]+)\|([^]]+)]]", r"\2", value)
    value = re.sub(r"\[\[([^]]+)]]", r"\1", value)
    value = re.sub(r"\{\{[^{}]*}}", "", value)
    value = re.sub(r"'{2,}", "", value)
    value = re.sub(r"<[^>]+>", "", value)
    return re.sub(r"\s+", " ", value).strip()


def source(value: str) -> tuple[str, str, int]:
    value = value.split(",", 1)[0].strip()
    match = re.match(r"(.+?)\s+(\d+)$", clean(value))
    if not match or match.group(1) not in SOURCE:
        raise ValueError(value)
    source_id, source_name = SOURCE[match.group(1)]
    return source_id, source_name, int(match.group(2))


def ratings(value: str) -> list[int]:
    dots = [len(item) for item in re.findall(r"[•●]+", value)]
    if not dots:
        return []
    if " to " in value or "–" in value or value.strip().endswith("+"):
        ceiling = 20 if value.strip().endswith("+") else max(dots)
        return list(range(min(dots), ceiling + 1))
    return sorted(set(dots))


def slug(value: str) -> str:
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", value.lower()))


def simple_rows(text: str, group: str) -> list[dict]:
    current = "General"
    rows: list[dict] = []
    row_re = re.compile(r"^\| ([^\r\n]+?)\s*\|\|\s*([^\r\n]+?)\s*\|\|\s*([^\r\n]*?)\s*\|\|\s*([^\r\n]*?)\s*\|\|\s*([^\r\n]+?)\s*$")
    for line in text.splitlines():
        heading = re.match(r"^==\s*(.+?)\s*==$", line)
        if heading:
            current = clean(heading.group(1)).replace(" Merits", "")
            continue
        match = row_re.match(line)
        if not match:
            continue
        name, rating, prerequisites, description, book = map(clean, match.groups())
        book_code = re.sub(r"\s+\d+$", "", book)
        allowed = book_code in {"CofD", "CTL 2e", "Hedge", "DE2"}
        if group == "universal" and name == "Advanced Library" and book_code == "MTA 2e":
            allowed = True
        if not allowed:
            continue
        source_id, source_name, page = source(book)
        if name == "Lucid Dreamer":
            prerequisites = "Non-changeling, Resolve •••"
        rows.append({
            "id": f"{source_id}:{slug(name)}",
            "name": name,
            "ratings": ratings(rating),
            "line": "Core" if group == "universal" else "CtL",
            "sourceId": source_id,
            "source": source_name,
            "category": current,
            "prerequisites": prerequisites or None,
            "description": description,
            "page": page,
        })
    return rows


def style_rows(text: str) -> list[dict]:
    rows: list[dict] = []
    category = "Style"
    block: dict | None = None
    for line in text.splitlines():
        heading = re.match(r"^==\s*(.+?)\s*==$", line)
        if heading:
            category = clean(heading.group(1))
            continue
        start = re.match(r'^\|rowspan="(\d+)"\|([^|]+)\s*\|\|rowspan="\1"\|([^|]*)\|\|(.*?)\|\|rowspan="\1"\|([^\r\n]+)$', line)
        if start:
            count, name, prerequisites, middle, book = start.groups()
            book = clean(book)
            if not book.startswith("CofD "):
                block = None
                continue
            source_id, source_name, page = source(book)
            block = {
                "id": f"{source_id}:{slug(clean(name))}", "name": clean(name), "ratings": [], "line": "Core",
                "sourceId": source_id, "source": source_name, "category": category,
                "prerequisites": clean(prerequisites) or None, "description": "", "page": page, "levels": [],
                "remaining": int(count),
            }
            rows.append(block)
            parts = [clean(item) for item in middle.split("||")]
        elif block and line.startswith("|-"):
            continue
        elif block and line.startswith("|"):
            parts = [clean(item) for item in line[1:].split("||")]
            block["remaining"] -= 1
        else:
            continue
        if block and len(parts) >= 3 and "•" in parts[0]:
            rating = len(re.search(r"[•●]+", parts[0]).group())
            block["ratings"].append(rating)
            block["levels"].append({"rating": rating, "name": parts[1], "description": parts[2]})
        elif block and len(parts) >= 3 and parts[0].startswith("colspan"):
            block["description"] = parts[-1]
    for item in rows:
        item.pop("remaining", None)
        item["ratings"] = sorted(set(item["ratings"]))
        if not item["description"]:
            item["description"] = f"A progressive style with {len(item['levels'])} maneuvers."
    return rows


def main() -> None:
    with zipfile.ZipFile(ARCHIVE) as archive:
        records = simple_rows(wiki_text(archive, PAGES["universal"]), "universal")
        records += simple_rows(wiki_text(archive, PAGES["changeling"]), "changeling")
        records += style_rows(wiki_text(archive, PAGES["styles"]))
    if len(records) != 131:
        raise RuntimeError(f"Expected 131 records, got {len(records)}")
    payload = json.dumps(records, ensure_ascii=False, indent=2)
    OUT.write_text(
        "// Generated from the supplied offline Codex of Darkness snapshot.\n"
        "// English source fields are verified against PDFs before release.\n"
        f"export const MERITS_EN = {payload} as const;\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(records)} records to {OUT}")


if __name__ == "__main__":
    main()
