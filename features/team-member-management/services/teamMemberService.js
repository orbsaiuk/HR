import { client } from "@/sanity/client";
import { teamMembersQueries } from "@/sanity/queries";

export async function getTeamMemberById(id) {
  return client.fetch(teamMembersQueries.getById, { id });
}

export async function getTeamMemberByClerkId(clerkId) {
  return client.fetch(teamMembersQueries.getByClerkId, { clerkId });
}

export async function createTeamMember(data) {
  return client.create(data);
}

export async function updateTeamMember(id, updates) {
  return client.patch(id).set(updates).commit();
}

export async function deleteTeamMember(id) {
  return client.delete(id);
}

export const teamMemberService = {
  getTeamMemberById,
  getTeamMemberByClerkId,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
