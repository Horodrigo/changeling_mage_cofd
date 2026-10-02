import type { FormId, FormMechanics } from "./catalogs/reference";

/** Small rule constants for pure normalization/derivation. Catalog prose stays in static JSON.
 * WTF2 pp. 96–98, with audited M02/M03/M04/M07. Tests reconcile every value with the catalog. */
const FORM_MODIFIERS = {
  // Strength, Dexterity, Stamina, Manipulation, Size, species factor, perception, firearm Defense.
  hishu: [0, 0, 0, 0, 0, 0, 1, false],
  dalu: [1, 0, 1, -1, 1, 0, 2, true],
  gauru: [3, 1, 2, 0, 2, 0, 3, true],
  urshul: [2, 2, 2, -1, 1, 3, 3, true],
  urhan: [0, 2, 1, -1, -1, 3, 4, false],
} as const;
export const FORM_MECHANICS = Object.fromEntries(Object.entries(FORM_MODIFIERS).map(([id, [Strength, Dexterity, Stamina, Manipulation, size, speciesFactor, perception, firearmsDefense]]) => [id, {
  id, attributes: Object.fromEntries(Object.entries({ Strength, Dexterity, Stamina, Manipulation }).filter(([, delta]) => delta !== 0)),
  size, speciesFactor, perception, firearmsDefense, armorGeneral: 0, armorBallistic: 0,
}])) as Readonly<Record<FormId, FormMechanics>>;

/** Canonical identity index, not translated-name dispatch or a second Merit catalog. */
export const PERMANENT_MERIT_IDENTITIES = [
  ["embodiment-of-the-firstborn", "Embodiment of the Firstborn"], ["favored-form", "Favored Form"],
  ["instinctive-defense", "Instinctive Defense"], ["fortified-form", "Fortified Form"], ["living-weapon", "Living Weapon"],
].map(([slug, name]) => ({ id: `wtf-2ed:${slug}`, name, sourceId: "wtf-2ed" }));

export const RENOWN_IDS = ["Cunning", "Glory", "Honor", "Purity", "Wisdom"] as const;
