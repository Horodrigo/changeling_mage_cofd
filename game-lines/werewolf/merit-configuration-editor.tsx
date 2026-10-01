"use client";

import { Choice } from "@/app/builder/common-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { MeritConfiguration } from "@/lib/core/character/merit-configuration";
import { useLanguage, type MessageKey } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import { favoredFormAttributes, favoredFormPenalties, WEREWOLF_MERIT_CONFIGURATION_IDS, type WerewolfMeritChoice, type WerewolfMeritContext } from "./merit-rules";
import "./styles/merits.css";

/** Selected catalog IDs dispatch mechanics; translated Merit names never do. */
export function WerewolfMeritConfigurationEditor({ merit, context, onChange, giftPresentation = {} }: {
  merit: WerewolfMeritChoice; context: WerewolfMeritContext;
  onChange: (configuration: MeritConfiguration) => void;
  giftPresentation?: WerewolfGiftCatalog["presentation"];
}) {
  const { locale, t } = useLanguage();
  if (!WEREWOLF_MERIT_CONFIGURATION_IDS.has(merit.id)) return null;
  const configuration = merit.configuration ?? {};
  const value = (key: string) => typeof configuration[key] === "string" ? configuration[key] as string : "";
  const set = (key: string, next: string | string[]) => onChange({ ...configuration, [key]: next });
  const traitLabels = (options: readonly string[]) => Object.fromEntries(options.map(name => [name, systemTerm(name, locale)]));
  const choice = (key: string, label: MessageKey, options: readonly string[], labels = traitLabels(options)) => {
    const selected = value(key);
    const unavailable = selected && !options.includes(selected);
    return <Choice label={t(label)} value={selected} setValue={next => set(key, next)} options={unavailable ? [selected, ...options] : options}
      optionLabels={{ ...labels, ...(unavailable ? { [selected]: t("werewolf.meritChoice.missingChoice", { value: selected }) } : {}) }} invalid={Boolean(unavailable)}/>;
  };
  const form = context.forms.find(item => item.id === value("form"));
  const forms = context.forms.filter(item => item.id !== "hishu");
  const formChoice = choice("form", "werewolf.meritChoice.form", forms.map(item => item.id), Object.fromEntries(forms.map(item => [item.id, item.name])));
  const attributeChoice = choice("attribute", "werewolf.meritChoice.attribute", Object.values(ATTRIBUTES).flat());
  let fields;
  switch (merit.id) {
    case "wtf-2ed:anchored": fields = choice("touchstone", "werewolf.meritChoice.touchstone", ["physical", "spiritual"], { physical: t("werewolf.physicalTouchstone"), spiritual: t("werewolf.spiritualTouchstone") }); break;
    case "wtf-2ed:blood-or-bone-affinity": fields = merit.dots >= 5 ? <p>{t("werewolf.meritChoice.bothAnchors")}</p> : choice("anchor", "werewolf.meritChoice.anchor", ["blood", "bone"], { blood: t("werewolf.blood"), bone: t("werewolf.bone") }); break;
    case "wtf-2ed:code-of-honor": fields = <label>{t("werewolf.meritChoice.virtue")}<Input value={value("virtue")} onChange={event => set("virtue", event.target.value)}/></label>; break;
    case "wtf-2ed:dedicated-locus": {
      const places = context.merits.filter(item => item.id === "core-2ed:safe-place" && item.instanceId && item.dots >= merit.dots);
      fields = choice("safePlaceId", "werewolf.meritChoice.safePlace", places.map(item => item.instanceId!), Object.fromEntries(places.map(item => [item.instanceId!, t("werewolf.meritChoice.safePlaceInstance", {
        name: typeof item.configuration?.place === "string" && item.configuration.place.trim() ? item.configuration.place : item.instanceId!, dots: item.dots,
      })]))); break;
    }
    case "wtf-2ed:embodiment-of-the-firstborn": fields = attributeChoice; break;
    case "wtf-2ed:fortified-form": fields = formChoice; break;
    case "wtf-2ed:living-weapon": fields = <>{formChoice}{choice("attack", "werewolf.meritChoice.attack", ["bite", "claws"], { bite: t("werewolf.meritChoice.bite"), claws: t("werewolf.meritChoice.claws") })}</>; break;
    case "wtf-2ed:moon-kissed": fields = <>
      {choice("skill", "werewolf.meritChoice.moonSkill", (context.auspice?.skills ?? []).filter(skill => context.skills[skill] >= 2))}
      {choice("penaltySkill", "werewolf.meritChoice.penaltySkill", Object.values(SKILLS).flat().filter(skill => !context.auspice?.skills.includes(skill) && context.skills[skill] >= 1))}
    </>; break;
    case "wtf-2ed:favored-form": {
      const penalties = favoredFormPenalties(configuration);
      const rows = Array.isArray(configuration.penalties) ? configuration.penalties : [];
      const setPenalty = (index: number, formId: string, attribute: string) => {
        const next = [...rows];
        while (next.length <= index) next.push(":");
        next[index] = `${formId}:${attribute}`;
        set("penalties", next);
      };
      const allowedAttributes = form ? favoredFormAttributes(form) : [];
      fields = <>
        {formChoice}
        {choice("physicalSkill", "werewolf.meritChoice.physicalSkill", SKILLS.Physical)}
        {merit.dots >= 2 && choice("attribute", "werewolf.meritChoice.attribute", allowedAttributes)}
        {merit.dots >= 3 && choice("giftId", "werewolf.meritChoice.gift", context.gifts.map(gift => gift.id), Object.fromEntries(context.gifts.map(gift => [gift.id, locale === "pt-BR" ? giftPresentation[gift.id]?.name ?? gift.name : gift.name])))}
        {merit.dots >= 4 && choice("secondAttribute", "werewolf.meritChoice.secondAttribute", allowedAttributes.filter(name => name !== value("attribute")))}
        {merit.dots >= 5 && choice("advancedSkill", "werewolf.meritChoice.advancedSkill", Object.values(SKILLS).flat())}
        {Array.from({ length: Math.min(5, Math.max(merit.dots, rows.length)) }, (_, index) => {
          const row = penalties[index] ?? { formId: "", attribute: "" };
          const otherForms = context.forms.filter(item => item.id !== form?.id || item.id === row.formId);
          return <fieldset key={index}><legend>{t("werewolf.meritChoice.penalty", { dot: index + 1 })}</legend>
            <Choice label={t("werewolf.meritChoice.penaltyForm")} value={row.formId} setValue={next => setPenalty(index, next, row.attribute)} options={otherForms.map(item => item.id)} optionLabels={Object.fromEntries(otherForms.map(item => [item.id, item.name]))} invalid={row.formId === form?.id}/>
            <Choice label={t("werewolf.meritChoice.penaltyAttribute")} value={row.attribute} setValue={next => setPenalty(index, row.formId, next)} options={[...ATTRIBUTES.Mental, ...ATTRIBUTES.Physical]} optionLabels={traitLabels([...ATTRIBUTES.Mental, ...ATTRIBUTES.Physical])}/>
            {index >= merit.dots && <Button type="button" size="sm" variant="outline" onClick={() => set("penalties", rows.filter((_, rowIndex) => rowIndex !== index))}>{t("ui.removeRow")}</Button>}
          </fieldset>;
        })}
        {rows.length > 5 && <Button type="button" size="sm" variant="outline" onClick={() => set("penalties", rows.slice(0, 5))}>{t("werewolf.removeExtraPenaltyRows")}</Button>}
      </>; break;
    }
  }
  return <details className="merit-configuration wtf-merit-configuration"><summary>{t("ui.configureChoices")}</summary><div className="form-grid">{fields}</div></details>;
}
