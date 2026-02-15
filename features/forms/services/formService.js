import { client } from "@/sanity/client";
import { currentUser } from "@clerk/nextjs/server";
import { formsQueries } from "@/sanity/queries";

export async function getForms(orgId) {
  return client.fetch(formsQueries.getAll, { orgId });
}

export async function getFormsByTeamMember(orgId, teamMemberId) {
  return client.fetch(formsQueries.getByTeamMember, { orgId, teamMemberId });
}

export async function getFormById(id) {
  return client.fetch(formsQueries.getById, { id });
}

export async function createForm(input, orgId) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Get team member from Sanity
  const teamMember = await client.fetch(formsQueries.getTeamMemberByClerkId, {
    clerkId: user.id,
  });

  if (!teamMember) throw new Error("Team member not found");

  return client.create({
    _type: "form",
    teamMember: { _type: "reference", _ref: teamMember._id },
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

export async function getPublishedFormsByTeamMember(teamMemberId) {
  return client.fetch(
    `*[_type == "form" && teamMember._ref == $teamMemberId && status == "published"] | order(updatedAt desc) {
      _id,
      title,
      description,
      status,
      "responseCount": count(*[_type == "response" && form._ref == ^._id]),
      "organizationName": organization->name,
      createdAt,
      updatedAt
    }`,
    { teamMemberId },
  );
}

export async function getFormFields(formId) {
  return client.fetch(`*[_type == "form" && _id == $formId][0]{ fields }`, {
    formId,
  });
}

export async function getUserByClerkId(clerkId) {
  return client.fetch(formsQueries.getUserByClerkId, { clerkId });
}

export async function getExistingResponse(formId, userId) {
  return client.fetch(formsQueries.checkUserResponse, { formId, userId });
}

export async function deleteForm(id) {
  // First, check if there are any responses associated with this form
  const responses = await client.fetch(
    `*[_type == "response" && form._ref == $formId]`,
    { formId: id },
  );

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
  getPublishedFormsByTeamMember,
  getUserByClerkId,
  getExistingResponse,
  createForm,
  updateForm,
  deleteForm,
};
