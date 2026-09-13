"use client";

import { useLanguage } from "@/lib/i18n";

/** Mage-only experience rules kept outside the common picker closure. */
export function MageExperienceRules() {
  const { locale, tr } = useLanguage();
  const beatsPt = [
    "Cumprir ou avançar uma Aspiração",
    "Resolver uma Condição",
    "Aceitar falha dramática",
    "Fim do capítulo",
  ];
  const beatsEn = ["Fulfill or advance an Aspiration", "Resolve a Condition", "Accept a dramatic failure", "End of the chapter"];
  const arcanePt = [
    "Cumprir ou avançar uma Obsessão",
    "Resolver Condição criada por magia, Paradoxo ou efeito mágico",
    "Falha dramática em conjuração",
    "Arriscar Ato de Hubris",
    "Tutoria de Legado",
    "Encontro novo e significativo com o sobrenatural",
  ];
  const arcaneEn = ["Fulfill or advance an Obsession", "Resolve a Condition created by magic, Paradox, or a magical effect", "Dramatic failure on spellcasting", "Risk an Act of Hubris", "Legacy tutoring", "A new and significant encounter with the supernatural"];
  const costsPt = [
    ["Atributo", "4/ponto, comum"],
    ["Perícia", "2/ponto, comum"],
    ["Mérito", "1/ponto, comum"],
    ["Arcano até o limite", "4/ponto, comum e/ou Arcana"],
    ["Arcano acima do limite", "5/ponto, somente comum + professor"],
    ["Gnose", "5/ponto, comum e/ou Arcana"],
    ["Rota", "1, comum"],
    ["Práxis", "1, somente Arcana"],
    ["Sabedoria", "2/ponto, somente Arcana"],
    ["Força de Vontade perdida", "1, comum"],
  ];
  const costsEn = [["Attribute", "4/dot, regular"], ["Skill", "2/dot, regular"], ["Merit", "1/dot, regular"], ["Arcanum up to the limit", "4/dot, regular and/or Arcane"], ["Arcanum above the limit", "5/dot, regular only + teacher"], ["Gnosis", "5/dot, regular and/or Arcane"], ["Rote", "1, regular"], ["Praxis", "1, Arcane only"], ["Wisdom", "2/dot, Arcane only"], ["Lost Willpower dot", "1, regular"]];
  const beats = locale === "en-US" ? beatsEn : beatsPt;
  const arcane = locale === "en-US" ? arcaneEn : arcanePt;
  const costs = locale === "en-US" ? costsEn : costsPt;
  return (
    <div className="experience-rule-menus">
      <details className="experience-rules"><summary>{tr("Formas de ganhar Beats", "Ways to earn Beats")}</summary><table>
        <tbody>
          {beats.map((x) => <tr key={x}><td>{x}</td><td>1 Beat</td></tr>)}
          {arcane.map((x) => <tr key={x}><td>{x}</td><td>{tr("1 Beat Arcano", "1 Arcane Beat")}</td></tr>)}
        </tbody>
      </table></details>
      <details className="experience-rules"><summary>{tr("Tabela de custos", "Cost table")}</summary><table>
        <tbody>{costs.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody>
      </table></details>
    </div>
  );
}

export function formatSpellRequirements(requirements: Record<string, number>) {
  return Object.entries(requirements)
    .map(([arcanum, dots]) => `${arcanum} ${dots}`)
    .join(" + ");
}
