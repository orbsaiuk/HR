import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export async function getFreelancerContracts() {
  return apiClient.get(API_ENDPOINTS.FREELANCER_CONTRACTS);
}

export async function updateFreelancerContractStatus(contractId, status) {
  return apiClient.patch(API_ENDPOINTS.FREELANCER_CONTRACT_BY_ID(contractId), {
    status,
  });
}
