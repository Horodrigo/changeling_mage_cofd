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

The approved-source Tilt index lists 32 records after PDF reconciliation: 21 CofD, 5 Hurt Locker, 1 CtL, 2 Mage, and 3 Dark Eras. The offline index omits Burning, but Hurt Locker p. 143 presents it beside Bleeding, Pierced Armor, and Pinned, so the PDF controls.

Added or corrected from the PDF audit:

- Came Prepared — Hurt Locker p. 61.
- Bleeding, Burning, Pierced Armor, and Pinned — Hurt Locker p. 143.
- Flesh Too Solid — Changeling: The Lost p. 329.
- Nimbus — Mage: The Awakening p. 89.
- Poor Light — Mage: The Awakening p. 323.
- Shattered Time — Dark Eras p. 46.
- Urban Collapse — Dark Eras p. 573.
- Riot — Dark Eras p. 576; this official record supersedes the source attribution previously taken from the homebrew Book of Courts implementation.

## Remaining conversion work

- Replace the 63 generic English resolution placeholders in the Changeling-facing official catalog with source-specific Resolution and Beat summaries from the extracted PDF pages. The exported records and names are now English-first; the old Portuguese copy survives only as presentation metadata.
- Move Portuguese display strings into a separate optional presentation layer rather than storing them as canonical mechanics.
- Rebuild the 20 Portuguese-first Mage/Nameless records by the same model and verify the shared CofD/Hurt Locker selection. The four newly recovered DE/DEC records are already English-first.
- Add catalog-level tests for exact official counts, unique IDs, required fields, source/page reconciliation, and persistence through JSON import/export.
