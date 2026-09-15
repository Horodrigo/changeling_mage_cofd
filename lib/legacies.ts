type LegacyCharacter = {line_data:Record<string,unknown>;skills:Record<string,number>;merits?:Array<{name:string;dots:number}>;specializations?:Array<{skill?:string;name?:string}>};

type LegacyRequirements={arcana?:Record<string,number>;skills?:Record<string,number>;anySkills?:{names:string[];rating:number;count?:number};specializations?:Array<{skill:string;includes?:string}>;merits?:Array<{name:string;dots:number}>};

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
  requirements?: LegacyRequirements;
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
  entryRequirements?: LegacyRequirements;
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
  entryRequirements:{arcana:{Time:2},skills:{Investigation:2},anySkills:{names:["Academics","Larceny","Medicine","Occult","Science"],rating:2}},
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
    {rank:1,name:"If-Then-Else",prerequisites:"Initiation (Time 2, Fate 1, Computer 2)",rulingArcanum:1,orthodoxGnosis:2,novelGnosis:3,praxisName:"Green Light/Red Light",requirements:{arcana:{Time:2,Fate:1},skills:{Computer:2}},description:"Emulates Green Light/Red Light on someone other than the mage. Choose one action the subject might take; performing it can reverse the Attainment from beneficial to detrimental effects, or vice versa. Includes Reach for instant use."},
    {rank:2,name:"Possibility Matrix",prerequisites:"Time 2, Computer 3",rulingArcanum:2,orthodoxGnosis:2,novelGnosis:3,praxisName:"Divination",requirements:{arcana:{Time:2},skills:{Computer:3}},description:"After a scene coding a digital Imago, emulate Divination at sensory range with detailed answers. Recheck the subject's shifting future every five minutes for up to a scene, even after the subject leaves sensory range. The mage cannot target herself."},
  ],
  entryRequirements:{arcana:{Time:2,Fate:1},skills:{Computer:2}},
};

export const ENGINEERS_OF_THE_SYSTEM:LegacyDefinition={
  id:"engineers-of-the-system",name:"Engineers of the System",source:"Tome of the Pentacle",page:157,
  parentage:{paths:["Thyrsus"],orders:["Seers of the Throne","Praetorian Ministry"]},rulingArcanum:"Space",entryPraxis:"Correspondence",
  prerequisites:"Space 2, Investigation 2, and Intimidation or Survival 2.",entryRequirements:{arcana:{Space:2},skills:{Investigation:2},anySkills:{names:["Intimidation","Survival"],rating:2}},
  initiation:"The initiate learns to perceive society and living motion as the interacting machinery of a single System.",organization:"The Legacy is rare and often transmitted through isolated Seer mentors.",theory:"Physical and social reality form one machine whose joints can be perceived and manipulated.",
  yantras:["Drawing an abstract schematic connecting physical and social factors for an hour (+2).","Following a trail or visual pattern left by a living being (+1)."],oblations:["Scrawling social and political schematics on the body.","Hunting food through deception or intimidation."],
  attainments:[
    {rank:1,name:"See the Bones and Gears",prerequisites:"Initiation (Space 2, Investigation 2, Intimidation or Survival 2)",rulingArcanum:1,orthodoxGnosis:2,novelGnosis:3,praxisName:"Correspondence",requirements:{arcana:{Space:2},skills:{Investigation:2},anySkills:{names:["Intimidation","Survival"],rating:2}},description:"Duplicates Correspondence with Potency equal to Space. Reach may reveal additional connections or their owners.",optional:"Life 1: for one Mana, also duplicate Web of Life with Potency equal to Life and Reach assigned to Scale."},
    {rank:2,name:"Rebuild the Living Machine",prerequisites:"Space 2, Investigation 3",rulingArcanum:2,orthodoxGnosis:2,novelGnosis:3,praxisName:"Borrow Threads",requirements:{arcana:{Space:2},skills:{Investigation:3}},description:"For one Mana, duplicates Borrow Threads with Potency equal to Space and Reach assigned to Scale.",optional:"Life 2: add +1 Potency to Life spells cast on a target with which the mage has a sympathetic connection."},
    {rank:3,name:"Become the Ecosystem",prerequisites:"Space 3, Investigation 4",rulingArcanum:3,orthodoxGnosis:4,novelGnosis:5,praxisName:"Co-Location",requirements:{arcana:{Space:3},skills:{Investigation:4}},description:"For one Mana, duplicates Co-Location with Potency equal to Space and Reach assigned to Scale.",optional:"Life 3: one inhabited location may also receive Mutable Mask with +2 Reach and Potency equal to the lower of Life or Space, allowing impersonation at a distance."},
  ],
};

export const LEGACIES=[ELEVENTH_QUESTION,CHRONOLOGUE,ENGINEERS_OF_THE_SYSTEM] as const;
export const findLegacy=(id:unknown)=>LEGACIES.find(item=>item.id===String(id));

export function legacySkillRating(skills:Record<string,number>,name:string){
  return Number(skills[name]??0);
}

export function legacyArcanumRating(arcana:Record<string,number>,name:string){
  return Number(arcana[name]??0);
}

function legacyRequirementsMet(character:LegacyCharacter,requirements:LegacyRequirements|undefined){
  if(!requirements)return true;
  const arcana=(character.line_data.arcana??{}) as Record<string,number>;
  if(Object.entries(requirements.arcana??{}).some(([name,rating])=>legacyArcanumRating(arcana,name)<rating))return false;
  if(Object.entries(requirements.skills??{}).some(([name,rating])=>legacySkillRating(character.skills,name)<rating))return false;
  if(requirements.anySkills){const {names,rating,count=1}=requirements.anySkills;if(names.filter(name=>legacySkillRating(character.skills,name)>=rating).length<count)return false;}
  if(requirements.specializations?.some(required=>!(character.specializations??[]).some(item=>legacySkillRating({[String(item.skill??"")]:1},required.skill)>0&&new RegExp(required.includes??".","i").test(String(item.name??"")))))return false;
  if(requirements.merits?.some(required=>(character.merits??[]).filter(item=>item.name===required.name||required.name==="Status"&&/Status/.test(item.name)).reduce((sum,item)=>sum+Number(item.dots||0),0)<required.dots))return false;
  return true;
}

function requirementItems(character:LegacyCharacter,requirements:LegacyRequirements|undefined){
  if(!requirements)return [];
  const arcana=(character.line_data.arcana??{}) as Record<string,number>;
  const items=[...Object.entries(requirements.arcana??{}).map(([name,rating])=>({label:`${name} ${rating}`,met:legacyArcanumRating(arcana,name)>=rating})),...Object.entries(requirements.skills??{}).map(([name,rating])=>({label:`${name} ${rating}`,met:legacySkillRating(character.skills,name)>=rating}))];
  if(requirements.anySkills){const {names,rating,count=1}=requirements.anySkills;items.push({label:`${count>1?`${count} of `:""}${names.join(" /  ")} ${rating}`,met:names.filter(name=>legacySkillRating(character.skills,name)>=rating).length>=count});}
  return items;
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
  const data=character.line_data,gnosis=Number(data.gnosis??1);
  const parentage=definition.parentage.paths.includes(String(data.path))||definition.parentage.orders.includes(String(data.order));
  const praxis=[...(Array.isArray(data.praxes)?data.praxes:[]),...(Array.isArray(data.learned_praxes)?data.learned_praxes:[])].some(item=>item&&typeof item==="object"&&String((item as Record<string,unknown>).originalName??(item as Record<string,unknown>).name)===definition.entryPraxis);
  const gnosisMet=gnosis>=2,mechanical=legacyRequirementsMet(character,definition.entryRequirements);
  return {gnosis:gnosisMet,parentage,praxis,met:gnosisMet&&mechanical&&(parentage||praxis),items:[{label:"Gnosis 2",met:gnosisMet},...requirementItems(character,definition.entryRequirements),{label:[...definition.parentage.paths,...definition.parentage.orders,definition.entryPraxis&&`${definition.entryPraxis} Praxis`].filter(Boolean).join(", "),met:parentage||praxis}]};
}

export function legacyAttainmentPrerequisites(character:LegacyCharacter,definition:LegacyDefinition,rank:number){
  const attainment=definition.attainments.find(item=>item.rank===rank);
  if(!attainment)return false;
  const gnosis=Number(character.line_data.gnosis??1),arcana=(character.line_data.arcana??{}) as Record<string,number>;
  if(gnosis<attainment.orthodoxGnosis||legacyArcanumRating(arcana,definition.rulingArcanum)<attainment.rulingArcanum||!legacyRequirementsMet(character,attainment.requirements))return false;
  if(definition.id!=="the-eleventh-question")return true;
  const qualifying=["Academics","Larceny","Medicine","Occult","Science"].map(skill=>legacySkillRating(character.skills,skill)).sort((a,b)=>b-a);
  const investigation=legacySkillRating(character.skills,"Investigation")>=(rank>=4?4:rank>=2?3:2);
  const additional=rank<3?true:rank<5?(qualifying[0]>=3||qualifying[1]>=2):(qualifying[0]>=4||qualifying[1]>=3||qualifying[2]>=2);
  return investigation&&additional;
}
