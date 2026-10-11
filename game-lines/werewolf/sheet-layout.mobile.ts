import type { MainSheetMobileLayout, SheetLayoutFlowDefinition } from "@/app/workspace/sheet-layout";

const flow = (ids: readonly string[]): SheetLayoutFlowDefinition => ({
  items: ids.map((id, index) => ({ id, order: index + 1 })),
});
const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const werewolfMobileLayout = {
  main: {
    identity: positions(2, [
      ["name", 1, 1], ["concept", 2, 1],
      ["player", 1, 2], ["auspice", 2, 2],
      ["blood", 1, 3], ["tribe", 2, 3],
      ["bone", 1, 4], ["lodge", 2, 4],
    ]),
    attributes: positions(3, [["Mental", 1, 1], ["Physical", 2, 1], ["Social", 3, 1]]),
    skills: positions(1, [["Mental", 1, 1], ["Physical", 1, 2], ["Social", 1, 3]]),
  } satisfies MainSheetMobileLayout,
  // Summary: identidade; Aspirations; Experience.
  summary: flow(["identity", "aspirations", "experience"]),
  // Stats: Attributes; Skills.
  stats: flow(["attributes", "skills"]),
  // Details: Renown; Merits; Anchors (Blood/Bone); Harmony; Conditions.
  details: flow(["renown", "merits", "anchors", "harmony", "conditions"]),
  // Forms: forma selecionada com seus valores e passivas; não divide a tabela.
  forms: flow(["forms"]),
  // Powers: Primal Urge; Essence; superfície composta de Gifts, Rites,
  // Fetishes/Talens e Totem.
  powers: flow(["powerStat", "essence", "powers"]),
  // Combat: Health; Willpower; painel completo de combate.
  combat: flow(["health", "willpower", "combat"]),
  // Notes: notas livres do personagem.
  notes: flow(["notes"]),
  lodge: flow(["directory"]),
} as const;
