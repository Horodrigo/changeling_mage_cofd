# English-first Contract catalog specification

## Canonical sources

- The offline Codex of Darkness index is canonical for name, classification, Regalia or Court, source, page, cost, and invocation dice pool.
- The source and page from that index are used to locate the corresponding Contract in the supplied PDF.
- The PDF is canonical for summary context, action, duration, genuine options, effect or roll results, Loophole, and Benefits.
- The rebuilt catalog contains English source text only. Translation begins after the complete English catalog passes validation.

## Cost notation

- `●` means one point of Glamour (or Mana in Mage contexts).
- `○` means one point of Willpower.
- Alternatives, per-target costs, variable costs, and additional costs retain the notation used by the offline index.

## Rolled Contract shape

1. Name and classification (`Royal`, `Common`, or `Goblin`)
2. Regalia or Court and Source
3. Summary
4. Dice Pool
5. Cost
6. Action and Duration
7. Options, only when they are genuine choices not duplicated by the result text
8. Success
9. Exceptional Success
10. Failure
11. Dramatic Failure
12. Loophole
13. Benefits

## Automatic Contract shape

1. Name and classification (`Royal`, `Common`, or `Goblin`)
2. Regalia or Court and Source
3. Summary
4. Cost
5. Action and Duration
6. Options, only when they are genuine choices not duplicated by the effect text
7. Effect
8. Loophole
9. Benefits

## Defaults and exceptions

- When neither the stat block nor the effect specifies otherwise, Action defaults to `Instant` and Duration defaults to `One scene`.
- A Contract with an invocation roll normally receives all four roll-result fields.
- A Contract without an invocation roll receives only `Effect`.
- Exceptional formats are not inferred. Each newly encountered exception requires a user decision before import.

## Approved official exceptions

- The seven Contracts in *Oak, Ash, and Thorn* are official and must be included even though the offline index omits them.
- Their canonical Court assignments are: All (`Donning the Grand Mantle`), Crystal Web (`Hidden Protocol`, `Autonomous Payload`), Crown-of-Thorns (`Full Fathom Five`, `The Widening Gyre`), and House of In (`Upholding the Principle`, `Ancestors' Wisdom`).
- `Autonomous Payload` retains its invocation Dice Pool but uses only `Effect`, matching the book's presentation.
- `Hidden Protocol` retains its invocation Dice Pool but uses only `Effect`, matching the book's presentation.
- `Upholding the Principle` and `Ancestors' Wisdom` use `Loophole: None`, because the book supplies no Loophole.
- `Donning the Grand Mantle` preserves the book's explicit `Loophole: None`.
