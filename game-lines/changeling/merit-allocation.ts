import type { CharacterSheet } from "@/lib/core/character/character-types";
import { asRecord } from "@/lib/core/character/current-character-validation";

/**
 * Repairs schema-2 XP purchases misclassified by the former creation fallback.
 * Line normalization and the Builder (including drafts) consume this in production.
 * Remove when affected stored/exported sheets no longer require this recovery.
 * Only a complete stable-ID chain from a new purchase proves an XP-only Merit;
 * valid XP allocations, creation upgrades and ambiguous histories remain untouched.
 */
export function recoverChangelingMeritAllocations(character: Pick<CharacterSheet, "merits" | "current_state">) {
  const history = Array.isArray(character.current_state.experience_history)
    ? character.current_state.experience_history.map(asRecord) : [];
  return character.merits.map(merit => {
    if (merit.grantedBy || !merit.instanceId || Number(merit.experienceDots ?? 0) > 0) return merit;
    if (character.merits.filter(item => item.instanceId === merit.instanceId).length !== 1) return merit;
    const purchases = history.filter(entry => {
      const undo = asRecord(entry.undo);
      return undo.kind === "merit" && undo.instanceId === merit.instanceId;
    }).reverse();
    if (!purchases.length || asRecord(purchases[0].undo).previousDots !== null) return merit;
    let purchased = 0;
    for (const [index, entry] of purchases.entries()) {
      const undo = asRecord(entry.undo);
      // CtL p. 94: one Experience per Merit dot, including discontinuous ratings.
      if (entry.kind !== "spend" || undo.name !== merit.name ||
          undo.previousDots !== (index === 0 ? null : purchased) ||
          typeof entry.experience !== "number" || !Number.isInteger(entry.experience) || entry.experience >= 0)
        return merit;
      purchased -= entry.experience;
    }
    return purchased === merit.dots ? { ...merit, creationDots: 0, experienceDots: purchased } : merit;
  });
}
