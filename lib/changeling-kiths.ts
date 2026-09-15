import type { Locale } from "./i18n";
import { systemTerm } from "./system-terms";

export type KithDefinition = {
  id: string;
  name: string;
  translatedName?: string;
  skill: string;
  description: string;
  blessing: string;
  source: string;
  page: number;
  sourceId?: "h-seemings";
};

// Names and IDs stay stable for existing sheets; localization only changes presentation.
export const KITH_NAMES_PT: Record<string, string> = {
  Absinthial: "Absintial", Airtouched: "Tocado pelo Ar", Antiquarian: "Antiquário",
  Apoptosome: "Apoptossomo", Artist: "Artista", Asclepian: "Asclepiano",
  Bearskin: "Pele de Urso", Beastcaller: "Chamador de Feras", Becquerel: "Becquerel",
  Blightbent: "Corrompido", Bricoleur: "Artífice", Bridgeguard: "Guardião da Ponte",
  "Bright One": "Resplandecente", Chalomot: "Calomote", Chatelaine: "Castelão",
  Chevalier: "Cavaleiro", Chimera: "Quimera", Cleverquick: "Astuto",
  Climacteric: "Climatérico", Cloakskin: "Pele de Manto", Concubus: "Côncubo",
  Cyclopean: "Ciclópico", Delver: "Escavador", Doppelganger: "Sósia",
  Draconic: "Dracônico", Dryad: "Dríade", Enkrateia: "Autodomínio",
  Farwalker: "Andarilho Distante", Flowering: "Florescente", Flickerflash: "Relampejante",
  Ghostheart: "Coração Fantasma", Glimmerwisp: "Névoa Cintilante", Gravewight: "Espectro Tumular",
  Gremlin: "Gremlin", Gristlegrinder: "Triturador de Cartilagem", Helldiver: "Mergulhador Infernal",
  Hunterheart: "Coração de Caçador", Leechfinger: "Dedos de Sanguessuga", Lethipomp: "Condutor do Esquecimento",
  Levinquick: "Veloz como o Raio", Librorum: "Guardião dos Livros", Liminal: "Liminar",
  Lullescent: "Sussurrante", Manikin: "Manequim", Mirrorskin: "Pele de Espelho",
  Moonborn: "Nascido da Lua", Muse: "Musa", Nightsinger: "Cantor Noturno",
  Notary: "Tabelião", Nymph: "Ninfa", Oculus: "Óculo", Playmate: "Companheiro de Brincadeiras",
  Plaguesmith: "Forjador de Pragas", Polychromatic: "Policromático", Razorhand: "Mão de Navalha",
  Reborn: "Renascido", Riddleseeker: "Buscador de Enigmas", Sandharrowed: "Flagelado pela Areia",
  Shadowsoul: "Alma Sombria", Sideromancer: "Sideromante", Snowskin: "Pele de Neve",
  Spiegelbild: "Reflexo", Stoneflesh: "Carne de Pedra", Swarmflight: "Voo de Enxame",
  Swimmerskin: "Pele de Nadador", Telluric: "Telúrico", Uttervoice: "Voz Absoluta",
  Valkyrie: "Valquíria", Veneficus: "Venéfico", Venombite: "Mordida Venenosa",
  Whisperwisp: "Sussurro Fugaz", Wisewitch: "Bruxo Sábio", Witchtooth: "Dente de Bruxa",
  Bloodbrute: "Brutamontes Sangrento", Chirurgeon: "Cirurgião",
  Dancer: "Dançarino", Drudge: "Serviçal", Echoveil: "Véu de Ecos", Fireheart: "Coração de Fogo",
  Gargantuan: "Gargantuesco", Palewraith: "Espectro Pálido", Treasured: "Tesouro",
  Truefriend: "Amigo Verdadeiro", Woodblood: "Sangue de Madeira",
};

export const KITHS: KithDefinition[] = [];
type KithPresentation = Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string };
let KITH_PRESENTATION_PT: Record<string, KithPresentation> = {};

/** @test-only; never import or call this from app/, game-lines/, or worker/. */
export function replaceKithCatalog(
  items: KithDefinition[],
  presentation: Record<string, KithPresentation> = {},
) {
  KITHS.splice(0, KITHS.length, ...items);
  KITH_PRESENTATION_PT = presentation;
}

export function findKith(name:unknown) {
  const wanted=kithSearchText(String(name??""));
  return KITHS.find((item)=>[item.id, item.name, item.translatedName].some(value=>value && kithSearchText(value)===wanted));
}

export function kithSearchText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");
}

/** Individual canonical Skill keys, not localized choice phrases. */
export function kithSkillOptions(item: Pick<KithDefinition,"id"|"skill">): string[] {
  const text=item.skill;
  return [...new Set(text
    .split(/\s+(?:or|ou|and|e)\s+|\s*[,/]\s*/i)
    .map(skill=>skill.trim().replace(/^(?:or|and|ou|e)\s+/i,""))
    .map(skill=>systemTerm(skill,"en-US"))
    .filter(Boolean))];
}

export function kithDisplayName(name: unknown, custom = false, locale:Locale="en-US") {
  const value = String(name ?? "");
  if(custom)return value;
  const found=findKith(value);
  return locale==="en-US"?(found?.name??value):(found?.translatedName??value);
}

export function kithPresentation(name:unknown,locale:Locale="en-US",custom=false){
  const found=findKith(name);
  if(custom||!found)return {name:String(name??""),description:"",blessing:"",skill:""};
  return locale==="en-US"
    ? {name:found.name,description:found.description,blessing:found.blessing,skill:found.skill}
    : (KITH_PRESENTATION_PT[found.id] ?? {name:found.translatedName??found.name,description:found.description,blessing:found.blessing,skill:found.skill});
}
