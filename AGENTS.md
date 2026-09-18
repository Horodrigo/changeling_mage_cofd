# Development Guide

This file is the authoritative internal development guide for Characters of the Darkness. The repository is the source of truth for implementation details; when architecture changes intentionally, update this file in the same change.

## Project Architecture

The primary rule is:

> Core supplies mechanisms. Game lines supply mechanics.

The application currently supports the persisted game-line IDs `CtL`, `MtA`, and `VtR`. The main boundaries are:

- `lib/core/character/`: neutral persisted character shape, current-schema validation, shared Chronicles traits, and structural normalization helpers.
- `lib/game-line-contracts/`: neutral contracts for registrations, rule hooks, UI surfaces, and catalog snapshots.
- `game-lines/registry/`: explicit lightweight registrations and lazy catalog-group dispatch.
- `lib/catalog/`: generic manifest, cache, loading, deep-freezing, and immutable snapshot infrastructure.
- `game-lines/changeling/`: Changeling rules, builder, sheet, experience flow, Merit behavior, and catalog transforms.
- `game-lines/mage/`: Mage rules, builder, sheet, experience flow, Merit behavior, and catalog transforms.
- `game-lines/vampire/`: Vampire rules, builder, sheet, experience flow, Merit behavior, and catalog transforms.
- `app/character-builder-shell.tsx` and `app/builder/`: common creation shell and genuinely shared controls.
- `app/workspace/character-paper-shell.tsx` and neutral workspace controls: common in-app sheet composition.
- `app/workspace/character-lifecycle.ts`: import/open/save/update lifecycle and canonical routing through Core normalization plus the selected game-line rules.
- `app/workspace/character-repository.ts`: browser-local character loading, crash-safe staging, debounced persistence, and collection mutation.
- `lib/character-persistence.ts` and `lib/stored-character.ts`: line-neutral structural normalization, current-schema validation exports, and safe treatment of stored values.
- `public/data/`: static catalog data, separated by Core and game line.

## Ownership Rules

Core may own behavior that is genuinely common to Chronicles of Darkness characters:

- identity, Attributes, Skills, Specialties, and common derived traits;
- generic Merit storage, ratings, rendering, configuration plumbing, and neutral requirements;
- persistence, current-schema validation, catalog loading, registry contracts, and shared UI mechanisms.

Core must not accumulate line-specific mechanics. These remain line-owned:

- Mage: Path, Order, Gnosis, Arcana, Rotes, Praxes, Legacies, Nimbus, and Mage-specific Merit behavior.
- Changeling: Seeming, Kith, Court, Wyrd, Clarity, Contracts, Regalia, Entitlements, and Changeling-specific Merit behavior.
- Vampire: Clan, Covenant, Blood Potency, Humanity, Touchstones, Disciplines, Devotions, Blood Sorcery, Coils, Scales, and Vampire-specific Merit behavior.
- Future Werewolf or other concepts: the module for that game line.

Shared visual structure does not transfer mechanical ownership to Core.

## Dependency Direction

These constraints apply to direct and transitive imports:

- Core must not import concrete game-line implementations.
- Neutral contracts must not import concrete game lines.
- Mage must not import Changeling implementation code.
- Changeling must not import Mage implementation code.
- Vampire must not import Mage or Changeling implementation code, and neither existing line may import Vampire implementation code.
- Persistence must not import application UI.
- Catalog infrastructure must not depend on React or concrete line catalogs.
- The lightweight registry must not eagerly import heavy rules, Builder, Sheet, or catalog implementations.
- Worker code must not depend on browser UI or game-line surfaces.

An indirect chain such as `Mage -> shared helper -> Changeling` is still forbidden. Concentrated dispatch in the explicit registry or route boundary is acceptable; distributed line checks in generic mechanics are not.

## Adding a Game Line

A new line should be primarily additive. A Werewolf implementation should normally add:

- `game-lines/werewolf/**`;
- `public/data/werewolf/**`;
- focused tests;
- one explicit lightweight registry entry;
- one persisted game-line ID entry if the product supports saving that line.

It should not require broad edits to Mage, Changeling, catalog-service internals, generic Merit mechanics, Builder or Sheet shells, or the common persisted field list. Widespread changes are an architectural warning, not the expected cost of adding a line.

Do not grow central switches indefinitely. Explicit registration is preferred over filesystem autodiscovery, and a small intentionally centralized supported-ID list is acceptable.

## Composition Over Universal Abstractions

Do not force superficially similar concepts into a universal mechanical abstraction. Order, Court, Covenant, and Tribe may share visual patterns but have different rules. Gnosis, Wyrd, Blood Potency, and Primal Urge all have ratings but are not one generic supernatural-stat mechanic.

Prefer explicit line composition and a small amount of duplication over interfaces full of optional line-specific fields, boolean-prop matrices, or generic rule engines. Share a mechanism only when its behavior and lifecycle are actually common.

## Builder and Sheet Boundaries

The active structure is:

```text
common Builder shell -> selected line Builder
common Sheet shell   -> selected line Sheet
```

- The common Builder owns shared identity, trait allocation, navigation, and generic Merit UI plumbing.
- Each line Builder owns all line state, eligibility, validation, grants, progression, and final `line_data` construction.
- The common Sheet owns neutral paper layout and reusable controls.
- The common Main Sheet owns the shared first-page skeleton: identity/header, Attributes, Skills, Other Traits, Core/Line Traits, Derived Stats, and Experience. Game lines provide the slot content, labels, values, limits, and interactions for their own mechanics; they do not recreate the page geometry.
- Each line Sheet owns its sections, mechanics, experience flow, and line-specific companions or powers.
- Inactive line mechanics must not be instantiated or executed.
- A future line supplies its own Builder and Sheet through the registry.

Do not recreate a mixed `CharacterBuilder`, mixed `CharacterPaper`, descriptor engine containing every line, or a shell that calculates both current lines before choosing one.

## Registry and Lazy Loading

`game-lines/registry/game-line-registry.ts` is the explicit registration boundary. Registrations may contain stable IDs, slugs, labels, icons, visual metadata, catalog-group lists, and statically analyzable lazy loaders.

Keep independent lazy loaders for rules, Builder, Sheet, and catalog groups. Do not replace them with a monolithic line import. Dynamic import paths must remain explicit so Vite can resolve and split them reliably.

The registry may eagerly import lightweight registration objects. Registration modules must not statically import their heavy implementations.

## Catalog Architecture

Static RPG content should remain data under `public/data/**` where practical. Catalog infrastructure is generic and group-driven; each game-line registration declares the groups required by its Builder and Sheet surfaces.

Required invariants:

- Each runtime requests only Core and its selected game line's JSON; CtL, MtA, and VtR catalogs remain isolated from one another.
- Catalog snapshots are explicit, surface-scoped, deeply frozen, and consumed directly.
- Switching lines never depends on replacing mutable global catalog state.
- Large static datasets do not move back into application JavaScript merely for convenience.
- Catalog transforms and data shapes belong to the relevant Core or line catalog group.

Do not reintroduce runtime mutation APIs such as `replaceSpellCatalog` or `replaceContractCatalog`.

Two legacy mutable catalog holders remain:

- `replaceCourtCatalog` / `CTL_COURT_DEFINITIONS` in `lib/changeling-courts.ts`;
- `replaceKithCatalog` / `KITHS` in `lib/changeling-kiths.ts`.

The mutation entry points are test-only. Unlike the removed Condition adapters, however, some Court/Kith helper code still shares these legacy holders with runtime-facing modules. Treat this as transitional ownership debt, not as the target architecture. Prefer immutable fixtures in tests and explicit catalog/snapshot arguments in production helpers, then remove the global holders entirely.

The former mutable Changeling/Mage Condition adapters have already been removed; do not recreate them.

## Merit Architecture and Invariants

Core may own generic Merit storage, ratings, rendering, configuration plumbing, neutral requirements, and extension dispatch. Line-specific eligibility, automatic grants, synchronization, special configuration, and derived effects belong to the line.

- Use stable Merit and configuration IDs. Never dispatch special behavior from translated or display names.
- Catalog membership and purchase eligibility are separate. Keep valid definitions visible even when the current character cannot buy them, and explain unmet prerequisites.
- Preserve discontinuous ratings exactly. Do not infer an interval from the lowest and highest dots.
- Store only choices required by the rule. A single free-text value should normally be edited inline; complex rules may use structured configuration.
- Do not infer repeatability merely because a Merit names a subject. A repeatable Merit needs a stable instance ID, independent configuration and rating, exact upgrade targeting, and exact refund behavior.
- Aggregate Merits and repeatable instances are different models. For example, Contacts, Staff, Touchstone, Multilingual, and Token are aggregate structures; Allies, Mentor, Retainer, Safe Place, and other explicitly repeatable definitions may have independent instances.
- Level benefits are stored at their actual rating and displayed only when unlocked.

Important line-owned examples:

- Changeling Court selection grants and identifies Mantle; Mantle is not a new arbitrary purchase. Court Goodwill uses canonical Court identity and its own instance/access rules.
- Fae Mount configuration belongs to the Changeling companion surface.
- Mage-specific status, magical items, grants, and prerequisites must not be modeled by copying Changeling-specific mechanics.

A future line-specific Merit should be implementable without editing a central Mage/Changeling mechanics switch.

## Persisted Character Schema

The only supported persisted character schema is intentionally `schema_version = 2`.

Core owns the small outer record and its lifecycle. It contains identity, common Chronicles traits, Specialties, Merits, derived values, current state, metadata, and an open `line_data` record. Each game line owns the schema and semantics of its own `line_data`.

Core must not inspect line-specific `line_data` fields except to route the character to the selected line module. Game lines may define strong internal TypeScript types for their own data.

Do not add `path`, `order`, `arcana`, `seeming`, `court`, `contracts`, `clan`, `covenant`, `disciplines`, or similar fields to the common record merely because one line needs them.

### Loading pipeline

The supported pipeline is:

```text
parse
-> validate schema version and outer shape
-> Core structural normalization
-> resolve the selected game-line rules module
-> game-line normalization
-> game-line synchronization of grants
-> game-line derived-state calculation
-> runtime use
```

Core normalization remains line-neutral. Mage normalization belongs to Mage; Changeling normalization belongs to Changeling; Vampire normalization belongs to Vampire; a future line normalizes its own data. Unsupported schema versions fail explicitly. Do not silently or partially load historical formats, and do not restore historical migrations without a concrete product requirement.

### Unsupported stored values

Local storage may contain data that is not a current `CharacterSheet`. Keep unsupported values opaque until the user explicitly removes them. Listing stored characters must not migrate or normalize those values. Tests should protect safe handling and deletion instead of obsolete migration behavior.

Current-schema export and import must round-trip without losing data.

### Workspace lifecycle and repository

`Workspace` is a UI orchestrator, not the persistence implementation.

- `CharacterLifecycle` owns import validation, catalog hydration for open/import, Core structural normalization, selected-line normalization/synchronization/derivation, and the explicit transient-state fast path.
- `CharacterRepository` owns browser-local loading, crash-safe staging, debounced IndexedDB persistence, and upsert/replace/remove operations.
- `Workspace` owns navigation, selection/editing state, notices, zoom, print controls, and delegation to those services.
- Structural edits must go through the canonical lifecycle pipeline.
- `current_state` interaction updates intentionally use the fast path and must not silently expand into structural rule mutation.

Do not move `device-storage`, schema validation, catalog hydration, or game-line normalization logic back into `Workspace`.

## Official Content and Localization

Official catalog content is English-first. Every item has a stable identity independent of displayed text; `en-US` is canonical and `pt-BR` is a localized presentation of that same item.

- Changing locale must not alter rules, IDs, choices, costs, persisted data, or experience history.
- Persist IDs or canonical values, never localized labels as primary identity.
- Missing Portuguese content falls back explicitly to English; never invent a translation.
- Book titles remain in their original language, and user-authored content is not translated automatically.
- Dynamic messages must handle grammar and ordering in each locale rather than concatenate translated fragments.
- Search and sort use displayed text unless a rules-defined order applies.

For source reconstruction, use the offline Codex of Darkness material as an index for candidate identity and citations, not as final authority for mechanics. Source PDFs are authoritative for effects, prerequisites, choices, exceptions, and long-form rule details. Review two-column extraction carefully; never import raw extracted text without checking headers, footers, sidebars, page breaks, and neighboring columns.

Work in small verifiable batches. Reconcile IDs, counts, source, page, required fields, and known exceptions in tests. Structural tests do not replace editorial PDF review. Existing generator and PDF-validation scripts are reproducibility tools, not runtime dependencies.

### Contract catalog records

- Rolled Contracts keep classification, Regalia or Court, source, summary, Dice Pool, cost, action, duration, genuine options, all printed outcomes, Loophole, and benefits as distinct fields.
- Automatic Contracts use a distinct Effect field instead of invented roll outcomes.
- Do not duplicate Effect or outcome text into Options. Do not infer exceptional shapes when the source presents something different.
- Contract costs use `●` for Glamour and `○` for Willpower.

`scripts/generate-mage-spells.py` and `scripts/validate-mage-spells-pdfs.py` preserve the reproducible Mage spell audit path. Keep their assumptions synchronized with the static spell shards and their tests.

## UI Organization and Conventions

- Share controls only when behavior is truly common. A shared visual pattern does not imply a shared mechanical abstraction.
- Keep line-specific forms and interactions in the owning module.
- Avoid giant switch components, universal section engines, and large optional-prop matrices.
- Add-item actions use the compact visual scale established by the shared Builder controls.
- Remove-item actions use the compact card-level treatment used elsewhere.
- Catalog selection uses compact checkboxes when an item is a simple toggle. Keep a compact action button when selection has additional semantics, including repeatable Merit instances.
- Dialog completion and cancellation controls use the shared compact catalog-footer sizing.
- Verify responsive behavior and both supported locales for user-facing changes.

## Test Philosophy

Tests protect current contracts and architectural boundaries, not removed compatibility promises. Cover:

- current schema validation and round-trip persistence;
- line-owned normalization and synchronization;
- dependency direction and lazy Builder/Sheet ownership;
- catalog request isolation, immutable snapshots, and line switching;
- Merit instance progression and exact refunds;
- current PWA/runtime behavior where relevant.

When behavior is intentionally removed, remove tests for the obsolete promise and add tests for the new contract. For example, schema 1 is rejected safely; it is not automatically migrated to schema 2.

Architecture tests in `tests/game-line-architecture.test.mjs` are part of the design boundary. Update them only when the intended architecture changes, not to make a violation pass.

## Quality Gates

Before substantial architecture or behavior work is complete, run the commands supported by the environment and confirm their actual results:

```text
npm run lint
npm run build
node --test --test-concurrency=1 tests/*.test.mjs
npx tsc --noEmit
git diff --check
```

The normal npm lint/build scripts use Bash and GNU `timeout`. On an environment where those wrappers cannot run, execute the equivalent local tools only as an explicitly reported diagnostic; do not claim the normal script passed.

When relevant, also verify the production Vite manifest, recursive import closures, catalog request isolation, game-line switching, current-schema round-trip, and browser smoke behavior. Distinguish known environmental or baseline errors from new regressions.

## Performance and Cloudflare Runtime

Preserve lazy loading, dynamic chunk separation, IndexedDB catalog caching, service-worker caching, local-first behavior, and static catalog delivery.

A user should not pay the JavaScript or data cost of an inactive game line. Evaluate recursive production-manifest closures and actual bundle sizes rather than optimizing for file count or request count alone.

The project must remain compatible with the existing Vinext/Vite Cloudflare deployment:

- no Node-only runtime dependencies in browser code;
- no runtime filesystem assumptions;
- no Worker APIs that are unavailable on Cloudflare;
- no opaque dynamic imports that Vite cannot analyze;
- `public/data/**` remains statically deployable;
- Worker code remains independent from browser UI and game-line surfaces.

Do not change Cloudflare bindings or configuration merely to silence local ambient TypeScript errors. Understand deployment impact first.

## Deferred Features

Homebrew management and specialized server-side PDF generation remain deferred. Changeling supports a browser-owned A4 print/PDF surface loaded lazily from its game-line registration; Mage and Vampire printing remain deferred until their own line-owned surfaces are implemented.

Do not let removed implementations shape Core, current game-line APIs, Builder shells, or Sheet shells. When these features return, design them against the modular architecture that exists then. Do not restore old mutable global Homebrew catalogs or old mixed print/paper paths because historical code used them.

Normal in-app character viewing remains independent from print/PDF work. Shared print infrastructure may own A4 pagination and neutral static primitives, but each game line owns its printable composition and interpretation of `line_data`.

## Temporary Code Policy

Any adapter, bridge, compatibility path, or migration helper must state:

- why it exists;
- who consumes it;
- whether it can run in production;
- the condition that allows deletion.

Mark test-only mutation explicitly and prevent production imports with architecture tests. Once a migration is complete, delete the superseded path. Do not keep both old and new architectures as permanent fallbacks without a real requirement.

## Architecture Regression Warnings

Reconsider ownership before merging when:

- a Core file accumulates repeated CtL/MtA/VtR/future-line branches;
- adding one line requires edits across existing line modules;
- a shared interface gains optional fields used by only one line;
- a generic helper imports a concrete game-line module, directly or transitively;
- a catalog requires line-specific dispatch inside `catalog-service`;
- a Builder or Sheet shell starts owning line-specific mechanics;
- runtime behavior depends on replacing mutable global catalog state;
- Merit behavior dispatches on display names;
- one line causes unrelated line bundles or JSON to load;
- persistence learns the internal structure of `line_data`;
- a temporary compatibility adapter becomes permanent architecture;
- tests require mutable production globals merely to inject fixtures.

Fix the ownership boundary early rather than allowing these patterns to accumulate.

## Code Placement Decision Guide

For new functionality, ask:

1. Is it true for every supported Chronicles of Darkness character? Core or a shared mechanism may own it.
2. Is the behavior mechanical and specific to one line? That line owns it.
3. Does Core need to execute the behavior, or only provide a hook or contract? Prefer the hook or contract.
4. Would adding the next game line require changing this code? Decide whether that is an intentional registry/ID change or evidence of coupling.
5. Does sharing require optional fields or switches for each line? Keep the implementations separate.

## Documentation Policy

`AGENTS.md` is the authoritative internal guide. Keep `README.md` for the public project overview and setup.

Implementation plans may remain after completion only when they are explicitly marked historical/reference documents and clearly defer to `AGENTS.md` and the current code for architecture. Do not treat future-tense implementation-plan text as a current runtime contract.

Do not accumulate obsolete migration diaries or audit snapshots that are likely to mislead future work. Delete them, archive them outside the active documentation set, or add a clear historical-status header.

Documentation that contradicts the code is a defect. Update this guide in the same work when architecture changes intentionally.
