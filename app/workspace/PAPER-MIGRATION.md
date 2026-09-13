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
- `lib/merit-configurations.ts`: removed after its remaining tests moved to the
  explicit Mage and Changeling merit implementations.
- The deferred Homebrew UI, storage, and Google Drive adapter: removed. Their
  catalogs remain as normal static line catalogs; a future Homebrew feature must
  be designed against the snapshot boundary rather than restore mutable globals.

## Deferred deletion candidates

- `lib/merits.ts`: active callers pass the surface snapshot into prerequisite
  evaluation, but the legacy mutable-catalog fallback remains for older callers
  and is a deletion candidate.

Homebrew management and PDF/printing remain deliberately outside this boundary.
