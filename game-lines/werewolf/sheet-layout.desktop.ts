import { createMainSheetLayout, type MainSheetDesktopLayoutInput } from "@/app/workspace/sheet-layout";

const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const werewolfDesktopLayout = {
  main: createMainSheetLayout({
    identity: positions(3, [
      ["name", 1, 1], ["blood", 2, 1], ["auspice", 3, 1],
      ["player", 1, 2], ["bone", 2, 2], ["tribe", 3, 2],
      ["chronicle", 1, 3], ["concept", 2, 3], ["lodge", 3, 3],
    ]),
    attributes: positions(3, [["Mental", 1, 1], ["Physical", 2, 1], ["Social", 3, 1]]),
    skills: positions(1, [["Mental", 1, 1], ["Physical", 1, 2], ["Social", 1, 3]]),
    body: {
      ...positions(3, [
        ["skills", 1, 1], ["specificPowers", 2, 2], ["merits", 2, 3],
        ["lineSections", 2, 4], ["conditions", 2, 5], ["aspirations", 3, 9],
        ["obsessions", 2, 6], ["health", 3, 2], ["willpower", 3, 3],
        ["powerStat", 3, 4], ["fuel", 3, 5], ["stability", 3, 6],
        ["derived", 3, 7], ["experience", 3, 8],
      ]),
      columnClassNames: ["cod-main-skills sheet-skills-column", "cod-main-other sheet-center-column", "cod-main-core sheet-right-column"],
    },
  } satisfies MainSheetDesktopLayoutInput),
  // Aba Forms: comparação completa das formas e passivas de Body of the Wolf.
  // A comparação é um único slot; suas formas não são slots independentes.
  forms: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "forms", column: 1, order: 1 }] },
    }],
  },
  // Aba Details: Anchors (Blood/Bone) e a superfície composta de Gifts, Rites,
  // Fetishes/Talens e Totem.
  details: {
    sections: [{
      id: "content",
      order: 1,
      definition: {
        columns: 1,
        items: [
          { id: "anchors", column: 1, order: 1 },
          { id: "powers", column: 1, order: 2 },
        ],
      },
    }],
  },
  // Aba Combat: painel compartilhado com estatísticas, Tilts e inventário.
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
  lodge: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "directory", column: 1, order: 1 }] },
    }],
  },
} as const;
