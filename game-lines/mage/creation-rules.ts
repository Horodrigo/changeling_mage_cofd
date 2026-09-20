export const MTA_PATHS = {
  Acanthus: { ruling: ["Time", "Fate"], inferior: "Forces" },
  Mastigos: { ruling: ["Space", "Mind"], inferior: "Matter" },
  Moros: { ruling: ["Matter", "Death"], inferior: "Spirit" },
  Obrimos: { ruling: ["Forces", "Prime"], inferior: "Death" },
  Thyrsus: { ruling: ["Life", "Spirit"], inferior: "Mind" },
} as const;

export const MTA_ORDERS = {
  "Adamantine Arrow": ["Athletics", "Intimidation", "Medicine"],
  "Free Council": ["Crafts", "Persuasion", "Science"],
  "Guardians of the Veil": ["Investigation", "Stealth", "Subterfuge"],
  Mysterium: ["Investigation", "Occult", "Survival"],
  "Silver Ladder": ["Expression", "Persuasion", "Subterfuge"],
  "Seers of the Throne": ["Investigation", "Occult", "Persuasion"],
  Nameless: [],
} as const;
export const MTA_ORDER_LABELS: Record<string, string> = {
  "Adamantine Arrow": "Seta Adamantina", "Free Council": "Conselho Livre",
  "Guardians of the Veil": "Guardiões do Véu", Mysterium: "Mysterium",
  "Silver Ladder": "Escada de Prata", "Seers of the Throne": "Videntes do Trono", Nameless: "Sem Ordem",
};

export const mageOrderLabel = (order: string, locale: "pt-BR" | "en-US") =>
  locale === "pt-BR" ? MTA_ORDER_LABELS[order] ?? order : order;

export const MTA_ORDER_DESCRIPTIONS: Record<string, [string, string]> = {
  "Adamantine Arrow": ["Guerreiros místicos que aperfeiçoam a si mesmos através do conflito e defendem os Despertos.", "Mystic warriors who perfect themselves through conflict and defend the Awakened."],
  "Free Council": ["Magos modernos que buscam sabedoria na cultura humana, na democracia e na inovação.", "Modern mages who seek wisdom in human culture, democracy, and innovation."],
  "Guardians of the Veil": ["Espiões e inquisidores que protegem os Mistérios e ocultam a magia dos indignos.", "Spies and inquisitors who protect the Mysteries and conceal magic from the unworthy."],
  Mysterium: ["Eruditos e exploradores dedicados a preservar, estudar e compreender o conhecimento mágico.", "Scholars and explorers devoted to preserving, studying, and understanding magical knowledge."],
  "Silver Ladder": ["Líderes que procuram unir os Despertos e elevar toda a humanidade através da magia.", "Leaders who seek to unite the Awakened and elevate all humanity through magic."],
  "Seers of the Throne": ["Servos dos Exarcas que impõem as hierarquias do Trono sobre o mundo Caído.", "Servants of the Exarchs who impose the Throne's hierarchies upon the Fallen World."],
  Nameless: ["Uma Ordem sem nome reconhecido entre as grandes sociedades dos Despertos.", "An Order without a recognized name among the great societies of the Awakened."],
  Orderless: ["O mago não pertence a uma Ordem e não recebe seus benefícios iniciais.", "The mage belongs to no Order and receives no starting Order benefits."],
};

export const ARCANA = ["Death", "Fate", "Forces", "Life", "Matter", "Mind", "Prime", "Space", "Spirit", "Time"];
