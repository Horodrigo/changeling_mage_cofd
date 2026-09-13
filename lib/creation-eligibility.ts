import { CTL_COURT_DEFINITIONS } from "./changeling-courts";

const COURT_CONTRACT_GROUPS = new Set([
  "Primavera",
  "Verão",
  "Outono",
  "Inverno",
  "Cortes Adicionais",
  ...CTL_COURT_DEFINITIONS.map((court) => court.translatedName),
]);

export function meetsArcanaRequirements(
  requirements: Record<string, number>,
  arcana: Record<string, number>,
) {
  const translatedArcana: Record<string, string> = {
    Death: "Morte",
    Fate: "Destino",
    Forces: "Forças",
    Life: "Vida",
    Matter: "Matéria",
    Mind: "Mente",
    Prime: "Primórdio",
    Space: "Espaço",
    Spirit: "Espírito",
    Time: "Tempo",
  };
  return Object.entries(requirements).every(
    ([arcanum, dots]) =>
      Number(arcana[arcanum] ?? arcana[translatedArcana[arcanum]] ?? 0) >= dots,
  );
}

export function arcanaCreationErrors(
  arcana: Record<string, number>,
  path?: { ruling: readonly string[]; inferior?: string },
) {
  const errors: string[] = [];
  const total = Object.values(arcana).reduce(
    (sum, value) => sum + Number(value),
    0,
  );
  if (total !== 6)
    errors.push(
      total < 6
        ? `Distribua mais ${6 - total} ponto(s) de Arcana (atual: ${total}/6)`
        : `Remova ${total - 6} ponto(s) de Arcana (atual: ${total}/6)`,
    );
  if (Object.values(arcana).filter((value) => Number(value) === 3).length > 1)
    errors.push("Somente um Arcano pode começar com 3 pontos");
  if (!path) return errors;

  const missingRuling = path.ruling.filter(
    (arcanum) => Number(arcana[arcanum] ?? 0) < 1,
  );
  if (missingRuling.length)
    errors.push(
      `Cada Arcano Regente precisa de ao menos 1 ponto: ${missingRuling.join(" e ")}`,
    );
  const rulingTotal = path.ruling.reduce(
    (sum, arcanum) => sum + Number(arcana[arcanum] ?? 0),
    0,
  );
  if (rulingTotal < 3)
    errors.push(`Os Arcanos Regentes precisam somar ao menos 3 (atual: ${rulingTotal})`);
  if (rulingTotal > 5)
    errors.push(`Os Arcanos Regentes podem somar no máximo 5 (atual: ${rulingTotal})`);
  if (path.inferior && Number(arcana[path.inferior] ?? 0) !== 0)
    errors.push(`O Arcano Inferior ${path.inferior} deve começar com 0 pontos`);
  return errors;
}

export function canSelectInitialContract(
  contract: { type: "Comum" | "Real"; regalia: string; categoryKind?: string; courtClauses?: Record<string, string>; courtIds?: string[] },
  favoredRegalia: readonly string[],
  court: string,
) {
  const customKind = (contract as { categoryKind?: string }).categoryKind;
  if (customKind === "Corte") {
    if (contract.courtIds?.length || contract.courtClauses) {
      const normalized = courtCanonicalId(court).toLocaleLowerCase();
      return (contract.courtIds ?? Object.keys(contract.courtClauses ?? {})).some((key) => key.toLocaleLowerCase() === normalized);
    }
    return Boolean(court) && (contract.regalia === "All" || contract.regalia === court);
  }
  if (customKind === "Independente") return true;
  const isCourtContract =
    COURT_CONTRACT_GROUPS.has(contract.regalia) ||
    CTL_COURT_DEFINITIONS.some((definition) => definition.translatedName === contract.regalia);
  if (isCourtContract) return Boolean(court) && contract.regalia === court;
  if (contract.type === "Real") return favoredRegalia.includes(contract.regalia);
  return true;
}
import { courtCanonicalId } from "./changeling-courts";
