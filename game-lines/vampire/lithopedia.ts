import type { MeritSelection } from "@/lib/core/character/character-types";
import type { VampirePurchasablePower } from "./catalog-types";

export const lithopediaRites = (catalog: readonly VampirePurchasablePower[]) => catalog.filter(item => item.category === "Lithopedia Rites" && item.bloodlineId === "csalad");

export function hasCsaladStatus(merits: readonly MeritSelection[]) {
  return merits.some(item => item.definitionId === "vtr-kindred-status" && item.dots >= 1 &&
    ["csalad", "Család"].includes(String(item.configuration?.group ?? "")));
}

export function freeLithopediaRatings(current: number, target: number, status: boolean) {
  return Array.from({ length: Math.max(0, target - current) }, (_, index) => current + index + 1)
    .filter(rating => rating === 1 || status);
}

export function freeLithopediaSelections(catalog: readonly VampirePurchasablePower[], known: Set<string>, saved: readonly string[], ratings: readonly number[]) {
  const selected: string[] = [];
  for (const rating of ratings) {
    const eligible = catalog.filter(item => Number(item.rating ?? 0) === rating && !known.has(item.id) && !selected.includes(item.id));
    const choice = saved[selected.length];
    selected.push(eligible.some(item => item.id === choice) ? choice : eligible[0]?.id ?? "");
  }
  return selected;
}
