import type { MeritConfigDefinition, MeritConfigField } from "@/lib/core/character/merit-configuration";
import { PUBLISHED_MAGE_ORDERS } from "./orders";
const field=(key:string,label:string,kind:"text"|"textarea"="text"):MeritConfigField=>({key,label,kind});
const itemFields=[field("name","Item name"),field("description","Appearance and properties","textarea")];
const spellFields=[field("spell","Spell and Arcana"),field("trigger","Activation trigger"),field("mana","Mana capacity")];
const masqueFields=[field("name","Masque name"),field("virtue","Masque Virtue"),field("vice","Masque Vice"),{key:"specialties",label:"Masque Skill Specialties",kind:"list",rowsPerDot:1,minDots:2} as MeritConfigField,{key:"nimbus",label:"Masque Signature Nimbus",kind:"textarea",minDots:3} as MeritConfigField,{key:"hubrisActs",label:"Ignored Acts of Hubris",kind:"list",fixedRows:2,minDots:4} as MeritConfigField,{key:"merits",label:"Identity Merits (up to five dots)",kind:"list",minDots:5} as MeritConfigField];
const MAGE_CONFIGURATIONS:Array<Omit<MeritConfigDefinition,"line">>=[
  {name:"Adamant Hand",fields:[{key:"skill",label:"Combat Skill",kind:"select",options:["Athletics","Brawl","Weaponry"].map(value=>({value,label:value}))}]},
  {name:"Artifact",fields:[...itemFields,field("effects","Effects, Arcana and Utility Attainments","textarea"),field("trigger","Activation circumstances")]},
  {name:"Astral Adept",fields:[field("ceremony","Astral attunement ceremony","textarea")]},
  {name:"Awakened Status",fields:[{key:"domain",label:"Status domain",kind:"select",options:["Consilium",...PUBLISHED_MAGE_ORDERS].map(value=>({value,label:value}))},field("name","Consilium / Caucus name")]},
  {name:"Broad Dedication",fields:[field("yantra","Dedicated Yantra")]},
  {name:"Cabal Theme",fields:[field("name","Theme name"),field("description","Theme description","textarea")]},
  {name:"Daimonomikon",fields:[field("name","Text name"),field("legacy","Legacy"),{key:"scope",label:"Contents",kind:"select",options:[{value:"complete",label:"Initiation and preceding Attainments"},{value:"single",label:"Only the selected Attainment"}]}]},
  {name:"Demesne",fields:[{key:"sanctumId",label:"Sanctum",kind:"merit",meritNames:["Sanctum"]},field("name","Demesne name"),field("description","Location and soul stone","textarea")]},
  {name:"Destiny",fields:[field("doom","Doom","textarea")]},
  {name:"Enhanced Item",fields:[...itemFields,field("effects","Spells and allocated enhancements","textarea")]},
  {name:"Enriched Item",fields:[...itemFields,field("spell","Attuned spell")]},
  {name:"Familiar",fields:[field("name","Familiar name"),{key:"entity",label:"Entity type",kind:"select",options:["Ghost","Spirit","Goetia"].map(value=>({value,label:value}))},field("fetter","Twilight or Fettered vessel"),field("traits","Entity traits","textarea")]},
  {name:"Faction Member",fields:[]},
  {name:"Grimoire",fields:[field("name","Grimoire name"),{key:"rotes",label:"Rotes",kind:"list",rowsPerDot:2}]},
  {name:"Hallow",fields:[field("name","Hallow name"),field("location","Location"),field("resonance","Resonance and tass","textarea")]},
  {name:"Imbued Ally",fields:[{key:"allyId",label:"Retainer or Familiar",kind:"merit",meritNames:["Retainer","Familiar"]},...spellFields]},
  {name:"Imbued Item",fields:[...itemFields,...spellFields]},
  {name:"Infamous Mentor",fields:[{key:"mentorId",label:"Mentor",kind:"merit",meritNames:["Mentor"]},field("orderStatus","Mentor's Order Status"),field("consiliumStatus","Mentor's Consilium Status"),field("socialMerits","Borrowed Social Merits (total: twice this Merit's dots)","textarea")]},
  {name:"Inheritance",fields:[field("heritage","Bloodline and reputation")]},
  {name:"Mana Battery",fields:itemFields},
  {name:"Masque",fields:masqueFields},
  {name:"Masque (Style)",fields:masqueFields},
  {name:"Order Archive",fields:[{key:"statusId",label:"Consilium / Order Status",kind:"merit",meritNames:["Awakened Status","Consilium/Order Status"]},field("name","Archive name"),{key:"arcana",label:"Protected Arcana",kind:"list"},{key:"assets",label:"Caucus Assets",kind:"list"}]},
  {name:"Perfected Item",fields:[...itemFields,field("material","Perfected metal, amalgam or alloy")]},
  {name:"Profligate Dedication",fields:[{key:"additionalTools",label:"Additional dedicated tools",kind:"list",fixedRows:2}]},
  {name:"Prelacy",fields:[{key:"exarch",label:"Patron Exarch",kind:"select",options:["Eye","Father","General","Unity","Chancellor","Raptor","Prophet","Nemesis","Ruin"].map(value=>({value,label:value}))}]},
  {name:"Profane Tool",fields:[{key:"form",label:"Profane Form",kind:"select",options:["Scepter","Robe","Crown","Throne","Ring"].map(value=>({value,label:value}))}]},
  {name:"Shadow Name",fields:[field("symbolism","Shadow Name symbolism","textarea")]},
  {name:"Shadow Self",fields:[{key:"socialAttribute",label:"Astral / projected Social Attribute",kind:"select",options:["Presence","Manipulation","Composure"].map(value=>({value,label:value}))}]},
  {name:"Sanctum",fields:[{key:"safePlaceId",label:"Safe Place",kind:"merit",meritNames:["Safe Place"]},field("name","Sanctum name"),field("description","Magical insulation and appearance","textarea")]},
  {name:"Soul Stone",fields:[field("name","Stone appearance"),field("creator","Creator"),field("legacy","Creator's Legacy")]},
  {name:"Svikiro",fields:[{key:"tradition",label:"Medium tradition",kind:"select",options:[{value:"wamasikati",label:"Wamasikati"},{value:"wedzinza",label:"Wedzinza"}]}]},
  {name:"Supernal Watcher",fields:[field("name","Watcher name"),field("entity","Realm and entity type")]},
  {name:"Techné",fields:[field("focus","Cultural, scientific or artistic focus")]},
];
export const MAGE_MERIT_CONFIGURATIONS:MeritConfigDefinition[]=MAGE_CONFIGURATIONS.map(item=>({...item,line:"MtA"}));
