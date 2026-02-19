import {
  countActiveRequestsByUser,
  createOrgRequest,
  fetchRequestsByUser,
  fetchRequestById,
  fetchPendingRequests,
  markRequestRejected,
} from "../repositories/orgRequestRepository";
import {
  sendOrgRequestSubmittedEmail,
  sendOrgRequestRejectedEmail,
} from "@/shared/services/email/orgRequestEmailService";
import { approveRequest } from "./orgApprovalService";

export async function createRequest(userId, data, orgLogoAssetRef, requesterInfo) {
  // Check for existing pending/approved request
  const pendingCount = await countActiveRequestsByUser(userId);

  if (pendingCount > 0) {
    throw Object.assign(
      new Error("You already have an existing organization request"),
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const result = await createOrgRequest({
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

  // Send submission confirmation email (fire-and-forget)
  const recipientEmail = requesterInfo?.email;
  if (recipientEmail) {
    sendOrgRequestSubmittedEmail({
      recipientEmail,
      requesterName: requesterInfo?.name || "there",
      organizationName: data.orgName,
    }).catch((err) =>
      console.error("[OrgRequest] Failed to send submission confirmation email:", err.message),
    );
  }

  return result;
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
  const updated = await markRequestRejected(id, reason, reviewedBy);

  // Send rejection notification email (fire-and-forget)
  const recipientEmail = request.requestedBy?.email;
  if (recipientEmail) {
    sendOrgRequestRejectedEmail({
      recipientEmail,
      requesterName: request.requestedBy?.name || "there",
      organizationName: request.orgName,
      reason,
    }).catch((err) =>
      console.error("[OrgRequest] Failed to send rejection email:", err.message),
    );
  }

  return updated;
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

