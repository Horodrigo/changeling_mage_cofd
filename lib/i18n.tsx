"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

export type Locale = "pt-BR" | "en-US";
const STORAGE_KEY = "arquivo-das-trevas:locale:v1";

export const messages = {
  "pt-BR": {
    common: { close: "Fechar", cancel: "Cancelar", save: "Salvar" },
    workspace: {
      charactersOfTheDarkness: "Characters of the Darkness", chroniclesOfDarkness: "Chronicles of Darkness", home: "Início", characters: "Personagens", mainNavigation: "Navegação principal", language: "Idioma", portuguese: "Português", english: "Inglês", sheetActions: "Importar/Exportar", importJson: "Importar JSON", saveJson: "Exportar JSON", closeNotice: "Fechar aviso",
      storageReadFailed: "Não foi possível ler o armazenamento local deste navegador.", characterSaved: "Ficha salva localmente neste navegador. Exporte o JSON para manter uma cópia independente.", characterDeleted: "“{name}” foi excluído deste navegador.", unsupportedSchema: "Versão de schema de personagem não suportada.", invalidCharacterJson: "O JSON não representa uma ficha CtL, MtA ou VtR atual válida.", characterImported: "“{name}” foi importado para este navegador.", invalidJson: "JSON inválido.",
      languageCurrent: "Idioma: {language}", printSheet: "Imprimir ficha", print: "Imprimir", sheetZoom: "Zoom da ficha", zoomOut: "Diminuir ficha", zoomIn: "Aumentar ficha", resetSize: "Restaurar tamanho", resetZoom: "Zoom da ficha: {percent}%. Restaurar tamanho.", zoomPercent: "{percent}%", edit: "Editar",
      characterCatalog: "Catálogo de Fichas", whoWillYouBe: "Quem você será desta vez?", seeCharacters: "Ver personagens", newCharacter: "Novo personagem", charactersByLine: "Personagens por linha", lineCount: "{count} {line}", continue: "CONTINUAR", recentCharacters: "Personagens recentes", recentCharactersDescription: "Acesse rapidamente as fichas usadas por último.", viewAll: "Ver todos", beginChronicle: "Comece uma nova crônica", beginChronicleDescription: "Crie seu primeiro personagem para começar a crônica.", yourCharacters: "Suas fichas", yourCharactersDescription: "Abra uma ficha para jogar, atualizar características ou exportar uma cópia.", createCharacter: "Criar personagem", loadingCharacters: "Carregando personagens…", noCharacters: "Nenhum personagem criado", noCharactersDescription: "Crie um Changeling, Mago ou Vampiro para começar.", unsupportedCharacter: "Ficha incompatível", noConcept: "Conceito não informado", unsupportedCharacterTitle: "Esta ficha usa um formato não suportado e não pode ser aberta.", unsupportedCharacterDescription: "Formato não suportado — exclua sem abrir.", deleteCharacter: "Excluir ficha", deleteCharacterNamed: "Excluir {name}", loading: "Carregando…",
      sharedLibrary: "BANCO COMPARTILHADO", activeRules: "Regras ativas para todos", activeRulesDescription: "Não há fila de aprovação. Ajustes posteriores substituem a versão compartilhada.", active: "ATIVAS", source: "Fonte", sourceDetail: "Fonte: {source} · {status}", page: "p. {page}", createSheet: "Criar ficha", unknownLine: "?", structuredRuleSummary: "{count} blocos mecânicos estruturados e aplicados pelo criador de fichas.", sharedRuleActive: "Regra compartilhada ativa.",
    },
    sheet: { clan: "Clã", mask: "Máscara", dirge: "Dirge", bloodline: "Linhagem", covenant: "Covenant", otherPowers: "Outros Poderes" },
    combat: {
      tilts: "Inclinações", personal: "Pessoal", environmental: "Ambiental", add: "Adicionar", remove: "Remover", removeNamed: "Remover {name}", noTilts: "Nenhuma Inclinação selecionada.", addTilt: "Adicionar Inclinação", combatTilts: "Inclinações de Combate", tiltDescription: "Selecione efeitos pessoais ou ambientais ativos na cena.", searchTilts: "Buscar Inclinação", all: "Todas", effectLabel: "Efeito:", causingTiltLabel: "Causando a Inclinação:", endingTiltLabel: "Encerrando a Inclinação:", done: "Concluir", tiltMetadata: "{category} · {source} · p. {page}",
      otherTraits: "Outras Características", combatSummary: "Resumo de Combate", defenseSpeedNote: "Os valores de Defesa e Deslocamento já incluem a armadura vestida. A penalidade de Iniciativa aparece em cada arma equipada.", attacks: "Ataques", attacksDescription: "Desarmado: Força + Briga − Defesa. Corpo a corpo: Força + Armas Brancas − Defesa. Distância: Destreza + Armas de Fogo. Arremesso: Destreza + Atletismo − Defesa.", damageDefense: "Dano e Defesa", damageDefenseDescription: "Some os sucessos ao dano da arma. Defesa diminui após cada ataque próximo recebido no turno; armas de fogo normalmente ignoram Defesa.", initiativeDodge: "Iniciativa e Esquiva", initiativeDodgeDescription: "Iniciativa é 1d10 + modificador, reduzida pela arma empunhada. Esquivar usa o dobro da Defesa como parada disputada.", armor: "Armadura", armorDescription: "Proteção geral reduz ataques comuns; proteção balística reduz armas de fogo. Penalidades da armadura já aparecem nos valores acima.", weapons: "Armas", equipment: "Equipamentos", vehicles: "Veículos", noArmor: "Sem armadura", selectWeapons: "Selecionar Armas", selectEquipment: "Selecionar Equipamentos", selectVehicles: "Selecionar Veículos", damage: "Dano", initiative: "Iniciativa", strength: "Força", size: "Tamanho", range: "Alcance", capacity: "Carga", bonus: "Bônus", durability: "Durabilidade", structure: "Estrutura", availability: "Disponibilidade", modifier: "Modificador", speed: "Deslocamento", noSpecialProperty: "Sem propriedade especial.", armorSummary: "Armadura {general}/{ballistic} · Defesa {defense} · Deslocamento {speed} · {coverage}", weaponDetails: "{kind} · Dano {damage} · Iniciativa {initiative} · Força {strength} · Tamanho {size}", weaponDetailsRange: "{kind} · Dano {damage} · Iniciativa {initiative} · Força {strength} · Tamanho {size} · Alcance {range}", weaponDetailsCapacity: "{kind} · Dano {damage} · Iniciativa {initiative} · Força {strength} · Tamanho {size} · Carga {capacity}", weaponDetailsRangeCapacity: "{kind} · Dano {damage} · Iniciativa {initiative} · Força {strength} · Tamanho {size} · Alcance {range} · Carga {capacity}", equipmentDetails: "{category} · Bônus {bonus} · Durabilidade {durability} · Tamanho {size} · Estrutura {structure} · Disponibilidade {availability}", vehicleDetails: "Modificador {modifier} · Tamanho {size} · Durabilidade {durability} · Estrutura {structure} · Deslocamento {speed}", vehicleModifierNote: "O modificador se aplica às paradas de Destreza + Condução. Acima da Velocidade segura, ele é aplicado novamente.", accelerationDetails: "Aceleração {acceleration}.", normalAcceleration: "Aceleração normal.", combatSource: "Regras e equipamentos: Chronicles of Darkness · pp. 86–103 e 268–276.",
    },
    conditions: {
      remove: "Remover", removeNamed: "Remover {name}", removeBondedTitle: "Remover Bonded?", removeBondedDescription: "A Condição e o animal vinculado serão removidos da ficha e da aba Companions.", removeBondedAction: "Remover Bonded", effectLabel: "Efeito:", resolutionLabel: "Resolução:", listedSourceResolution: "Conforme a fonte indicada.", beatLabel: "Beat:", noConditions: "Nenhuma Condição selecionada.", selectCondition: "Selecionar Condição", selectDescription: "Escolha uma Condição e marque-a como Persistente quando necessário.", search: "Buscar por nome, efeito ou fonte", all: "Todas", bondedAnimal: "Animal vinculado", persistent: "Persistente", add: "Adicionar", addAnother: "Adicionar outro", noMatches: "Nenhuma Condição encontrada.", done: "Concluir", sourcePage: "{source} · p. {page}", originalSourcePage: "{original} · {source} · p. {page}",
    },
    builder: { eligibility: { requiredPoints: "Distribua {required} pontos." } },
  },
  "en-US": {
    common: { close: "Close", cancel: "Cancel", save: "Save" },
    workspace: {
      charactersOfTheDarkness: "Characters of the Darkness", chroniclesOfDarkness: "Chronicles of Darkness", home: "Home", characters: "Characters", mainNavigation: "Main navigation", language: "Language", portuguese: "Portuguese", english: "English", sheetActions: "Import/Export", importJson: "Import JSON", saveJson: "Export JSON", closeNotice: "Close notice",
      storageReadFailed: "The local storage for this browser could not be read.", characterSaved: "Character saved locally in this browser. Export the JSON to keep an independent copy.", characterDeleted: "“{name}” was deleted from this browser.", unsupportedSchema: "Unsupported character schema version.", invalidCharacterJson: "The JSON is not a valid current CtL, MtA, or VtR character sheet.", characterImported: "“{name}” was imported into this browser.", invalidJson: "Invalid JSON.",
      languageCurrent: "Language: {language}", printSheet: "Print character sheet", print: "Print", sheetZoom: "Character sheet zoom", zoomOut: "Zoom out", zoomIn: "Zoom in", resetSize: "Reset size", resetZoom: "Character sheet zoom: {percent}%. Reset size.", zoomPercent: "{percent}%", edit: "Edit",
      characterCatalog: "Character Catalog", whoWillYouBe: "Who will you be this time?", seeCharacters: "See Characters", newCharacter: "New Character", charactersByLine: "Characters by game line", lineCount: "{count} {line}", continue: "CONTINUE", recentCharacters: "Recent characters", recentCharactersDescription: "Quickly open your most recently used characters.", viewAll: "View all", beginChronicle: "Begin a new chronicle", beginChronicleDescription: "Create your first character to begin the chronicle.", yourCharacters: "Your characters", yourCharactersDescription: "Open a character to play, update traits, or export a copy.", createCharacter: "Create Character", loadingCharacters: "Loading characters…", noCharacters: "No characters created", noCharactersDescription: "Create a Changeling, Mage, or Vampire to get started.", unsupportedCharacter: "Unsupported character", noConcept: "No concept provided", unsupportedCharacterTitle: "This character uses an unsupported format and cannot be opened.", unsupportedCharacterDescription: "Unsupported format — delete without opening.", deleteCharacter: "Delete character", deleteCharacterNamed: "Delete {name}", loading: "Loading…",
      sharedLibrary: "SHARED LIBRARY", activeRules: "Rules active for everyone", activeRulesDescription: "There is no approval queue. Later edits replace the shared version.", active: "ACTIVE", source: "Source", sourceDetail: "Source: {source} · {status}", page: "p. {page}", createSheet: "Create character", unknownLine: "?", structuredRuleSummary: "{count} structured mechanical blocks applied by the character builder.", sharedRuleActive: "Shared rule active.",
    },
    sheet: { clan: "Clan", mask: "Mask", dirge: "Dirge", bloodline: "Bloodline", covenant: "Covenant", otherPowers: "Other Powers" },
    combat: {
      tilts: "Tilts", personal: "Personal", environmental: "Environmental", add: "Add", remove: "Remove", removeNamed: "Remove {name}", noTilts: "No Tilts selected.", addTilt: "Add Tilt", combatTilts: "Combat Tilts", tiltDescription: "Select Personal or Environmental effects active in the scene.", searchTilts: "Search Tilts", all: "All", effectLabel: "Effect:", causingTiltLabel: "Causing the Tilt:", endingTiltLabel: "Ending the Tilt:", done: "Done", tiltMetadata: "{category} · {source} · p. {page}",
      otherTraits: "Other Traits", combatSummary: "Combat Summary", defenseSpeedNote: "Defense and Speed already include worn armor. Each equipped weapon shows its Initiative penalty.", attacks: "Attacks", attacksDescription: "Unarmed: Strength + Brawl − Defense. Melee: Strength + Weaponry − Defense. Ranged: Dexterity + Firearms. Thrown: Dexterity + Athletics − Defense.", damageDefense: "Damage and Defense", damageDefenseDescription: "Add successes to the weapon's damage. Defense decreases after each close attack received in the turn; firearms normally ignore Defense.", initiativeDodge: "Initiative and Dodge", initiativeDodgeDescription: "Initiative is 1d10 + modifier, reduced by the wielded weapon. Dodge uses twice Defense as a contested pool.", armor: "Armor", armorDescription: "General armor reduces ordinary attacks; ballistic armor reduces firearm attacks. Armor penalties are already included above.", weapons: "Weapons", equipment: "Equipment", vehicles: "Vehicles", noArmor: "No armor", selectWeapons: "Select Weapons", selectEquipment: "Select Equipment", selectVehicles: "Select Vehicles", damage: "Damage", initiative: "Initiative", strength: "Strength", size: "Size", range: "Range", capacity: "Capacity", bonus: "Bonus", durability: "Durability", structure: "Structure", availability: "Availability", modifier: "Modifier", speed: "Speed", noSpecialProperty: "No special property.", armorSummary: "Armor {general}/{ballistic} · Defense {defense} · Speed {speed} · {coverage}", weaponDetails: "{kind} · Damage {damage} · Initiative {initiative} · Strength {strength} · Size {size}", weaponDetailsRange: "{kind} · Damage {damage} · Initiative {initiative} · Strength {strength} · Size {size} · Range {range}", weaponDetailsCapacity: "{kind} · Damage {damage} · Initiative {initiative} · Strength {strength} · Size {size} · Capacity {capacity}", weaponDetailsRangeCapacity: "{kind} · Damage {damage} · Initiative {initiative} · Strength {strength} · Size {size} · Range {range} · Capacity {capacity}", equipmentDetails: "{category} · Bonus {bonus} · Durability {durability} · Size {size} · Structure {structure} · Availability {availability}", vehicleDetails: "Modifier {modifier} · Size {size} · Durability {durability} · Structure {structure} · Speed {speed}", vehicleModifierNote: "The modifier applies to Dexterity + Drive pools. Above safe Speed, apply it again.", accelerationDetails: "Acceleration {acceleration}.", normalAcceleration: "Normal acceleration.", combatSource: "Rules and equipment: Chronicles of Darkness · pp. 86–103 and 268–276.",
    },
    conditions: {
      remove: "Remove", removeNamed: "Remove {name}", removeBondedTitle: "Remove Bonded?", removeBondedDescription: "The Condition and its linked animal will be removed from the sheet and the Companions tab.", removeBondedAction: "Remove Bonded", effectLabel: "Effect:", resolutionLabel: "Resolution:", listedSourceResolution: "As described in the listed source.", beatLabel: "Beat:", noConditions: "No Conditions selected.", selectCondition: "Select Condition", selectDescription: "Choose a Condition and mark it Persistent when needed.", search: "Search by name, effect, or source", all: "All", bondedAnimal: "Bonded animal", persistent: "Persistent", add: "Add", addAnother: "Add another", noMatches: "No Conditions found.", done: "Done", sourcePage: "{source} · p. {page}", originalSourcePage: "{original} · {source} · p. {page}",
    },
    builder: { eligibility: { requiredPoints: "Allocate {required} points." } },
  },
} as const;

type MessageLeafPaths<Value, Prefix extends string = ""> = Value extends string
  ? Prefix
  : { [Key in keyof Value & string]: MessageLeafPaths<Value[Key], `${Prefix}${Prefix extends "" ? "" : "."}${Key}`> }[keyof Value & string];

export type MessageKey = MessageLeafPaths<typeof messages["pt-BR"]>;
export type TranslationParams = Readonly<Record<string, string | number>>;
export type Translator = <Key extends MessageKey>(key: Key, params?: TranslationParams) => string;

function messageAt(locale: Locale, key: string): string | undefined {
  return key.split(".").reduce<unknown>((current, segment) =>
    current && typeof current === "object" ? (current as Record<string, unknown>)[segment] : undefined,
  messages[locale]) as string | undefined;
}

export function translate(locale: Locale, key: string, params: TranslationParams = {}): string {
  const template = messageAt(locale, key);
  if (typeof template !== "string") return `[missing translation: ${key}]`;
  return template.replace(/\{([A-Za-z0-9_]+)\}/g, (token, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : token,
  );
}

const LanguageContext = createContext<{locale:Locale;setLocale:(locale:Locale)=>void;t:Translator;tr:(portuguese:string,english:string)=>string}|null>(null);

const LANGUAGE_CHANGE_EVENT = "characters-of-the-darkness:language-change";
// English is the canonical catalog language and the first-run application
// language. Portuguese is an opt-in presentation preference only.
const serverLocale = ():Locale => "en-US";
const browserLocale = ():Locale =>
  window.localStorage.getItem(STORAGE_KEY) === "pt-BR" ? "pt-BR" : "en-US";
const subscribeToLocale = (notify:()=>void) => {
  const onStorage = (event:StorageEvent) => {
    if (event.key === STORAGE_KEY) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, notify);
  };
};

export function LanguageProvider({children}:{children:ReactNode}) {
  const locale=useSyncExternalStore(subscribeToLocale,browserLocale,serverLocale);
  const setLocale=(next:Locale)=>{
    window.localStorage.setItem(STORAGE_KEY,next);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  };
  useEffect(()=>{document.documentElement.lang=locale},[locale]);
  const tr=(portuguese:string,english:string)=>locale==="pt-BR"?portuguese:english;
  const t: Translator = (key,params={})=>translate(locale,key,params);
  return <LanguageContext.Provider value={{locale,setLocale,t,tr}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const context=useContext(LanguageContext);if(!context)throw new Error("useLanguage must be used inside LanguageProvider");return context}
export const localeFlag=(locale:Locale)=>locale==="pt-BR"?"🇧🇷":"🇺🇸";
export const languageStorageKey=STORAGE_KEY;
export const localized = (locale: Locale, portuguese: string, english: string) =>
  locale === "pt-BR" ? portuguese : english;

export function localizedCount(
  locale: Locale,
  count: number,
  portugueseSingular: string,
  portuguesePlural: string,
  englishSingular: string,
  englishPlural: string,
) {
  const label = locale === "pt-BR"
    ? count === 1 ? portugueseSingular : portuguesePlural
    : count === 1 ? englishSingular : englishPlural;
  return `${count} ${label}`;
}
