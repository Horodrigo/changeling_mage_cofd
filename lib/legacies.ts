type LegacyCharacter = {line_data:Record<string,unknown>;skills:Record<string,number>};

export type LegacyAttainment = {
  rank: 1|2|3|4|5;
  name: string;
  prerequisites: string;
  rulingArcanum: number;
  orthodoxGnosis: number;
  novelGnosis: number;
  description: string;
  optional?: string;
  praxisName?: string;
};

export type LegacyDefinition = {
  id: string;
  name: string;
  source: string;
  page: number;
  parentage: {paths:string[];orders:string[]};
  rulingArcanum: string;
  prerequisites: string;
  initiation: string;
  organization: string;
  theory: string;
  yantras: string[];
  oblations: string[];
  attainments: LegacyAttainment[];
  entryPraxis: string;
};

export type LegacyState = {
  definitionId: string;
  joined: boolean;
  attainmentRanks: number[];
  initiationMethod: ""|"tutelage"|"daimonomikon"|"soul-study";
};

export const ELEVENTH_QUESTION: LegacyDefinition = {
  id:"the-eleventh-question", name:"The Eleventh Question", source:"Mage: The Awakening", page:200,
  parentage:{paths:["Moros"],orders:["Guardians of the Veil","Mysterium"]}, rulingArcanum:"Time",
  prerequisites:"Time 2, Investigation 2, and Academics, Larceny, Medicine, Occult, or Science 2. The mage must also meet the general Legacy requirements for Gnosis and parentage, or qualify through the first-Attainment Praxis exception.",
  initiation:"The prospective Querent must solve the Mystery assigned by the tutor.",
  organization:"Querents have no formal hierarchy and commonly work in pairs. Larger gatherings answer a Legacy-wide emergency or an exceptionally strange Mystery.",
  theory:"All evidence points toward a holistic, ultimate truth. Secrets obstruct enlightenment and must be exposed, although not everyone deserves the knowledge uncovered.",
  yantras:["Succeeding on an Investigation roll relevant to the spell (+2).","Verbally explaining a mysterious phenomenon to a trusted associate (+1).","Collecting samples or recording information relevant to the spell (+2).","Using stimulants to remain focused (+1, or +2 if this creates an adverse Condition)."],
  oblations:["Solving a riddle or puzzle.","Studying esoteric magical theories.","Pursuing an obsessive or antisocial habit.","Giving an extended lecture about an intellectually challenging topic."],
  attainments:[
    {rank:1,name:"The Undisturbed Scene",prerequisites:"Initiation",rulingArcanum:1,orthodoxGnosis:2,novelGnosis:3,praxisName:"Perfect Timing",description:"Emulates Perfect Timing: add Time dots to rolls made to gather information from a location.",optional:"Matter 1: engage Active Mage Sight (Matter) on arrival; pierce supernatural concealment with automatic successes equal to Matter."},
    {rank:2,name:"The Unobvious Answer",prerequisites:"Time 2, Investigation 3",rulingArcanum:2,orthodoxGnosis:2,novelGnosis:3,praxisName:"Postcognition",description:"Study a subject for a turn and duplicate Postcognition, with Potency equal to Time dots and Reach for instant use and sensory range.",optional:"Matter 2: restore diluted or dispersed liquid or particulate matter to a former shape when residue remains, duplicating Shaping by touch."},
    {rank:3,name:"The Chance Answer",prerequisites:"Time 3, Investigation 3, plus the other qualifying Skill at 3 or a second listed Skill at 2",rulingArcanum:3,orthodoxGnosis:4,novelGnosis:5,praxisName:"Divination",description:"Duplicate Divination with Reach for instant use, sensory range, and specific questions, limited to answers the Querent believes her future self will personally discover.",optional:"Matter 3: reshape matching raw material without tools into an object relevant to the Querent's personal future."},
    {rank:4,name:"The Timely Answer",prerequisites:"Time 4, Investigation 4, and the previous additional Skill requirements",rulingArcanum:4,orthodoxGnosis:6,novelGnosis:7,praxisName:"Prophecy",description:"After building a profile for a scene, duplicate Prophecy with Reach for sensory range. A Representational sympathetic Yantra permits use without the subject present.",optional:"Matter 4: create a representational sympathetic Yantra for the target from impressions of the past or emanations of the future."},
    {rank:5,name:"The Penultimate Answer",prerequisites:"Time 5, Investigation 4, plus the qualifying Skill at 4, a second listed Skill at 3, or a third listed Skill at 2",rulingArcanum:5,orthodoxGnosis:8,novelGnosis:9,description:"After a scene of meditation, project consciousness into the mage's own body up to one year in the future for a scene lasting no more than one hour; later visits overwrite earlier ones.",optional:"Matter 5: when that future arrives, create or delete nonmagical material objects using combined factors limited by the lower of Time or Matter."},
  ],
  entryPraxis:"Perfect Timing",
};

export const CHRONOLOGUE:LegacyDefinition={
  id:"chronologue",name:"Chronologue",source:"Night Horrors: Nameless and Accursed",page:39,
  parentage:{paths:["Acanthus"],orders:["Seers of the Throne"]},rulingArcanum:"Time",entryPraxis:"Green Light/Red Light",
  prerequisites:"Time 2, Fate 1, and Computer 2. The mage must also meet the general Legacy requirements for Gnosis and parentage, or qualify through the first-Attainment Praxis exception.",
  initiation:"The initiate commits to rejecting free will in favor of increasingly precise prediction and predestination.",
  organization:"Chronologues arise among Acanthus and the Seers of the Throne, especially mages who use schedules, simulations, and predictive systems to impose an inevitable future.",
  theory:"Free will is error in an insufficient model. Time and predictive computation can refine society into a machine that runs exactly as foreseen.",
  yantras:["Timepieces, calendars, and schedules (+1).","Casting at a time predetermined and agreed to the second (+1, or +2 while opposed or under stress).","Fulfilling a previously established prophecy or predicted doom (+1)."],
  oblations:["Ensure an event occurs exactly as predicted.","Complete at least 12 consecutive hours of productive work without rest.","Repeat the same activity for at least an hour.","Precisely follow a schedule of the mage's own creation."],
  attainments:[
    {rank:1,name:"If-Then-Else",prerequisites:"Initiation (Time 2, Fate 1, Computer 2)",rulingArcanum:1,orthodoxGnosis:2,novelGnosis:3,praxisName:"Green Light/Red Light",description:"Emulates Green Light/Red Light on someone other than the mage. Choose one action the subject might take; performing it can reverse the Attainment from beneficial to detrimental effects, or vice versa. Includes Reach for instant use."},
    {rank:2,name:"Possibility Matrix",prerequisites:"Time 2, Computer 3",rulingArcanum:2,orthodoxGnosis:2,novelGnosis:3,praxisName:"Divination",description:"After a scene coding a digital Imago, emulate Divination at sensory range with detailed answers. Recheck the subject's shifting future every five minutes for up to a scene, even after the subject leaves sensory range. The mage cannot target herself."},
  ],
};

export const LEGACIES=[ELEVENTH_QUESTION,CHRONOLOGUE] as const;
export const findLegacy=(id:unknown)=>LEGACIES.find(item=>item.id===String(id));

const LEGACY_SKILL_ALIASES:Record<string,string[]>={
  Academics:["Academics","Erudição"], Larceny:["Larceny","Furto"], Medicine:["Medicine","Medicina"],
  Occult:["Occult","Ocultismo"], Science:["Science","Ciência"], Investigation:["Investigation","Investigação"], Computer:["Computer","Computação"],
};
const LEGACY_ARCANUM_ALIASES:Record<string,string[]>={Time:["Time","Tempo"],Matter:["Matter","Matéria"],Fate:["Fate","Destino"]};

function aliasedRating(values:Record<string,number>,aliases:string[]){
  return Math.max(0,...aliases.map(name=>Number(values[name]??0)));
}

export function legacySkillRating(skills:Record<string,number>,name:string){
  return aliasedRating(skills,LEGACY_SKILL_ALIASES[name]??[name]);
}

export function legacyArcanumRating(arcana:Record<string,number>,name:string){
  return aliasedRating(arcana,LEGACY_ARCANUM_ALIASES[name]??[name]);
}

export function normalizeLegacyState(value:unknown):LegacyState {
  if(!value||typeof value!=="object")return {definitionId:"",joined:false,attainmentRanks:[],initiationMethod:""};
  const state=value as Record<string,unknown>;
  const method=["tutelage","daimonomikon","soul-study"].includes(String(state.initiationMethod))?String(state.initiationMethod) as LegacyState["initiationMethod"]:"";
  return {definitionId:String(state.definitionId??""),joined:Boolean(state.joined),attainmentRanks:Array.isArray(state.attainmentRanks)?[...new Set(state.attainmentRanks.map(Number).filter(rank=>rank>=1&&rank<=5))].sort():[],initiationMethod:method};
}

export function eleventhQuestionPrerequisites(character:LegacyCharacter){
  const data=character.line_data,gnosis=Number(data.gnosis??1),arcana=(data.arcana??{}) as Record<string,number>;
  const parentage=String(data.path)==="Moros"||["Guardians of the Veil","Mysterium"].includes(String(data.order));
  const praxis=[...(Array.isArray(data.praxes)?data.praxes:[]),...(Array.isArray(data.learned_praxes)?data.learned_praxes:[])].some((item)=>item&&typeof item==="object"&&String((item as Record<string,unknown>).originalName??(item as Record<string,unknown>).name)==="Perfect Timing");
  const time=legacyArcanumRating(arcana,"Time")>=2;
  const investigation=legacySkillRating(character.skills,"Investigation")>=2;
  const qualifying=["Academics","Larceny","Medicine","Occult","Science"].some(skill=>legacySkillRating(character.skills,skill)>=2);
  return {gnosis:gnosis>=2,time,investigation,qualifying,parentage,praxis,met:gnosis>=2&&time&&investigation&&qualifying&&(parentage||praxis)};
}

export function legacyEntryPrerequisites(character:LegacyCharacter,definition:LegacyDefinition){
  if(definition.id==="the-eleventh-question"){
    const result=eleventhQuestionPrerequisites(character);
    return {...result,items:[{label:"Gnosis 2",met:result.gnosis},{label:"Time 2",met:result.time},{label:"Investigation 2",met:result.investigation},{label:"Qualifying Skill 2",met:result.qualifying},{label:"Moros, Guardian/Mysterium, or Perfect Timing Praxis",met:result.parentage||result.praxis}]};
  }
  const data=character.line_data,gnosis=Number(data.gnosis??1),arcana=(data.arcana??{}) as Record<string,number>;
  const parentage=definition.parentage.paths.includes(String(data.path))||definition.parentage.orders.includes(String(data.order));
  const praxis=[...(Array.isArray(data.praxes)?data.praxes:[]),...(Array.isArray(data.learned_praxes)?data.learned_praxes:[])].some(item=>item&&typeof item==="object"&&String((item as Record<string,unknown>).originalName??(item as Record<string,unknown>).name)===definition.entryPraxis);
  const gnosisMet=gnosis>=2,time=legacyArcanumRating(arcana,"Time")>=2,fate=legacyArcanumRating(arcana,"Fate")>=1,computer=legacySkillRating(character.skills,"Computer")>=2;
  return {gnosis:gnosisMet,parentage,praxis,met:gnosisMet&&time&&fate&&computer&&(parentage||praxis),items:[{label:"Gnosis 2",met:gnosisMet},{label:"Time 2",met:time},{label:"Fate 1",met:fate},{label:"Computer 2",met:computer},{label:`Acanthus, Seers of the Throne, or ${definition.entryPraxis} Praxis`,met:parentage||praxis}]};
}

export function legacyAttainmentPrerequisites(character:LegacyCharacter,definition:LegacyDefinition,rank:number){
  const attainment=definition.attainments.find(item=>item.rank===rank);
  if(!attainment)return false;
  const gnosis=Number(character.line_data.gnosis??1),arcana=(character.line_data.arcana??{}) as Record<string,number>;
  if(gnosis<attainment.orthodoxGnosis||legacyArcanumRating(arcana,definition.rulingArcanum)<attainment.rulingArcanum)return false;
  if(definition.id==="chronologue")return rank<2||legacySkillRating(character.skills,"Computer")>=3;
  const qualifying=["Academics","Larceny","Medicine","Occult","Science"].map(skill=>legacySkillRating(character.skills,skill)).sort((a,b)=>b-a);
  const investigation=legacySkillRating(character.skills,"Investigation")>=(rank>=4?4:rank>=2?3:2);
  const additional=rank<3?true:rank<5?(qualifying[0]>=3||qualifying[1]>=2):(qualifying[0]>=4||qualifying[1]>=3||qualifying[2]>=2);
  return investigation&&additional;
}
