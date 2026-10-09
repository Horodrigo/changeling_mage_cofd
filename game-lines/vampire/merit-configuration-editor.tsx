"use client";

import type { ComponentProps } from "react";
import { CultMeritEditor, MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { useLanguage } from "@/lib/i18n";
import { BLOODCRAFTING_ID, BLOODCRAFTING_ENHANCEMENTS, bloodcraftingChoices, bloodcraftingSpent } from "./bloodcrafting";
import { vampireShadowCultConfigurationChange, vampireShadowCultNotes, vampireShadowCultPresentation } from "./shadow-cult-presentation";

export function VampireMeritConfigurationEditor({ shadowCultId = "", ...props }: ComponentProps<typeof MeritConfigurationEditor> & { shadowCultId?: string }) {
  const { locale, t } = useLanguage();
  return <MeritConfigurationEditor {...props} renderStructured={({ merit, configuration, onChange, compact }) => {
    const shown = vampireShadowCultPresentation(merit, shadowCultId, locale, props.catalog);
    if (shown !== merit) return <>
      <CultMeritEditor merit={merit} compact={compact} catalog={props.catalog} configuration={shown.configuration!} onChange={changed => onChange(vampireShadowCultConfigurationChange(configuration, shown.configuration, changed))} />
      {vampireShadowCultNotes(merit, shadowCultId, locale, props.catalog).map(note => <p className="rule-callout" key={note.level}>{t("ui.dot")} {note.level}: {note.text}</p>)}
    </>;
    if (merit.definitionId !== BLOODCRAFTING_ID) return null;
    const choices = [...new Set((props.specialtyContext?.specializations ?? []).filter(item => item.skill === "Crafts" && item.name.trim()).map(item => item.name))];
    const subject = String(configuration.subject ?? ""), selected = bloodcraftingChoices(configuration);
    const available = Math.max(0, merit.dots - 2), spent = bloodcraftingSpent(configuration);
    const unknown = selected.filter(id => !BLOODCRAFTING_ENHANCEMENTS.some(item => item.id === id));
    return <div className="merit-configuration">
      <label>{t("ui.specialty")}<select value={subject} onChange={event => onChange({ ...configuration, subject: event.target.value })}>
        <option value="">{t("ui.selectAnOption")}</option>
        {subject && !choices.includes(subject) && <option value={subject}>{subject}</option>}
        {choices.map(name => <option key={name} value={name}>{name}</option>)}
      </select></label>
      <fieldset><legend>{t("ui.bloodcraftingEnhancements")}</legend>
        <small>{t("ui.bloodcraftingBudget", { spent, available })}</small>
        {[...BLOODCRAFTING_ENHANCEMENTS.map(item => item.id), ...unknown].map(id => {
          const item = BLOODCRAFTING_ENHANCEMENTS.find(item => item.id === id), cost = item?.cost ?? 0;
          return <label key={id}>
            <input type="checkbox" checked={selected.includes(id)} disabled={!selected.includes(id) && spent + cost > available} onChange={event => onChange({ ...configuration, enhancements: event.target.checked ? [...selected, id] : selected.filter(value => value !== id) })} />
            {item ? t(item.label) : id}{cost ? ` (${cost})` : ""}
          </label>;
        })}
      </fieldset>
    </div>;
  }} />;
}
