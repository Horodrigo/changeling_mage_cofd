import type { MessageKey, Translator } from "@/lib/i18n";
import { freezeCatalogData } from "@/lib/catalog/catalog-service";
import pathCatalog from "./catalog-data/paths.json";
import { MAGE_ORDERS } from "./orders";

type MagePathDefinition={id:string;name:string;ruling:string[];inferior:string};
export const MTA_PATHS=freezeCatalogData(Object.fromEntries((pathCatalog as MagePathDefinition[]).map(({name,ruling,inferior})=>[name,{ruling,inferior}]))) as Record<string,{ruling:string[];inferior:string}>;

export const MTA_ORDERS=Object.fromEntries(MAGE_ORDERS.map((order)=>[order.name,order.roteSkills])) as Record<string,string[]>;
export const MTA_ORDER_LABELS=Object.fromEntries(MAGE_ORDERS.map((order)=>[order.name,order.translatedName??order.name])) as Record<string,string>;

export const mageOrderLabel = (order: string, locale: "pt-BR" | "en-US") =>
  locale === "pt-BR" ? MTA_ORDER_LABELS[order] ?? order : order;

const GNOSIS_CASTING = [
  [0, 1, 1], [0, 1, 1],
  [1, 2, 2], [1, 2, 2],
  [2, 2, 3], [2, 3, 3],
  [3, 3, 4], [3, 3, 4],
  [4, 4, 5], [4, 4, 5],
] as const;

const GNOSIS_RITUAL_KEYS = [
  "ui.gnosisRitual3Hours",
  "ui.gnosisRitual1Hour",
  "ui.gnosisRitual30Minutes",
  "ui.gnosisRitual10Minutes",
  "ui.gnosisRitual1Minute20Turns",
] as const satisfies readonly MessageKey[];

export function mageGnosisSummary(gnosis: number, t: Translator) {
  const [ritualIndex, combined, paradox] = GNOSIS_CASTING[Math.max(1, Math.min(10, Math.trunc(gnosis))) - 1];
  return t(paradox === 1 ? "ui.gnosisCastingSummaryOneDie" : "ui.gnosisCastingSummaryDice", {
    ritual: t(GNOSIS_RITUAL_KEYS[ritualIndex]), combined, paradox,
  });
}

export const MTA_ORDER_DESCRIPTIONS=Object.fromEntries(MAGE_ORDERS.map((order)=>[order.name,[order.descriptionPt??order.description,order.description]])) as Record<string,[string,string]>;

export const ARCANA = ["Death", "Fate", "Forces", "Life", "Matter", "Mind", "Prime", "Space", "Spirit", "Time"];
