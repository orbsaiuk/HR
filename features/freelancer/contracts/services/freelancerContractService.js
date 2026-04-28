import { client, clientRead } from "@/sanity/client";

/**
 * GROQ query: fetch all contracts where this freelancer is the second party.
 * Falls back gracefully if secondPartyUserId is missing (old contracts).
 */
const GET_BY_FREELANCER = `*[_type == "contract" && formData.secondPartyUserId == $clerkId] | order(_createdAt desc) {
  _id,
  "id": _id,
  _type,
  templateId,
  title,
  description,
  type,
  category,
  status,
  formData,
  clauses,
  createdAt,
  updatedAt,
  "organization": organization->{_id, name}
}`;

const VALID_STATUSES = new Set(["received", "accepted", "declined", "expired"]);

/**
 * Fetch all contracts for a freelancer, ordered by newest first.
 */
export async function getContractsByFreelancer(clerkId) {
  if (!clerkId) return [];
  return clientRead.fetch(GET_BY_FREELANCER, { clerkId });
}

/**
 * Update a contract's freelancer-facing status.
 * Valid transitions: received → accepted | declined
 */
export async function updateContractFreelancerStatus(contractId, status) {
  const normalizedStatus = String(status).toLowerCase().trim();

  if (!VALID_STATUSES.has(normalizedStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const now = new Date().toISOString();

  return client
    .patch(contractId)
    .set({
      status: normalizedStatus,
      updatedAt: now,
    })
    .commit();
}

/** Alias — matches company-side `contractService` pattern */
export const freelancerContractService = {
  getContractsByFreelancer,
  updateContractFreelancerStatus,
};
