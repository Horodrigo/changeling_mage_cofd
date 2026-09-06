export const SKILL_SPECIALTY_SUGGESTIONS:Record<string,string[]>={
  "Erudição":["Antropologia","Arte","História","Direito","Linguística","Religião","Pesquisa"],
  "Computação":["Inteligência Artificial","Recuperação de Dados","Segurança Digital","Gráficos","Hacking","Internet","Programação","Design de Interface"],
  "Ofícios":["Automóveis","Aeronaves","Carpintaria","Improvisação","Pintura","Forja","Escultura","Costura"],
  "Investigação":["Artefatos","Autópsias","Linguagem Corporal","Cenas de Crime","Criptografia","Sonhos","Contabilidade Forense","Enigmas","Experimentos Científicos"],
  "Medicina":["Cardiologia","Atendimento de Emergência","Primeiros Socorros","Patologia","Farmacologia","Fisioterapia","Cirurgia"],
  "Ocultismo":["Crenças Culturais","Fantasmas","Folclore","Magia","Monstros","Fenômenos Psíquicos","Superstições","Lendas Urbanas","Bruxaria"],
  "Política":["Suborno","Burocracia","Eleições","Política Local","Política Nacional","Escândalos","Partido Político"],
  "Ciência":["Biologia","Química","Genética","Geologia","Metalurgia","Óptica","Física de Partículas"],
  "Atletismo":["Acrobacia","Basquete","Escalada","Caiaque","Corrida de Longa Distância","Corrida de Velocidade","Natação","Arremesso"],
  "Briga":["Bloqueio","Boxe","Golpes Sujos","Agarramento","Kung Fu","Muay Thai","Projeções"],
  "Condução":["Evasão","Carros de Alto Desempenho","Motocicletas","Fora de Estrada","Pilotagem","Perseguição","Corrida","Manobras"],
  "Armas de Fogo":["Fogo Automático","Arco","Saque Rápido","Pistolas","Rifles","Espingardas","Tiro de Precisão","Tiro Acrobático"],
  "Furto":["Sistemas de Alarme","Arrombamento","Ocultar Bens Roubados","Abrir Fechaduras","Bater Carteira","Cofres","Prestidigitação"],
  "Furtividade":["Camuflagem","Multidões","Esconder-se","Mover-se no Escuro","Mover-se Silenciosamente","Seguir Alvos","Vigilância"],
  "Sobrevivência":["Coleta","Caça","Navegação","Meteorologia","Abrigos"],
  "Armas Brancas":["Porretes","Duelos","Armas Improvisadas","Facas","Espadas"],
  "Empatia com Animais":["Necessidades Animais","Cães","Animais Exóticos","Cavalos","Treinamento","Ataque Iminente","Animais Selvagens"],
  "Empatia":["Sentimentos Ocultos","Acalmar","Emoções","Mentiras","Motivações","Personalidades"],
  "Expressão":["Dança Clássica","Composição","Drama","Reportagens","Jornalismo","Instrumento Musical","Discursos"],
  "Intimidação":["Ameaças Diretas","Interrogatório","Olhar Assassino","Ameaças Físicas","Tortura","Ameaças Veladas"],
  "Persuasão":["Lábia","Inspirar","Argumentos de Venda","Discursos Motivacionais","Sedução","Sermões"],
  "Socialização":["Bares","Bailes de Gala","Festas Universitárias","Eventos Formais","Arrecadações Políticas","Clubes Privados"],
  "Manha":["Mercado Negro","Gangues","Navegação Urbana","Rumores","Operações Infiltradas"],
  "Subterfúgio":["Golpes","Detectar Mentiras","Significados Ocultos","Esconder Emoções","Mentir","Desorientação"]
};

const ENGLISH_SPECIALTIES:Record<string,string[]>={
  Academics:["Anthropology","Art","History","Law","Linguistics","Religion","Research"],
  Computer:["Artificial Intelligence","Data Retrieval","Digital Security","Graphics","Hacking","Internet","Programming","User Interface Design"],
  Crafts:["Automotive","Aircraft","Carpentry","Jury-Rigging","Painting","Smithing","Sculpting","Sewing"],
  Investigation:["Artifacts","Autopsies","Body Language","Crime Scenes","Cryptography","Dreams","Forensic Accounting","Riddles","Scientific Experiments"],
  Medicine:["Cardiology","Emergency Care","First Aid","Pathology","Pharmacology","Physical Therapy","Surgery"],
  Occult:["Cultural Beliefs","Ghosts","Folklore","Magic","Monsters","Psychic Phenomena","Superstitions","Urban Legends","Witchcraft"],
  Politics:["Bribery","Bureaucracy","Elections","Local Politics","National Politics","Scandals","Political Party"],
  Science:["Biology","Chemistry","Genetics","Geology","Metallurgy","Optics","Particle Physics"],
  Athletics:["Acrobatics","Basketball","Climbing","Kayaking","Long-Distance Running","Sprinting","Swimming","Throwing"],
  Brawl:["Blocking","Boxing","Dirty Fighting","Grappling","Kung Fu","Muay Thai","Throws"],
  Drive:["Evasion","High-Performance Cars","Motorcycles","Off-Road","Piloting","Pursuit","Racing","Stunts"],
  Firearms:["Automatic Fire","Bow","Fast Draw","Handguns","Rifles","Shotguns","Sniping","Trick Shooting"],
  Larceny:["Alarm Systems","Breaking and Entering","Concealing Stolen Goods","Lockpicking","Pickpocketing","Safes","Sleight of Hand"],
  Stealth:["Camouflage","Crowds","Hiding","Moving in Darkness","Moving Silently","Shadowing","Surveillance"],
  Survival:["Foraging","Hunting","Navigation","Weather","Shelter"],
  Weaponry:["Clubs","Dueling","Improvised Weapons","Knives","Swords"],
  "Animal Ken":["Animal Needs","Dogs","Exotic Animals","Horses","Training","Imminent Attack","Wild Animals"],
  Empathy:["Hidden Feelings","Calming","Emotions","Lies","Motives","Personalities"],
  Expression:["Classical Dance","Composition","Drama","Reporting","Journalism","Musical Instrument","Speeches"],
  Intimidation:["Direct Threats","Interrogation","Stare Down","Physical Threats","Torture","Veiled Threats"],
  Persuasion:["Fast-Talking","Inspiring","Sales Pitches","Motivational Speeches","Seduction","Sermons"],
  Socialize:["Bars","Galas","College Parties","Formal Events","Political Fundraisers","Private Clubs"],
  Streetwise:["Black Market","Gangs","Urban Navigation","Rumors","Undercover Operations"],
  Subterfuge:["Cons","Detecting Lies","Hidden Meanings","Hiding Emotions","Lying","Misdirection"],
};

export function skillSpecialtySuggestions(skill:string,locale:"pt-BR"|"en-US") {
  if(locale==="pt-BR") return SKILL_SPECIALTY_SUGGESTIONS[skill] ?? [];
  const englishSkill=({"Erudição":"Academics","Computação":"Computer","Ofícios":"Crafts","Investigação":"Investigation","Medicina":"Medicine","Ocultismo":"Occult","Política":"Politics","Ciência":"Science","Atletismo":"Athletics","Briga":"Brawl","Condução":"Drive","Armas de Fogo":"Firearms","Furto":"Larceny","Furtividade":"Stealth","Sobrevivência":"Survival","Armas Brancas":"Weaponry","Empatia com Animais":"Animal Ken","Empatia":"Empathy","Expressão":"Expression","Intimidação":"Intimidation","Persuasão":"Persuasion","Socialização":"Socialize","Manha":"Streetwise","Subterfúgio":"Subterfuge"} as Record<string,string>)[skill] ?? skill;
  return ENGLISH_SPECIALTIES[englishSkill] ?? [];
}
