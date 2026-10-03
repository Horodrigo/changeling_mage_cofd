import type { CharacterSheet } from "@/lib/core/character/character-types";
import { translate, type Locale, type MessageKey } from "@/lib/i18n";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { meritPresentation } from "@/lib/merit-presentation";
import type { MeritDefinition } from "@/lib/merits";
import { systemTerm } from "@/lib/system-terms";
import type { VampirePowers } from "./catalog-types";
import type { VampireAdvancementUndo } from "./experience-refunds";

export type VampireExperienceEntry = {
  id: string; cost: number; createdAt: string; undo?: VampireAdvancementUndo;
  rating?: number; result?: "failure" | "dramatic-failure";
  /** Existing schema-2 text is preserved, never parsed as purchase identity. */
  label?: string; before?: CharacterSheet;
};

export function vampireExperienceLabel(entry: VampireExperienceEntry, character: CharacterSheet, merits: readonly MeritDefinition[], powers: VampirePowers, locale: Locale) {
  const undo = entry.undo;
  const fallback = entry.label ?? translate(locale, "ui.experience");
  if (!undo) return fallback;
  const rated = (name: string, amount = 1) => `${name} ${entry.rating ?? `+${amount}`}`;
  if (undo.kind === "trait") return rated(systemTerm(undo.name, locale), undo.amount);
  if (undo.kind === "specialty") return `${systemTerm(undo.skill, locale)}: ${undo.name}`;
  if (undo.kind === "merit") {
    const instance = undo.instanceId ? character.merits.find(item => item.instanceId === undo.instanceId) : undefined;
    const definition = resolveMeritDefinition(undo.definitionId ? undo : instance ?? undo, merits);
    return rated(definition ? meritPresentation(definition, locale).name : undo.name, undo.dots);
  }
  if (undo.kind === "humanityLoss") return entry.result
    ? `${translate(locale, "ui.detachment")}: ${translate(locale, entry.result === "failure" ? "ui.failure" : "ui.dramaticFailure")}`
    : `${translate(locale, "ui.humanity")} −${undo.amount ?? 1}`;
  const keys: Partial<Record<VampireAdvancementUndo["kind"], MessageKey>> = {
    bloodPotency: "ui.bloodPotency", humanity: "ui.humanity", willpower: "ui.willpower", cruac: "ui.cruac", theban: "ui.thebanSorcery",
  };
  const key = keys[undo.kind];
  if (key) return rated(translate(locale, key), "amount" in undo ? undo.amount : 1);
  const name = (item: { name: string; translatedName: string }) => locale === "pt-BR" ? item.translatedName || item.name : item.name;
  if (undo.kind === "discipline") {
    const item = powers.disciplines.find(item => item.name === undo.name);
    return rated(item ? name(item) : undo.name, undo.amount);
  }
  if (undo.kind === "bloodSorcery") {
    const id = { kimiya_rating: "kimiya", therion_rating: "therion", gilded_cage_rating: "gilded-cage" }[undo.ratingKey];
    const item = powers.ritualDisciplines.find(item => item.id === id);
    return rated(item ? name(item) : id, undo.amount);
  }
  if ("id" in undo && undo.id) {
    const groups = undo.kind === "ritual" ? ({ cruac_rite_ids: powers.cruacRites, theban_miracle_ids: powers.thebanMiracles, kimiya_formula_ids: powers.kimiyaFormulae, therion_sacrilege_ids: powers.therionSacrileges, gilded_invocation_ids: powers.gildedInvocations })[undo.key]
      : undo.kind === "devotion" ? powers.devotions : undo.kind === "lash" ? powers.lashes : undo.kind === "coil" ? powers.coils : undo.kind === "scale" ? powers.scales : undo.kind === "detournement" ? powers.detournements : [];
    const item = groups.find(item => item.id === undo.id);
    const title = item ? name(item) : undo.id;
    return undo.kind === "coil" ? rated(title, undo.amount) : title;
  }
  return fallback;
}
