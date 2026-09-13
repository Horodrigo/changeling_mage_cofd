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

## Deferred deletion candidates

- `character-paper.tsx`: inactive mixed implementation retained as migration
  reference.
- `lib/merit-configurations.ts`: no active modular surface imports this mixed
  implementation. It remains solely for inactive `character-builder.tsx`,
  inactive `character-paper.tsx`, and legacy-focused tests; remove it together
  with those legacy callers during the final cleanup.
- `lib/merits.ts`: active callers pass the surface snapshot into prerequisite
  evaluation, but the legacy mutable-catalog fallback remains for older callers
  and is a deletion candidate.
- `applyLegacy` catalog adapters: inert now that the active loader returns
  only immutable snapshots; removable with their inactive legacy callers.

Homebrew management and PDF/printing remain deliberately outside this boundary.
