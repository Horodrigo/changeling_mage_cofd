# Mage Spells catalog audit

## Scope and sources

The catalog is generated English-first from the offline `Spells, All (2nd Edition)` page in `codexofdarkness.com.zip`. The page contains 360 table rows covering all ten Arcana. Its citations resolve to the locally available PDFs:

- *Mage: The Awakening Second Edition*: 296 rows.
- *Signs of Sorcery*: 61 rows.
- *Dark Eras 2*: 3 rows.

The generated records retain the spell name, primary and secondary Arcana requirements, Practice, Primary Factor, Withstand, suggested Rote Skills, summary, primary source, page, and any additional source citation.

## PDF verification

`scripts/validate-mage-spells-pdfs.py` confirmed that every one of the 360 generated records has its canonical title in the cited local PDF. Before applying the corrections below, normalized matching found 355 of the 360 offline titles verbatim. The remaining five were inspected in the cited pages and corrected to the printed title:

| Offline table text | Implemented canonical title |
| --- | --- |
| Craftsmen's Eye | Craftsman's Eye |
| Goetic Evocatuion | Goetic Evocation |
| Goetic Evocatuion (Death Substitute) | Goetic Evocation (Death Substitute) |
| Shared Mage Sight | Shared Sight |
| Fractured Grimoire | Fracture Grimoire |

The Death substitute for Goetic Evocation remains a distinct catalog row because it has a different primary Arcanum requirement. Haunted Grimoire and Scribe Daimonomikon likewise retain their separate Arcana variants.

## Rote Skill normalization

Obvious singular, plural, and delimiter errors were normalized to the game's canonical Skill names: `Craft` to `Crafts`, `Computers` to `Computer`, `Intimidate` to `Intimidation`, and the missing separators in `Empathy Survival` and `Investigation Subterfuge` were restored.

*Signs of Sorcery*, p. 55 prints `Leadership` for Ritual Focus even though Leadership is not a standard Skill. The offline page explicitly marks it as awaiting errata. It remains `Leadership` until an authoritative erratum is added as a source.

## Reproducibility and checks

`scripts/generate-mage-spells.py` regenerates `lib/spells.ts` from the offline ZIP and rejects any result other than 360 unique records. `scripts/validate-mage-spells-pdfs.py` extracts the three local PDFs and verifies that every generated spell title occurs in its cited book. `tests/mage-spells-catalog.test.mjs` verifies completeness, English canonical names, valid Arcana requirements, normalized Rote Skills, source counts, additional citations, corrected titles, and absence of the previously concatenated rank and section headings.

Portuguese and other translations are intentionally deferred. `name` and `originalName` therefore contain the same canonical English title in this version.
