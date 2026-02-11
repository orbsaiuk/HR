import { client } from "@/sanity/client";
import { teamMembersQueries } from "@/sanity/queries";

export async function getTeamMembers() {
  return client.fetch(teamMembersQueries.getAll);
}

export async function getTeamMemberById(id) {
  return client.fetch(teamMembersQueries.getById, { id });
}

export async function getTeamMemberByClerkId(clerkId) {
  return client.fetch(teamMembersQueries.getByClerkId, { clerkId });
}

export const teamMemberService = {
  getTeamMembers,
  getTeamMemberById,
  getTeamMemberByClerkId,
};
