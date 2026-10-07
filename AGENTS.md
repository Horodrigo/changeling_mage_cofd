# Development Guide

This file is the authoritative internal development guide for Characters of the Darkness. The repository is the source of truth for implementation details; when architecture changes intentionally, update this file in the same change.

## Project Architecture

The primary rule is:

> Core supplies mechanisms. Game lines supply mechanics.

The application currently supports the persisted game-line IDs `CofD`, `CtL`, `MtA`, `VtR`, and `WtF`. Werewolf exposes Core Forsaken creation/editing and a desktop/mobile in-app sheet. The user narrowed its current goal to existing-sheet visual polish on 2026-10-02; new systems, remaining supplement catalogs and print/PDF/blank surfaces are deferred in `WerewolfAudit.md`. The main boundaries are:

- `lib/core/character/`: neutral persisted character shape, current-schema validation, shared Chronicles traits, and structural normalization helpers.
- `lib/game-line-contracts/`: neutral contracts for registrations, rule hooks, UI surfaces, and catalog snapshots.
- `game-lines/registry/`: explicit lightweight registrations and lazy catalog-group dispatch.
- `game-lines/mortal/`: mortal/Core character rules, builder, and sheet composition.
- `lib/catalog/`: generic manifest, cache, loading, deep-freezing, and immutable snapshot infrastructure.
- `lib/i18n.tsx` and `lib/i18n/messages/`: shared localization runtime plus common and per-game-line dictionaries.
- `game-lines/changeling/`: Changeling rules, builder, sheet, experience flow, Merit behavior, and catalog transforms.
- `game-lines/mage/`: Mage rules, builder, sheet, experience flow, Merit behavior, and catalog transforms.
- `game-lines/vampire/`: Vampire rules, builder, sheet, experience flow, Merit behavior, and catalog transforms.
- `game-lines/werewolf/`: Werewolf rules, creation/editing, sheet, Merit behavior, and isolated catalog transforms.
- `app/character-builder-shell.tsx` and `app/builder/`: common creation shell and genuinely shared controls.
- `app/workspace/character-paper-shell.tsx` and neutral workspace controls: common in-app sheet composition.
- `app/workspace/character-lifecycle.ts`: import/open/save/update lifecycle and canonical routing through Core normalization plus the selected game-line rules.
- `app/workspace/character-repository.ts`: browser-local character loading, crash-safe staging, debounced persistence, and collection mutation.
- `app/data-transfer-panel.tsx`: shared, local import/export UI for characters and player-created Homebrews; character imports still delegate to the canonical lifecycle, while Homebrew bundles validate every line-owned collection before replacing local data.
- `app/homebrews.tsx` plus line-owned Homebrew surfaces: shared source/item activation shell and game-line-specific editors.
- `lib/character-persistence.ts` and `lib/stored-character.ts`: line-neutral structural normalization, current-schema validation exports, and safe treatment of stored values.
- `public/shared/`: shared static Core catalogs and application images.
- `public/game-lines/<line>/`: line-owned static catalogs, images, and fonts, separated into `data/`, `images/`, and `fonts/` when those categories exist.
- `game-lines/<line>/styles/`: line-owned CSS, including responsive and print rules. Shared CSS remains in `app/css/`; public image folders do not contain application CSS.

## Ownership Rules

Core may own behavior that is genuinely common to Chronicles of Darkness characters:

- identity, Attributes, Skills, Specialties, and common derived traits;
- generic Merit storage, ratings, rendering, configuration plumbing, and neutral requirements;
- persistence, current-schema validation, catalog loading, registry contracts, and shared UI mechanisms.

Core must not accumulate line-specific mechanics. These remain line-owned:

- Mortal/Core characters: Virtue, Vice, Integrity, personal Breaking Points, and the mortal creation workflow.
- Mage: Path, Order, Gnosis, Arcana, Rotes, Praxes, Legacies, Nimbus, and Mage-specific Merit behavior.
- Changeling: Seeming, Kith, Court, Wyrd, Clarity, Contracts, Regalia, Entitlements, and Changeling-specific Merit behavior.
- Vampire: Clan, Covenant, Blood Potency, Humanity, Touchstones, Disciplines, Devotions, Blood Sorcery, Coils, Scales, and Vampire-specific Merit behavior.
- Werewolf: Auspice, Tribe, forms, Primal Urge, Essence, Renown, Harmony, Blood, Bone, physical/spiritual Touchstones, Gifts, Facets, Rites, and Werewolf-specific Merit behavior.
- Future concepts: the module for that game line.

Shared visual structure does not transfer mechanical ownership to Core.

`lib/game-line-contracts/` means programming interfaces, not Changeling Contracts. Changeling owns Contract types, presentation and clause helpers, its Entitlement page, and Entitlement types/rules/grant synchronization in `game-lines/changeling/`; do not restore shared reexports or legacy paths. Specialized Merit prerequisite types/text parsers belong to their lines: Changeling owns Feição/Frátria/Wyrd/Contract clauses in `merit-context.ts`; Mage owns Path/Gnosis/Arcana clauses in `merits.ts`. Core composes neutral requirements with an owning text predicate and explicitly supplied numeric `traits`; never restore specialized fields or interpretation to shared helpers. Shared context construction no longer reads `line_data`: each line supplies its own mechanics to the neutral outer-trait context. Homebrew does not exempt specialized mechanics, editors, or CSS from line ownership. Shared visual selectors reused by multiple lines must use neutral names rather than names of one line's powers or traits.

## Dependency Direction

These constraints apply to direct and transitive imports:

- Core must not import concrete game-line implementations.
- Neutral contracts must not import concrete game lines.
- Mage must not import Changeling implementation code.
- Changeling must not import Mage implementation code.
- Vampire must not import Mage or Changeling implementation code, and neither existing line may import Vampire implementation code.
- Werewolf must not import another game-line implementation, and other lines must not import Werewolf implementation code.
- Persistence must not import application UI.
- Catalog infrastructure must not depend on React or concrete line catalogs.
- The lightweight registry must not eagerly import heavy rules, Builder, Sheet, or catalog implementations.
- Worker code must not depend on browser UI or game-line surfaces.

An indirect chain such as `Mage -> shared helper -> Changeling` is still forbidden. Concentrated dispatch in the explicit registry or route boundary is acceptable; distributed line checks in generic mechanics are not.

## Adding a Game Line

A new line should be primarily additive. A Werewolf implementation should normally add:

- `game-lines/werewolf/**`;
- `public/game-lines/werewolf/data/**`;
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
- Attribute and Skill creation priorities are inferred from editable category spending, never selected or persisted. Every increment must fit some permutation of the 5/4/3 or 11/7/4 budgets; incomplete distributions are errors and cannot advance. Line grants and Experience purchases are excluded before shared validation, and removing dots immediately reopens eligible categories.
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

Static RPG content should remain data under `public/shared/data/**` for common/Core catalogs and `public/game-lines/<line>/data/**` for line-owned catalogs. Catalog infrastructure is generic and group-driven; each game-line registration declares the groups required by its Builder and Sheet surfaces. The versioned resource manifest lives at `public/shared/data/catalog-manifest.json`. Canonical line Merits belong to their own public line folder even when other lines can purchase them; the shared Merit discovery index does not transfer ownership.

`game-lines/<line>/` contains bundled executable source; `public/game-lines/<line>/` contains static files served unchanged. Keep public images and fonts with their owning line instead of creating global line-specific folders. Only application/PWA entry points, installation icons, and generated runtime metadata belong directly in `public/`. Asset/catalog generators, CSS URLs, registrations, tests, and the service-worker template must follow the layout documented in `README.md`; do not leave duplicate legacy public paths. Moving unchanged catalogs must preserve resource IDs and content versions so IndexedDB cache entries and persisted character choices remain valid.

Vampire composes optional power and Condition errata in its own `homebrew-catalog.ts`. An enabled replacement retains the original catalog identity and activation default; the optional errata's disabled-by-default marker must not hide that identity from downstream pickers. Localized replacements inherit presentation only for canonical fields they leave unchanged; untranslated replacements never inherit the old translation. An explicit empty field clears an obsolete inherited value, such as the Willpower cost removed by the Amorous Fire errata. Toggling errata changes the active catalog view, never saved choices or Experience receipts.

Required invariants:

- Each runtime requests only Core and its selected game line's JSON; CofD, CtL, MtA, VtR, and WtF catalogs remain isolated from one another.
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
- Shared structured Merit requirements resolve canonical definition IDs against the supplied catalog, as do printed references and exclusions. New Homebrew requirement choices store the referenced ID plus an optional canonical display fallback; opening an old ID-less reference never rewrites it. The schema-2 reference bridge accepts only an unambiguous canonical name, while an explicit unavailable ID fails closed. Owned selections still use the shared authoritative-ID resolver. Printed distributed references never bind player-created namesakes. Core recognizes its own Status identity; Mage/Vampire supply their Status IDs and Mage owns its printed domain aliases. Legacy/Attainment Merit references also resolve canonical IDs supplied by Mage; Core does not identify Mage domains or Legacy mechanics.
- Shared relative Merit prerequisites (`≤ <canonical Merit>`) resolve the referenced definition against the active catalog and require one owned instance at least equal to `selectedDots` (one dot when browsing). Separate instances never combine ratings; unavailable IDs and player-created namesakes cannot satisfy printed references. Creation validation and the Experience picker supply the target rating; opening a character never rewrites allocations or receipts.
- Core Merit prerequisite contexts include the current neutral `specializations` list. Fighting Finesse requires a nonblank Brawl/Weaponry Specialty by its canonical definition ID, preserving the Dexterity prerequisite. Creation previews recompose common Specialty grants from current Merit allocations without changing saved purchases; owning lines explicitly supply their Cult grant hooks. Sheet/XP contexts use the actual recomposed sheet Specialties.
- Core Interdisciplinary Specialty selects an existing Specialty in its corresponding Skill at three or more dots. Its configuration stores the canonical Skill, exact authored Specialty name and grant origin; duplicate identical tuples are ambiguous and cannot be selected. Explicit Specialty removal or alteration removes only the linked canonical Merit instance, without crediting XP or rewriting its receipt. Save/update/draft compare the previous character with the recomposed result; open/import alone never remove unresolved links. Unconfigured legacy rows remain available for explicit selection. Creation merges accept an explicit exact-removal predicate so XP-only linked instances cannot reappear after an edit; ordinary omission still preserves XP allocations. Core Cult producers clear the exact benefit row with an empty placeholder to preserve sibling indices and configurations. Owning rule hooks supply their legacy producer identities or suspend their benefits: Mage resolves its own ID-less Cult Influence, while Changeling suspends its Interdisciplinary Entitlement blessing. Core never interprets those line mechanics.
- The shared Experience Merit picker receives a ready prerequisite context from the owning line; it must not inspect persisted `line_data` or construct another line's context. `meritContextForSheet` accepts only neutral outer traits and explicitly supplied effective Skill bonuses. Mage/Changeling own their additional fields; Werewolf supplies its effective Hishu context. Changeling's current-sheet Mantle context resolves its canonical definition ID, never a display name or explicit Homebrew namesake. Grant upgrades default to forbidden in the shared picker: Mage/Changeling/Werewolf supply their own predicates resolving the canonical definition plus its producer marker. Mantle's existing-allocation purchase restriction belongs to Changeling eligibility, not to a shared display-name filter.
- Changeling owns its Merit access by Court/Seeming/Kith and the canonical Lucid Dreamer exception in `merit-context.ts`. Its creation picker, creation validation and XP eligibility/refund dependency checks compose that predicate with the shared checks. Court access resolves the canonical Mantle/Goodwill IDs; its generated printed prefix is not evaluated a second time. Shared `meritSelectionProblems` accepts an owning eligibility predicate and reports semantic messages. Its specialized text parser composes shared AND/OR, category and rating checks. Structured numeric requirements use explicitly supplied `traits`; specialized context types remain line-owned.
- Core grants and permanent derived modifiers use canonical definition IDs from a small identity-only index reconciled with the static Core catalog. Their documented schema-2 fallback accepts only an exact canonical Core name/source, and never replaces an explicit ID. Generated grants use definition/instance IDs in their markers, with Contacts carrying its canonical definition/source. Regeneration discards free generated allocations only, retains recorded XP in its original instance, and never collides a new free grant with a purchased instance. Mortal Builder, XP purchases/refunds and the pure rules hook run the same Core grant synchronization.
- Mage supplies the canonical identity of its own Mystery Cult Influence through the shared configured-Cult grant hook. Core does not identify Mage variants, and the owning hook uses the documented exact canonical name/source resolver only for existing schema-2 ID-less selections. Explicit Homebrew or unavailable IDs never inherit this behavior.
- Mage's Faction Member Rote Skill grant also resolves its canonical definition ID through the same identity helper. Renaming a stored label does not remove the grant, and explicit Homebrew/unavailable IDs never inherit it. Only existing schema-2 ID-less canonical name/source selections use the documented bridge; synchronization never rewrites their identity, allocations or XP history just to calculate this benefit.
- New catalog-selected Cult Merit benefits store JSON-encoded canonical definition/source IDs, canonical fallback name, and rating in their existing configuration rows. Shared grant synchronization preserves those IDs in generated selections. Regenerated Cult grants retain authored configuration only for one exact definition/instance/producer match; an unavailable or different explicit ID never inherits another grant's choices. The existing schema-2 name-only row reader may retain configuration only when both selections lack definition IDs and their exact canonical name/source and producer match. Paid allocations remain in their original instance; a new free instance never copies a purchased instance's configuration. Nameless Order and bundled Shadow Cult benefit producers also use ID-bearing rows. The documented `name|dots` reader exists only for existing schema-2 rows; it never invents IDs or rewrites a stored row. The editor and Desktop/Mobile summaries resolve the chosen definition against their active catalog, not a first same-named item.
- When a creation merge omits free Core grant rows, save/update seed only unique previous free instances before the owning grant engine recomposes them. This retains exact authored configurations without resurrecting obsolete producers or copying paid instances. Linked Specialty reconciliation also preserves an omitted configuration of the same automatic definition/instance/producer; explicitly cleared selector fields are never restored.
- Mage and Vampire recompose their template Merit grants by canonical definition ID and retain the purchased instance and XP allocations when removing its free template dot. Narrow, documented schema-2 bridges recognize old ID-less automatic grants only by the owning producer marker, exact canonical name and source; unavailable explicit IDs never fall back to a name. Builder rows contain creation dots only; synchronization consumes total ratings. The neutral creation merge preserves omitted purchased instances, removes their obsolete grant marker, and recomposes XP only by exact instance ID, never by a matching name. Explicit creation allocations are never reduced by XP a second time.
- Vampire's pure identity index also owns Kindred Status/Cult affiliation counts, Touchstone slots, Feeding Grounds and Blood Tether Pack's Pack Alpha. Removing that Pack grant subtracts its free dot only, retaining paid allocations and authored choices. Coil of Zirnitra counts and upgrades resolved mortal-only definitions against the active catalog, never saved labels.
- Vampire owns Discipline Options in its power catalog and `line_data.discipline_option_ids`. Each paid improvement references its base Devotion and any additional prerequisites by canonical IDs, appears in the XP picker and Desktop/Mobile cards, and stores a separate semantic receipt with its paid cost. Printed advanced-version prices are total learning prices; upgrading charges their difference from the canonical basic price. Refunds reject removal of a supporting power or prerequisite atomically and return only the recorded payment. Opening a sheet never infers an improvement from a name or old price.
- Vampire power `requiredDisciplines` keys are canonical Discipline definition IDs. Its shared owning prerequisite predicate resolves them against the supplied power catalog and reads canonical persisted ratings; unavailable IDs fail closed. Lithopedia rites use these requirements while preserving their original dot-only parser text, and discipline refunds retain paid rite dependencies without rewriting old choices or receipts.
- CombatPage accepts an explicit neutral Tilt catalog, defaulting to shared Core Tilts. Vampire composes that catalog with its own active power-catalog Tilts, including Swarm for Dance of the Swarm, using the complete rules supplied by the user. Core never imports or registers the line-owned Tilt, and Homebrew activation remains Vampire-owned.
- Vampire XP discovery uses the active power view, while history labels retain the complete catalog identities. Refund dependency checks retain inactive canonical definitions and prefer active errata for identities still present. Disabling a Homebrew source cannot erase a paid dependency or prevent refunding an owned Discipline Option. Option receipts must match the unique persisted history entry, its undo identity and its recorded price.
- Vampire Devotion learning discounts may require an explicit narrative confirmation declared by canonical ID in the owning power catalog. The Experience dialog binds that temporary choice to the selected power, resets it on selection changes, and never infers a teacher or Necropolis membership from affiliations, authored notes or labels. Purchase receipts retain the actual paid cost; opening a character and changing language do not rewrite receipts or saved powers.
- Configuration metadata is keyed by the canonical Merit definition ID. The shared editor resolves the selected definition before invoking line editors, passing an ID-bearing render-only selection; it never rewrites old stored choices merely to display them. Inline layout decisions also take IDs. Core and line structured editors match their own explicit IDs, and Mage owns the Masque/Style configuration-dot lookup and Familiar creation-editor suppression.
- Expanded configuration summaries and line companion cards also resolve the selected definition against their active catalog. Their helpers dispatch canonical IDs, not saved labels; unavailable IDs and Homebrew namesakes never receive an official configuration or companion. Mage adapts its own Cult Influence to the neutral Core Cult summary.
- The shared creation picker only supplies the removal-confirmation mechanism. Owning lines provide canonical-definition predicates for their companion or linked-benefit confirmations; Core does not list those line-specific Merits.
- Persist `merits[].definitionId` for the catalog identity and `instanceId` for each purchased/configured instance. The shared creation picker and Experience instance picker resolve through `lib/merit-identity.ts`: an explicit definition ID is authoritative, including when unavailable. Its documented schema-2 ID-less fallback accepts only an unambiguous canonical name and source, never translated names or the first namesake. Structural normalization preserves IDs without loading catalogs. Existing line-specific name-based consumers are being migrated under `MortalVampireMageTranslationAudit.md`; do not expand them.
- Core structural normalization preserves every Merit label, including `Throne`. A narrow production schema-2 recovery in Changeling normalization recognizes only ID-less `Throne` with exact source ID `h-seemings` and attaches `h-seemings:power-behind-the-throne` without renaming, replacing explicit IDs, or changing paid allocations/history; delete it when these rows are unsupported. New Mortal/Mage/Vampire Merit upgrades and shared refunds reject duplicate instance IDs, even across different definitions. Old name-only refunds require one unambiguous eligible selection; an index cannot disambiguate namesakes. Failures preserve sheets, balances and receipts.
- Mortal Experience entries persist a semantic `purchase` descriptor. Vampire and Mage Experience panels persist canonical undo identities and target ratings; their UI renders these in the current locale without rewriting prior labels or parsing them as identities. Merit purchases record both definition and instance IDs, and their refunds verify the exact instance, definition, recorded cost and remaining XP dots. A failed refund must not restore XP or delete history. Opaque history remains visible but cannot restore an old sheet snapshot or infer a purchase from translated text. Remaining name-dispatched grants/configuration consumers are tracked in the active localization audit.
- Changeling Merit Experience quotes also target exact definition/instance IDs and persist target ratings, not translated descriptions or selection indices. Its atomic refund verifies the receipt cost, paid allocation, allowed remaining rating and newly invalid Merit dependencies; Builder refunds retain the existing bank. A narrow production schema-2 receipt bridge requires the complete canonical exact-instance purchase chain, never descriptions or indices, and can be removed when ID-less receipts are no longer supported. Court grant synchronization resolves Mantle/Court Goodwill through an identity-only index reconciled with the static catalog; removing a Court removes only its free dot and retains paid dots, the instance and authored configuration. Remaining Builder and Entitlement consumers are still tracked in the audit.
- Mage Experience refunds, Legacy progression, and the Legacy UI live in `game-lines/mage/`; shared `lib/experience-refunds.ts` contains only neutral dot/Merit refund mechanisms. Each line owns interpretation of supernatural-stat purchase history; Mage Gnosis uses semantic undo records, never translated purchase descriptions.
- Mage Legacy receipts store the definition ID and Attainment rank, precise undo deltas and credits, never a new display description or whole-sheet snapshot. Its history resolves IDs in the current presentation catalog. Refund/discard share `legacy-progression.ts`, refuse a different Legacy, later-rank dependencies, duplicate Praxis restoration, incoherent costs or unavailable credited resources, and leave the original sheet/history/balances intact on failure. A documented schema-2 bridge reads old receipt identity only from the explicit pre-purchase selection; it never infers identity from names/current selection or rewrites stored receipts.
- Mage Legacy Merit prerequisites declare canonical definition IDs and, when required, a Status domain in their line-owned catalog. Desktop/Mobile and the initiation dialog supply the active Merit catalog to entry/Attainment validation. Requirements resolve owned definitions with the shared authoritative-ID resolver, never a saved name or any label containing Status; separate instances do not combine ratings. Core Status and Awakened Status remain distinct, including Mysterium's domain restriction. Missing catalog identities fail closed without rewriting sheets or receipts.
- Shared `activeMeritCatalog` receives owned selections, not display-name arrays. Disabled Homebrew definitions are retained only through `resolveMeritDefinition` and their exact IDs; the documented unambiguous canonical-name/source fallback still applies to existing ID-less selections. Builders must include existing XP-only instances when preserving definitions, not only current creation allocations. Errata retain the original canonical definition ID. Active errata retain the original canonical source and reprints in `additionalSources` for the documented exact-name/source schema-2 bridge. A localized replacement inherits only the presentation of canonical prerequisites and levels it leaves unchanged; a replacement without localized presentation never inherits the old translation.
- Catalog membership and purchase eligibility are separate. Keep valid definitions visible even when the current character cannot buy them, and explain unmet prerequisites.
- Shared numeric Merit prerequisites recognize maximum Willpower from Resolve + Composure, with an explicitly supplied neutral trait value taking precedence. Current resource spending never changes this prerequisite; creation, sheet and XP use the same parser.
- Core enforces the catalog's `mortalOnly` flag before descriptive prerequisites. A line-owned rule may explicitly supply `mortalMeritsAllowed` (for example Vampire's Coil of Zirnitra); Core does not identify or calculate that exception. Validation messages use the same localized Merit presentation as catalog rows.
- Distributed Vampire homebrew Merits evaluate their printed prerequisites; do not restore `descriptivePrerequisites` to these catalogs or their importer. Vampire supplies Disciplines, Blood Sorcery, Blood Potency, Humanity, affiliations, canonical Conditions and known Devotions to `merit-eligibility.ts`, used by creation validation and XP eligibility. Printed section access and exceptions belong there; catalog categories alone never imply a clan or bloodline restriction. Core owns neutral specialty/count/rating checks and canonical structured Merit references. The six Typhos patient procedures are shared Core mortal-only definitions, retaining their original IDs and permitting Vampire's Zirnitra exception; doctor requirements remain table adjudication. Player-created narrative text remains descriptive, with its authored structured requirements enforced.
- Preserve discontinuous ratings exactly. Do not infer an interval from the lowest and highest dots.
- Repeatability and unbounded ratings are explicit definition metadata (`repeatable` / `unbounded`), never inferred from canonical or translated names. Player-created Merits preserve these explicit flags. Aggregate Contacts, Staff and Token do not become repeatable instances.
- Unbounded purchase controls start from the definition's actual minimum rating, including when no instance is owned; they do not assume one dot. Creation captions and subsequent XP targets use the same metadata.
- Store only choices required by the rule. A single free-text value should normally be edited inline; complex rules may use structured configuration.
- Do not infer repeatability merely because a Merit names a subject. A repeatable Merit needs a stable instance ID, independent configuration and rating, exact upgrade targeting, and exact refund behavior.
- Aggregate Merits and repeatable instances are different models. For example, Contacts, Staff, Touchstone, Multilingual, and Token are aggregate structures; Allies, Mentor, Retainer, Safe Place, and other explicitly repeatable definitions may have independent instances.
- Level benefits are stored at their actual rating and displayed only when unlocked.

Important line-owned examples:

- Changeling Court selection grants and identifies Mantle; Mantle is not a new arbitrary purchase. Court Goodwill uses canonical Court identity and its own instance/access rules.
- Changeling Builder Court reconciliation operates on creation-only rows by canonical definition ID, while the neutral merge restores XP by exact instance. Its Contract picker and validation receive recomposed total Mantle/Goodwill ratings, not creation-only dots. Entitlement prerequisites, selection and generated Merit grants use an owning identity-only index reconciled with static Core/Changeling catalogs. Resynchronization removes free allocations only, preserving recorded XP and the original instance; new grants carry definition/source IDs. Its page and sheet do not identify the Entitlement Merit by the displayed name. Remaining sheet/configuration consumers are tracked in the localization audit.
- Fae Mount configuration belongs to the Changeling companion surface.
- Mage-specific status, magical items, grants, and prerequisites must not be modeled by copying Changeling-specific mechanics.

A future line-specific Merit should be implementable without editing a central Mage/Changeling mechanics switch.

Werewolf creation stores an explicit `creation_choices` snapshot, an `auspice_skill_grant`, creation Facet/Rite IDs, and separate Experience allocations in its own `line_data`. Reediting removes only the recorded free Skill dot and separately identified purchases before composing them again. Totem 1 and Language (First Tongue) have canonical definition IDs, stable grant markers and instance IDs; only one dot of each is free. Its Merit resolver delegates to the shared authoritative-ID resolver, including its narrow ID-less schema-2 bridge; it never discards an explicit unavailable/Homebrew ID to use a name. New XP Merit purchases and upgrades persist definition IDs. Quotes/refunds reject duplicate target instance IDs; refunds compare definition/instance identities, not stored display labels. XP-only Merit instances never consume the creation budget. Living Weapon permits independent bite/claws instances in the same form, but not a duplicate form/attack pair.

Werewolf owns its XP transactions and semantic history in `experience-rules.ts`, shared by its Sheet and creation advancement panel. Purchases use canonical traits and definition/instance IDs; history labels are localized only when rendered. Refunds remove only purchased allocations, verify the recorded cost, and reject newly invalid Merit, Specialty, Primal Urge cap, or Gift dependencies. Prerequisites use effective Hishu traits, not the current Health form. The shared Merit picker exposes a neutral grant-upgrade predicate; Werewolf allows upgrades of its free Totem instance but not the fixed First Tongue grant. Harmony is never purchased, and XP transactions do not heal damage or regenerate resources. Rite purchases enforce Tribe restrictions and a player-described source of knowledge, persist canonical `learned_rites` separately from creation IDs, and never require a Pack record. The owning Builder prevents selecting learned Rites again as creation allocations, including after returning from its advancement step.

Werewolf Gift progression remains line-owned in `gift-progression.ts`. `learned_facets` records paid powers, `gift_unlocks` identifies the exact purchase that unlocked a Shadow/additional Moon family, `renown_facets` records automatically granted Auspice Moon Facets, and `renown_grants` ties free allocations or pending credits to individual non-Auspice Renown purchase IDs. Free credits never unlock Shadow families or alter XP history/balances. Additional Moon Gift purchases retain player-described authorization, ascending Facet order and associated Renown caps. Source-of-Gift and Renown-deed text is authored, not automatically translated. Builder recomposes automatic grants from its explicit creation choices and XP allocations; edits cannot silently reclassify purchased powers, replace paid unlocks with creation grants, or change Auspice while Renown purchases exist. Refund dependency checks identify each Facet separately, so an unrelated pre-existing invalid power cannot conceal a newly invalid dependency.

Werewolf persists derived traits in Hishu and calculates the selected Health form without rewriting base traits. Form changes do not heal: wounds in lost Health boxes upgrade remaining wounds, while unrepresentable terminal excess remains stored. Only the explicit shared Heal action clears all damage. Gauru has no innate Armor. Permanent Core Merit modifiers are a pure shared mechanism in `lib/core/character/derived-traits.ts`; Werewolf applies size modifiers before the form delta. Its small numeric form constants and permanent Merit identity index are reconciled with the authoritative static catalogs in tests, never used as a second editorial catalog.

Specialties left unfilled and Touchstone notes are optional in creation. Werewolf exposes Blood/Bone recovery before selection and compact searchable creation catalogs. Its manual Harmony track places Flesh/Spirit Touchstones at 10/0 and fills only the current rating's circle. Kuruth, Wasu-Im and triggers belong to Body of the Wolf; Primal Urge displays compact informative summaries directly below its dots, omitting zero/None entries instead of adding another rating disclosure. Desktop/print compare five forms with the supplied background; mobile Combat displays one active form without that image and shares Health's selector. On a Health-reducing form transition, the line-owned transaction upgrades remaining wounds for each lost damaged box (WTF2 p. 172), rather than silently hiding them. Increasing Health does not reverse upgrades; terminal excess remains stored until explicitly cleared.

Werewolf owns its optional `line_data.fetishes` inventory and lazy `werewolf-fetishes` catalog group. Canonical items retain catalog IDs; independent copies retain instance IDs, Steel Wolf variant IDs, manual Talen quantities, and authored spirit/notes. Character-specific custom items retain their authored text across locales. Schema-2 normalization validates structural fields without dropping unavailable catalog IDs. Builder and Sheet share only the Werewolf inventory surface; changes never spend XP/Essence, consume Talens automatically, teach linked Facets, or copy Changeling Token Merit budgets. Core WtF 2e has no Fetish Merit.

Werewolf's lazy `werewolf-totem` catalog group owns its EN/PT Totem reference, Rank limits, Advantage bands, improvement costs and the three printed The Pack examples. Its static `totem-powers.json` / `totem-powers-pt.json` contain all 24 Core Numina, 11 Manifestations and five Influence effects, with complete labeled rules, canonical prerequisites and the nine printed Reaching markers. Builder and Details/Powers expose collapsible rules, searchable examples and power search/type/Reaching filters. The optional individual editor persists authored choices and power IDs in `line_data.totem`, with separate entity-keyed manual resources in `current_state.werewolf_totem`. Initial allocations use the canonical personal Totem Merit rating plus manually entered external contributions, one free Twilight Form and explicit Numen exchanges. Incomplete allocations are warned, not used to block Uratha creation. Acquisition restrictions are distinct from Condition prerequisites at use. Its optional `improvements` ledger stores one purchased Attribute/Influence dot or Numen per entry, with exact identity, printed cost, authored funding origin and timestamp. Effective Totem traits apply these overlays without reclassifying initial allocations or consuming their Numen exchanges. Entries replay in order to enforce trait/Rank and bound Numina/Influence potential; ledger correction checks dependencies by exact entry. Funding is resolved externally: this is not a Pack XP account and never debits/refunds individual XP. Structural edits never refill resources, truncate damage or alter Uratha traits/XP; unavailable power IDs survive import. The approved conflict resolutions are Advantage 5 XP at 15–19 points / 10 at 20+, and Defense using Power/Finesse (higher at Rank 1, lower otherwise; zero while dormant). These decisions are explicit in `WerewolfAudit.md`, not claimed official errata. Printed sample discrepancies and the conflicting Open prose remain editorial notes rather than silently corrected character allocations. Separate member Advantage overlays remain in scope; there are no Pack records or linked sheets.

## Persisted Character Schema

Werewolf's optional Totem `advantage` stores stable choices, an explicit manual active flag, and equal-value individual replacements with authored reasons. `totem-benefits.ts` resolves runtime-only member overlays against explicit immutable catalogs without altering purchased traits, initial allocations, XP balances/history, or resources. Its line-owned editor is shared by Builder and Sheet. Effective traits feed Hishu prerequisites, all forms, display and derived values; the lazy rules loader binds only Core/Werewolf catalog snapshots for canonical lifecycle updates. Never persist the resolver's returned traits as the canonical character or count its grants toward creation/Experience budgets. XP quotes/transactions/refunds protect exact newly invalid benefit dependencies. Manual suspension, removal or editing that loses Health obeys the same excess-damage rule as a smaller form; reactivation never reverses wound upgrades. Automatic Area of Expertise for an already-owned Specialty follows the explicit grant provision provisionally; its Resolve prerequisite conflict remains under user review in `WerewolfAudit.md`.

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
-> preserve exact previous free Core grant configurations during explicit edits
-> game-line synchronization of grants
-> compare linked Specialties during explicit edits; notify owning producers and resynchronize when removed
-> game-line derived-state calculation
-> runtime use
```

Core normalization remains line-neutral. Mage normalization belongs to Mage; Changeling normalization belongs to Changeling; Vampire normalization belongs to Vampire; a future line normalizes its own data. Unsupported schema versions fail explicitly. Do not silently or partially load historical formats, and do not restore historical migrations without a concrete product requirement.

### Unsupported stored values

Local storage may contain data that is not a current `CharacterSheet`. Keep unsupported values opaque until the user explicitly removes them. Listing stored characters must not migrate or normalize those values. Tests should protect safe handling and deletion instead of obsolete migration behavior.

Current-schema export and import must round-trip without losing data.

Changeling has a narrowly scoped schema-2 Merit allocation recovery for previously misclassified XP-only purchases. Its line normalization and Builder (including resumed drafts) verify a complete purchase chain using the canonical Merit name and exact instance ID before correcting creation/experience dots. It does not infer allocations from translated descriptions, indices, incomplete history, or spent-XP totals, and it never changes balances or history. Already valid XP allocations remain authoritative; this is not support for older character schemas. The production helper documents its deletion condition.

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

Keep the localization runtime in `lib/i18n.tsx`, shared UI messages in `lib/i18n/messages/common.ts`, and line-exclusive UI messages in the matching per-line dictionary. Consumers continue to use the shared `useLanguage()` and `t()` API.

- Changing locale must not alter rules, IDs, choices, costs, persisted data, or experience history.
- Persist IDs or canonical values, never localized labels as primary identity.
- Missing Portuguese content falls back explicitly to English; never invent a translation.
- Cross-line Condition/Tilt homonyms carry bilingual `nameQualifier` metadata only on colliding records. Desktop/Mobile presentation, search and removal labels qualify the displayed name; canonical names, IDs, effects and stored selections stay unchanged, including existing Errata labels. Catalogs remain scoped to the active line. Merit homonyms use this metadata through `meritPresentation()` only after comparing full mechanics, not merely different prose. The five confirmed distinct pairs and source evidence are recorded in `MortalVampireMageTranslationAudit.md`; the catalog-equivalent Core/Mage Mystery Cult Influence remains unqualified, with its Core citation discrepancy preserved for separate review. Qualifiers must never become stored names or mechanical identities.
- Book titles remain in their original language, and user-authored content is not translated automatically.
- Dynamic messages must handle grammar and ordering in each locale rather than concatenate translated fragments.
- Merit selection validators return semantic message keys and parameters; the consuming UI resolves them with `t()`. Do not parse English error sentences to select a translation.
- Mage owns its configuration validation and the rating-dependent Infamous Mentor prerequisite in `game-lines/mage/merits.ts`. Special validators dispatch by definition ID; linked choices verify both canonical definition IDs and an unambiguous instance ID. Shared linked-field plumbing takes `meritIds` and a neutral `minimumDots`, not Mage names. Linked validation messages carry IDs and resolve the active catalog presentation only in the UI.
- Vampire Clan/Covenant/Anchor/Bloodline reference records keep their English reference text canonical and carry optional static `presentationPt` text. Their owning `reference-presentation.ts` supplies render-only views to Builder, Sheet and Homebrew; neither locale changes nor these helpers rewrite stored Clan/Covenant/Anchor/Bloodline identities or authored choices. The reference snapshot remains deeply frozen. Descriptive `translatedName` captions are not canonical names.
- Vampire power records and their individual levels carry optional static `presentationPt` text. The owning `power-presentation.ts` supplies render-only summaries and mechanics to XP, Sheet and Homebrew. Canonical names, prerequisites, rule effects, ratings and persisted allocations remain inputs to rule checks; creation and semantic history use descriptive `translatedName` captions only for display. Player-authored powers without presentation text remain verbatim.
- Vampire's Bloodcrafting is a repeatable, unbounded Merit starting at two dots. Its owning `bloodcrafting.ts` keeps canonical enhancement IDs/costs, while `merit-configuration-editor.tsx` injects its choices into the neutral editor in Builder, XP and Desktop/Mobile. Each instance stores the exact authored Crafts Specialty in `configuration.subject` and learned enhancement IDs in `configuration.enhancements`; available improvement points are its rating minus two. Enhancement prices are choices, not automatically unlocked Merit levels. Opening legacy or unavailable configurations never rewrites them; selection and summaries resolve the canonical definition first. New purchases validate the chosen Specialty and improvement budget. Atomic owning refunds reject a retained instance below two dots or a newly invalid configured Specialty/budget, preserving purchases, XP and receipts on failure. Whole-instance refunds and explicit choice changes keep other instances intact. Crafted-object creation and the optional Build Equipment procedure remain source rules presented in EN/PT, not a new equipment subsystem.
- Vampire Devotion access and learning quotes use owning `bloodlineExclusive`/`additionalClanIds` and `experienceDiscounts` metadata. Discounts match canonical Bloodline/Covenant IDs or a known Devotion ID resolved against the active catalog; they do not become prerequisites. XP cards, confirmation and in-app sheet prices use the same quote. Refunds use the recorded receipt cost, even after affiliation or discount eligibility changes.
- Xiao faction selection belongs to Vampire's Bloodline join dialog and in-app Bloodline page, shared by Desktop/Mobile. `line_data.xiao_faction` stores explicit `apostates`/`ascended` choices; missing, unknown or translated values never infer a faction. An owning `experienceDiscounts[].xiaoFaction` qualifier applies only alongside the canonical `xiao` Bloodline ID. Ripples in Still Water becomes a tracked free grant only for eligible explicit Apostates, using the existing provenance synchronizer; both factions retain access to both power series. Explicit faction changes and Bloodline removal recompose free grants without repricing paid receipts or reclassifying opaque choices. Core neither identifies Xiao nor owns this choice.
- Automatic Bloodline Devotions require an explicit numeric zero quote. An omitted cost never declares a free grant; synchronization and Bloodline removal share the same owning synchronizer. All new free grants, including explicit-zero definitions, persist canonical IDs in `line_data.automatic_devotion_ids`. Synchronization and refund dependency checks share the owning provenance resolver. Its production schema-2 bridge recognizes only the six previously free definition IDs (Infectious Bite, City Attunement, Hounds of Hell, Udjat, Purification and Spore), while they still have explicit zero cost; delete that bridge when untracked schema-2 grants are unsupported. A newly corrected free price, such as Murmur, never reclassifies an old untracked choice or opaque receipt. Positive-cost semantic Devotion receipts protect paid choices even against stale grant markers. Untracked older choices and unavailable definitions never acquire free provenance just from today's quote. Ortam recipe acquisition by its printed progression remains a separate line-owned concern, tracked in the localization audit.
- Vampire Devotion prerequisite checks compose canonical Discipline clauses with explicit `requiredSkills`, `requiredDevotionIds` and `requiredMerits` catalog metadata in `creation-rules.ts`. Known Devotions resolve exact IDs against the active powers. Printed Merit requirements require an available canonical definition ID, then reuse Core's neutral `requirementMet` with the active Merit catalog; separate instances never combine ratings, and unavailable IDs or player-created namesakes fail closed. XP cards retain accessible definitions and mark unmet prerequisites; confirmation uses the same predicate. Builder, Bloodline join/removal, XP synchronization and refund transactions supply their active Merit catalog. Refunds reject newly invalid retained paid Devotions atomically, while automatic free Bloodline grants may recompose. Existing invalid purchases, legacy identities, configurations and receipts are never rewritten merely to evaluate requirements. Additional printed clauses without structured metadata remain tracked in the localization audit.
- Vampire blood-sorcery purchase catalogs reuse the neutral `ExperiencePowerPicker` for summaries and mechanics, including Target Successes. The owning panel supplies its already-filtered canonical ritual IDs and rating groups; the shared picker does not interpret access, Humanity, or Ritual Discipline rules. Free ritual choices retain their owning selection flow.
- Merit catalog groups attach ID-keyed Portuguese presentation from static JSON without replacing canonical prerequisites or level identities. Vampire loads its own `merits-vampire-pt` resource alongside `merits-vampire`, using the existing presentation mechanism and preserving English canonical text. UI consumers use `meritPresentation()` for descriptions, requirements, and level text; rule checks always receive the canonical definition.
- Merit category labels live in the common or owning line's dictionary and are resolved by the UI-only `meritCategoryLabel()` helper. Stored categories remain canonical; catalog transforms must not import this React-dependent UI helper.
- Changeling catalog Token selections retain both their instance ID and canonical `catalogId`. Builder, Sheet, and Print resolve catalog text for the selected locale without changing stored choices or authored overrides. A narrowly scoped presentation bridge recognizes existing schema-2 ID-less selections only when every text field exactly matches a canonical or Portuguese catalog snapshot; it does not translate arbitrary authored text.
- Search and sort use displayed text unless a rules-defined order applies.

For source reconstruction, use the offline Codex of Darkness material as an index for candidate identity and citations, not as final authority for mechanics. Source PDFs are authoritative for effects, prerequisites, choices, exceptions, and long-form rule details. Review two-column extraction carefully; never import raw extracted text without checking headers, footers, sidebars, page breaks, and neighboring columns.

Do not use the `pdftotext` executable from the system `PATH`: on this workstation it resolves to an incomplete MiKTeX installation. Use the bundled Python PDF libraries and visual page rendering instead.

Work in small verifiable batches. Reconcile IDs, counts, source, page, required fields, and known exceptions in tests. Structural tests do not replace editorial PDF review. Existing generator and PDF-validation scripts are reproducibility tools, not runtime dependencies.

### Contract catalog records

- Rolled Contracts keep classification, Regalia or Court, source, summary, Dice Pool, cost, action, duration, genuine options, all printed outcomes, Loophole, and benefits as distinct fields.
- Automatic Contracts use a distinct Effect field instead of invented roll outcomes.
- Do not duplicate Effect or outcome text into Options. Do not infer exceptional shapes when the source presents something different.
- Contract costs use `●` for Glamour and `○` for Willpower.

`scripts/generate-mage-spells.py` and `scripts/validate-mage-spells-pdfs.py` preserve the reproducible Mage spell audit path. Keep their assumptions synchronized with the static spell shards and their tests.

## UI Organization and Conventions

Werewolf form comparisons display only changed Attributes and their recalculated totals, including active Merit modifiers. Do not repeat modifier labels or add a second full Attributes disclosure. Five desktop columns use fluid widths; the supplied transparent WebP is decorative and absent from mobile. Form Details uses ID-keyed structured passive fields from the static reference catalogs, not a runtime parser of the full form description.

- Share controls only when behavior is truly common. A shared visual pattern does not imply a shared mechanical abstraction.
- Shared CSS patterns use neutral names (`rule-power-*`, `creation-power-*`, `template-choice-*`, `affiliation-*`, `stored-resource-dot`). Changeling-specific Kith, Court, Regalia, Token, Entitlement, Clarity, and Goblin Debt selectors belong to its styles, including Homebrew editors. Reusing presentation does not move the underlying mechanics into Core.
- Keep line-specific forms and interactions in the owning module.
- Avoid giant switch components, universal section engines, and large optional-prop matrices.
- Desktop page content uses the shared `1200px` maximum width and is centered. Full-width sections inside a page grid must explicitly span every grid column; do not rely on a generic `wide` class with unrelated selectors.
- Use the shared `Button`, `Input`, `Textarea`, and select primitives for application controls. Standard controls are `36px` high; `32px` compact controls are reserved for card-level and inline actions. Controls sharing a row use the same height and align to the field baseline.
- Section headers use the shared `panel-heading` pattern: copy starts at the top-left and one primary action occupies the top-right action slot. On narrow screens the action moves below the copy and fills the available width.
- Navigation and menu rows center labels and icons vertically, keep icons in a fixed non-shrinking `16px` slot, and use a minimum `44px` interaction target. Sibling tab triggers divide the available width evenly on desktop and become a horizontal scroll strip on narrow screens.
- Homebrew source inventories use one outer source disclosure, category tabs, and border-separated item disclosure rows. Keep each item's name and activation state visible; reveal descriptions and item actions on expansion instead of nesting category panels and item cards.
- Expanded rule rows show the complete catalog mechanics owned by that item type, not only a summary. Power, Condition, Merit, Entitlement, and similar cards place each labeled field on its own row while keeping the bold `Label:` and its value together on that row.
- Add-item actions use the compact visual scale established by the shared Builder controls.
- Remove-item actions use the compact card-level treatment used elsewhere.
- Catalog selection uses compact checkboxes when an item is a simple toggle. Keep a compact action button when selection has additional semantics, including repeatable Merit instances.
- Dialog completion and cancellation controls use the shared compact catalog-footer sizing.
- Verify responsive behavior and both supported locales for user-facing changes.

## Test Philosophy

The user explicitly authorizes browser smoke tests during the active Werewolf goal. Use synthetic characters in a local test origin, preserve personal sheets, and verify both locales and responsive layouts. Before completing that goal, compare all Werewolf surfaces with the existing game lines and finish visual polish to comparable quality; functional gates alone do not establish completion. The approved scope and results remain tracked in `WerewolfAudit.md`.

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

The normal npm lint/build scripts use the cross-platform Node wrappers `scripts/sites-env.mjs` and `scripts/build-verified.mjs`; the latter enforces its build timeout in Node. Installation and the retained shell wrappers still require Bash. If a normal wrapper cannot run, execute equivalent local tools only as an explicitly reported diagnostic; do not claim the normal script passed.

When relevant, also verify the production Vite manifest, recursive import closures, catalog request isolation, game-line switching, current-schema round-trip, and browser smoke behavior. Distinguish known environmental or baseline errors from new regressions.

## Performance and Cloudflare Runtime

Preserve lazy loading, dynamic chunk separation, IndexedDB catalog caching, service-worker caching, local-first behavior, and static catalog delivery.

A user should not pay the JavaScript or data cost of an inactive game line. Evaluate recursive production-manifest closures and actual bundle sizes rather than optimizing for file count or request count alone.

The project must remain compatible with the existing Vinext/Vite Cloudflare deployment:

- no Node-only runtime dependencies in browser code;
- no runtime filesystem assumptions;
- no Worker APIs that are unavailable on Cloudflare;
- no opaque dynamic imports that Vite cannot analyze;
- `public/shared/**` and `public/game-lines/**` remain statically deployable;
- Worker code remains independent from browser UI and game-line surfaces.

Do not change Cloudflare bindings or configuration merely to silence local ambient TypeScript errors. Understand deployment impact first.

## Deferred Features

Specialized server-side PDF generation remains deferred. Mortal, Changeling, Mage, and Vampire support browser-owned print/PDF surfaces loaded lazily from their registrations. Werewolf does not advertise print support; its line-owned print/PDF/blank surface is deferred to a future goal, per the user's 2026-10-02 scope revision.

Homebrew activation is browser-local and shared by source/item ID. The common Homebrew shell owns navigation, activation preferences, and lazy line dispatch; the shared data-transfer panel owns local import/export of player-created definitions and activation preferences. Each game line owns its Homebrew inventory, validation, and integration with its catalogs; generic Merit storage and editing remain a shared Core mechanism. Core and each line support player-created Merits. Mage also owns player-created Spells and Legacies; Vampire owns player-created Clans, Bloodlines, Covenants, Disciplines, Devotions, Blood Sorcery powers, Coils, and Scales; Changeling owns player-created Seemings, Kiths, Courts, Contracts, and Entitlements. Their definitions are stored separately from character sheets and merged into the relevant surfaces without mutating static catalog snapshots.

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
