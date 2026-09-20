"use client";

import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import type { MeritDefinition } from "@/lib/merits";
import { systemTerm } from "@/lib/system-terms";
import { translate, useLanguage, type Locale } from "@/lib/i18n";
import { changelingContractExperienceCost } from "@/lib/changeling-regalia";
import { permanentClarityBonus } from "@/lib/resource-rules";
import { derivedWithPermanentMerits as derivedWithCommonMerits } from "@/app/workspace/experience-shared";

export function contractExperienceCost(contract: ContractDefinition, character: CharacterSheet) {
  return changelingContractExperienceCost(contract, character.line_data);
}

export function purchasePreview(input: {
  locale: Locale;
  purchaseType: string;
  character: CharacterSheet;
  attribute: string;
  skill: string;
  selectedMerit?: MeritDefinition;
  nextMeritRating?: number;
  ownedMerit?: CharacterSheet["merits"][number];
  selectedContract?: ContractDefinition;
  specialtySkill: string;
  specialtyName: string;
  benefitKey?: string;
  wyrd: number;
  lostWillpower: number;
  targetRating: number;
}) {
  const { purchaseType, character, locale } = input;
  if (purchaseType === "Atributo") return { label: `${systemTerm(input.attribute,locale)} ${input.targetRating}`, cost: 4 * (input.targetRating - Number(character.attributes[input.attribute] ?? 1)) };
  if (purchaseType === "Perícia") return { label: `${systemTerm(input.skill,locale)} ${input.targetRating}`, cost: 2 * (input.targetRating - Number(character.skills[input.skill] ?? 0)) };
  if (purchaseType === "Mérito") return {
    label: input.nextMeritRating
      ? `${locale === "en-US" ? input.selectedMerit?.name : input.selectedMerit?.translatedName} ${input.nextMeritRating}`
      : translate(locale, "ui.noAdditionalRating"),
    cost: input.nextMeritRating ? input.nextMeritRating - (input.ownedMerit?.dots ?? 0) : 0,
  };
  if (purchaseType === "Especialização") return {
    label: `${systemTerm(input.specialtySkill,locale)}: ${input.specialtyName || translate(locale, "ui.newSpecialty")}`,
    cost: 1,
  };
  if (purchaseType === "Contrato") return {
    label: (locale === "en-US" ? input.selectedContract?.originalName : input.selectedContract?.name) ?? translate(locale, "ui.noContractAvailable"),
    cost: input.selectedContract ? contractExperienceCost(input.selectedContract, character) : 0,
  };
  if (purchaseType === "Benefício de Contrato") return {
    label: input.benefitKey ? translate(locale, "ui.benefitFromAnotherSeeming") : translate(locale, "ui.noBenefitAvailable"),
    cost: input.benefitKey ? 1 : 0,
  };
  if (purchaseType === "Fado") return {
    label: input.wyrd < 10 ? `${translate(locale, "ui.wyrd")} ${input.targetRating}` : translate(locale, "ui.maximumWyrd"),
    cost: input.wyrd < 10 ? 5 * (input.targetRating - input.wyrd) : 0,
  };
  return {
    label: input.lostWillpower ? `${translate(locale, "ui.willpower")} ${input.targetRating}` : translate(locale, "ui.noLostDots"),
    cost: input.lostWillpower ? input.targetRating - (Number(character.derived.ForçaDeVontade ?? 1) - input.lostWillpower) : 0,
  };
}

export function recalculateCtlDerived(sheet: CharacterSheet) {
  const a = sheet.attributes, s = sheet.skills;
  sheet.derived = {
    ...sheet.derived,
    Tamanho: 5,
    Vitalidade: 5 + Number(a.Stamina ?? 1),
    Deslocamento: 5 + Number(a.Strength ?? 1) + Number(a.Dexterity ?? 1),
    ForçaDeVontade: Number(a.Resolve ?? 1) + Number(a.Composure ?? 1),
    Iniciativa: Number(a.Dexterity ?? 1) + Number(a.Composure ?? 1),
    Defesa: Math.min(Number(a.Dexterity ?? 1), Number(a.Wits ?? 1)) + Number(s.Athletics ?? 0),
    LucidezMaxima: Number(a.Wits ?? 1) + Number(a.Composure ?? 1),
  };
}

export function derivedWithPermanentMerits(character: CharacterSheet) {
  const derived = derivedWithCommonMerits(character);
  derived.LucidezMaxima = Number(derived.LucidezMaxima ?? derived.ClarezaMaxima ?? 1) + permanentClarityBonus(character.current_state);
  if (character.line_data.seeming === "Beast") {
    derived.Iniciativa = Number(derived.Iniciativa ?? 0) + 3;
    derived.Deslocamento = Number(derived.Deslocamento ?? 0) + 3;
  }
  return derived;
}

/** Changeling-only beat sources and advancement costs. */
export function ExperienceRules() {
  const { locale, t } = useLanguage();
  const beatRowsPt = ["Cumprir uma Aspiração", "Resolver uma Condição", "Aceitar uma falha dramática", "Render-se em combate", "Sofrer dano nas caixas finais de Vitalidade", "Encerrar uma sessão", "Sofrer dano de Lucidez", "Liberar Desvario involuntariamente"];
  const beatRowsEn = ["Fulfill an Aspiration", "Resolve a Condition", "Accept a dramatic failure", "Surrender in combat", "Take damage in the final Health boxes", "End a session", "Take Clarity damage", "Release Bedlam involuntarily"];
  const costRowsPt = [["Atributo", "4 por ponto"], ["Perícia", "2 por ponto"], ["Mérito", "1 por ponto"], ["Especialização", "1"], ["Contrato favorecido", "Comum 2 · Real 3"], ["Contrato não favorecido", "Comum 3 · Real 4"], ["Contrato Goblin", "2"], ["Benefício de outra Feição", "1"], ["Fado", "5 por ponto"], ["Ponto perdido de Força de Vontade", "1"]];
  const costRowsEn = [["Attribute", "4 per dot"], ["Skill", "2 per dot"], ["Merit", "1 per dot"], ["Specialty", "1"], ["Favored Contract", "Common 2 · Royal 3"], ["Non-favored Contract", "Common 3 · Royal 4"], ["Goblin Contract", "2"], ["Benefit of another Seeming", "1"], ["Wyrd", "5 per dot"], ["Lost Willpower dot", "1"]];
  const beatRows = locale === "en-US" ? beatRowsEn : beatRowsPt;
  const costRows = locale === "en-US" ? costRowsEn : costRowsPt;
  return (
    <div className="experience-rule-menus">
      <details className="experience-rules"><summary>{t("ui.waysToEarnBeats")}</summary><table><tbody>{beatRows.map((label) => <tr key={label}><td>{label}</td><td>{t("ui.oneBeat")}</td></tr>)}</tbody></table></details>
      <details className="experience-rules"><summary>{t("ui.costTable")}</summary><table>
        <thead><tr><th>{t("ui.trait")}</th><th>{t("ui.xp")}</th></tr></thead>
        <tbody>{costRows.map(([label, cost]) => <tr key={label}><td>{label}</td><td>{cost}</td></tr>)}</tbody>
      </table></details>
    </div>
  );
}
