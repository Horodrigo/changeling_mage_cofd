export type SeemingKey = "Beast" | "Darkling" | "Elemental" | "Fairest" | "Ogre" | "Wizened";
export interface ContractDetail {
  dicePool?: string | null;
  loophole?: string | null;
  seemingBenefits: Partial<Record<SeemingKey, string>>;
  source?: string;
  page?: number;
  missing?: string;
}

// Legacy extracted details are intentionally disabled during the rebuild.
export const CONTRACT_DETAILS: Record<string, ContractDetail> = {};
