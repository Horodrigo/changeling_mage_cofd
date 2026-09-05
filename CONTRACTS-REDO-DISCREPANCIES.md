# Contracts redo - official-source discrepancy audit

## Method

- The offline Codex of Darkness index is canonical for Contract name, classification, category, cost notation, dice pool, source, and page.
- The supplied PDF indicated by the index is used for every remaining field.
- PDF pages with ambiguous extraction were visually inspected in their original two-column layout.
- The deleted legacy catalog was not accepted as a source of truth.
- Homebrew books are outside this audit pass.

## Indexed official coverage

The offline index contains **173 official Contracts** from the supplied sources:

| Index source | Contracts | Supplied PDF | Result |
| --- | ---: | --- | --- |
| CTL 2e | 110 | Changeling the Lost | All titles accounted for |
| K&K | 59 | Kith and Kin | All entries accounted for, with one title discrepancy |
| Hedge | 2 | The Hedge | Both entries accounted for, with page discrepancies |
| DE2 | 2 | Dark Eras Changeling | Both entries accounted for, but source and page refer to the original collection |

## Resolved discrepancies

### 1. Oak, Ash, and Thorn is absent from the offline index

The supplied official PDF contains seven genuine Contracts that the index does not list:

| PDF title | Type | Printed page |
| --- | --- | ---: |
| Donning the Grand Mantle | Royal | 22 |
| Hidden Protocol | Common | 24 |
| Autonomous Payload | Royal | 24 |
| Full Fathom Five | Common | 27 |
| The Widening Gyre | Royal | 27 |
| Upholding the Principle | Common | 29 |
| Ancestors' Wisdom | Royal | 29 |

The user confirmed all seven as official and authorized direct PDF extraction. Their Court assignments are All, Crystal Web, Crown-of-Thorns, and House of In as recorded in the import specification.

### 2. Kith and Kin title mismatch

- Offline index: **Listen With Wind's Ears**, K&K p. 61.
- PDF heading: **Listen with the Wind's Ears**, p. 61.

The PDF includes the extra word **the**.

### 3. Kith and Kin page mismatches

- **Golden Promise**: offline index says p. 38; the PDF table of contents and Contract section place it on p. 42.
- **Witch's Brambles**: offline index says p. 55; the PDF table of contents and Contract heading place it on p. 58.

The other automatically flagged Kith and Kin entries were extraction artifacts or multi-page Contracts, not confirmed index errors.

### 4. The Hedge page mismatches

- **Distill the Hidden**: offline index says p. 83; the PDF Contract begins and ends on p. 81.
- **Wyrd Debt**: offline index says p. 84; the PDF Contract begins on p. 81 and continues through p. 82.

### 5. Dark Eras source and page mismatch

The offline index identifies both Contracts of Retaliation as DE2 p. 387. In the supplied compilation:

- the source should be **DE:CtL**;
- **Draw Likeness** and **Peacemaker's Draw** are both on printed p. 241.

## Approved resolution

1. Keep the offline index's cost notation and dice pools for the 173 indexed Contracts.
2. Use the corrected PDF titles/pages above when locating and presenting the records.
3. Label the Retaliation Contracts as DE:CtL p. 241.
4. Treat the seven Oak, Ash, and Thorn Contracts as an explicit exception and take name, type, cost, and dice pool directly from that PDF.
5. Do not import any homebrew Contracts in this pass.

## Pending decisions

### Witch's Brambles — resolved during import

| Field | Offline index | PDF |
| --- | --- | --- |
| Page | 55 | 58 |
| Cost | `●●/●●●+○` | 2–3 Glamour + 1 Willpower |
| Dice Pool | Presence + Occult + Wyrd vs. Resolve + Tolerance | None |
| Action / Duration | — | Reflexive / Instant |

The user supplied and approved the complete PDF text. The imported record uses page 58, cost `●●○/●●●○`, no Dice Pool, Reflexive, Instant.

### Cracked Mirror — Kith and Kin

| Field | Offline index | PDF |
| --- | --- | --- |
| Dice Pool | Attribute + Ability + Wyrd vs. Resistance + Tolerance | Manipulation + Larceny + Wyrd vs. Stamina + Wyrd |

The index appears to have replaced the specific traits with generic categories.

### Momentary Respite — Kith and Kin

| Field | Offline index | PDF |
| --- | --- | --- |
| Initial cost | `●` | 2 Glamour |
| Extension | `● + ○` per additional scene | 1 Willpower per additional scene |

The PDF is internally inconsistent: its Cost block says 2 Glamour, while Success begins “For 1 Glamour.” Extending the Contract clearly costs only 1 Willpower per scene.

### Star Light, Star Bright — resolved during import

The index summary contains Enchanted Bargain, teleportation, Willpower recovery, and Beat recovery absent from pp. 51–52. Its effect was reconstructed from the PDF; the indexed name, cost, and lack of Dice Pool were retained.

## Import status

The official catalog target is **180 Contracts**: 173 indexed records plus the seven confirmed Oak, Ash, and Thorn records. The rebuilt catalog currently contains **68** audited records. Kith and Kin is at 57/59, pending Cracked Mirror and Momentary Respite.
