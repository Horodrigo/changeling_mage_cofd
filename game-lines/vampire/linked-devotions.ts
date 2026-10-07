import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { VampirePowers, VampirePurchasablePower } from "./catalog-types";

export type DevotionTarget = { kind: "devotion"; id: string } | { kind: "discipline"; id: string; rating: number };
type TargetCatalog = Pick<VampirePowers, "devotions"> & Partial<Pick<VampirePowers, "disciplines">>;

export function sameDevotionTarget(left: DevotionTarget | undefined, right: DevotionTarget | undefined) {
  return Boolean(left && right && left.kind === right.kind && left.id === right.id
    && (left.kind !== "discipline" || right.kind === "discipline" && left.rating === right.rating));
}

export function storedDevotionTarget(data: CharacterSheet["line_data"], id: string): DevotionTarget | undefined {
  const targets = data.devotion_targets;
  if (!targets || typeof targets !== "object" || Array.isArray(targets)) return undefined;
  const value = (targets as Record<string, unknown>)[id];
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const target = value as Record<string, unknown>;
  if (typeof target.id !== "string" || !target.id) return undefined;
  if (target.kind === "devotion") return { kind: "devotion", id: target.id };
  if (target.kind === "discipline" && Number.isInteger(target.rating) && Number(target.rating) >= 1 && Number(target.rating) <= 5)
    return { kind: "discipline", id: target.id, rating: Number(target.rating) };
}

export function devotionTargetPower(target: DevotionTarget | undefined, powers: TargetCatalog) {
  if (target?.kind === "devotion") return powers.devotions.find(item => item.id === target.id);
  if (target?.kind === "discipline") return powers.disciplines?.find(item => item.id === target.id)?.levels.find(item => item.rating === target.rating);
}

export function devotionTargetName(target: DevotionTarget | undefined, powers: TargetCatalog, locale: string) {
  const power = devotionTargetPower(target, powers);
  if (!power) return target?.id;
  const name = (item: { name: string; translatedName: string }) => locale === "pt-BR" ? item.translatedName : item.name;
  if (target?.kind === "discipline") {
    const discipline = powers.disciplines?.find(item => item.id === target.id);
    return `${discipline ? name(discipline) : target.id} ${"•".repeat(target.rating)}: ${name(power)}`;
  }
  return name(power);
}

export function linkedDevotionQuote(definition: VampirePurchasablePower, character: Pick<CharacterSheet, "line_data">, powers: TargetCatalog, target = storedDevotionTarget(character.line_data, definition.id)) {
  if (!definition.linkedPower || !target) return undefined;
  const power = devotionTargetPower(target, powers);
  if (!power || !/^(?:Instant|Contested)(?:;|$)/i.test(power.action ?? "")) return undefined;
  let required: number;
  if (target.kind === "devotion") {
    const devotion = power as VampirePurchasablePower;
    if (devotion.linkedPower || !Array.isArray(character.line_data.devotion_ids) || !character.line_data.devotion_ids.includes(target.id)) return undefined;
    required = Number(devotion.experienceCost);
  } else {
    if (!definition.linkedPower.disciplinePowers) return undefined;
    const discipline = powers.disciplines?.find(item => item.id === target.id);
    const ratings = character.line_data.disciplines as Record<string, number> | undefined;
    if (!discipline || Number(ratings?.[discipline.name] ?? 0) < target.rating) return undefined;
    required = target.rating;
  }
  if (!Number.isInteger(required) || required < 1 || required > 5) return undefined;
  return { target, power, required, cost: Math.ceil(required / 2) };
}

export function linkedDevotionTargets(definition: VampirePurchasablePower, character: Pick<CharacterSheet, "line_data">, powers: TargetCatalog): DevotionTarget[] {
  const targets: DevotionTarget[] = powers.devotions.map(item => ({ kind: "devotion", id: item.id }));
  if (definition.linkedPower?.disciplinePowers) for (const discipline of powers.disciplines ?? [])
    for (const level of discipline.levels) targets.push({ kind: "discipline", id: discipline.id, rating: level.rating });
  return targets.filter(target => linkedDevotionQuote(definition, character, powers, target));
}
