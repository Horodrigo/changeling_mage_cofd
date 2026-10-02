# Characters of the Darkness

Characters of the Darkness is a local-first character builder and sheet manager for Chronicles of Darkness. The current application supports:

- Chronicles of Darkness mortals (`CofD`)
- Changeling: The Lost (`CtL`)
- Mage: The Awakening (`MtA`)
- Vampire: The Requiem (`VtR`)
- Werewolf: The Forsaken (`WtF`) — Core Forsaken creation/editing and in-app sheet; full implementation in progress.

The interface supports English (`en-US`) and Brazilian Portuguese (`pt-BR`).

Werewolf currently includes five Auspices, five Tribes plus Ghost Wolves, consultable Blood/Bone recovery, optional Specialties/Touchstone notes, filtered creation Gifts/Rites, Core Werewolf Merits, five automatically calculated forms, and manual Harmony with Flesh/Spirit Touchstones at 10/0 and only the current circle filled. Desktop compares five equal form columns over the supplied illustration; mobile Combat shows the active form without a background and shares Health's selector. Losing temporary Health upgrades remaining wounds for each excess wound (WTF2 p. 172); increasing Health never reverses those upgrades, and terminal excess remains stored. Primal Urge has compact summaries directly below its dots, hiding zero/None entries; Kuruth/Wasu-Im and triggers appear under Body of the Wolf. Creation advancement and individual XP purchases/refunds support Attributes, Skills, Specialties, Merits, Primal Urge, Renown, Gifts/Facets, and Core Rites with separate creation allocations and exact Merit instances. Renown records a worthy deed, grants ordered Auspice Moon Facets automatically, and tracks free matching Shadow/Wolf Facets or pending credits separately from paid powers. Shadow unlocks include their first Facet; additional Moon Gifts require explicit Storyteller authorization and retain ordered progression and Renown caps. Refunds protect dependent powers. Rite learning records its player-described source of knowledge and enforces Tribe restrictions without requiring Pack records. Supplement catalogs, Totem/Fetish tools, and dedicated PDF/blank sheets are not yet complete. Pure, Wolf-Blooded, and Lodges are outside this first implementation.

Form comparisons display only changed Attributes and their recalculated values, including active Merit modifiers, without a duplicate Attributes disclosure. Details contains structured, localized form-specific passives rather than repeating the form summary. The supplied illustration is a smaller transparent WebP; five desktop columns fit the available width without horizontal scrolling.

Browser smoke tests are authorized during the Werewolf goal. Its final scope includes visual comparison with the existing game lines and a polish pass across desktop/mobile, both locales, creation, sheet, powers, combat, experience and PDF/blank. Functional implementation alone does not complete the goal; see `WerewolfAudit.md` for the checklist and evidence.

The runtime is built with React, Next/Vinext, Vite, and Cloudflare. Character persistence is browser-local through IndexedDB with localStorage crash-safe fallback/staging. Rules catalogs remain static under `public/shared/data/` and `public/game-lines/<line>/data/`, loaded lazily for the selected game line.

The optional Werewolf inventory includes all 18 Core Fetish/Talen samples and their EN/PT rules under `public/game-lines/werewolf/data/fetishes/`. Builder and Details/Powers preserve independent item instances, Steel Wolf variants, manual Talen quantities and authored spirit/notes. Custom item descriptions remain authored across locales. Acquiring or editing inventory never spends XP/Essence, consumes Talens automatically or teaches referenced Facets. Supplement inventory content and printable composition remain in progress.

## Prerequisites

- Node.js `>=22.13.0`
- Bash with `flock`, `curl`, and GNU `timeout` for the verified installation and retained shell workflows; npm lint/build use cross-platform Node wrappers.

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

The lint wrapper uses project-scoped runtime directories through `scripts/sites-env.mjs`; `scripts/build-verified.mjs` runs the bounded build and generates PWA version metadata. `.sites-runtime/` and Wrangler runtime state are disposable and ignored by Git.

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
- `game-lines/werewolf/` — Werewolf-owned rules, creation/editing, sheet, Merit behavior, and catalogs.
- `app/workspace/character-lifecycle.ts` — import/open/save/update lifecycle and canonical normalization routing.
- `app/data-transfer-panel.tsx` — local character and Homebrew import/export with separate validation paths.
- `app/workspace/character-repository.ts` — browser-local character storage and collection mutation.
- `lib/catalog/` — generic static catalog loading, cache, and immutable snapshots.
- `public/shared/` — static resources shared by all game lines.
- `public/game-lines/<line>/` — static catalogs, images, and fonts owned by one game line.

Builder, sheet, rules, print surfaces, and catalog groups remain independently lazy where applicable. Inactive game lines should not impose their JavaScript or catalog-data cost on the current character.

## Folder organization

Folders separate executable source from publicly served files, then group both by ownership:

```text
app/                              Shared application shells and navigation
  css/globals.css                 Shared UI and sheet-layout styles
components/                       Shared UI primitives
lib/                              Core mechanisms, persistence, i18n, catalog loading
game-lines/                       Executable game-line source (bundled by Vite)
  registry/                       Lightweight registrations and lazy dispatch
  core/catalogs/                  Shared catalog transforms
  mortal/                         CofD mortal rules, Builder, Sheet, Print
    styles/                       Line-specific CSS
  changeling/                     CtL implementation
    catalogs/                     Catalog transforms, not public JSON copies
    catalog-data/                 Small source-owned configuration datasets
    styles/                       Sheet, responsive, and print CSS
  mage/                           MtA implementation; same ownership convention
  vampire/                        VtR implementation; same ownership convention
  werewolf/                       WtF implementation in progress
public/                           Static files; paths become browser URLs
  shared/
    data/
      catalog-manifest.json       Versioned resource URLs for all catalog groups
      merits-index.json           Cross-line Merit discovery index
      merits.json                 Canonical shared/Core Merits
      merits-pt.json              ID-keyed Portuguese presentation
      conditions.json
      conditions-pt.json
    images/                       Application emblem, shared textures, generic icons
  game-lines/
    mortal/images/                Mortal sheet ornaments and icon.webp
    changeling/
      data/                       Merits, Conditions, Contracts, Kiths, Tokens, etc.
        contracts/                Source-book shards with English/Portuguese pairs
      images/                     icon.webp, textures, frames, sheet ornaments
      fonts/                      Changeling-only WOFF2 files
    mage/
      data/                       Mage catalogs; spells/ contains Arcana shards
      images/                     Mage-only artwork and icon.webp
    vampire/
      data/                       Vampire catalogs
      images/                     Vampire-only artwork and icon.webp
    werewolf/
      data/                       Werewolf catalogs in progress; gifts/, rites/ and fetishes/ use source-book EN/PT shards
      images/                     Supplied skull (icon.webp) and transparent form comparison illustration (forms.webp)
  manifest.webmanifest            PWA entry point, intentionally at the root
  sw.template.js / sw.js          Service-worker template / generated worker
  version.json                    Generated application version
  favicon.svg / app-icon-*.png     Installable application icons
scripts/                          Offline catalog/asset generators and build tools
tests/                            Rules, architecture, catalog, and UI checks
docs/                             Supporting documentation
pdfSources/                       Local reference library, not deployed
```

`game-lines/changeling/` and `public/game-lines/changeling/` have different responsibilities: the former contains code; the latter contains files served unchanged. A public image at `public/game-lines/changeling/images/icon.webp` is requested as `/game-lines/changeling/images/icon.webp` — never as a source-module import.

Conventions for maintenance:

- Place each line's public JSON, artwork, and webfonts under its single `public/game-lines/<line>/` owner. Create `data/`, `images/`, or `fonts/` only when that category exists; a line does not need empty placeholder folders.
- Keep CSS under `game-lines/<line>/styles/`, not inside public image folders. Shared CSS stays in `app/css/`. Preserve current stylesheet import order when moving files.
- Shared/Core catalogs belong in `public/shared/data/`. Changeling and Mage Merits belong to their own line folders, even when another line can purchase them. Cross-line eligibility does not change file ownership.
- English is canonical. Portuguese files normally use the same basename plus `-pt.json`; book/Arcana shards remain under their owning catalog directory. Translations do not change IDs or persisted choices.
- Catalog groups request stable resource IDs. `public/shared/data/catalog-manifest.json` resolves those IDs to URLs; moving a file changes its URL and the manifest version, not its content version or character data. Unchanged IndexedDB catalog entries remain reusable.
- Asset generators must target this same public layout. Larger source artwork and reference PDFs stay outside `public/`; generated files are not duplicated at legacy URLs.
- Only application/PWA entry points and generated runtime metadata live directly in `public/`. Architecture tests check the layout, asset references, and catalog ownership.

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
- shared RPG data: `public/shared/data/**`
- line-owned RPG data and assets: `public/game-lines/**`

The production application no longer uses D1 or Drizzle for character persistence.

Workspace identity is read through the dispatch-owned authentication headers handled by `app/chatgpt-auth.ts`.

Browser code must not assume runtime filesystem access. Worker code must remain independent from browser UI and concrete game-line surfaces.

## Documentation

- `AGENTS.md` is the authoritative current development/architecture guide.
- `docs/sheet-stylization-guide.md` documents the visual-sheet approach.
- `docs/*-implementation-plan.md` files are historical/reference implementation plans. Their future-tense sections record the plan used during implementation and are not the source of truth for current architecture.
- asset-specific READMEs document reproducible source-to-public build steps.

When documentation conflicts with the code, treat that as a documentation defect and update the documentation with the architectural change.
