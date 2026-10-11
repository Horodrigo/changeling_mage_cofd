import { createMainSheetLayout, type MainSheetDesktopLayoutInput } from "@/app/workspace/sheet-layout";

const positions = (columns: number, entries: readonly [string, number, number][]) => ({
  columns,
  items: entries.map(([id, column, order]) => ({ id, column, order })),
});

export const vampireDesktopLayout = {
  main: createMainSheetLayout({
    identity: positions(3, [
      ["name", 1, 1], ["mask", 2, 1], ["clan", 3, 1],
      ["player", 1, 2], ["dirge", 2, 2], ["covenant", 3, 2],
      ["chronicle", 1, 3], ["concept", 2, 3], ["bloodline", 3, 3],
    ]),
    attributes: positions(3, [["Mental", 1, 1], ["Physical", 2, 1], ["Social", 3, 1]]),
    skills: positions(1, [["Mental", 1, 1], ["Physical", 1, 2], ["Social", 1, 3]]),
    body: {
      ...positions(3, [
        ["skills", 1, 1], ["conditions", 1, 2], ["specificPowers", 2, 1],
        ["merits", 2, 2], ["lineSections", 2, 3], ["obsessions", 2, 4],
        ["aspirations", 3, 8], ["health", 3, 1], ["willpower", 3, 2],
        ["powerStat", 3, 3], ["fuel", 3, 4], ["stability", 3, 5],
        ["derived", 3, 6], ["experience", 3, 7],
      ]),
      columnClassNames: ["cod-main-skills sheet-skills-column", "cod-main-other sheet-center-column", "cod-main-core sheet-right-column"],
    },
  } satisfies MainSheetDesktopLayoutInput),
  // Aba Details: Merits expandidos e a página de poderes do personagem.
  details: {
    sections: [{
      id: "content",
      order: 1,
      definition: {
        columns: 1,
        items: [
          { id: "expandedMerits", column: 1, order: 1 },
          { id: "powers", column: 1, order: 2 },
        ],
      },
    }],
  },
  // Aba Powers: recurso de Blood Potency, Disciplines, escolhas Protean,
  // Disciplines de rituais, poderes adquiridos e Tricks.
  powers: {
    sections: [{
      id: "content",
      order: 1,
      definition: {
        columns: 1,
        items: [
          { id: "bloodPotencyResource", column: 1, order: 1 },
          { id: "disciplines", column: 1, order: 2 },
          { id: "proteanChoices", column: 1, order: 3 },
          { id: "ritualDisciplines", column: 1, order: 4 },
          { id: "purchasedPowers", column: 1, order: 5 },
          { id: "tricks", column: 1, order: 6 },
        ],
      },
    }],
  },
  // Aba Bloodlines: página de Bloodline, suas opções, regras e progressão.
  bloodlines: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "bloodlines", column: 1, order: 1 }] },
    }],
  },
  // Aba Combat: trilhas de Health/Willpower, painel de combate e Frenzy.
  combat: {
    sections: [{
      id: "content",
      order: 1,
      definition: {
        columns: 1,
        items: [
          { id: "tracks", column: 1, order: 1 },
          { id: "combat", column: 1, order: 2 },
          { id: "frenzy", column: 1, order: 3 },
        ],
      },
    }],
  },
  // Aba Companions: inventário/página de companheiros Vampire.
  companions: {
    sections: [{
      id: "content",
      order: 1,
      definition: { columns: 1, items: [{ id: "companions", column: 1, order: 1 }] },
    }],
  },
  // Aba Notes: Blood Bonds seguidos das anotações livres.
  notes: {
    sections: [{
      id: "content",
      order: 1,
      definition: {
        columns: 1,
        items: [
          { id: "bloodBonds", column: 1, order: 1 },
          { id: "notes", column: 1, order: 2 },
        ],
      },
    }],
  },
} as const;
