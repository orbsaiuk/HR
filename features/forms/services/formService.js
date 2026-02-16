import { client } from "@/sanity/client";
import { currentUser } from "@clerk/nextjs/server";
import { formsQueries } from "@/sanity/queries";

export async function getForms(orgId) {
  return client.fetch(formsQueries.getAll, { orgId });
}

export async function getFormsByTeamMember(orgId, userId) {
  return client.fetch(formsQueries.getByTeamMember, { orgId, userId });
}

export async function getFormById(id) {
  return client.fetch(formsQueries.getById, { id });
}

export async function createForm(input, orgId) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Get the user document from Sanity by clerkId
  const userDoc = await client.fetch(formsQueries.getUserByClerkId, {
    clerkId: user.id,
  });

  if (!userDoc) throw new Error("User not found");

  return client.create({
    _type: "form",
    createdBy: { _type: "reference", _ref: userDoc._id },
    organization: { _type: "reference", _ref: orgId },
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updateForm(id, input) {
  return client
    .patch(id)
    .set({
      ...input,
      updatedAt: new Date().toISOString(),
    })
    .commit();
}

export async function getPublishedFormsByUser(userId) {
  return client.fetch(formsQueries.getPublishedByUser, { userId });
}

/**
 * @deprecated Use getPublishedFormsByUser instead
 */
export async function getPublishedFormsByTeamMember(teamMemberId) {
  return getPublishedFormsByUser(teamMemberId);
}

export async function getFormFields(formId) {
  return client.fetch(formsQueries.getFormFields, { formId });
}

export async function getUserByClerkId(clerkId) {
  return client.fetch(formsQueries.getUserByClerkId, { clerkId });
}

export async function getExistingResponse(formId, userId) {
  return client.fetch(formsQueries.checkUserResponse, { formId, userId });
}

export async function deleteForm(id) {
  // First, check if there are any responses associated with this form
  const responses = await client.fetch(formsQueries.getResponsesByFormId, {
    formId: id,
  });

  // Delete all responses first
  if (responses.length > 0) {
    const transaction = client.transaction();
    responses.forEach((response) => {
      transaction.delete(response._id);
    });
    await transaction.commit();
  }

  // Then delete the form
  await client.delete(id);
}

export const formService = {
  getForms,
  getFormsByTeamMember,
  getFormById,
  getPublishedFormsByUser,
  getPublishedFormsByTeamMember,
  getUserByClerkId,
  getExistingResponse,
  createForm,
  updateForm,
  deleteForm,
};
