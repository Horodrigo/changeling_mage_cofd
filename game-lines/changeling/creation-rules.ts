import { translate } from "@/lib/i18n";
import creationCatalog from "./catalog-data/creation.json";

export const CTL_SEEMINGS = creationCatalog.seemings;
export { CTL_SEEMING_LABELS, seemingDisplayName } from "./seeming-presentation";

export type ChangelingAnchorDefinition = {
  name: string;
  translatedName?: string;
  sourceId?: "ctl-2ed" | "h-courts" | "h-seemings";
  source?: string;
  page?: number;
  singleWillpower: string;
  allWillpower: string;
  singleWillpowerPt: string;
  allWillpowerPt: string;
};

export const CTL_NEEDLE_DEFINITIONS = creationCatalog.needles as unknown as ChangelingAnchorDefinition[];

export const CTL_THREAD_DEFINITIONS = creationCatalog.threads as unknown as ChangelingAnchorDefinition[];

export const CTL_NEEDLES = CTL_NEEDLE_DEFINITIONS.map((item) => item.name);

export const CTL_THREADS = CTL_THREAD_DEFINITIONS.map((item) => item.name);

const LEGACY_NEEDLE_NAMES: Record<string, string> = {
  "Mestre de Xadrez": "Chess Master",
  Comandante: "Commander",
  Compositor: "Composer",
  Conselheiro: "Counselor",
  Audacioso: "Daredevil",
  "Dínamo": "Dynamo",
  Protetor: "Protector",
  Provedor: "Provider",
  Erudito: "Scholar",
  "Contador de Histórias": "Storyteller",
  Professor: "Teacher",
  Tradicionalista: "Traditionalist",
  Visionário: "Visionary",
};

const LEGACY_THREAD_NAMES: Record<string, string> = {
  Aceitação: "Acceptance",
  Raiva: "Anger",
  Família: "Family",
  Amizade: "Friendship",
  Ódio: "Hate",
  Honra: "Honor",
  Alegria: "Joy",
  Amor: "Love",
  Memória: "Memory",
  Vingança: "Revenge",
};

const anchorAliases = (kind: "needle" | "thread") =>
  kind === "needle" ? LEGACY_NEEDLE_NAMES : LEGACY_THREAD_NAMES;

export function canonicalChangelingAnchorName(
  kind: "needle" | "thread",
  name: unknown,
) {
  const value = String(name ?? "");
  const definitions =
    kind === "needle" ? CTL_NEEDLE_DEFINITIONS : CTL_THREAD_DEFINITIONS;

  return (
    definitions.find(
      (item) => item.name === value || item.translatedName === value,
    )?.name ??
    anchorAliases(kind)[value] ??
    value
  );
}
export function changelingAnchorRecovery(kind:"needle"|"thread",name:unknown,locale:"pt-BR"|"en-US"="en-US") {
  const item=(kind==="needle"?CTL_NEEDLE_DEFINITIONS:CTL_THREAD_DEFINITIONS).find((entry)=>entry.name===canonicalChangelingAnchorName(kind,name));
  if(!item)return "";
  const single=locale==="pt-BR"?item.singleWillpowerPt:item.singleWillpower;
  const all=locale==="pt-BR"?item.allWillpowerPt:item.allWillpower;
  return translate(locale, "ui.recoverWillpowerSummary", { single, all });
}
export function changelingAnchorDisplayName(
  kind: "needle" | "thread",
  name: unknown,
  locale: "pt-BR" | "en-US" = "en-US",
) {
  const canonical = canonicalChangelingAnchorName(kind, name);
  const definitions =
    kind === "needle" ? CTL_NEEDLE_DEFINITIONS : CTL_THREAD_DEFINITIONS;

  const item = definitions.find((entry) => entry.name === canonical);

  if (locale === "en-US") {
    return item?.name ?? String(name ?? "");
  }

  return (
    item?.translatedName ??
    Object.entries(anchorAliases(kind)).find(
      ([, canonicalName]) => canonicalName === item?.name,
    )?.[0] ??
    item?.name ??
    String(name ?? "")
  );
}
export const REGALIA = ["Crown", "Jewels", "Mirror", "Shield", "Steed", "Sword", "Chalice", "Coin", "Scepter", "Stars", "Thorn"];
export function changelingFrailtySlots(wyrd: number) {
  return 1 + Math.floor(Math.max(1, Math.min(10, Math.trunc(wyrd))) / 2);
}

export function normalizeChangelingFrailties(value: unknown, wyrd: number) {
  const slots = changelingFrailtySlots(wyrd);
  const current = Array.isArray(value) ? value.map((item) => String(item ?? "")) : [];
  const custom = current.filter((item) => item.trim() && !["ferro frio", "cold iron"].includes(item.toLocaleLowerCase("pt-BR")));
  return ["Cold Iron", ...custom.slice(0, slots - 1)]
    .concat(Array(Math.max(0, slots - 1 - custom.length)).fill(""))
    .slice(0, slots);
}

export function wyrdSummary(
  wyrd: number,
  locale: "pt-BR" | "en-US" = "en-US"
) {
  const rating = Math.max(1, Math.min(10, Math.trunc(wyrd)));

  const penaltyReduction = Math.ceil(rating / 3);

  const fruitLimits = [
    [10, "Unlimited"],
    [9, 101],
    [7, 29],
    [4, 13],
    [2, 7],
  ] as const;

  const fruits =
    fruitLimits.find(([level]) => rating >= level)?.[1] ?? 3;

  if (locale === "en-US") {
    const fruitText =
      typeof fruits === "number" ? fruits : "Unlimited";

  return `Illness/Fatigue: −${penaltyReduction} penalty reduction, +${penaltyReduction} resistance • Goblin Fruits: ${fruitText}`;
  }

  const fruitText =
    typeof fruits === "number" ? fruits : "Ilimitadas";

  return `Doenças/Fadiga: Redução de −${penaltyReduction} na penalidade, +${penaltyReduction} de resistência • Frutas Goblin: ${fruitText}`;
}
