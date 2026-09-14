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

export type VampireReference = {
  clans: VampireClanDefinition[];
  covenants: VampireCovenantDefinition[];
  anchors: VampireAnchorDefinition[];
  bloodPotency: BloodPotencyRow[];
  torpor: TorporRow[];
};

export type VampirePowerLevel = {
  rating: number;
  name: string;
  translatedName: string;
  cost?: string;
  dicePool?: string;
  action?: string;
  duration?: string;
  summary: string;
};

export type VampireDisciplineDefinition = {
  id: string;
  name: string;
  translatedName: string;
  physical?: boolean;
  summary: string;
  levels: VampirePowerLevel[];
  source: string;
  page: number;
};

export type VampirePurchasablePower = {
  id: string;
  kind: "devotion" | "cruac-rite" | "theban-miracle" | "coil" | "scale";
  name: string;
  translatedName: string;
  rating?: number;
  prerequisites?: string;
  cost?: string;
  dicePool?: string;
  action?: string;
  duration?: string;
  experienceCost?: number;
  summary: string;
  source: string;
  page: number;
  levels?: VampirePowerLevel[];
};

export type VampirePowers = {
  disciplines: VampireDisciplineDefinition[];
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
