"use client";

import { AnimalCard } from "@/app/workspace/companion-page";
import { RuleSelect } from "@/app/workspace/rule-select";
import { SheetHeading, stringList } from "@/app/workspace/sheet-primitives";
import { Input } from "@/components/ui/input";
import { ANIMALS, animalPresentation } from "@/lib/companions";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import type { MeritDefinition } from "@/lib/merits";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";

const FAMILIAR_NUMINA = {
  "Awe": "ui.familiarNumina.awe",
  "Blast": "ui.familiarNumina.blast",
  "Dement": "ui.familiarNumina.dement",
  "Drain": "ui.familiarNumina.drain",
  "Emotional Aura": "ui.familiarNumina.emotionalAura",
  "Entropic Decay": "ui.familiarNumina.entropicDecay",
  "Firestarter": "ui.familiarNumina.firestarter",
  "Hallucination": "ui.familiarNumina.hallucination",
  "Implant Mission": "ui.familiarNumina.implantMission",
  "Left-Handed Spanner": "ui.familiarNumina.leftHandedSpanner",
  "Mortal Mask": "ui.familiarNumina.mortalMask",
  "Pathfinder": "ui.familiarNumina.pathfinder",
  "Regenerate": "ui.familiarNumina.regenerate",
  "Seek": "ui.familiarNumina.seek",
  "Speed": "ui.familiarNumina.speed",
  "Sign": "ui.familiarNumina.sign",
  "Stalwart": "ui.familiarNumina.stalwart",
  "Telekinesis": "ui.familiarNumina.telekinesis",
} as const;

export function CompanionPage({ character, updateSheet, catalog }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; catalog: readonly MeritDefinition[] }) {
  const { t } = useLanguage();
  const familiars = character.merits.map((merit, index) => ({ merit, index })).filter(({ merit }) => !merit.grantedBy && resolveMeritDefinition(merit, catalog)?.id === "mta-2ed:familiar");
  return <section className="mage-companions">
    {!!familiars.length && <><SheetHeading>{t("ui.familiars")}</SheetHeading>{familiars.map(({ merit, index }) => <FamiliarCompanionCard key={`Familiar-${index}`} merit={merit} meritIndex={index} character={character} updateSheet={updateSheet} catalog={catalog}/>)}</>}
  </section>;
}

function FamiliarCompanionCard({ merit, meritIndex, character, updateSheet, catalog }: {
  catalog: readonly MeritDefinition[];
  merit: CharacterSheet["merits"][number];
  meritIndex: number;
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, t } = useLanguage();
  const configuration = normalizeMeritConfiguration(merit.configuration);
  const name = String(configuration.name ?? "Familiar");
  const save = (patch: Record<string, string | string[]>) => {
    const next = structuredClone(character);
    const target = next.merits[meritIndex];
    if (target && target.instanceId === merit.instanceId && resolveMeritDefinition(target, catalog)?.id === resolveMeritDefinition(merit, catalog)?.id) target.configuration = { ...normalizeMeritConfiguration(target.configuration), ...patch };
    updateSheet(next);
  };
  const form = String(configuration.form ?? "animal");
  const entity = String(configuration.entity ?? "Spirit");
  const rank = merit.dots >= 4 ? 2 : 1;
  const animalId = String(configuration.animalId ?? ANIMALS[0]?.id ?? "");
  const animal = ANIMALS.find(item => item.id === animalId);
  const presentedAnimal = animal ? animalPresentation(animal, locale) : undefined;
  const numina = stringList(configuration.numina);
  const numinaLimit = rank === 1 ? 3 : 5;
  return <article className="companion-card merit-companion companion-config">
    <header><div><strong>{name}</strong><small>{t("ui.familiarRankEphemeralEntity", { p1: rank })}</small></div></header>
    <div className="companion-form-grid">
      <label>{t("ui.name")}<Input value={name} onChange={event => save({ name: event.target.value })}/></label>
      <label>{t("ui.form")}<RuleSelect value={form} onChange={value => save({ form: value })} options={[{ value: "animal", label: t("ui.animal") }, { value: "object", label: t("ui.object") }]}/></label>
      <label>{t("ui.entityType")}<RuleSelect value={entity} onChange={value => save({ entity: value })} options={[{ value: "Ghost", label: t("ui.meritConfig.ghost") }, { value: "Spirit", label: t("ui.spirit") }, { value: "Goetia", label: t("ui.meritConfig.goetia") }]}/></label>
      {form === "animal" ? <label>{t("ui.animal")}<RuleSelect value={animalId} onChange={value => save({ animalId: value })} options={ANIMALS.map(item => animalPresentation(item, locale)).map(item => ({ value: item.id, label: item.name }))}/></label> : <label>{t("ui.object")}<Input value={String(configuration.object ?? "")} onChange={event => save({ object: event.target.value })} placeholder={t("ui.fetishDescription")}/></label>}
      <label>{t("ui.power")}<Input type="number" min={1} max={rank === 1 ? 5 : 7} value={String(configuration.power ?? rank + 2)} onChange={event => save({ power: event.target.value })}/></label>
      <label>{t("ui.finesse")}<Input type="number" min={1} max={rank === 1 ? 5 : 7} value={String(configuration.finesse ?? rank + 2)} onChange={event => save({ finesse: event.target.value })}/></label>
      <label>{t("ui.resistance")}<Input type="number" min={1} max={rank === 1 ? 5 : 7} value={String(configuration.resistance ?? rank + 2)} onChange={event => save({ resistance: event.target.value })}/></label>
      <label>{t("ui.influence")}<Input value={String(configuration.influence ?? "")} onChange={event => save({ influence: event.target.value })} placeholder={t("ui.rankDots", { rank, plural: rank === 1 ? "" : "s" })}/></label>
      <label>{t("ui.ban")}<Input value={String(configuration.ban ?? "")} onChange={event => save({ ban: event.target.value })}/></label>
      <label>{t("ui.baneda2072")}<Input value={String(configuration.bane ?? "")} onChange={event => save({ bane: event.target.value })}/></label>
    </div>
    {form === "animal" && presentedAnimal && <AnimalCard animal={presentedAnimal} name={name} onRemove={() => save({ form: "object", animalId: "" })}/>} 
    <strong>{t("ui.numina")} ({numina.length}/{numinaLimit})</strong>
    <div className="companion-options numina-options">{alphabetical(Object.entries(FAMILIAR_NUMINA).map(([value, key]) => ({ value, label: t(key) })), item => item.label).filter(item => numina.length < numinaLimit || numina.includes(item.value)).map(item => {
      const active = numina.includes(item.value);
      return <label key={item.value} className={active ? "selected" : ""}><input type="checkbox" checked={active} disabled={!active && numina.length >= numinaLimit} onChange={() => save({ numina: active ? numina.filter(value => value !== item.value) : [...numina, item.value] })}/><span><strong>{item.label}</strong></span></label>;
    })}</div>
    <p className="combat-note">{t("ui.rankMaximumAttributeInfluenceAndUpToNumina", { p1: rank, p2: rank === 1 ? 5 : 7, p3: rank, p4: numinaLimit })}</p>
  </article>;
}
