import { ANIMALS, animalPresentation, type Animal } from "@/lib/companions";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { Fragment, type ReactNode } from "react";

export type PrintableCompanion = {
  name: string;
  kind: string;
  animal?: Animal;
  details?: { label: string; value: string }[];
};

export function PrintCompanionSheets({ character, extras = [], renderPage }: { character: CharacterSheet; extras?: PrintableCompanion[]; renderPage: (content: ReactNode, index: number, total: number) => ReactNode }) {
  const { locale, t } = useLanguage();
  const bonded: PrintableCompanion[] = (Array.isArray(character.current_state?.conditions) ? character.current_state.conditions : [])
    .flatMap((value) => {
      if (!value || typeof value !== "object" || (value as Record<string, unknown>).id !== "bonded") return [];
      const saved = value as Record<string, unknown>;
      const animal = ANIMALS.find((item) => item.id === saved.animalId);
      if (!animal) return [];
      const presented = animalPresentation(animal, locale);
      return [{ name: String(saved.animalName ?? "").trim() || presented.name, kind: t("ui.bonded"), animal: presented }];
    });
  const companions = [...bonded, ...extras];
  return companions.map((companion, index) => <Fragment key={`${companion.kind}-${companion.name}-${index}`}>{renderPage(<div className="cod-print-companion-content">
    <header><small>{character.character.name} · {t("ui.companions")}</small><h1>{companion.name}</h1><strong>{companion.kind}</strong></header>
    {companion.animal && <div className="cod-print-companion-fields">
      <div><b>{t("ui.attributes")}</b><span>{companion.animal.attributes}</span></div>
      <div><b>{t("ui.skills")}</b><span>{companion.animal.skills}</span></div>
      <div><b>{t("ui.willpower")}</b><span>{companion.animal.willpower}</span></div>
      <div><b>{t("ui.initiative")}</b><span>{companion.animal.initiative}</span></div>
      <div><b>{t("ui.defense")}</b><span>{companion.animal.defense}</span></div>
      <div><b>{t("ui.speed")}</b><span>{companion.animal.speed}</span></div>
      <div><b>{t("ui.size")}</b><span>{companion.animal.size}</span></div>
      <div><b>{t("ui.health")}</b><span>{companion.animal.health}</span></div>
      <div><b>{t("ui.attacks")}</b><span>{companion.animal.attacks.map((attack) => `${attack.name} ${attack.damage} (${attack.pool} ${t("ui.dice")})${attack.note ? ` — ${attack.note}` : ""}`).join("; ") || t("ui.none")}</span></div>
      {companion.animal.special && <div><b>{t("ui.special")}</b><span>{companion.animal.special}</span></div>}
    </div>}
    {!!companion.details?.length && <div className="cod-print-companion-fields">{companion.details.map(({ label, value }, detailIndex) => <div key={`${label}-${detailIndex}`}><b>{label}</b><span>{value}</span></div>)}</div>}
  </div>, index, companions.length)}</Fragment>);
}
