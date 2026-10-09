import type { VampirePurchasablePower } from "./catalog-types";

export const ORTAM_RECIPE_IDS = [
  "devotion-essence-vitale-absolue", "devotion-quicksilver-grace", "devotion-shadow-s-eyes",
  "devotion-tiger-musk", "devotion-authority-for-lords", "devotion-fond-absence",
  "devotion-haunt-s-spite", "devotion-serpent-s-enticement", "devotion-bold-statement",
  "devotion-marble-confidence", "devotion-savage-exemplar",
] as const;

export function ortamRecipeSelections(catalog: readonly VampirePurchasablePower[], known: ReadonlySet<string>, choices: readonly string[], current: number, target: number) {
  if (!Number.isInteger(current) || !Number.isInteger(target) || current < 0 || target > 5 || target <= current) return null;
  const available = ORTAM_RECIPE_IDS.filter(id => !known.has(id));
  const count = Math.min(available.length, (target - current) * 2 + (current === 0 ? 1 : 0));
  const selected: string[] = [];
  for (let index = 0; index < count; index++) {
    const id = current === 0 && index === 0 && !known.has(ORTAM_RECIPE_IDS[0]) ? ORTAM_RECIPE_IDS[0] : choices[index];
    selected.push(available.some(availableId => availableId === id) && catalog.some(item => item.id === id) && !selected.includes(id) ? id : "");
  }
  return selected;
}
