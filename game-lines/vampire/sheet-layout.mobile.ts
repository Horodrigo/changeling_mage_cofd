import type { MainSheetMobileLayout, SheetLayoutFlowDefinition } from "@/app/workspace/sheet-layout";

const flow = (ids: readonly string[]): SheetLayoutFlowDefinition => ({
  items: ids.map((id, index) => ({ id, order: index + 1 })),
});
const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const vampireMobileLayout = {
  main: {
    identity: positions(2, [
      ["name", 1, 1], ["player", 2, 1], ["mask", 1, 2], ["dirge", 2, 2],
      ["clan", 1, 3], ["covenant", 2, 3], ["concept", 1, 4], ["bloodline", 2, 4], ["chronicle", 1, 5],
    ]),
    attributes: positions(3, [["Mental", 1, 1], ["Physical", 2, 1], ["Social", 3, 1]]),
    skills: positions(1, [["Mental", 1, 1], ["Physical", 1, 2], ["Social", 1, 3]]),
  } satisfies MainSheetMobileLayout,
  // Resumo: identidade; Aspirations; Experience.
  summary: flow(["identity", "aspirations", "experience"]),
  // Stats: Attributes; Skills.
  stats: flow(["attributes", "skills"]),
  // Details: Merits expandidos; Humanity; Banes; Conditions.
  details: flow(["expandedMerits", "humanity", "banes", "conditions"]),
  // Powers: recurso de Blood Potency; Disciplines; escolhas Protean;
  // Disciplines de rituais; poderes adquiridos; Tricks.
  powers: flow(["bloodPotencyResource", "disciplines", "proteanChoices", "ritualDisciplines", "purchasedPowers", "tricks"]),
  // Bloodlines: página completa de Bloodline e suas opções.
  bloodlines: flow(["bloodlines"]),
  // Combat: Health; Willpower; painel de combate; Frenzy.
  combat: flow(["health", "willpower", "combat", "frenzy"]),
  // Companions: página de companheiros Vampire.
  companions: flow(["companions"]),
  // Notes: Blood Bonds; notas livres.
  notes: flow(["bloodBonds", "notes"]),
} as const;
