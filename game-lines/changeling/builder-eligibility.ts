import type { CourtDefinition } from "@/lib/changeling-courts";

function courtCanonicalId(courts: readonly CourtDefinition[], value: unknown) {
  const raw = String(value ?? "").trim();
  const normalized = raw.toLocaleLowerCase();
  return courts.find((item) =>
    [item.id, item.name, item.translatedName, item.name.replace(/ Court$/, "")]
      .some((candidate) => candidate.toLocaleLowerCase() === normalized),
  )?.id ?? raw;
}

export function canSelectInitialContract(
  contract: { type: "Comum" | "Real"; regalia: string; categoryKind?: string; courtClauses?: Record<string, string>; courtIds?: string[] },
  favoredRegalia: readonly string[],
  court: string,
  courts: readonly CourtDefinition[],
) {
  if (contract.categoryKind === "Corte") {
    if (contract.courtIds?.length || contract.courtClauses) {
      const normalized = courtCanonicalId(courts, court).toLocaleLowerCase();
      return (contract.courtIds ?? Object.keys(contract.courtClauses ?? {}))
        .some((key) => key.toLocaleLowerCase() === normalized);
    }
    return Boolean(court) && (contract.regalia === "All" || contract.regalia === court);
  }
  if (contract.categoryKind === "Independente") return true;
  const isCourtContract = new Set([
    "Primavera", "Verão", "Outono", "Inverno", "Cortes Adicionais",
    ...courts.map((definition) => definition.translatedName),
  ]).has(contract.regalia);
  if (isCourtContract) return Boolean(court) && contract.regalia === court;
  if (contract.type === "Real") return favoredRegalia.includes(contract.regalia);
  return true;
}
