import type { Locale } from "./i18n";

const ENGLISH_TERMS: Record<string,string> = {
  "Mental":"Mental", "Mentais":"Mental", "Físicos":"Physical", "Físicas":"Physical", "Sociais":"Social",
  "Inteligência":"Intelligence", "Raciocínio":"Wits", "Perseverança":"Resolve",
  "Força":"Strength", "Destreza":"Dexterity", "Vigor":"Stamina",
  "Presença":"Presence", "Manipulação":"Manipulation", "Compostura":"Composure",
  "Erudição":"Academics", "Computação":"Computer", "Ofícios":"Crafts",
  "Investigação":"Investigation", "Medicina":"Medicine", "Ocultismo":"Occult",
  "Política":"Politics", "Ciência":"Science", "Atletismo":"Athletics", "Briga":"Brawl",
  "Condução":"Drive", "Armas de Fogo":"Firearms", "Furto":"Larceny",
  "Armas Brancas":"Weaponry", "Furtividade":"Stealth", "Sobrevivência":"Survival",
  "Empatia com Animais":"Animal Ken", "Empatia":"Empathy", "Expressão":"Expression",
  "Intimidação":"Intimidation", "Persuasão":"Persuasion", "Socialização":"Socialize",
  "Manha":"Streetwise", "Subterfúgio":"Subterfuge",
  "Morte":"Death", "Destino":"Fate", "Forças":"Forces", "Vida":"Life",
  "Matéria":"Matter", "Mente":"Mind", "Primórdio":"Prime", "Espaço":"Space",
  "Espírito":"Spirit", "Tempo":"Time",
  "Fera":"Beast", "Trevoso":"Darkling", "Elemental":"Elemental",
  "Belíssimo":"Fairest", "Ogro":"Ogre", "Mirrado":"Wizened",
  "Coroa":"Crown", "Joias":"Jewels", "Espelho":"Mirror", "Escudo":"Shield",
  "Corcel":"Steed", "Espada":"Sword", "Cálice":"Chalice", "Moeda":"Coin",
  "Cetro":"Scepter", "Estrelas":"Stars", "Espinho":"Thorn", "Garganta":"Maw",
  "Sem Corte":"Courtless", "Primavera":"Spring", "Verão":"Summer",
  "Outono":"Autumn", "Inverno":"Winter",
  "Seta Adamantina":"Adamantine Arrow", "Conselho Livre":"Free Council",
  "Guardiões do Véu":"Guardians of the Veil", "Escada de Prata":"Silver Ladder",
  "Videntes do Trono":"Seers of the Throne", "Sem Ordem":"Nameless",
  "Fado":"Wyrd", "Gnose":"Gnosis", "Lucidez":"Clarity", "Sabedoria":"Wisdom",
  "Força de Vontade":"Willpower", "Sebe":"Hedge", "Feição":"Seeming",
  "Frátria":"Kith", "Regalia":"Regalia", "Corte":"Court", "Manto":"Mantle",
  "Nenhuma opção disponível":"No options available",
  "Todas":"All", "Todos":"All",
};

const PORTUGUESE_TERMS: Record<string,string> = {
  Crown:"Coroa", Jewels:"Joias", Mirror:"Espelho", Shield:"Escudo",
  Steed:"Corcel", Sword:"Espada", Chalice:"Cálice", Coin:"Moeda",
  Scepter:"Cetro", Stars:"Estrelas", Thorn:"Espinho", Maw:"Garganta",
  Courtless:"Sem Corte",
};

/** Localizes presentation only. Stored character values remain unchanged. */
export function systemTerm(value:string,locale:Locale){return locale==="en-US"?(ENGLISH_TERMS[value]??value):(PORTUGUESE_TERMS[value]??value)}
export function systemTerms(values:readonly string[],locale:Locale){return values.map(value=>systemTerm(value,locale))}
