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
        label: "ui.meritConfig.clanCovenantOrCity",
        kind: "text",
        placeholder: "ui.meritConfig.kindredStatusExample",
      },
    ],
  },

  {
    name: "Haven",
    line: "VtR",
    fields: [
      {
        key: "place",
        label: "ui.meritConfig.haven",
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
        label: "ui.meritConfig.herd",
        kind: "text",
      },
    ],
  },

  {
    name: "Retainer(Ghoul)",
    line: "VtR",
    fields: [
      { key: "name", label: "ui.meritConfig.ghoulName", kind: "text" },
      { key: "purview", label: "ui.meritConfig.areaOfExpertise", kind: "text" },
      { key: "discipline_1", label: "ui.meritConfig.firstRegnantDisciplineDot", kind: "text", minDots: 1 },
      { key: "discipline_2", label: "ui.meritConfig.secondRegnantDisciplineDot", kind: "text", minDots: 3 },
      { key: "discipline_3", label: "ui.meritConfig.thirdRegnantDisciplineDot", kind: "text", minDots: 5 },
    ],
  },

  { name: "Practiced Puppeteer", line: "VtR", fields: [{ key: "discipline", label: "ui.meritConfig.chosenDiscipline", kind: "text" }] },
  { name: "Friends in Low Places", line: "VtR", fields: [{ key: "group", label: "ui.meritConfig.group", kind: "text" }] },
  { name: "Hiding Place", line: "VtR", fields: [{ key: "place", label: "ui.meritConfig.place", kind: "text" }] },
  { name: "Contract with the Uncanny", line: "VtR", fields: [{ key: "faction", label: "ui.meritConfig.supernaturalFactionOrForce", kind: "text" }] },
  { name: "The Three Heads of Kerberos", line: "VtR", fields: [{ key: "aspect", label: "ui.meritConfig.aspectOfTheBeast", kind: "select", options: [{ value: "Competitive", label: "ui.meritConfig.competitive" }, { value: "Monstrous", label: "ui.meritConfig.monstrous" }, { value: "Seductive", label: "ui.meritConfig.seductive" }] }] },
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
