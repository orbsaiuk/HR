import {
  getJobPositionsByOrg,
  getJobPositionsAssignedToUser as repoGetJobPositionsAssignedToUser,
  getJobPositionById as repoGetJobPositionById,
  getJobPositionStats as repoGetJobPositionStats,
  createJobPosition as repoCreateJobPosition,
  updateJobPosition as repoUpdateJobPosition,
  deleteJobPosition as repoDeleteJobPosition,
  updateJobPositionStatus as repoUpdateJobPositionStatus,
} from "../repositories/jobPositionRepository";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/features/shared/auth/services/userService";

export async function getJobPositions(orgId) {
  return getJobPositionsByOrg(orgId);
}

export async function getJobPositionsAssignedToUser(orgId, userId) {
  return repoGetJobPositionsAssignedToUser(orgId, userId);
}

export async function getJobPositionById(id) {
  return repoGetJobPositionById(id);
}

export async function getJobPositionStats(orgId) {
  return repoGetJobPositionStats(orgId);
}

export async function createJobPosition(input, orgId) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userDoc = await getUserByClerkId(user.id);
  if (!userDoc) throw new Error("User not found");

  const doc = {
    recruiter_id: userDoc._id,
    org_id: orgId,
    title: input.title,
    department: input.department || "",
    description: input.description || "",
    requirements: input.requirements || "",
    location: input.location || "",
    type: input.type || "full-time",
    seniority: input.seniority || "mid",
    salaryMin: input.salaryMin || null,
    salaryMax: input.salaryMax || null,
    currency: input.currency || "USD",
    applicationMethod: input.applicationMethod || "form",
    status: input.status || "open",
    deadline: input.deadline || null,
    isUrgent: Boolean(input.isUrgent),
  };

  if (input.assignedTo !== undefined) {
    doc.assignedTo = (input.assignedTo || []).map((userId) => ({ _ref: userId }));
  }

  if (input.formId) {
    doc.form_id = input.formId;
  }

  return repoCreateJobPosition(doc);
}

export async function updateJobPosition(id, input) {
  return repoUpdateJobPosition(id, input);
}

export async function deleteJobPosition(id) {
  return repoDeleteJobPosition(id);
}

export async function updateJobPositionStatus(id, status) {
  return repoUpdateJobPositionStatus(id, status);
}

export const jobPositionService = {
  getJobPositions,
  getJobPositionsAssignedToUser,
  getJobPositionById,
  getJobPositionStats,
  createJobPosition,
  updateJobPosition,
  deleteJobPosition,
  updateJobPositionStatus,
};
