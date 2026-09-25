import { meritPrerequisitesMet, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";

const CLAN_MERIT_CATEGORIES = new Set(["Dukhan", "Gangrel", "Nosferatu"]);
const BLOODLINE_MERIT_CATEGORIES = new Set([
  "Acteius", "Daimonion", "Dead Wolves", "Erzsébet", "Keepers of the Dark", "Kuufukuji", "Melissidae", "Moda Mortale", "Nelapsi", "Norvegi", "Oberlochs", "Qedeshah", "Rotgrafen", "Star-Crossed", "Typhos", "Verlice", "Warumono", "Wickers", "Xiao", "Yarilo",
]);
const COVENANT_MERIT_CATEGORIES = new Set([
  "Ahl al-Mumit", "al-Amin", "Architects of the Monolith", "Carthian Movement", "Circle of the Crone", "Faction", "Fir'awn", "Gallows Post", "Inconnu", "Invictus", "Lancea et Sanctum", "Legion of the Green", "Mandragora", "Moirai", "Ordo Dracul", "Tradition", "Weihan Cynn",
]);

export function vampireMeritFilterCategory(merit: Pick<MeritDefinition, "category">) {
  const category = merit.category;
  if (CLAN_MERIT_CATEGORIES.has(category)) return "Clan";
  if (BLOODLINE_MERIT_CATEGORIES.has(category)) return "Bloodline";
  if (COVENANT_MERIT_CATEGORIES.has(category)) return "Covenant";
  if (["Necropolis", "Wyrm's Nest"].includes(category)) return "Locations";
  if (category === "Fighting Style") return "Fighting Styles";
  if (category === "Social Style") return "Social Styles";
  if (["Style", "Crúac Style"].includes(category)) return "Supernatural Styles";
  if (category === "Nereid") return "Restricted";
  return category;
}

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
