"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ANIMALS, animalPresentation, type Animal } from "@/lib/companions";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { CompactValues, SheetHeading } from "./sheet-primitives";

const objectList = (value: unknown) => Array.isArray(value) ? value as Array<Record<string, unknown>> : [];

/** Core companion block: Bonded is a general, repeatable Condition. */
export function CompanionPage({ character, updateSheet }: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, t } = useLanguage();
  const animals = ANIMALS.map(item => animalPresentation(item, locale));
  const bonded = objectList(character.current_state?.conditions).filter(item => String(item.id) === "bonded" && String(item.animalId ?? ""));
  return <section className="core-companions">
    <SheetHeading>Bonded</SheetHeading>
    <div className="companion-grid">{bonded.map((saved, index) => {
      const animal = animals.find(item => item.id === String(saved.animalId));
      if (!animal) return null;
      return <AnimalCard
        key={String(saved.instanceId ?? `${saved.animalId}-${index}`)}
        animal={animal}
        name={String(saved.animalName ?? "")}
        onRemove={() => {}}
        removable={false}
        onNameChange={animalName => {
          const next = structuredClone(character);
          const conditions = objectList(next.current_state?.conditions);
          const savedIndex = objectList(character.current_state?.conditions).indexOf(saved);
          next.current_state = { ...next.current_state, conditions: conditions.map((item, itemIndex) => itemIndex === savedIndex ? { ...item, animalName } : item) };
          updateSheet(next);
        }}
      />;
    })}</div>
    <small className="combat-source">{t("ui.animalsWorldOfDarknessAnimalStatBlocks")}</small>
  </section>;
}

export function AnimalCard({ animal, name, onRemove, removable = true, onNameChange }: {
  animal: Animal;
  name?: string;
  onRemove: () => void;
  removable?: boolean;
  onNameChange?: (value: string) => void;
}) {
  const { t } = useLanguage();
  return <article className="companion-card">
    <header><div><strong>{name || animal.name}</strong><small>{name ? animal.name : t("ui.animalCompanion")}</small></div>{removable && <Button type="button" size="icon" variant="ghost" onClick={onRemove} aria-label={t("ui.remove", { p1: name || animal.name }})}><X /></Button>}</header>
    {onNameChange && <label className="companion-field">{t("ui.name")}<Input value={name ?? ""} onChange={event => onNameChange(event.target.value)} placeholder={animal.name}/></label>}
    <p><b>{t("ui.attributes")}:</b> {animal.attributes}</p>
    <p><b>{t("ui.skills")}:</b> {animal.skills}</p>
    <CompactValues values={{ "Força de Vontade": animal.willpower, Iniciativa: animal.initiative, Defesa: animal.defense, Tamanho: animal.size, Vitalidade: animal.health }}/>
    <p><b>{t("ui.speed")}:</b> {animal.speed}</p>
    <p><b>{t("ui.attacks")}:</b> {animal.attacks.length ? animal.attacks.map(item => `${item.name} ${item.damage} (${item.pool} ${t("ui.dice")})${item.note ? ` — ${item.note}` : ""}`).join("; ") : t("ui.none")}</p>
    {animal.special && <p><b>{t("ui.special")}:</b> {animal.special}</p>}
  </article>;
}
