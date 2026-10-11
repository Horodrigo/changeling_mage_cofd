import { createMainSheetLayout, type MainSheetDesktopLayoutInput } from "@/app/workspace/sheet-layout";

const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const mageDesktopLayout = {
  main: createMainSheetLayout({
    identity: positions(3, [
      ["shadowName", 1, 1], ["virtue", 2, 1], ["path", 3, 1],
      ["player", 1, 2], ["vice", 2, 2], ["order", 3, 2],
      ["chronicle", 1, 3], ["concept", 2, 3], ["legacy", 3, 3],
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
  // Aba Magic: duas colunas. A primeira reúne feitiços ativos, Attainments e
  // Praxes; a segunda reúne Rotes, ferramentas mágicas, Nimbus e anotações.
  magia: {
    sections: [{
      id: "magic-details",
      order: 1,
      definition: {
        ...positions(2, [
          ["activeSpells", 1, 1], ["attainments", 1, 2], ["praxes", 1, 3],
          ["rotes", 2, 1], ["magicalTools", 2, 2], ["nimbus", 2, 3],
        ]),
        columnClassNames: ["mage-page-left", "mage-page-main"],
        sectionClassName: "mage-page-355-grid",
      },
    }],
  },
  // Aba Legacy: experiência completa de Legacy, com entrada, progressão e
  // Attainments. O componente atual é uma unidade indivisível.
  legacy: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "legacy", column: 1, order: 1 }] },
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
  // Aba Notes: retrato no topo, seguido das notas livres do personagem.
  notes: {
    sections: [
      { id: "portrait", order: 1, definition: { columns: 1, items: [{ id: "portrait", column: 1, order: 1 }] } },
      { id: "content", order: 2, definition: { columns: 1, items: [{ id: "notes", column: 1, order: 1 }] } },
    ],
  },
  // Aba Companions: páginas de companheiros Mage e companheiros genéricos/Core,
  // em sequência na mesma coluna.
  companheiros: {
    sections: [{
      id: "content",
      order: 1,
      definition: {
        columns: 1,
        items: [
          { id: "mageCompanions", column: 1, order: 1 },
          { id: "coreCompanions", column: 1, order: 2 },
        ],
      },
    }],
  },
} as const;
