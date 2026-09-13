"use client";

import { Choice } from "@/app/builder/common-controls";
import type { StructuredMeritEditorProps } from "@/app/builder/merit-configuration-editor";
import { SKILLS } from "@/lib/core/character/creation-rules";
import { useLanguage } from "@/lib/i18n";

/** Mage-only editor for the fixed benefits of a Nameless Order. */
export function MageStructuredMeritEditor(props: StructuredMeritEditorProps) {
  const { tr } = useLanguage();
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
    <summary>{tr("Configurar benefícios da Ordem sem Nome", "Configure Nameless Order benefits")}</summary>
    <div>
      <fieldset><legend>{tr("Nv", "Dot")} 1</legend><p className="structured-rule">High Speech</p></fieldset>
      {props.merit.dots >= 2 && <fieldset><legend>{tr("Nv", "Dot")} 2</legend><div className="merit-config-list">
        {Array.from({ length: 3 }, (_, index) => {
          const unavailable = new Set(selected.filter((_, itemIndex) => itemIndex !== index));
          return <Choice key={index} label={`${tr("Perícia de Rota", "Rote Skill")} ${index + 1}`} value={selected[index] || "__none"} setValue={(value) => setRoteSkill(index, value === "__none" ? "" : value)} options={["__none", ...Object.values(SKILLS).flat().filter((skill) => !unavailable.has(skill))]} optionLabels={{ __none: tr("Selecione uma Perícia", "Select a Skill") }} />;
        })}
      </div></fieldset>}
      {props.merit.dots >= 3 && <fieldset><legend>{tr("Nv", "Dot")} 3</legend><p className="structured-rule">{tr("+1 em Ocultismo", "+1 Occult dot")}</p></fieldset>}
    </div>
  </details>;
}
