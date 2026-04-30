import {
  getContractsByFreelancerClerkId,
  getContractByIdForFreelancer,
  updateContractFreelancerStatusRepo,
} from "@/features/company/contracts/repositories/contractRepository";
import { clientRead } from "@/sanity/client";

const VALID_STATUSES = new Set(["received", "accepted", "declined", "expired"]);

/**
 * Fetch a single contract by id for a freelancer.
 */
export async function getContractById(id, clerkId) {
  if (!id || !clerkId) return null;
  const contract = await getContractByIdForFreelancer(id, clerkId);
  if (!contract) return null;
  
  if (contract.organization?._id) {
    const orgs = await clientRead.fetch(
      `*[_type == "organization" && _id == $orgId]{_id, name}`,
      { orgId: contract.organization._id }
    );
    if (orgs?.[0]) {
      contract.organization.name = orgs[0].name;
    } else {
      contract.organization.name = contract.formData?.firstPartyCompanyName || "Unknown Organization";
    }
  }
  
  return contract;
}

/**
 * Fetch all contracts for a freelancer, ordered by newest first.
 */
export async function getContractsByFreelancer(clerkId) {
  if (!clerkId) return [];
  const contracts = await getContractsByFreelancerClerkId(clerkId);
  
  // Backfill organization names from sanity
  // To avoid N+1, gather org ids, fetch them, map them.
  const orgIds = [...new Set(contracts.map(c => c.organization?._id).filter(Boolean))];
  
  if (orgIds.length > 0) {
    const orgs = await clientRead.fetch(
      `*[_type == "organization" && _id in $orgIds]{_id, name}`,
      { orgIds }
    );
    const orgMap = new Map(orgs.map(o => [o._id, o]));
    
    return contracts.map(contract => ({
      ...contract,
      organization: {
        _id: contract.organization?._id,
        name: orgMap.get(contract.organization?._id)?.name || contract.formData?.firstPartyCompanyName || "Unknown Organization"
      }
    }));
  }
  
  return contracts;
}

/**
 * Update a contract's freelancer-facing status.
 * Valid transitions: received → accepted | declined
 */
export async function updateContractFreelancerStatus(contractId, clerkId, status) {
  const normalizedStatus = String(status).toLowerCase().trim();

  if (!VALID_STATUSES.has(normalizedStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return updateContractFreelancerStatusRepo(contractId, clerkId, normalizedStatus);
}

/** Alias — matches company-side `contractService` pattern */
export const freelancerContractService = {
  getContractById,
  getContractsByFreelancer,
  updateContractFreelancerStatus,
};
