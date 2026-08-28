export const ATTRIBUTES = {
  Mental: ["Inteligência", "Raciocínio", "Perseverança"],
  Físicos: ["Força", "Destreza", "Vigor"],
  Sociais: ["Presença", "Manipulação", "Autocontrole"],
} as const;

export const SKILLS = {
  Mentais: ["Erudição", "Computação", "Ofícios", "Investigação", "Medicina", "Ocultismo", "Política", "Ciência"],
  Físicas: ["Esportes", "Briga", "Condução", "Armas de Fogo", "Furto", "Armas Brancas", "Furtividade", "Sobrevivência"],
  Sociais: ["Empatia com Animais", "Empatia", "Expressão", "Intimidação", "Persuasão", "Socialização", "Manha", "Dissimulação"],
} as const;

export const CTL_SEEMINGS = {
  Beast: {
    translated: "Fera", favored: "Resistance", regalia: "Corcel",
    blessing: "Enquanto não estiver amedrontado — ou ao gastar um ponto de Glamour por três turnos — causa dano letal com ataques desarmados e recebe +3 em Iniciativa e Deslocamento.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando decisões apressadas ou descuidadas prejudicam outras pessoas.",
  },
  Darkling: {
    translated: "Trevoso", favored: "Finesse", regalia: "Espelho",
    blessing: "Ao gastar Força de Vontade — e também Glamour, se houver testemunhas — pode tocar o imaterial e tornar-se imaterial por três turnos.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando um segredo que conhece se revela falso.",
  },
  Elemental: {
    translated: "Elemental", favored: "Resistance", regalia: "Espada",
    blessing: "Quando cercado por seu elemento e com ao menos metade da Força de Vontade — ou ao gastar Glamour — pode agir através dele a até três metros de distância.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando é intimidado ou coagido a seguir um curso de ação.",
  },
  Fairest: {
    translated: "Belíssimo", favored: "Power", regalia: "Coroa",
    blessing: "Enquanto estiver em harmonia com seus aliados — ou ao gastar Glamour — pode gastar Força de Vontade em benefício de outro personagem.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando suas ações são responsáveis por ferir seus aliados.",
  },
  Ogre: {
    translated: "Ogro", favored: "Power", regalia: "Escudo",
    blessing: "Quando ataca em defesa de outra pessoa — ou ao gastar Glamour — impõe a Condição Derrotado por três turnos.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando alguém que não é seu inimigo se encolhe de medo diante dele.",
  },
  Wizened: {
    translated: "Mirrado", favored: "Finesse", regalia: "Joias",
    blessing: "Com as ferramentas adequadas — ou ao gastar Glamour — pode usar a ação Construir Equipamento para transformar um material em outro.",
    curse: "Arrisca dano de Lucidez igual à metade do Fado quando é pego desprevenido por uma surpresa desagradável.",
  },
} as const;
export const CTL_SEEMING_LABELS = Object.fromEntries(Object.entries(CTL_SEEMINGS).map(([key, value]) => [key, value.translated])) as Record<string, string>;

export const CTL_NEEDLES = ["Bon Vivant", "Mestre de Xadrez", "Comandante", "Compositor", "Conselheiro", "Audacioso", "Dínamo", "Protetor", "Provedor", "Erudito", "Contador de Histórias", "Professor", "Tradicionalista", "Visionário"];
export const CTL_THREADS = ["Aceitação", "Raiva", "Família", "Amizade", "Ódio", "Honra", "Alegria", "Amor", "Memória", "Vingança"];
export const CTL_COURTS = ["Sem Corte", "Primavera", "Verão", "Outono", "Inverno"];
export const REGALIA = ["Coroa", "Joias", "Espelho", "Escudo", "Corcel", "Espada", "Cálice", "Moeda", "Cetro", "Estrelas", "Espinho"];

export const MTA_PATHS = {
  Acanthus: { ruling: ["Tempo", "Destino"], inferior: "Forças" },
  Mastigos: { ruling: ["Espaço", "Mente"], inferior: "Matéria" },
  Moros: { ruling: ["Matéria", "Morte"], inferior: "Espírito" },
  Obrimos: { ruling: ["Forças", "Primórdio"], inferior: "Morte" },
  Thyrsus: { ruling: ["Vida", "Espírito"], inferior: "Mente" },
} as const;

export const MTA_ORDERS = {
  "Adamantine Arrow": ["Esportes", "Intimidação", "Medicina"],
  "Free Council": ["Ofícios", "Persuasão", "Ciência"],
  "Guardians of the Veil": ["Investigação", "Furtividade", "Dissimulação"],
  Mysterium: ["Investigação", "Ocultismo", "Sobrevivência"],
  "Silver Ladder": ["Expressão", "Persuasão", "Dissimulação"],
  "Seers of the Throne": ["Investigação", "Ocultismo", "Persuasão"],
  Nameless: [],
} as const;
export const MTA_ORDER_LABELS: Record<string, string> = {
  "Adamantine Arrow": "Seta Adamantina", "Free Council": "Conselho Livre",
  "Guardians of the Veil": "Guardiões do Véu", Mysterium: "Mysterium",
  "Silver Ladder": "Escada de Prata", "Seers of the Throne": "Videntes do Trono", Nameless: "Sem Ordem",
};

export const ARCANA = ["Morte", "Destino", "Forças", "Vida", "Matéria", "Mente", "Primórdio", "Espaço", "Espírito", "Tempo"];

export const SOURCE_CATALOG = [
  { id: "core-2ed", title: "Chronicles of Darkness", gameLine: "Core", edition: 2, type: "OFFICIAL", role: "BASE" },
  { id: "ctl-2ed", title: "Changeling the Lost", gameLine: "CtL", edition: 2, type: "OFFICIAL", role: "PRIMARY" },
  { id: "mta-2ed", title: "Mage the Awakening", gameLine: "MtA", edition: 2, type: "OFFICIAL", role: "PRIMARY" },
  { id: "ctl-kith-kin", title: "Kith and Kin", gameLine: "CtL", edition: 2, type: "OFFICIAL", role: "ADJACENT" },
  { id: "ctl-oak-ash-thorn", title: "Oak, Ash, and Thorn", gameLine: "CtL", edition: 2, type: "OFFICIAL", role: "ADJACENT" },
  { id: "ctl-hedge", title: "The Hedge", gameLine: "CtL", edition: 2, type: "OFFICIAL", role: "ADJACENT" },
  { id: "ctl-dark-eras", title: "Dark Eras Changeling", gameLine: "CtL", edition: 2, type: "OFFICIAL", role: "ADJACENT" },
  { id: "mta-signs", title: "Signs of Sorcery", gameLine: "MtA", edition: 2, type: "OFFICIAL", role: "ADJACENT" },
  { id: "mta-pentacle", title: "Tome of the Pentacle", gameLine: "MtA", edition: 2, type: "OFFICIAL", role: "ADJACENT" },
  { id: "nh-nameless", title: "Nameless and Accursed", gameLine: "MtA", edition: 2, type: "OFFICIAL", role: "ADJACENT" },
  { id: "h-beyond-hedge", title: "Beyond the Hedge", gameLine: "CtL", edition: null, type: "HOMEBREW", role: "ADJACENT" },
  { id: "h-courts", title: "Book of Courts", gameLine: "CtL", edition: null, type: "HOMEBREW", role: "ADJACENT" },
  { id: "h-seemings", title: "Book of Seemings", gameLine: "CtL", edition: null, type: "HOMEBREW", role: "ADJACENT" },
] as const;

export const SHARED_RULES = [
  {
    id: "creation-core-2ed", name: "Criação básica de personagem", gameLine: "Core", sourceId: "core-2ed", page: 24,
    data: { attributes: { base: 1, budgets: [5, 4, 3], max: 5 }, skills: { base: 0, budgets: [11, 7, 4], max: 5 }, specialties: 3, size: 5 },
  },
  {
    id: "creation-ctl-2ed", name: "Criação de Changeling", gameLine: "CtL", sourceId: "ctl-2ed", page: 89,
    data: { aspirations: 3, contracts: { common: 4, royal: 2, favoredCommonMinimum: 2 }, merits: 10, wyrd: { base: 1, extraDotMeritCost: 5 }, favoredAttributeDots: 1 },
  },
  {
    id: "creation-mta-2ed", name: "Criação de Mago", gameLine: "MtA", sourceId: "mta-2ed", page: 79,
    data: { aspirations: 3, arcana: { total: 6, maxAtThree: 1, rulingMinimumEach: 1, rulingTotalRange: [3, 5], inferiorAtCreation: 0 }, rotes: 3, praxisPerGnosis: 1, merits: 10, gnosis: { base: 1, extraDotMeritCost: 5 }, wisdom: 7, resistanceAttributeDots: 1 },
  },
] as const;
