import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { commonExpandedConfigurationLines, configuredDefinitionLines } from "@/app/workspace/merit-configuration-presentation";
import { meritConfigurationTitle, normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { Locale } from "@/lib/i18n";
import { MAGE_MERIT_CONFIGURATIONS } from "./merit-configurations";
import { synchronizeMageBuilderMeritGrants } from "./builder-merit-grants";

export const MAGE_SHEET_MERIT_CONFIGURATIONS = [
  ...COMMON_MERIT_CONFIGURATIONS,
  ...MAGE_MERIT_CONFIGURATIONS,
];

export const findMeritConfiguration = (name: string) =>
  MAGE_SHEET_MERIT_CONFIGURATIONS.find((item) => item.name === name);

export const isInlineMeritConfiguration = (name: string) =>
  isCommonInlineMeritConfiguration(name) || Boolean(
    MAGE_MERIT_CONFIGURATIONS.find((item) =>
      item.name === name && item.fields.length === 1 && item.fields[0].kind === "text"),
  );

export function expandedConfigurationLines(name: string, dots: number, value: unknown, locale: Locale = "en-US") {
  const mageDefinition = MAGE_MERIT_CONFIGURATIONS.find((item) => item.name === name);
  if (mageDefinition) {
    const lines = configuredDefinitionLines(mageDefinition, dots, value);
    if (name === "Artifact") lines.push(`Mana capacity: ${dots * 2}`, `Effective Gnosis: ${Math.ceil(dots / 2)}`);
    if (name === "Mana Battery") lines.push(`Mana capacity: ${dots * 2}`);
    if (name === "Familiar" || name === "Supernal Watcher") lines.push(`Rank: ${dots / 2}`);
    return lines;
  }
  return commonExpandedConfigurationLines(name, dots, value, locale) ?? [];
}

export { meritConfigurationTitle, normalizeMeritConfiguration };
export const synchronizeMeritGrants = synchronizeMageBuilderMeritGrants;
