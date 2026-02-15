export const organizationQueries = {
  getByClerkOrgId: `*[_type == "organization" && clerkOrgId == $clerkOrgId][0]`,
  getBySlug: `*[_type == "organization" && slug.current == $slug][0]`,
  getById: `*[_type == "organization" && _id == $id][0] {
        _id,
        name,
        slug,
        clerkOrgId,
        logo,
        description,
        website,
        settings,
        createdAt,
        updatedAt
    }`,
  getAll: `*[_type == "organization"] | order(name asc)`,
  getTeamMemberByClerkAndOrg: `*[_type == "teamMember" && clerkId == $clerkId && organization._ref == $orgId][0]`,
  getMembers: `*[_type == "teamMember" && organization._ref == $orgId] | order(createdAt asc) {
        _id,
        name,
        email,
        clerkId,
        role,
        createdAt
    }`,
};
