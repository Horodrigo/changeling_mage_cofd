import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { commonExpandedConfigurationLines, configuredDefinitionLines } from "@/app/workspace/merit-configuration-presentation";
import { meritConfigurationTitle, normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { translate, type Locale } from "@/lib/i18n";
import { MAGE_MERIT_CONFIGURATIONS } from "./merit-configurations";
import { synchronizeMageBuilderMeritGrants } from "./builder-merit-grants";
import type { MeritDefinition } from "@/lib/merits";

export const MAGE_SHEET_MERIT_CONFIGURATIONS = [
  ...COMMON_MERIT_CONFIGURATIONS,
  ...MAGE_MERIT_CONFIGURATIONS,
];

export const findMeritConfiguration = (definitionId: string | undefined) =>
  MAGE_SHEET_MERIT_CONFIGURATIONS.find((item) => item.id === definitionId);

export const isInlineMeritConfiguration = (id: string) =>
  isCommonInlineMeritConfiguration(id) || Boolean(
    MAGE_MERIT_CONFIGURATIONS.find((item) =>
      item.id === id && item.fields.length === 1 && item.fields[0].kind === "text"),
  );

export function expandedConfigurationLines(definitionId: string | undefined, dots: number, value: unknown, locale: Locale = "en-US", catalog: readonly MeritDefinition[] = []) {
  const mageDefinition = MAGE_MERIT_CONFIGURATIONS.find((item) => item.id === definitionId);
  if (mageDefinition) {
    const lines = configuredDefinitionLines(mageDefinition, dots, value, locale);
    if (definitionId === "mta-2ed:artifact" || definitionId === "mta-signs:mana-battery") lines.push(translate(locale, "ui.meritConfig.manaCapacitySummary", { capacity: dots * 2 }));
    if (definitionId === "mta-2ed:artifact") lines.push(translate(locale, "ui.meritConfig.effectiveGnosisSummary", { gnosis: Math.ceil(dots / 2) }));
    if (definitionId === "mta-2ed:familiar" || definitionId === "mta-signs:supernal-watcher") lines.push(translate(locale, "ui.meritConfig.rankSummary", { rank: dots / 2 }));
    return lines;
  }
  return commonExpandedConfigurationLines(definitionId === "mta-2ed:mystery-cult-influence" ? "core-2ed:mystery-cult-influence" : definitionId, dots, value, locale, catalog)
    ?? configuredDefinitionLines(findMeritConfiguration(definitionId), dots, value, locale);
}

export { meritConfigurationTitle, normalizeMeritConfiguration };
export const synchronizeMeritGrants = synchronizeMageBuilderMeritGrants;
