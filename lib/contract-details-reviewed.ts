import type { SeemingKey } from "./contract-details";

export interface ReviewedContractDetail {
  dicePool: string;
  cost: string;
  action: string;
  duration: string;
  loophole: string;
  seemingBenefits: Partial<Record<SeemingKey, string>>;
}

// Legacy bilingual review overlays are intentionally disabled during the rebuild.
export const REVIEWED_CONTRACT_DETAILS_PT: Record<string, ReviewedContractDetail> = {};
export const REVIEWED_CONTRACT_DETAILS_EN: Record<string, ReviewedContractDetail> = {};
