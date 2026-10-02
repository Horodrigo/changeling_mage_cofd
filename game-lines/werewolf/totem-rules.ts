import { asRecord } from "@/lib/core/character/current-character-validation";
import type { MeritSelection } from "@/lib/core/character/character-types";
import { createRandomId } from "@/lib/random-id";
import { normalizeDamage, type DamageLevel } from "@/lib/resource-rules";
import type { MeritDefinition } from "@/lib/merits";
import { werewolfMeritDefinition } from "./creation-grants";
import type { WerewolfTotemCatalog, TotemPower } from "./catalogs/totem";

export const TOTEM_ATTRIBUTES = ["power", "finesse", "resistance"] as const;
export type TotemAttribute = typeof TOTEM_ATTRIBUTES[number];
export type TotemSelection = {
  instanceId: string; name: string; concept: string; aspiration: string; ban: string; bane: string; notes: string;
  externalPoints: number; attributes: Record<TotemAttribute, number>; size: number; speciesFactor: number;
  influences: Array<{ instanceId: string; domain: string; dots: number }>;
  numina: string[]; manifestations: string[];
};
export type TotemState = { instanceId: string; essence: number; willpower: number; damage: DamageLevel[]; dormant: boolean };
export type TotemProblem = "identity" | "rank" | "attributeBudget" | "attributeDistribution" | "traitMaximum" | "twilight" | "powerBudget" | "unallocatedPowers" | "influence" | "duplicateInfluence" | "missingPower" | "powerRank" | "powerPrerequisites";

// Technical bounds for imported numeric values, not additional printed creation limits.
const whole = (value: unknown, maximum: number) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= maximum;
const identity = (value: unknown) => typeof value === "string" && value.length > 0;

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

export function totemTraits(value: TotemSelection, personalPoints: number, catalog: WerewolfTotemCatalog, dormant = false) {
  const points = personalPoints + value.externalPoints, total = TOTEM_ATTRIBUTES.reduce((sum, key) => sum + value.attributes[key], 0);
  const rank = catalog.ranks.find(rank => total >= rank.attributeMinimum && total <= rank.attributeMaximum) ?? null;
  const { power, finesse, resistance } = value.attributes;
  const manifestExchanges = Math.max(0, value.manifestations.filter(id => id !== "manifestation:twilight-form").length - (rank?.rank ?? 0));
  const influenceDots = value.influences.reduce((sum, influence) => sum + influence.dots, 0);
  const influenceExchanges = Math.max(0, influenceDots - (rank?.rank ?? 0));
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
  const traits = totemTraits(value, personalPoints, catalog), problems: TotemProblem[] = [];
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
