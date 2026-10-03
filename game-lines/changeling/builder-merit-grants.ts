import { courtCanonicalId } from "@/lib/changeling-courts";
import type { CharacterSheet, MeritSelection } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeCommonMeritGrants } from "@/lib/core/character/synchronize-merit-grants";
import { synchronizeEntitlement, type EntitlementDefinition } from "@/lib/entitlements";
import { resolveMeritDefinition } from "@/lib/merit-identity";

/** Identity-only index for the pure synchronization hook; canonical schema-2 fallback is shared.
 * Remove its ID-less branch with the shared resolver when those stored selections end. */
export const CHANGELING_COURT_MERIT_IDENTITIES = [
  ["mantle", "Mantle"], ["court-goodwill", "Court Goodwill"],
].map(([slug, name]) => ({ id: `ctl-2ed:${slug}`, name, sourceId: "ctl-2ed" }));
const courtMeritId = (merit: MeritSelection) => merit.definitionId ?? resolveMeritDefinition(merit, CHANGELING_COURT_MERIT_IDENTITIES)?.id;

function withoutFreeMantle(merit: MeritSelection) {
  const experienceDots = Math.max(0, Number(merit.experienceDots ?? 0));
  const creationDots = Math.max(0, Number(merit.creationDots ?? merit.dots - experienceDots) - 1);
  const retained = { ...merit, definitionId: "ctl-2ed:mantle", dots: creationDots + experienceDots, creationDots, experienceDots };
  delete retained.grantedBy;
  return retained.dots ? [retained] : [];
}

export function synchronizeChangelingBuilderMeritGrants(sheet: CharacterSheet, entitlements?: readonly EntitlementDefinition[]) {
  const court = courtCanonicalId(sheet.line_data.court);
  const courtless = !court || ["sem corte", "courtless"].includes(court.toLowerCase());
  const existing = sheet.merits.find((item) => courtMeritId(item) === "ctl-2ed:mantle" && item.grantedBy === "Corte");
  sheet.merits = sheet.merits.flatMap(item => courtMeritId(item) !== "ctl-2ed:mantle" || item.grantedBy !== "Corte" ? [item] :
    !courtless && item === existing ? [] : withoutFreeMantle(item));
  if (!courtless) sheet.merits.push({ ...existing, definitionId: "ctl-2ed:mantle", instanceId: existing?.instanceId ?? `mantle-${court}`, name: "Mantle", dots: Math.max(1, Number(existing?.dots ?? 1)), creationDots: Math.max(1, Number(existing?.creationDots ?? (Number(existing?.dots ?? 1) - Number(existing?.experienceDots ?? 0)))), experienceDots: Math.max(0, Number(existing?.experienceDots ?? 0)), sourceId: "ctl-2ed", source: "Changeling the Lost", configuration: { ...normalizeMeritConfiguration(existing?.configuration), court }, grantedBy: "Corte" });
  const benefits = sheet.merits.filter((item) => courtMeritId(item) === "ctl-2ed:court-goodwill" && !item.grantedBy).map((item) => {
    const selected = courtCanonicalId(normalizeMeritConfiguration(item.configuration).court);
    item.configuration = { ...normalizeMeritConfiguration(item.configuration), court: selected };
    return { court: selected, dots: item.dots, mantleDots: Math.max(0, item.dots - 2) };
  }).filter((item) => item.court);
  const skillBonuses = synchronizeCommonMeritGrants(sheet);
  sheet.line_data.court_goodwill_benefits = benefits;
  sheet.line_data.merit_granted_skill_bonuses = skillBonuses;
  return entitlements ? synchronizeEntitlement(sheet, entitlements) : sheet;
}
