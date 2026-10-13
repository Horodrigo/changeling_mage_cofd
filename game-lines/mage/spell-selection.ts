import type { SpellDefinition } from "@/lib/catalog/catalog-types";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { mageSpellSelection } from "./spell-presentation";

type BuilderSpell = SpellDefinition & { roteSkill?: string };

export function readBuilderSpells(initial: Pick<CharacterSheet, "line_data"> | null | undefined, key: "rotes" | "praxes", count: number, catalog: readonly SpellDefinition[]): Array<BuilderSpell | null> {
  const source = Array.isArray(initial?.line_data[key]) ? initial.line_data[key] : [];
  const result = source.slice(0, count).map((value): BuilderSpell | null => {
    const record = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
    const id = typeof record?.id === "string" ? record.id : "";
    const sourceId = typeof record?.sourceId === "string" ? record.sourceId : "";
    const labels = typeof value === "string" ? [value] : [record?.name, record?.originalName].filter((label): label is string => typeof label === "string" && !!label);
    const matches = catalog.filter(spell =>
      id ? spell.id === id && (!sourceId || spell.sourceId === sourceId)
        : labels.some(label => spell.name === label || spell.originalName === label) && (!sourceId || spell.sourceId === sourceId),
    );
    const found = matches.length === 1 ? matches[0] : undefined;
    if (found) return { ...found, roteSkill: String(record?.roteSkill ?? found.roteSkills[0] ?? "") };
    if (!id || typeof record?.name !== "string" || !record.requirements || typeof record.requirements !== "object" || Array.isArray(record.requirements) || !Array.isArray(record.roteSkills)) return null;
    return mageSpellSelection({ ...record, roteSkill: String(record.roteSkill ?? record.roteSkills[0] ?? "") }) as BuilderSpell;
  });
  while (result.length < count) result.push(null);
  return result;
}
