import { HEDGE_DUELIST_VARIANTS } from "./hedge-duelist-variants";
import type { MeritConfigDefinition } from "@/lib/core/character/merit-configuration";

const SKILLS = ["Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science", "Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry", "Animal Ken", "Empathy", "Expression", "Intimidation", "Persuasion", "Socialize", "Streetwise", "Subterfuge"];
const PHYSICAL_SKILLS = SKILLS.filter((item) => ["Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry"].includes(item));
const select = (values: string[]) => values.map((label) => ({ value: label, label }));

export const CHANGELING_MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [
  { name: "Hedge Duelist", fields: [{ key: "firstManeuver", label: "First-dot maneuver", kind: "select", options: HEDGE_DUELIST_VARIANTS.map(({ label, seeming }) => ({ value: label, label: `${label} (${seeming})` })) }] },
  { name: "Court Goodwill", fields: [{ key: "court", label: "Court", kind: "court" }] },
  { name: "Token", fields: [] }, { name: "Hedgespun Item", fields: [] }, { name: "Warded Dreams", fields: [] },
  { name: "Hollow", fields: [] }, { name: "Stable Trod", fields: [] }, { name: "Workshop", fields: [] }, { name: "Shared Bastion", fields: [] }, { name: "Entitlement", fields: [] },
  { name: "Blood and Bone", fields: [{ key: "skill_1", label: "Physical Skill", kind: "select", options: select(PHYSICAL_SKILLS) }, { key: "skill_2", label: "Second Skill", kind: "select", options: select(SKILLS) }, { key: "animal", label: "Animal reflected by the fae mien", kind: "text" }] },
  { name: "Eerie Eyes", fields: [{ key: "sensory_organs", label: "Unusual sensory organs", kind: "text" }] },
  { name: "Know-It-All", fields: [{ key: "skill", label: "Chosen Skill", kind: "select", options: select(["Academics", "Occult", "Politics", "Science"]) }] },
  { name: "Material Affinity", fields: [{ key: "material", label: "Chosen material", kind: "text" }] },
  { name: "Mover and Shaker", fields: [{ key: "subculture", label: "Subculture", kind: "text" }] },
  { name: "Running with the Wolves", fields: [{ key: "animal_group", label: "Animal group", kind: "text" }] },
  { name: "Still Waters Run Deep", fields: [{ key: "attribute", label: "Chosen Attribute", kind: "select", options: select(["Intelligence", "Wits", "Resolve", "Strength", "Dexterity", "Stamina", "Presence", "Manipulation", "Composure"]) }] },
  { name: "Elemental Warrior", fields: [{ key: "element", label: "Physical element", kind: "text" }] },
  { name: "Fae Pet", fields: [{ key: "name", label: "Name", kind: "text" }, { key: "animalId", label: "Animal", kind: "text" }, { key: "dread_power", label: "Dread Power", kind: "text", placeholder: "Name of the pet's Dread Power" }] },
  { name: "Friends in Low Places", fields: [{ key: "group", label: "Group", kind: "text" }] },
  { name: "A Taste of Honey", fields: [{ key: "desire", label: "Chosen desire", kind: "text" }] },
  { name: "Rageaholic", fields: [{ key: "wrath", label: "Chosen form of wrath", kind: "text" }] },
  { name: "Acquired Taste", fields: [{ key: "supernatural_kind", label: "Sapient supernatural kind", kind: "text" }] },
  { name: "Favored Phobia", fields: [{ key: "fear", label: "Chosen fear", kind: "text" }] },
  { name: "Grief Connoisseur", fields: [{ key: "sorrow", label: "Chosen sorrow", kind: "text" }] },
  { name: "Strange Favor", fields: [{ key: "entity", label: "Supernatural entity", kind: "text" }, { key: "favor", label: "Favor owed", kind: "textarea" }] },
];

const INLINE = new Set(["Eerie Eyes", "Material Affinity", "Mover and Shaker", "Running with the Wolves", "Friends in Low Places", "A Taste of Honey", "Rageaholic", "Acquired Taste", "Favored Phobia", "Grief Connoisseur"]);
export const isChangelingInlineMeritConfiguration = (name: string) => INLINE.has(name);
