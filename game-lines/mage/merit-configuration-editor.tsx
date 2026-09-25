"use client";

import { Choice } from "@/app/builder/common-controls";
import type { StructuredMeritEditorProps } from "@/app/builder/merit-configuration-editor";
import { SKILLS } from "@/lib/core/character/creation-rules";
import { useLanguage } from "@/lib/i18n";
import type { MageFactionDefinition } from "./factions";
import { findMageFaction, mageFactionAvailable } from "./factions";

/** Mage-only editor for the fixed benefits of a Nameless Order. */
export function MageStructuredMeritEditor(props: StructuredMeritEditorProps & { factions?: readonly MageFactionDefinition[]; order?: string }) {
  const { t } = useLanguage();
  if (props.merit.name === "Faction Member") {
    const available = (props.factions ?? []).filter((faction) => mageFactionAvailable(faction, props.order));
    const selected = findMageFaction(props.factions ?? [], props.configuration.factionId);
    const set = (key: string, value: string) => props.onChange({ ...props.configuration, [key]: value });
    return <details className={`merit-configuration structured${props.compact ? " compact" : ""}`} open={!props.compact}>
      <summary>{t("ui.configureFactionMembership")}</summary>
      <div>
        <Choice label={t("ui.faction")} value={selected?.id ?? "__none"} setValue={(value) => props.onChange({ ...props.configuration, factionId: value === "__none" ? "" : value, roteSkill: "" })} options={["__none", ...available.map((faction) => faction.id)]} optionLabels={{ __none: t("ui.selectFaction"), ...Object.fromEntries(available.map((faction) => [faction.id, faction.name])) }} />
        {selected && <p className="structured-rule"><strong>{t("ui.factionToolYantra")}:</strong> {selected.toolYantra}{selected.heretical ? ` · ${t("ui.hereticalFaction")}` : ""}</p>}
        {selected && props.merit.dots >= 3 && <Choice label={t("ui.roteSkill")} value={String(props.configuration.roteSkill ?? "") || "__none"} setValue={(value) => set("roteSkill", value === "__none" ? "" : value)} options={["__none", ...selected.roteSkills]} optionLabels={{ __none: t("ui.selectASkill") }} />}
      </div>
    </details>;
  }
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
      <fieldset><legend>{t("ui.dot")} 1</legend><p className="structured-rule">{t("ui.highSpeech")}</p></fieldset>
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
