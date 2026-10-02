import { asRecord } from "@/lib/core/character/current-character-validation";
import type { MeritSelection } from "@/lib/core/character/character-types";
import { createRandomId } from "@/lib/random-id";
import { normalizeDamage, type DamageLevel } from "@/lib/resource-rules";
import type { MeritDefinition } from "@/lib/merits";
import type { MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { werewolfMeritDefinition } from "./creation-grants";
import type { WerewolfTotemCatalog, TotemPower } from "./catalogs/totem";

export const TOTEM_ATTRIBUTES = ["power", "finesse", "resistance"] as const;
export type TotemAttribute = typeof TOTEM_ATTRIBUTES[number];
export type TotemSelection = {
  instanceId: string; name: string; concept: string; aspiration: string; ban: string; bane: string; notes: string;
  externalPoints: number; attributes: Record<TotemAttribute, number>; size: number; speciesFactor: number;
  influences: Array<{ instanceId: string; domain: string; dots: number }>;
  numina: string[]; manifestations: string[];
  improvements?: TotemImprovement[];
  advantage?: TotemAdvantage;
};
export type TotemBenefitChoice =
  | { kind: "attribute"; target: string }
  | { kind: "skill"; target: string }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "merit"; definitionId: string; dots: number; configuration: MeritConfiguration };
export type TotemBenefit = { id: string; choice: TotemBenefitChoice; replacement?: { choice: TotemBenefitChoice; reason: string } };
export type TotemAdvantage = { active: boolean; selections: TotemBenefit[] };
export type TotemImprovement = { id: string; kind: "attribute" | "influence" | "numen"; target: string; domain?: string; experience: number; origin: string; createdAt: string };
export type TotemImprovementProblem = "initial" | "target" | "duplicate" | "attributeLimit" | "influenceLimit" | "numinaLimit" | "cost" | "origin";
export type TotemState = { instanceId: string; essence: number; willpower: number; damage: DamageLevel[]; dormant: boolean };
export type TotemProblem = "identity" | "rank" | "attributeBudget" | "attributeDistribution" | "traitMaximum" | "twilight" | "powerBudget" | "unallocatedPowers" | "influence" | "duplicateInfluence" | "missingPower" | "powerRank" | "powerPrerequisites";

// Technical bounds for imported numeric values, not additional printed creation limits.
const whole = (value: unknown, maximum: number) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= maximum;
const identity = (value: unknown) => typeof value === "string" && value.length > 0;

/** Current-schema choices only. Unknown catalog IDs survive for an explicit unresolved presentation. */
export function totemAdvantage(value: unknown): TotemAdvantage {
  if (value == null) return { active: true, selections: [] };
  const record = asRecord(value);
  const choiceValid = (raw: unknown) => {
    const choice = asRecord(raw);
    if (choice.kind === "attribute" || choice.kind === "skill") return identity(choice.target);
    if (choice.kind === "specialty") return identity(choice.skill) && typeof choice.name === "string";
    if (choice.kind !== "merit" || !identity(choice.definitionId) || !whole(choice.dots, 1000) || choice.dots === 0) return false;
    const configuration = choice.configuration;
    return configuration != null && typeof configuration === "object" && !Array.isArray(configuration)
      && Object.values(configuration).every(item => typeof item === "string" || (Array.isArray(item) && item.every(value => typeof value === "string")));
  };
  if (typeof record.active !== "boolean" || !Array.isArray(record.selections)) throw new Error("Invalid Werewolf Totem Advantage.");
  const ids = new Set<string>();
  for (const item of record.selections) {
    const selection = asRecord(item), replacement = asRecord(selection.replacement);
    if (!identity(selection.id) || ids.has(selection.id as string) || !choiceValid(selection.choice)
      || (selection.replacement !== undefined && (!choiceValid(replacement.choice) || typeof replacement.reason !== "string"))) throw new Error("Invalid Werewolf Totem Advantage choice.");
    ids.add(selection.id as string);
  }
  return structuredClone(record) as TotemAdvantage;
}

/** Optional current-schema entity, not a legacy adapter. Unknown power IDs and authored text survive import. */
export function totemSelection(value: unknown): TotemSelection | null {
  if (value == null) return null;
  const record = asRecord(value), attributes = asRecord(record.attributes);
  if (!identity(record.instanceId) || ["name", "concept", "aspiration", "ban", "bane", "notes"].some(key => typeof record[key] !== "string")
    || !whole(record.externalPoints, 1000) || !whole(record.size, 1000) || !whole(record.speciesFactor, 1000)
    || TOTEM_ATTRIBUTES.some(key => !whole(attributes[key], 15))) throw new Error("Invalid Werewolf Totem identity or traits.");
  for (const key of ["numina", "manifestations"] as const)
    if (!Array.isArray(record[key]) || record[key].some(id => !identity(id)) || new Set(record[key]).size !== record[key].length)
      throw new Error("Invalid Werewolf Totem power IDs.");
  if (!Array.isArray(record.influences)) throw new Error("Invalid Werewolf Totem Influences.");
  const ids = new Set<string>();
  for (const item of record.influences) {
    const influence = asRecord(item);
    if (!identity(influence.instanceId) || ids.has(influence.instanceId as string) || typeof influence.domain !== "string" || !whole(influence.dots, 1000))
      throw new Error("Invalid Werewolf Totem Influence.");
    ids.add(influence.instanceId as string);
  }
  if (record.improvements != null) {
    if (!Array.isArray(record.improvements)) throw new Error("Invalid Werewolf Totem improvements.");
    const improvementIds = new Set<string>();
    for (const item of record.improvements) {
      const entry = asRecord(item);
      if (!identity(entry.id) || improvementIds.has(entry.id as string) || typeof entry.kind !== "string" || !["attribute", "influence", "numen"].includes(entry.kind) || !identity(entry.target)
        || !whole(entry.experience, 1000) || typeof entry.origin !== "string" || (entry.domain !== undefined && typeof entry.domain !== "string") || typeof entry.createdAt !== "string" || !Number.isFinite(Date.parse(entry.createdAt))) throw new Error("Invalid Werewolf Totem improvement.");
      improvementIds.add(entry.id as string);
    }
  }
  if (record.advantage !== undefined) totemAdvantage(record.advantage);
  return structuredClone(record) as TotemSelection;
}

export function newTotem(): TotemSelection {
  return { instanceId: createRandomId(), name: "", concept: "", aspiration: "", ban: "", bane: "", notes: "", externalPoints: 0,
    attributes: { power: 0, finesse: 0, resistance: 0 }, size: 1, speciesFactor: 0, influences: [], numina: [], manifestations: ["manifestation:twilight-form"] };
}

/** Exact canonical definition resolution, never a translated Merit label or inferred Pack membership. */
export function personalTotemPoints(merits: readonly MeritSelection[], catalog: readonly Pick<MeritDefinition, "id" | "name" | "sourceId">[]) {
  return merits.filter(merit => werewolfMeritDefinition(merit, catalog)?.id === "wtf-2ed:totem").reduce((sum, merit) => sum + merit.dots, 0);
}

/** Resource state has its own entity identity. Structural edits never replenish or truncate resources/damage. */
export function totemState(value: unknown, instanceId: string): TotemState {
  if (value == null) return { instanceId, essence: 0, willpower: 0, damage: [], dormant: false };
  const record = asRecord(value);
  if (!identity(record.instanceId) || !whole(record.essence, 1000) || !whole(record.willpower, 1000) || typeof record.dormant !== "boolean"
    || !Array.isArray(record.damage) || record.damage.some(item => !["bashing", "lethal", "aggravated"].includes(item))) throw new Error("Invalid Werewolf Totem resource state.");
  if (record.instanceId !== instanceId) return { instanceId, essence: 0, willpower: 0, damage: [], dormant: false };
  return { ...record, damage: normalizeDamage(record.damage, record.damage.length) } as TotemState;
}

/** Purchased dots/powers are overlays, never reclassified as initial allocations. No resource or XP mutations. */
export function effectiveTotem(value: TotemSelection): TotemSelection {
  const result = structuredClone(value);
  for (const entry of value.improvements ?? []) {
    if (entry.kind === "attribute" && TOTEM_ATTRIBUTES.includes(entry.target as TotemAttribute)) result.attributes[entry.target as TotemAttribute] += 1;
    if (entry.kind === "influence") {
      let influence = result.influences.find(item => item.instanceId === entry.target);
      if (!influence && entry.domain?.trim()) {
        influence = { instanceId: entry.target, domain: entry.domain, dots: 0 };
        result.influences.push(influence);
      }
      if (influence) influence.dots += 1;
    }
    if (entry.kind === "numen" && !result.numina.includes(entry.target)) result.numina.push(entry.target);
  }
  return result;
}

export function totemTraits(value: TotemSelection, personalPoints: number, catalog: WerewolfTotemCatalog, dormant = false, initial = false) {
  const base = value;
  if (!initial) value = effectiveTotem(value);
  const points = personalPoints + value.externalPoints, total = TOTEM_ATTRIBUTES.reduce((sum, key) => sum + value.attributes[key], 0);
  const rank = catalog.ranks.find(rank => total >= rank.attributeMinimum && total <= rank.attributeMaximum) ?? null;
  const { power, finesse, resistance } = value.attributes;
  const initialTotal = TOTEM_ATTRIBUTES.reduce((sum, key) => sum + base.attributes[key], 0);
  const initialRank = catalog.ranks.find(rank => initialTotal >= rank.attributeMinimum && initialTotal <= rank.attributeMaximum);
  const manifestExchanges = Math.max(0, base.manifestations.filter(id => id !== "manifestation:twilight-form").length - (initialRank?.rank ?? 0));
  const influenceDots = value.influences.reduce((sum, influence) => sum + influence.dots, 0);
  const influenceExchanges = Math.max(0, base.influences.reduce((sum, influence) => sum + influence.dots, 0) - (initialRank?.rank ?? 0));
  const numinaBudget = Math.max(0, 1 + Math.floor(points / 4) - manifestExchanges - influenceExchanges);
  const advantage = catalog.advantageBands.find(band => points >= band.minimum && (band.maximum == null || points <= band.maximum))?.experience ?? 0;
  return { points, total, rank, influenceDots, influenceExchanges, manifestExchanges, numinaBudget, advantage,
    corpus: resistance + value.size, willpower: Math.min(10, finesse + resistance), initiative: finesse + resistance,
    defense: dormant || !rank ? 0 : value.numina.includes("numen:stalwart") ? resistance : rank.rank === 1 ? Math.max(power, finesse) : Math.min(power, finesse),
    speed: power + finesse + value.speciesFactor, essenceMaximum: rank ? Math.min(points, rank.essenceMaximum) : 0 };
}

/** Acquisition prerequisites only. Condition prerequisites apply at use, not ownership; no roll executor. */
export function totemPowerProblems(power: TotemPower, value: TotemSelection, rank: number | undefined): TotemProblem[] {
  const problems: TotemProblem[] = [];
  if (power.minimumRank && (!rank || rank < power.minimumRank)) problems.push("powerRank");
  if (power.requiredManifestationIds?.some(id => !value.manifestations.includes(id))) problems.push("powerPrerequisites");
  return problems;
}

/** Incomplete optional configurations remain editable. Invalid allocations never masquerade as approved creation. */
export function totemCreationProblems(value: TotemSelection, personalPoints: number, catalog: WerewolfTotemCatalog) {
  const traits = totemTraits(value, personalPoints, catalog, false, true), problems: TotemProblem[] = [];
  if ([value.name, value.concept, value.aspiration, value.ban, value.bane].some(text => !text.trim())) problems.push("identity");
  if (!traits.rank) problems.push("rank");
  if (traits.total !== traits.points) problems.push("attributeBudget");
  if (TOTEM_ATTRIBUTES.some(key => value.attributes[key] < 1 || value.attributes[key] > Math.floor(traits.total / 2))) problems.push("attributeDistribution");
  if (traits.rank && TOTEM_ATTRIBUTES.some(key => value.attributes[key] > traits.rank!.traitMaximum)) problems.push("traitMaximum");
  if (!value.manifestations.includes("manifestation:twilight-form")) problems.push("twilight");
  if (value.numina.length + traits.influenceExchanges + traits.manifestExchanges > 1 + Math.floor(traits.points / 4)) problems.push("powerBudget");
  if (traits.rank && (value.numina.length < traits.numinaBudget || traits.influenceDots < traits.rank.rank || value.manifestations.filter(id => id !== "manifestation:twilight-form").length < traits.rank.rank)) problems.push("unallocatedPowers");
  if (value.influences.some(influence => !influence.domain.trim() || influence.dots < 1 || influence.dots > Math.max(traits.rank?.rank ?? 0, traits.points))) problems.push("influence");
  if (new Set(value.influences.map(influence => influence.domain.trim().toLowerCase())).size !== value.influences.length) problems.push("duplicateInfluence");
  for (const [kind, ids] of [["numen", value.numina], ["manifestation", value.manifestations]] as const) for (const id of ids) {
    const power = catalog.powers.find(power => power.id === id && power.kind === kind);
    if (!power) problems.push("missingPower");
    else problems.push(...totemPowerProblems(power, value, traits.rank?.rank));
  }
  return [...new Set(problems)];
}

/** Replay exact entries to check dependencies and limits. Funding is resolved outside this individual sheet. */
function totemImprovementIssues(value: TotemSelection, personalPoints: number, catalog: WerewolfTotemCatalog) {
  // ponytail: O(n²) replay for small personal ledgers; use an incremental overlay if large histories become slow.
  const issues: Array<{ id: string; problem: TotemImprovementProblem }> = [];
  if (totemCreationProblems(value, personalPoints, catalog).length) issues.push({ id: "initial", problem: "initial" });
  const replay = { ...value, improvements: [] as TotemImprovement[] };
  for (const entry of value.improvements ?? []) {
    const add = (problem: TotemImprovementProblem) => issues.push({ id: entry.id, problem });
    if (!entry.origin.trim()) add("origin");
    if (entry.experience !== catalog.improvementCosts[entry.kind]) add("cost");
    const current = effectiveTotem(replay);
    if (entry.kind === "attribute" && !TOTEM_ATTRIBUTES.includes(entry.target as TotemAttribute)) add("target");
    if (entry.kind === "influence" && !current.influences.some(item => item.instanceId === entry.target && item.domain.trim()) && !entry.domain?.trim()) add("target");
    if (entry.kind === "influence" && entry.domain && current.influences.some(item => item.instanceId !== entry.target && item.domain.trim().toLowerCase() === entry.domain!.trim().toLowerCase())) add("duplicate");
    if (entry.kind === "numen") {
      if (!catalog.powers.some(power => power.id === entry.target && power.kind === "numen")) add("target");
      if (current.numina.includes(entry.target)) add("duplicate");
    }
    replay.improvements.push(entry);
    const updated = effectiveTotem(replay), traits = totemTraits(replay, personalPoints, catalog);
    if (!traits.rank || TOTEM_ATTRIBUTES.some(attribute => updated.attributes[attribute] > traits.rank!.traitMaximum)) add("attributeLimit");
    if (traits.influenceDots > Math.max(traits.points, traits.rank?.rank ?? 0)) add("influenceLimit");
    if (updated.numina.length > Math.max(traits.points, traits.rank?.numinaMaximum ?? 0)) add("numinaLimit");
  }
  return issues;
}

export function totemImprovementProblems(value: TotemSelection, personalPoints: number, catalog: WerewolfTotemCatalog): TotemImprovementProblem[] {
  return [...new Set(totemImprovementIssues(value, personalPoints, catalog).map(issue => issue.problem))];
}

export function recordTotemImprovement(value: TotemSelection, kind: TotemImprovement["kind"], target: string, origin: string, personalPoints: number, catalog: WerewolfTotemCatalog, domain?: string): TotemSelection {
  const candidate = { ...value, improvements: [...(value.improvements ?? []), { id: createRandomId(), kind, target, origin: origin.trim(), experience: catalog.improvementCosts[kind], createdAt: new Date().toISOString(), ...(domain == null ? {} : { domain: domain.trim() }) }] };
  totemSelection(candidate);
  const problems = totemImprovementProblems(candidate, personalPoints, catalog);
  if (problems.length) throw new Error(`Invalid Totem improvement: ${problems.join(", ")}.`);
  return candidate;
}

/** Removal is local ledger correction, not a refund to any Uratha/Pack account. Reject newly invalid dependencies. */
export function removeTotemImprovement(value: TotemSelection, id: string, personalPoints: number, catalog: WerewolfTotemCatalog): TotemSelection {
  if (!value.improvements?.some(entry => entry.id === id)) throw new Error("Unknown Totem improvement.");
  const candidate = { ...value, improvements: value.improvements.filter(entry => entry.id !== id) };
  const previous = new Set(totemImprovementIssues(value, personalPoints, catalog).map(issue => `${issue.id}:${issue.problem}`));
  if (totemImprovementIssues(candidate, personalPoints, catalog).some(issue => !previous.has(`${issue.id}:${issue.problem}`))) throw new Error("Totem improvement has dependent allocations.");
  return candidate;
}
