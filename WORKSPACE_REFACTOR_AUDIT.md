# Workspace refactor audit

## Current state

The original `app/workspace.tsx` had 6,281 lines and combined the application shell with character navigation, desktop and mobile sheets, Changeling and Mage subsystems, combat, companions, experience purchasing, catalogs, persistence normalization, and legacy JSON migration.

The main risk is coupling through file-local components and helpers. A change to one game-line feature forces the compiler and reviewer through the entire workspace surface, and compressed JSX makes state transitions difficult to audit.

## Boundaries

The refactor must preserve stored character JSON, IDs, purchase history, undo behavior, locale behavior, responsive tabs, and the public component API. No rules or catalog content should change as a side effect.

## Extraction order

1. **Mage Legacy feature** — move its state, purchase/refund orchestration, confirmation dialog, and presentation into a dedicated component. It already has a clear input boundary: `character`, `updateSheet`, and `onDiscard`.
2. **Sheet navigation** — isolate responsive tab selection and swipe behavior. This keeps desktop/mobile navigation rules out of the character renderer.
3. **Experience panels** — split Changeling and Mage purchasing into separate modules, then extract shared selectors and history rows.
4. **Companions and combat** — move their catalogs and editing panels behind feature-level components.
5. **Persistence/migration** — move normalization and legacy JSON migration into a non-React module with fixture tests.
6. **Character paper composition** — leave `workspace.tsx` as the application shell and route-level composition layer.

## Execution rules

- Extract one boundary at a time and run focused tests plus a production build after each structural change.
- Keep state ownership at the nearest common parent; pass callbacks instead of querying or manipulating the DOM.
- Avoid circular imports: feature modules may import domain libraries and shared UI, but never import `workspace.tsx`.
- Add behavior tests before moving logic whose regressions would corrupt purchases or saved characters.
- Do not publish during the refactor unless explicitly requested.

## First implementation slice

The first slice moves Legacy and responsive sheet navigation into feature modules. It also replaces the old DOM-query tab jump with controlled tab state. This directly addresses the current Legacy work while establishing the module pattern for the larger experience and companion extractions.

### Completed

- `app/workspace/legacy-page.tsx` owns Mage Legacy rules and presentation.
- `app/workspace/entitlement-page.tsx` owns Changeling Entitlement rules and presentation.
- `app/workspace/sheet-tabs.tsx` owns mobile tab and swipe navigation.
- `app/workspace/rule-select.tsx` provides the shared grouped selector without importing either splat feature.
- `workspace.tsx` now coordinates these features through explicit props and controlled tab state.
- `lib/character-persistence.ts` owns stored-sheet normalization and both legacy import migrations, with direct migration tests.
- `app/workspace/changeling-experience-panel.tsx` and `app/workspace/mage-experience-panel.tsx` own each game line's advancement flow.
- `app/workspace/experience-shared.tsx` owns neutral purchase selectors, shared merit progression checks, and derived-trait calculations.
- `app/workspace/combat-page.tsx` and `app/workspace/loadout-catalog.tsx` own combat and equipment selection.
- `app/workspace/companion-page.tsx` owns animal, Fae Mount, and Familiar presentation and editing.
- `app/workspace/character-paper.tsx` composes the character sheet features.
- `app/workspace/sheet-primitives.tsx` and `app/workspace/workspace-i18n.ts` provide neutral rendering and localization helpers.
- `workspace.tsx` is now the application shell, character list, route-level selection, and persistence coordinator.
