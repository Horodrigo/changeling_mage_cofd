"use client";

import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { ATTRIBUTES } from "@/lib/core/character/creation-rules";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormDefinition, FormId, WerewolfReferenceCatalog } from "./catalogs/reference";
import { formTraits } from "./creation-rules";
import type { WerewolfMeritChoice } from "./merit-rules";
import "./styles/forms.css";

type FormProps = {
  character: Pick<CharacterSheet, "attributes" | "skills"> & Partial<Pick<CharacterSheet, "merits">>;
  reference: WerewolfReferenceCatalog; baseSize?: number; merits?: readonly WerewolfMeritChoice[];
};

export function FormSelector({ value, onChange, reference }: { value: FormId; onChange: (value: string) => void; reference: WerewolfReferenceCatalog }) {
  const { t } = useLanguage();
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={t("werewolf.healthForm")}><SelectValue/></SelectTrigger>
    <SelectContent>{reference.forms.map(form => <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>)}</SelectContent>
  </Select>;
}

function FormColumn({ character, reference, baseSize = 5, merits = [], form }: FormProps & { form: FormDefinition }) {
  const { locale, t } = useLanguage();
  const traits = formTraits(character, form, baseSize, merits, character.merits);
  const changedAttributes = Object.values(ATTRIBUTES).flat().filter(attribute => attribute in form.attributes || (traits.attributes[attribute] ?? 0) !== Number(character.attributes[attribute] ?? 0));
  const rows = [
    [t("ui.size"), traits.size], [t("ui.health"), traits.health], [t("ui.defense"), traits.defense],
    [t("ui.initiative"), traits.initiative], [t("ui.speed"), traits.speed],
    [t("ui.armor"), `${traits.armorGeneral}/${traits.armorBallistic}`], [t("werewolf.formPerception"), `+${traits.perception}`],
    [t("werewolf.formFirearmsDefense"), traits.firearmsDefense ? t("ui.yes") : t("ui.no")],
  ];
  return <section className="wtf-form-column" data-form={form.id}>
    <h4>{form.name}</h4>
    <dl className="wtf-form-changes">{changedAttributes.map(attribute => <div key={attribute}>
      <dt>{systemTerm(attribute, locale)}</dt><dd>{traits.attributes[attribute]}</dd>
    </div>)}</dl>
    <dl className="wtf-form-derived">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="wtf-form-weapons">{(["bite", "claws"] as const).map(attack => {
      const weapon = traits.weaponBonuses[attack];
      return weapon.armorPiercing > 0 && <p className="wtf-rule-field" key={attack}><strong>{t(attack === "bite" ? "werewolf.biteMeritBenefits" : "werewolf.clawsMeritBenefits")}:</strong>{" "}
        {t(weapon.ignoresNonMagicalArmor ? "werewolf.weaponMeritIgnoresArmor" : "werewolf.weaponMeritBenefits", { damage: weapon.damage, piercing: weapon.armorPiercing })}
      </p>;
    })}
    {Object.values(traits.weaponBonuses).some(weapon => weapon.armorPiercing > 0) && <p className="wtf-rule-field">{t("werewolf.weaponMeritNote")}</p>}</div>
    <details className="wtf-form-rules"><summary>{t("ui.details")}</summary>
      {form.passives.map(passive => {
        const presentation = locale === "pt-BR" ? reference.presentation[passive.id] : undefined;
        return <article className="wtf-form-passive" key={passive.id}>
          <h5>{presentation?.name ?? passive.name}</h5>
          {passive.fields.map(field => {
            const translated = presentation?.fields?.[field.id];
            return <p className="wtf-rule-field" key={field.id}><strong>{translated?.label ?? field.label}:</strong>{" "}{translated?.text ?? field.text}</p>;
          })}
        </article>;
      })}
      <small>{t("conditions.sourcePage", { source: form.source, page: form.additionalPages?.length ? `${form.page}–${form.additionalPages.at(-1)}` : form.page })}</small>
    </details>
  </section>;
}

/** Five equal columns on desktop/print; the supplied image is decorative, not a source of mechanics. */
export function FormsTable(props: FormProps) {
  const { t } = useLanguage();
  return <section className="wtf-forms"><h3>{t("werewolf.forms")}</h3>
    <div className="wtf-forms-comparison">
      <div className="wtf-form-columns">{props.reference.forms.map(form => <FormColumn {...props} key={form.id} form={form}/>)}</div>
    </div>
  </section>;
}

/** Mobile Combat shares Health's persisted form selection and never renders the background image. */
export function MobileForm({ value, onChange, ...props }: FormProps & { value: FormId; onChange: (value: string) => void }) {
  const { t } = useLanguage();
  const form = props.reference.forms.find(form => form.id === value)!;
  return <section className="wtf-mobile-form"><div className="panel-heading"><h3>{t("werewolf.forms")}</h3><FormSelector value={value} onChange={onChange} reference={props.reference}/></div>
    <FormColumn {...props} form={form}/>
  </section>;
}
