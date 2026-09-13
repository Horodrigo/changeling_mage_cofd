import type { ContractDefinition } from "./catalog/contract-catalog";
import { courtCanonicalId } from "./changeling-courts";

export function availableForeignClauseCourtIds(
  contract: Pick<ContractDefinition, "id" | "type" | "courtClauses">,
  currentCourt: unknown,
  goodwill: ReadonlyMap<string, number>,
  purchased: ReadonlySet<string>,
) {
  const ownCourt = courtCanonicalId(currentCourt);
  const threshold = contract.type === "Comum" ? 1 : 3;
  return Object.keys(contract.courtClauses ?? {}).filter((courtId) =>
    courtId !== ownCourt &&
    (goodwill.get(courtId) ?? 0) >= threshold &&
    !purchased.has(`${contract.id}::${courtId}`),
  );
}
