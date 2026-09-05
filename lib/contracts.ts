export type SeemingKey = "Beast" | "Darkling" | "Elemental" | "Fairest" | "Ogre" | "Wizened";

export type ContractDefinition = {
  id: string;
  name: string;
  originalName: string;
  type: "Comum" | "Real";
  categoryKind?: "Corte" | "Independente" | "Regalia";
  regalia: string;
  description: string;
  summary?: string;
  effect?: string;
  hasRoll?: boolean;
  dicePool?: string;
  loophole?: string;
  seemingBenefits?: Partial<Record<SeemingKey, string>>;
  /** One shared Court Contract may expose a different Clause for each member Court. Keys are canonical Court ids. */
  courtClauses?: Record<string, string>;
  courtFamily?: string;
  courtIds?: string[];
  supplementalSeemingBenefits?: Record<string, Partial<Record<SeemingKey, string>>>;
  goblin?: boolean;
  cost?: string;
  action?: string;
  duration?: string;
  success?: string;
  exceptionalSuccess?: string;
  failure?: string;
  dramaticFailure?: string;
  options?: string[];
  detailTables?: Array<{ title: string; columns: string[]; rows: string[][] }>;
  goblinDebt?: string;
  sourceId: string;
  source: string;
  page: number;
};

import { KITH_AND_KIN_CONTRACTS } from "./contracts-kith-and-kin";
import { CORE_CONTRACTS } from "./contracts-core";
import { BOOK_OF_COURTS_CONTRACTS } from "./contracts-book-of-courts";

export const CONTRACTS: ContractDefinition[] = [
  ...BOOK_OF_COURTS_CONTRACTS,
  {
    id: "ctl-oak-ash-thorn:donning-the-grand-mantle",
    name: "Donning the Grand Mantle",
    originalName: "Donning the Grand Mantle",
    type: "Real",
    categoryKind: "Corte",
    regalia: "All",
    description: "The changeling channels the power of her Mantle's patron, drops her Mask, and proclaims her affiliation. Using the Contract more than once per story inflicts Leveraged regarding the patron until the changeling grants the favor or the story ends.",
    hasRoll: true,
    dicePool: "Presence + Expression + Mantle",
    cost: "●● + ○",
    action: "Instant",
    duration: "One scene",
    success: "The changeling immediately gains Mantle 5 for the duration. For each Mantle dot she already had, she regains 1 spent Glamour and gains +1 on rolls closely aligned with the Mantle's themes, including rolls to invoke its Court Contracts.",
    exceptionalSuccess: "This use does not count toward the once-per-story safe limit.",
    failure: "The Contract fails.",
    dramaticFailure: "The changeling gains Leveraged as described, without receiving the Contract's benefits.",
    loophole: "None.",
    sourceId: "ctl-oak-ash-thorn",
    source: "Oak, Ash, and Thorn",
    page: 22,
  },
  {
    id: "ctl-oak-ash-thorn:hidden-protocol",
    name: "Hidden Protocol",
    originalName: "Hidden Protocol",
    type: "Comum",
    categoryKind: "Corte",
    regalia: "Crystal Web",
    description: "The changeling uses any electronic input device to send a message of up to 20 words through the Hedge to a named recipient, without contact information, signal, or network access. The message reaches the recipient through an incidental medium and may be noticed or intercepted; attempts to trace or intercept it oppose the invocation roll.",
    hasRoll: false,
    dicePool: "Wits + Computer + Wyrd",
    cost: "●",
    action: "Instant",
    duration: "Instant",
    loophole: "The changeling sends the message using significantly outdated technology, such as a rotary phone, telegraph, typewriter, or Apple IIe computer.",
    sourceId: "ctl-oak-ash-thorn",
    source: "Oak, Ash, and Thorn",
    page: 24,
  },
  {
    id: "ctl-oak-ash-thorn:autonomous-payload",
    name: "Autonomous Payload",
    originalName: "Autonomous Payload",
    type: "Real",
    categoryKind: "Corte",
    regalia: "Crystal Web",
    description: "Standing on a BriarNet trod, the changeling opens a digital Hedgeway and transforms himself and willing followers into data inside a computer or digital repository. Each repository functions as a Bastion whose Fortification reflects its security. They may Hedgespin to bypass security or alter data, and may travel through connected signals. When the Contract ends, they emerge physically unless it is invoked again. The invocation is opposed by the character with the best access to and control over the repository.",
    hasRoll: false,
    dicePool: "Manipulation + Computer + Mantle vs. (Intelligence or Computer) + Fortification",
    cost: "●●",
    action: "Contested",
    duration: "One scene",
    loophole: "The changeling wears a black or white hat and obeys its ethical implications for the duration. If he violates them, he must pay the Glamour cost or the Contract ends immediately.",
    sourceId: "ctl-oak-ash-thorn",
    source: "Oak, Ash, and Thorn",
    page: 24,
  },
  {
    id: "ctl-oak-ash-thorn:full-fathom-five",
    name: "Full Fathom Five",
    originalName: "Full Fathom Five",
    type: "Comum",
    categoryKind: "Corte",
    regalia: "Crown-of-Thorns",
    description: "On the turn after invocation, the changeling gains a complete mental image of the physical space within Wyrd x 10 yards or meters. She automatically defeats mundane concealment and surprise, gains Mantle as bonus dice against supernatural attempts, ignores darkness and low visibility, is immune to Blinded and Deafened, offsets up to Mantle dice of ranged-attack penalties, and gains Mantle to Initiative and half Mantle (rounded up) to Defense. The effect is conspicuous, soundproofing blocks it, and another loud noise requires Wits + Composure + Mantle to maintain it.",
    hasRoll: false,
    dicePool: "None",
    cost: "●",
    action: "Instant",
    duration: "Wyrd turns in action scenes or Wyrd minutes in other scenes",
    loophole: "The changeling uses a microphone, megaphone, or another means to broadcast her voice much louder than normal, attracting significant mortal attention.",
    sourceId: "ctl-oak-ash-thorn",
    source: "Oak, Ash, and Thorn",
    page: 27,
  },
  {
    id: "ctl-oak-ash-thorn:the-widening-gyre",
    name: "The Widening Gyre",
    originalName: "The Widening Gyre",
    type: "Real",
    categoryKind: "Corte",
    regalia: "Crown-of-Thorns",
    description: "The changeling becomes the center of a moving vortex with a radius of Wyrd x 10 yards or meters and rolls once against every character in range. She may exclude perceived targets for +● each; characters entering later contest normally unless she pays the same cost to exclude them.",
    hasRoll: true,
    dicePool: "Presence + Athletics + Mantle vs. Stamina + Wyrd",
    cost: "●● + ○; +● per excluded target",
    action: "Contested",
    duration: "One scene",
    success: "The target must move their full Speed toward the changeling each turn unless they spend 1 Willpower to anchor themselves for that turn. They may still use their instant action to move normally. Affected characters entering her melee range suffer Knocked Down.",
    exceptionalSuccess: "Anyone who falls prone within the changeling's melee range also suffers Immobilized.",
    failure: "The Contract fails.",
    dramaticFailure: "The changeling only makes herself dizzy and suffers Confused.",
    loophole: "The changeling wears an authentic seafarer's hat, such as a tricorne or dixie cup, when invoking the Contract.",
    sourceId: "ctl-oak-ash-thorn",
    source: "Oak, Ash, and Thorn",
    page: 27,
  },
  {
    id: "ctl-oak-ash-thorn:upholding-the-principle",
    name: "Upholding the Principle",
    originalName: "Upholding the Principle",
    type: "Comum",
    categoryKind: "Corte",
    regalia: "House of In",
    description: "The changeling must possess proof, evidence, or a confession that another changeling betrayed a House member, acted dishonestly or immorally, or intends to do so, then shake the target's hand. Without such evidence, the Contract cannot be invoked merely to discover ill intent.",
    hasRoll: true,
    dicePool: "Presence + Politics + Mantle vs. Resolve + Wyrd",
    cost: "●●",
    action: "Contested",
    duration: "Instant",
    success: "The target gains a temporary Oathbreaker Condition that does not require the Wyrd's additional forgiveness to resolve; while it lasts, the target's mien visibly reflects the transgression.",
    exceptionalSuccess: "The target also cannot say anything they do not believe is true until the end of the chapter.",
    failure: "The Contract fails.",
    dramaticFailure: "The target learns about the changeling's last serious act of disobedience, betrayal, or dishonesty and may inflict Leveraged on him.",
    loophole: "None.",
    sourceId: "ctl-oak-ash-thorn",
    source: "Oak, Ash, and Thorn",
    page: 29,
  },
  {
    id: "ctl-oak-ash-thorn:ancestors-wisdom",
    name: "Ancestors' Wisdom",
    originalName: "Ancestors' Wisdom",
    type: "Real",
    categoryKind: "Corte",
    regalia: "House of In",
    description: "The changeling performs a ceremony lasting at least 10 minutes to summon the ghost of a House of In ancestor.",
    hasRoll: true,
    dicePool: "Presence + Occult + Mantle",
    cost: "●● + ○",
    action: "Instant (takes 10 minutes)",
    duration: "One scene",
    success: "The Storyteller chooses a deceased House member whose ghost appears until the end of the scene with all of that member's memories. The changeling must secure its cooperation.",
    exceptionalSuccess: "The ghost is already willing to cooperate and needs no convincing.",
    failure: "The Contract fails.",
    dramaticFailure: "The changeling instead summons the hostile ghost of a deceased traitor to the House.",
    loophole: "None.",
    sourceId: "ctl-oak-ash-thorn",
    source: "Oak, Ash, and Thorn",
    page: 29,
  },
  {
    id: "ctl-the-hedge:distill-the-hidden",
    name: "Distill the Hidden",
    originalName: "Distill the Hidden",
    type: "Comum",
    categoryKind: "Independente",
    regalia: "Goblin",
    goblin: true,
    description: "The character turns a willing target's personally significant memory into a chosen kind of physical object. The object is permanent but can be lost, broken, consumed, stored, traded, or used as an ingredient. The target forgets the event; another meaningful participant suffers Ravaged or another appropriate effect.",
    hasRoll: false,
    dicePool: "None",
    cost: "● + ○",
    action: "Instant",
    duration: "Permanent",
    loophole: "The creator was also present for the event. She suffers Confused from losing the experience and forgets her own role in it, but remembers what the signature object contains.",
    sourceId: "ctl-the-hedge",
    source: "The Hedge",
    page: 81,
  },
  {
    id: "ctl-the-hedge:wyrd-debt",
    name: "Wyrd Debt",
    originalName: "Wyrd Debt",
    type: "Comum",
    categoryKind: "Independente",
    regalia: "Goblin",
    goblin: true,
    description: "After asking someone three times to repay a debt, the character calls on the Wyrd. The target gains a Condition chosen from Amnesia, Bestial, Blinded, Delusional, Dream Assailant, Fatigued, Glamour Addicted, Hunted, Lethargic, Madness, Mute, or Paranoid; its resolution is repaying the debt rather than its normal resolution.",
    hasRoll: false,
    dicePool: "Presence + Intimidation + Wyrd - Composure",
    cost: "●",
    action: "Instant",
    duration: "One scene",
    loophole: "The character asked the target on three separate occasions.",
    sourceId: "ctl-the-hedge",
    source: "The Hedge",
    page: 81,
  },
  {
    id: "ctl-dark-eras:draw-likeness",
    name: "Draw Likeness",
    originalName: "Draw Likeness",
    type: "Real",
    categoryKind: "Corte",
    regalia: "Retaliation",
    description: "The changeling names a branded criminal, a specific crime, or a general crime and draws the target's likeness on any flat surface that graphite could mark. For a general crime, the target is the nearest person who committed it within the last lunar month; if no such target exists, the Contract fails.",
    hasRoll: true,
    dicePool: "Wits + Investigation + Mantle vs. Composure + Wyrd",
    cost: "●",
    action: "Contested",
    duration: "Instant",
    success: "The image makes matching it to the target's face a rote action and grants one free Clue about the target's whereabouts or recent activity to each person who examines it for the first time.",
    exceptionalSuccess: "Viewers immediately remember when and where they last saw the target, subject to a Clash of Wills against effects that suppress the memory. The image hints at the target's future whereabouts or activity and grants Informed regarding the criminal.",
    failure: "The Contract fails.",
    dramaticFailure: "The intended target learns that the changeling is hunting him and receives information about her as though he were the Contract's target and she had achieved an exceptional success.",
    loophole: "A victim of one of the target's crimes described the target to the changeling during this scene.",
    sourceId: "ctl-dark-eras",
    source: "DE:CtL",
    page: 241,
  },
  {
    id: "ctl-dark-eras:peacemakers-draw",
    name: "Peacemaker's Draw",
    originalName: "Peacemaker's Draw",
    type: "Comum",
    categoryKind: "Corte",
    regalia: "Retaliation",
    description: "The changeling may invoke this Contract at any point in the initiative order, even interrupting another turn. She reflexively readies a ranged weapon or creates a standard one from Glamour and spit, and may invoke it repeatedly in the same turn as ammunition and Glamour permit. Each invocation counts as an attack and ignores cover through impossible ricochets.",
    hasRoll: true,
    dicePool: "Dexterity + (Firearms or Athletics) + Mantle vs. Stamina + Wyrd",
    cost: "●",
    action: "Reflexive and contested",
    duration: "Instant",
    success: "The changeling knocks an item from the target without damage, requiring an instant action to retrieve it; alternatively, she inflicts an appropriate Personal Tilt that the target can remedy with an instant action. The target also gains Leveraged regarding witnesses other than the changeling.",
    exceptionalSuccess: "The changeling chooses where the dislodged item lands. Any Personal Tilt imposed lasts for the scene.",
    failure: "The Contract fails.",
    dramaticFailure: "The Contract fails, and the changeling cannot use it again this scene.",
    loophole: "The target broke a standoff with the changeling within the last turn.",
    sourceId: "ctl-dark-eras",
    source: "DE:CtL",
    page: 241,
  },
  ...KITH_AND_KIN_CONTRACTS,
  ...CORE_CONTRACTS,
];

export const CONTRACT_NAME_ALIASES: Record<string, string> = Object.fromEntries(
  CONTRACTS.flatMap((contract) => [
    [contract.name, contract.id],
    [contract.originalName, contract.id],
  ]),
);

export function findContract(name: string) {
  const id = CONTRACT_NAME_ALIASES[name];
  return CONTRACTS.find(
    (contract) =>
      contract.id === name ||
      contract.id === id ||
      contract.name === name ||
      contract.originalName === name,
  );
}
