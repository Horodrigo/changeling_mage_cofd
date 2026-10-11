import { createMainSheetLayout, type MainSheetDesktopLayoutInput } from "@/app/workspace/sheet-layout";

const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const mortalDesktopLayout = {
  main: createMainSheetLayout({
    identity: {
      ...positions(3, [
        ["name", 1, 1], ["virtue", 2, 1], ["chronicle", 3, 1],
        ["age", 1, 2], ["vice", 2, 2], ["faction", 3, 2],
        ["player", 1, 3], ["concept", 2, 3], ["group", 3, 3],
      ]),
      sectionClassName: "cod-main-identity sheet-identity-grid",
    },
    attributes: positions(3, [["Mental", 1, 1], ["Physical", 2, 1], ["Social", 3, 1]]),
    skills: positions(1, [["Mental", 1, 1], ["Physical", 1, 2], ["Social", 1, 3]]),
    body: {
      ...positions(3, [
        ["skills", 1, 1], ["specificPowers", 2, 1], ["merits", 2, 2],
        ["lineSections", 2, 3], ["aspirations", 2, 4], ["obsessions", 2, 5],
        ["conditions", 2, 6], ["health", 3, 1], ["willpower", 3, 2],
        ["powerStat", 3, 3], ["fuel", 3, 4], ["stability", 3, 5],
        ["derived", 3, 6], ["experience", 3, 7],
      ]),
      columnClassNames: ["cod-main-skills sheet-skills-column", "cod-main-other sheet-center-column", "cod-main-core sheet-right-column"],
      sectionClassName: "cod-main-columns official-sheet-body",
    },
  } satisfies MainSheetDesktopLayoutInput),
  // Aba Combat: o slot inclui estatísticas derivadas, resumo de combate,
  // Tilts, armadura, armas, equipamento e veículos.
  combat: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "combat", column: 1, order: 1 }] },
    }],
  },
  // Aba Notes: retrato no topo, seguido das notas livres do personagem.
  notes: {
    sections: [
      { id: "portrait", order: 1, definition: { columns: 1, items: [{ id: "portrait", column: 1, order: 1 }] } },
      { id: "content", order: 2, definition: { columns: 1, items: [{ id: "notes", column: 1, order: 1 }] } },
    ],
  },
} as const;
