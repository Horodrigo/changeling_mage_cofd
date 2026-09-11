import type { Locale } from "./i18n";
import { HEDGE_DUELIST_VARIANTS } from "./merits-supplements-en";
import { courtCanonicalId, courtDisplayName } from "./changeling-courts";
import { synchronizeEntitlement } from "./entitlements";
import { MAGE_MERIT_CONFIGURATIONS } from "./mage-merit-configurations";
import { hasPublishedMageOrder } from "./mage-orders";
import { systemTerm } from "./system-terms";

export type MeritConfigValue = string | string[];
export type MeritConfiguration = Record<string, MeritConfigValue>;
export type MeritConfigField = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "list" | "court" | "select" | "merit";
  meritNames?: string[];
  rowsPerDot?: number;
  fixedRows?: number;
  placeholder?: string;
  minDots?: number;
  options?: Array<{ value: string; label: string }>;
};
export type MeritConfigDefinition = {
  name: string;
  fields: MeritConfigField[];
  grants?: boolean;
  line?: "CtL" | "MtA";
};

const MENTOR_TRAITS = [
  "Academics","Computer","Crafts","Investigation","Medicine","Occult","Politics","Science",
  "Athletics","Brawl","Drive","Firearms","Larceny","Stealth","Survival","Weaponry",
  "Animal Ken","Empathy","Expression","Intimidation","Persuasion","Socialize","Streetwise","Subterfuge","Resources",
].map((label)=>({value:label,label}));
const SKILL_OPTIONS=MENTOR_TRAITS.filter((item)=>item.value!=="Resources");
const PHYSICAL_SKILL_OPTIONS=SKILL_OPTIONS.filter((item)=>["Athletics","Brawl","Drive","Firearms","Larceny","Stealth","Survival","Weaponry"].includes(item.value));
const ATTRIBUTE_OPTIONS=["Intelligence","Wits","Resolve","Strength","Dexterity","Stamina","Presence","Manipulation","Composure"].map((label)=>({value:label,label}));

// Official Merit-specific configuration is rebuilt only after source audit.
export const MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [...MAGE_MERIT_CONFIGURATIONS,{
  name: "Hedge Duelist",
  line: "CtL",
  fields: [{
    key: "firstManeuver",
    label: "First-dot maneuver",
    kind: "select",
    options: HEDGE_DUELIST_VARIANTS.map(({label,seeming})=>({value:label,label:`${label} (${seeming})`})),
  }],
},{
  name: "Court Goodwill",
  line: "CtL",
  fields: [{ key: "court", label: "Court", kind: "court" }],
},{
  name: "Contacts",
  fields: [{ key: "groups", label: "Groups, organizations or contact name", kind: "list" }],
},{
  name: "Staff",
  fields: [{ key: "skills", label: "Staff Skills", kind: "list" }],
},{
  name: "Token",
  line: "CtL",
  fields: [],
},{
  name: "Hedgespun Item",
  line: "CtL",
  fields: [],
},{name:"Allies",fields:[{key:"subject",label:"Allied group",kind:"text"}]},
  {name:"Alternate Identity",fields:[{key:"identity",label:"Identity",kind:"text"}]},
  {name:"Language",fields:[{key:"language",label:"Language",kind:"text"}]},
  {name:"Library",fields:[{key:"subject",label:"Relevant Skill or subject",kind:"text"}]},
  {name:"Safe Place",fields:[{key:"place",label:"Safe Place",kind:"text"}]},
  {name:"Status",fields:[{key:"group",label:"Group",kind:"text"}]},
  {name:"Striking Looks",fields:[{key:"appearance",label:"Distinctive appearance",kind:"text"}]},
  {name:"Mentor",fields:[
    {key:"name",label:"Mentor name",kind:"text",placeholder:"Mentor name"},
    {key:"trait_1",label:"Mentor trait 1",kind:"select",options:MENTOR_TRAITS},
    {key:"trait_2",label:"Mentor trait 2",kind:"select",options:MENTOR_TRAITS},
    {key:"trait_3",label:"Mentor trait 3",kind:"select",options:MENTOR_TRAITS},
  ]},
  {name:"Retainer",fields:[
    {key:"name",label:"Retainer name",kind:"text"},
    {key:"purview",label:"Area of expertise",kind:"text"},
  ]},
  {name:"Area of Expertise",fields:[{key:"specialty",label:"Specialty",kind:"text",placeholder:"Specialty receiving the increased bonus"}]},
  {name:"Defensive Combat",fields:[{key:"skill",label:"Defense Skill",kind:"select",options:[{value:"Brawl",label:"Brawl"},{value:"Weaponry",label:"Weaponry"}]}]},
  {name:"Fighting Finesse",fields:[{key:"skill",label:"Combat Skill",kind:"select",options:[{value:"Brawl",label:"Brawl"},{value:"Weaponry",label:"Weaponry"}]}]},
  {name:"Multilingual",fields:[{key:"languages",label:"Additional languages",kind:"list"}]},
  {name:"Quick Draw",fields:[{key:"specialty",label:"Weapon Specialty",kind:"text",placeholder:"Firearms or Weaponry Specialty"}]},
  {name:"Unseen Sense",fields:[{key:"phenomenon",label:"Supernatural phenomenon",kind:"text"}]},
  {name:"Warded Dreams",line:"CtL",fields:[]},
  {name:"Hollow",line:"CtL",fields:[]},
  {name:"Stable Trod",line:"CtL",fields:[]},
  {name:"Workshop",line:"CtL",fields:[]},
  {name:"Shared Bastion",line:"CtL",fields:[]},
  {name:"Blood and Bone",line:"CtL",fields:[
    {key:"skill_1",label:"Physical Skill",kind:"select",options:PHYSICAL_SKILL_OPTIONS},
    {key:"skill_2",label:"Second Skill",kind:"select",options:SKILL_OPTIONS},
    {key:"animal",label:"Animal reflected by the fae mien",kind:"text"},
  ]},
  {name:"Eerie Eyes",line:"CtL",fields:[{key:"sensory_organs",label:"Unusual sensory organs",kind:"text"}]},
  {name:"Know-It-All",line:"CtL",fields:[{key:"skill",label:"Chosen Skill",kind:"select",options:["Academics","Occult","Politics","Science"].map((label)=>({value:label,label}))}]},
  {name:"Material Affinity",line:"CtL",fields:[{key:"material",label:"Chosen material",kind:"text"}]},
  {name:"Mover and Shaker",line:"CtL",fields:[{key:"subculture",label:"Subculture",kind:"text"}]},
  {name:"Running with the Wolves",line:"CtL",fields:[{key:"animal_group",label:"Animal group",kind:"text"}]},
  {name:"Still Waters Run Deep",line:"CtL",fields:[{key:"attribute",label:"Chosen Attribute",kind:"select",options:ATTRIBUTE_OPTIONS}]},
  {name:"Elemental Warrior",line:"CtL",fields:[{key:"element",label:"Physical element",kind:"text"}]},
  {name:"Fae Pet",line:"CtL",fields:[{key:"name",label:"Name",kind:"text"},{key:"animalId",label:"Animal",kind:"text"},{key:"dread_power",label:"Dread Power",kind:"text",placeholder:"Name of the pet's Dread Power"}]},
  {name:"Friends in Low Places",line:"CtL",fields:[{key:"group",label:"Group",kind:"text"}]},
  {name:"A Taste of Honey",line:"CtL",fields:[{key:"desire",label:"Chosen desire",kind:"text"}]},
  {name:"Rageaholic",line:"CtL",fields:[{key:"wrath",label:"Chosen form of wrath",kind:"text"}]},
  {name:"Acquired Taste",line:"CtL",fields:[{key:"supernatural_kind",label:"Sapient supernatural kind",kind:"text"}]},
  {name:"Favored Phobia",line:"CtL",fields:[{key:"fear",label:"Chosen fear",kind:"text"}]},
  {name:"Grief Connoisseur",line:"CtL",fields:[{key:"sorrow",label:"Chosen sorrow",kind:"text"}]},
  {name:"Strange Favor",line:"CtL",fields:[
    {key:"entity",label:"Supernatural entity",kind:"text"},
    {key:"favor",label:"Favor owed",kind:"textarea"},
  ]},
  {name:"Professional Training",fields:[]},
  {name:"Mystery Cult Initiation",fields:[]},
  {name:"Mystery Cult Influence",fields:[]},
  {name:"Entitlement",line:"CtL",fields:[]},
];
export const findMeritConfiguration = (name: string): MeritConfigDefinition | undefined => MERIT_CONFIGURATIONS.find((item)=>item.name===name);
const INLINE_MERITS=new Set(["Allies","Alternate Identity","Area of Expertise","Eerie Eyes","Language","Library","Material Affinity","Mover and Shaker","Quick Draw","Running with the Wolves","Safe Place","Status","Striking Looks","Unseen Sense","Friends in Low Places","A Taste of Honey","Rageaholic","Acquired Taste","Favored Phobia","Grief Connoisseur"]);
const STRUCTURED_MERITS=new Set(["Professional Training","Mystery Cult Initiation","Mystery Cult Influence","Hollow","Warded Dreams","Stable Trod","Workshop","Shared Bastion","Token","Hedgespun Item","Entitlement"]);
export const isInlineMeritConfiguration = (name: string) => INLINE_MERITS.has(name)||Boolean(MAGE_MERIT_CONFIGURATIONS.find(item=>item.name===name&&item.fields.length===1&&item.fields[0].kind==="text"));
export const isStructuredMerit = (name: string) => STRUCTURED_MERITS.has(name);
export const meritConfigurationText = (value: string | undefined, _locale: Locale) => value ?? "";

export const normalizeMeritConfiguration = (value: unknown): MeritConfiguration =>
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key,item]) => [key,Array.isArray(item) ? item.map(String) : String(item ?? "")]))
    : {};

export function meritConfigurationTitle(value: unknown, locale: Locale = "en-US") {
  const configuration = normalizeMeritConfiguration(value);
  for (const key of ["subject","identity","language","place","group","appearance","name","court","firstManeuver","cult","profession","focus","heritage","yantra","skill"]) {
    const item=configuration[key];
    if (typeof item === "string" && item.trim()) return key === "court" ? courtDisplayName(item, locale) : item.trim();
  }
  return "";
}

export function synchronizeMeritGrants<T>(sheet: T): T {
  const target=sheet as T&{
    game_line?:string;
    merits?:Array<{instanceId?:string;name:string;dots:number;creationDots?:number;experienceDots?:number;sourceId?:string;source?:string;configuration?:MeritConfiguration;grantedBy?:string}>;
    specializations?:Array<{skill:string;name:string;grantedBy?:string}>;
    skills?:Record<string,number>;
    line_data?:Record<string,unknown>;
  };
  if(!["CtL","MtA"].includes(target.game_line??"")||!Array.isArray(target.merits)||!target.line_data) return sheet;
  const court=courtCanonicalId(target.line_data.court), courtless=!court||["sem corte","courtless"].includes(court.toLowerCase());
  const existing=target.merits.find((item)=>item.name==="Mantle"&&item.grantedBy==="Corte");
  target.merits=target.merits.filter((item)=>!(item.name==="Mantle"&&item.grantedBy==="Corte"));
  if(target.game_line==="CtL"&&!courtless) target.merits.push({
    ...existing,
    instanceId:existing?.instanceId??`mantle-${court}`,
    name:"Mantle",
    dots:Math.max(1,Number(existing?.dots??1)),
    creationDots:Math.max(1,Number(existing?.creationDots??(Number(existing?.dots??1)-Number(existing?.experienceDots??0)))),
    experienceDots:Math.max(0,Number(existing?.experienceDots??0)),
    sourceId:"ctl-2ed",
    source:"Changeling the Lost",
    configuration:{court},
    grantedBy:"Corte",
  });
  if(target.game_line==="MtA"){
    const order=String(target.line_data?.order??"Orderless");
    const automatic=target.merits.filter(item=>
      (item.grantedBy==="Ordem"&&["Awakened Status","High Speech"].includes(item.name))||
      (item.grantedBy==="Nameless Order"&&["Mystery Cult Initiation","High Speech"].includes(item.name))
    );
    target.merits=target.merits.filter(item=>!automatic.includes(item));
    if(hasPublishedMageOrder(order)){
      const status=automatic.find(item=>item.name==="Awakened Status");
      target.merits.push({
        ...status,
        instanceId:status?.instanceId??`order-status-${order}`,
        name:"Awakened Status",
        dots:Math.max(1,Number(status?.dots??1)),
        creationDots:Math.max(1,Number(status?.creationDots??(Number(status?.dots??1)-Number(status?.experienceDots??0)))),
        experienceDots:Math.max(0,Number(status?.experienceDots??0)),
        sourceId:"mta-2ed",source:"Mage the Awakening",configuration:{domain:order,name:order},grantedBy:"Ordem",
      });
      const speech=automatic.find(item=>item.name==="High Speech");
      target.merits.push({...speech,instanceId:speech?.instanceId??`high-speech-${order}`,name:"High Speech",dots:1,creationDots:1,experienceDots:0,sourceId:"mta-2ed",source:"Mage the Awakening",configuration:{},grantedBy:"Ordem"});
    } else if(order==="Nameless"){
      const initiation=automatic.find(item=>item.name==="Mystery Cult Initiation");
      const custom=target.line_data?.custom_order&&typeof target.line_data.custom_order==="object"?target.line_data.custom_order as Record<string,unknown>:{};
      const existingConfig=normalizeMeritConfiguration(initiation?.configuration);
      const legacyRoteSkills=Array.isArray(custom.roteSkills)?custom.roteSkills.map(String).filter(Boolean).slice(0,3):[];
      const config={...existingConfig,cult:String(custom.name??""),level_1_type:"merit",level_1_merits:["High Speech|1"],level_2_type:"rote_skills",level_2_rote_skills:Array.isArray(existingConfig.level_2_rote_skills)?existingConfig.level_2_rote_skills:legacyRoteSkills,level_3_type:"skill",level_3_skill:"Ocultismo"};
      target.merits.push({
        ...initiation,
        instanceId:initiation?.instanceId??"nameless-order-initiation",
        name:"Mystery Cult Initiation",
        dots:Math.max(1,Number(initiation?.dots??1)),
        creationDots:Math.max(1,Number(initiation?.creationDots??(Number(initiation?.dots??1)-Number(initiation?.experienceDots??0)))),
        experienceDots:Math.max(0,Number(initiation?.experienceDots??0)),
        sourceId:"core-2ed",source:"Chronicles of Darkness",configuration:config,grantedBy:"Nameless Order",
      });
    }
  }
  const benefits=target.merits.filter((item)=>item.name==="Court Goodwill"&&!item.grantedBy).map((item)=>{
    const selected=courtCanonicalId(normalizeMeritConfiguration(item.configuration).court);
    item.configuration={...normalizeMeritConfiguration(item.configuration),court:selected};
    return {court:selected,dots:item.dots,mantleDots:Math.max(0,item.dots-2)};
  }).filter((item)=>item.court);
  const generatedPrefix="Merit:";
  target.merits=target.merits.filter((item)=>!item.grantedBy?.startsWith(generatedPrefix));
  target.specializations=(target.specializations??[]).filter((item)=>!item.grantedBy?.startsWith(generatedPrefix));
  const skillBonuses:Record<string,number>={};
  const grantMerit=(owner:string,name:string,dots:number,index:number)=>{
    if(!name||dots<1) return;
    target.merits!.push({
      instanceId:`grant-${owner}-${index}`,
      name,
      dots,
      configuration:{},
      grantedBy:`${generatedPrefix}${owner}`,
    });
  };
  for(const merit of target.merits.filter((item)=>!item.grantedBy||item.grantedBy==="Nameless Order")){
    const owner=`${merit.name}:${merit.instanceId??merit.name}`;
    const configuration=normalizeMeritConfiguration(merit.configuration);
    if(merit.name==="Mystery Cult Initiation"&&merit.grantedBy==="Nameless Order"){
      configuration.level_1_type="merit";
      configuration.level_1_merits=["High Speech|1"];
      configuration.level_2_type="rote_skills";
      configuration.level_3_type="skill";
      configuration.level_3_skill="Ocultismo";
      merit.configuration=configuration;
    }
    if(merit.name==="Professional Training"){
      const contacts=Array.isArray(configuration.contacts)?configuration.contacts.filter(Boolean):[];
      if(merit.dots>=1) target.merits.push({
        instanceId:`grant-${owner}-contacts`,
        name:"Contacts",
        dots:2,
        configuration:{groups:contacts.slice(0,2)},
        grantedBy:`${generatedPrefix}${owner}`,
      });
      if(merit.dots>=3){
        for(const index of [1,2]){
          const skill=String(configuration[`specialty_${index}_skill`]??"");
          const name=String(configuration[`specialty_${index}_name`]??"");
          if(skill&&name) target.specializations!.push({skill,name,grantedBy:`${generatedPrefix}${owner}`});
        }
      }
      const boosted=String(configuration.boosted_skill??"");
      if(merit.dots>=4&&boosted) skillBonuses[boosted]=(skillBonuses[boosted]??0)+1;
    }
    if(merit.name==="Mystery Cult Initiation"||merit.name==="Mystery Cult Influence"){
      for(let level=1;level<=Math.min(5,merit.dots);level+=1){
        const prefix=`level_${level}`;
        const type=String(configuration[`${prefix}_type`]??"");
        if(type==="specialty"){
          const skill=String(configuration[`${prefix}_specialty_skill`]??"");
          const name=String(configuration[`${prefix}_specialty_name`]??"");
          if(skill&&name) target.specializations!.push({skill,name,grantedBy:`${generatedPrefix}${owner}`});
        }
        if(type==="skill"||type==="merit_skill"){
          const skill=String(configuration[`${prefix}_skill`]??"");
          if(skill) skillBonuses[skill]=(skillBonuses[skill]??0)+1;
        }
        if(type==="merit"||type==="merits"||type==="merit_skill"){
          const rows=Array.isArray(configuration[`${prefix}_merits`])?configuration[`${prefix}_merits`] as string[]:[];
          rows.forEach((row,index)=>{
            const [name,rawDots]=row.split("|");
            grantMerit(`${owner}:${level}`,name,Math.max(1,Number(rawDots)||1),index);
          });
        }
      }
    }
  }
  const namelessInitiation=target.game_line==="MtA"&&String(target.line_data.order??"")==="Nameless"
    ? target.merits.find((item)=>item.name==="Mystery Cult Initiation"&&item.grantedBy==="Nameless Order")
    : undefined;
  const namelessConfiguration=normalizeMeritConfiguration(namelessInitiation?.configuration);
  const namelessRoteSkills=namelessInitiation&&namelessInitiation.dots>=2&&Array.isArray(namelessConfiguration.level_2_rote_skills)
    ? namelessConfiguration.level_2_rote_skills.map(String).filter(Boolean).slice(0,3)
    : undefined;
  target.line_data={
    ...target.line_data,
    court_goodwill_benefits:benefits,
    merit_granted_skill_bonuses:skillBonuses,
    ...(namelessInitiation?{rote_skills:namelessRoteSkills??[],order_occult_bonus:0}:{}),
  };
  return target.game_line==="CtL"?synchronizeEntitlement(sheet):sheet;
}

export function expandedConfigurationLines(
  name: string,
  dots: number,
  value: unknown,
  locale: Locale = "pt-BR",
): string[] {
  const mageDefinition=MAGE_MERIT_CONFIGURATIONS.find(item=>item.name===name);
  if(mageDefinition){
    const config=normalizeMeritConfiguration(value);
    const lines=mageDefinition.fields.filter(field=>field.kind!=="merit").flatMap(field=>{
      const stored=config[field.key];
      const text=Array.isArray(stored)?stored.slice(0,field.fixedRows??dots*(field.rowsPerDot??1)).filter(Boolean).join(", "):String(stored??"");
      return text.trim()?[`${field.label}: ${text}`]:[];
    });
    if(name==="Artifact")lines.push(`Mana capacity: ${dots*2}`,`Effective Gnosis: ${Math.ceil(dots/2)}`);
    if(name==="Mana Battery")lines.push(`Mana capacity: ${dots*2}`);
    if(name==="Familiar"||name==="Supernal Watcher")lines.push(`Rank: ${dots/2}`);
    return lines;
  }
  if(name==="Token"){
    const configuration=normalizeMeritConfiguration(value), items=decodeConfiguredRows<TokenConfigurationItem>(configuration.items), lines:string[]=[];
    for(const [index,item] of items.entries()){
      const kind=item.kind??"token",kindLabel=kind==="trifle"?(locale==="en-US"?"Trifle batch":"Lote de Bagatelas"):kind==="bauble"?"Bauble":"Token";
      const title=item.name.trim()||`${kindLabel} ${index+1}`,rating=Math.max(1,item.rating);
      if(kind==="trifle") lines.push(`${title} (3): ${locale==="en-US"?"Effect":"Efeito"}: ${item.effect||"—"}`);
      else if(kind==="bauble") lines.push(`${title} (${"•".repeat(rating)}): ${locale==="en-US"?"Description":"Descrição"}: ${item.description||"—"}; Crux: ${item.crux||"—"}; Catch: ${item.catch||"—"}`);
      else lines.push(`${title} (${"•".repeat(rating)}): ${locale==="en-US"?"Cost":"Custo"}: ${item.cost||"—"}; ${locale==="en-US"?"Effect":"Efeito"}: ${item.effect||"—"}; Catch: ${item.catch||"—"}; Drawback: ${item.drawback||"—"}`);
    }
    if(items.reduce((sum,item)=>sum+item.rating,0)!==dots) lines.push(`${locale==="en-US"?"Unallocated dots":"Pontos não distribuídos"}: ${Math.max(0,dots-items.reduce((sum,item)=>sum+item.rating,0))}`);
    return lines;
  }
  if(name==="Hedgespun Item"){
    const configuration=normalizeMeritConfiguration(value), item=decodeHedgespunConfiguration(configuration), lines:string[]=[];
    const selectedBenefits=item.benefits.slice(0,Math.max(0,dots));
    if(item.name.trim()) lines.push(`${locale==="en-US"?"Item":"Item"}: ${item.name}`);
    if(item.description.trim()) lines.push(`${locale==="en-US"?"Mask and mien":"Máscara e semblante feérico"}: ${item.description}`);
    const benefits=[
      ["extraordinary",locale==="en-US"?"Extraordinary Equipment":"Equipamento Extraordinário",item.extraordinaryDetail],
      ["alacrity",locale==="en-US"?"Improved Alacrity":"Alacridade Aprimorada","+2 Initiative and Speed"],
      ["durability",locale==="en-US"?"Increased Durability":"Durabilidade Aumentada","+1 Durability"],
    ] as const;
    for(const [key,label,detail] of benefits){const count=selectedBenefits.filter((benefit)=>benefit===key).length;if(count) lines.push(`${label} ×${count}: ${detail}`);}
    lines.push(`${locale==="en-US"?"Drawback":"Desvantagem"}: ${HEDGESPUN_DRAWBACK[locale]}`);
    return lines;
  }
  if(name==="Hollow"||name==="Shared Bastion"){
    const configuration=normalizeMeritConfiguration(value), lines:string[]=[];
    const configuredName=String(configuration.name??"").trim();
    const location=String(configuration.location??"").trim();
    const features=Array.isArray(configuration.features)?configuration.features:[];
    if(configuredName) lines.push(`${locale==="en-US"?"Name":"Nome"}: ${configuredName}`);
    if(location) lines.push(`${locale==="en-US"?"Location and appearance":"Localização e aparência"}: ${location}`);
    if(features.length) lines.push(`${locale==="en-US"?"Features":"Características"}: ${features.map((item)=>String(item).split("|")[0]).join(", ")}`);
    return lines;
  }
  if(name==="Stable Trod"){
    const configuration=normalizeMeritConfiguration(value), lines:string[]=[];
    const configuredName=String(configuration.name??"").trim(), enhancement=String(configuration.enhancement??"").trim();
    if(configuredName) lines.push(`${locale==="en-US"?"Trod":"Trilha"}: ${configuredName}`);
    if(enhancement) lines.push(`${locale==="en-US"?"Shared Hollow enhancement":"Melhoria compartilhada de Recanto"}: ${enhancement}`);
    return lines;
  }
  if(name==="Workshop"){
    const configuration=normalizeMeritConfiguration(value), specialties=Array.isArray(configuration.specialties)?configuration.specialties.filter(Boolean):[];
    return specialties.length?[`${locale==="en-US"?"Craft Specialties":"Especializações de Ofícios"}: ${specialties.join(", ")}`]:[];
  }
  if(name==="Court Goodwill"){
    const court=courtDisplayName(normalizeMeritConfiguration(value).court,locale)|| (locale==="en-US"?"Not selected":"Não selecionada");
    const mantle=Math.max(0,dots-2);
    return locale==="en-US"?[
      `Court: ${court}.`,
      `Allies: functions as Allies ${dots} within that Court.`,
      `Mantle equivalence: ${mantle}; Court Goodwill can satisfy only Mantle prerequisites from 1 to 3.`,
      "Mentor: functions as Mentor 1 through the Court contact.",
    ]:[
      `Corte: ${court}.`,
      `Aliados: funciona como Aliados ${dots} dentro dessa Corte.`,
      `Equivalência de Manto: ${mantle}; Benevolência da Corte só pode satisfazer pré-requisitos de Manto entre 1 e 3.`,
      "Mentor: funciona como Mentor 1 por meio do contato na Corte.",
    ];
  }
  if(name==="Professional Training"){
    const configuration=normalizeMeritConfiguration(value), lines:string[]=[];
    const profession=String(configuration.profession??"").trim();
    const contacts=Array.isArray(configuration.contacts)?configuration.contacts.filter(Boolean):[];
    const assets=Array.isArray(configuration.asset_skills)?configuration.asset_skills.filter(Boolean):[];
    if(profession) lines.push(`${locale==="en-US"?"Profession":"Profissão"}: ${profession}`);
    if(dots>=1&&contacts.length) lines.push(`${locale==="en-US"?"Contacts":"Contatos"}: ${contacts.join(", ")}`);
    if(dots>=2&&assets.length) lines.push(`${locale==="en-US"?"Asset Skills":"Perícias de Ativo"}: ${assets.join(", ")}`);
    for(const index of [1,2]){
      const skill=String(configuration[`specialty_${index}_skill`]??"").trim();
      const specialty=String(configuration[`specialty_${index}_name`]??"").trim();
      if(dots>=3&&skill&&specialty) lines.push(`${locale==="en-US"?"Specialty":"Especialização"}: ${skill} (${specialty})`);
    }
    const boosted=String(configuration.boosted_skill??"").trim();
    if(dots>=4&&boosted) lines.push(`${locale==="en-US"?"Skill Increase":"Aumento de Perícia"}: ${boosted} +1`);
    return lines;
  }
  if(name==="Contacts"){
    const groups=normalizeMeritConfiguration(value).groups;
    const choices=Array.isArray(groups)?groups.filter(Boolean):String(groups??"").trim()?[String(groups)]:[];
    return choices.map((choice,index)=>`${locale==="en-US"?"Contact":"Contato"} ${index+1}: ${choice}`);
  }
  if(name==="Multilingual"){
    const configured=normalizeMeritConfiguration(value).languages;
    const languages=Array.isArray(configured)?configured.filter(Boolean):String(configured??"").trim()?[String(configured)]:[];
    return languages.length?[`${locale==="en-US"?"Languages":"Idiomas"}: ${languages.join(", ")}`]:[];
  }
  if(name==="Mystery Cult Initiation"||name==="Mystery Cult Influence"){
    const configuration=normalizeMeritConfiguration(value), lines:string[]=[];
    const cult=String(configuration.cult??"").trim();
    if(cult) lines.push(`${locale==="en-US"?"Cult":"Culto"}: ${cult}`);
    for(let level=1;level<=Math.min(5,dots);level+=1){
      const prefix=`level_${level}`, type=String(configuration[`${prefix}_type`]??""), benefits:string[]=[];
      if(type==="specialty"){
        const skill=String(configuration[`${prefix}_specialty_skill`]??"").trim();
        const specialty=String(configuration[`${prefix}_specialty_name`]??"").trim();
        if(skill||specialty) benefits.push(`${locale==="en-US"?"Specialty":"Especialização"}: ${skill}${skill&&specialty?" (":""}${specialty}${skill&&specialty?")":""}`);
      }
      if(type==="skill"||type==="merit_skill"){
        const skill=String(configuration[`${prefix}_skill`]??"").trim();
        if(skill) benefits.push(`${systemTerm(skill,locale)} +1`);
      }
      if(type==="rote_skills"){
        const skills=Array.isArray(configuration[`${prefix}_rote_skills`])?configuration[`${prefix}_rote_skills`] as string[]:[];
        if(skills.some(Boolean)) benefits.push(`${locale==="en-US"?"Rote Skills":"Perícias de Rota"}: ${skills.filter(Boolean).map((skill)=>systemTerm(skill,locale)).join(", ")}`);
      }
      if(type==="merit"||type==="merits"||type==="merit_skill"){
        const merits=Array.isArray(configuration[`${prefix}_merits`])?configuration[`${prefix}_merits`] as string[]:[];
        benefits.push(...merits.filter((row)=>row.split("|")[0]).map((row)=>{const [merit,rating]=row.split("|");return `${merit} ${"•".repeat(Math.max(1,Number(rating)||1))}`;}));
      }
      if(type==="custom"){
        const custom=String(configuration[`${prefix}_custom`]??"").trim();
        if(custom) benefits.push(custom);
      }
      if(benefits.length) lines.push(`${locale==="en-US"?"Dot":"Nível"} ${level}: ${benefits.join("; ")}`);
    }
    return lines;
  }
  if(name!=="Hedge Duelist") return [];
  const selected=String(normalizeMeritConfiguration(value).firstManeuver??"");
  const variant=HEDGE_DUELIST_VARIANTS.find((item)=>item.label===selected);
  return variant ? [`${variant.label} (${variant.seeming}): ${variant.description}`] : [];
}

export type TokenKind="token"|"trifle"|"bauble";
export type TokenConfigurationItem={id:string;kind:TokenKind;name:string;rating:number;cost:string;effect:string;description:string;crux:string;catch:string;drawback:string};
export type HedgespunBenefit="extraordinary"|"alacrity"|"durability";
export type HedgespunConfiguration={name:string;description:string;extraordinaryDetail:string;benefits:Array<HedgespunBenefit|"">};
export const HEDGESPUN_DRAWBACK:Record<Locale,string>={
  "en-US":"While the item is used, attempts to go unnoticed in plain sight or deflect attention automatically fail and grant a Beat. A non-fae user suffers −1 on tasks requiring concentration or Social interaction.",
  "pt-BR":"Enquanto o item estiver em uso, tentativas de passar despercebido à vista de todos ou desviar atenção falham automaticamente e concedem uma Batida. Um usuário não feérico sofre −1 em tarefas que exigem concentração ou interação Social.",
};
export function encodeConfiguredRows<T>(items:T[]){return items.map((item)=>JSON.stringify(item));}
export function decodeConfiguredRows<T>(value:unknown):T[]{
  if(!Array.isArray(value)) return [];
  return value.flatMap((row)=>{try{const parsed=JSON.parse(String(row));return parsed&&typeof parsed==="object"?[parsed as T]:[];}catch{return [];}});
}
export function decodeHedgespunConfiguration(configuration:MeritConfiguration):HedgespunConfiguration{
  const benefits=(Array.isArray(configuration.benefits)?configuration.benefits:[]).map((item):HedgespunBenefit|""=>["extraordinary","alacrity","durability"].includes(item)?item as HedgespunBenefit:"");
  return {name:String(configuration.name??""),description:String(configuration.description??""),extraordinaryDetail:String(configuration.extraordinary_detail??""),benefits};
}
