export const roleQueries = {
    /**
     * Get all roles for an organization
     */
    getAllRoles: `*[_type == "organization" && _id == $orgId][0].roles`,

    /**
     * Get a single role by its _key
     */
    getRoleByKey: `*[_type == "organization" && _id == $orgId][0].roles[_key == $roleKey][0]`,

    /**
     * Count team members assigned to a specific role
     */
    countMembersWithRole: `count(*[_type == "organization" && _id == $orgId][0].teamMembers[roleKey == $roleKey])`,

    /**
     * Count pending invites assigned to a specific role
     */
    countInvitesWithRole: `count(*[_type == "organization" && _id == $orgId][0].invites[roleKey == $roleKey && status == "pending"])`,
};
