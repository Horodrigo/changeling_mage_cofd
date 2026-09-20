"use client";

import { useState } from "react";
import { AnimalCard } from "@/app/workspace/companion-page";
import { RuleSelect } from "@/app/workspace/rule-select";
import { HealthTrack, SheetHeading } from "@/app/workspace/sheet-primitives";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ANIMALS, animalPresentation, type Animal } from "@/lib/companions";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { createRandomId } from "@/lib/random-id";
import { normalizeDamage, type DamageLevel } from "@/lib/resource-rules";

type UndeadCompanion = {
  id: string;
  animal_id: string;
  name: string;
  health_damage: DamageLevel[];
  undying: boolean;
};

function objectList(value: unknown) {
  return Array.isArray(value) ? value as Array<Record<string, unknown>> : [];
}

function animalStamina(animal: Animal) {
  const match = animal.attributes.match(/Vigor\s+(\d+)/i);
  return Math.max(1, Number(match?.[1] ?? 1));
}

function raisedAnimalPresentation(animal: Animal, locale: "pt-BR" | "en-US") {
  const presented = animalPresentation(animal, locale);
  return {
    ...presented,
    attributes: locale === "pt-BR"
      ? presented.attributes.replace(/Inteligência\s+\d+/i, "Inteligência 1")
      : presented.attributes.replace(/Intelligence\s+\d+/i, "Intelligence 1"),
  };
}

export function VampireCompanionPage({
  character,
  updateSheet,
  bloodPotency,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  bloodPotency: number;
}) {
  const { locale, t } = useLanguage();
  const pt = locale === "pt-BR";
  const hasUndyingFamiliar = Array.isArray(character.line_data.devotion_ids) && character.line_data.devotion_ids.includes("devotion-undying-familiar");
  const companions = objectList(character.line_data.undead_companions).map((item): UndeadCompanion => ({
    id: String(item.id ?? createRandomId()),
    animal_id: String(item.animal_id ?? ANIMALS[0]?.id ?? ""),
    name: String(item.name ?? ""),
    health_damage: normalizeDamage(item.health_damage, ANIMALS.find((animal) => animal.id === item.animal_id)?.health ?? 1),
    undying: hasUndyingFamiliar && Boolean(item.undying),
  }));
  const [animalId, setAnimalId] = useState(ANIMALS[0]?.id ?? "");

  const persist = (nextCompanions: UndeadCompanion[]) => {
    const next = structuredClone(character);
    next.line_data = { ...next.line_data, undead_companions: nextCompanions };
    updateSheet(next);
  };

  const selectedAnimal = ANIMALS.find((item) => item.id === animalId);
  const raise = () => {
    if (!selectedAnimal) return;
    persist([
      ...companions,
      {
        id: createRandomId(),
        animal_id: selectedAnimal.id,
        name: animalPresentation(selectedAnimal, locale).name,
        health_damage: [],
        undying: false,
      },
    ]);
  };

  return <section className="vampire-undead-companions">
    <SheetHeading>{t("ui.undeadFamiliars")}</SheetHeading>
    <div className="vampire-familiar-create">
      <label>{t("ui.animal")}
        <RuleSelect
          value={animalId}
          onChange={setAnimalId}
          options={ANIMALS.map((item) => {
            const presented = animalPresentation(item, locale);
            return { value: item.id, label: presented.name };
          })}
        />
      </label>
      <Button type="button" onClick={raise} disabled={!selectedAnimal}>
        {t("ui.raiseTheFamiliar")}
      </Button>
    </div>

    <div className="companion-grid">
      {companions.map((saved, index) => {
        const animal = ANIMALS.find((item) => item.id === saved.animal_id);
        if (!animal) return null;
        const lifespan = bloodPotency * animalStamina(animal);
        const presented = raisedAnimalPresentation(animal, locale);
        return <AnimalCard
            key={saved.id}
            animal={presented}
            name={saved.name}
            onRemove={() => persist(companions.filter((_, itemIndex) => itemIndex !== index))}
            onNameChange={(nextName) => persist(companions.map((item, itemIndex) => itemIndex === index ? { ...item, name: nextName } : item))}
          >
            <div className="vampire-familiar-state">
              <p><strong>{pt ? "Duração" : "Lifespan"}:</strong> {lifespan} {saved.undying ? (pt ? "semanas por Vitae" : "weeks per Vitae") : (pt ? "noites por Vitae" : "nights per Vitae")}</p>
              {hasUndyingFamiliar && <label><span>{pt ? "Familiar Imortal" : "Undying Familiar"}</span><Switch size="sm" checked={saved.undying} onCheckedChange={(checked) => persist(companions.map((item, itemIndex) => itemIndex === index ? { ...item, undying: checked } : item))} /></label>}
              {saved.undying && <small>{pt ? "Erguido quando o animal ghoul vivo morre." : "Raised when the living ghouled animal dies."}</small>}
              <strong>{t("ui.health")}</strong>
              <HealthTrack health={animal.health} damage={saved.health_damage} onChange={(health_damage) => persist(companions.map((item, itemIndex) => itemIndex === index ? { ...item, health_damage } : item))} />
            </div>
          </AnimalCard>;
      })}
    </div>
  </section>;
}
