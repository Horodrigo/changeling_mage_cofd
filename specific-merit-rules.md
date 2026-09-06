# Special Merit Rules

This document records exceptional behavior that must survive the clean reimport of Merits. It is intentionally separate from the catalog so each rule can be audited before implementation.

## Catalog policy

- English is the canonical stored language. Names, prerequisites, mechanical summaries, maneuver names, and maneuver effects must be transcribed or summarized directly from the English source books.
- Portuguese is a presentation translation added only after the English catalog has been verified.
- The offline Codex of Darkness pages are an index, not the final rules authority. They provide the candidate list, rating, source, and page. The corresponding PDF is authoritative for mechanics.
- Any non-supernatural Universal Merit is available to Changeling when its cited book is an approved project source, even if that book is not Chronicles of Darkness or Changeling. For example, Advanced Library from Mage the Awakening is eligible.
- Homebrew Merits are outside the initial official reimport.
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
- The exact repeatable set must still be audited from the source rules during import; do not inherit the former hard-coded set without verification.

### Per-dot benefits and Styles

- Store every maneuver or level benefit at its actual purchased rating; ratings may be discontinuous (for example •, •••, •••••).
- The sheet shows only benefits unlocked at or below the owned rating.
- A checkbox/flag for level benefits is a Homebrew authoring concern; official catalog data should explicitly contain its level records.

### Creation-only restrictions

- For Changeling, every Merit may be acquired after character creation with Experience, regardless of a source note such as `Character creation only`.
- Mantle is the sole exception and follows its special acquisition rule above.

## Structured configurations to verify from the books

The former implementation had custom behavior for the following Merits. Each must be re-read before its schema is restored:

- Allies, Contacts, Status, Staff, Mentor, Retainer, Safe Place, Resources, Language, Library, and Alternate Identity.
- Professional Training.
- Mystery Cult Initiation and Mystery Cult Influence.
- Hollow and Warded Dreams.
- Striking Looks and other single-subject free-text Merits.
- Court Goodwill, Mantle, Token, Touchstone, and Fae Mount.

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
- DE2 will be added as a project source later. Other potentially universal DE2 Merits should only be reconsidered once that source is available.

## Eligibility and prerequisites

- Catalog membership and purchase eligibility are separate concerns. A valid Merit remains in the canonical catalog even when the current character cannot meet its prerequisites.
- Lucid Dreamer must be imported with the book prerequisite `Non-changeling, Resolve •••` even though the site omitted it.
- The future prerequisite-validation mechanism must prevent a Changeling from selecting or purchasing Lucid Dreamer, while leaving the catalog record available to eligible characters.
