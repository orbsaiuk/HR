import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

/**
 * Fetches contracts where the authenticated freelancer is the second party.
 * POST is used because we pass the clerkUserId in the body for
 * server-side auth verification rather than a query param.
 */
export async function getFreelancerContracts() {
  return apiClient.get(API_ENDPOINTS.FREELANCER_CONTRACTS);
}

/**
 * Updates the status of a contract (accept / decline).
 * @param {string} contractId
 * @param {"accepted" | "declined"} status
 */
export async function updateFreelancerContractStatus(contractId, status) {
  return apiClient.patch(API_ENDPOINTS.FREELANCER_CONTRACT_BY_ID(contractId), {
    status,
  });
}
