import type { MeritSelection, Specialty } from "./character-types";
import type { MeritConfiguration } from "./merit-configuration";
import { decodeMeritGrantChoice } from "./merit-configuration";
import { commonMeritId } from "./merit-identities";
import { canonicalTraitId } from "./trait-identities";

export const INTERDISCIPLINARY_SPECIALTY_ID = "core-2ed:interdisciplinary-specialty";
export const specialtyIdentity = (specialty: Specialty) => JSON.stringify([canonicalTraitId("skills", specialty.skill), specialty.name, specialty.grantedBy ?? ""]);

export function configuredSpecialty(configuration: MeritConfiguration = {}): Specialty | undefined {
  const skill = configuration.specialty_skill, name = configuration.specialty_name, grantedBy = configuration.specialty_grantedBy;
  return typeof skill === "string" && skill && typeof name === "string" && name.trim() && (grantedBy === undefined || typeof grantedBy === "string")
    ? { skill: canonicalTraitId("skills", skill), name, ...(grantedBy ? { grantedBy } : {}) } : undefined;
}

/** Duplicate tuples are ambiguous; translated Skill labels never become stored identities. */
export function interdisciplinarySpecialties(specializations: readonly Specialty[] = [], skills: Readonly<Record<string, number>> = {}) {
  return specializations.filter(item => item.name.trim() && Number(skills[item.skill] ?? 0) >= 3 &&
    specializations.filter(candidate => specialtyIdentity(candidate) === specialtyIdentity(item)).length === 1);
}

export function interdisciplinarySpecialtySelected(configuration: MeritConfiguration | undefined, specializations: readonly Specialty[] = [], skills: Readonly<Record<string, number>> = {}) {
  const selected = configuredSpecialty(configuration);
  return Boolean(selected && interdisciplinarySpecialties(specializations, skills).some(item => specialtyIdentity(item) === specialtyIdentity(selected)));
}

export function specialtyMeritWasRemoved(item: MeritSelection, removed: readonly MeritSelection[]) {
  if (commonMeritId(item) !== INTERDISCIPLINARY_SPECIALTY_ID) return false;
  return removed.some(previous => previous.instanceId ? previous.instanceId === item.instanceId :
    !item.instanceId && specialtyIdentity(configuredSpecialty(previous.configuration) ?? { skill: "", name: "" }) ===
      specialtyIdentity(configuredSpecialty(item.configuration) ?? { skill: "", name: "" }));
}

/** Explicit Specialty edits remove their linked Merit; opening/importing alone never invokes this comparison. */
export function reconcileSpecialtyMerits(
  previousMerits: readonly MeritSelection[], previousSpecialties: readonly Specialty[],
  currentMerits: readonly MeritSelection[], currentSpecialties: readonly Specialty[],
): { merits: MeritSelection[]; removed: MeritSelection[] } {
  currentMerits = currentMerits.map(item => {
    if (commonMeritId(item) !== INTERDISCIPLINARY_SPECIALTY_ID || !item.grantedBy || !item.instanceId ||
        Object.hasOwn(item.configuration ?? {}, "specialty_skill")) return item;
    const candidates = previousMerits.filter(previous => previous.instanceId === item.instanceId);
    const previous = candidates.length === 1 ? candidates[0] : undefined;
    // Owning grant recomposition can omit the child row/configuration during creation edits.
    // An explicit selector clear stores blank link fields and is never restored here.
    return previous?.grantedBy === item.grantedBy && commonMeritId(previous) === INTERDISCIPLINARY_SPECIALTY_ID && configuredSpecialty(previous.configuration)
      ? { ...item, configuration: { ...previous.configuration, ...item.configuration } } : item;
  });
  const removed = currentMerits.filter(item => {
    if (commonMeritId(item) !== INTERDISCIPLINARY_SPECIALTY_ID) return false;
    const link = configuredSpecialty(item.configuration);
    if (!link) return false;
    const key = specialtyIdentity(link);
    const previous = previousMerits.filter(candidate => item.instanceId ? candidate.instanceId === item.instanceId :
      !candidate.instanceId && commonMeritId(candidate) === INTERDISCIPLINARY_SPECIALTY_ID &&
      specialtyIdentity(configuredSpecialty(candidate.configuration) ?? { skill: "", name: "" }) === key);
    if (previous.length !== 1 || commonMeritId(previous[0]) !== INTERDISCIPLINARY_SPECIALTY_ID ||
        (item.instanceId && currentMerits.filter(candidate => candidate.instanceId === item.instanceId).length !== 1) ||
        specialtyIdentity(configuredSpecialty(previous[0].configuration) ?? { skill: "", name: "" }) !== key) return false;
    return previousSpecialties.filter(candidate => specialtyIdentity(candidate) === key).length === 1 &&
      currentSpecialties.filter(candidate => specialtyIdentity(candidate) === key).length !== 1;
  });
  // Regeneration strips a paid grant's marker. Its exact previous instance still proves the producer.
  const removedWithProducers = removed.map(item => item.grantedBy ? item : {
    ...item, grantedBy: previousMerits.find(previous => previous.instanceId === item.instanceId && commonMeritId(previous) === INTERDISCIPLINARY_SPECIALTY_ID &&
      specialtyIdentity(configuredSpecialty(previous.configuration) ?? { skill: "", name: "" }) === specialtyIdentity(configuredSpecialty(item.configuration) ?? { skill: "", name: "" }))?.grantedBy,
  });
  return { merits: removeSpecialtyMeritGrantChoices(currentMerits.filter(item => !removed.includes(item)), removedWithProducers), removed: removedWithProducers };
}

/** Owning lines may supply the canonical identity of their schema-2 ID-less Cult producers. */
export function removeSpecialtyMeritGrantChoices(
  merits: readonly MeritSelection[], removed: readonly MeritSelection[],
  identityFor: (merit: MeritSelection) => string | undefined = commonMeritId,
) {
  return merits.map(item => {
    // Core owns configured-Cult row mechanics; the producer identity is supplied by its grant marker.
    const identity = identityFor(item);
    if (!identity || !item.configuration) return item;
    let configuration = item.configuration;
    for (let level = 1; level <= 5; level++) {
      const key = `level_${level}_merits`, rows = configuration[key];
      if (!Array.isArray(rows)) continue;
      const producer = `${identity}:${item.instanceId ?? identity}:${level}`;
      const next = rows.map((row, index) => {
        const choice = decodeMeritGrantChoice(row);
        if (!choice || (choice.definitionId ? choice.definitionId !== INTERDISCIPLINARY_SPECIALTY_ID : choice.name !== "Interdisciplinary Specialty")) return row;
        const instance = `grant-${producer}-${index}`;
        return removed.some(child => child.grantedBy === `Merit:${producer}` && child.instanceId &&
          (child.instanceId === instance || child.instanceId.startsWith(`${instance}-free`) && child.instanceId.slice(instance.length).replaceAll("-free", "") === "")) ? "" : row;
      });
      if (next.some((row, index) => row !== rows[index])) configuration = { ...configuration, [key]: next };
    }
    return configuration === item.configuration ? item : { ...item, configuration };
  });
}
