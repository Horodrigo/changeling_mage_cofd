import {
  COMMON_MERIT_CONFIGURATIONS,
  isCommonInlineMeritConfiguration,
} from "@/app/builder/common-merit-configurations";

import type { MeritConfigDefinition } from "@/lib/core/character/merit-configuration";

export const VAMPIRE_MERIT_CONFIGURATIONS: readonly MeritConfigDefinition[] = [
  ...COMMON_MERIT_CONFIGURATIONS,

  {
    name: "Kindred Status",
    line: "VtR",
    fields: [
      {
        key: "group",
        label: "Clan, Covenant or city",
        kind: "text",
        placeholder: "Circle of the Crone, Daeva, London…",
      },
    ],
  },

  {
    name: "Haven",
    line: "VtR",
    fields: [
      {
        key: "place",
        label: "Haven",
        kind: "text",
      },
    ],
  },

  {
    name: "Herd",
    line: "VtR",
    fields: [
      {
        key: "description",
        label: "Herd",
        kind: "text",
      },
    ],
  },

  {
    name: "Retainer(Ghoul)",
    line: "VtR",
    fields: [
      { key: "name", label: "Ghoul name", kind: "text" },
      { key: "purview", label: "Area of expertise", kind: "text" },
      { key: "discipline_1", label: "First dot from the regnant's Disciplines", kind: "text", minDots: 1 },
      { key: "discipline_2", label: "Second dot from the regnant's Disciplines", kind: "text", minDots: 3 },
      { key: "discipline_3", label: "Third dot from the regnant's Disciplines", kind: "text", minDots: 5 },
    ],
  },

  { name: "Practiced Puppeteer", line: "VtR", fields: [{ key: "discipline", label: "Chosen Discipline", kind: "text" }] },
  { name: "Friends in Low Places", line: "VtR", fields: [{ key: "group", label: "Group", kind: "text" }] },
  { name: "Hiding Place", line: "VtR", fields: [{ key: "place", label: "Place", kind: "text" }] },
  { name: "Contract with the Uncanny", line: "VtR", fields: [{ key: "faction", label: "Supernatural faction or force", kind: "text" }] },
  { name: "The Three Heads of Kerberos", line: "VtR", fields: [{ key: "aspect", label: "Aspect of the Beast", kind: "select", options: ["Competitive", "Monstrous", "Seductive"].map((value) => ({ value, label: value })) }] },
];

const VAMPIRE_INLINE_CONFIGURATIONS = new Set([
  "Kindred Status",
  "Haven",
  "Herd",
  "Practiced Puppeteer",
  "Friends in Low Places",
  "Hiding Place",
  "Contract with the Uncanny",
  "The Three Heads of Kerberos",
]);

export function isVampireInlineMeritConfiguration(name: string) {
  return (
    isCommonInlineMeritConfiguration(name) ||
    VAMPIRE_INLINE_CONFIGURATIONS.has(name)
  );
}
