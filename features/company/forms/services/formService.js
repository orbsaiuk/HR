import {
  getFormsByOrg,
  getFormsAssignedToUser as repoGetFormsAssignedToUser,
  getFormsByTeamMember as repoGetFormsByTeamMember,
  getFormById as repoGetFormById,
  createForm as repoCreateForm,
  updateForm as repoUpdateForm,
  deleteForm as repoDeleteForm,
  getPublishedFormsByUser as repoGetPublishedFormsByUser,
  getFormFields as repoGetFormFields,
  checkUserResponse,
  getUserByClerkId,
} from "../repositories/formRepository";
import { currentUser } from "@clerk/nextjs/server";

export async function getForms(orgId) {
  return getFormsByOrg(orgId);
}

export async function getFormsAssignedToUser(orgId, userId) {
  return repoGetFormsAssignedToUser(orgId, userId);
}

export async function getFormsByTeamMember(orgId, userId) {
  return repoGetFormsByTeamMember(orgId, userId);
}

export async function getFormById(id) {
  return repoGetFormById(id);
}

export async function createForm(input, orgId) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userDoc = await getUserByClerkId(user.id);
  if (!userDoc) throw new Error("User not found");

  return repoCreateForm({
    ...input,
    createdBy: { _ref: userDoc._id },
    organization: { _ref: orgId },
  });
}

export async function updateForm(id, input) {
  return repoUpdateForm(id, input);
}

export async function getPublishedFormsByUser(userId) {
  return repoGetPublishedFormsByUser(userId);
}

/**
 * @deprecated Use getPublishedFormsByUser instead
 */
export async function getPublishedFormsByTeamMember(teamMemberId) {
  return getPublishedFormsByUser(teamMemberId);
}

export async function getFormFields(formId) {
  return repoGetFormFields(formId);
}

export { getUserByClerkId };

export async function getExistingResponse(formId, userId) {
  return checkUserResponse(formId, userId);
}

export async function deleteForm(id) {
  return repoDeleteForm(id);
}

export const formService = {
  getForms,
  getFormsByTeamMember,
  getFormsAssignedToUser,
  getFormById,
  getPublishedFormsByUser,
  getPublishedFormsByTeamMember,
  getUserByClerkId,
  getExistingResponse,
  createForm,
  updateForm,
  deleteForm,
};
