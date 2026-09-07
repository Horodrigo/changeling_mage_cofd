# Special Merit Rules

This document records exceptional behavior that must survive the clean reimport of Merits. It is intentionally separate from the catalog so each rule can be audited before implementation.

## Catalog policy

- English is the canonical stored language. Names, prerequisites, mechanical summaries, maneuver names, and maneuver effects must be transcribed or summarized directly from the English source books.
- Portuguese is a presentation translation added only after the English catalog has been verified.
- The offline Codex of Darkness pages are an index, not the final rules authority. They provide the candidate list, rating, source, and page. The corresponding PDF is authoritative for mechanics.
- Any non-supernatural Universal Merit is available to Changeling when its cited book is an approved project source, even if that book is not Chronicles of Darkness or Changeling. For example, Advanced Library from Mage the Awakening is eligible.
- Entitlement Merits are outside the current reimport, including all such Merits in Oak, Ash, and Thorn and Book of Courts.
- The approved bundled Book of Courts and Book of Seemings catalogs are imported in English from their source PDFs, but remain separately identifiable by source.
- A Merit with a description for each dot does not have to be a Fighting Style. Per-dot benefits are modeled independently from category.

## Purchase and character-creation rules

### Mantle

- Choosing a Court during Changeling creation determines whether the character possesses Mantle.
- Mantle must never appear as a new Merit purchase.
- An existing Mantle may only be incremented or decremented with Experience.
- Its Court is the character's selected Court; it is not free text.

### Court Goodwill

- Every instance must select an existing Court; never accept arbitrary free text.
- It is repeatable for different Courts.
- Court Goodwill 1 permits purchasing Common Clauses belonging to that selected Court when the character owns the underlying Court Contract.
- Court Goodwill 3 permits the same for Royal Clauses.

### Fae Mount

- Its configuration belongs exclusively in Companions and must not be duplicated under Expanded Merits or Merit Choices.
- It stores its name, selected abilities, Hedgefoot mode, own general and ballistic armor, and Health damage in the character JSON.
- Available selected abilities equal its Merit dots.
- The complete mount sheet, derived changes from abilities, attack changes from Thornbeast, armor precedence, and Special text are part of its implementation.
- Armorshell supplies Armor 3/2 and partial concealment to the rider. Worn/custom armor does not stack; use the higher General and Ballistic values independently.

### Single free-text choices

- If a Merit requires exactly one free-text value, edit that value inline on the Merit row, using a single underlined input such as `Striking Looks: [description]`.
- Do not show `Merit Choices` or an expandable `Learn more` panel for this case.
- Merits with multiple fields, such as Mentor, retain a separate structured configuration panel.

### Repeatable instances

- Merits representing distinct subjects or assets may have multiple independent instances. Each instance needs a stable ID, its own subject, rating, and configuration.
- Example: `Allies: Police` and `Allies: Media` are separate rows and may coexist.
- When spending Experience on a repeatable Merit, list every owned instance separately as an upgrade target and also offer a `New Allies` option. A new instance begins without a subject so the player can specify it.
- Refunds must identify the exact instance by stable ID and remove or decrement only that instance.
- Continue auditing the remaining source-defined repeatable Merits during import; do not infer repeatability merely because a Merit names a subject.
- Acquired Taste is explicitly repeatable; each instance records a different sapient supernatural kind.
- Confirmed independent instances include Fae Mount, Mentor, Retainer, Safe Place, and Token. Each Token instance represents a distinct Token.
- Striking Looks is repeatable; each distinct appearance is an independent one- or two-dot instance with its own inline description.
- Contacts and Staff are single aggregate Merits rather than repeatable rows. They have no five-dot ceiling: every Contacts dot records another group or field, and every Staff dot records another Skill represented among the employees.
- Touchstone is a single aggregate Merit following its published ratings; each dot records one additional Touchstone.

### Per-dot benefits and Styles

- Store every maneuver or level benefit at its actual purchased rating; ratings may be discontinuous (for example •, •••, •••••).
- The sheet shows only benefits unlocked at or below the owned rating.
- A checkbox/flag for level benefits is a Homebrew authoring concern; official catalog data should explicitly contain its level records.

### Creation-only restrictions

- For Changeling, every Merit may be acquired after character creation with Experience, regardless of a source note such as `Character creation only`.
- Mantle is the sole exception and follows its special acquisition rule above.

## Structured configurations

Only rules-mandated choices are restored. The following configurations have been confirmed and implemented:

- Subject/asset choices for Allies, Alternate Identity, Language, Library, Safe Place, Status, Striking Looks, Token, Mentor, Retainer, Contacts, Staff, and Touchstone.
- The selected Court for Court Goodwill and the creation-derived Court for Mantle.
- The complete Fae Mount configuration in Companions.
- Professional Training's profession, Contacts, Asset Skills, Specialties, and fourth-dot Skill increase. Its mechanical grants are synchronized with the sheet and removed when no longer unlocked.
- Mystery Cult Initiation's benefit at each purchased dot. Granted Specialties, Skills, and Merits are synchronized with the sheet and removed when no longer unlocked.
- Warded Dreams' Bastion description and Fortification reminder.
- The rules-mandated choices for Area of Expertise, Defensive Combat, Fighting Finesse, Multilingual, Quick Draw, and Unseen Sense.

- Hollow is restored from Changeling: The Lost with its rating-budgeted enhancements.
- Mystery Cult Influence is restored as the three-to-five-dot influence variant of Mystery Cult Initiation and uses the same deterministic grant editor without ordinary membership responsibilities.
- Fae Pet records only the name of its chosen Dread Power. A Dread Power catalog or subsystem is explicitly outside this rebuild.
- Seasonal Court Merits persist their rules-mandated subject choices: group, desire, wrath, supernatural kind, fear, sorrow, or the entity and favor owed, as applicable.

## Confirmed display fields

Every official Merit record must present exactly these primary-labeled core fields:

- Name
- Rating
- Prerequisite
- Description
- Source

Additional structured controls are allowed only where a specific Merit rule requires the player to make or persist a choice.

## Confirmed source decisions

- Gunslinger retains the offline index citation `DE2 377`.
- Oath: Blood Liege retains the offline Changeling Merit index citation `DE2 107`.
- `HL`, `DE`, `DE2`, and `DEC` are approved source codes from this point forward. A later audit will revisit earlier catalogs; the current batch must not retroactively restart completed work.
- Kith and Kin contributes Dramaturge (p. 69) and Understudy (p. 69).
- Oak, Ash, and Thorn contributes no ordinary Merits in this batch; its Entitlement Merits are deferred.

### Seasonal Court Merits (Book of Courts pp. 63–69)

- Import only ordinary Seasonal Court Merits, never Entitlement Merits.
- Group every imported Seasonal Court Merit under the single display category `Changeling Courts`; retain the specific Court only in eligibility metadata and prerequisites.
- Unless a Merit states a stricter prerequisite, it requires either Mantle • for its named Seasonal Court or Court Goodwill ••• for that same Court.
- A higher explicitly printed Mantle prerequisite replaces Mantle •, while Court Goodwill ••• remains the alternate way for an outsider to qualify unless the Merit expressly says otherwise.
- Court prerequisites must use an existing-Court selector and canonical Court IDs rather than free text.

### Seeming Merits (Book of Seemings pp. 92–101)

- Group every Merit from this section under the single display category `Changeling Seemings`; retain the specific Seeming in eligibility metadata and prerequisites.
- Preserve each printed Seeming restriction and every printed alternate prerequisite; do not infer that every Merit is exclusive merely because it appears under a Seeming heading.
- Hedge Duelist is Changeling-only. Book of Seemings supplies alternative first-dot maneuvers plus fourth- and fifth-dot maneuvers to the base Merit; these are additions to one Merit, not separate standalone Merits.

## Eligibility and prerequisites

- Catalog membership and purchase eligibility are separate concerns. A valid Merit remains in the canonical catalog even when the current character cannot meet its prerequisites.
- Lucid Dreamer must be imported with the book prerequisite `Non-changeling, Resolve •••` even though the site omitted it.
- The prerequisite-validation mechanism prevents a Changeling from selecting or purchasing Lucid Dreamer while leaving the catalog record available to eligible characters. It also evaluates canonical Attributes, Skills, Wyrd, Size, Contracts, required or forbidden Merits, Seeming alternatives, and Seasonal Court Mantle/Court Goodwill access.
