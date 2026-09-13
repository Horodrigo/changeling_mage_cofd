# Task: Continue the Game-Line Modularization Refactor From the Current Branch State

## Current State

The refactor has already started on:

```text
game-line-modularization
```

Two commits have already been completed successfully:

```text
76203cc refactor: extract character domain types from UI
5aef545 refactor: add lightweight game-line registry
```

The following work is already complete and must be preserved:

* persisted character/domain types were moved out of React/UI into `lib/core/character/`;
* persisted game-line IDs `CtL` and `MtA` remain unchanged;
* persistence, refunds, progression, and Drive sync no longer import `character-builder.tsx`;
* neutral contracts were introduced;
* a lightweight registry with independent loaders for Mage and Changeling was added;
* TypeScript checking introduced no new application errors; only the pre-existing Cloudflare ambient/type issues remain.

Do not repeat or redo these phases unless inspection proves something is incomplete.

Continue from the current branch state.

---

# Updated Product Assumptions

Two important assumptions have changed and override earlier compatibility requirements.

## 1. There Are No Production Users Yet

There are currently no production users whose historical saved character JSON must remain permanently compatible.

Backward compatibility with every old character serialization format is therefore **not a hard requirement**.

The priority is now:

```text
clean modular architecture
+
working current Mage support
+
working current Changeling support
+
clean foundation for future game lines
```

rather than:

```text
permanent preservation of unused historical JSON formats
```

Stable domain/content IDs should still be preserved where they remain useful.

For example:

```text
CtL
MtA
rule IDs
Merit IDs
catalog IDs
```

should not be renamed casually.

However, obsolete serialization structures, adapters, old migrations, or compatibility code may be removed if they no longer serve a real purpose.

---

## 2. Homebrew and PDF/Printing Are Deferred

The existing Homebrew implementation and PDF/printing functionality are currently incomplete/problematic and are intended to be reimplemented after the modular architecture is complete.

Therefore:

```text
Homebrew reimplementation
PDF generation
printing
print preview
```

are **not part of this task**.

Do not spend substantial effort preserving their current broken architecture.

If they interfere with modularization, they may be isolated, disabled, or removed where safe.

A future task will reimplement them on top of the completed modular architecture.

---

# Primary Objective

Continue refactoring **Characters of the Darkness** so the application can support many Chronicles of Darkness game lines without turning Core into a growing collection of line-specific conditionals, schemas, catalog dispatches, or UI branches.

Current lines:

```text
Changeling: The Lost
Mage: The Awakening
```

Future expected lines include:

```text
Mortals / Chronicles of Darkness Core
Vampire: The Requiem
Werewolf: The Forsaken
```

and potentially others.

The target remains:

```text
Core supplies mechanisms.
Game lines supply mechanics.
```

The architecture must support future mechanics that are unlike Mage and Changeling.

---

# Architectural Target

Move toward:

```text
Core application
├── character domain
├── persistence
├── catalog infrastructure
├── lightweight game-line registry
├── neutral contracts
├── shared UI shells
└── game-line modules
     │
     ├── CtL
     │    ├── rules
     │    ├── builder
     │    └── sheet
     │
     ├── MtA
     │    ├── rules
     │    ├── builder
     │    └── sheet
     │
     └── future lines
```

A future Vampire implementation should mainly require:

```text
game-lines/vampire/**
public/data/vampire/**
registry entry
tests
```

and not broad edits throughout the existing application.

---

# Preserve Existing Performance Work

The previous performance refactor introduced:

```text
static JSON catalogs
lazy loading
game-line-specific catalog loading
IndexedDB catalog cache
manifest/versioning
Service Worker caching
local-first persistence
```

Do not regress these improvements.

Do not:

* move large catalogs back into JavaScript;
* merge Mage and Changeling catalogs;
* create one monolithic game-line chunk;
* load builder and sheet together unnecessarily;
* reintroduce eager line-specific code into Home;
* introduce Node-only browser dependencies;
* break the existing Cloudflare deployment model.

---

# Cloudflare Compatibility

The application must remain compatible with the existing Cloudflare deployment environment.

Preserve:

```text
Vite production build
Cloudflare Worker/API behavior
public/data static assets
dynamic chunks
browser IndexedDB
browser Service Worker
Cache Storage
existing bindings
```

Do not introduce:

```text
runtime filesystem access
arbitrary Node-only runtime APIs
dynamic imports that Vite cannot statically resolve
browser dependencies inside Worker code
```

Prefer explicit dynamic imports:

```ts
loadSheet: () => import("../mage/sheet")
```

instead of opaque runtime-generated import paths.

Do not change the hosting/deployment platform as part of this task.

---

# Persisted Character Schema Policy

The previous task required strong preservation of schema v1/v2.

That is no longer mandatory.

Because there are no production users, the persisted character schema may be redesigned if doing so materially improves modularity and removes architectural coupling.

Do not change it merely for aesthetics.

Before changing the schema:

1. inspect the current structure;
2. determine whether the existing common fields + `line_data` model already supports clean modular ownership;
3. compare that against a redesigned discriminated structure;
4. choose the simpler long-term architecture;
5. document the decision.

A good conceptual TypeScript model may resemble:

```ts
interface CharacterBase {
  id: string;
  gameLine: PersistedGameLineId;
  name: string;
  // common fields
}

interface MageCharacter extends CharacterBase {
  gameLine: "MtA";
  lineData: MageCharacterData;
}

interface ChangelingCharacter extends CharacterBase {
  gameLine: "CtL";
  lineData: ChangelingCharacterData;
}
```

This is conceptual, not mandatory.

Do not create a universal character model containing fields for every possible game line.

Avoid structures such as:

```text
path
order
seeming
court
clan
covenant
auspice
tribe
gnosis
wyrd
bloodPotency
primalUrge
...
```

all living in one generic object.

If a schema redesign is performed:

* update the current app and fixtures;
* update current import/export behavior;
* remove obsolete compatibility code;
* do not retain unused historical migration layers merely for hypothetical old files.

---

# Import / Export Policy

Keep import/export for the **final supported schema** if the feature is currently useful.

Required guarantee:

```text
export current supported character
→ import
→ same supported character data
```

Do not require every historical JSON version to remain importable.

Historical fixtures may be removed after migration if they no longer serve a concrete purpose.

---

# Homebrew Scope

Do not modularize or redesign the current Homebrew implementation in this task.

Instead:

1. identify Homebrew dependencies on Core and current game-line code;
2. remove Homebrew-specific coupling that blocks modularization;
3. preserve only generic reusable infrastructure where clearly useful;
4. disable or remove obsolete Homebrew implementation code where safe;
5. do not create a speculative replacement system now.

It is acceptable for Homebrew functionality to be temporarily unavailable after this refactor if this is intentional and documented.

Do not keep fixed Core structures such as:

```text
kiths
courts
orders
contracts
spells
```

solely to preserve the current Homebrew implementation.

A later task will reimplement Homebrew using the new game-line architecture.

---

# PDF / Printing Scope

PDF generation, printing, and dedicated print-preview functionality are explicitly deferred.

During this task:

1. identify PDF/print-specific dependencies;
2. prevent those dependencies from shaping the new architecture;
3. remove obsolete/broken print code where safe;
4. remove dead assets/dependencies used only by the old implementation where safe;
5. do not implement replacement PDF functionality.

Normal in-app character viewing remains required.

The new game-line architecture should make future PDF/printing reimplementation easier, not preserve the current broken version.

---

# Dependency Direction

Continue enforcing:

```text
neutral contracts must not import concrete game lines
lib/core must not import concrete game lines
registry must not statically import heavy game-line modules
game-lines/* may import lib/core and neutral contracts
game-lines/mage must not import game-lines/changeling
game-lines/changeling must not import game-lines/mage
persistence must not import app/*
catalog infrastructure must not import React components
```

Check relevant transitive static dependencies where practical.

This is invalid even without a direct import:

```text
mage
→ shared helper
→ changeling
```

Use both source inspection and Vite manifest analysis.

---

# Completed Phase 1 — Character Domain Extraction

Already completed in:

```text
76203cc refactor: extract character domain types from UI
```

Do not redo it.

Verify only if later changes require additional cleanup.

---

# Completed Phase 2 — Lightweight Game-Line Registry

Already completed in:

```text
5aef545 refactor: add lightweight game-line registry
```

Do not redo it.

Preserve:

* lightweight metadata;
* independent lazy loaders;
* persisted IDs `CtL` and `MtA`;
* neutral contracts.

Do not turn the registry into a heavy module later.

---

# Next Phase 3 — Make Catalog Infrastructure Group-Driven

The current catalog infrastructure must stop relying on closed line-specific dispatch.

Remove patterns such as:

```text
if resource === ...
CtL ? "changeling" : "mage"
hydrateSpells()
hydrateContracts()
```

Move toward:

```ts
loadCatalogGroup(groupId)
```

or equivalent.

Catalog groups should be declarative and, where appropriate, surface-specific.

Conceptually:

```ts
MtA.catalogGroups = {
  builder: [...],
  sheet: [...]
};

CtL.catalogGroups = {
  builder: [...],
  sheet: [...]
};
```

Homebrew-specific groups do not need to be preserved for the current implementation because Homebrew is deferred.

Do not statically import heavy line-specific transformers into eager catalog infrastructure.

Prefer lazy group implementations:

```ts
{
  id: "mage-spells",
  load: () => import("../mage/catalogs/spells")
}
```

Acceptance criteria:

* catalog service no longer grows `if gameLine === ...` logic;
* adding Vampire catalog groups should be additive;
* Mage does not fetch Changeling JSON;
* Changeling does not fetch Mage JSON;
* builder and sheet load only the catalog groups they need.

---

# Phase 4 — Remove Mutable Global Catalog Dependence

The current system reportedly uses mutable globals such as:

```text
RAW_MERITS
SPELLS
CONTRACTS
```

with replacement functions.

This must not remain the normal final runtime architecture.

Introduce scoped/explicit catalog access.

Conceptually:

```ts
const mageCatalogs = await catalogService.getSnapshot(...);
const changelingCatalogs = await catalogService.getSnapshot(...);
```

or equivalent typed stores.

Prefer immutable or effectively immutable snapshots.

Migration may be incremental:

```text
4a. introduce scoped access
4b. retain temporary compatibility adapters
4c. migrate consumers
4d. remove obsolete global mutation paths
```

At final acceptance:

* normal Mage builder must not depend on mutable global replacement;
* normal Mage sheet must not depend on mutable global replacement;
* normal Changeling builder must not depend on mutable global replacement;
* normal Changeling sheet must not depend on mutable global replacement.

Any remaining mutable adapter must be:

```text
legacy-only
explicitly documented
not required by normal runtime
```

Test:

```text
MtA → CtL → MtA
CtL → MtA → CtL
```

with correct catalog state.

---

# Phase 5 — Create Mage and Changeling Module Ownership

Use the already-created registry and contracts to establish clear module ownership.

Conceptual structure:

```text
game-lines/
├── mage/
│   ├── registration.ts
│   ├── rules.ts
│   ├── builder.tsx
│   ├── sheet.tsx
│   └── ...
│
└── changeling/
    ├── registration.ts
    ├── rules.ts
    ├── builder.tsx
    ├── sheet.tsx
    └── ...
```

Do not add Homebrew modules now unless a tiny compatibility stub is necessary to remove coupling.

Adapters may initially call existing code.

The goal is ownership, not immediate perfection.

---

# Phase 6 — Use Explicit Rule Hooks

Do not create one generic:

```ts
calculations: [...]
```

pipeline.

Use explicit lifecycle responsibilities where current code needs them.

Conceptually:

```ts
interface GameLineRulesModule {
  normalizeCharacter?: (...) => ...;
  migrateCharacter?: (...) => ...;
  deriveCharacterState?: (...) => ...;
  syncGrantedTraits?: (...) => ...;
  validateCreation?: (...) => ...;
  validateCharacter?: (...) => ...;
  resolveEligibility?: (...) => ...;
}
```

Only keep hooks justified by actual current mechanics.

Document for each hook:

```text
purity
mutation behavior
I/O behavior
failure behavior
catalog requirements
lifecycle timing
```

Prefer returned values over hidden in-place mutation.

---

# Phase 7 — Move Mage and Changeling Rules Into Their Modules

Identify and move:

```text
normalization
derived calculations
granted traits
creation validation
eligibility
line-specific synchronization
```

into the owning line.

Keep truly shared Chronicles of Darkness mechanics in Core.

Do not move something into Core merely because Mage and Changeling happen to implement similar behavior.

---

# Phase 8 — Modularize CharacterBuilder

Target:

```text
CharacterBuilderShell
├── common/Core character fields
├── generic navigation
└── active game-line builder
```

Load the active implementation through the registry.

Mage builder should own Mage-specific state.

Changeling builder should own Changeling-specific state.

The generic builder must not keep both game lines' full state active at the same time.

Because historical serialization compatibility is no longer strict, it is acceptable to reshape internal builder state if that creates a cleaner architecture.

Before changing builder behavior, inspect the current new-character line-switch behavior.

Preserve or intentionally redefine:

```text
common field behavior
line-specific state reset behavior
catalog-loading behavior
navigation behavior
```

Document any intentional UX change.

---

# Phase 9 — Modularize CharacterPaper

Target:

```text
CharacterPaperShell
├── common/Core sections
├── common layout
└── active game-line sheet
```

Load the line sheet through the registry.

Do not calculate both line states before choosing which line is active.

Mage sheet must not execute Changeling mechanics.

Changeling sheet must not execute Mage mechanics.

Do not preserve broken print/PDF-specific layout coupling.

If print-specific code complicates extraction, remove or isolate it.

---

# Phase 10 — Modularize Merit Behavior

Merits remain a real extension point.

Move line-specific Merit behavior out of generic Core switches.

Use stable IDs or equivalent stable references.

Conceptually:

```ts
registerMeritBehavior({
  gameLine: "CtL",
  meritId: "...",
  handler: ...
});
```

or module-owned equivalent.

Possible responsibilities:

```text
special validation
granted traits
selection configuration
derived effects
line-specific synchronization
```

Do not build a generic rules interpreter.

Future Vampire-specific Merit behavior must be possible without modifying a central Mage/Changeling switch.

---

# Phase 11 — Evaluate Character Schema Cleanup

After Builder/Sheet ownership is clearer, evaluate whether the current persisted character shape still causes coupling.

Because there are no production users, this is now a valid cleanup opportunity.

Choose between:

```text
keep current schema
```

or:

```text
redesign current schema
```

based on architectural benefit.

Do not keep a worse model solely for historical compatibility.

Do not redesign simply to match a preferred aesthetic.

A successful final schema should support:

```text
common character data
+
line-owned data
```

without requiring every game-line field to exist in a universal type.

If redesigned:

* migrate current app state;
* update tests;
* update current import/export;
* delete unused historical adapters;
* document the new schema.

---

# Phase 12 — Remove / Defer Current Homebrew Implementation

Once Core/game-line boundaries are established:

* remove Homebrew code that prevents clean modularization;
* remove fixed line-specific homebrew structures if no longer needed elsewhere;
* remove obsolete UI/editor code where safe;
* remove dead dependencies only if demonstrably unused.

Do not implement the new Homebrew system in this task.

If retaining some Homebrew code temporarily:

```text
document why
document dependencies
document planned removal/reimplementation
```

---

# Phase 13 — Remove / Defer PDF and Printing

Identify:

```text
print-only components
PDF-specific adapters
print-specific layouts
assets used only by printing
dependencies used only by old PDF generation
```

Remove or isolate them if they complicate modularization.

Do not break normal in-app character viewing.

Do not implement replacement PDF functionality now.

Document removed/deferred functionality in the final report.

---

# Phase 14 — Remove Distributed Game-Line Conditionals

Search for:

```text
gameLine === "MtA"
gameLine === "CtL"
type === "mage"
type === "changeling"
```

Classify every occurrence.

Acceptable:

```text
registry
router
single dispatch boundary
temporary migration boundary
```

Undesirable:

```text
generic Merit behavior
generic catalog service
generic calculation logic
generic validation
common builder mechanics
common sheet mechanics
persistence internals
```

Remove obsolete dispatch and compatibility paths.

Do not attempt to reach literal zero line checks.

Concentrated dispatch is acceptable.

---

# Phase 15 — Extensibility Test

Do not implement Vampire.

Answer concretely:

> If Vampire: The Requiem were added next, which existing central files would need modification?

Ideal answer:

```text
Add:
game-lines/vampire/**
public/data/vampire/**
tests/**

Modify:
lightweight registry entry
possibly supported-lines metadata
```

It should not require broad modifications to:

```text
catalog-service
Mage
Changeling
generic Merit switches
CharacterBuilder mechanics
CharacterPaper mechanics
persisted universal character fields
```

If Vampire would still require broad central changes, continue modularizing.

---

# Performance Requirements

Preserve the previous baseline:

```text
Home eager JS
426,349 B raw
139,148 B gzip

Largest JS chunk
281,293 B raw
80,873 B gzip

Static JSON
1,346,902 B raw
293,698 B gzip
```

Requirements:

* Home eager gzip must not increase by more than 10% without explicit justification.
* Modularization infrastructure above +20 KB gzip eager requires investigation and explanation.
* Registry must remain lightweight.
* Mage builder must not load Changeling builder.
* Mage sheet must not load Changeling sheet.
* Changeling builder must not load Mage builder.
* Changeling sheet must not load Mage sheet.
* Mage must not fetch Changeling JSON in normal use.
* Changeling must not fetch Mage JSON in normal use.
* No static RPG catalog may move back into JS.
* No new chunk should exceed 500 KB raw without justification.

Use the production Vite manifest and recursive import closures to prove separation.

---

# Testing Requirements

## Dependency Boundaries

Verify direct and relevant transitive dependencies:

```text
Core → no concrete game lines
neutral contracts → no concrete game lines
Mage → no Changeling
Changeling → no Mage
persistence → no app
catalog infrastructure → no React UI
registry → no eager heavy line implementations
```

---

## Catalog Separation

Verify:

```text
Mage load → no Changeling JSON
Changeling load → no Mage JSON
```

---

## Catalog State Isolation

Verify:

```text
MtA → CtL → MtA
CtL → MtA → CtL
```

without catalog contamination.

---

## Character Tests

Historical v1/v2 compatibility fixtures are no longer mandatory after the final schema is established.

Maintain fixtures for:

```text
current supported MtA character
current supported CtL character
```

Test:

```text
create/load
normalize
edit
save/reload
export
re-import
```

If the schema changes during this task, update fixtures to the final supported schema and remove obsolete compatibility fixtures/code where appropriate.

---

## Homebrew Tests

Do not require preservation of current broken Homebrew behavior.

Only test:

* that removing/defering Homebrew does not break Core/Mage/Changeling runtime;
* any retained compatibility path still behaves as documented.

---

## PDF / Print Tests

Do not require old PDF/printing behavior.

Only verify:

* normal character rendering still works;
* removing/defering print code does not break regular sheets/builders.

---

# Browser Smoke Validation

Validate at minimum:

```text
Home
character list
create Mage
create Changeling
switch new-character game line
open Mage
open Changeling
edit/save/reload Mage
edit/save/reload Changeling
Mage Merit interaction
Changeling Merit interaction
Mage catalogs
Changeling catalogs
import/export current supported schema
offline/local persistence
MtA → CtL → MtA
CtL → MtA → CtL
```

Homebrew and PDF/printing are intentionally excluded.

---

# Validation Commands

Inspect `package.json` and use actual repository commands.

At minimum, where available:

```text
npm run build
node --test tests/*.test.mjs
npm run lint
git diff --check
npx tsc --noEmit
```

Distinguish known pre-existing Cloudflare type errors from new regressions.

Do not modify Cloudflare configuration merely to silence local environment errors.

---

# Remaining Commit Strategy

Two commits already exist and must remain:

```text
76203cc refactor: extract character domain types from UI
5aef545 refactor: add lightweight game-line registry
```

Continue with small coherent commits.

Suggested remaining order:

```text
refactor: make catalog loading group-driven
refactor: add scoped catalog snapshots
refactor: add Mage and Changeling module ownership
refactor: move game-line rules behind explicit hooks
refactor: modularize character builder
refactor: modularize character paper
refactor: modularize game-line Merit behavior
refactor: simplify character schema for modular ownership
chore: remove deferred homebrew implementation
chore: remove deferred print and PDF implementation
refactor: remove mutable catalog compatibility paths
refactor: remove legacy game-line dispatch
test: add modular architecture regression coverage
```

Adjust based on actual repository findings.

Do not create empty/artificial commits.

Do not leave the repository broken between commits where reasonably avoidable.

---

# Updated Acceptance Criteria

## Character Domain

* persisted types remain outside React/UI;
* Core domain types do not import concrete line implementations;
* final schema cleanly supports line-owned data;
* unused historical compatibility structures may be removed.

## Registry

* lightweight registry remains intact;
* `CtL` and `MtA` persisted IDs remain stable unless there is an exceptionally strong reason to change them;
* builder/sheet/rules remain separately lazy-loadable.

## Catalogs

* group-driven loading;
* scoped catalog state;
* no normal-runtime cross-line mutable global replacement;
* no Mage/Changeling JSON cross-loading;
* line switching does not contaminate catalog state.

## Rules

* line-owned normalization/derivation/validation/synchronization;
* explicit hook semantics;
* no generic `calculations[]` pipeline.

## Builder

* common shell;
* line-specific lazy builder;
* no simultaneous full Mage/Changeling state ownership in Core.

## Sheet

* common shell;
* line-specific lazy sheet;
* inactive line mechanics do not execute.

## Merits

* special behavior is line-owned;
* stable IDs;
* no growing central game-line switch.

## Character Schema

* may be redesigned if beneficial;
* should favor long-term modularity;
* current supported import/export must round-trip;
* historical unused formats need not remain supported.

## Homebrew

* old broken implementation does not constrain the new architecture;
* may be removed/deferred;
* no replacement framework is required in this task.

## PDF / Printing

* old broken implementation does not constrain the architecture;
* may be removed/deferred;
* normal character view must remain functional.

## Performance

* previous lazy/static-data architecture remains intact;
* Home eager regression remains controlled;
* line-specific surfaces remain separate;
* Cloudflare-compatible build remains intact.

## Future Expansion

Adding Vampire should primarily require:

```text
game-lines/vampire/**
public/data/vampire/**
registry entry
tests
```

not broad edits to existing line modules or Core mechanics.

---

# Required Final Report

## 1. Branch and Commits

Confirm branch:

```text
game-line-modularization
```

List all commits, including the two pre-existing task commits.

---

## 2. Architecture Before / After

Describe changes in:

```text
character domain
registry
catalogs
catalog state
rules
builder
sheet
Merits
character schema
```

---

## 3. Character Schema Decision

Explicitly state:

```text
kept existing schema
or
redesigned schema
```

Explain why.

If redesigned:

* show old conceptual shape;
* show new conceptual shape;
* list removed compatibility code.

---

## 4. Files Added / Moved / Deleted

Group by architectural responsibility.

---

## 5. Deferred / Removed Features

Explicitly report:

```text
Homebrew
PDF generation
printing
print preview
```

For each:

* kept;
* disabled;
* removed;
* partially retained.

Explain why.

---

## 6. Mutable Catalog State

List old globals and their final status.

Report:

```text
MtA → CtL → MtA: PASS / FAIL
CtL → MtA → CtL: PASS / FAIL
```

---

## 7. Dependency Boundaries

Report validation for:

```text
Core → game lines
contracts → game lines
Mage → Changeling
Changeling → Mage
persistence → app
catalog infrastructure → React
registry → heavy modules
```

---

## 8. Performance

Provide:

| Metric                                 |                    Before | After | Result |
| -------------------------------------- | ------------------------: | ----: | -----: |
| Home eager raw                         |                 426,349 B |   ... |    ... |
| Home eager gzip                        |                 139,148 B |   ... |    ... |
| Largest chunk                          | 281,293 B / 80,873 B gzip |   ... |    ... |
| Mage builder incremental closure       |                       ... |   ... |    ... |
| Changeling builder incremental closure |                       ... |   ... |    ... |
| Mage sheet incremental closure         |                       ... |   ... |    ... |
| Changeling sheet incremental closure   |                       ... |   ... |    ... |

Use production Vite manifest evidence.

---

## 9. Cloudflare Compatibility

Report:

```text
production build
static catalog assets
dynamic chunks
Worker dependency graph
existing bindings/configuration
```

State whether any Cloudflare-specific change was necessary.

---

## 10. Validation

List exact commands and results.

Distinguish baseline Cloudflare type errors from regressions.

---

## 11. Vampire Extensibility Assessment

Answer:

> If Vampire were added next, what existing central files would need modification?

Separate:

```text
expected central changes
unexpected remaining architectural changes
```

---

## 12. Remaining Technical Debt

Include any transitional adapters or deferred cleanup.

Do not hide temporary compatibility paths.

---

# Final Principle

Optimize for the future application, not unused historical data.

The final architecture should prioritize:

```text
clean Core
+
isolated Mage
+
isolated Changeling
+
scoped catalogs
+
explicit rule ownership
+
lazy surfaces
+
future game-line extensibility
```

over preserving:

```text
unused historical character JSON
broken Homebrew architecture
broken PDF/printing architecture
obsolete compatibility adapters
```

The final success condition is:

> A future game line with mechanics unlike Mage and Changeling can be added without forcing those mechanics into abstractions designed around the current lines, without broad edits across unrelated modules, without mutable cross-line catalog state, and without regressing the existing lazy/static-data/Cloudflare architecture.
