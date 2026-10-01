"use client";

import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import type { WerewolfReferenceCatalog } from "./catalogs/reference";
import { formTraits } from "./creation-rules";
import "./forms.css";

/** The five columns remain a comparison, including on mobile and in print. */
export function FormsTable({ character, reference, baseSize = 5 }: {
  character: Pick<CharacterSheet, "attributes" | "skills">; reference: WerewolfReferenceCatalog; baseSize?: number;
}) {
  const { locale, t } = useLanguage();
  const forms = reference.forms.map(form => ({ form, traits: formTraits(character, form, baseSize) }));
  const rows: Array<{ label: string; values: Array<number | string> }> = [
    ...["Strength", "Dexterity", "Stamina", "Manipulation"].map(name => ({
      label: systemTerm(name, locale), values: forms.map(({ traits }) => traits.attributes[name]),
    })),
    { label: t("ui.size"), values: forms.map(({ traits }) => traits.size) },
    { label: t("ui.health"), values: forms.map(({ traits }) => traits.health) },
    { label: t("ui.defense"), values: forms.map(({ traits }) => traits.defense) },
    { label: t("ui.initiative"), values: forms.map(({ traits }) => traits.initiative) },
    { label: t("ui.speed"), values: forms.map(({ traits }) => traits.speed) },
    { label: t("ui.armor"), values: forms.map(({ traits }) => `${traits.armorGeneral}/${traits.armorBallistic}`) },
    { label: t("werewolf.perception"), values: forms.map(({ traits }) => `+${traits.perception}`) },
    { label: t("werewolf.firearmsDefense"), values: forms.map(({ traits }) => traits.firearmsDefense ? t("ui.yes") : t("ui.no")) },
  ];
  return <section className="wtf-forms">
    <h3>{t("werewolf.forms")}</h3>
    <div className="wtf-forms-scroll" tabIndex={0} role="region" aria-label={t("werewolf.forms")}>
      <table><caption className="sr-only">{t("werewolf.forms")}</caption>
        <thead><tr><th scope="col"/>{forms.map(({ form }) => <th scope="col" key={form.id}>{form.name}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value, index) => <td key={forms[index].form.id}>{value}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {forms.map(({ form }) => <details className="wtf-form-rules" key={form.id}><summary>{form.name}</summary>
      <p>{locale === "pt-BR" ? reference.presentation[form.id]?.description ?? form.description : form.description}</p>
      <small>{t("conditions.sourcePage", { source: form.source, page: form.additionalPages?.length ? `${form.page}–${form.additionalPages.at(-1)}` : form.page })}</small>
    </details>)}
  </section>;
}
