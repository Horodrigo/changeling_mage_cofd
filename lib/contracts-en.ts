export type EnglishContractText = {
  description: string;
  summary?: string;
  options?: string[];
  success?: string;
  exceptionalSuccess?: string;
  failure?: string;
  dramaticFailure?: string;
};

// Legacy translation overlays are intentionally disabled during the rebuild.
export const CONTRACT_TEXT_EN: Readonly<Record<string, EnglishContractText>> = {};
