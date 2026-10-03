import { HEDGE_DUELIST_VARIANTS } from "./hedge-duelist-variants";
import type { MeritConfigDefinition } from "@/lib/core/character/merit-configuration";

const SKILLS = ["Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science", "Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry", "Animal Ken", "Empathy", "Expression", "Intimidation", "Persuasion", "Socialize", "Streetwise", "Subterfuge"];
const PHYSICAL_SKILLS = SKILLS.filter((item) => ["Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry"].includes(item));
const select = (values: string[]) => values.map((label) => ({ value: label, label }));

export const CHANGELING_MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [
  { id:"ctl-2ed:hedge-duelist", name:"Hedge Duelist", fields: [{ key: "firstManeuver", label: "ui.meritConfig.firstDotManeuver", kind: "select", options: HEDGE_DUELIST_VARIANTS.map(({ label, value }) => ({ value: label, label: `ui.hedgeDuelist.${value}.choice` })) }] },
  { id:"ctl-2ed:court-goodwill", name:"Court Goodwill", fields: [{ key: "court", label: "ui.meritConfig.court", kind: "court" }] },
  { id:"ctl-2ed:token", name:"Token", fields: [] }, { id:"ctl-2ed:hedgespun-item", name:"Hedgespun Item", fields: [] }, { id:"ctl-2ed:warded-dreams", name:"Warded Dreams", fields: [] },
  { id:"ctl-2ed:hollow", name:"Hollow", fields: [] }, { id:"ctl-2ed:stable-trod", name:"Stable Trod", fields: [] }, { id:"ctl-2ed:workshop", name:"Workshop", fields: [] }, { id:"ctl-hedge:shared-bastion", name:"Shared Bastion", fields: [] }, { id:"oak-ash-thorn:entitlement", name:"Entitlement", fields: [] },
  { id:"h-seemings:blood-and-bone", name:"Blood and Bone", fields: [{ key: "skill_1", label: "ui.meritConfig.physicalSkill", kind: "select", options: select(PHYSICAL_SKILLS) }, { key: "skill_2", label: "ui.meritConfig.secondSkill", kind: "select", options: select(SKILLS) }, { key: "animal", label: "ui.meritConfig.animalReflectedByFaeMien", kind: "text" }] },
  { id:"h-seemings:eerie-eyes", name:"Eerie Eyes", fields: [{ key: "sensory_organs", label: "ui.meritConfig.unusualSensoryOrgans", kind: "text" }] },
  { id:"h-seemings:know-it-all", name:"Know-It-All", fields: [{ key: "skill", label: "ui.meritConfig.chosenSkill", kind: "select", options: select(["Academics", "Occult", "Politics", "Science"]) }] },
  { id:"h-seemings:material-affinity", name:"Material Affinity", fields: [{ key: "material", label: "ui.meritConfig.chosenMaterial", kind: "text" }] },
  { id:"h-seemings:mover-and-shaker", name:"Mover and Shaker", fields: [{ key: "subculture", label: "ui.meritConfig.subculture", kind: "text" }] },
  { id:"h-seemings:running-with-the-wolves", name:"Running with the Wolves", fields: [{ key: "animal_group", label: "ui.meritConfig.animalGroup", kind: "text" }] },
  { id:"h-seemings:still-waters-run-deep", name:"Still Waters Run Deep", fields: [{ key: "attribute", label: "ui.meritConfig.chosenAttribute", kind: "select", options: select(["Intelligence", "Wits", "Resolve", "Strength", "Dexterity", "Stamina", "Presence", "Manipulation", "Composure"]) }] },
  { id:"ctl-2ed:elemental-warrior", name:"Elemental Warrior", fields: [{ key: "element", label: "ui.meritConfig.physicalElement", kind: "text" }] },
  { id:"h-seemings:fae-pet", name:"Fae Pet", fields: [{ key: "name", label: "ui.meritConfig.name", kind: "text" }, { key: "animalId", label: "ui.meritConfig.animal", kind: "text" }, { key: "dread_power", label: "ui.meritConfig.dreadPower", kind: "text", placeholder: "ui.meritConfig.petDreadPowerName" }] },
  { id:"h-courts:friends-in-low-places", name:"Friends in Low Places", fields: [{ key: "group", label: "ui.meritConfig.group", kind: "text" }] },
  { id:"h-courts:a-taste-of-honey", name:"A Taste of Honey", fields: [{ key: "desire", label: "ui.meritConfig.chosenDesire", kind: "text" }] },
  { id:"h-courts:rageaholic", name:"Rageaholic", fields: [{ key: "wrath", label: "ui.meritConfig.chosenWrath", kind: "text" }] },
  { id:"h-courts:acquired-taste", name:"Acquired Taste", fields: [{ key: "supernatural_kind", label: "ui.meritConfig.sapientSupernaturalKind", kind: "text" }] },
  { id:"h-courts:favored-phobia", name:"Favored Phobia", fields: [{ key: "fear", label: "ui.meritConfig.chosenFear", kind: "text" }] },
  { id:"h-courts:grief-connoisseur", name:"Grief Connoisseur", fields: [{ key: "sorrow", label: "ui.meritConfig.chosenSorrow", kind: "text" }] },
  { id:"h-courts:strange-favor", name:"Strange Favor", fields: [{ key: "entity", label: "ui.meritConfig.supernaturalEntity", kind: "text" }, { key: "favor", label: "ui.meritConfig.favorOwed", kind: "textarea" }] },
];

export const isChangelingInlineMeritConfiguration = (id: string) => CHANGELING_MERIT_CONFIGURATIONS.some(item => item.id === id && item.fields.length === 1 && item.fields[0].kind === "text");
