# CharacterBuilder module boundary

The active creation path is composed from `character-builder-shell.tsx`, the neutral controls in this
directory, and a lazy controller/view under `game-lines/<line>/`. The registry loads only the selected
line and passes it an immutable `CatalogSnapshot`; common Builder modules do not import concrete line
mechanics or mutable catalog state.

## Active ownership

- `app/character-builder-shell.tsx` owns the shared creation frame and neutral trait/merit plumbing.
- `app/builder/` owns shared controls, common merit configuration and presentation helpers.
- `game-lines/mage/` and `game-lines/changeling/` own their controllers, eligibility, progression,
  grants, configuration editors and views.
- `game-lines/registry/` owns lazy line and catalog-group dispatch.
- `lib/core/character/` owns persisted schema-v2 fields and neutral creation rules.

The removed mixed Builder (`app/character-builder.tsx`) is not a fallback path. The same rule applies to
the removed mixed Paper implementation under `app/workspace/character-paper.tsx`.

## Catalog adapter policy

Normal runtime catalog access is snapshot-only. There are four intentionally retained mutable replacement
functions for established catalog-audit tests:

- `lib/changeling-courts.ts`: `replaceCourtCatalog`
- `lib/changeling-kiths.ts`: `replaceKithCatalog`
- `lib/changeling-conditions.ts`: `replaceChangelingConditionCatalog`
- `lib/mage-conditions.ts`: `replaceMageConditionCatalog`

They are marked `@test-only`, are not imported by `app/`, `game-lines/` or `worker/`, and remain because
the audit suites exercise legacy presentation/catalog exports directly. Their replacements would require
duplicating those audited presentation paths rather than testing the real modules.

The unused Spell and Contract mutation adapters were removed. Their type modules now only re-export
catalog types; line surfaces load the actual records through `CatalogSnapshot`.

`lib/creation-rules.ts`, `lib/creation-eligibility.ts` and `lib/power-progression.ts` remain only as
compatibility/experience helpers for non-Builder consumers. Active line Builders use Core or line-local
modules. Homebrew management and PDF/print remain outside this boundary by design.
