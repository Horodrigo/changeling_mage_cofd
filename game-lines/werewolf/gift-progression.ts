import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import type { RenownId, WerewolfReferenceCatalog } from "./catalogs/reference";
import { RENOWN_IDS } from "./mechanics";
import { renownRatings, werewolfIds } from "./rules";

export type RenownGrant = { id: string; renown: RenownId; facetId: string | null };
export type GiftUnlock = { id: string; giftId: string };
export type FacetCost = "affinityGift" | "nonAffinityGift" | "shadowFacet" | "wolfFacet" | "additionalMoonGift" | "additionalMoonFacet";
export type GiftProblem = "missingFacet" | "facetKnown" | "facetRenown" | "moonOrder" | "moonAuthorization" | "giftSource" | "giftAllocation" | "giftDependency" | "renownDeed";

const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
export function renownGrants(character: CharacterSheet): RenownGrant[] {
  const values = character.line_data.renown_grants;
  return Array.isArray(values) ? values.filter((item): item is RenownGrant => {
    const row = record(item);
    return typeof row.id === "string" && Boolean(row.id) && RENOWN_IDS.includes(row.renown as RenownId) && (row.facetId === null || typeof row.facetId === "string");
  }) : [];
}
export function giftUnlocks(character: CharacterSheet): GiftUnlock[] {
  const values = character.line_data.gift_unlocks;
  return Array.isArray(values) ? values.filter((item): item is GiftUnlock => {
    const row = record(item);
    return typeof row.id === "string" && Boolean(row.id) && typeof row.giftId === "string" && Boolean(row.giftId);
  }) : [];
}
export const knownWerewolfFacets = (character: CharacterSheet) => [...werewolfIds(character.line_data.creation_facets), ...werewolfIds(character.line_data.learned_facets),
  ...werewolfIds(character.line_data.renown_facets), ...renownGrants(character).flatMap(grant => grant.facetId ? [grant.facetId] : [])];

export function facetDefinition(id: string, catalog: WerewolfGiftCatalog) {
  const gift = catalog.gifts.find(item => item.facets.some(facet => facet.id === id));
  const facet = gift?.facets.find(item => item.id === id);
  return gift && facet ? { gift, facet } : null;
}
export function giftUnlocked(character: CharacterSheet, giftId: string, catalog: WerewolfGiftCatalog) {
  const gift = catalog.gifts.find(item => item.id === giftId);
  return Boolean(gift && (gift.facets.some(facet => werewolfIds(character.line_data.creation_facets).includes(facet.id))
    || giftUnlocks(character).some(unlock => unlock.giftId === giftId)));
}

/** WTF2 pp. 99, 114–115: Auspice Moon grants are distinct from creation and paid Facets. */
export function synchronizeRenownFacets(character: CharacterSheet, reference: WerewolfReferenceCatalog, catalog: WerewolfGiftCatalog) {
  const auspice = reference.auspices.find(item => item.id === character.line_data.auspice_id);
  const moon = catalog.gifts.find(item => item.id === auspice?.moonGiftId);
  const renown = renownRatings(character.line_data.renown), creation = werewolfIds(character.line_data.creation_facets);
  character.line_data.renown_facets = moon?.facets.filter(facet => facet.level && facet.level <= renown[facet.renown] && !creation.includes(facet.id)).map(facet => facet.id) ?? [];
}

/** Unlocking a Shadow Gift includes its first Facet; a Wolf Gift has no unlock cost. */
export function facetPurchaseTerms(character: CharacterSheet, id: string, reference: WerewolfReferenceCatalog, catalog: WerewolfGiftCatalog, authorization = "", learningSource = ""):
  { problem?: GiftProblem; costKey?: FacetCost; unlock?: boolean } {
  const selected = facetDefinition(id, catalog);
  if (!selected) return { problem: "missingFacet" };
  const { gift, facet } = selected, known = knownWerewolfFacets(character), renown = renownRatings(character.line_data.renown);
  if (known.includes(id)) return { problem: "facetKnown" };
  if (renown[facet.renown] < 1) return { problem: "facetRenown" };
  if (gift.kind === "wolf") return { costKey: "wolfFacet", unlock: false };
  const unlocked = giftUnlocked(character, gift.id, catalog);
  if (gift.kind === "shadow") {
    if (unlocked) return { costKey: "shadowFacet", unlock: false };
    if (!learningSource.trim() || learningSource.length > 240) return { problem: "giftSource" };
    const auspice = reference.auspices.find(item => item.id === character.line_data.auspice_id), tribe = reference.tribes.find(item => item.id === character.line_data.tribe_id);
    const affinity = [...(auspice?.giftIds ?? []), ...(tribe?.giftIds ?? [])].includes(gift.id);
    return { costKey: affinity ? "affinityGift" : "nonAffinityGift", unlock: true };
  }
  const auspice = reference.auspices.find(item => item.id === character.line_data.auspice_id);
  if (gift.id === auspice?.moonGiftId) return { problem: "facetKnown" };
  if (!authorization.trim() || authorization.length > 240) return { problem: "moonAuthorization" };
  const level = facet.level;
  if (!level || level > renown[facet.renown]) return { problem: "facetRenown" };
  if (level !== 1 && (!unlocked || gift.facets.some(other => other.level && other.level < level && !known.includes(other.id)))) return { problem: "moonOrder" };
  if (level === 1 && unlocked) return { problem: "giftAllocation" };
  return { costKey: unlocked ? "additionalMoonFacet" : "additionalMoonGift", unlock: !unlocked };
}

/** Credits never unlock Shadow families for free. WTF2 p. 99 also permits a Wolf Facet. */
export function renownGrantProblem(character: CharacterSheet, grant: RenownGrant, facetId: string, catalog: WerewolfGiftCatalog): GiftProblem | undefined {
  const selected = facetDefinition(facetId, catalog);
  if (!selected) return "missingFacet";
  if (knownWerewolfFacets(character).includes(facetId)) return "facetKnown";
  if (selected.facet.renown !== grant.renown || renownRatings(character.line_data.renown)[grant.renown] < 1) return "facetRenown";
  if (selected.gift.kind === "moon" || (selected.gift.kind === "shadow" && !giftUnlocked(character, selected.gift.id, catalog))) return "giftAllocation";
}

/** Called on edit and refunds: no silent removal of paid powers or spent credits. */
export function giftProgressionIssues(character: CharacterSheet, reference: WerewolfReferenceCatalog, catalog: WerewolfGiftCatalog) {
  const problems = new Map<string, GiftProblem>(), known = knownWerewolfFacets(character), renown = renownRatings(character.line_data.renown);
  const add = (problem: GiftProblem, id: string) => problems.set(`${problem}:${id}`, problem);
  const auspice = reference.auspices.find(item => item.id === character.line_data.auspice_id);
  for (const id of known) {
    if (known.filter(other => other === id).length > 1) add("giftAllocation", id);
    const selected = facetDefinition(id, catalog);
    if (!selected) { add("missingFacet", id); continue; }
    const { gift, facet } = selected;
    if (renown[facet.renown] < (gift.kind === "moon" ? facet.level ?? 1 : 1)) add("facetRenown", id);
    if (gift.kind !== "wolf" && gift.id !== auspice?.moonGiftId && !giftUnlocked(character, gift.id, catalog)) add("giftDependency", id);
    if (gift.kind === "moon" && gift.facets.some(other => other.level && facet.level && other.level < facet.level && !known.includes(other.id))) add("moonOrder", id);
  }
  const grants = renownGrants(character), unlocks = giftUnlocks(character);
  for (const key of ["renown_grants", "gift_unlocks"] as const) {
    const raw = character.line_data[key], parsed = key === "renown_grants" ? grants : unlocks;
    if (raw !== undefined && (!Array.isArray(raw) || raw.length !== parsed.length)) add("giftAllocation", key);
  }
  for (const unlock of unlocks) {
    if (unlocks.filter(other => other.giftId === unlock.giftId || other.id === unlock.id).length > 1) add("giftAllocation", unlock.id);
    const gift = catalog.gifts.find(item => item.id === unlock.giftId);
    if (!gift || gift.kind === "wolf" || gift.facets.some(facet => werewolfIds(character.line_data.creation_facets).includes(facet.id))) add("giftAllocation", unlock.id);
  }
  for (const grant of grants) {
    if (grants.filter(other => other.id === grant.id).length > 1 || grant.renown === auspice?.renown || renown[grant.renown] < 1) add("giftAllocation", grant.id);
    if (grant.facetId) {
      const selected = facetDefinition(grant.facetId, catalog);
      if (!selected || selected.gift.kind === "moon" || selected.facet.renown !== grant.renown) add("giftAllocation", grant.id);
    }
  }
  return problems;
}

export const giftProgressionProblems = (character: CharacterSheet, reference: WerewolfReferenceCatalog, catalog: WerewolfGiftCatalog) =>
  [...new Set(giftProgressionIssues(character, reference, catalog).values())];
