# Characters of the Darkness

Characters of the Darkness is a local-first character builder and sheet manager for Chronicles of Darkness. The current application supports:

- Chronicles of Darkness mortals (`CofD`)
- Changeling: The Lost (`CtL`)
- Mage: The Awakening (`MtA`)
- Vampire: The Requiem (`VtR`)

The interface supports English (`en-US`) and Brazilian Portuguese (`pt-BR`).

The runtime is built with React, Next/Vinext, Vite, and Cloudflare. Character persistence is browser-local through IndexedDB with localStorage crash-safe fallback/staging. Large rules catalogs remain static under `public/data/**` and are loaded lazily for the selected game line.

## Prerequisites

- Node.js `>=22.13.0`
- Bash with `flock`, `curl`, and GNU `timeout` for the repository's verified install/build wrappers

## Development

```bash
npm run install:ci
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
npx tsc --noEmit
node --test --test-reporter=spec tests/*.test.mjs
git diff --check
```

`npm test` runs the verified build and then the full Node test suite.

The verified wrappers use project-scoped runtime directories through `scripts/sites-env.sh`. `.sites-runtime/` and Wrangler runtime state are disposable and ignored by Git.

See [AGENTS.md](AGENTS.md) for the authoritative architecture, ownership boundaries, persistence lifecycle, catalog rules, quality gates, and contribution guidance.

## Architecture overview

The central rule is:

> Core supplies mechanisms. Game lines supply mechanics.

The major boundaries are:

- `lib/core/character/` — neutral persisted character shape, validation, common Chronicles mechanics, and shared character helpers.
- `lib/game-line-contracts/` — neutral contracts for registrations, rule hooks, UI surfaces, and catalog snapshots.
- `game-lines/registry/` — explicit registration and lazy dispatch.
- `game-lines/mortal/` — mortal/Core rules, builder, and sheet.
- `game-lines/changeling/` — Changeling-owned rules, builder, sheet, experience flow, and catalogs.
- `game-lines/mage/` — Mage-owned rules, builder, sheet, experience flow, and catalogs.
- `game-lines/vampire/` — Vampire-owned rules, builder, sheet, experience flow, and catalogs.
- `app/workspace/character-lifecycle.ts` — import/open/save/update lifecycle and canonical normalization routing.
- `app/workspace/character-repository.ts` — browser-local character storage and collection mutation.
- `lib/catalog/` — generic static catalog loading, cache, and immutable snapshots.
- `public/data/` — static Core and game-line catalog data.

Builder, sheet, rules, print surfaces, and catalog groups remain independently lazy where applicable. Inactive game lines should not impose their JavaScript or catalog-data cost on the current character.

## Character persistence

The only supported persisted schema is `schema_version = 2`.

The canonical structural pipeline is:

```text
parse/import
-> validate current outer schema
-> Core structural normalization
-> selected game-line normalize
-> selected game-line synchronize
-> selected game-line derive
-> runtime use / local persistence
```

Transient play-state changes such as damage, resource tracks, and Conditions use the dedicated current-state fast path instead of re-running the full structural pipeline on every interaction.

Unsupported stored values remain opaque in the character list until the user removes them explicitly.

## Runtime and deployment

Cloudflare configuration lives in `wrangler.jsonc`.

- Worker entry: `worker/index.ts`
- client assets: `dist/client`
- server entry: `dist/server/index.js`
- static RPG data: `public/data/**`

The production application no longer uses D1 or Drizzle for character persistence.

Workspace identity is read through the dispatch-owned authentication headers handled by `app/chatgpt-auth.ts`.

Browser code must not assume runtime filesystem access. Worker code must remain independent from browser UI and concrete game-line surfaces.

## Documentation

- `AGENTS.md` is the authoritative current development/architecture guide.
- `docs/sheet-stylization-guide.md` documents the visual-sheet approach.
- `docs/*-implementation-plan.md` files are historical/reference implementation plans. Their future-tense sections record the plan used during implementation and are not the source of truth for current architecture.
- asset-specific READMEs document reproducible source-to-public build steps.

When documentation conflicts with the code, treat that as a documentation defect and update the documentation with the architectural change.
