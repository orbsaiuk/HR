import { client } from "@/sanity/client";
import { currentUser } from "@clerk/nextjs/server";
import { jobPositionQueries } from "@/sanity/queries";
import { getUserByClerkId } from "@/features/auth/services/userService";

export async function getJobPositions(orgId) {
  return client.fetch(jobPositionQueries.getAll, { orgId });
}

export async function getJobPositionById(id) {
  return client.fetch(jobPositionQueries.getById, { id });
}

export async function getJobPositionStats(orgId) {
  return client.fetch(jobPositionQueries.getStats, { orgId });
}

export async function createJobPosition(input, orgId) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userDoc = await getUserByClerkId(user.id);
  if (!userDoc) throw new Error("User not found");

  const doc = {
    _type: "jobPosition",
    recruiter: { _type: "reference", _ref: userDoc._id },
    organization: { _type: "reference", _ref: orgId },
    title: input.title,
    department: input.department || "",
    description: input.description || "",
    requirements: input.requirements || "",
    location: input.location || "",
    type: input.type || "full-time",
    salaryMin: input.salaryMin || null,
    salaryMax: input.salaryMax || null,
    currency: input.currency || "USD",
    applicationMethod: input.applicationMethod || "form",
    status: input.status || "draft",
    deadline: input.deadline || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Link form if provided
  if (input.formId) {
    doc.form = { _type: "reference", _ref: input.formId };
  }

  return client.create(doc);
}

export async function updateJobPosition(id, input) {
  const updates = { ...input, updatedAt: new Date().toISOString() };

  // Handle form reference
  if (input.formId !== undefined) {
    if (input.formId) {
      updates.form = { _type: "reference", _ref: input.formId };
    } else {
      updates.form = null;
    }
    delete updates.formId;
  }

  return client.patch(id).set(updates).commit();
}

export async function deleteJobPosition(id) {
  return client.delete(id);
}

export async function updateJobPositionStatus(id, status) {
  return client
    .patch(id)
    .set({ status, updatedAt: new Date().toISOString() })
    .commit();
}

export const jobPositionService = {
  getJobPositions,
  getJobPositionById,
  getJobPositionStats,
  createJobPosition,
  updateJobPosition,
  deleteJobPosition,
  updateJobPositionStatus,
};
