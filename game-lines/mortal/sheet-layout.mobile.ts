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
    // Chronicle é exclusivo do Desktop em todas as gamelines.
    identity: positions(2, [
      ["name", 1, 1], ["player", 2, 1], ["virtue", 1, 2], ["vice", 2, 2],
      ["concept", 1, 3], ["age", 2, 3], ["faction", 1, 4], ["group", 2, 4],
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
  // Notes: retrato e notas livres do personagem.
  notes: flow(["portrait", "notes"]),
} as const;
