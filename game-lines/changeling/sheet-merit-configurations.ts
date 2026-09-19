import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { commonExpandedConfigurationLines, decodeConfiguredRows } from "@/app/workspace/merit-configuration-presentation";
import type { CourtDefinition } from "@/lib/changeling-courts";
import { meritConfigurationTitle as coreMeritConfigurationTitle, normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { HEDGE_DUELIST_VARIANTS } from "./hedge-duelist-variants";
import { translate, type Locale } from "@/lib/i18n";
import { CHANGELING_MERIT_CONFIGURATIONS, isChangelingInlineMeritConfiguration } from "./builder-merit-configurations";
import { synchronizeChangelingBuilderMeritGrants } from "./builder-merit-grants";

export type TokenKind = "token" | "trifle" | "bauble";
export type TokenConfigurationItem = { id: string; kind: TokenKind; name: string; rating: number; cost: string; effect: string; description: string; crux: string; catch: string; drawback: string };
type HedgespunBenefit = "extraordinary" | "alacrity" | "durability";

export const CHANGELING_SHEET_MERIT_CONFIGURATIONS = [
  ...COMMON_MERIT_CONFIGURATIONS,
  ...CHANGELING_MERIT_CONFIGURATIONS,
];

export const findMeritConfiguration = (name: string) =>
  CHANGELING_SHEET_MERIT_CONFIGURATIONS.find((item) => item.name === name);

export const isInlineMeritConfiguration = (name: string) =>
  isCommonInlineMeritConfiguration(name) || isChangelingInlineMeritConfiguration(name);

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

export function expandedConfigurationLines(name: string, dots: number, value: unknown, locale: Locale = "en-US", courtCatalog: readonly CourtDefinition[] = []) {
  const configuration = normalizeMeritConfiguration(value);
  if (name === "Token") {
    const items = decodeConfiguredRows<TokenConfigurationItem>(configuration.items);
    const lines: string[] = [];
    for (const [index, item] of items.entries()) {
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
  if (name === "Hedgespun Item") {
    const item = decodeHedgespunConfiguration(configuration);
    const lines: string[] = [];
    const selectedBenefits = item.benefits.slice(0, Math.max(0, dots));
    if (item.name.trim()) lines.push(`${translate(locale, "ui.item")}: ${item.name}`);
    if (item.description.trim()) lines.push(`${translate(locale, "ui.maskAndMien")}: ${item.description}`);
    const benefits = [
      ["extraordinary", translate(locale, "ui.extraordinaryEquipment"), item.extraordinaryDetail],
      ["alacrity", translate(locale, "ui.improvedAlacrity"), "+2 Initiative and Speed"],
      ["durability", translate(locale, "ui.increasedDurability"), "+1 Durability"],
    ] as const;
    for (const [key, label, detail] of benefits) {
      const count = selectedBenefits.filter((benefit) => benefit === key).length;
      if (count) lines.push(`${label} ×${count}: ${detail}`);
    }
    const drawback = translate(locale, "ui.extraordinaryEquipmentDrawback");
    lines.push(`${translate(locale, "ui.drawback")}: ${drawback}`);
    return lines;
  }
  if (name === "Hollow" || name === "Shared Bastion") {
    const lines: string[] = [];
    const configuredName = String(configuration.name ?? "").trim();
    const location = String(configuration.location ?? "").trim();
    const features = Array.isArray(configuration.features) ? configuration.features : [];
    if (configuredName) lines.push(`${translate(locale, "ui.name")}: ${configuredName}`);
    if (location) lines.push(`${translate(locale, "ui.locationAndAppearance")}: ${location}`);
    if (features.length) lines.push(`${translate(locale, "ui.features")}: ${features.map((item) => String(item).split("|")[0]).join(", ")}`);
    return lines;
  }
  if (name === "Stable Trod") {
    const lines: string[] = [];
    const configuredName = String(configuration.name ?? "").trim();
    const enhancement = String(configuration.enhancement ?? "").trim();
    if (configuredName) lines.push(`${translate(locale, "ui.trod")}: ${configuredName}`);
    if (enhancement) lines.push(`${translate(locale, "ui.sharedHollowEnhancement")}: ${enhancement}`);
    return lines;
  }
  if (name === "Workshop") {
    const specialties = Array.isArray(configuration.specialties) ? configuration.specialties.filter(Boolean) : [];
    return specialties.length ? [`${translate(locale, "ui.craftSpecialties")}: ${specialties.join(", ")}`] : [];
  }
  if (name === "Court Goodwill") {
    const court = courtDisplayName(courtCatalog, configuration.court, locale) || (locale === "en-US" ? "Not selected" : "Não selecionada");
    const mantle = Math.max(0, dots - 2);
    return locale === "en-US" ? [
      `Court: ${court}.`,
      `Allies: functions as Allies ${dots} within that Court.`,
      `Mantle equivalence: ${mantle}; Court Goodwill can satisfy only Mantle prerequisites from 1 to 3.`,
      "Mentor: functions as Mentor 1 through the Court contact.",
    ] : [
      `Corte: ${court}.`,
      `Aliados: funciona como Aliados ${dots} dentro dessa Corte.`,
      `Equivalência de Manto: ${mantle}; Benevolência da Corte só pode satisfazer pré-requisitos de Manto entre 1 e 3.`,
      "Mentor: funciona como Mentor 1 por meio do contato na Corte.",
    ];
  }
  if (name === "Hedge Duelist") {
    const selected = String(configuration.firstManeuver ?? "");
    const variant = HEDGE_DUELIST_VARIANTS.find((item) => item.label === selected);
    return variant ? [`${variant.label} (${variant.seeming}): ${variant.description}`] : [];
  }
  return commonExpandedConfigurationLines(name, dots, value, locale) ?? [];
}

export { decodeConfiguredRows, normalizeMeritConfiguration };
export const synchronizeMeritGrants = synchronizeChangelingBuilderMeritGrants;
