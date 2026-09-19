#!/usr/bin/env python3
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
required = [
    root / "SKILL.md",
    root / "references" / "books-and-editions.md",
    root / "references" / "source-precedence.md",
    root / "references" / "game-lines.md",
    root / "references" / "verification-checklist.md",
]

missing = [str(p.relative_to(root)) for p in required if not p.exists()]
skill = (root / "SKILL.md").read_text(encoding="utf-8") if (root / "SKILL.md").exists() else ""

errors = []
if missing:
    errors.append("Missing: " + ", ".join(missing))
if "name: cofd-rules" not in skill:
    errors.append("SKILL.md is missing expected name metadata")
if "description:" not in skill:
    errors.append("SKILL.md is missing description metadata")

if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)

print("cofd-rules skill pack: OK")
