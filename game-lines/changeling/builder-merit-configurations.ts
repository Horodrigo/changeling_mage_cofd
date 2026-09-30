import { HEDGE_DUELIST_VARIANTS } from "./hedge-duelist-variants";
import type { MeritConfigDefinition } from "@/lib/core/character/merit-configuration";

const SKILLS = ["Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science", "Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry", "Animal Ken", "Empathy", "Expression", "Intimidation", "Persuasion", "Socialize", "Streetwise", "Subterfuge"];
const PHYSICAL_SKILLS = SKILLS.filter((item) => ["Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry"].includes(item));
const select = (values: string[]) => values.map((label) => ({ value: label, label }));

export const CHANGELING_MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [
  { name: "Hedge Duelist", fields: [{ key: "firstManeuver", label: "ui.meritConfig.firstDotManeuver", kind: "select", options: HEDGE_DUELIST_VARIANTS.map(({ label, value }) => ({ value: label, label: `ui.hedgeDuelist.${value}.choice` })) }] },
  { name: "Court Goodwill", fields: [{ key: "court", label: "ui.meritConfig.court", kind: "court" }] },
  { name: "Token", fields: [] }, { name: "Hedgespun Item", fields: [] }, { name: "Warded Dreams", fields: [] },
  { name: "Hollow", fields: [] }, { name: "Stable Trod", fields: [] }, { name: "Workshop", fields: [] }, { name: "Shared Bastion", fields: [] }, { name: "Entitlement", fields: [] },
  { name: "Blood and Bone", fields: [{ key: "skill_1", label: "ui.meritConfig.physicalSkill", kind: "select", options: select(PHYSICAL_SKILLS) }, { key: "skill_2", label: "ui.meritConfig.secondSkill", kind: "select", options: select(SKILLS) }, { key: "animal", label: "ui.meritConfig.animalReflectedByFaeMien", kind: "text" }] },
  { name: "Eerie Eyes", fields: [{ key: "sensory_organs", label: "ui.meritConfig.unusualSensoryOrgans", kind: "text" }] },
  { name: "Know-It-All", fields: [{ key: "skill", label: "ui.meritConfig.chosenSkill", kind: "select", options: select(["Academics", "Occult", "Politics", "Science"]) }] },
  { name: "Material Affinity", fields: [{ key: "material", label: "ui.meritConfig.chosenMaterial", kind: "text" }] },
  { name: "Mover and Shaker", fields: [{ key: "subculture", label: "ui.meritConfig.subculture", kind: "text" }] },
  { name: "Running with the Wolves", fields: [{ key: "animal_group", label: "ui.meritConfig.animalGroup", kind: "text" }] },
  { name: "Still Waters Run Deep", fields: [{ key: "attribute", label: "ui.meritConfig.chosenAttribute", kind: "select", options: select(["Intelligence", "Wits", "Resolve", "Strength", "Dexterity", "Stamina", "Presence", "Manipulation", "Composure"]) }] },
  { name: "Elemental Warrior", fields: [{ key: "element", label: "ui.meritConfig.physicalElement", kind: "text" }] },
  { name: "Fae Pet", fields: [{ key: "name", label: "ui.meritConfig.name", kind: "text" }, { key: "animalId", label: "ui.meritConfig.animal", kind: "text" }, { key: "dread_power", label: "ui.meritConfig.dreadPower", kind: "text", placeholder: "ui.meritConfig.petDreadPowerName" }] },
  { name: "Friends in Low Places", fields: [{ key: "group", label: "ui.meritConfig.group", kind: "text" }] },
  { name: "A Taste of Honey", fields: [{ key: "desire", label: "ui.meritConfig.chosenDesire", kind: "text" }] },
  { name: "Rageaholic", fields: [{ key: "wrath", label: "ui.meritConfig.chosenWrath", kind: "text" }] },
  { name: "Acquired Taste", fields: [{ key: "supernatural_kind", label: "ui.meritConfig.sapientSupernaturalKind", kind: "text" }] },
  { name: "Favored Phobia", fields: [{ key: "fear", label: "ui.meritConfig.chosenFear", kind: "text" }] },
  { name: "Grief Connoisseur", fields: [{ key: "sorrow", label: "ui.meritConfig.chosenSorrow", kind: "text" }] },
  { name: "Strange Favor", fields: [{ key: "entity", label: "ui.meritConfig.supernaturalEntity", kind: "text" }, { key: "favor", label: "ui.meritConfig.favorOwed", kind: "textarea" }] },
];

const INLINE = new Set(["Eerie Eyes", "Material Affinity", "Mover and Shaker", "Running with the Wolves", "Friends in Low Places", "A Taste of Honey", "Rageaholic", "Acquired Taste", "Favored Phobia", "Grief Connoisseur"]);
export const isChangelingInlineMeritConfiguration = (name: string) => INLINE.has(name);
