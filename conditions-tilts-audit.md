# Official Conditions and Tilts Audit

## Scope and authority

- The offline Codex of Darkness pages are the completeness index.
- Approved official PDFs are the authority for mechanics, persistence, resolution, source, and printed page.
- Homebrew records from Book of Courts and Book of Seemings are outside the official completeness totals. Existing homebrew records are not evidence that an official source is covered.
- Canonical content is imported in English first. Portuguese presentation is a later editorial pass.

## Index reconciliation

The approved-source portion of the offline Condition index contains 87 records: 25 CofD, 20 CtL, 9 Kith and Kin, 9 Hurt Locker, 14 Mage, 6 Nameless and Accursed, 3 Dark Eras, and 1 Dark Eras Companion record. The old application catalog omitted all four Dark Eras/Dark Eras Companion records and used Portuguese-first storage with incomplete English overlays. In line-specific presentation, Changeling receives 63 official records (25 CofD + 9 HL + 20 CtL + 9 Kith), while Mage receives 58 (the 34 CofD/HL records + 24 Mage/NH/DE/DEC records).

Added from the PDF audit:

- The Sibyl's Tongue — Dark Eras p. 78.
- Monster and Unclean — Dark Eras p. 81.
- Unintended Medium — Dark Eras Companion p. 273.

The approved-source Tilt catalog contains 33 records after index and PDF reconciliation: 22 CofD, 5 Hurt Locker, 1 CtL, 2 Mage, and 3 Dark Eras. The offline index omits the Hurt Locker printing of Burning because its row cites an unapproved source, but Hurt Locker p. 143 presents it beside Bleeding, Pierced Armor, and Pinned, so the approved PDF controls. The index spells Drugged's source as `CoFD`; this was normalized to `CofD`. It also calls the p. 281 Tilt `Blind`, while the PDF heading and cross-references use `Blinded`; the PDF name controls. A line-by-line comparison recovered Zombies! (CofD p. 150), which the earlier count-only audit had missed. The index citations of p. 282 for Extreme Heat and Flooded supersede the previous incorrect p. 283 metadata.

Added or corrected from the PDF audit:

- Came Prepared — Hurt Locker p. 61.
- Bleeding, Burning, Pierced Armor, and Pinned — Hurt Locker p. 143.
- Flesh Too Solid — Changeling: The Lost p. 329.
- Nimbus — Mage: The Awakening p. 89.
- Poor Light — Mage: The Awakening p. 323.
- Shattered Time — Dark Eras p. 46.
- Urban Collapse — Dark Eras p. 573.
- Riot — Dark Eras p. 576; this official record supersedes the source attribution previously taken from the homebrew Book of Courts implementation.
- Zombies! — Chronicles of Darkness p. 150.

## Completed conversion and verification

- All 63 Changeling-facing official Conditions now have source-specific English Resolution text; applicable Beat rules are explicit. The previous generic Resolution and Beat fallbacks were removed.
- Canonical Changeling records are stored directly in English. The pre-existing Portuguese copy is isolated in presentation-only metadata and was not edited in this pass.
- All 20 previously Portuguese-first Mage/Nameless records were rebuilt in English from their approved PDFs. This changes only the shared Condition catalog, not the broader Mage rules system.
- Generated offline-index snapshots now lock every approved Condition and Tilt name/source/page triple. Tests also enforce exact per-source totals, unique IDs, English canonical names, required mechanics, removal of generic fallbacks, and JSON round-trip survival for selected Conditions and Tilts.

## Deliberate exclusions

- Book of Courts and Book of Seemings are homebrew and remain outside official completeness totals. Existing homebrew Conditions or Tilts are preserved but were not audited in this pass.
- Portuguese prose was not translated or editorially revised. Existing Changeling presentation copy remains available separately; newly rebuilt Mage-specific mechanics display their canonical English until a later translation pass.
