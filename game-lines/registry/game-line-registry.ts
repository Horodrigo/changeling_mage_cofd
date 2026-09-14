import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { changelingRegistration } from "../changeling/registration";
import { mageRegistration } from "../mage/registration";
import { vampireRegistration } from "../vampire/registration";

const registrations = [changelingRegistration, mageRegistration, vampireRegistration] as const;
const registrationsById = new Map<PersistedGameLineId, GameLineRegistration>(
  registrations.map((registration) => [registration.id, registration]),
);

if (registrationsById.size !== registrations.length) {
  throw new Error("Game-line registrations must have unique persisted IDs.");
}

/** The eager registry contains metadata and loader references only. */
export function getGameLineRegistration(id: PersistedGameLineId): GameLineRegistration {
  const registration = registrationsById.get(id);
  if (!registration) throw new Error(`No game-line registration exists for ${id}.`);
  return registration;
}

export function listGameLineRegistrations(): readonly GameLineRegistration[] {
  return registrations;
}

/**
 * Runs an optional pure line-owned normalization hook after structural loading.
 * Rule modules are loaded only for the selected persisted game line.
 */
export async function normalizeGameLineCharacter(character: CharacterSheet): Promise<CharacterSheet> {
  const rules = await getGameLineRegistration(character.game_line).loadRules();
  const normalized = rules.normalizeCharacter?.(character) ?? character;
  return rules.synchronizeCharacter?.(normalized) ?? normalized;
}
