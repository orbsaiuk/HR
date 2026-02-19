import {
  countActiveRequestsByUser,
  createOrgRequest,
  fetchRequestsByUser,
  fetchRequestById,
  fetchPendingRequests,
  markRequestRejected,
} from "../repositories/orgRequestRepository";
import { approveRequest } from "./orgApprovalService";

export async function createRequest(userId, data, orgLogoAssetRef) {
  // Check for existing pending/approved request
  const pendingCount = await countActiveRequestsByUser(userId);

  if (pendingCount > 0) {
    throw Object.assign(
      new Error("You already have an existing organization request"),
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  return createOrgRequest({
    _type: "organizationRequest",
    requestedBy: { _type: "reference", _ref: userId },
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone || undefined,
    orgName: data.orgName,
    orgDescription: data.orgDescription || undefined,
    orgLocation: data.orgLocation || undefined,
    orgWebsite: data.orgWebsite || undefined,
    orgIndustry: data.orgIndustry || undefined,
    orgSize: data.orgSize || undefined,
    orgLogo: orgLogoAssetRef
      ? { _type: "image", asset: { _type: "reference", _ref: orgLogoAssetRef } }
      : undefined,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });
}

export async function getRequestsByUser(userId) {
  return fetchRequestsByUser(userId);
}

export async function getRequestById(id) {
  return fetchRequestById(id);
}

export async function rejectRequest(id, reason, adminInfo) {
  const request = await fetchRequestById(id);

  if (!request) {
    throw Object.assign(new Error("Request not found"), { status: 404 });
  }

  if (request.status !== "pending") {
    throw Object.assign(new Error(`Request is already ${request.status}`), {
      status: 400,
    });
  }

  const reviewedBy = adminInfo?.email || adminInfo?.name || "admin";
  return markRequestRejected(id, reason, reviewedBy);
}

export async function getPendingRequests() {
  return fetchPendingRequests();
}

export const orgRequestService = {
  createRequest,
  getRequestsByUser,
  getRequestById,
  approveRequest,
  rejectRequest,
  getPendingRequests,
};
