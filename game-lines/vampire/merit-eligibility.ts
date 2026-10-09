import { meritContextForSheet, meritPrerequisitesMet, meritTextPrerequisitesMet, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { canonicalTrait, requirementTrait, textRequirementMet } from "@/lib/merit-requirements";
import { VAMPIRE_DISCIPLINES } from "./creation-rules";
import type { VampireCovenantDefinition, VampirePurchasablePower } from "./catalog-types";
import { BLOODCRAFTING_ID, bloodcraftingConfigurationMet } from "./bloodcrafting";

export type VampireMeritContext = MeritPrerequisiteContext & {
  bloodlineId?: string;
  hasTouchstone?: boolean;
  clanId?: string;
  creation?: boolean;
  conditionIds?: readonly string[];
  devotionIds?: readonly string[];
  devotionCatalog?: readonly VampirePurchasablePower[];
  covenants?: readonly VampireCovenantDefinition[];
  statusSubstitution?: number;
};

export function vampireMeritTraits(data: CharacterSheet["line_data"]): Record<string, number> {
  const disciplines = data.disciplines as Record<string, number> | undefined;
  const sorcery = data.blood_sorcery as Record<string, number> | undefined;
  return { ...Object.fromEntries(VAMPIRE_DISCIPLINES.map(name => [name, 0])), ...disciplines,
    "Blood Potency": Number(data.blood_potency ?? 1), Humanity: Number(data.humanity ?? 7),
    "Crúac": Number(sorcery?.cruac_rating ?? 0), "Theban Sorcery": Number(sorcery?.theban_rating ?? 0) };
}

export function vampireMeritContextForSheet(sheet: CharacterSheet, catalog: readonly MeritDefinition[], archetypes: readonly string[], sources: Pick<VampireMeritContext, "devotionCatalog" | "covenants"> = {}): VampireMeritContext {
  return { ...meritContextForSheet(sheet, catalog, archetypes, sheet.line_data.merit_granted_skill_bonuses as Record<string, number> | undefined), statusMeritIds: ["vtr-kindred-status"],
    ...sources, clanId: String(sheet.line_data.clan_id ?? ""), creation: false,
    conditionIds: Array.isArray(sheet.current_state.conditions) ? sheet.current_state.conditions.map(item => String(item?.id ?? "")) : [],
    devotionIds: Array.isArray(sheet.line_data.devotion_ids) ? sheet.line_data.devotion_ids.map(String) : [],
    traits: vampireMeritTraits(sheet.line_data), bloodlineId: String(sheet.line_data.bloodline_id ?? ""),
    hasTouchstone: Array.isArray(sheet.line_data.touchstones) && sheet.line_data.touchstones.some(item => item && typeof item === "object" && String(item.name ?? "").trim()) };
}

const IDENTITIES = ["Daeva", "Gangrel", "Mekhet", "Nosferatu", "Ventrue", "Acteius", "Daimonion", "Erzsébet", "Kuufukuji", "Melissidae", "Moda Mortale", "Nelapsi", "Norvegi", "Qedeshah", "Rotgrafen", "Star-Crossed", "Typhos", "Verlice", "Warumono", "Xiao", "Yarilo", "Inconnu", "Moirai", "Architects of the Monolith"];
const IDENTITY_ALIASES: Record<string, string> = { keeperofthedark: "keepers-of-the-dark", deadwolf: "dead-wolves", oberloch: "oberlochs", wicker: "wickers", hollowmekhet: "hollow-mekhet", architectofthemonolith: "architects-of-the-monolith" };

function ownedMerits(context: VampireMeritContext, id: string) {
  return (context.merits ?? []).filter(item => item.dots > 0 && resolveMeritDefinition(item, context.meritCatalog ?? [])?.id === id);
}

function affiliationNames(context: VampireMeritContext, domain: string) {
  const key = canonicalTrait(domain === "Carthian" ? "carthian-movement" : domain === "Clan" ? context.clanId : domain);
  const definition = context.covenants?.find(item => [item.id, item.name, item.translatedName].some(name => canonicalTrait(name) === key));
  return new Set([key, ...definition ? [definition.id, definition.name, definition.translatedName].map(canonicalTrait) : []]);
}

function kindredStatus(context: VampireMeritContext, domain: string) {
  const names = affiliationNames(context, domain);
  return Math.max(0, ...ownedMerits(context, "vtr-kindred-status").filter(item => names.has(canonicalTrait(item.configuration?.group))).map(item => item.dots));
}

function isCruacStyle(merit: MeritDefinition) {
  return merit.sourceId === "h-vtr-agony-ecstasy" && ["Tradition", "Crúac Style"].includes(merit.category) && merit.id !== "h-vtr-agony-ecstasy:void-familiar";
}

export function vampireTextPrerequisitesMet(value: string | undefined, context: VampireMeritContext): boolean {
  if (!value) return true;
  return textRequirementMet(value.replace(/of equal or higher rating/gi, "equal to rating").replace(/Rituals Specialty in Academics or Occult/gi, "Rituals Specialty").replace(/Embraced as a child or teenager/gi, "Embraced as a child/teenager"), context, context.meritCatalog ?? [], clause => {
    const name = clause.replace(/\s*(?:•+|\d+\+?).*$/, "").trim(), key = canonicalTrait(name);
    const identity = IDENTITY_ALIASES[key] ?? IDENTITIES.find(item => canonicalTrait(item) === key);
    if (identity) return Boolean(context.archetypes?.some(item => canonicalTrait(item) === canonicalTrait(identity)));
    if (/^(.+?) Status (•+|\d+)$/i.test(clause)) {
      const [, domain, dots] = clause.match(/^(.+?) Status (•+|\d+)$/i)!;
      return Math.max(kindredStatus(context, domain), /^(?:Carthian|Carthian Movement)$/i.test(domain) ? context.statusSubstitution ?? 0 : 0) >= (dots.startsWith("•") ? dots.length : Number(dots));
    }
    if (/^(?:Kindred|Vampire|Embraced as a child\/teenager)$/i.test(clause)) return context.gameLine === "VtR";
    if (/^Ghoul(?: with .*)?$/i.test(clause)) return false;
    if (/^Human patient$/i.test(clause)) return context.gameLine === "CofD" || context.gameLine === "VtR" && Boolean(context.mortalMeritsAllowed);
    if (/^not part of a bloodline$/i.test(clause)) return !context.bloodlineId;
    if (/^attached Touchstone$/i.test(clause)) return Boolean(context.hasTouchstone);
    if (/^no Potent Curse$/i.test(clause)) return !context.conditionIds?.includes("vtr-better-feared:potent-curse");
    if (/^cannot have a Crúac Style Merit$/i.test(clause)) return !(context.merits ?? []).some(item => { const definition = resolveMeritDefinition(item, context.meritCatalog ?? []); return item.dots > 0 && definition && isCruacStyle(definition); });
    if (/^Not a member of the Circle of the Crone$/i.test(clause)) return !context.archetypes?.includes("circle-of-the-crone");
    if (/^Shadow Cult$/i.test(clause)) return Boolean(context.covenants?.some(item => item.group === "shadow-cult" && (context.archetypes?.includes(item.id) || ownedMerits(context, "core-2ed:mystery-cult-initiation").some(merit => affiliationNames(context, item.id).has(canonicalTrait(merit.configuration?.cult))))));
    const initiation = clause.match(/^(Inconnu|Moirai) Initiation (•+)$/i);
    if (initiation) return ownedMerits(context, "core-2ed:mystery-cult-initiation").some(item => item.dots >= initiation[2].length && affiliationNames(context, initiation[1]).has(canonicalTrait(item.configuration?.cult)));
    const cult = clause.match(/^(Mystery Cult Initiation|Dynasty Membership) \((.+)\) (•+)$/i);
    if (cult) return ownedMerits(context, cult[1] === "Dynasty Membership" ? "vtr-dynasty-membership" : "core-2ed:mystery-cult-initiation").some(item => item.dots >= cult[3].length && canonicalTrait(item.configuration?.cult ?? item.configuration?.dynasty) === canonicalTrait(cult[2]));
    if (/^Cannot have Kindred Status in the chosen covenant$/i.test(clause)) {
      const chosen = String(context.configuration?.group ?? "");
      if (context.configuration && !chosen.trim()) return false;
      return chosen ? kindredStatus(context, chosen) === 0 : Boolean(context.covenants?.some(item => kindredStatus(context, item.id) === 0));
    }
    if (/^no more than Status • in the organization$/i.test(clause)) {
      const group = canonicalTrait(context.configuration?.group);
      if (context.configuration && !group) return false;
      return !(context.merits ?? []).some(item => item.dots > 1 && ["core-2ed:status", "vtr-kindred-status"].includes(resolveMeritDefinition(item, context.meritCatalog ?? [])?.id ?? "") && group && canonicalTrait(item.configuration?.group) === group);
    }
    if (/^a Mental Skill Specialty$/i.test(clause)) return context.specializations?.some(item => ["Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science"].includes(item.skill) && item.name.trim()) ?? false;
    if (/^Crafts Specialty$/i.test(clause)) return context.specializations?.some(item => item.skill === "Crafts" && item.name.trim()) ?? false;
    if (/^Sailing Specialty in Athletics$/i.test(clause)) return context.specializations?.some(item => item.skill === "Athletics" && ["sailing", "navegacao", "velejar", "vela"].includes(canonicalTrait(item.name))) ?? false;
    if (/^Medicine Specialty \(Surgery\)$/i.test(clause)) return context.specializations?.some(item => item.skill === "Medicine" && ["surgery", "cirurgia"].includes(canonicalTrait(item.name))) ?? false;
    if (/^Rituals Specialty$/i.test(clause)) return context.specializations?.some(item => ["Academics", "Occult"].includes(item.skill) && ["rituals", "rituais"].includes(canonicalTrait(item.name))) ?? false;
    if (/Specialt(?:y|ies)/i.test(clause)) return meritTextPrerequisitesMet(clause, context);
    if (/^no Status Merit over ••$/i.test(clause)) return !(context.merits ?? []).some(item => item.dots > 2 && ["core-2ed:status", "vtr-kindred-status"].includes(resolveMeritDefinition(item, context.meritCatalog ?? [])?.id ?? ""));
    const relative = clause.match(/^(.+?) (?:equal to rating|of equal or higher rating)$/i);
    if (relative) {
      const ids: Record<string, string> = { safeplace: "core-2ed:safe-place", fame: "core-2ed:fame" };
      return ownedMerits(context, ids[canonicalTrait(relative[1])] ?? "").some(item => item.dots >= (context.selectedDots ?? 1));
    }
    if (/^one Carthian Law$/i.test(clause)) return (context.merits ?? []).some(item => item.dots > 0 && resolveMeritDefinition(item, context.meritCatalog ?? [])?.category === "Carthian Law");
    if (/^Two dots in a Social Merit$/i.test(clause)) return (context.merits ?? []).some(item => item.dots >= 2 && resolveMeritDefinition(item, context.meritCatalog ?? [])?.category === "Social");
    if (/^chosen Skill •••$/i.test(clause)) {
      const skill = String(context.configuration?.skill ?? "");
      if (context.configuration && !skill) return false;
      return ownedMerits(context, "core-2ed:hobbyist-clique").some(item => {
        const selected = String(item.configuration?.skill ?? skill);
        return selected ? (!skill || selected === skill) && requirementTrait(selected, context) >= 3 : Object.values(context.skills ?? {}).some(rating => rating >= 3);
      });
    }
    if (/^No Covenant Status$/i.test(clause)) return !context.covenants?.some(item => kindredStatus(context, item.id) > 0);
    if (/^at least three Devotions using the signature Discipline of the chosen clan$/i.test(clause)) {
      const signature: Record<string, string> = { daeva: "Majesty", gangrel: "Protean", mekhet: "Auspex", nosferatu: "Nightmare", ventrue: "Dominate" };
      const chosen = canonicalTrait(context.configuration?.clan);
      if (context.configuration && !chosen) return false;
      const valid = (clan: string) => clan !== context.clanId && new Set(context.devotionIds).size >= 3 && (context.devotionCatalog ?? []).filter(item => context.devotionIds?.includes(item.id) && signature[clan] && new RegExp(`\\b${signature[clan]}\\s+[•\\d]`).test(item.prerequisites ?? "")).length >= 3;
      return chosen ? valid(chosen) : Object.keys(signature).some(valid);
    }
    return undefined;
  });
}

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
  const catalog = context.meritCatalog ?? [];
  return (context.merits ?? []).filter((merit) => merit.dots > 0 && resolveMeritDefinition(merit, catalog)?.mortalOnly === true).length;
}

export function vampireMeritEligible(merit: MeritDefinition, context: VampireMeritContext, zirnitraRating: number) {
  if (merit.id === BLOODCRAFTING_ID && context.configuration !== undefined && !bloodcraftingConfigurationMet(context.selectedDots ?? 2, context.configuration, context.specializations)) return false;
  if (merit.sourceId === "h-vtr-fire-revolution" && merit.category === "Carthian Movement" && (context.selectedDots ?? Math.min(...merit.ratings)) <= 2 && !["h-vtr-fire-revolution:enforcement", "h-vtr-fire-revolution:firebomber", "h-vtr-fire-revolution:fire-branded"].includes(merit.id) && ownedMerits(context, "h-vtr-fire-revolution:sophocrat").length) context = { ...context, statusSubstitution: Math.max(requirementTrait("Academics", context), requirementTrait("Science", context)) };
  if (!meritPrerequisitesMet(merit, { ...context, mortalMeritsAllowed: context.gameLine === "VtR" && zirnitraRating > 0 }, vampireTextPrerequisitesMet)) return false;
  if (merit.sourceId === "h-vtr-agony-ecstasy" && merit.id !== "vtr-sotc:chorister" && ["Circle of the Crone", "Tradition", "Crúac Style"].includes(merit.category) && !context.archetypes?.includes("circle-of-the-crone")) return false;
  if (merit.sourceId === "h-vtr-fire-revolution" && ["Carthian Movement", "Carthian Law", "Faction"].includes(merit.category) && !context.archetypes?.includes("carthian-movement")) return false;
  const owned = context.merits ?? [], catalog = context.meritCatalog ?? [];
  if (merit.id === "vtr-strange-shades:twisted-shadow" && !context.creation) return false;
  if (merit.id === "vtr-strange-shades:speed-of-thought") {
    const mental = ["Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science"];
    const chosen = String(context.configuration?.skill ?? "");
    if (context.configuration && !chosen) return false;
    if (!mental.some(skill => (!chosen || skill === chosen) && requirementTrait(skill, context) >= 2)) return false;
  }
  if (merit.id === "h-vtr-agony-ecstasy:unmasked-devil" && !["Celerity", "Resilience", "Vigor"].slice(0, context.selectedDots ?? 1).every(name => requirementTrait(name, context) >= 1)) return false;
  const styles = owned.filter(item => { const definition = resolveMeritDefinition(item, catalog); return item.dots > 0 && definition && isCruacStyle(definition); });
  if (isCruacStyle(merit) && (styles.some(item => resolveMeritDefinition(item, catalog)?.id !== merit.id) || ownedMerits(context, "h-vtr-agony-ecstasy:mythologist-advanced").length)) return false;
  if (merit.id === "h-vtr-fire-revolution:cultist-of-self" && kindredStatus(context, "Carthian") > 3) return false;
  if (["core-2ed:status", "vtr-kindred-status"].includes(merit.id)) {
    if (ownedMerits(context, "vtr-sin-again:social-butterfly").length && (context.selectedDots ?? 1) > 2) return false;
    if ((context.selectedDots ?? 1) > 1 && ownedMerits(context, "vtr-false-gods:invisible-hand").some(item => canonicalTrait(item.configuration?.group) === canonicalTrait(context.configuration?.group))) return false;
  }
  if (merit.id === "vtr-kindred-status") {
    const group = String(context.configuration?.group ?? "");
    if (affiliationNames(context, "Carthian").has(canonicalTrait(group)) && ownedMerits(context, "h-vtr-fire-revolution:cultist-of-self").length && (context.selectedDots ?? 1) > 3) return false;
    if (ownedMerits(context, "h-vtr-agony-ecstasy:reviled").some(item => affiliationNames(context, String(item.configuration?.group ?? "")).has(canonicalTrait(group)))) return false;
  }
  if (!isMortalSupernaturalMerit(merit)) return true;
  const count = zirnitraMortalMeritCount(context);
  const limit = zirnitraMortalMeritLimit(zirnitraRating);
  if (merit.id === "hurt-locker:supernatural-resistance" && count === 0) return false;
  return (context.merits ?? []).some((owned) => owned.dots > 0 && resolveMeritDefinition(owned, context.meritCatalog ?? [])?.id === merit.id) ? count <= limit : count < limit;
}
