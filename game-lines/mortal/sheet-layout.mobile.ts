import type { MainSheetMobileLayout, SheetLayoutFlowDefinition } from "@/app/workspace/sheet-layout";

const flow = (ids: readonly string[]): SheetLayoutFlowDefinition => ({
  items: ids.map((id, index) => ({ id, order: index + 1 })),
});
const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const mortalMobileLayout = {
  main: {
    identity: positions(2, [
      ["name", 1, 1], ["player", 2, 1], ["virtue", 1, 2], ["vice", 2, 2],
      ["chronicle", 1, 3], ["concept", 2, 3], ["age", 1, 4], ["faction", 2, 4], ["group", 1, 5],
    ]),
    attributes: positions(3, [["Mental", 1, 1], ["Physical", 2, 1], ["Social", 3, 1]]),
    skills: positions(1, [["Mental", 1, 1], ["Physical", 1, 2], ["Social", 1, 3]]),
  } satisfies MainSheetMobileLayout,
  // Summary: identidade; Health; Willpower; Integrity; Aspirations; Experience.
  summary: flow(["identity", "health", "willpower", "integrity", "aspirations", "experience"]),
  // Stats: Attributes; Skills; Merits.
  stats: flow(["attributes", "skills", "merits"]),
  // Details: Breaking Points pessoais; Conditions.
  details: flow(["breakingPoints", "conditions"]),
  // Combat: painel completo com estatísticas, Tilts e inventário de combate.
  combat: flow(["combat"]),
  // Notes: notas livres do personagem.
  notes: flow(["notes"]),
} as const;
