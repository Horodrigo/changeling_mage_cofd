import type { MainSheetMobileLayout, SheetLayoutFlowDefinition } from "@/app/workspace/sheet-layout";

const flow = (ids: readonly string[]): SheetLayoutFlowDefinition => ({
  items: ids.map((id, index) => ({ id, order: index + 1 })),
});
const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const changelingMobileLayout = {
  main: {
    // Chronicle é exclusivo do Desktop em todas as gamelines.
    identity: positions(2, [
      ["name", 1, 1],     ["concept", 2, 1],
      ["player", 1, 2],   ["seeming", 2, 2],
      ["needle", 1, 3],   ["kith", 2, 3],
      ["thread", 1, 4],   ["court", 2, 4],
    ]),
    attributes: positions(3, [["Mental", 1, 1], ["Physical", 2, 1], ["Social", 3, 1]]),
    skills: positions(1, [["Mental", 1, 1], ["Physical", 1, 2], ["Social", 1, 3]]),
  } satisfies MainSheetMobileLayout,
  // Resumo: identidade; Aspirations; Experience.
  resumo: flow(["identity", "aspirations", "experience"]),
  // Stats: Attributes; Skills.
  stats: flow(["attributes", "skills"]),
  // Details: Merits; Merits expandidos; Court Lore; Frailties; Touchstones;
  // Clarity; Conditions.
  detalhes: flow(["merits", "expandedMerits", "courtLore", "frailties", "touchstones", "clarity", "conditions"]),
  // Powers: Wyrd/Glamour; Regalia favorecida; Contracts; Goblin Debt;
  // Seeming Lore; Kith Lore.
  poderes: flow(["resource", "regalia", "contracts", "goblinDebt", "seemingLore", "kithLore"]),
  // Entitlement: página completa de Entitlement e seus benefícios.
  entitlement: flow(["entitlement"]),
  // Combat: Health; Willpower; painel completo de combate.
  combate: flow(["health", "willpower", "combat"]),
  // Companheiros Changeling e Core são apresentados juntos em um único slot.
  companheiros: flow(["companions"]),
  // Anotações: retrato; Oaths; notas livres.
  anotacoes: flow(["portrait", "oaths", "notes"]),
} as const;
