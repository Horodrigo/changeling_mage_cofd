"use client";

import { useState } from "react";
import { AnimalCard } from "@/app/workspace/companion-page";
import { RuleSelect } from "@/app/workspace/rule-select";
import { SheetHeading } from "@/app/workspace/sheet-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ANIMALS, animalPresentation, type Animal } from "@/lib/companions";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { createRandomId } from "@/lib/random-id";

type UndeadCompanion = {
  id: string;
  animal_id: string;
  name: string;
  remaining_nights: number;
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
  const companions = objectList(character.line_data.undead_companions).map((item): UndeadCompanion => ({
    id: String(item.id ?? createRandomId()),
    animal_id: String(item.animal_id ?? ANIMALS[0]?.id ?? ""),
    name: String(item.name ?? ""),
    remaining_nights: Math.max(0, Math.trunc(Number(item.remaining_nights ?? 0))),
  }));
  const [animalId, setAnimalId] = useState(ANIMALS[0]?.id ?? "");
  const [name, setName] = useState("");
  const vitae = Math.max(0, Math.trunc(Number(character.current_state.vitae_current ?? 0)));

  const persist = (nextCompanions: UndeadCompanion[], vitaeCurrent = vitae) => {
    const next = structuredClone(character);
    next.line_data = { ...next.line_data, undead_companions: nextCompanions };
    next.current_state = { ...next.current_state, vitae_current: vitaeCurrent };
    updateSheet(next);
  };

  const selectedAnimal = ANIMALS.find((item) => item.id === animalId);
  const raise = () => {
    if (!selectedAnimal || vitae < 1) return;
    const duration = bloodPotency * animalStamina(selectedAnimal);
    persist([
      ...companions,
      {
        id: createRandomId(),
        animal_id: selectedAnimal.id,
        name: name.trim() || animalPresentation(selectedAnimal, locale).name,
        remaining_nights: duration,
      },
    ], vitae - 1);
    setName("");
  };

  return <section className="vampire-undead-companions">
    <SheetHeading>{t("ui.undeadFamiliars")}</SheetHeading>
    <div className="vampire-familiar-rules">
      <p><strong>{t("ui.raiseTheFamiliar")}:</strong> {pt ? "1 Vitae; ação instantânea; sem rolagem." : "1 Vitae; instant action; no roll."}</p>
      <p>{pt ? "O familiar permanece ativo por Blood Potency × Stamina do animal noites. Alimentá-lo com mais 1 Vitae reinicia essa duração." : "The familiar remains active for Blood Potency × the animal's Stamina nights. Feeding it another Vitae resets that duration."}</p>
      <p>{pt ? "Ele possui Intelligence 1, recebe dano de ataques como um vampiro (contusão em vez do dano mortal normal), não cai inconsciente, não sangra até morrer e não se decompõe." : "It has Intelligence 1, takes attack damage like a vampire (bashing instead of ordinary mortal injury), does not fall unconscious, does not bleed out, and does not decompose."}</p>
      <p>{pt ? "Feral Whispers pode ser usado no familiar silenciosamente, a qualquer distância. Ainda é feita a rolagem para interpretar a ordem, mas o familiar não resiste." : "Feral Whispers can be used on the familiar silently at any distance. The interpretation roll still occurs, but the familiar does not resist."}</p>
    </div>

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
      <label>{t("ui.name")}
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={selectedAnimal ? animalPresentation(selectedAnimal, locale).name : ""} />
      </label>
      <Button type="button" onClick={raise} disabled={!selectedAnimal || vitae < 1}>
        {pt ? "Erguer familiar (1 Vitae)" : "Raise familiar (1 Vitae)"}
      </Button>
      <small>{pt ? `Vitae atual: ${vitae}` : `Current Vitae: ${vitae}`}</small>
    </div>

    <div className="companion-grid">
      {companions.map((saved, index) => {
        const animal = ANIMALS.find((item) => item.id === saved.animal_id);
        if (!animal) return null;
        const maximum = bloodPotency * animalStamina(animal);
        const presented = raisedAnimalPresentation(animal, locale);
        return <article className="vampire-undead-familiar" key={saved.id}>
          <AnimalCard
            animal={presented}
            name={saved.name}
            onRemove={() => persist(companions.filter((_, itemIndex) => itemIndex !== index))}
            onNameChange={(nextName) => persist(companions.map((item, itemIndex) => itemIndex === index ? { ...item, name: nextName } : item))}
          />
          <div className="vampire-familiar-state">
            <label>{pt ? "Noites restantes" : "Nights remaining"}
              <Input
                type="number"
                min={0}
                max={maximum}
                value={saved.remaining_nights}
                onChange={(event) => {
                  const remaining = Math.max(0, Math.min(maximum, Math.trunc(Number(event.target.value) || 0)));
                  persist(companions.map((item, itemIndex) => itemIndex === index ? { ...item, remaining_nights: remaining } : item));
                }}
              />
            </label>
            <span>{pt ? `Duração máxima atual: ${maximum} noites` : `Current maximum duration: ${maximum} nights`}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={vitae < 1}
              onClick={() => persist(
                companions.map((item, itemIndex) => itemIndex === index ? { ...item, remaining_nights: maximum } : item),
                vitae - 1,
              )}
            >
              {pt ? "Renovar (1 Vitae)" : "Renew (1 Vitae)"}
            </Button>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
