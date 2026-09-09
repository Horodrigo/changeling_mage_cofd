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
    {rank:1,name:"The Undisturbed Scene",prerequisites:"Initiation",rulingArcanum:1,orthodoxGnosis:2,novelGnosis:3,description:"Emulates Perfect Timing: add Time dots to rolls made to gather information from a location.",optional:"Matter 1: engage Active Mage Sight (Matter) on arrival; pierce supernatural concealment with automatic successes equal to Matter."},
    {rank:2,name:"The Unobvious Answer",prerequisites:"Time 2, Investigation 3",rulingArcanum:2,orthodoxGnosis:2,novelGnosis:3,description:"Study a subject for a turn and duplicate Postcognition, with Potency equal to Time dots and Reach for instant use and sensory range.",optional:"Matter 2: restore diluted or dispersed liquid or particulate matter to a former shape when residue remains, duplicating Shaping by touch."},
    {rank:3,name:"The Chance Answer",prerequisites:"Time 3, Investigation 3, plus the other qualifying Skill at 3 or a second listed Skill at 2",rulingArcanum:3,orthodoxGnosis:4,novelGnosis:5,description:"Duplicate Divination with Reach for instant use, sensory range, and specific questions, limited to answers the Querent believes her future self will personally discover.",optional:"Matter 3: reshape matching raw material without tools into an object relevant to the Querent's personal future."},
    {rank:4,name:"The Timely Answer",prerequisites:"Time 4, Investigation 4, and the previous additional Skill requirements",rulingArcanum:4,orthodoxGnosis:6,novelGnosis:7,description:"After building a profile for a scene, duplicate Prophecy with Reach for sensory range. A Representational sympathetic Yantra permits use without the subject present.",optional:"Matter 4: create a representational sympathetic Yantra for the target from impressions of the past or emanations of the future."},
    {rank:5,name:"The Penultimate Answer",prerequisites:"Time 5, Investigation 4, plus the qualifying Skill at 4, a second listed Skill at 3, or a third listed Skill at 2",rulingArcanum:5,orthodoxGnosis:8,novelGnosis:9,description:"After a scene of meditation, project consciousness into the mage's own body up to one year in the future for a scene lasting no more than one hour; later visits overwrite earlier ones.",optional:"Matter 5: when that future arrives, create or delete nonmagical material objects using combined factors limited by the lower of Time or Matter."},
  ],
};

export const LEGACIES=[ELEVENTH_QUESTION] as const;

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
  const qualifying=["Academics","Larceny","Medicine","Occult","Science"].some(skill=>Number(character.skills[skill]??0)>=2);
  return {gnosis:gnosis>=2,time:Number(arcana.Time??0)>=2,investigation:Number(character.skills.Investigation??0)>=2,qualifying,parentage,praxis,met:gnosis>=2&&Number(arcana.Time??0)>=2&&Number(character.skills.Investigation??0)>=2&&qualifying&&(parentage||praxis)};
}
