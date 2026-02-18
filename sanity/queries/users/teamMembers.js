export const teamMembersQueries = {
    /**
     * Get all team members from an organization's embedded teamMembers array.
     * Includes form count for each user (forms created by the user in this org).
     */
    getAll: `*[_type == "organization" && _id == $orgId][0].teamMembers[] | order(joinedAt asc) {
        _key,
        roleKey,
        joinedAt,
        "user": user-> {
            _id,
            clerkId,
            name,
            email,
            avatar,
            bio,
            createdAt
        },
        "formCount": count(*[_type == "form" && createdBy._ref == user->_id && organization._ref == $orgId && status == "published"])
    }`,

    /**
     * Get a team member by their array entry _key within an organization.
     */
    getByKey: `*[_type == "organization" && _id == $orgId][0] {
        "teamMember": teamMembers[_key == $key][0] {
            _key,
            roleKey,
            joinedAt,
            "user": user-> {
                _id,
                clerkId,
                name,
                email,
                avatar,
                bio,
                createdAt
            },
            "formCount": count(*[_type == "form" && createdBy._ref == user->_id && organization._ref == $orgId && status == "published"])
        }
    }.teamMember`,

    /**
     * Find a team member by clerkId across all organizations.
     * Returns the organization and the team member entry.
     * Used for auth purposes to resolve user context.
     */
    getByClerkId: `*[_type == "organization" && $clerkId in teamMembers[].user->clerkId][0] {
        _id,
        name,
        slug,
        clerkOrgId,
        "teamMember": teamMembers[user->clerkId == $clerkId][0] {
            _key,
            roleKey,
            joinedAt,
            "user": user-> {
                _id,
                clerkId,
                name,
                email,
                avatar,
                bio
            }
        }
    }`,

    /**
     * Find a team member by user ID within a specific organization.
     */
    getByUserId: `*[_type == "organization" && _id == $orgId][0] {
        "teamMember": teamMembers[user._ref == $userId][0] {
            _key,
            roleKey,
            joinedAt,
            "user": user-> {
                _id,
                clerkId,
                name,
                email,
                avatar,
                bio,
                createdAt
            }
        }
    }.teamMember`,

    /**
     * Find a team member by clerkId within a specific organization.
     */
    getByClerkIdAndOrg: `*[_type == "organization" && _id == $orgId][0] {
        "teamMember": teamMembers[user->clerkId == $clerkId][0] {
            _key,
            roleKey,
            joinedAt,
            "user": user-> {
                _id,
                clerkId,
                name,
                email,
                avatar,
                bio
            }
        }
    }.teamMember`,
};
