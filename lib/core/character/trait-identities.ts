import { ATTRIBUTES, SKILLS } from "./creation-rules";

export type AttributeId = typeof ATTRIBUTES[keyof typeof ATTRIBUTES][number];
export type SkillId = typeof SKILLS[keyof typeof SKILLS][number];
export type TraitGroup = "attributes" | "skills";

const aliases: { attributes: Readonly<Record<string, AttributeId>>; skills: Readonly<Record<string, SkillId>> } = {
  attributes: {
    Inteligência: "Intelligence", Raciocínio: "Wits", Perseverança: "Resolve",
    Força: "Strength", Destreza: "Dexterity", Vigor: "Stamina",
    Presença: "Presence", Manipulação: "Manipulation", Compostura: "Composure",
  },
  skills: {
    Erudição: "Academics", Computação: "Computer", Ofícios: "Crafts", Investigação: "Investigation",
    Medicina: "Medicine", Ocultismo: "Occult", Política: "Politics", Ciência: "Science",
    Atletismo: "Athletics", Briga: "Brawl", Condução: "Drive", "Armas de Fogo": "Firearms",
    Furto: "Larceny", "Armas Brancas": "Weaponry", Melee: "Weaponry", Furtividade: "Stealth", Sobrevivência: "Survival",
    "Empatia com Animais": "Animal Ken", "Trato com Animais": "Animal Ken", "Emp. c/ Animais": "Animal Ken", AnimalKen: "Animal Ken",
    Empatia: "Empathy", Expressão: "Expression", Intimidação: "Intimidation", Persuasão: "Persuasion",
    Socialização: "Socialize", Manha: "Streetwise", Subterfúgio: "Subterfuge",
  },
};

/** Schema-2 PT alias bridge for persistence and neutral receipts; remove when PT-keyed sheets are unsupported. */
export function canonicalTraitId(group: TraitGroup, name: string): string {
  return Object.hasOwn(aliases[group], name) ? aliases[group][name] : name;
}

export function canonicalTraitRatings(group: TraitGroup, values: Record<string, number>): Record<string, number> {
  const next = { ...values };
  for (const [alias, canonical] of Object.entries(aliases[group])) {
    if (!Object.hasOwn(next, alias)) continue;
    if (!Object.hasOwn(next, canonical)) next[canonical] = next[alias];
    delete next[alias];
  }
  return next;
}

/** Owning lines supply their history container; only neutral trait/Specialty identities are normalized. */
export function canonicalTraitHistory(state: Record<string, unknown>, historyKey: string): Record<string, unknown> {
  const history = state[historyKey];
  if (!Array.isArray(history)) return state;
  const descriptor = (value: unknown) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return value;
    const row = value as Record<string, unknown>;
    if (row.kind === "trait" && (row.group === "attributes" || row.group === "skills") && typeof row.name === "string")
      return { ...row, name: canonicalTraitId(row.group, row.name) };
    if (row.kind === "specialty" && typeof row.skill === "string") return { ...row, skill: canonicalTraitId("skills", row.skill) };
    return value;
  };
  return { ...state, [historyKey]: history.map(value => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return value;
    const row = value as Record<string, unknown>;
    return { ...row, ...(Object.hasOwn(row, "undo") ? { undo: descriptor(row.undo) } : {}), ...(Object.hasOwn(row, "purchase") ? { purchase: descriptor(row.purchase) } : {}) };
  }) };
}
