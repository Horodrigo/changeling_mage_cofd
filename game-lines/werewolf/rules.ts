import { canonicalTraitHistory } from "@/lib/core/character/trait-identities";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { asRecord } from "@/lib/core/character/current-character-validation";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import type { FormId } from "./catalogs/reference";
import { boundedHarmony, boundedPrimalUrge, formTraits, type WerewolfCreationChoices } from "./creation-rules";
import { resolveWerewolfMerits, type AuspiceSkillGrant } from "./creation-grants";
import { FORM_MECHANICS, PERMANENT_MERIT_IDENTITIES, RENOWN_IDS } from "./mechanics";
import { fetishSelections } from "./fetish-rules";
import { totemSelection, totemState } from "./totem-rules";
import { resolveTotemAdvantage, type TotemBenefitCatalogs } from "./totem-benefits";
import type { WerewolfReferenceCatalog } from "./catalogs/reference";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import type { WerewolfTotemCatalog } from "./catalogs/totem";
import type { MeritDefinition } from "@/lib/merits";

const text = (value: unknown) => typeof value === "string" ? value : "";
export const werewolfIds = (value: unknown): string[] => Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
const dots = (value: unknown, maximum: number) => Math.max(0, Math.min(maximum, Math.trunc(Number(value) || 0)));
export function renownRatings(value: unknown) {
  const record = asRecord(value);
  return Object.fromEntries(RENOWN_IDS.map(id => [id, dots(record[id], 5)])) as Record<typeof RENOWN_IDS[number], number>;
}

/** No legacy inference: the line's creation choices are explicit and independent of later purchases. */
export function creationChoices(value: unknown): WerewolfCreationChoices {
  const record = asRecord(value);
  return {
    auspice_id: text(record.auspice_id), tribe_id: text(record.tribe_id), auspice_skill: text(record.auspice_skill),
    renown_choice: RENOWN_IDS.find(id => id === record.renown_choice) ?? "", primal_urge: boundedPrimalUrge(record.primal_urge),
    extra_rite_dots: dots(record.extra_rite_dots, 5), blood: text(record.blood), bone: text(record.bone),
    physical_touchstone: text(record.physical_touchstone), spiritual_touchstone: text(record.spiritual_touchstone),
    shadow_facets: werewolfIds(record.shadow_facets), wolf_facets: werewolfIds(record.wolf_facets), rites: werewolfIds(record.rites),
  };
}

export function recordedAuspiceSkillGrant(value: unknown): AuspiceSkillGrant | null {
  if (value == null) return null;
  const record = asRecord(value);
  if (typeof record.skill !== "string" || record.dots !== 1) throw new Error("Invalid recorded Auspice Skill grant.");
  return { skill: record.skill, dots: 1 };
}

export function werewolfFormId(value: unknown): FormId {
  return typeof value === "string" && Object.hasOwn(FORM_MECHANICS, value) ? value as FormId : "hishu";
}

/** Only the overlay is returned; purchased traits remain the authoritative persisted choices. */
export function werewolfMemberTraits(character: CharacterSheet, catalogs?: TotemBenefitCatalogs) {
  const totem = totemSelection(character.line_data.totem);
  if (!totem?.advantage?.active || !totem.advantage.selections.length) return character;
  if (!catalogs) throw new Error("Totem Advantage requires explicit Werewolf catalogs.");
  return resolveTotemAdvantage(character, totem, catalogs).traits;
}

export function werewolfFormTraits(character: CharacterSheet, form: FormId = "hishu", catalogs?: TotemBenefitCatalogs) {
  const traits = werewolfMemberTraits(character, catalogs);
  return formTraits(traits, FORM_MECHANICS[form], 5, resolveWerewolfMerits(traits.merits, PERMANENT_MERIT_IDENTITIES), traits.merits);
}

/** Persisted derived values are the stable Hishu baseline; the Sheet computes the selected form live. */
export function werewolfDerived(character: CharacterSheet, catalogs?: TotemBenefitCatalogs) {
  const traits = werewolfFormTraits(character, "hishu", catalogs);
  return { Tamanho: traits.size, Vitalidade: traits.health, Deslocamento: traits.speed,
    ForçaDeVontade: traits.willpower, Iniciativa: traits.initiative, Defesa: traits.defense,
    ArmaduraGeral: traits.armorGeneral, ArmaduraBalistica: traits.armorBallistic };
}

export const werewolfRules: GameLineRulesModule = {
  normalizeCharacter(character) {
    if (character.game_line !== "WtF") throw new Error("Werewolf rules received another game line.");
    character = { ...character, current_state: canonicalTraitHistory(character.current_state, "werewolf_experience_history") };
    const data = character.line_data;
    const totem = totemSelection(data.totem);
    const state = character.current_state.werewolf_totem;
    if (state != null) totemState(state, totem?.instanceId ?? "unassigned");
    return { ...character, line_data: {
      ...data, harmony: boundedHarmony(data.harmony), primal_urge: boundedPrimalUrge(data.primal_urge),
      renown: renownRatings(data.renown), experience_renown: renownRatings(data.experience_renown),
      experience_primal_urge: dots(data.experience_primal_urge, 9),
      creation_choices: creationChoices(data.creation_choices),
      auspice_skill_grant: recordedAuspiceSkillGrant(data.auspice_skill_grant),
      creation_facets: werewolfIds(data.creation_facets), learned_facets: werewolfIds(data.learned_facets),
      creation_rites: werewolfIds(data.creation_rites), learned_rites: werewolfIds(data.learned_rites),
      fetishes: fetishSelections(data.fetishes),
      totem,
      blood: text(data.blood), bone: text(data.bone), auspice_id: text(data.auspice_id), tribe_id: text(data.tribe_id),
      physical_touchstone: text(data.physical_touchstone), spiritual_touchstone: text(data.spiritual_touchstone),
    } };
  },
  deriveCharacterState: werewolfDerived,
};

/** The lazy owning rules loader binds immutable catalogs; no mutable holder or UI/persistence dependency. */
export async function loadWerewolfRules(): Promise<GameLineRulesModule> {
  const { loadCatalogGroups } = await import("@/game-lines/registry/catalog-group-registry");
  const snapshot = await loadCatalogGroups(["core-merits", "werewolf-merits", "werewolf-reference", "werewolf-gifts", "werewolf-totem"]);
  const catalogs: TotemBenefitCatalogs = {
    reference: snapshot.get<WerewolfReferenceCatalog>("werewolf-reference"), gifts: snapshot.get<WerewolfGiftCatalog>("werewolf-gifts"),
    totem: snapshot.get<WerewolfTotemCatalog>("werewolf-totem"), merits: [...snapshot.get<MeritDefinition[]>("core-merits"), ...snapshot.get<MeritDefinition[]>("werewolf-merits")],
  };
  return { ...werewolfRules, deriveCharacterState: character => werewolfDerived(character, catalogs) };
}
