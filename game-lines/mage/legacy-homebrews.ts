import { getDeviceValue, setDeviceValue, stageDeviceValue } from "@/lib/device-storage";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { createRandomId } from "@/lib/random-id";
import { ARCANA } from "./creation-rules";
import type { LegacyAttainment, LegacyDefinition } from "./legacies";

export const LEGACY_HOMEBREW_SOURCE_ID = "homebrew:mage-legacies";
export const LEGACY_HOMEBREW_SOURCE = "Player-created Legacies";
export const LEGACY_HOMEBREW_KEY = "arquivo-das-trevas:mage-legacies:v1";
export const LEGACY_ATTAINMENT_MINIMUMS = [
  { rank: 1, orthodoxGnosis: 2, novelGnosis: 3 },
  { rank: 2, orthodoxGnosis: 2, novelGnosis: 3 },
  { rank: 3, orthodoxGnosis: 4, novelGnosis: 5 },
  { rank: 4, orthodoxGnosis: 6, novelGnosis: 7 },
  { rank: 5, orthodoxGnosis: 8, novelGnosis: 9 },
] as const;

const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => String(value ?? "").trim();
const textList = (value: unknown) => (Array.isArray(value) ? value : []).map(text).filter(Boolean);

export function normalizeLegacyHomebrew(value: unknown): LegacyDefinition | null {
  const item = record(value), id = text(item.id), name = text(item.name), rulingArcanum = text(item.rulingArcanum);
  const parentage = record(item.parentage), paths = textList(parentage.paths), orders = textList(parentage.orders);
  const initiation = text(item.initiation), organization = text(item.organization), theory = text(item.theory), yantras = textList(item.yantras), oblations = textList(item.oblations);
  const rawAttainments = Array.isArray(item.attainments) ? item.attainments : [];
  const attainments = LEGACY_ATTAINMENT_MINIMUMS.map(({ rank, orthodoxGnosis, novelGnosis }) => {
    const raw = record(rawAttainments.find((candidate) => Number(record(candidate).rank) === rank)), attainmentName = text(raw.name), description = text(raw.description);
    if (!attainmentName || !description) return null;
    return {
      rank, name: attainmentName, description, rulingArcanum: rank, orthodoxGnosis, novelGnosis,
      prerequisites: rank === 1 ? "Initiation" : `${rulingArcanum} ${rank}; Gnosis ${orthodoxGnosis}/${novelGnosis}`,
      optional: text(raw.optional) || undefined, praxisName: text(raw.praxisName) || undefined,
    } satisfies LegacyAttainment;
  });
  if (!id.startsWith("homebrew:legacy:") || !name || !ARCANA.includes(rulingArcanum) || paths.length !== 1 || !initiation || !organization || !theory || !yantras.length || !oblations.length || attainments.some((entry) => !entry)) return null;
  const additionalPrerequisites = text(item.additionalPrerequisites);
  return {
    id, name, sourceId: LEGACY_HOMEBREW_SOURCE_ID, source: LEGACY_HOMEBREW_SOURCE, page: 0, homebrew: true,
    founderCharacterId: text(item.founderCharacterId), parentage: { paths, orders }, rulingArcanum,
    additionalPrerequisites: additionalPrerequisites || undefined,
    prerequisites: [`Gnosis 2`, `${rulingArcanum} 2`, additionalPrerequisites].filter(Boolean).join("; "),
    initiation, organization, theory, yantras, oblations,
    attainments: attainments as LegacyAttainment[], entryPraxis: attainments[0]?.praxisName,
  };
}

export function normalizeLegacyHomebrews(value: unknown) {
  return (Array.isArray(value) ? value : []).map(normalizeLegacyHomebrew).filter((item): item is LegacyDefinition => Boolean(item));
}

export const mergeLegacyHomebrews = (catalog: readonly LegacyDefinition[], custom: readonly LegacyDefinition[]) => [
  ...catalog,
  ...custom.filter((item) => !catalog.some((official) => official.id === item.id)),
];

export function readLegacyHomebrews() {
  if (typeof localStorage === "undefined") return [];
  try { return normalizeLegacyHomebrews(JSON.parse(localStorage.getItem(LEGACY_HOMEBREW_KEY) ?? "[]")); }
  catch { return []; }
}

export async function hydrateLegacyHomebrews() {
  const stored = await getDeviceValue<unknown>(LEGACY_HOMEBREW_KEY);
  const items = stored === null ? readLegacyHomebrews() : normalizeLegacyHomebrews(stored);
  localStorage.setItem(LEGACY_HOMEBREW_KEY, JSON.stringify(items));
  return items;
}

export function saveLegacyHomebrews(value: readonly LegacyDefinition[]) {
  const items = normalizeLegacyHomebrews(value);
  stageDeviceValue(LEGACY_HOMEBREW_KEY, items);
  void setDeviceValue(LEGACY_HOMEBREW_KEY, items);
  window.dispatchEvent(new Event(HOMEBREW_EVENT));
  return items;
}

export const legacyHomebrewId = () => `homebrew:legacy:${createRandomId()}`;
