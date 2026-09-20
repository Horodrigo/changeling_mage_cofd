---
name: cofd-rules
description: Use for any task involving Chronicles of Darkness (CofD), its game lines, traits, merits, powers, character creation, rules data, validation, UI labels, schemas, catalogs, or homebrew. Prevents accidental use of D&D, Classic/Old World of Darkness, or first-edition-only CofD(Called New World of Darkness or nWoD) rules. Use official 2e or 1&2-compatible CofD sources and verify uncertain rules instead of guessing.
---

# Chronicles of Darkness rules discipline

Use this skill whenever a task depends on tabletop-RPG meaning inside a Chronicles of Darkness project, even when the task is primarily code, data modeling, UI, tests, import/export, or refactoring.

## Local source library

For this repository, resolve rule sources from `pdfSources/` first:

- official book PDFs are stored directly under `pdfSources/` and in its game-line subdirectories;
- the complete offline Codex of Darkness mirror is at `pdfSources/codexofdarkness.com/`;
- the offline Books catalog is `pdfSources/codexofdarkness.com/wiki/Books.html`.

Treat the offline Codex mirror as an index/reference. The applicable official PDF remains authoritative for exact mechanics. Use the live catalog only when the local mirror is insufficient or freshness matters.

## Non-negotiable domain boundary

1. The rules domain is **Chronicles of Darkness (CofD)**.
2. Never substitute rules from:
   - Dungeons & Dragons or another RPG;
   - Classic/Old World of Darkness (cWoD/oWoD);
   - modern World of Darkness lines such as Vampire: The Masquerade when the task is about CofD;
   - a first-edition-only nWoD source.
3. Similar names are not evidence of compatible mechanics.
4. "World of Darkness" is historically ambiguous. Resolve the exact game line and edition before using it as a source.
5. If the requested fact cannot be verified from eligible sources, say it is unverified. Do not fill gaps from genre knowledge.

## Edition policy

For the Codex of Darkness Books catalog, eligible sources are only entries whose **Rule Version** is:

- `2`
- `1 & 2`

Never use an entry marked only `1` as rules authority unless the user explicitly asks for first edition or conversion material.

Read `references/books-and-editions.md` whenever selecting or validating a source.

## Source precedence

For a rules question or implementation:

1. Explicit project specification or user-provided homebrew, for that homebrew feature only.
2. The applicable official game-line 2e rulebook.
3. Official 2e / `1 & 2` supplements for that game line.
4. Chronicles of Darkness core/common rules when the line does not override them.
5. Official cross-line books that are eligible under the edition policy.
6. Codex of Darkness as an index/reference to locate the official source.
7. If still unresolved: report uncertainty rather than inventing a rule.

Read `references/source-precedence.md` for conflict handling.

## Rules vs. homebrew

- Treat official rules and homebrew as separate namespaces.
- Never present homebrew as printed/official.
- Never silently "repair" homebrew by replacing it with an official rule.
- When implementing homebrew, use official rules as a compatibility baseline only when relevant.
- Preserve the user's stated homebrew behavior unless it conflicts with an explicit task requirement.

## Game-line isolation

Do not infer that same-named concepts have identical mechanics across game lines.

Examples of distinct lines include:
- Chronicles of Darkness / mortals
- Vampire: The Requiem
- Werewolf: The Forsaken
- Mage: The Awakening
- Promethean: The Created
- Changeling: The Lost
- Hunter: The Vigil
- Geist: The Sin-Eaters
- Mummy: The Curse
- Demon: The Descent
- Beast: The Primordial
- Deviant: The Renegades

Read `references/game-lines.md` when a task crosses line boundaries.

## Coding and data tasks

When code represents CofD mechanics:

1. Identify which fields are generic Core concepts and which are game-line-specific.
2. Do not generalize a line-specific mechanic into Core merely because another RPG uses a similar abstraction.
3. Prefer explicit line ownership for traits, powers, templates, creation rules, derived values, and validation.
4. Preserve source metadata where practical: book abbreviation/title, edition, page/reference, and whether a rule is official or homebrew.
5. Tests that encode a rule should state the applicable line and edition in their name or fixture metadata when ambiguity is possible.
6. When changing rule data, inspect nearby entries for accidental first-edition or cross-line contamination.

## Repository workflow

For implementation work in this repository, create small local commits after each verified, coherent task type. Keep unrelated task types and user-owned changes out of the commit; inspect a dirty worktree before staging, and prefer explicit file or hunk staging over broad staging commands.

## Verification behavior

Before asserting a specific mechanic, prerequisite, cost, rating, dice pool, exception, or character-creation rule:

- verify it against an eligible source available in `pdfSources/`;
- use the offline Codex mirror to identify the relevant book or page when needed;
- if unavailable locally and browsing is allowed, use the live Codex catalog to identify the correct eligible book, then prefer the official text when available;
- if only an index/summary is available, label the result accordingly;
- do not infer exact mechanics from memory.

Read `references/verification-checklist.md` for high-risk tasks.

## Token discipline

Do not load every reference automatically.

Load only:
- `books-and-editions.md` when selecting sources or checking editions;
- `source-precedence.md` when sources conflict;
- `game-lines.md` when line ownership or naming is relevant;
- `verification-checklist.md` for rule-heavy changes or audits.

For ordinary code that merely happens to live in a CofD repository, do not inject unrelated lore or rules text.
