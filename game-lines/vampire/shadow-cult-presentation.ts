import type { MeritSelection, Specialty } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { Locale } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { isShadowCultId, shadowCultGrantId, SHADOW_CULT_SOURCE } from "./builder-merit-grants";
import catalog from "./catalog-data/shadow-cults.json";

type Cult = { name: string; configuration: MeritConfiguration; presentationPt: MeritConfiguration; presentationEn?: MeritConfiguration; notes?: Record<string, string>; notesPt?: Record<string, string> };
const cults = catalog as Record<keyof typeof catalog, Cult>;

function preset(merit: MeritSelection, cultId: string, merits: readonly MeritDefinition[]) {
  return isShadowCultId(cultId) && shadowCultGrantId(merit) === cultId && merit.grantedBy === SHADOW_CULT_SOURCE &&
    resolveMeritDefinition(merit, merits)?.id === "core-2ed:mystery-cult-initiation" ? cults[cultId] : undefined;
}

/** Render-only defaults. Explicitly changed fields and unavailable identities retain their authored text. */
export function vampireShadowCultPresentation(merit: MeritSelection, cultId: string, locale: Locale, merits: readonly MeritDefinition[]): MeritSelection {
  const cult = preset(merit, cultId, merits);
  if (!cult) return merit;
  const defaults: MeritConfiguration = { cult: cult.name, ...cult.configuration };
  const configuration: MeritConfiguration = { ...defaults, ...normalizeMeritConfiguration(merit.configuration) };
  const presentation = locale === "pt-BR" ? cult.presentationPt : cult.presentationEn ?? {};
  const translated = Object.fromEntries(Object.entries(presentation).filter(([key]) => {
    if (configuration[key] !== defaults[key]) return false;
    const prefix = key.match(/^level_\d+/)?.[0];
    return !prefix || configuration[`${prefix}_type`] === defaults[`${prefix}_type`] &&
      configuration[`${prefix}_specialty_skill`] === defaults[`${prefix}_specialty_skill`];
  }));
  return { ...merit, configuration: { ...configuration, ...translated } };
}

/** Only explicit edits cross the save boundary; unchanged render-only defaults are restored or omitted. */
export function vampireShadowCultConfigurationChange(canonical: unknown, presented: unknown, changed: MeritConfiguration) {
  const original = normalizeMeritConfiguration(canonical), shown = normalizeMeritConfiguration(presented);
  const next = { ...changed };
  for (const key of Object.keys(shown)) if (JSON.stringify(next[key]) === JSON.stringify(shown[key])) {
    if (Object.hasOwn(original, key)) next[key] = original[key];
    else delete next[key];
  }
  return next;
}

export function vampireShadowCultNotes(merit: MeritSelection, cultId: string, locale: Locale, merits: readonly MeritDefinition[]) {
  const cult = preset(merit, cultId, merits);
  const notes = locale === "pt-BR" ? cult?.notesPt : cult?.notes;
  return Object.entries(notes ?? {}).filter(([level]) => Number(level) <= merit.dots).map(([level, text]) => ({ level: Number(level), text }));
}

export function vampireShadowCultSpecialty(specialty: Specialty, owned: readonly MeritSelection[], cultId: string, locale: Locale, merits: readonly MeritDefinition[]): Specialty {
  const producers = owned.filter(merit => merit.instanceId && preset(merit, cultId, merits) &&
    specialty.grantedBy === `Merit:core-2ed:mystery-cult-initiation:${merit.instanceId}`);
  if (producers.length !== 1) return specialty;
  const merit = producers[0], canonical = normalizeMeritConfiguration(merit.configuration);
  const shown = normalizeMeritConfiguration(vampireShadowCultPresentation(merit, cultId, locale, merits).configuration);
  for (let level = 1; level <= Math.min(5, merit.dots); level++) {
    const prefix = `level_${level}`;
    if (canonical[`${prefix}_type`] === "specialty" && specialty.skill === canonical[`${prefix}_specialty_skill`] && specialty.name === canonical[`${prefix}_specialty_name`])
      return { ...specialty, name: String(shown[`${prefix}_specialty_name`]) };
  }
  return specialty;
}
