import type { CharacterSheet, MeritSelection, Specialty } from "./character-types";
import { decodeMeritGrantChoice, normalizeMeritConfiguration } from "./merit-configuration";
import { commonMeritId } from "./merit-identities";
import { experienceMeritDots } from "@/lib/merit-progression";

const GENERATED_PREFIX = "Merit:";

/** Creation merges omit free rows. Seed their exact configurations before the owning grant engine recomposes them. */
export function preservePreviousCommonGrants(sheet: CharacterSheet, previous: CharacterSheet) {
  sheet.merits.push(...previous.merits.filter(item => item.grantedBy?.startsWith(GENERATED_PREFIX) && !experienceMeritDots(item) &&
    item.instanceId && previous.merits.filter(candidate => candidate.instanceId === item.instanceId).length === 1 &&
    !sheet.merits.some(candidate => candidate.instanceId === item.instanceId)).map(item => structuredClone(item)));
}

/** Shared grant mechanics used by Core merits; line modules apply their own automatic grants around this call. */
export function synchronizeCommonMeritGrants(
  sheet: Pick<CharacterSheet, "merits" | "specializations" | "line_data">,
  includeGrantedBy: (source: string) => boolean = () => false,
  additionalCultIdentity: (merit: MeritSelection) => string | undefined = () => undefined,
) {
  const previousGrants = sheet.merits.filter(item => item.grantedBy?.startsWith(GENERATED_PREFIX));
  sheet.merits = sheet.merits.flatMap((item) => {
    if (!item.grantedBy?.startsWith(GENERATED_PREFIX)) return [item];
    const experienceDots = experienceMeritDots(item);
    if (!experienceDots) return [];
    const paid = { ...item, dots: experienceDots, creationDots: 0, experienceDots };
    delete paid.grantedBy;
    return [paid];
  });
  sheet.specializations = (sheet.specializations ?? []).filter((item) => !item.grantedBy?.startsWith(GENERATED_PREFIX));
  const skillBonuses: Record<string, number> = {};
  const grantInstanceId = (owner: string, key: string | number) => {
    let id = `grant-${owner}-${key}`;
    while (sheet.merits.some(item => item.instanceId === id)) id += "-free";
    return id;
  };
  const grantMerit = (owner: string, row: unknown, index: number) => {
    const choice = decodeMeritGrantChoice(row);
    if (!choice) return;
    const instanceId = grantInstanceId(owner, index), grantedBy = `${GENERATED_PREFIX}${owner}`;
    const candidates = previousGrants.filter(item => item.instanceId === instanceId);
    const previous = candidates.length === 1 ? candidates[0] : undefined;
    // Only the same producer and exact grant identity retain authored choices.
    // Existing schema-2 name|dots rows can retain choices only when both rows lack IDs.
    const sameDefinition = choice.definitionId ? previous?.definitionId === choice.definitionId :
      previous && !previous.definitionId && previous.name === choice.name && previous.sourceId === choice.sourceId;
    const configuration = previous?.grantedBy === grantedBy && sameDefinition ? structuredClone(previous.configuration ?? {}) : {};
    sheet.merits.push({ ...choice, instanceId, configuration, grantedBy });
  };
  for (const merit of sheet.merits.filter((item) => !item.grantedBy || includeGrantedBy(item.grantedBy))) {
    const additionalCultId = additionalCultIdentity(merit);
    const definitionId = commonMeritId(merit) ?? additionalCultId;
    if (!definitionId) continue;
    const owner = `${definitionId}:${merit.instanceId ?? definitionId}`;
    const configuration = normalizeMeritConfiguration(merit.configuration);
    if (definitionId === "core-2ed:professional-training") {
      const contacts = Array.isArray(configuration.contacts) ? configuration.contacts.filter(Boolean) : [];
      if (merit.dots >= 1) sheet.merits.push({ definitionId: "core-2ed:contacts", sourceId: "core-2ed", source: "Chronicles of Darkness", instanceId: grantInstanceId(owner, "contacts"), name: "Contacts", dots: 2, configuration: { groups: contacts.slice(0, 2) }, grantedBy: `${GENERATED_PREFIX}${owner}` });
      if (merit.dots >= 3) for (const index of [1, 2]) {
        const skill = String(configuration[`specialty_${index}_skill`] ?? "");
        const name = String(configuration[`specialty_${index}_name`] ?? "");
        if (skill && name) sheet.specializations.push({ skill, name, grantedBy: `${GENERATED_PREFIX}${owner}` });
      }
      const boosted = String(configuration.boosted_skill ?? "");
      if (merit.dots >= 4 && boosted) skillBonuses[boosted] = (skillBonuses[boosted] ?? 0) + 1;
    }
    if (definitionId === "core-2ed:mystery-cult-initiation" || definitionId === "core-2ed:mystery-cult-influence" || additionalCultId) {
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
          rows.forEach((row, index) => grantMerit(`${owner}:${level}`, row, index));
        }
      }
    }
  }
  return skillBonuses;
}


/** Creation previews recompose Core Specialty grants without changing purchases or the source sheet. */
export function commonMeritSpecializations(
  specializations: readonly Specialty[],
  merits: readonly MeritSelection[],
  includeGrantedBy: (source: string) => boolean = () => false,
  additionalCultIdentity: (merit: MeritSelection) => string | undefined = () => undefined,
): Specialty[] {
  const preview = { specializations: structuredClone([...specializations]), merits: structuredClone([...merits]), line_data: {} };
  synchronizeCommonMeritGrants(preview, includeGrantedBy, additionalCultIdentity);
  return preview.specializations;
}
