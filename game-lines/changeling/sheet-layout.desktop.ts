import { createMainSheetLayout, type MainSheetDesktopLayoutInput } from "@/app/workspace/sheet-layout";

const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const changelingDesktopLayout = {
  main: createMainSheetLayout({
    identity: positions(3, [
      ["name", 1, 1], ["needle", 2, 1], ["seeming", 3, 1],
      ["player", 1, 2], ["thread", 2, 2], ["kith", 3, 2],
      ["chronicle", 1, 3], ["concept", 2, 3], ["court", 3, 3],
    ]),
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
    },
  } satisfies MainSheetDesktopLayoutInput),
  // Aba Powers: seção 1 contém Contracts. Na seção 2, otherTraits reúne o Lore
  // de Seeming/Kith e Goblin Debt; os demais slots mostram Court Lore e Merits
  // expandidos. Oaths pertence exclusivamente à aba Notes.
  poderes: {
    sections: [
      { id: "contracts", order: 1, definition: { columns: 1, items: [{ id: "contracts", column: 1, order: 1 }] } },
      {
        id: "details",
        order: 2,
        definition: {
          ...positions(2, [["otherTraits", 1, 1], ["courtLore", 2, 1], ["expandedMerits", 2, 2]]),
          sectionClassName: "powers-sheet-grid",
        },
      },
    ],
  },
  // Aba Entitlement: página completa de Entitlement, incluindo seleção,
  // requisitos, benefícios e poderes associados.
  entitlement: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "entitlement", column: 1, order: 1 }] },
    }],
  },
  // Aba Combat: estatísticas, resumo de combate, Tilts e inventário de combate.
  combate: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "combat", column: 1, order: 1 }] },
    }],
  },
  // Aba Notes: retrato no topo; abaixo, oaths e notas livres do personagem.
  notas: {
    sections: [
      { id: "portrait", order: 1, definition: { columns: 1, items: [{ id: "portrait", column: 1, order: 1 }] } },
      {
        id: "content",
        order: 2,
        definition: {
          columns: 2,
          items: [
            { id: "oaths", column: 1, order: 1 },
            { id: "notes", column: 2, order: 1 },
          ],
        },
      },
    ],
  },
  // Aba Companheiros: companheiros Changeling e companheiros genéricos/Core
  // são apresentados juntos pelo mesmo slot.
  companheiros: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "companions", column: 1, order: 1 }] },
    }],
  },
} as const;
