import type { MeritConfigDefinition } from "@/lib/core/character/merit-configuration";

const MENTOR_TRAITS = [
  "Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science",
  "Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry",
  "Animal Ken", "Empathy", "Expression", "Intimidation", "Persuasion", "Socialize", "Streetwise", "Subterfuge", "Resources",
].map((label) => ({ value: label, label: label === "Resources" ? "ui.meritConfig.resources" : label }));

export const COMMON_MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [
  { name: "Contacts", fields: [{ key: "groups", label: "ui.meritConfig.groupsOrganizationsOrContactName", kind: "list" }] },
  { name: "Staff", fields: [{ key: "skills", label: "ui.meritConfig.staffSkills", kind: "list" }] },
  { name: "Allies", fields: [{ key: "subject", label: "ui.meritConfig.alliedGroup", kind: "text" }] },
  { name: "Alternate Identity", fields: [{ key: "identity", label: "ui.meritConfig.identity", kind: "text" }] },
  { name: "Language", fields: [{ key: "language", label: "ui.meritConfig.language", kind: "text" }] },
  { name: "Library", fields: [{ key: "subject", label: "ui.meritConfig.relevantSkillOrSubject", kind: "text" }] },
  { name: "Safe Place", fields: [{ key: "place", label: "ui.meritConfig.safePlace", kind: "text" }] },
  { name: "Status", fields: [{ key: "group", label: "ui.meritConfig.group", kind: "text" }] },
  { name: "Striking Looks", fields: [{ key: "appearance", label: "ui.meritConfig.distinctiveAppearance", kind: "text" }] },
  { name: "Mentor", fields: [
    { key: "name", label: "ui.meritConfig.mentorName", kind: "text", placeholder: "ui.meritConfig.mentorName" },
    { key: "trait_1", label: "ui.meritConfig.mentorTrait1", kind: "select", options: MENTOR_TRAITS },
    { key: "trait_2", label: "ui.meritConfig.mentorTrait2", kind: "select", options: MENTOR_TRAITS },
    { key: "trait_3", label: "ui.meritConfig.mentorTrait3", kind: "select", options: MENTOR_TRAITS },
  ] },
  { name: "Retainer", fields: [{ key: "name", label: "ui.meritConfig.retainerName", kind: "text" }, { key: "purview", label: "ui.meritConfig.areaOfExpertise", kind: "text" }] },
  { name: "Area of Expertise", fields: [{ key: "specialty", label: "ui.meritConfig.specialty", kind: "text", placeholder: "ui.meritConfig.specialtyReceivingIncreasedBonus" }] },
  { name: "Defensive Combat", fields: [{ key: "skill", label: "ui.meritConfig.defenseSkill", kind: "select", options: ["Brawl", "Weaponry"].map((label) => ({ value: label, label })) }] },
  { name: "Fighting Finesse", fields: [{ key: "skill", label: "ui.meritConfig.combatSkill", kind: "select", options: ["Brawl", "Weaponry"].map((label) => ({ value: label, label })) }] },
  { name: "Multilingual", fields: [{ key: "languages", label: "ui.meritConfig.additionalLanguages", kind: "list" }] },
  { name: "Quick Draw", fields: [{ key: "specialty", label: "ui.meritConfig.weaponSpecialty", kind: "text", placeholder: "ui.meritConfig.firearmsOrWeaponrySpecialty" }] },
  { name: "Unseen Sense", fields: [{ key: "phenomenon", label: "ui.meritConfig.supernaturalPhenomenon", kind: "text" }] },
  { name: "Professional Training", fields: [] },
  { name: "Mystery Cult Initiation", fields: [] },
  { name: "Mystery Cult Influence", fields: [] },
];

const COMMON_INLINE = new Set(["Allies", "Alternate Identity", "Area of Expertise", "Language", "Library", "Quick Draw", "Safe Place", "Status", "Striking Looks", "Unseen Sense"]);
export const isCommonInlineMeritConfiguration = (name: string) => COMMON_INLINE.has(name);
