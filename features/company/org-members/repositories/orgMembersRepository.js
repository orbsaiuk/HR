import { clientRead } from "@/sanity/client";
import { teamMembersQueries } from "@/sanity/queries";

export async function getTeamMemberByUserId(orgId, userId) {
  return await clientRead.fetch(teamMembersQueries.getByUserId, {
    orgId,
    userId,
  });
}
