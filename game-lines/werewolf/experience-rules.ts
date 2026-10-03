import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { addExperienceMeritDots, experienceMeritDots, removeExperienceMeritDots } from "@/lib/merit-progression";
import { meritPrerequisitesMet, meritSelectionProblems, meritRatingsFor, REPEATABLE_MERITS, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import type { WerewolfReferenceCatalog } from "./catalogs/reference";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import type { WerewolfRiteCatalog } from "./catalogs/rites";
import type { RenownId } from "./catalogs/reference";
import { RENOWN_IDS } from "./mechanics";
import { facetDefinition, facetPurchaseTerms, giftProgressionIssues, giftUnlocks, renownGrants, renownGrantProblem, synchronizeRenownFacets, type FacetCost, type GiftProblem } from "./gift-progression";
import { boundedPrimalUrge, primalUrgeLevel } from "./creation-rules";
import { resolveWerewolfMerits, werewolfMeritDefinition } from "./creation-grants";
import { werewolfMeritPrerequisitesMet, werewolfMeritSelectionProblems, type WerewolfMeritContext } from "./merit-rules";
import { renownRatings, werewolfDerived, werewolfFormTraits, werewolfIds, werewolfMemberTraits } from "./rules";
import type { WerewolfTotemCatalog } from "./catalogs/totem";
import { resolveTotemAdvantage } from "./totem-benefits";
import { totemSelection } from "./totem-rules";

export type WerewolfPurchase =
  | { kind: "trait"; group: "attributes" | "skills"; name: string; target: number }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "merit"; definitionId: string; target: number; instanceId?: string; configuration: MeritConfiguration }
  | { kind: "primalUrge"; target: number }
  | { kind: "rite"; definitionId: string; learningSource: string }
  | { kind: "renown"; name: RenownId; target: number; deed: string }
  | { kind: "facet"; definitionId: string; authorization: string; learningSource: string };
export type WerewolfAdvancementUndo =
  | { kind: "trait"; group: "attributes" | "skills"; name: string; amount: number }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "merit"; definitionId: string; name: string; instanceId: string; dots: number; previousConfiguration?: MeritConfiguration; purchasedConfiguration: MeritConfiguration }
  | { kind: "primalUrge"; amount: number }
  | { kind: "rite"; definitionId: string; dots: number }
  | { kind: "renown"; name: RenownId; auspiceId: string }
  | { kind: "facet"; definitionId: string; giftId: string; unlock: boolean; costKey: FacetCost };
export type WerewolfExperienceEntry = { id: string; cost: number; createdAt: string; purchase: WerewolfPurchase; undo: WerewolfAdvancementUndo };
export type WerewolfAdvancementCatalogs = { reference: WerewolfReferenceCatalog; gifts: WerewolfGiftCatalog; rites: WerewolfRiteCatalog; merits: readonly MeritDefinition[]; totem: WerewolfTotemCatalog };
type Problem = GiftProblem | "invalidPurchase" | "traitMaximum" | "specialty" | "missingMerit" | "meritPrerequisites" | "meritChoices" | "meritInstance" | "grant" | "insufficientExperience" | "refundMissing" | "refundDependent" | "purchaseDependent" | "missingRite" | "riteKnown" | "riteTribe" | "riteSource";
export class WerewolfAdvancementError extends Error {
  constructor(readonly problem: Problem) { super(problem); }
}
const fail = (problem: Problem): never => { throw new WerewolfAdvancementError(problem); };
const natural = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
export const werewolfExperienceValue = (value: unknown) => { const parsed = Number(value); return Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : 0; };
const balance = werewolfExperienceValue;
export const WEREWOLF_HISTORY_KEY = "werewolf_experience_history";
const validGiftLedgers = (character: CharacterSheet) => {
  for (const [key, entries] of [["renown_grants", renownGrants(character)], ["gift_unlocks", giftUnlocks(character)]] as const) {
    const raw = character.line_data[key];
    if (raw !== undefined && (!Array.isArray(raw) || raw.length !== entries.length)) fail("giftAllocation");
  }
};

/** Pure Hishu prerequisite contexts are shared by the XP chooser and its transaction guard. */
export function werewolfAdvancementContexts(character: CharacterSheet, catalogs: Pick<WerewolfAdvancementCatalogs, "reference" | "gifts" | "merits" | "totem">): { core: MeritPrerequisiteContext; own: WerewolfMeritContext } {
  const hishu = werewolfFormTraits(character, "hishu", catalogs), member = werewolfMemberTraits(character, catalogs);
  return {
    core: { gameLine: "WtF", archetypes: ["werewolf"], attributes: hishu.attributes, skills: member.skills, size: hishu.size, merits: member.merits, meritCatalog: catalogs.merits },
    own: { attributes: hishu.attributes, skills: member.skills, harmony: Number(character.line_data.harmony ?? 7), primalUrge: boundedPrimalUrge(character.line_data.primal_urge),
      renown: renownRatings(character.line_data.renown), tribeId: String(character.line_data.tribe_id ?? ""), auspice: catalogs.reference.auspices.find(item => item.id === character.line_data.auspice_id),
      forms: catalogs.reference.forms, gifts: catalogs.gifts.gifts, merits: resolveWerewolfMerits(member.merits, catalogs.merits) },
  };
}

export const canAdvanceWerewolfGrant = (merit: CharacterSheet["merits"][number], catalog: readonly MeritDefinition[]) =>
  merit.grantedBy === "werewolf:creation-totem" && werewolfMeritDefinition(merit, catalog)?.id === "wtf-2ed:totem";

/** WTF2 p. 84; Specialties use CofD p. 77. Locale and the combat form never alter a quote. */
export function werewolfPurchaseQuote(character: CharacterSheet, purchase: WerewolfPurchase, catalogs: WerewolfAdvancementCatalogs) {
  if (character.game_line !== "WtF") fail("invalidPurchase");
  if (!purchase || !["trait", "specialty", "primalUrge", "merit", "rite", "renown", "facet"].includes(purchase.kind)) fail("invalidPurchase");
  const costs = catalogs.reference.experienceCosts;
  if (purchase.kind === "renown" || purchase.kind === "facet") validGiftLedgers(character);
  let cost: number;
  if (purchase.kind === "trait") {
    if (!["attributes", "skills"].includes(purchase.group)) fail("invalidPurchase");
    const names = Object.values(purchase.group === "attributes" ? ATTRIBUTES : SKILLS).flat();
    if (!names.some(name => name === purchase.name)) fail("invalidPurchase");
    const current = Number(character[purchase.group][purchase.name] ?? (purchase.group === "attributes" ? 1 : 0));
    const maximum = primalUrgeLevel(catalogs.reference, character.line_data.primal_urge).traitMaximum;
    if (!natural(current) || !natural(purchase.target) || purchase.target <= current) fail("invalidPurchase");
    if (purchase.target > maximum) fail("traitMaximum");
    cost = (purchase.target - current) * costs[purchase.group === "attributes" ? "attribute" : "skill"];
  } else if (purchase.kind === "specialty") {
    if (!Object.values(SKILLS).flat().some(skill => skill === purchase.skill) || !(werewolfMemberTraits(character, catalogs).skills[purchase.skill] >= 1) || typeof purchase.name !== "string" || !purchase.name.trim()
      || character.specializations.some(item => item.skill === purchase.skill && item.name === purchase.name.trim())) fail("specialty");
    cost = 1;
  } else if (purchase.kind === "primalUrge") {
    const current = boundedPrimalUrge(character.line_data.primal_urge);
    if (!natural(purchase.target) || purchase.target <= current || purchase.target > 10) fail("invalidPurchase");
    cost = (purchase.target - current) * costs.primalUrgeDot;
  } else if (purchase.kind === "renown") {
    if (!RENOWN_IDS.includes(purchase.name) || !catalogs.reference.auspices.some(item => item.id === character.line_data.auspice_id)) fail("invalidPurchase");
    const current = renownRatings(character.line_data.renown)[purchase.name];
    if (purchase.target !== current + 1 || purchase.target > 5) fail("invalidPurchase");
    if (typeof purchase.deed !== "string" || !purchase.deed.trim() || purchase.deed.length > 240) fail("renownDeed");
    cost = costs.renown;
  } else if (purchase.kind === "facet") {
    if (typeof purchase.authorization !== "string" || typeof purchase.learningSource !== "string" || purchase.authorization.length > 240 || purchase.learningSource.length > 240) fail("invalidPurchase");
    const terms = facetPurchaseTerms(character, purchase.definitionId, catalogs.reference, catalogs.gifts, purchase.authorization, purchase.learningSource);
    if (terms.problem) return fail(terms.problem);
    cost = costs[terms.costKey!];
  } else if (purchase.kind === "rite") {
    const rite = catalogs.rites.rites.find(item => item.id === purchase.definitionId);
    if (!rite || !natural(rite.dots) || rite.dots < 1 || rite.dots > 5) return fail("missingRite");
    if ([...werewolfIds(character.line_data.creation_rites), ...werewolfIds(character.line_data.learned_rites)].includes(rite.id)) fail("riteKnown");
    if (rite.tribeId && rite.tribeId !== character.line_data.tribe_id) fail("riteTribe");
    if (typeof purchase.learningSource !== "string" || !purchase.learningSource.trim() || purchase.learningSource.length > 240) fail("riteSource");
    cost = rite.dots * costs.riteDot;
  } else {
    const definition = catalogs.merits.find(item => item.id === purchase.definitionId);
    if (!definition) return fail("missingMerit");
    const instance = purchase.instanceId ? character.merits.find(item => item.instanceId === purchase.instanceId) : undefined;
    if (purchase.instanceId && character.merits.filter(item => item.instanceId === purchase.instanceId).length !== 1) fail("meritInstance");
    if (purchase.instanceId && (!instance || werewolfMeritDefinition(instance, catalogs.merits)?.id !== definition.id)) fail("meritInstance");
    if (instance?.grantedBy && !canAdvanceWerewolfGrant(instance, catalogs.merits)) fail("grant");
    if (!instance && !definition.repeatable && !REPEATABLE_MERITS.has(definition.name) && character.merits.some(item => werewolfMeritDefinition(item, catalogs.merits)?.id === definition.id)) fail("meritInstance");
    if (!natural(purchase.target) || purchase.target <= (instance?.dots ?? 0) || !meritRatingsFor(definition, purchase.target).includes(purchase.target)) fail("meritChoices");
    const { core, own } = werewolfAdvancementContexts(character, catalogs);
    const choice = { id: definition.id, instanceId: instance?.instanceId, dots: purchase.target, configuration: normalizeMeritConfiguration(purchase.configuration) };
    if (!meritPrerequisitesMet(definition, { ...core, selectedDots: choice.dots, configuration: choice.configuration }) || !werewolfMeritPrerequisitesMet(definition, choice, own)) fail("meritPrerequisites");
    if (meritSelectionProblems(definition, choice, core).length || (definition.line === "WtF" && werewolfMeritSelectionProblems(definition, choice, own).length)) fail("meritChoices");
    const candidate = structuredClone(character);
    const candidateInstance = instance && candidate.merits.find(item => item.instanceId === instance.instanceId);
    if (candidateInstance) { candidateInstance.dots = purchase.target; candidateInstance.configuration = choice.configuration; }
    else {
      let instanceId = `werewolf:quote:${definition.id}`;
      while (candidate.merits.some(item => item.instanceId === instanceId)) instanceId += ":";
      candidate.merits.push({ definitionId: definition.id, instanceId, name: definition.name, sourceId: definition.sourceId, source: definition.source, dots: purchase.target, configuration: choice.configuration });
    }
    if (hasNewDependencies(character, candidate, catalogs)) fail("purchaseDependent");
    cost = (purchase.target - (instance?.dots ?? 0)) * costs.merit;
  }
  if (!natural(cost) || cost < 1) fail("invalidPurchase");
  return cost;
}

/** A single local transaction: immutable input, exact XP origins, no damage/resource regeneration. */
export function purchaseWerewolfAdvancement(character: CharacterSheet, purchase: WerewolfPurchase, catalogs: WerewolfAdvancementCatalogs, builderMode = false) {
  const cost = werewolfPurchaseQuote(character, purchase, catalogs);
  const available = balance(character.current_state.experience_available), spent = balance(character.current_state.experience_spent);
  if (!builderMode && available < cost) fail("insufficientExperience");
  const next = structuredClone(character);
  const entryId = createRandomId();
  let undo: WerewolfAdvancementUndo;
  if (purchase.kind === "trait") {
    undo = { kind: "trait", group: purchase.group, name: purchase.name, amount: purchase.target - Number(next[purchase.group][purchase.name] ?? (purchase.group === "attributes" ? 1 : 0)) };
    next[purchase.group][purchase.name] = purchase.target;
  } else if (purchase.kind === "specialty") {
    undo = { kind: "specialty", skill: purchase.skill, name: purchase.name.trim() };
    next.specializations.push({ skill: undo.skill, name: undo.name });
  } else if (purchase.kind === "primalUrge") {
    undo = { kind: "primalUrge", amount: purchase.target - boundedPrimalUrge(next.line_data.primal_urge) };
    next.line_data.primal_urge = purchase.target;
    next.line_data.experience_primal_urge = balance(next.line_data.experience_primal_urge) + undo.amount;
  } else if (purchase.kind === "renown") {
    const auspice = catalogs.reference.auspices.find(item => item.id === next.line_data.auspice_id)!;
    undo = { kind: "renown", name: purchase.name, auspiceId: auspice.id };
    next.line_data.renown = { ...renownRatings(next.line_data.renown), [purchase.name]: purchase.target };
    const experience = renownRatings(next.line_data.experience_renown);
    next.line_data.experience_renown = { ...experience, [purchase.name]: experience[purchase.name] + 1 };
    if (purchase.name !== auspice.renown) next.line_data.renown_grants = [...renownGrants(next), { id: entryId, renown: purchase.name, facetId: null }];
    synchronizeRenownFacets(next, catalogs.reference, catalogs.gifts);
  } else if (purchase.kind === "facet") {
    const terms = facetPurchaseTerms(character, purchase.definitionId, catalogs.reference, catalogs.gifts, purchase.authorization, purchase.learningSource);
    const { gift } = facetDefinition(purchase.definitionId, catalogs.gifts)!;
    undo = { kind: "facet", definitionId: purchase.definitionId, giftId: gift.id, unlock: terms.unlock!, costKey: terms.costKey! };
    next.line_data.learned_facets = [...werewolfIds(next.line_data.learned_facets), purchase.definitionId];
    if (terms.unlock) next.line_data.gift_unlocks = [...giftUnlocks(next), { id: entryId, giftId: gift.id }];
  } else if (purchase.kind === "rite") {
    const rite = catalogs.rites.rites.find(item => item.id === purchase.definitionId)!;
    undo = { kind: "rite", definitionId: rite.id, dots: rite.dots };
    next.line_data.learned_rites = [...werewolfIds(next.line_data.learned_rites), rite.id];
  } else {
    const definition = catalogs.merits.find(item => item.id === purchase.definitionId)!;
    let instance = purchase.instanceId ? next.merits.find(item => item.instanceId === purchase.instanceId) : undefined;
    const amount = purchase.target - (instance?.dots ?? 0);
    const previousConfiguration = instance ? normalizeMeritConfiguration(instance.configuration) : undefined;
    if (instance) { instance.definitionId = definition.id; addExperienceMeritDots(instance, amount); instance.configuration = normalizeMeritConfiguration(purchase.configuration); }
    else {
      instance = { definitionId: definition.id, name: definition.name, instanceId: createRandomId(), sourceId: definition.sourceId, source: definition.source, dots: purchase.target,
        creationDots: 0, experienceDots: purchase.target, configuration: normalizeMeritConfiguration(purchase.configuration) };
      next.merits.push(instance);
    }
    undo = { kind: "merit", definitionId: definition.id, name: definition.name, instanceId: instance.instanceId!, dots: amount, previousConfiguration, purchasedConfiguration: normalizeMeritConfiguration(purchase.configuration) };
  }
  const entry: WerewolfExperienceEntry = { id: entryId, cost, createdAt: new Date().toISOString(), purchase: structuredClone(purchase), undo };
  next.current_state = { ...next.current_state, experience_available: builderMode ? available : available - cost, experience_spent: spent + cost,
    experience_total: Math.max(balance(next.current_state.experience_total), available + spent) + (builderMode ? cost : 0),
    [WEREWOLF_HISTORY_KEY]: [...(Array.isArray(next.current_state[WEREWOLF_HISTORY_KEY]) ? next.current_state[WEREWOLF_HISTORY_KEY] : []), entry] };
  if (hasNewDependencies(character, next, catalogs)) fail("purchaseDependent");
  next.derived = werewolfDerived(next, catalogs);
  return next;
}

export function werewolfExperienceHistory(character: CharacterSheet): WerewolfExperienceEntry[] {
  const history = character.current_state[WEREWOLF_HISTORY_KEY];
  return Array.isArray(history) ? history.filter((item): item is WerewolfExperienceEntry => {
    if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id || !natural(item.cost) || item.cost < 1
      || typeof item.createdAt !== "string" || !Number.isFinite(Date.parse(item.createdAt)) || !item.purchase || !item.undo
      || typeof item.purchase !== "object" || typeof item.undo !== "object" || item.purchase.kind !== item.undo.kind) return false;
    const purchase = item.purchase, undo = item.undo;
    const text = (value: unknown) => typeof value === "string" && Boolean(value.trim());
    if (undo.kind === "facet") return text(undo.definitionId) && purchase.definitionId === undo.definitionId && text(undo.giftId) && typeof undo.unlock === "boolean"
      && ["affinityGift", "nonAffinityGift", "shadowFacet", "wolfFacet", "additionalMoonGift", "additionalMoonFacet"].includes(undo.costKey)
      && typeof purchase.authorization === "string" && purchase.authorization.length <= 240 && typeof purchase.learningSource === "string" && purchase.learningSource.length <= 240;
    if (undo.kind === "renown") return RENOWN_IDS.includes(undo.name) && purchase.name === undo.name && text(undo.auspiceId)
      && natural(purchase.target) && purchase.target >= 1 && purchase.target <= 5 && text(purchase.deed) && purchase.deed.length <= 240;
    if (undo.kind === "rite") return text(undo.definitionId) && purchase.definitionId === undo.definitionId && text(purchase.learningSource)
      && purchase.learningSource.length <= 240 && natural(undo.dots) && undo.dots >= 1 && undo.dots <= 5;
    if (undo.kind === "specialty") return text(undo.skill) && text(undo.name) && purchase.skill === undo.skill && typeof purchase.name === "string" && purchase.name.trim() === undo.name;
    if (!natural(purchase.target) || purchase.target < 1) return false;
    if (undo.kind === "trait") return ["attributes", "skills"].includes(undo.group) && purchase.group === undo.group && purchase.name === undo.name
      && Object.values(undo.group === "attributes" ? ATTRIBUTES : SKILLS).flat().some(name => name === undo.name) && natural(undo.amount) && undo.amount > 0 && undo.amount <= purchase.target;
    if (undo.kind === "primalUrge") return purchase.target <= 10 && natural(undo.amount) && undo.amount > 0 && undo.amount < purchase.target;
    if (undo.kind === "merit") return text(undo.definitionId) && text(undo.name) && text(undo.instanceId) && purchase.definitionId === undo.definitionId
      && (!purchase.instanceId || purchase.instanceId === undo.instanceId) && natural(undo.dots) && undo.dots > 0 && undo.dots <= purchase.target
      && undo.purchasedConfiguration && typeof undo.purchasedConfiguration === "object" && !Array.isArray(undo.purchasedConfiguration)
      && purchase.configuration && typeof purchase.configuration === "object" && !Array.isArray(purchase.configuration)
      && (!undo.previousConfiguration || (typeof undo.previousConfiguration === "object" && !Array.isArray(undo.previousConfiguration)));
    return false;
  }) : [];
}

/** A refund must not invalidate a previously valid purchased Merit or exceed the lower PU trait cap. */
function hasNewDependencies(before: CharacterSheet, after: CharacterSheet, catalogs: WerewolfAdvancementCatalogs) {
  const previous = werewolfAdvancementContexts(before, catalogs), next = werewolfAdvancementContexts(after, catalogs);
  const problems = (contexts: ReturnType<typeof werewolfAdvancementContexts>, instance: CharacterSheet["merits"][number]) => {
    const definition = werewolfMeritDefinition(instance, catalogs.merits);
    if (!definition) return [];
    const choice = { id: definition.id, instanceId: instance.instanceId, dots: instance.dots, configuration: instance.configuration };
    return [...(!meritRatingsFor(definition, instance.dots).includes(instance.dots) ? ["rating"] : []),
      ...(!werewolfMeritPrerequisitesMet(definition, choice, contexts.own) ? ["prerequisites"] : []),
      ...meritSelectionProblems(definition, choice, contexts.core).map(item => item.key),
      ...(definition.line === "WtF" ? werewolfMeritSelectionProblems(definition, choice, contexts.own).map(item => item.key) : [])];
  };
  for (const instance of after.merits) {
    const old = before.merits.find(item => item.instanceId === instance.instanceId);
    const existing = old ? problems(previous, old) : [];
    if (problems(next, instance).some(problem => !existing.includes(problem))) return true;
  }
  const cap = primalUrgeLevel(catalogs.reference, after.line_data.primal_urge).traitMaximum;
  const oldCap = primalUrgeLevel(catalogs.reference, before.line_data.primal_urge).traitMaximum;
  if (cap < oldCap && [...Object.values(after.attributes), ...Object.values(after.skills)].some(dots => dots > cap)) return true;
  const oldGiftProblems = giftProgressionIssues(before, catalogs.reference, catalogs.gifts);
  if ([...giftProgressionIssues(after, catalogs.reference, catalogs.gifts).keys()].some(problem => !oldGiftProblems.has(problem))) return true;
  const oldBenefits = resolveTotemAdvantage(before, totemSelection(before.line_data.totem), catalogs), nextBenefits = resolveTotemAdvantage(after, totemSelection(after.line_data.totem), catalogs);
  if (nextBenefits.active && nextBenefits.issues.some(issue => !oldBenefits.issues.some(old => old.id === issue.id && old.problem === issue.problem))) return true;
  return after.specializations.some(item => !(next.core.skills![item.skill] >= 1) && previous.core.skills![item.skill] >= 1);
}

export function refundWerewolfAdvancement(character: CharacterSheet, id: string, catalogs: WerewolfAdvancementCatalogs, builderMode = false) {
  if (character.game_line !== "WtF") fail("invalidPurchase");
  const matches = werewolfExperienceHistory(character).filter(item => item.id === id);
  const raw = character.current_state[WEREWOLF_HISTORY_KEY];
  if (matches.length !== 1 || !Array.isArray(raw) || raw.filter(item => item && typeof item === "object" && item.id === id).length !== 1) return fail("refundMissing");
  const entry = matches[0], next = structuredClone(character), undo = entry.undo;
  if (undo.kind === "renown" || undo.kind === "facet") validGiftLedgers(character);
  const costs = catalogs.reference.experienceCosts;
  const expected = undo.kind === "trait" ? undo.amount * costs[undo.group === "attributes" ? "attribute" : "skill"]
    : undo.kind === "specialty" ? 1 : undo.kind === "primalUrge" ? undo.amount * costs.primalUrgeDot : undo.kind === "renown" ? costs.renown
      : undo.kind === "facet" ? costs[undo.costKey] : undo.dots * costs[undo.kind === "rite" ? "riteDot" : "merit"];
  if (entry.cost !== expected || balance(next.current_state.experience_spent) < entry.cost) fail("refundMissing");
  if (undo.kind === "trait") {
    if (!["attributes", "skills"].includes(undo.group)) fail("refundMissing");
    if (!Object.values(undo.group === "attributes" ? ATTRIBUTES : SKILLS).flat().some(name => name === undo.name) || !natural(undo.amount) || undo.amount < 1) fail("refundMissing");
    const purchased = werewolfExperienceHistory(character).filter(item => item.undo.kind === "trait" && item.undo.group === undo.group && item.undo.name === undo.name)
      .reduce((sum, item) => sum + (item.undo.kind === "trait" ? item.undo.amount : 0), 0);
    if (!(next[undo.group][undo.name] >= purchased + (undo.group === "attributes" ? 1 : 0))) fail("refundMissing");
    next[undo.group][undo.name] -= undo.amount;
  } else if (undo.kind === "specialty") {
    const index = next.specializations.findLastIndex(item => !item.grantedBy && item.skill === undo.skill && item.name === undo.name);
    if (index < 0) return fail("refundMissing");
    next.specializations.splice(index, 1);
  } else if (undo.kind === "primalUrge") {
    if (!natural(undo.amount) || undo.amount < 1 || balance(next.line_data.experience_primal_urge) < undo.amount || boundedPrimalUrge(next.line_data.primal_urge) <= undo.amount) fail("refundMissing");
    next.line_data.primal_urge = boundedPrimalUrge(next.line_data.primal_urge) - undo.amount;
    next.line_data.experience_primal_urge = balance(next.line_data.experience_primal_urge) - undo.amount;
  } else if (undo.kind === "renown") {
    const renown = renownRatings(next.line_data.renown), experience = renownRatings(next.line_data.experience_renown);
    const purchased = werewolfExperienceHistory(character).filter(item => item.undo.kind === "renown" && item.undo.name === undo.name).length;
    if (undo.auspiceId !== next.line_data.auspice_id || experience[undo.name] < purchased || renown[undo.name] < experience[undo.name]) fail("refundMissing");
    const auspice = catalogs.reference.auspices.find(item => item.id === undo.auspiceId);
    const grants = renownGrants(next).filter(grant => grant.id === id);
    if (!auspice || (undo.name !== auspice.renown && (grants.length !== 1 || grants[0].renown !== undo.name))) fail("refundMissing");
    if (grants.some(grant => grant.facetId)) fail("refundDependent");
    next.line_data.renown = { ...renown, [undo.name]: renown[undo.name] - 1 };
    next.line_data.experience_renown = { ...experience, [undo.name]: experience[undo.name] - 1 };
    next.line_data.renown_grants = renownGrants(next).filter(grant => grant.id !== id);
    synchronizeRenownFacets(next, catalogs.reference, catalogs.gifts);
  } else if (undo.kind === "facet") {
    const selected = facetDefinition(undo.definitionId, catalogs.gifts), learned = werewolfIds(next.line_data.learned_facets);
    const validKeys = selected?.gift.kind === "wolf" ? ["wolfFacet"] : selected?.gift.kind === "shadow"
      ? undo.unlock ? ["affinityGift", "nonAffinityGift"] : ["shadowFacet"] : undo.unlock ? ["additionalMoonGift"] : ["additionalMoonFacet"];
    if (!selected || selected.gift.id !== undo.giftId || !validKeys.includes(undo.costKey) || learned.filter(id => id === undo.definitionId).length !== 1
      || werewolfIds(next.line_data.creation_facets).includes(undo.definitionId)
      || werewolfExperienceHistory(character).filter(item => item.undo.kind === "facet" && item.undo.definitionId === undo.definitionId).length !== 1
      || (undo.unlock && giftUnlocks(next).filter(unlock => unlock.id === id && unlock.giftId === undo.giftId).length !== 1)) fail("refundMissing");
    next.line_data.learned_facets = learned.filter(id => id !== undo.definitionId);
    if (undo.unlock) next.line_data.gift_unlocks = giftUnlocks(next).filter(unlock => unlock.id !== id);
  } else if (undo.kind === "rite") {
    const learned = werewolfIds(next.line_data.learned_rites);
    if (learned.filter(id => id === undo.definitionId).length !== 1 || werewolfIds(next.line_data.creation_rites).includes(undo.definitionId)
      || !catalogs.rites.rites.some(rite => rite.id === undo.definitionId)
      || werewolfExperienceHistory(character).filter(item => item.undo.kind === "rite" && item.undo.definitionId === undo.definitionId).length !== 1) fail("refundMissing");
    next.line_data.learned_rites = learned.filter(id => id !== undo.definitionId);
  } else if (undo.kind === "merit") {
    const index = next.merits.findIndex(item => item.instanceId === undo.instanceId);
    if (next.merits.filter(item => item.instanceId === undo.instanceId).length !== 1) fail("refundMissing");
    if (index < 0 || werewolfMeritDefinition(next.merits[index], catalogs.merits)?.id !== undo.definitionId
      || !natural(undo.dots) || undo.dots < 1 || experienceMeritDots(next.merits[index]) < undo.dots) fail("refundMissing");
    if (removeExperienceMeritDots(next.merits[index], undo.dots) === 0) next.merits.splice(index, 1);
    else if (undo.previousConfiguration && JSON.stringify(normalizeMeritConfiguration(next.merits[index].configuration)) === JSON.stringify(undo.purchasedConfiguration)) {
      const history = werewolfExperienceHistory(character), selectedIndex = history.findIndex(item => item.id === id);
      if (!history.slice(selectedIndex + 1).some(item => item.undo.kind === "merit" && item.undo.instanceId === undo.instanceId))
        next.merits[index].configuration = structuredClone(undo.previousConfiguration);
    }
  } else return fail("refundMissing");
  if (hasNewDependencies(character, next, catalogs)) fail("refundDependent");
  next.current_state = { ...next.current_state, experience_available: balance(next.current_state.experience_available) + (builderMode ? 0 : entry.cost),
    experience_spent: balance(next.current_state.experience_spent) - entry.cost,
    ...(builderMode ? { experience_total: Math.max(balance(next.current_state.experience_available) + balance(next.current_state.experience_spent), balance(next.current_state.experience_total)) - entry.cost } : {}),
    [WEREWOLF_HISTORY_KEY]: (next.current_state[WEREWOLF_HISTORY_KEY] as unknown[]).filter(item => !item || typeof item !== "object" || !("id" in item) || item.id !== id) };
  next.derived = werewolfDerived(next, catalogs);
  return next;
}

/** Free allocations have their own origin ledger; they never debit XP or rewrite purchase history. */
export function allocateWerewolfRenownGrant(character: CharacterSheet, id: string, facetId: string | null, catalogs: WerewolfAdvancementCatalogs) {
  if (character.game_line !== "WtF") fail("invalidPurchase");
  validGiftLedgers(character);
  const grants = renownGrants(character), matches = grants.filter(grant => grant.id === id);
  const entries = werewolfExperienceHistory(character).filter(entry => entry.id === id && entry.undo.kind === "renown");
  const raw = character.current_state[WEREWOLF_HISTORY_KEY];
  if (!Array.isArray(raw) || raw.filter(item => item && typeof item === "object" && item.id === id).length !== 1) fail("giftAllocation");
  if (matches.length !== 1 || entries.length !== 1 || entries[0].undo.kind !== "renown" || entries[0].undo.name !== matches[0].renown) fail("giftAllocation");
  const grant = matches[0];
  if (facetId && grant.facetId) fail("giftAllocation");
  if (facetId) { const problem = renownGrantProblem(character, grant, facetId, catalogs.gifts); if (problem) fail(problem); }
  const next = structuredClone(character);
  next.line_data.renown_grants = grants.map(item => item.id === id ? { ...item, facetId } : item);
  if (hasNewDependencies(character, next, catalogs)) fail("refundDependent");
  return next;
}
