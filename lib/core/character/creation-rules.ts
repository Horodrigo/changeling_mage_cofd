export const ATTRIBUTES = {
  Mental: ["Intelligence", "Wits", "Resolve"],
  Physical: ["Strength", "Dexterity", "Stamina"],
  Social: ["Presence", "Manipulation", "Composure"],
} as const;

export const SKILLS = {
  Mental: ["Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science"],
  Physical: ["Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Weaponry", "Stealth", "Survival"],
  Social: ["Animal Ken", "Empathy", "Expression", "Intimidation", "Persuasion", "Socialize", "Streetwise", "Subterfuge"],
} as const;

export function canIncreaseCreationDots(used:number,budget:number|undefined,current:number,maximum=5) {
  return budget !== undefined && used < budget && current < maximum;
}
