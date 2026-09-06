import { MERITS_EN } from "./merits-en.generated";
import { SUPPLEMENTAL_MERITS_EN } from "./merits-supplements-en";

export type GameLine = "CtL" | "MtA";
export type MeritLevel = { rating: number; name: string; description: string };
export type MeritDefinition = {
  id: string;
  name: string;
  ratings: number[];
  line: "Core" | GameLine;
  sourceId: string;
  source: string;
  category: string;
  priority: number;
  translatedName: string;
  description: string;
  descriptionEn: string;
  prerequisites?: string;
  page: number;
  levels?: MeritLevel[];
  courtAccess?: { court: "Spring" | "Summer" | "Autumn" | "Winter"; mantle: number; courtGoodwill: number };
};

export const RAW_MERITS: MeritDefinition[] = [...MERITS_EN, ...SUPPLEMENTAL_MERITS_EN].map((item) => ({
  ...item,
  ratings: [...item.ratings],
  levels: "levels" in item ? item.levels.map((level) => ({ ...level })) : undefined,
  prerequisites: item.prerequisites ?? undefined,
  priority: item.line === "CtL" ? 2 : 1,
  // English is canonical. Portuguese fields intentionally fall back to English
  // until the separately audited translation phase.
  translatedName: item.name,
  descriptionEn: item.description,
  description: item.description,
}));

export const REPEATABLE_MERITS = new Set([
  "Allies", "Alternate Identity", "Contacts", "Court Goodwill", "Fae Mount",
  "Language", "Library", "Mentor", "Retainer", "Safe Place", "Staff", "Status",
  "Token", "Touchstone",
]);
export const EXTENDED_DOT_MERITS = new Set(["Token"]);
export const meritRatingsFor = (merit: Pick<MeritDefinition, "ratings">) => merit.ratings;
export const meritPrerequisitesFor = (merit: Pick<MeritDefinition, "prerequisites">) => merit.prerequisites;

export type MeritPrerequisiteContext = {
  gameLine: GameLine;
  attributes?: Record<string, number>;
  skills?: Record<string, number>;
  merits?: Array<{ name: string; dots: number }>;
};

export function meritPrerequisitesMet(
  merit: Pick<MeritDefinition, "name" | "prerequisites">,
  context: MeritPrerequisiteContext,
) {
  if (merit.name === "Lucid Dreamer" && context.gameLine === "CtL") return false;
  return true;
}

export function getMeritsForLine(line: GameLine) {
  const selected = new Map<string, MeritDefinition>();
  for (const merit of RAW_MERITS.filter((item) => item.line === "Core" || item.line === line)) {
    const current = selected.get(merit.name.toLocaleLowerCase("en"));
    if (!current || merit.priority > current.priority) selected.set(merit.name.toLocaleLowerCase("en"), merit);
  }
  return [...selected.values()].sort((a,b) => a.name.localeCompare(b.name,"en"));
}

export const MERIT_RULES = (["CtL", "MtA"] as const).map((line) => ({
  id: `merits-${line.toLowerCase()}-shared-v2`,
  name: `Merit catalog ${line}`,
  gameLine: line,
  sourceId: line === "CtL" ? "ctl-2ed" : "mta-2ed",
  page: 0,
  data: {
    precedence: [line,"Core"],
    merits: getMeritsForLine(line).map(({id,name,ratings,sourceId,source,category}) => ({id,name,ratings,sourceId,source,category})),
  },
}));
