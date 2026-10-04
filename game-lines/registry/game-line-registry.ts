import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { reconcileSpecialtyMerits } from "@/lib/core/character/specialty-merits";
import { preservePreviousCommonGrants } from "@/lib/core/character/synchronize-merit-grants";
import { mortalRegistration } from "../mortal/registration";
import { changelingRegistration } from "../changeling/registration";
import { mageRegistration } from "../mage/registration";
import { vampireRegistration } from "../vampire/registration";
import { werewolfRegistration } from "../werewolf/registration";

const registrations = [mortalRegistration, changelingRegistration, mageRegistration, vampireRegistration, werewolfRegistration] as const;
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
 * Canonical line-owned character pipeline after structural/core normalization:
 * normalize -> preserve prior free grant choices -> synchronize -> reconcile explicit Specialty edits -> derive.
 */
export async function normalizeGameLineCharacter(character: CharacterSheet, previous?: CharacterSheet): Promise<CharacterSheet> {
  const rules = await getGameLineRegistration(character.game_line).loadRules();

  let next = structuredClone(character);
  next = rules.normalizeCharacter?.(next) ?? next;
  if (previous?.id === next.id && previous.game_line === next.game_line) preservePreviousCommonGrants(next, previous);
  next = rules.synchronizeCharacter?.(next) ?? next;

  if (previous?.id === next.id && previous.game_line === next.game_line) {
    const changes = reconcileSpecialtyMerits(previous.merits, previous.specializations, next.merits, next.specializations);
    next = { ...next, merits: changes.merits };
    if (changes.removed.length) {
      next = rules.onSpecialtyMeritsRemoved?.(next, changes.removed) ?? next;
      next = rules.synchronizeCharacter?.(next) ?? next;
    }
  }

  const derived = rules.deriveCharacterState?.(next);
  return derived ? { ...next, derived } : next;
}
