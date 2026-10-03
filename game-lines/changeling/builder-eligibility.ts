import type { CourtDefinition } from "@/lib/changeling-courts";
import type { MeritSelection } from "@/lib/core/character/character-types";
import { changelingMeritId } from "./merit-identities";

function courtCanonicalId(courts: readonly CourtDefinition[], value: unknown) {
  const raw = String(value ?? "").trim();
  const normalized = raw.toLocaleLowerCase();
  return courts.find((item) =>
    [item.id, item.name, item.translatedName, item.name.replace(/ Court$/, ""), item.translatedName.replace(/^Corte (?:da|de|do|das|dos) /, "")]
      .some((candidate) => candidate.toLocaleLowerCase() === normalized),
  )?.id ?? raw;
}

export function canSelectContract(
  contract: { type: "Comum" | "Real"; regalia: string; categoryKind?: string; courtClauses?: Record<string, string>; courtIds?: string[] },
  favoredRegalia: readonly string[],
  court: string,
  courts: readonly CourtDefinition[],
  merits: readonly Pick<MeritSelection, "name" | "definitionId" | "sourceId" | "dots" | "configuration">[] = [],
) {
  const selectedCourt = courtCanonicalId(courts, court).toLocaleLowerCase();
  const courtContract = contract.categoryKind === "Corte" || new Set([
    "Primavera", "Verão", "Outono", "Inverno", "Cortes Adicionais",
    ...courts.map((definition) => definition.translatedName),
  ]).has(contract.regalia);
  if (courtContract) {
    const mantleRequired = contract.type === "Comum" ? 1 : 3;
    const goodwillRequired = contract.type === "Comum" ? 2 : 5;
    const qualifies = (merit: Pick<MeritSelection, "name" | "definitionId" | "sourceId" | "dots">) =>
      changelingMeritId(merit) === "ctl-2ed:mantle" && merit.dots >= mantleRequired ||
      changelingMeritId(merit) === "ctl-2ed:court-goodwill" && merit.dots >= goodwillRequired;
    const meritCourt = (merit: Pick<MeritSelection, "name" | "definitionId" | "sourceId" | "configuration">) =>
      courtCanonicalId(courts, merit.configuration?.court || (changelingMeritId(merit) === "ctl-2ed:mantle" ? selectedCourt : "")).toLocaleLowerCase();
    const hasAccess = (targetCourt: string) => merits.some((merit) => meritCourt(merit) === targetCourt && qualifies(merit));
    if (contract.regalia === "All") return merits.some((merit) => qualifies(merit) && !["", "courtless", "sem corte"].includes(meritCourt(merit)));
    const targetCourts = contract.courtIds ?? Object.keys(contract.courtClauses ?? {});
    return (targetCourts.length ? targetCourts : [contract.regalia])
      .some((target) => hasAccess(courtCanonicalId(courts, target).toLocaleLowerCase()));
  }
  if (contract.categoryKind === "Independente" || ["Independent", "Independente"].includes(contract.regalia)) return true;
  if (contract.type === "Real") return favoredRegalia.includes(contract.regalia);
  return true;
}

export function contractCategoryKey(contract: { goblin?: boolean; regalia: string; categoryKind?: string; courtIds?: string[]; courtClauses?: Record<string, string> }) {
  if (contract.goblin || contract.regalia === "Goblin") return "goblin";
  if (contract.categoryKind === "Corte" || contract.regalia === "All" || contract.courtIds?.length || contract.courtClauses) return "court";
  if (contract.categoryKind === "Independente" || ["Independent", "Independente"].includes(contract.regalia)) return "independent";
  return contract.regalia;
}
