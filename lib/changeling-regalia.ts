const REGALIA_ALIASES: Record<string, string> = {
  Coroa: "Crown", Joias: "Jewels", Espelho: "Mirror", Escudo: "Shield",
  Corcel: "Steed", Espada: "Sword", Cálice: "Chalice", Moeda: "Coin",
  Cetro: "Scepter", Estrelas: "Stars", Espinho: "Thorn",
};
const canonicalRegalia = (value: unknown) => {
  const name = String(value ?? "").trim();
  return REGALIA_ALIASES[name] ?? name;
};

/** Derive Kith affinity so existing sheets benefit without a migration or stale grants. */
export function changelingFavoredRegalia(data: Record<string, unknown>): string[] {
  const favored = [data.primary_regalia, data.second_regalia].map(canonicalRegalia).filter(Boolean);
  const kith = String(data.kith ?? "").trim().toLowerCase();
  if (!data.kith_custom && ["shadowsoul", "alma sombria"].includes(kith)) favored.push("Mirror");
  return [...new Set(favored)];
}

export function changelingContractExperienceCost(
  contract: { goblin?: boolean; type: string; regalia: string },
  data: Record<string, unknown>,
): number {
  if (contract.goblin) return 2;
  const favored = changelingFavoredRegalia(data).includes(canonicalRegalia(contract.regalia));
  return contract.type === "Comum" ? (favored ? 2 : 3) : favored ? 3 : 4;
}
