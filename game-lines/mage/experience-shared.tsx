"use client";

import { useLanguage, type Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";

/** Mage-only experience rules kept outside the common picker closure. */
export function MageExperienceRules() {
  const { t } = useLanguage();
  const beats = [t("ui.beatAdvanceAspiration"), t("ui.beatCondition"), t("ui.beatDramaticFailure"), t("ui.beatEndChapter")];
  const arcane = [t("ui.beatAdvanceObsession"), t("ui.beatMagicalCondition"), t("ui.beatSpellcastingFailure"), t("ui.beatRiskHubris"), t("ui.beatLegacyTutoring"), t("ui.beatSupernaturalEncounter")];
  const costs = [
    [t("ui.attribute"), t("ui.regularExperiencePerDot", { cost: 4 })],
    [t("ui.skill"), t("ui.regularExperiencePerDot", { cost: 2 })],
    [t("ui.merit"), t("ui.regularExperiencePerDot", { cost: 1 })],
    [t("ui.arcanumUpToLimit"), t("ui.mixedExperiencePerDot", { cost: 4 })],
    [t("ui.arcanumAboveLimit"), t("ui.aboveLimitExperiencePerDot", { cost: 5 })],
    [t("ui.gnosis"), t("ui.mixedExperiencePerDot", { cost: 5 })],
    [t("ui.rote"), t("ui.regularExperienceCost", { cost: 1 })],
    [t("ui.praxis"), t("ui.arcaneExperienceCost", { cost: 1 })],
    [t("ui.wisdom"), t("ui.arcaneExperiencePerDot", { cost: 2 })],
    [t("ui.lostWillpowerDot"), t("ui.regularExperienceCost", { cost: 1 })],
  ];
  return (
    <div className="experience-rule-menus">
      <details className="experience-rules"><summary>{t("ui.waysToEarnBeats")}</summary><table>
        <tbody>
          {beats.map((x) => <tr key={x}><td>{x}</td><td>{t("ui.oneBeat")}</td></tr>)}
          {arcane.map((x) => <tr key={x}><td>{x}</td><td>{t("ui.message1ArcaneBeat")}</td></tr>)}
        </tbody>
      </table></details>
      <details className="experience-rules"><summary>{t("ui.costTable")}</summary><table>
        <tbody>{costs.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody>
      </table></details>
    </div>
  );
}

export function formatSpellRequirements(requirements: Record<string, number>, locale: Locale = "en-US") {
  return Object.entries(requirements)
    .map(([arcanum, dots]) => `${systemTerm(arcanum, locale)} ${dots}`)
    .join(" + ");
}
