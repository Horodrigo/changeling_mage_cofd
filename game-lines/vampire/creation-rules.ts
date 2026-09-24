import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { BloodPotencyRow, VampireCovenantDefinition, VampireDisciplineDefinition, VampireReference } from "./catalog-types";
import { translate, type Locale } from "@/lib/i18n";

export const VAMPIRE_CREATION_DISCIPLINES = [
  "Animalism", "Auspex", "Celerity", "Dominate", "Majesty",
  "Nightmare", "Obfuscate", "Protean", "Resilience", "Vigor", "Praestantia", "Vitiate", "Triadic Evolution",
] as const;

export const VAMPIRE_DISCIPLINES = [...VAMPIRE_CREATION_DISCIPLINES, "Dead Signal", "Cachexy", "Crochan"] as const;

export function vampireDisciplineAvailable(name: string, bloodlineId: string, clanId = "", covenantId: string | readonly string[] = "") {
  if (name === "Dead Signal") return bloodlineId === "jharana";
  if (name === "Cachexy") return bloodlineId === "morbus";
  if (name === "Crochan") return bloodlineId === "bron";
  if (name === "Praestantia") return clanId === "akhud";
  if (name === "Vitiate") return clanId === "bekaak";
  if (name === "Triadic Evolution") return Array.isArray(covenantId) ? covenantId.includes("belials-brood") : covenantId === "belials-brood";
  return true;
}

export const ORDO_MYSTERIES = ["ascendant", "wyrm", "voivode", "quintessence"] as const;

/**
 * Discipline names are catalog-owned identities, not core trait terms. This is
 * deliberately separate from `systemTerm`: the English Discipline `Vigor`
 * must never be confused with the Portuguese storage label for Stamina.
 */
export function vampireDisciplineDisplayName(
  name: string,
  catalog: readonly VampireDisciplineDefinition[],
  locale: Locale,
) {
  const definition = catalog.find((item) => item.name === name);
  return locale === "pt-BR" ? definition?.translatedName ?? name : definition?.name ?? name;
}

export const BLOOD_POTENCY_ROWS: readonly BloodPotencyRow[] = [
  { rating: 0, traitMaximum: 5, vitaeMaximum: "Stamina", vitaePerTurn: 1, feedingTier: "Animals" },
  { rating: 1, traitMaximum: 5, vitaeMaximum: 10, vitaePerTurn: 1, feedingTier: "Animals" },
  { rating: 2, traitMaximum: 5, vitaeMaximum: 11, vitaePerTurn: 2, feedingTier: "Animals" },
  { rating: 3, traitMaximum: 5, vitaeMaximum: 12, vitaePerTurn: 3, feedingTier: "Humans" },
  { rating: 4, traitMaximum: 5, vitaeMaximum: 13, vitaePerTurn: 4, feedingTier: "Humans" },
  { rating: 5, traitMaximum: 5, vitaeMaximum: 15, vitaePerTurn: 5, feedingTier: "Humans" },
  { rating: 6, traitMaximum: 6, vitaeMaximum: 20, vitaePerTurn: 6, feedingTier: "Kindred" },
  { rating: 7, traitMaximum: 7, vitaeMaximum: 25, vitaePerTurn: 7, feedingTier: "Kindred" },
  { rating: 8, traitMaximum: 8, vitaeMaximum: 30, vitaePerTurn: 8, feedingTier: "Kindred" },
  { rating: 9, traitMaximum: 9, vitaeMaximum: 50, vitaePerTurn: 10, feedingTier: "Kindred" },
  { rating: 10, traitMaximum: 10, vitaeMaximum: 75, vitaePerTurn: 15, feedingTier: "Kindred" },
];

export function boundedRating(value: unknown, minimum: number, maximum: number, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(minimum, Math.min(maximum, Math.trunc(parsed))) : fallback;
}

export function recordRatings(value: unknown, keys: readonly string[], maximum = 10) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return Object.fromEntries(keys.map((key) => [key, boundedRating(source[key], 0, maximum, 0)]));
}

export function stringArray(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

export function vampireCovenantIds(data: Record<string, unknown>) {
  const saved = stringArray(data.covenant_ids);
  const primary = String(data.covenant_id ?? "covenantless");
  const ids = [...new Set(saved.length ? saved : [primary])];
  return ids.includes("covenantless") && ids.length > 1 ? ids.filter((id) => id !== "covenantless") : ids;
}

export function hollowKaRank(humanity: number) {
  const value = boundedRating(humanity, 1, 10, 7);
  return value >= 9 ? 1 : value >= 7 ? 2 : value >= 5 ? 3 : value >= 3 ? 4 : 5;
}

export function hollowKaLimits(rank: number) {
  return [
    { traitMaximum: 5, attributeMinimum: 5, attributeMaximum: 8, essenceMaximum: 10, numinaMinimum: 1, numinaMaximum: 3 },
    { traitMaximum: 7, attributeMinimum: 9, attributeMaximum: 14, essenceMaximum: 15, numinaMinimum: 3, numinaMaximum: 5 },
    { traitMaximum: 9, attributeMinimum: 15, attributeMaximum: 25, essenceMaximum: 20, numinaMinimum: 5, numinaMaximum: 7 },
    { traitMaximum: 12, attributeMinimum: 26, attributeMaximum: 35, essenceMaximum: 25, numinaMinimum: 7, numinaMaximum: 9 },
    { traitMaximum: 15, attributeMinimum: 36, attributeMaximum: 45, essenceMaximum: 50, numinaMinimum: 9, numinaMaximum: 11 },
  ][Math.max(1, Math.min(5, Math.trunc(rank))) - 1];
}

export function simplifiedHollowKaPool(humanity: number) {
  return Math.max(0, 10 - boundedRating(humanity, 0, 10, 7));
}

export function objectArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}

export function bloodPotencyRow(reference: VampireReference | Pick<VampireReference, "bloodPotency">, rating: number): BloodPotencyRow {
  return reference.bloodPotency.find((row) => row.rating === rating) ?? reference.bloodPotency.find((row) => row.rating === 1) ?? {
    rating: 1, traitMaximum: 5, vitaeMaximum: 10, vitaePerTurn: 1, feedingTier: "Animals",
  };
}

export function bloodPotencyLimits(rating: number): BloodPotencyRow {
  return BLOOD_POTENCY_ROWS.find((row) => row.rating === rating) ?? BLOOD_POTENCY_ROWS[1];
}

export type VampireSunlightExposure = {
  damage: number;
  damageType: "lethal" | "aggravated";
  frequency: "none" | "ten-minutes" | "one-minute" | "one-turn" | "two-per-turn" | "three-per-turn" | "five-per-turn";
};

export function vampireSunlightExposure(humanity: number, bloodPotency: number): VampireSunlightExposure {
  const effectiveHumanity = boundedRating(humanity, 0, 10, 7);
  const potency = boundedRating(bloodPotency, 0, 10, 1);
  const damage =
    effectiveHumanity >= 7 ? 1 :
    effectiveHumanity === 6 ? 2 :
    effectiveHumanity === 5 ? 3 :
    effectiveHumanity === 4 ? 1 :
    effectiveHumanity === 3 ? 2 :
    effectiveHumanity === 2 ? 3 :
    effectiveHumanity === 1 ? 4 : 5;
  const damageType = effectiveHumanity >= 5 ? "lethal" : "aggravated";
  const frequency =
    potency === 0 ? "none" :
    potency <= 2 ? "ten-minutes" :
    potency === 3 ? "one-minute" :
    potency <= 5 ? "one-turn" :
    potency <= 7 ? "two-per-turn" :
    potency <= 9 ? "three-per-turn" : "five-per-turn";
  return { damage, damageType, frequency };
}

export function vampireSunlightSummary(humanity: number, bloodPotency: number, locale: Locale) {
  const exposure = vampireSunlightExposure(humanity, bloodPotency);
  const damageType = locale === "pt-BR"
    ? exposure.damageType === "lethal" ? "letal" : "agravado"
    : exposure.damageType;
  const frequency = locale === "pt-BR"
    ? {
        none: "sem intervalo aplicável",
        "ten-minutes": "a cada 10 minutos",
        "one-minute": "a cada minuto",
        "one-turn": "por turno",
        "two-per-turn": "2× por turno",
        "three-per-turn": "3× por turno",
        "five-per-turn": "5× por turno",
      }[exposure.frequency]
    : {
        none: "with no applicable interval",
        "ten-minutes": "every 10 minutes",
        "one-minute": "every minute",
        "one-turn": "per turn",
        "two-per-turn": "2× per turn",
        "three-per-turn": "3× per turn",
        "five-per-turn": "5× per turn",
      }[exposure.frequency];

  return translate(locale, "ui.sunlightSummary", { damage: exposure.damage, damageType, frequency });
}

export function vampireDerived(
  attributes: Record<string, number>,
  skills: Record<string, number>,
  disciplines: Record<string, number>,
  bloodPotency: number,
  reference?: Pick<VampireReference, "bloodPotency">,
) {
  const resilience = boundedRating(disciplines.Resilience, 0, 10, 0);
  const vigor = boundedRating(disciplines.Vigor, 0, 10, 0);
  const celerity = boundedRating(disciplines.Celerity, 0, 10, 0);
  const effectiveStamina = Number(attributes.Stamina ?? 1) + resilience;
  const effectiveStrength = Number(attributes.Strength ?? 1) + vigor;
  const potency = reference ? bloodPotencyRow(reference, bloodPotency) : bloodPotencyLimits(bloodPotency);
  return {
    Tamanho: 5,
    Vitalidade: 5 + effectiveStamina,
    Deslocamento: 5 + effectiveStrength + Number(attributes.Dexterity ?? 1),
    ForçaDeVontade: Number(attributes.Resolve ?? 1) + Number(attributes.Composure ?? 1),
    Iniciativa: Number(attributes.Dexterity ?? 1) + Number(attributes.Composure ?? 1),
    Defesa: Math.min(Number(attributes.Dexterity ?? 1), Number(attributes.Wits ?? 1)) + Number(skills.Athletics ?? 0) + celerity,
    VitaeMaxima: typeof potency?.vitaeMaximum === "number" ? potency.vitaeMaximum : effectiveStamina,
    VitaePorTurno: potency?.vitaePerTurn ?? 1,
    LimiteDeCaracteristica: potency?.traitMaximum ?? 5,
  };
}

export function vampireCovenantStatus(sheet: Pick<CharacterSheet, "merits">, ...covenantNames: string[]) {
  const expected = new Set(covenantNames.map(normalizeAffiliation));
  return Math.max(0, ...sheet.merits
    .filter((merit) => merit.name === "Kindred Status" && expected.has(normalizeAffiliation(String(merit.configuration?.group ?? ""))))
    .map((merit) => Number(merit.dots) || 0));
}

function normalizeAffiliation(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en-US").replace(/[^a-z0-9]/g, "");
}

export function vampireCovenantAffiliationDots(sheet: Pick<CharacterSheet, "merits">, covenants: readonly VampireCovenantDefinition[]) {
  const covenantNames = new Set(covenants.flatMap((item) => [item.id, item.name, item.translatedName]).map(normalizeAffiliation));
  const shadowNames = new Set(covenants.filter((item) => item.group === "shadow-cult").flatMap((item) => [item.id, item.name, item.translatedName]).map(normalizeAffiliation));
  return sheet.merits.reduce((sum, merit) => {
    if (merit.name === "Kindred Status" && covenantNames.has(normalizeAffiliation(String(merit.configuration?.group ?? "")))) return sum + Math.max(0, Number(merit.dots) || 0);
    if (merit.name === "Mystery Cult Initiation" && shadowNames.has(normalizeAffiliation(String(merit.configuration?.cult ?? "")))) return sum + Math.max(0, Number(merit.dots) || 0);
    return sum;
  }, 0);
}
