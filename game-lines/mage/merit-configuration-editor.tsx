"use client";

import { Choice } from "@/app/builder/common-controls";
import type { StructuredMeritEditorProps } from "@/app/builder/merit-configuration-editor";
import { SKILLS } from "@/lib/core/character/creation-rules";
import { useLanguage } from "@/lib/i18n";

/** Mage-only editor for the fixed benefits of a Nameless Order. */
export function MageStructuredMeritEditor(props: StructuredMeritEditorProps) {
  const { t } = useLanguage();
  if (props.merit.name !== "Mystery Cult Initiation" || props.merit.grantedBy !== "Nameless Order") return null;
  const selected = Array.isArray(props.configuration.level_2_rote_skills)
    ? props.configuration.level_2_rote_skills.map(String)
    : [];
  const setRoteSkill = (index: number, value: string) => {
    const skills = Array.from({ length: 3 }, (_, itemIndex) => selected[itemIndex] ?? "");
    skills[index] = value;
    props.onChange({ ...props.configuration, level_2_rote_skills: skills });
  };
  return <details className={`merit-configuration structured${props.compact ? " compact" : ""}`} open={!props.compact}>
    <summary>{t("ui.configureNamelessOrderBenefits")}</summary>
    <div>
      <fieldset><legend>{t("ui.dot")} 1</legend><p className="structured-rule">High Speech</p></fieldset>
      {props.merit.dots >= 2 && <fieldset><legend>{t("ui.dot")} 2</legend><div className="merit-config-list">
        {Array.from({ length: 3 }, (_, index) => {
          const unavailable = new Set(selected.filter((_, itemIndex) => itemIndex !== index));
          return <Choice key={index} label={`${t("ui.roteSkill")} ${index + 1}`} value={selected[index] || "__none"} setValue={(value) => setRoteSkill(index, value === "__none" ? "" : value)} options={["__none", ...Object.values(SKILLS).flat().filter((skill) => !unavailable.has(skill))]} optionLabels={{ __none: t("ui.selectASkill") }} />;
        })}
      </div></fieldset>}
      {props.merit.dots >= 3 && <fieldset><legend>{t("ui.dot")} 3</legend><p className="structured-rule">{t("ui.message1OccultDot")}</p></fieldset>}
    </div>
  </details>;
}
