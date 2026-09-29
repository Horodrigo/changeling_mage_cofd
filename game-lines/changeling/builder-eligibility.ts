import type { CourtDefinition } from "@/lib/changeling-courts";

function courtCanonicalId(courts: readonly CourtDefinition[], value: unknown) {
  const raw = String(value ?? "").trim();
  const normalized = raw.toLocaleLowerCase();
  return courts.find((item) =>
    [item.id, item.name, item.translatedName, item.name.replace(/ Court$/, "")]
      .some((candidate) => candidate.toLocaleLowerCase() === normalized),
  )?.id ?? raw;
}

export function canSelectContract(
  contract: { type: "Comum" | "Real"; regalia: string; categoryKind?: string; courtClauses?: Record<string, string>; courtIds?: string[] },
  favoredRegalia: readonly string[],
  court: string,
  courts: readonly CourtDefinition[],
) {
  const selectedCourt = courtCanonicalId(courts, court).toLocaleLowerCase();
  const hasCourt = Boolean(selectedCourt) && !["courtless", "sem corte"].includes(selectedCourt);
  if (contract.categoryKind === "Corte") {
    if (contract.courtIds?.length || contract.courtClauses) {
      return (contract.courtIds ?? Object.keys(contract.courtClauses ?? {}))
        .some((key) => courtCanonicalId(courts, key).toLocaleLowerCase() === selectedCourt);
    }
    return hasCourt && (contract.regalia === "All" || courtCanonicalId(courts, contract.regalia).toLocaleLowerCase() === selectedCourt);
  }
  if (contract.categoryKind === "Independente" || ["Independent", "Independente"].includes(contract.regalia)) return true;
  const isCourtContract = new Set([
    "Primavera", "Verão", "Outono", "Inverno", "Cortes Adicionais",
    ...courts.map((definition) => definition.translatedName),
  ]).has(contract.regalia);
  if (isCourtContract) return hasCourt && courtCanonicalId(courts, contract.regalia).toLocaleLowerCase() === selectedCourt;
  if (contract.type === "Real") return favoredRegalia.includes(contract.regalia);
  return true;
}

export function contractCategoryKey(contract: { goblin?: boolean; regalia: string; categoryKind?: string; courtIds?: string[]; courtClauses?: Record<string, string> }) {
  if (contract.goblin || contract.regalia === "Goblin") return "goblin";
  if (contract.categoryKind === "Corte" || contract.regalia === "All" || contract.courtIds?.length || contract.courtClauses) return "court";
  if (contract.categoryKind === "Independente" || ["Independent", "Independente"].includes(contract.regalia)) return "independent";
  return contract.regalia;
}
