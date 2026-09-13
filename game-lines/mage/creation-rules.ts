export const MTA_PATHS = {
  Acanthus: { ruling: ["Tempo", "Destino"], inferior: "Forças" },
  Mastigos: { ruling: ["Espaço", "Mente"], inferior: "Matéria" },
  Moros: { ruling: ["Matéria", "Morte"], inferior: "Espírito" },
  Obrimos: { ruling: ["Forças", "Primórdio"], inferior: "Morte" },
  Thyrsus: { ruling: ["Vida", "Espírito"], inferior: "Mente" },
} as const;

export const MTA_ORDERS = {
  "Adamantine Arrow": ["Atletismo", "Intimidação", "Medicina"],
  "Free Council": ["Ofícios", "Persuasão", "Ciência"],
  "Guardians of the Veil": ["Investigação", "Furtividade", "Subterfúgio"],
  Mysterium: ["Investigação", "Ocultismo", "Sobrevivência"],
  "Silver Ladder": ["Expressão", "Persuasão", "Subterfúgio"],
  "Seers of the Throne": ["Investigação", "Ocultismo", "Persuasão"],
  Nameless: [],
} as const;
export const MTA_ORDER_LABELS: Record<string, string> = {
  "Adamantine Arrow": "Seta Adamantina", "Free Council": "Conselho Livre",
  "Guardians of the Veil": "Guardiões do Véu", Mysterium: "Mysterium",
  "Silver Ladder": "Escada de Prata", "Seers of the Throne": "Videntes do Trono", Nameless: "Sem Ordem",
};

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

export const ARCANA = ["Morte", "Destino", "Forças", "Vida", "Matéria", "Mente", "Primórdio", "Espaço", "Espírito", "Tempo"];
