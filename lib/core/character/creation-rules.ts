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

export const ATTRIBUTE_BUDGETS = [5, 4, 3] as const;
export const SKILL_BUDGETS = [11, 7, 4] as const;

/** Count only editable creation dots; callers remove line grants and XP first. */
export function creationCategoryDots(values: Record<string, number>, groups: Record<string, readonly string[]>, base: number, maximum = 5) {
  return Object.values(groups).map(names => names.reduce((total, name) => {
    const dots = values[name] ?? base;
    return Number.isInteger(dots) && dots >= base && dots <= maximum ? total + dots - base : NaN;
  }, 0));
}

/** A partial allocation is legal if some assignment of the three budgets fits. */
export function creationAllocationFits(spent: readonly number[], budgets: readonly number[], complete = false) {
  const orderedBudgets = [...budgets].sort((a, b) => b - a);
  return spent.length === budgets.length && [...spent].sort((a, b) => b - a).every((dots, index) =>
    Number.isInteger(dots) && dots >= 0 && (complete ? dots === orderedBudgets[index] : dots <= orderedBudgets[index]),
  );
}
