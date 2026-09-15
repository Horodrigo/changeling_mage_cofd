import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { BloodPotencyRow, VampireDisciplineDefinition, VampireReference } from "./catalog-types";
import type { Locale } from "@/lib/i18n";

export const VAMPIRE_DISCIPLINES = [
  "Animalism", "Auspex", "Celerity", "Dominate", "Majesty",
  "Nightmare", "Obfuscate", "Protean", "Resilience", "Vigor",
] as const;

export const ORDO_MYSTERIES = ["ascendant", "wyrm", "voivode"] as const;

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
    Iniciativa: Number(attributes.Dexterity ?? 1) + Number(attributes.Composure ?? 1) + celerity,
    Defesa: Math.min(Number(attributes.Dexterity ?? 1), Number(attributes.Wits ?? 1)) + Number(skills.Athletics ?? 0) + celerity,
    VitaeMaxima: typeof potency?.vitaeMaximum === "number" ? potency.vitaeMaximum : effectiveStamina,
    VitaePorTurno: potency?.vitaePerTurn ?? 1,
    LimiteDeCaracteristica: potency?.traitMaximum ?? 5,
  };
}

export function vampireCovenantStatus(sheet: Pick<CharacterSheet, "merits">, ...covenantNames: string[]) {
  const expected = new Set(covenantNames.map((name) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en-US").replace(/[^a-z0-9]/g, "")));
  return Math.max(0, ...sheet.merits
    .filter((merit) => merit.name === "Kindred Status" && expected.has(String(merit.configuration?.group ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en-US").replace(/[^a-z0-9]/g, "")))
    .map((merit) => Number(merit.dots) || 0));
}
