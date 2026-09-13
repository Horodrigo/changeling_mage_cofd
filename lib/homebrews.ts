import type { ContractDefinition } from "./catalog/contract-catalog";
import type { ExpandedMeritLevel } from "./expanded-merits";
import type { GameLine, MeritDefinition } from "./merits";
import type { SpellDefinition } from "./catalog/spell-catalog";
import { setDeviceValue } from "./device-storage";

export const HOMEBREW_STORAGE_KEY = "arquivo-das-trevas:homebrews:v1";
export const HOMEBREW_EVENT = "arquivo-das-trevas:homebrews-updated";

export type HomebrewContract = ContractDefinition & {
  homebrew: true;
  costs: string[];
  categoryKind: "Regalia" | "Corte" | "Independente";
  hasRoll: boolean;
  courtBenefits?: Record<string, string>;
};

export type HomebrewSpell = SpellDefinition & { homebrew: true };

export type HomebrewMerit = MeritDefinition & {
  homebrew: true;
  repeatable?: boolean;
  hasLevelBenefits?: boolean;
  levels?: ExpandedMeritLevel[];
};

export type HomebrewKith = {
  id: string;
  name: string;
  skill: string;
  description: string;
  blessing: string;
  source: "Criação do jogador";
  page: 0;
  homebrew: true;
};

export type HomebrewCourt = {
  id: string;
  name: string;
  emotion: string;
  mantleBenefits: string[];
  homebrew: true;
};

export type HomebrewOrder = {
  id: string;
  name: string;
  description: string;
  roteSkills: string[];
  homebrew: true;
};

export type HomebrewCatalog = {
  enabled: boolean;
  disabledIds: string[];
  kiths: HomebrewKith[];
  courts: HomebrewCourt[];
  orders: HomebrewOrder[];
  contracts: HomebrewContract[];
  spells: HomebrewSpell[];
  merits: HomebrewMerit[];
};

export const EMPTY_HOMEBREWS: HomebrewCatalog = {
  enabled: true,
  disabledIds: [],
  kiths: [],
  courts: [],
  orders: [],
  contracts: [],
  spells: [],
  merits: [],
};

export function homebrewId(
  kind: "kith" | "court" | "order" | "contract" | "spell" | "merit",
) {
  return `homebrew:${kind}:${crypto.randomUUID()}`;
}

export function readHomebrews(): HomebrewCatalog {
  if (typeof window === "undefined") return EMPTY_HOMEBREWS;
  try {
    const parsed = JSON.parse(
      localStorage.getItem(HOMEBREW_STORAGE_KEY) ?? "{}",
    ) as Partial<HomebrewCatalog>;
    const catalog: HomebrewCatalog = {
      enabled: parsed.enabled !== false,
      disabledIds: Array.isArray(parsed.disabledIds) ? parsed.disabledIds.map(String) : [],
      kiths: Array.isArray(parsed.kiths) ? parsed.kiths : [],
      courts: Array.isArray(parsed.courts) ? parsed.courts : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      contracts: Array.isArray(parsed.contracts) ? parsed.contracts : [],
      spells: Array.isArray(parsed.spells) ? parsed.spells : [],
      merits: Array.isArray(parsed.merits) ? parsed.merits : [],
    };
    const legacyCourts = readLegacyList("arquivo-das-trevas:custom-courts");
    const legacyOrders = readLegacyList("arquivo-das-trevas:custom-orders");
    catalog.courts = mergeByName(
      catalog.courts,
      legacyCourts.map((item) => ({
        id: homebrewId("court"),
        name: String(item.name ?? ""),
        emotion: String(item.emotion ?? ""),
        mantleBenefits: Array.isArray(item.mantleBenefits)
          ? item.mantleBenefits.map(String)
          : [],
        homebrew: true as const,
      })),
    );
    catalog.orders = mergeByName(
      catalog.orders,
      legacyOrders.map((item) => ({
        id: homebrewId("order"),
        name: String(item.name ?? ""),
        description: String(item.description ?? ""),
        roteSkills: Array.isArray(item.roteSkills)
          ? item.roteSkills.map(String)
          : [],
        homebrew: true as const,
      })),
    );
    return catalog;
  } catch {
    return EMPTY_HOMEBREWS;
  }
}

export const BUILTIN_HOMEBREW_SOURCES = [
  { id: "h-courts", name: "Book of Courts" },
  { id: "h-seemings", name: "Book of Seemings" },
] as const;

export function isHomebrewActive(catalog: HomebrewCatalog, id: string) {
  return catalog.enabled && !catalog.disabledIds.includes(id);
}

export function isBuiltinHomebrew(sourceId?: string) {
  return BUILTIN_HOMEBREW_SOURCES.some((source) => source.id === sourceId);
}

function readLegacyList(key: string): Array<Record<string, unknown>> {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function mergeByName<T extends { name: string }>(current: T[], incoming: T[]) {
  const merged = new Map(
    current.filter((item) => item.name).map((item) => [item.name.toLocaleLowerCase(), item]),
  );
  incoming
    .filter((item) => item.name)
    .forEach((item) => {
      const key = item.name.toLocaleLowerCase();
      if (!merged.has(key)) merged.set(key, item);
    });
  return [...merged.values()];
}

export function migrateCharacterHomebrews(
  catalog: HomebrewCatalog,
  characters: Array<{ game_line: string; line_data: Record<string, unknown> }>,
) {
  const kiths: HomebrewKith[] = [];
  const courts: HomebrewCourt[] = [];
  const orders: HomebrewOrder[] = [];
  for (const character of characters) {
    const data = character.line_data ?? {};
    if (character.game_line === "CtL" && data.kith_custom && data.kith) {
      kiths.push({
        id: homebrewId("kith"),
        name: String(data.kith),
        skill: String(data.kith_skill ?? ""),
        description: String(data.kith_description ?? ""),
        blessing: String(data.kith_blessing ?? data.kith_description ?? ""),
        source: "Criação do jogador",
        page: 0,
        homebrew: true,
      });
    }
    const court = data.custom_court as Partial<HomebrewCourt> | undefined;
    if (character.game_line === "CtL" && court?.name)
      courts.push({
        id: homebrewId("court"),
        name: String(court.name),
        emotion: String(court.emotion ?? ""),
        mantleBenefits: Array.isArray(court.mantleBenefits)
          ? court.mantleBenefits.map(String)
          : [],
        homebrew: true,
      });
    const order = data.custom_order as Partial<HomebrewOrder> | undefined;
    // Nameless Order is a single per-character definition, not a reusable Homebrew Order.
    if (character.game_line === "MtA" && data.order !== "Nameless" && order?.name)
      orders.push({
        id: homebrewId("order"),
        name: String(order.name),
        description: String(order.description ?? ""),
        roteSkills: Array.isArray(order.roteSkills)
          ? order.roteSkills.map(String)
          : [],
        homebrew: true,
      });
  }
  return {
    ...catalog,
    kiths: mergeByName(catalog.kiths, kiths),
    courts: mergeByName(catalog.courts, courts),
    orders: mergeByName(catalog.orders, orders),
  };
}

export function saveHomebrews(catalog: HomebrewCatalog) {
  void setDeviceValue(HOMEBREW_STORAGE_KEY, catalog);
  localStorage.setItem(HOMEBREW_STORAGE_KEY, JSON.stringify(catalog));
  localStorage.setItem(
    "arquivo-das-trevas:custom-courts",
    JSON.stringify(
      catalog.courts.map(({ name, emotion, mantleBenefits }) => ({
        name,
        emotion,
        mantleBenefits,
      })),
    ),
  );
  localStorage.setItem(
    "arquivo-das-trevas:custom-orders",
    JSON.stringify(
      catalog.orders.map(({ name, description, roteSkills }) => ({
        name,
        description,
        roteSkills,
      })),
    ),
  );
  window.dispatchEvent(new CustomEvent(HOMEBREW_EVENT));
}

export function meritsForLine(
  catalog: HomebrewCatalog,
  line: GameLine,
): HomebrewMerit[] {
  return catalog.merits.filter(
    (merit) => merit.line === "Core" || merit.line === line,
  );
}

export function parseNamedText(value: string) {
  return Object.fromEntries(
    value
      .split("\n")
      .map((row) => row.trim())
      .filter(Boolean)
      .map((row) => {
        const separator = row.indexOf(":");
        return separator < 0
          ? [row, ""]
          : [row.slice(0, separator).trim(), row.slice(separator + 1).trim()];
      }),
  );
}

export function formatNamedText(value?: Record<string, string>) {
  return Object.entries(value ?? {})
    .map(([name, description]) => `${name}: ${description}`)
    .join("\n");
}
