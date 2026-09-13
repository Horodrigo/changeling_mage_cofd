import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";
import { changelingRegistration } from "../changeling/registration";
import { mageRegistration } from "../mage/registration";

const registrations = [changelingRegistration, mageRegistration] as const;
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
