import type { CharacterSheet } from "@/lib/core/character/character-types";
import { translate, type Locale } from "@/lib/i18n";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { meritPresentation } from "@/lib/merit-presentation";
import type { MeritDefinition } from "@/lib/merits";
import { systemTerm } from "@/lib/system-terms";
import type { MortalAdvancementUndo } from "./experience-rules";

/** Persist canonical identities and authored Specialty text, never display labels. */
export type MortalExperiencePurchase =
  | { kind: "trait"; group: "attributes" | "skills"; name: string; rating: number }
  | { kind: "merit"; definitionId: string; instanceId: string; name: string; rating: number }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "integrity"; rating: number };

export type MortalExperienceEntry = {
  id: string; cost: number; createdAt: string; undo?: MortalAdvancementUndo;
  purchase?: MortalExperiencePurchase;
  /** Existing schema-2 entries only; new transactions use purchase. */
  label?: string;
};

export function mortalExperienceLabel(entry: MortalExperienceEntry, character: CharacterSheet, catalog: readonly MeritDefinition[], locale: Locale) {
  const purchase = entry.purchase;
  if (purchase) {
    if (purchase.kind === "trait") return `${systemTerm(purchase.name, locale)} ${purchase.rating}`;
    if (purchase.kind === "specialty") return `${systemTerm(purchase.skill, locale)}: ${purchase.name}`;
    if (purchase.kind === "integrity") return `${translate(locale, "ui.integrity")} ${purchase.rating}`;
    if (purchase.kind === "merit") {
      const definition = resolveMeritDefinition(purchase, catalog);
      return `${definition ? meritPresentation(definition, locale).name : purchase.name} ${purchase.rating}`;
    }
  }
  // Existing transactions already have semantic undo data. Render its delta
  // without parsing or overwriting the historical localized label/balance.
  const undo = entry.undo;
  if (!undo) return entry.label ?? translate(locale, "ui.experience");
  if (undo.kind === "trait") return `${systemTerm(undo.name, locale)} +${undo.amount}`;
  if (undo.kind === "specialty") return `${systemTerm(undo.skill, locale)}: ${undo.name}`;
  if (undo.kind === "integrity") return `${translate(locale, "ui.integrity")} +${undo.amount}`;
  if (undo.kind !== "merit") return entry.label ?? translate(locale, "ui.experience");
  const instance = undo.instanceId ? character.merits.find(item => item.instanceId === undo.instanceId) : undefined;
  const definition = resolveMeritDefinition(undo.definitionId ? undo : instance ?? undo, catalog);
  return `${definition ? meritPresentation(definition, locale).name : undo.name} +${undo.dots}`;
}
