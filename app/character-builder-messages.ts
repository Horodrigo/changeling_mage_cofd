import type { Locale } from "@/lib/i18n";

const english: Record<string, string> = {
  Mentais: "Mental", Físicos: "Physical", Sociais: "Social",
  Primária: "Primary", Secundária: "Secondary", Terciária: "Tertiary",
  Inteligência: "Intelligence", Raciocínio: "Wits", Perseverança: "Resolve",
  Força: "Strength", Destreza: "Dexterity", Vigor: "Stamina",
  Presença: "Presence", Manipulação: "Manipulation", Compostura: "Composure",
  Erudição: "Academics", Computação: "Computer", Ofícios: "Crafts",
  Investigação: "Investigation", Medicina: "Medicine", Ocultismo: "Occult",
  Política: "Politics", Ciência: "Science", Atletismo: "Athletics", Briga: "Brawl",
  Condução: "Drive", "Armas de Fogo": "Firearms", Furto: "Larceny",
  "Armas Brancas": "Weaponry", Furtividade: "Stealth", Sobrevivência: "Survival",
  "Empatia com Animais": "Animal Ken", Empatia: "Empathy", Expressão: "Expression",
  Intimidação: "Intimidation", Persuasão: "Persuasion", Socialização: "Socialize",
  Manha: "Streetwise", Subterfúgio: "Subterfuge",
  Morte: "Death", Destino: "Fate", Forças: "Forces", Vida: "Life", Matéria: "Matter",
  Mente: "Mind", Primórdio: "Prime", Espaço: "Space", Espírito: "Spirit", Tempo: "Time",
  Potência: "Potency", Duração: "Duration", Instantânea: "Instant", Reflexiva: "Reflexive",
  "Ação prolongada": "Extended action", Comum: "Common", Real: "Royal",
  Nenhum: "None", Nenhuma: "None", Selecione: "Select",
};

export function builderText(locale: Locale, text: string | undefined) {
  if (!text || locale === "pt-BR") return text ?? "";
  return english[text] ?? text;
}
