import type { CharacterSheet } from "./character-types";
import { normalizeMeritConfiguration } from "./merit-configuration";

const GENERATED_PREFIX = "Merit:";

/** Shared grant mechanics used by Core merits; line modules apply their own automatic grants around this call. */
export function synchronizeCommonMeritGrants(
  sheet: CharacterSheet,
  includeGrantedBy: (source: string) => boolean = () => false,
) {
  sheet.merits = sheet.merits.filter((item) => !item.grantedBy?.startsWith(GENERATED_PREFIX));
  sheet.specializations = (sheet.specializations ?? []).filter((item) => !item.grantedBy?.startsWith(GENERATED_PREFIX));
  const skillBonuses: Record<string, number> = {};
  const grantMerit = (owner: string, name: string, dots: number, index: number) => {
    if (!name || dots < 1) return;
    sheet.merits.push({ instanceId: `grant-${owner}-${index}`, name, dots, configuration: {}, grantedBy: `${GENERATED_PREFIX}${owner}` });
  };
  for (const merit of sheet.merits.filter((item) => !item.grantedBy || includeGrantedBy(item.grantedBy))) {
    const owner = `${merit.name}:${merit.instanceId ?? merit.name}`;
    const configuration = normalizeMeritConfiguration(merit.configuration);
    if (merit.name === "Professional Training") {
      const contacts = Array.isArray(configuration.contacts) ? configuration.contacts.filter(Boolean) : [];
      if (merit.dots >= 1) sheet.merits.push({ instanceId: `grant-${owner}-contacts`, name: "Contacts", dots: 2, configuration: { groups: contacts.slice(0, 2) }, grantedBy: `${GENERATED_PREFIX}${owner}` });
      if (merit.dots >= 3) for (const index of [1, 2]) {
        const skill = String(configuration[`specialty_${index}_skill`] ?? "");
        const name = String(configuration[`specialty_${index}_name`] ?? "");
        if (skill && name) sheet.specializations.push({ skill, name, grantedBy: `${GENERATED_PREFIX}${owner}` });
      }
      const boosted = String(configuration.boosted_skill ?? "");
      if (merit.dots >= 4 && boosted) skillBonuses[boosted] = (skillBonuses[boosted] ?? 0) + 1;
    }
    if (merit.name === "Mystery Cult Initiation" || merit.name === "Mystery Cult Influence") {
      for (let level = 1; level <= Math.min(5, merit.dots); level += 1) {
        const prefix = `level_${level}`;
        const type = String(configuration[`${prefix}_type`] ?? "");
        if (type === "specialty") {
          const skill = String(configuration[`${prefix}_specialty_skill`] ?? "");
          const name = String(configuration[`${prefix}_specialty_name`] ?? "");
          if (skill && name) sheet.specializations.push({ skill, name, grantedBy: `${GENERATED_PREFIX}${owner}` });
        }
        if (type === "skill" || type === "merit_skill") {
          const skill = String(configuration[`${prefix}_skill`] ?? "");
          if (skill) skillBonuses[skill] = (skillBonuses[skill] ?? 0) + 1;
        }
        if (type === "merit" || type === "merits" || type === "merit_skill") {
          const rows = Array.isArray(configuration[`${prefix}_merits`]) ? configuration[`${prefix}_merits`] as string[] : [];
          rows.forEach((row, index) => { const [name, rawDots] = row.split("|"); grantMerit(`${owner}:${level}`, name, Math.max(1, Number(rawDots) || 1), index); });
        }
      }
    }
  }
  return skillBonuses;
}
