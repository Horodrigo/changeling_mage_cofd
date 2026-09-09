/** Named published Orders; a player-created name alone does not grant Order benefits. */
export const PUBLISHED_MAGE_ORDERS = [
  "Adamantine Arrow", "Free Council", "Guardians of the Veil", "Mysterium", "Silver Ladder", "Seers of the Throne",
  "Tremere", "Jnanashakti", "Mahanizrayani", "Samashti", "Vajrastra", "Ajivaki", "Arcadian Mysteries", "Karpani", "Mantra Sadhaki", "Weret-Hekau", "Bay City Marshals", "Company of the Codex",
] as const;
export function hasPublishedMageOrder(order: unknown): boolean {
  return (PUBLISHED_MAGE_ORDERS as readonly string[]).includes(String(order??""));
}
