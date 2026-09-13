"use client";

import { AnimalCard } from "@/app/workspace/companion-page";
import { RuleSelect } from "@/app/workspace/rule-select";
import { SheetHeading, stringList } from "@/app/workspace/sheet-primitives";
import { Input } from "@/components/ui/input";
import { ANIMALS, animalPresentation } from "@/lib/companions";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";

const FAMILIAR_NUMINA = ["Awe", "Blast", "Dement", "Drain", "Emotional Aura", "Entropic Decay", "Firestarter", "Hallucination", "Implant Mission", "Left-Handed Spanner", "Mortal Mask", "Pathfinder", "Regenerate", "Seek", "Speed", "Sign", "Stalwart", "Telekinesis"];

export function CompanionPage({ character, updateSheet }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void }) {
  const familiars = character.merits.map((merit, index) => ({ merit, index })).filter(({ merit }) => !merit.grantedBy && merit.name === "Familiar");
  return <section className="mage-companions">
    {!!familiars.length && <><SheetHeading>Familiars</SheetHeading>{familiars.map(({ merit, index }) => <FamiliarCompanionCard key={`Familiar-${index}`} merit={merit} meritIndex={index} character={character} updateSheet={updateSheet}/>)}</>}
  </section>;
}

function FamiliarCompanionCard({ merit, meritIndex, character, updateSheet }: {
  merit: CharacterSheet["merits"][number];
  meritIndex: number;
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, tr } = useLanguage();
  const configuration = normalizeMeritConfiguration(merit.configuration);
  const name = String(configuration.name ?? "Familiar");
  const save = (patch: Record<string, string | string[]>) => {
    const next = structuredClone(character);
    const target = next.merits[meritIndex];
    if (target?.name === merit.name) target.configuration = { ...normalizeMeritConfiguration(target.configuration), ...patch };
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
    <header><div><strong>{name}</strong><small>{tr(`Familiar · entidade efêmera de Rank ${rank}`, `Familiar · Rank ${rank} ephemeral entity`)}</small></div></header>
    <div className="companion-form-grid">
      <label>{tr("Nome", "Name")}<Input value={name} onChange={event => save({ name: event.target.value })}/></label>
      <label>{tr("Forma", "Form")}<RuleSelect value={form} onChange={value => save({ form: value })} options={[{ value: "animal", label: tr("Animal", "Animal") }, { value: "object", label: tr("Objeto", "Object") }]}/></label>
      <label>{tr("Tipo de entidade", "Entity type")}<RuleSelect value={entity} onChange={value => save({ entity: value })} options={["Ghost", "Spirit", "Goetia"].map(value => ({ value, label: value }))}/></label>
      {form === "animal" ? <label>{tr("Animal", "Animal")}<RuleSelect value={animalId} onChange={value => save({ animalId: value })} options={ANIMALS.map(item => animalPresentation(item, locale)).map(item => ({ value: item.id, label: item.name }))}/></label> : <label>{tr("Objeto", "Object")}<Input value={String(configuration.object ?? "")} onChange={event => save({ object: event.target.value })} placeholder={tr("Descrição do fetiche", "Fetish description")}/></label>}
      <label>{tr("Poder", "Power")}<Input type="number" min={1} max={rank === 1 ? 5 : 7} value={String(configuration.power ?? rank + 2)} onChange={event => save({ power: event.target.value })}/></label>
      <label>{tr("Refinamento", "Finesse")}<Input type="number" min={1} max={rank === 1 ? 5 : 7} value={String(configuration.finesse ?? rank + 2)} onChange={event => save({ finesse: event.target.value })}/></label>
      <label>{tr("Resistência", "Resistance")}<Input type="number" min={1} max={rank === 1 ? 5 : 7} value={String(configuration.resistance ?? rank + 2)} onChange={event => save({ resistance: event.target.value })}/></label>
      <label>{tr("Influência", "Influence")}<Input value={String(configuration.influence ?? "")} onChange={event => save({ influence: event.target.value })} placeholder={tr(`Nome · ${rank} ponto(s)`, `Name · ${rank} dot${rank === 1 ? "" : "s"}`)}/></label>
      <label>{tr("Interdição", "Ban")}<Input value={String(configuration.ban ?? "")} onChange={event => save({ ban: event.target.value })}/></label>
      <label>{tr("Perdição", "Bane")}<Input value={String(configuration.bane ?? "")} onChange={event => save({ bane: event.target.value })}/></label>
    </div>
    {form === "animal" && presentedAnimal && <AnimalCard animal={presentedAnimal} name={name} onRemove={() => save({ form: "object", animalId: "" })}/>} 
    <strong>Numina ({numina.length}/{numinaLimit})</strong>
    <div className="companion-options numina-options">{alphabetical(FAMILIAR_NUMINA, item => item).filter(item => numina.length < numinaLimit || numina.includes(item)).map(item => {
      const active = numina.includes(item);
      return <label key={item} className={active ? "selected" : ""}><input type="checkbox" checked={active} disabled={!active && numina.length >= numinaLimit} onChange={() => save({ numina: active ? numina.filter(value => value !== item) : [...numina, item] })}/><span><strong>{item}</strong></span></label>;
    })}</div>
    <p className="combat-note">{tr(`Rank ${rank}: máximo de Atributo ${rank === 1 ? 5 : 7}, Influência ${rank} e até ${numinaLimit} Numina. Complete Interdição e Perdição conforme a natureza da entidade.`, `Rank ${rank}: maximum Attribute ${rank === 1 ? 5 : 7}, Influence ${rank}, and up to ${numinaLimit} Numina. Complete Ban and Bane according to the entity's nature.`)}</p>
  </article>;
}
