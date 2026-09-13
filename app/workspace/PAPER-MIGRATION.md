# Character paper extraction

The active registry paths now load `game-lines/mage/sheet-view.tsx` and
`game-lines/changeling/sheet-view.tsx`. Both compose the neutral outer layout and
small shared controls from `character-paper-shell.tsx`; neither line view selects
sections from a generic descriptor or imports the opposite line view.

Catalogs needed by a sheet and its experience panel come from the surface-scoped
`CatalogSnapshot`. The active paths do not repopulate or read the former mutable
spell, contract, merit, or condition catalogs.

General Conditions and their UI live in `condition-manager.tsx`. In particular,
`Bonded` is Core and its animal block is composed by either sheet. `Familiar` is
implemented only by Mage; `Fae Mount` and `Fae Pet` are implemented only by
Changeling.

## Completed legacy removals

- `app/character-builder.tsx`: removed after both line builders became active.
- `app/workspace/character-paper.tsx`: removed after both line sheets became active.
- Mutable `applyLegacy` catalog adapters: removed with the mutable bridge; active
  surfaces receive only immutable snapshots.

## Deferred deletion candidates

- `lib/merit-configurations.ts`: no active modular surface imports this mixed
  implementation. It remains only for legacy-focused tests and can be removed
  once those tests target the line-owned implementations.
- `lib/merits.ts`: active callers pass the surface snapshot into prerequisite
  evaluation, but the legacy mutable-catalog fallback remains for older callers
  and is a deletion candidate.

Homebrew management and PDF/printing remain deliberately outside this boundary.
