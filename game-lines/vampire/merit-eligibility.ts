import { meritPrerequisitesMet, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";

export function isMortalSupernaturalMerit(merit: MeritDefinition) {
  return merit.mortalOnly === true;
}

export function zirnitraMortalMeritLimit(rating: number) {
  const dots = Math.max(0, Math.min(5, Math.floor(Number(rating) || 0)));
  return dots === 5 ? Number.POSITIVE_INFINITY : dots;
}

export function zirnitraMortalMeritCount(context: MeritPrerequisiteContext) {
  const names = new Set((context.meritCatalog ?? []).filter(isMortalSupernaturalMerit).map((merit) => merit.name));
  return (context.merits ?? []).filter((merit) => merit.dots > 0 && names.has(merit.name)).length;
}

export function vampireMeritEligible(merit: MeritDefinition, context: MeritPrerequisiteContext, zirnitraRating: number) {
  if (!meritPrerequisitesMet(merit, context)) return false;
  if (!isMortalSupernaturalMerit(merit)) return true;
  const count = zirnitraMortalMeritCount(context);
  const limit = zirnitraMortalMeritLimit(zirnitraRating);
  if (merit.id === "hurt-locker:supernatural-resistance" && count === 0) return false;
  return (context.merits ?? []).some((owned) => owned.dots > 0 && owned.name === merit.name) ? count <= limit : count < limit;
}
