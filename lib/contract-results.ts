export interface ContractResultDetail {
  action?: string;
  duration?: string;
  success?: string;
  exceptionalSuccess?: string;
  failure?: string;
  dramaticFailure?: string;
  page?: number;
}

// Legacy translated result overlays are intentionally disabled during the rebuild.
export const CONTRACT_RESULTS: Record<string, ContractResultDetail> = {};
