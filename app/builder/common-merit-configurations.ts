import type { MeritConfigDefinition } from "@/lib/core/character/merit-configuration";

const MENTOR_TRAITS = [
  "Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science",
  "Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry",
  "Animal Ken", "Empathy", "Expression", "Intimidation", "Persuasion", "Socialize", "Streetwise", "Subterfuge", "Resources",
].map((label) => ({ value: label, label }));

export const COMMON_MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [
  { name: "Contacts", fields: [{ key: "groups", label: "Groups, organizations or contact name", kind: "list" }] },
  { name: "Staff", fields: [{ key: "skills", label: "Staff Skills", kind: "list" }] },
  { name: "Allies", fields: [{ key: "subject", label: "Allied group", kind: "text" }] },
  { name: "Alternate Identity", fields: [{ key: "identity", label: "Identity", kind: "text" }] },
  { name: "Language", fields: [{ key: "language", label: "Language", kind: "text" }] },
  { name: "Library", fields: [{ key: "subject", label: "Relevant Skill or subject", kind: "text" }] },
  { name: "Safe Place", fields: [{ key: "place", label: "Safe Place", kind: "text" }] },
  { name: "Status", fields: [{ key: "group", label: "Group", kind: "text" }] },
  { name: "Striking Looks", fields: [{ key: "appearance", label: "Distinctive appearance", kind: "text" }] },
  { name: "Mentor", fields: [
    { key: "name", label: "Mentor name", kind: "text", placeholder: "Mentor name" },
    { key: "trait_1", label: "Mentor trait 1", kind: "select", options: MENTOR_TRAITS },
    { key: "trait_2", label: "Mentor trait 2", kind: "select", options: MENTOR_TRAITS },
    { key: "trait_3", label: "Mentor trait 3", kind: "select", options: MENTOR_TRAITS },
  ] },
  { name: "Retainer", fields: [{ key: "name", label: "Retainer name", kind: "text" }, { key: "purview", label: "Area of expertise", kind: "text" }] },
  { name: "Area of Expertise", fields: [{ key: "specialty", label: "Specialty", kind: "text", placeholder: "Specialty receiving the increased bonus" }] },
  { name: "Defensive Combat", fields: [{ key: "skill", label: "Defense Skill", kind: "select", options: ["Brawl", "Weaponry"].map((label) => ({ value: label, label })) }] },
  { name: "Fighting Finesse", fields: [{ key: "skill", label: "Combat Skill", kind: "select", options: ["Brawl", "Weaponry"].map((label) => ({ value: label, label })) }] },
  { name: "Multilingual", fields: [{ key: "languages", label: "Additional languages", kind: "list" }] },
  { name: "Quick Draw", fields: [{ key: "specialty", label: "Weapon Specialty", kind: "text", placeholder: "Firearms or Weaponry Specialty" }] },
  { name: "Unseen Sense", fields: [{ key: "phenomenon", label: "Supernatural phenomenon", kind: "text" }] },
  { name: "Professional Training", fields: [] },
  { name: "Mystery Cult Initiation", fields: [] },
  { name: "Mystery Cult Influence", fields: [] },
];

const COMMON_INLINE = new Set(["Allies", "Alternate Identity", "Area of Expertise", "Language", "Library", "Quick Draw", "Safe Place", "Status", "Striking Looks", "Unseen Sense"]);
export const isCommonInlineMeritConfiguration = (name: string) => COMMON_INLINE.has(name);
