# CharacterBuilder module boundary

The normal creation path is composed from `character-builder-shell.tsx`, the neutral modules in this
directory, and a lazy controller/view under `game-lines/<line>/`. Catalog data reaches a line builder
through the immutable registry snapshot; the common modules do not import concrete line mechanics.

Legacy candidates retained for later phases:

- `app/character-builder.tsx`: mixed historical implementation still referenced by CharacterPaper.
  Remove only after the paper-side Merit configuration editor has moved to its own surface.
- `lib/creation-rules.ts`: mixed compatibility facade for older paper/experience consumers. Active line
  builders use `lib/core/character/creation-rules.ts` and their own `creation-rules.ts` instead.
- `lib/creation-eligibility.ts`, `lib/power-progression.ts`, and `lib/merit-configurations.ts`: mixed
  compatibility helpers retained for non-builder consumers. Active builders use line-local eligibility
  and power adapters plus neutral Core configuration/grant primitives.
- Catalog `applyLegacy` adapters: still needed by deferred paper/experience surfaces; builder catalog
  selection itself is snapshot-based.

Homebrew management and PDF/print do not participate in this boundary and remain deferred.
