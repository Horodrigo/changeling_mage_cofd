import type { MainSheetMobileLayout, SheetLayoutFlowDefinition } from "@/app/workspace/sheet-layout";

const flow = (ids: readonly string[]): SheetLayoutFlowDefinition => ({
  items: ids.map((id, index) => ({ id, order: index + 1 })),
});
const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const mageMobileIdentityLayout = {
  columns: 2,
  items: [
    { id: "shadowName", column: 1, order: 1 },
    { id: "player", column: 2, order: 1 },
    { id: "vice", column: 1, order: 2 },
    { id: "virtue", column: 2, order: 2 },
    { id: "concept", column: 1, order: 3 },
    { id: "path", column: 2, order: 3 },
    { id: "order", column: 1, order: 4 },
    { id: "legacy", column: 2, order: 4 },
  ],
} as const;

export const mageMobileLayout = {
  main: {
    identity: mageMobileIdentityLayout,
    attributes: positions(3, [["Mental", 1, 1], ["Physical", 2, 1], ["Social", 3, 1]]),
    skills: positions(1, [["Mental", 1, 1], ["Physical", 1, 2], ["Social", 1, 3]]),
  } satisfies MainSheetMobileLayout,
  // Resumo: identidade; Aspirations; Obsessions; Experience.
  resumo: flow(["identity", "aspirations", "obsessions", "experience"]),
  // Stats: Attributes; Skills.
  stats: flow(["attributes", "skills"]),
  // Details: Merits; Merits expandidos; Order; feitiços ativos; Conditions.
  detalhes: flow(["merits", "expandedMerits", "order", "activeSpells", "conditions"]),
  // Powers: recurso de Gnosis; Arcana; Wisdom; Rotes; ferramentas mágicas;
  // Nimbus; Praxes; Attainments; Conditions de Paradox.
  poderes: flow(["powerResource", "arcana", "wisdom", "rotes", "magicalTools", "nimbus", "praxes", "attainments", "paradoxConditions"]),
  // Legacy: página completa de Legacy, incluindo progressão e Attainments.
  legacy: flow(["legacy"]),
  // Combat: Health; Willpower; painel completo de combate.
  combate: flow(["health", "willpower", "combat"]),
  // Companheiros Mage e Core são exibidos em sequência na aba.
  companheiros: flow(["companions"]),
  // Anotações: notas livres.
  anotacoes: flow(["notes"]),
} as const;
