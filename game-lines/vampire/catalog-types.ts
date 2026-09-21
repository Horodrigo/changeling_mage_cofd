export type VampireClanDefinition = {
  id: string;
  name: string;
  translatedName: string;
  favoredAttributes: [string, string];
  disciplines: [string, string, string];
  baneName: string;
  baneSummary: string;
  source: string;
  page: number;
};

export type VampireCovenantDefinition = {
  id: string;
  name: string;
  translatedName: string;
  advantage: string;
  description: string;
  source: string;
  page: number;
};

export type VampireAnchorDefinition = {
  id: string;
  name: string;
  translatedName: string;
  singleWillpower: string;
  allWillpower: string;
  source: string;
  page: number;
};

export type BloodPotencyRow = {
  rating: number;
  traitMaximum: number;
  vitaeMaximum: number | "Stamina";
  vitaePerTurn: number;
  feedingTier: "Animals" | "Humans" | "Kindred";
};

export type TorporRow = { humanityMinimum: number; humanityMaximum: number; duration: string };

export type VampireBloodlineDefinition = {
  id: string;
  name: string;
  translatedName: string;
  parentClan: string;
  requirements?: string;
  nicknames: string[];
  favoredAttributes: [string, string];
  disciplines: [string, string, string, string];
  exclusiveDiscipline?: string;
  summary: string;
  baneName: string;
  baneSummary: string;
  sourceId: string;
  source: string;
  page: number;
};

export type VampireReference = {
  clans: VampireClanDefinition[];
  covenants: VampireCovenantDefinition[];
  anchors: VampireAnchorDefinition[];
  bloodPotency: BloodPotencyRow[];
  torpor: TorporRow[];
  bloodlines: VampireBloodlineDefinition[];
};

export type VampireRollResults = {
  dramaticFailure?: string;
  failure?: string;
  success?: string;
  exceptionalSuccess?: string;
};

export type VampireSuggestedModifier = {
  modifier: string;
  situation: string;
};

export type VampireRuleEffect = {
  rule:
    | "daysleep"
    | "lethargic"
    | "blush-duration"
    | "frenzy-trigger"
    | "fire-damage"
    | "sunlight-interval-blood-potency"
    | "kindred-senses-blood-potency"
    | "predatory-aura-blood-potency"
    | "ride-the-wave-cost"
    | "ride-the-wave-pool"
    | "frenzy-defense"
    | "frenzy-health"
    | "frenzy-speed"
    | "torpor-on-lethal"
    | "vitae-addiction"
    | "blood-sympathy"
    | "blood-bond"
    | "discipline-resistance"
    | "embrace-humanity";
  operation: "ignore" | "set" | "add" | "reduce" | "replace" | "multiply";
  value?: string | number | boolean;
  minimum?: number;
  condition?: string;
  notes?: string;
};

export type VampireMechanics = {
  cost?: string;
  requirement?: string;
  condition?: string;
  dicePool?: string;
  action?: string;
  duration?: string;
  targetSuccesses?: number;
  contestedBy?: string;
  resistedBy?: string;
  sacrament?: string;
  effect?: string;
  procedure?: string;
  outcome?: string;
  rollResults?: VampireRollResults;
  suggestedModifiers?: VampireSuggestedModifier[];
  ruleEffects?: VampireRuleEffect[];
  manualOnly?: boolean;
  reversible?: boolean;
};

export type VampirePowerLevel = VampireMechanics & {
  rating: number;
  name: string;
  translatedName: string;
  summary: string;
};

export type VampireDisciplineDefinition = VampireMechanics & {
  id: string;
  name: string;
  translatedName: string;
  physical?: boolean;
  bloodlineId?: string;
  summary: string;
  levels: VampirePowerLevel[];
  source: string;
  page: number;
};

export type VampireRitualDisciplineDefinition = VampireMechanics & {
  id: "cruac" | "theban";
  name: string;
  translatedName: string;
  ritualKind: "cruac-rite" | "theban-miracle";
  experienceCostPerDot: number;
  freeRitualPerDot: boolean;
  maximumRitualRating: "discipline-rating";
  statusRequirement: string;
  humanityCapFormula?: string;
  minimumHumanityToCast?: "ritual-rating";
  summary: string;
  source: string;
  page: number;
};

export type VampirePurchasablePower = VampireMechanics & {
  id: string;
  kind: "devotion" | "cruac-rite" | "theban-miracle" | "coil" | "scale";
  name: string;
  translatedName: string;
  rating?: number;
  prerequisites?: string;
  experienceCost?: number;
  summary: string;
  source: string;
  page: number;
  levels?: VampirePowerLevel[];
};

export type VampirePowers = {
  disciplines: VampireDisciplineDefinition[];
  ritualDisciplines: VampireRitualDisciplineDefinition[];
  devotions: VampirePurchasablePower[];
  cruacRites: VampirePurchasablePower[];
  thebanMiracles: VampirePurchasablePower[];
  coils: VampirePurchasablePower[];
  scales: VampirePurchasablePower[];
};

export type VampireCondition = {
  id: string;
  name: string;
  originalName: string;
  category: string;
  description: string;
  penalty?: string;
  persistent?: boolean;
  resolution?: string;
  beat?: string;
  source: string;
  sourceCode: "VtR";
  page: number;
};
