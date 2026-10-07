import type { Specialty } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";

export const BLOODCRAFTING_ID = "vtr-better-feared:bloodcrafting";
export const BLOODCRAFTING_ENHANCEMENTS = [
  { id: "bane", cost: 3, label: "ui.bloodcraftingBane" },
  { id: "cursed", cost: 3, label: "ui.bloodcraftingCursed" },
  { id: "efficient", cost: 2, label: "ui.bloodcraftingEfficient" },
  { id: "empowered", cost: 3, label: "ui.bloodcraftingEmpowered" },
  { id: "mechanical", cost: 1, label: "ui.bloodcraftingMechanical" },
] as const;

export function bloodcraftingChoices(value: unknown) {
  const stored = normalizeMeritConfiguration(value).enhancements;
  return Array.isArray(stored) ? stored : stored ? [stored] : [];
}

export function bloodcraftingSpent(value: unknown) {
  return bloodcraftingChoices(value).reduce((sum, id) => sum + (BLOODCRAFTING_ENHANCEMENTS.find(item => item.id === id)?.cost ?? 0), 0);
}

export function bloodcraftingConfigurationMet(dots: number, value: unknown, specialties: readonly Specialty[] = []) {
  const configuration = normalizeMeritConfiguration(value), selected = bloodcraftingChoices(value);
  return dots >= 2 && specialties.some(item => item.skill === "Crafts" && item.name.trim() && item.name === configuration.subject)
    && new Set(selected).size === selected.length
    && selected.every(id => BLOODCRAFTING_ENHANCEMENTS.some(item => item.id === id))
    && bloodcraftingSpent(value) <= dots - 2;
}
