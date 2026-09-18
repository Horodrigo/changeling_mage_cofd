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
];

const VAMPIRE_INLINE_CONFIGURATIONS = new Set([
  "Kindred Status",
  "Haven",
  "Herd",
]);

export function isVampireInlineMeritConfiguration(name: string) {
  return (
    isCommonInlineMeritConfiguration(name) ||
    VAMPIRE_INLINE_CONFIGURATIONS.has(name)
  );
}