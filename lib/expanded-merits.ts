import { RAW_MERITS, getMeritsForLine, type GameLine } from "./merits";

export type ExpandedMeritLevel = { rating: number; name: string; description: string };
export type ExpandedMeritDefinition = {
  name: string;
  translatedName: string;
  prerequisites: string;
  sourceId: string;
  source: string;
  page: number;
  line?: "Core" | "CtL" | "MtA";
  levels: ExpandedMeritLevel[];
};

export const EXPANDED_MERITS: ExpandedMeritDefinition[] = RAW_MERITS
  .filter((item) => item.levels?.length)
  .map((item) => ({
    name: item.name,
    translatedName: item.name,
    prerequisites: item.prerequisites ?? "",
    sourceId: item.sourceId,
    source: item.source,
    page: item.page,
    line: item.line,
    levels: item.levels!.map((level) => ({...level})),
  }));
export const EXPANDED_MERIT_NAMES = new Set(EXPANDED_MERITS.map((item) => item.name));
export const findExpandedMerit = (name: string,line?:GameLine) => line
  ? getMeritsForLine(line).find(item=>item.name===name&&item.levels?.length)
  : EXPANDED_MERITS.find((item) => item.name === name);
