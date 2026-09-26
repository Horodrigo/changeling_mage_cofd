import type { CharacterSheet } from "@/lib/core/character/character-types";

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const boundedIntegrity = (value: unknown) => {
  const parsed = Number(value);
  return Math.max(0, Math.min(10, Math.trunc(Number.isFinite(parsed) ? parsed : 7)));
};

/** Chronicles of Darkness 2e, p. 74. */
export function mortalIntegrityModifier(integrity: unknown) {
  const value = boundedIntegrity(integrity);
  if (value >= 8) return 2;
  if (value >= 6) return 1;
  if (value >= 4) return 0;
  if (value >= 2) return -1;
  return -2;
}

export function mortalBreakingPointPool(resolve: unknown, composure: unknown, integrity: unknown, circumstances = 0, meditation = false) {
  const circumstanceModifier = Math.max(-5, Math.min(5, Math.trunc(numberValue(circumstances))));
  return numberValue(resolve) + numberValue(composure) + mortalIntegrityModifier(integrity) + circumstanceModifier + Number(meditation);
}

/** Chronicles of Darkness 2e, pp. 26-27. */
export function mortalDerived(character: Pick<CharacterSheet, "attributes" | "skills" | "line_data" | "derived">) {
  const { attributes, skills } = character;
  const size = 5;
  return {
    ...character.derived,
    Tamanho: size,
    Vitalidade: size + numberValue(attributes.Stamina),
    Deslocamento: size + numberValue(attributes.Strength) + numberValue(attributes.Dexterity),
    ForçaDeVontade: numberValue(attributes.Resolve) + numberValue(attributes.Composure),
    Iniciativa: numberValue(attributes.Dexterity) + numberValue(attributes.Composure),
    Defesa: Math.min(numberValue(attributes.Dexterity), numberValue(attributes.Wits)) + numberValue(skills.Athletics),
    Integridade: boundedIntegrity(character.line_data.integrity),
  };
}
