import type { CharacterSheet, MeritSelection } from "@/lib/core/character/character-types";
import { asRecord } from "@/lib/core/character/current-character-validation";
import { addExperienceMeritDots, creationMeritDots, experienceMeritDots, removeExperienceMeritDots } from "@/lib/merit-progression";
import { resolveMeritDefinition, meritMatchesDefinition } from "@/lib/merit-identity";
import { meritPresentation } from "@/lib/merit-presentation";
import { meritRatingsFor, type MeritDefinition } from "@/lib/merits";
import type { Locale } from "@/lib/i18n";
import { createRandomId } from "@/lib/random-id";
import { canAdvanceChangelingGrant, changelingExperienceMeritEligible, changelingMeritContextForSheet } from "./merit-context";

export type ChangelingMeritUndo = {
  kind: "merit"; name: string; previousDots: number | null; instanceId?: string;
  definitionId?: string; targetDots?: number; instanceIndex?: number;
};
const natural = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
const history = (sheet: CharacterSheet): unknown[] => Array.isArray(sheet.current_state.experience_history) ? sheet.current_state.experience_history : [];

/** The selected row is exact: never upgrade a first same-named instance or silently buy a replacement. */
export function changelingExperienceMeritInstance(sheet: CharacterSheet, definition: MeritDefinition, index: number, catalog: readonly MeritDefinition[]) {
  const merit = index >= 0 ? sheet.merits[index] : undefined;
  return merit && meritMatchesDefinition(merit, definition, catalog) &&
    (!merit.grantedBy || canAdvanceChangelingGrant(merit, catalog)) &&
    (!merit.instanceId || sheet.merits.filter(item => item.instanceId === merit.instanceId).length === 1) ? merit : undefined;
}

/** CtL's existing one-XP-per-dot transaction, with canonical definition/instance identity. */
export function quoteChangelingMeritPurchase(sheet: CharacterSheet, definitionId: string, target: number, index: number, catalog: readonly MeritDefinition[]) {
  const definition = catalog.find(item => item.id === definitionId);
  if (sheet.game_line !== "CtL" || !definition || !natural(target) || !Number.isInteger(index) || index < -1) return;
  const owned = changelingExperienceMeritInstance(sheet, definition, index, catalog);
  if (index >= 0 && !owned) return;
  if (owned && (!natural(owned.dots) || owned.dots < 1)) return;
  if (!owned && !definition.repeatable && sheet.merits.some(item => meritMatchesDefinition(item, definition, catalog))) return;
  const cost = target - (owned?.dots ?? 0);
  if (cost < 1 || !meritRatingsFor(definition, target).includes(target) ||
    !changelingExperienceMeritEligible(definition, { ...changelingMeritContextForSheet(sheet, catalog), selectedDots: target, configuration: owned?.configuration })) return;
  const selection: MeritSelection = owned ? structuredClone(owned) : {
    name: definition.name, dots: 0, creationDots: 0, experienceDots: 0,
    sourceId: definition.sourceId, source: definition.source, configuration: {},
  };
  // Schema-2 selections predating allocation fields are creation dots, as in creationMerits().
  // Purchase quotes consume this bridge; remove it when those ID-less allocations end.
  if (owned && owned.creationDots === undefined && owned.experienceDots === undefined) {
    selection.creationDots = owned.dots;
    selection.experienceDots = 0;
  }
  if (creationMeritDots(selection) + experienceMeritDots(selection) !== (owned?.dots ?? 0)) return;
  selection.definitionId = definition.id;
  selection.instanceId ||= createRandomId();
  addExperienceMeritDots(selection, cost);
  const undo: ChangelingMeritUndo = { kind: "merit", definitionId: definition.id, name: definition.name,
    instanceId: selection.instanceId, previousDots: owned?.dots ?? null, targetDots: target };
  return { selection, index: owned ? index : sheet.merits.length, cost, undo };
}

/** Presentation-only schema-2 bridge: an old canonical receipt must match its unique instance/source.
 * Never parse translated descriptions or indices. Used in production history/refund controls;
 * delete the ID-less branch when those schema-2 receipts are no longer supported. */
export function changelingMeritReceiptDefinition(entry: unknown, sheet: CharacterSheet, catalog: readonly MeritDefinition[]) {
  const undo = asRecord(asRecord(entry).undo);
  if (undo.kind !== "merit") return;
  if (undo.definitionId !== undefined) return typeof undo.definitionId === "string" && undo.definitionId ? catalog.find(item => item.id === undo.definitionId) : undefined;
  const instances = sheet.merits.filter(item => item.instanceId && item.instanceId === undo.instanceId);
  if (instances.length !== 1 || typeof undo.name !== "string") return;
  const definition = resolveMeritDefinition({ name: undo.name, sourceId: instances[0].sourceId }, catalog);
  return definition && resolveMeritDefinition(instances[0], catalog)?.id === definition.id ? definition : undefined;
}

export function changelingMeritExperienceLabel(entry: unknown, sheet: CharacterSheet, catalog: readonly MeritDefinition[], locale: Locale) {
  const raw = asRecord(entry), undo = asRecord(raw.undo);
  if (undo.kind !== "merit") return String(raw.description ?? "");
  const definition = changelingMeritReceiptDefinition(entry, sheet, catalog);
  const target = natural(undo.targetDots) ? undo.targetDots :
    typeof raw.experience === "number" && Number.isSafeInteger(raw.experience) && raw.experience < 0 && (undo.previousDots === null || natural(undo.previousDots))
      ? Number(undo.previousDots ?? 0) - raw.experience : undefined;
  if (definition) return `${meritPresentation(definition, locale).name}${target === undefined ? "" : ` ${target}`}`;
  return typeof undo.definitionId === "string" && undo.definitionId ? undo.definitionId : String(raw.description ?? undo.name ?? "");
}

/** Old receipts lack a target rating. Only a complete exact-instance chain proves their allocation;
 * partial/ambiguous records stay visible without refund. No stored receipt is rewritten. */
function completeLegacyChain(sheet: CharacterSheet, merit: MeritSelection, definition: MeritDefinition, catalog: readonly MeritDefinition[]) {
  const purchases = history(sheet).map(asRecord).filter(entry => asRecord(entry.undo).kind === "merit" && asRecord(entry.undo).instanceId === merit.instanceId).reverse();
  let rating = creationMeritDots(merit), paid = 0;
  for (const [index, entry] of purchases.entries()) {
    const undo = asRecord(entry.undo), amount = -Number(entry.experience);
    if (entry.kind !== "spend" || typeof entry.experience !== "number" || !natural(amount) || amount < 1 ||
      changelingMeritReceiptDefinition(entry, sheet, catalog)?.id !== definition.id ||
      undo.previousDots !== (index === 0 && rating === 0 ? null : rating)) return false;
    rating += amount; paid += amount;
    if (undo.targetDots !== undefined && undo.targetDots !== rating) return false;
  }
  return purchases.length > 0 && rating === merit.dots && paid === experienceMeritDots(merit);
}

/** Atomic Merit refund; failed identity/cost/allocation checks never credit XP or delete history. */
export function refundChangelingMeritPurchase(sheet: CharacterSheet, entryId: string, catalog: readonly MeritDefinition[], builderMode = false) {
  const matches = history(sheet).map(asRecord).filter(entry => entry.id === entryId);
  if (sheet.game_line !== "CtL" || !entryId || matches.length !== 1) return;
  const entry = matches[0], undo = asRecord(entry.undo), cost = -Number(entry.experience);
  const available = Number(sheet.current_state.experience_available ?? 0), spent = Number(sheet.current_state.experience_spent ?? 0);
  if (entry.kind !== "spend" || undo.kind !== "merit" || typeof entry.experience !== "number" || !natural(cost) || cost < 1 || !natural(available) || !natural(spent) || spent < cost ||
    typeof undo.instanceId !== "string" || !undo.instanceId || !(undo.previousDots === null || natural(undo.previousDots))) return;
  const instances = sheet.merits.filter(item => item.instanceId === undo.instanceId);
  const definition = changelingMeritReceiptDefinition(entry, sheet, catalog);
  if (instances.length !== 1 || !definition || resolveMeritDefinition(instances[0], catalog)?.id !== definition.id || experienceMeritDots(instances[0]) < cost) return;
  if (undo.definitionId) {
    if (!natural(undo.targetDots) || undo.targetDots - Number(undo.previousDots ?? 0) !== cost || !meritRatingsFor(definition, undo.targetDots).includes(undo.targetDots)) return;
  } else if (!completeLegacyChain(sheet, instances[0], definition, catalog)) return;
  const next = structuredClone(sheet), index = next.merits.findIndex(item => item.instanceId === undo.instanceId);
  if (removeExperienceMeritDots(next.merits[index], cost) === 0) next.merits.splice(index, 1);
  else if (!meritRatingsFor(definition, next.merits[index].dots).includes(next.merits[index].dots)) return;
  const beforeContext = changelingMeritContextForSheet(sheet, catalog), afterContext = changelingMeritContextForSheet(next, catalog);
  for (const remaining of next.merits) {
    const selected = resolveMeritDefinition(remaining, catalog);
    if (selected && changelingExperienceMeritEligible(selected, { ...beforeContext, selectedDots: remaining.dots, configuration: remaining.configuration }) &&
      !changelingExperienceMeritEligible(selected, { ...afterContext, selectedDots: remaining.dots, configuration: remaining.configuration })) return;
  }
  if (definition.id === "ctl-2ed:touchstone") {
    const maximum = 1 + next.merits.filter(item => !item.grantedBy && resolveMeritDefinition(item, catalog)?.id === definition.id).reduce((sum, item) => sum + item.dots, 0);
    if (Array.isArray(next.line_data.touchstones)) next.line_data.touchstones = next.line_data.touchstones.slice(0, maximum);
  }
  const nextAvailable = builderMode ? available : available + cost;
  next.current_state = { ...next.current_state, experience_available: nextAvailable, experience_spent: spent - cost,
    experience_total: nextAvailable + spent - cost, experience_history: history(sheet).filter(value => asRecord(value).id !== entryId) };
  return next;
}
