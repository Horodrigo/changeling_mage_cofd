import type { MeritSelection } from "./core/character/character-types";

const dots = (value: unknown) => Math.max(0, Math.trunc(Number(value) || 0));

export const creationMeritDots = (merit: MeritSelection) => {
  if (merit.creationDots !== undefined) return dots(merit.creationDots);
  if (merit.experienceDots === undefined) return dots(merit.dots);
  if (merit.grantedBy) return Math.max(1, dots(merit.dots) - dots(merit.experienceDots));
  return 0;
};
export const experienceMeritDots = (merit: MeritSelection) => dots(merit.experienceDots);

export function creationMerits(merits: MeritSelection[] = []) {
  return merits
    .filter((merit) => !merit.grantedBy && creationMeritDots(merit) > 0)
    .map((merit) => ({ ...merit, dots: creationMeritDots(merit) }));
}

/** Replaces only creation allocations and preserves every Experience allocation. */
export function mergeCreationMerits(existing: MeritSelection[] = [], selected: MeritSelection[] = []) {
  const selectedIds = new Set(selected.map((merit) => merit.instanceId).filter(Boolean));
  const result = existing
    .filter((merit) => !merit.grantedBy)
    .filter((merit) => experienceMeritDots(merit) > 0 && !selectedIds.has(merit.instanceId))
    .map((merit) => ({ ...merit, creationDots: 0, experienceDots: experienceMeritDots(merit), dots: experienceMeritDots(merit) }));

  for (const merit of selected) {
    const previous = existing.find((item) => item.instanceId && item.instanceId === merit.instanceId) ?? (merit.grantedBy ? existing.find((item) => item.name === merit.name && item.grantedBy === merit.grantedBy) : undefined);
    const creation = dots(merit.dots);
    const experience = previous ? experienceMeritDots(previous) : 0;
    result.push({ ...(previous ?? {}), ...merit, creationDots: creation, experienceDots: experience, dots: creation + experience });
  }
  return result;
}

export function addExperienceMeritDots(merit: MeritSelection, amount: number) {
  const creation = creationMeritDots(merit);
  const experience = experienceMeritDots(merit) + dots(amount);
  merit.creationDots = creation;
  merit.experienceDots = experience;
  merit.dots = creation + experience;
}

export function removeExperienceMeritDots(merit: MeritSelection, amount: number) {
  const creation = creationMeritDots(merit);
  const experience = Math.max(0, experienceMeritDots(merit) - dots(amount));
  merit.creationDots = creation;
  merit.experienceDots = experience;
  merit.dots = creation + experience;
  return merit.dots;
}
