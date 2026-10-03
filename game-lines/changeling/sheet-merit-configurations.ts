import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { commonExpandedConfigurationLines, configuredDefinitionLines, decodeConfiguredRows } from "@/app/workspace/merit-configuration-presentation";
import type { CourtDefinition } from "@/lib/changeling-courts";
import { meritConfigurationTitle as coreMeritConfigurationTitle, normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { HEDGE_DUELIST_VARIANTS } from "./hedge-duelist-variants";
import { translate, type Locale } from "@/lib/i18n";
import { CHANGELING_MERIT_CONFIGURATIONS, isChangelingInlineMeritConfiguration } from "./builder-merit-configurations";
import { synchronizeChangelingBuilderMeritGrants } from "./builder-merit-grants";
import meritOptions from "./catalog-data/merit-options.json";
import type { TokenDefinition } from "./catalogs/tokens";
import { configuredTokenPresentation, type TokenConfigurationItem } from "./token-presentation";
import type { MeritDefinition } from "@/lib/merits";

export type TokenKind = "token" | "trifle" | "bauble";
export type { TokenConfigurationItem } from "./token-presentation";
type HedgespunBenefit = "extraordinary" | "alacrity" | "durability";

export const CHANGELING_SHEET_MERIT_CONFIGURATIONS = [
  ...COMMON_MERIT_CONFIGURATIONS,
  ...CHANGELING_MERIT_CONFIGURATIONS,
];

export const findMeritConfiguration = (definitionId: string | undefined) =>
  CHANGELING_SHEET_MERIT_CONFIGURATIONS.find((item) => item.id === definitionId);

export const isInlineMeritConfiguration = (id: string) =>
  isCommonInlineMeritConfiguration(id) || isChangelingInlineMeritConfiguration(id);

function courtDisplayName(catalog: readonly CourtDefinition[], value: unknown, locale: Locale) {
  const raw = String(value ?? "");
  if (["sem corte", "courtless"].includes(raw.trim().toLocaleLowerCase())) return translate(locale, "ui.courtless");
  const normalized = raw.toLocaleLowerCase();
  const definition = catalog.find((item) =>
    [item.id, item.name, item.translatedName, item.name.replace(/ Court$/, "")].some((candidate) => candidate.toLocaleLowerCase() === normalized),
  );
  return definition ? (locale === "en-US" ? definition.name : definition.translatedName) : raw;
}

export function meritConfigurationTitle(value: unknown, locale: Locale = "en-US", courtCatalog: readonly CourtDefinition[] = []) {
  const configuration = normalizeMeritConfiguration(value);
  if (typeof configuration.court === "string" && configuration.court.trim()) {
    return courtDisplayName(courtCatalog, configuration.court, locale);
  }
  return coreMeritConfigurationTitle(value);
}

function decodeHedgespunConfiguration(configuration: MeritConfiguration) {
  const benefits = (Array.isArray(configuration.benefits) ? configuration.benefits : []).map(
    (item): HedgespunBenefit | "" => ["extraordinary", "alacrity", "durability"].includes(item)
      ? item as HedgespunBenefit
      : "",
  );
  return {
    name: String(configuration.name ?? ""),
    description: String(configuration.description ?? ""),
    extraordinaryDetail: String(configuration.extraordinary_detail ?? ""),
    benefits,
  };
}

export function expandedConfigurationLines(definitionId: string | undefined, dots: number, value: unknown, locale: Locale = "en-US", courtCatalog: readonly CourtDefinition[] = [], tokenCatalog: readonly TokenDefinition[] = [], catalog: readonly MeritDefinition[] = []) {
  const configuration = normalizeMeritConfiguration(value);
  if (definitionId === "ctl-2ed:token") {
    const items = decodeConfiguredRows<TokenConfigurationItem>(configuration.items);
    const lines: string[] = [];
    for (const [index, stored] of items.entries()) {
      const item = configuredTokenPresentation(stored, tokenCatalog, locale);
      const kind = item.kind ?? "token";
      const kindLabel = kind === "trifle" ? translate(locale, "ui.trifleBatch") : kind === "bauble" ? translate(locale, "ui.bauble") : translate(locale, "ui.token");
      const title = item.name.trim() || `${kindLabel} ${index + 1}`;
      const rating = Math.max(1, item.rating);
      if (kind === "trifle") lines.push(`${title} (3): ${translate(locale, "ui.effect")}: ${item.effect || "—"}`);
      else if (kind === "bauble") lines.push(`${title} (${"•".repeat(rating)}): ${translate(locale, "ui.description")}: ${item.description || "—"}; ${translate(locale, "ui.crux")}: ${item.crux || "—"}; ${translate(locale, "ui.catch")}: ${item.catch || "—"}`);
      else lines.push(`${title} (${"•".repeat(rating)}): ${translate(locale, "ui.cost")}: ${item.cost || "—"}; ${translate(locale, "ui.effect")}: ${item.effect || "—"}; ${translate(locale, "ui.catch")}: ${item.catch || "—"}; ${translate(locale, "ui.drawback")}: ${item.drawback || "—"}`);
    }
    const allocated = items.reduce((sum, item) => sum + item.rating, 0);
    if (allocated !== dots) lines.push(`${translate(locale, "ui.unallocatedDots")}: ${Math.max(0, dots - allocated)}`);
    return lines;
  }
  if (definitionId === "ctl-2ed:hedgespun-item") {
    const item = decodeHedgespunConfiguration(configuration);
    const lines: string[] = [];
    const selectedBenefits = item.benefits.slice(0, Math.max(0, dots));
    if (item.name.trim()) lines.push(`${translate(locale, "ui.item")}: ${item.name}`);
    if (item.description.trim()) lines.push(`${translate(locale, "ui.maskAndMien")}: ${item.description}`);
    const benefits = [
      ["extraordinary", translate(locale, "ui.extraordinaryEquipment"), item.extraordinaryDetail],
      ["alacrity", translate(locale, "ui.improvedAlacrity"), translate(locale, "ui.hedgespunAlacrityDetail")],
      ["durability", translate(locale, "ui.increasedDurability"), translate(locale, "ui.hedgespunDurabilityDetail")],
    ] as const;
    for (const [key, label, detail] of benefits) {
      const count = selectedBenefits.filter((benefit) => benefit === key).length;
      if (count) lines.push(`${label} ×${count}: ${detail}`);
    }
    const drawback = translate(locale, "ui.extraordinaryEquipmentDrawback");
    lines.push(`${translate(locale, "ui.drawback")}: ${drawback}`);
    return lines;
  }
  if (definitionId === "ctl-2ed:hollow" || definitionId === "ctl-hedge:shared-bastion") {
    const lines: string[] = [];
    const configuredName = String(configuration.name ?? "").trim();
    const location = String(configuration.location ?? "").trim();
    const features = Array.isArray(configuration.features) ? configuration.features : [];
    if (configuredName) lines.push(`${translate(locale, "ui.name")}: ${configuredName}`);
    if (location) lines.push(`${translate(locale, "ui.locationAndAppearance")}: ${location}`);
    const options = definitionId === "ctl-2ed:hollow" ? meritOptions.hollowOptions : meritOptions.sharedBastionOptions;
    if (features.length) lines.push(`${translate(locale, "ui.features")}: ${features.map((item) => {
      const canonical = String(item).split("|")[0];
      const option = options.find((entry) => entry.name === canonical);
      return option ? translate(locale, option.nameKey) : canonical;
    }).join(", ")}`);
    return lines;
  }
  if (definitionId === "ctl-2ed:stable-trod") {
    const lines: string[] = [];
    const configuredName = String(configuration.name ?? "").trim();
    const enhancement = String(configuration.enhancement ?? "").trim();
    if (configuredName) lines.push(`${translate(locale, "ui.trod")}: ${configuredName}`);
    const option = meritOptions.hollowOptions.find((entry) => entry.name === enhancement);
    if (enhancement) lines.push(`${translate(locale, "ui.sharedHollowEnhancement")}: ${option ? translate(locale, option.nameKey) : enhancement}`);
    return lines;
  }
  if (definitionId === "ctl-2ed:workshop") {
    const specialties = Array.isArray(configuration.specialties) ? configuration.specialties.filter(Boolean) : [];
    return specialties.length ? [`${translate(locale, "ui.craftSpecialties")}: ${specialties.join(", ")}`] : [];
  }
  if (definitionId === "ctl-2ed:court-goodwill") {
    const court = courtDisplayName(courtCatalog, configuration.court, locale) || translate(locale, "ui.notSelected");
    const mantle = Math.max(0, dots - 2);
    return [
      translate(locale, "ui.courtGoodwillCourt", { court }),
      translate(locale, "ui.courtGoodwillAllies", { dots }),
      translate(locale, "ui.courtGoodwillMantle", { mantle }),
      translate(locale, "ui.courtGoodwillMentor"),
    ];
  }
  if (definitionId === "ctl-2ed:hedge-duelist") {
    const selected = String(configuration.firstManeuver ?? "");
    const variant = HEDGE_DUELIST_VARIANTS.find((item) => item.label === selected);
    return variant ? [`${translate(locale, `ui.hedgeDuelist.${variant.value}.choice`)}: ${translate(locale, `ui.hedgeDuelist.${variant.value}.description`)}`] : [];
  }
  return commonExpandedConfigurationLines(definitionId, dots, value, locale, catalog)
    ?? configuredDefinitionLines(findMeritConfiguration(definitionId), dots, value, locale);
}

export { decodeConfiguredRows, normalizeMeritConfiguration };
export const synchronizeMeritGrants = synchronizeChangelingBuilderMeritGrants;
