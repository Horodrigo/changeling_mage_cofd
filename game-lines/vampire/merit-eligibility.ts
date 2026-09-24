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
  const requiredIdentity: Record<string, string> = {
    "Star-Crossed": "star-crossed",
    Xiao: "xiao",
    Typhos: "typhos",
    Inconnu: "inconnu",
    Moirai: "moirai",
    "Architects of the Monolith": "architects-of-the-monolith",
    Erzsébet: "erzsebet",
    "Moda Mortale": "moda-mortale",
    Nelapsi: "nelapsi",
    Daimonion: "daimonion",
    "Dead Wolves": "dead-wolves",
    Oberlochs: "oberlochs",
    Verlice: "verlice",
    Wickers: "wickers",
    Yarilo: "yarilo",
    Kuufukuji: "kuufukuji",
    Norvegi: "norvegi",
    Qedeshah: "qedeshah",
    Acteius: "acteius",
    "Keepers of the Dark": "keepers-of-the-dark",
    Necropolis: "nosferatu",
    Melissidae: "melissidae",
    Rotgrafen: "rotgrafen",
    Warumono: "warumono",
  };
  const identity = requiredIdentity[merit.category];
  if (identity && !(context.archetypes ?? []).includes(identity)) return false;
  if (!isMortalSupernaturalMerit(merit)) return true;
  const count = zirnitraMortalMeritCount(context);
  const limit = zirnitraMortalMeritLimit(zirnitraRating);
  if (merit.id === "hurt-locker:supernatural-resistance" && count === 0) return false;
  return (context.merits ?? []).some((owned) => owned.dots > 0 && owned.name === merit.name) ? count <= limit : count < limit;
}
