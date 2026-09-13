import { courtCanonicalId } from "@/lib/changeling-courts";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeCommonMeritGrants } from "@/lib/core/character/synchronize-merit-grants";
import { synchronizeEntitlement } from "@/lib/entitlements";

export function synchronizeChangelingBuilderMeritGrants(sheet: CharacterSheet) {
  const court = courtCanonicalId(sheet.line_data.court);
  const courtless = !court || ["sem corte", "courtless"].includes(court.toLowerCase());
  const existing = sheet.merits.find((item) => item.name === "Mantle" && item.grantedBy === "Corte");
  sheet.merits = sheet.merits.filter((item) => !(item.name === "Mantle" && item.grantedBy === "Corte"));
  if (!courtless) sheet.merits.push({ ...existing, instanceId: existing?.instanceId ?? `mantle-${court}`, name: "Mantle", dots: Math.max(1, Number(existing?.dots ?? 1)), creationDots: Math.max(1, Number(existing?.creationDots ?? (Number(existing?.dots ?? 1) - Number(existing?.experienceDots ?? 0)))), experienceDots: Math.max(0, Number(existing?.experienceDots ?? 0)), sourceId: "ctl-2ed", source: "Changeling the Lost", configuration: { court }, grantedBy: "Corte" });
  const benefits = sheet.merits.filter((item) => item.name === "Court Goodwill" && !item.grantedBy).map((item) => {
    const selected = courtCanonicalId(normalizeMeritConfiguration(item.configuration).court);
    item.configuration = { ...normalizeMeritConfiguration(item.configuration), court: selected };
    return { court: selected, dots: item.dots, mantleDots: Math.max(0, item.dots - 2) };
  }).filter((item) => item.court);
  const skillBonuses = synchronizeCommonMeritGrants(sheet);
  sheet.line_data.court_goodwill_benefits = benefits;
  sheet.line_data.merit_granted_skill_bonuses = skillBonuses;
  return synchronizeEntitlement(sheet);
}
