import type { MeritConfigDefinition } from "@/lib/core/character/merit-configuration";

const MENTOR_TRAITS = [
  "Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science",
  "Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry",
  "Animal Ken", "Empathy", "Expression", "Intimidation", "Persuasion", "Socialize", "Streetwise", "Subterfuge", "Resources",
].map((label) => ({ value: label, label: label === "Resources" ? "ui.meritConfig.resources" : label }));

export const COMMON_MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [
  { id: "core-2ed:hobbyist-clique", name: "Hobbyist Clique", fields: [{ key: "skill", label: "ui.skill", kind: "select", options: MENTOR_TRAITS.filter(item => item.value !== "Resources") }] },
  { id:"core-2ed:contacts", name:"Contacts", fields: [{ key: "groups", label: "ui.meritConfig.groupsOrganizationsOrContactName", kind: "list" }] },
  { id:"core-2ed:staff", name:"Staff", fields: [{ key: "skills", label: "ui.meritConfig.staffSkills", kind: "list" }] },
  { id:"core-2ed:allies", name:"Allies", fields: [{ key: "subject", label: "ui.meritConfig.alliedGroup", kind: "text" }] },
  { id:"core-2ed:alternate-identity", name:"Alternate Identity", fields: [{ key: "identity", label: "ui.meritConfig.identity", kind: "text" }] },
  { id:"core-2ed:language", name:"Language", fields: [{ key: "language", label: "ui.meritConfig.language", kind: "text" }] },
  { id:"core-2ed:library", name:"Library", fields: [{ key: "subject", label: "ui.meritConfig.relevantSkillOrSubject", kind: "text" }] },
  { id:"core-2ed:safe-place", name:"Safe Place", fields: [{ key: "place", label: "ui.meritConfig.safePlace", kind: "text" }] },
  { id:"core-2ed:status", name:"Status", fields: [{ key: "group", label: "ui.meritConfig.group", kind: "text" }] },
  { id:"core-2ed:striking-looks", name:"Striking Looks", fields: [{ key: "appearance", label: "ui.meritConfig.distinctiveAppearance", kind: "text" }] },
  { id:"core-2ed:mentor", name:"Mentor", fields: [
    { key: "name", label: "ui.meritConfig.mentorName", kind: "text", placeholder: "ui.meritConfig.mentorName" },
    { key: "trait_1", label: "ui.meritConfig.mentorTrait1", kind: "select", options: MENTOR_TRAITS },
    { key: "trait_2", label: "ui.meritConfig.mentorTrait2", kind: "select", options: MENTOR_TRAITS },
    { key: "trait_3", label: "ui.meritConfig.mentorTrait3", kind: "select", options: MENTOR_TRAITS },
  ] },
  { id:"core-2ed:retainer", name:"Retainer", fields: [{ key: "name", label: "ui.meritConfig.retainerName", kind: "text" }, { key: "purview", label: "ui.meritConfig.areaOfExpertise", kind: "text" }] },
  { id:"core-2ed:area-of-expertise", name:"Area of Expertise", fields: [{ key: "specialty", label: "ui.meritConfig.specialty", kind: "text", placeholder: "ui.meritConfig.specialtyReceivingIncreasedBonus" }] },
  { id:"core-2ed:defensive-combat", name:"Defensive Combat", fields: [{ key: "skill", label: "ui.meritConfig.defenseSkill", kind: "select", options: ["Brawl", "Weaponry"].map((label) => ({ value: label, label })) }] },
  { id:"core-2ed:fighting-finesse", name:"Fighting Finesse", fields: [{ key: "skill", label: "ui.meritConfig.combatSkill", kind: "select", options: ["Brawl", "Weaponry"].map((label) => ({ value: label, label })) }] },
  { id:"core-2ed:multilingual", name:"Multilingual", fields: [{ key: "languages", label: "ui.meritConfig.additionalLanguages", kind: "list", rowsPerDot: 2 }] },
  { id:"core-2ed:quick-draw", name:"Quick Draw", fields: [{ key: "specialty", label: "ui.meritConfig.weaponSpecialty", kind: "text", placeholder: "ui.meritConfig.firearmsOrWeaponrySpecialty" }] },
  { id:"core-2ed:unseen-sense", name:"Unseen Sense", fields: [{ key: "phenomenon", label: "ui.meritConfig.supernaturalPhenomenon", kind: "text" }] },
  { id:"core-2ed:professional-training", name:"Professional Training", fields: [] },
  { id:"core-2ed:interdisciplinary-specialty", name:"Interdisciplinary Specialty", fields: [] },
  { id:"core-2ed:mystery-cult-initiation", name:"Mystery Cult Initiation", fields: [] },
  { id:"core-2ed:mystery-cult-influence", name:"Mystery Cult Influence", fields: [] },
];

export const isCommonInlineMeritConfiguration = (id: string) => COMMON_MERIT_CONFIGURATIONS.some(item => item.id === id && item.fields.length === 1 && item.fields[0].kind === "text");
