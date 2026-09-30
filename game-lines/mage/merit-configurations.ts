import type { MeritConfigDefinition, MeritConfigField } from "@/lib/core/character/merit-configuration";
import { PUBLISHED_MAGE_ORDERS } from "./orders";
const optionLabels: Record<string, string> = {"Adamantine Arrow":"ui.meritConfig.adamantineArrow","Guardians of the Veil":"ui.meritConfig.guardiansOfTheVeil","Silver Ladder":"ui.meritConfig.silverLadder","Free Council":"ui.meritConfig.freeCouncil","Seers of the Throne":"ui.meritConfig.seersOfTheThrone","Ghost":"ui.meritConfig.ghost","Goetia":"ui.meritConfig.goetia","Eye":"ui.meritConfig.exarchEye","Father":"ui.meritConfig.exarchFather","General":"ui.meritConfig.exarchGeneral","Unity":"ui.meritConfig.exarchUnity","Chancellor":"ui.meritConfig.exarchChancellor","Raptor":"ui.meritConfig.exarchRaptor","Prophet":"ui.meritConfig.exarchProphet","Nemesis":"ui.meritConfig.exarchNemesis","Ruin":"ui.meritConfig.exarchRuin","Robe":"ui.meritConfig.robe","Throne":"ui.meritConfig.throne","Ring":"ui.meritConfig.ring"};
const field=(key:string,label:string,kind:"text"|"textarea"="text"):MeritConfigField=>({key,label,kind});
const itemFields=[field("name","ui.meritConfig.itemName"),field("description","ui.meritConfig.appearanceAndProperties","textarea")];
const spellFields=[field("spell","ui.meritConfig.spellAndArcana"),field("trigger","ui.meritConfig.activationTrigger"),field("mana","ui.meritConfig.manaCapacity")];
const masqueFields=[field("name","ui.meritConfig.masqueName"),field("virtue","ui.meritConfig.masqueVirtue"),field("vice","ui.meritConfig.masqueVice"),{key:"specialties",label:"ui.meritConfig.masqueSpecialties",kind:"list",rowsPerDot:1,minDots:2} as MeritConfigField,{key:"nimbus",label:"ui.meritConfig.masqueSignatureNimbus",kind:"textarea",minDots:3} as MeritConfigField,{key:"hubrisActs",label:"ui.meritConfig.ignoredHubrisActs",kind:"list",fixedRows:2,minDots:4} as MeritConfigField,{key:"merits",label:"ui.meritConfig.identityMerits",kind:"list",minDots:5} as MeritConfigField];
const MAGE_CONFIGURATIONS:Array<Omit<MeritConfigDefinition,"line">>=[
  {name:"Adamant Hand",fields:[{key:"skill",label:"ui.meritConfig.combatSkill",kind:"select",options:["Athletics","Brawl","Weaponry"].map(value=>({value,label:optionLabels[value] ?? value}))}]},
  {name:"Artifact",fields:[...itemFields,field("effects","ui.meritConfig.artifactEffects","textarea"),field("trigger","ui.meritConfig.activationCircumstances")]},
  {name:"Astral Adept",fields:[field("ceremony","ui.meritConfig.astralAttunementCeremony","textarea")]},
  {name:"Awakened Status",fields:[{key:"domain",label:"ui.meritConfig.statusDomain",kind:"select",options:["Consilium",...PUBLISHED_MAGE_ORDERS].map(value=>({value,label:optionLabels[value] ?? value}))},field("name","ui.meritConfig.consiliumOrCaucusName")]},
  {name:"Broad Dedication",fields:[field("yantra","ui.meritConfig.dedicatedYantra")]},
  {name:"Cabal Theme",fields:[field("name","ui.meritConfig.themeName"),field("description","ui.meritConfig.themeDescription","textarea")]},
  {name:"Daimonomikon",fields:[field("name","ui.meritConfig.textName"),field("legacy","ui.meritConfig.legacy"),{key:"scope",label:"ui.meritConfig.contents",kind:"select",options:[{value:"complete",label:"ui.meritConfig.initiationAndPrecedingAttainments"},{value:"single",label:"ui.meritConfig.onlySelectedAttainment"}]}]},
  {name:"Demesne",fields:[{key:"sanctumId",label:"ui.meritConfig.sanctum",kind:"merit",meritNames:["Sanctum"]},field("name","ui.meritConfig.demesneName"),field("description","ui.meritConfig.locationAndSoulStone","textarea")]},
  {name:"Destiny",fields:[field("doom","ui.meritConfig.doom","textarea")]},
  {name:"Enhanced Item",fields:[...itemFields,field("effects","ui.meritConfig.spellsAndEnhancements","textarea")]},
  {name:"Enriched Item",fields:[...itemFields,field("spell","ui.meritConfig.attunedSpell")]},
  {name:"Familiar",fields:[field("name","ui.meritConfig.familiarName"),{key:"entity",label:"ui.meritConfig.entityType",kind:"select",options:["Ghost","Spirit","Goetia"].map(value=>({value,label:optionLabels[value] ?? value}))},field("fetter","ui.meritConfig.twilightOrFetteredVessel"),field("traits","ui.meritConfig.entityTraits","textarea")]},
  {name:"Faction Member",fields:[]},
  {name:"Grimoire",fields:[field("name","ui.meritConfig.grimoireName"),{key:"rotes",label:"ui.meritConfig.rotes",kind:"list",rowsPerDot:2}]},
  {name:"Hallow",fields:[field("name","ui.meritConfig.hallowName"),field("location","ui.meritConfig.location"),field("resonance","ui.meritConfig.resonanceAndTass","textarea")]},
  {name:"Imbued Ally",fields:[{key:"allyId",label:"ui.meritConfig.retainerOrFamiliar",kind:"merit",meritNames:["Retainer","Familiar"]},...spellFields]},
  {name:"Imbued Item",fields:[...itemFields,...spellFields]},
  {name:"Infamous Mentor",fields:[{key:"mentorId",label:"ui.meritConfig.mentor",kind:"merit",meritNames:["Mentor"]},field("orderStatus","ui.meritConfig.mentorOrderStatus"),field("consiliumStatus","ui.meritConfig.mentorConsiliumStatus"),field("socialMerits","ui.meritConfig.borrowedSocialMerits","textarea")]},
  {name:"Inheritance",fields:[field("heritage","ui.meritConfig.bloodlineAndReputation")]},
  {name:"Mana Battery",fields:itemFields},
  {name:"Masque",fields:masqueFields},
  {name:"Masque (Style)",fields:masqueFields},
  {name:"Order Archive",fields:[{key:"statusId",label:"ui.meritConfig.consiliumOrOrderStatus",kind:"merit",meritNames:["Awakened Status","Consilium/Order Status"]},field("name","ui.meritConfig.archiveName"),{key:"arcana",label:"ui.meritConfig.protectedArcana",kind:"list"},{key:"assets",label:"ui.meritConfig.caucusAssets",kind:"list"}]},
  {name:"Perfected Item",fields:[...itemFields,field("material","ui.meritConfig.perfectedMaterial")]},
  {name:"Profligate Dedication",fields:[{key:"additionalTools",label:"ui.meritConfig.additionalDedicatedTools",kind:"list",fixedRows:2}]},
  {name:"Prelacy",fields:[{key:"exarch",label:"ui.meritConfig.patronExarch",kind:"select",options:["Eye","Father","General","Unity","Chancellor","Raptor","Prophet","Nemesis","Ruin"].map(value=>({value,label:optionLabels[value] ?? value}))}]},
  {name:"Profane Tool",fields:[{key:"form",label:"ui.meritConfig.profaneForm",kind:"select",options:["Scepter","Robe","Crown","Throne","Ring"].map(value=>({value,label:optionLabels[value] ?? value}))}]},
  {name:"Shadow Name",fields:[field("symbolism","ui.meritConfig.shadowNameSymbolism","textarea")]},
  {name:"Shadow Self",fields:[{key:"socialAttribute",label:"ui.meritConfig.projectedSocialAttribute",kind:"select",options:["Presence","Manipulation","Composure"].map(value=>({value,label:optionLabels[value] ?? value}))}]},
  {name:"Sanctum",fields:[{key:"safePlaceId",label:"ui.meritConfig.safePlace",kind:"merit",meritNames:["Safe Place"]},field("name","ui.meritConfig.sanctumName"),field("description","ui.meritConfig.magicalInsulationAndAppearance","textarea")]},
  {name:"Soul Stone",fields:[field("name","ui.meritConfig.stoneAppearance"),field("creator","ui.meritConfig.creator"),field("legacy","ui.meritConfig.creatorLegacy")]},
  {name:"Svikiro",fields:[{key:"tradition",label:"ui.meritConfig.mediumTradition",kind:"select",options:[{value:"wamasikati",label:"Wamasikati"},{value:"wedzinza",label:"Wedzinza"}]}]},
  {name:"Supernal Watcher",fields:[field("name","ui.meritConfig.watcherName"),field("entity","ui.meritConfig.realmAndEntityType")]},
  {name:"Techné",fields:[field("focus","ui.meritConfig.culturalScientificOrArtisticFocus")]},
];
export const MAGE_MERIT_CONFIGURATIONS:MeritConfigDefinition[]=MAGE_CONFIGURATIONS.map(item=>({...item,line:"MtA"}));
