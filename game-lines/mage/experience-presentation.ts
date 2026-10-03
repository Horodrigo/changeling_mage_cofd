import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { SpellDefinition } from "@/lib/catalog/spell-catalog";
import type { MageAdvancementUndo } from "@/lib/experience-refunds";
import { translate, type Locale, type MessageKey } from "@/lib/i18n";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { meritPresentation } from "@/lib/merit-presentation";
import type { MeritDefinition } from "@/lib/merits";
import { systemTerm } from "@/lib/system-terms";

export type MageExperienceEntry = {
  id: string; regular: number; arcane: number; createdAt: string; undo?: MageAdvancementUndo;
  rating?: number; act?: string;
  /** Existing schema-2 text is preserved, never parsed as purchase identity. */
  description?: string; before?: unknown; previousLostWillpower?: number;
};

export function mageExperienceLabel(entry: MageExperienceEntry, character: CharacterSheet, merits: readonly MeritDefinition[], spells: readonly SpellDefinition[], locale: Locale) {
  const undo = entry.undo;
  const fallback = entry.description ?? translate(locale, "ui.experience");
  if (!undo) return fallback;
  // Zero-cost old Wisdom entries may represent a misclassified Hubris loss.
  // Preserve their text; the refund UI refuses this ambiguous record.
  if (undo.kind === "wisdom" && entry.regular + entry.arcane === 0) return fallback;
  const rated = (name: string, amount = 1) => `${name} ${entry.rating ?? `+${amount}`}`;
  if (undo.kind === "trait" || undo.kind === "arcana") return rated(systemTerm(undo.name, locale), undo.amount);
  if (undo.kind === "specialty") return `${systemTerm(undo.skill, locale)}: ${undo.name}`;
  if (undo.kind === "merit") {
    const instance = undo.instanceId ? character.merits.find(item => item.instanceId === undo.instanceId) : undefined;
    const definition = resolveMeritDefinition(undo.definitionId ? undo : instance ?? undo, merits);
    return rated(definition ? meritPresentation(definition, locale).name : undo.name, undo.dots);
  }
  if (undo.kind === "spell") {
    const spell = spells.find(item => item.id === undo.id);
    const kind = translate(locale, undo.key === "learned_rotes" ? "ui.rote" : "ui.praxis");
    return `${kind}: ${spell ? locale === "en-US" ? spell.originalName || spell.name : spell.name : undo.id}`;
  }
  if (undo.kind === "wisdomLoss") return entry.act
    ? `${translate(locale, "ui.actOfHubris")}: ${entry.act}`
    : `${translate(locale, "ui.wisdom")} −1`;
  if (undo.kind === "willpowerLoss") return translate(locale, "ui.permanentLossOfOneWillpowerDot");
  const keys: Partial<Record<MageAdvancementUndo["kind"], MessageKey>> = { gnosis: "ui.gnosis", wisdom: "ui.wisdom", willpower: "ui.willpower" };
  const key = keys[undo.kind];
  if (key) return rated(translate(locale, key), "amount" in undo ? undo.amount : 1);
  // Legacy transactions are handled by the owning Legacy surface until its
  // identity/presentation batch; unknown or authored historical text stays intact.
  return fallback;
}
