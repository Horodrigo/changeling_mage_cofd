import { isChangelingCourtGrant } from "./merit-identities";
import { canonicalContractClassification, canonicalContractSnapshot } from "./contract-identities";
import type { ContractDefinition } from "./contract-types";
import type { ChangelingReference } from "./catalogs/reference";
import type { CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";
import { canonicalTraitHistory, canonicalTraitId } from "@/lib/core/character/trait-identities";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import { canonicalChangelingAnchorName, canonicalChangelingCourt, normalizeChangelingFrailties } from "./creation-rules";
import { synchronizeChangelingBuilderMeritGrants } from "./builder-merit-grants";
import { recoverChangelingMeritAllocations } from "./merit-allocation";
import { INTERDISCIPLINARY_SPECIALTY_ID } from "@/lib/core/character/specialty-merits";
import { commonMeritId } from "@/lib/core/character/merit-identities";
import { canonicalStoredRegalia } from "@/lib/changeling-regalia";

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function changelingDerived(character: CharacterSheet): CharacterSheet["derived"] {
  const attributes = character.attributes;
  const skills = character.skills;
  const derived = { ...character.derived };
  delete derived.LucidezMaxima;
  delete derived.ClarezaMaxima;
  return {
    ...derived,
    Size: 5,
    Health: 5 + numberValue(attributes.Stamina),
    Speed: 5 + numberValue(attributes.Strength) + numberValue(attributes.Dexterity),
    Willpower: numberValue(attributes.Resolve) + numberValue(attributes.Composure),
    Initiative: numberValue(attributes.Dexterity) + numberValue(attributes.Composure),
    Defense:
      Math.min(numberValue(attributes.Dexterity), numberValue(attributes.Wits)) +
      numberValue(skills.Athletics),
    ClarityMaximum: numberValue(attributes.Wits) + numberValue(attributes.Composure),
  };
}

/** Pure Changeling rule hooks. No browser, persistence, or cross-line I/O. */
export const changelingRules: GameLineRulesModule = {
  onSpecialtyMeritsRemoved(character, removed) {
    const state = character.line_data.entitlement as { definitionId?: string; suspendedBenefitIds?: string[] } | undefined;
    if (!state || !removed.some(item => commonMeritId(item) === INTERDISCIPLINARY_SPECIALTY_ID && item.grantedBy === `Entitlement:${state.definitionId}`)) return character;
    return { ...character, line_data: { ...character.line_data, entitlement: { ...state, suspendedBenefitIds: [...new Set([...(state.suspendedBenefitIds ?? []), "hedge-interdisciplinary"])] } } };
  },
  normalizeCharacter(character, catalogs?: CatalogSnapshot) {
    const wyrd = numberValue(character.line_data.wyrd) || 1;
    const contractCatalog = catalogs?.has("changeling-contracts") ? catalogs.get<readonly ContractDefinition[]>("changeling-contracts") : undefined;
    const reference = catalogs?.has("changeling-reference") ? catalogs.get<ChangelingReference>("changeling-reference") : undefined;
    const normalizeContract = (value: unknown) => contractCatalog && reference
      ? canonicalContractSnapshot(value, contractCatalog, reference.contractPresentation)
      : canonicalContractClassification(value);
    character = { ...character, current_state: canonicalTraitHistory(character.current_state, "experience_history") };
    return {
      ...character,
      // Production schema-2 recovery for the former distributed Book of Seemings label.
      // Only this owning normalization may attach its known ID; never rename authored
      // labels or replace explicit IDs. Delete when these ID-less rows are unsupported.
      merits: recoverChangelingMeritAllocations(character).map(item => isChangelingCourtGrant(item) && item.grantedBy === "Corte" ? { ...item, grantedBy: "Court" } : item).map(item =>
        !item.definitionId && item.name === "Throne" && item.sourceId === "h-seemings"
          ? { ...item, definitionId: "h-seemings:power-behind-the-throne" } : item),
      line_data: {
        ...character.line_data,
        ...(!character.line_data.custom_court && typeof character.line_data.court === "string" ? { court: canonicalChangelingCourt(character.line_data.court) } : {}),
        ...(typeof character.line_data.needle === "string" ? { needle: canonicalChangelingAnchorName("needle", character.line_data.needle) } : {}),
        ...(typeof character.line_data.thread === "string" ? { thread: canonicalChangelingAnchorName("thread", character.line_data.thread) } : {}),
        ...(typeof character.line_data.favored_attribute === "string" ? { favored_attribute: canonicalTraitId("attributes", character.line_data.favored_attribute) } : {}),
        ...(typeof character.line_data.primary_regalia === "string" ? { primary_regalia: canonicalStoredRegalia(character.line_data.primary_regalia) } : {}),
        ...(typeof character.line_data.second_regalia === "string" ? { second_regalia: canonicalStoredRegalia(character.line_data.second_regalia) } : {}),
        ...(character.line_data.kith_custom && character.line_data.kith_source === "Criação do jogador" ? { kith_source: "Player-created" } : {}),
        ...Object.fromEntries(["contracts", "learned_contracts"].filter(key => Array.isArray(character.line_data[key])).map(key => [key, (character.line_data[key] as unknown[]).map(normalizeContract)])),
        frailties: normalizeChangelingFrailties(character.line_data.frailties, wyrd),
      },
    };
  },
  synchronizeCharacter(character) {
    return synchronizeChangelingBuilderMeritGrants(structuredClone(character));
  },
  deriveCharacterState(character) {
    return changelingDerived(character);
  },
};
