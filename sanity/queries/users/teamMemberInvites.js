export const teamMemberInviteQueries = {
    /**
     * Get all invites from an organization's embedded invites array.
     */
    getAllInvites: `*[_type == "organization" && _id == $orgId][0].invites[] | order(createdAt desc) {
        _key,
        email,
        status,
        roleKey,
        createdAt,
        "invitedBy": invitedBy-> {
            _id,
            name,
            email
        },
        "joinedUser": joinedUser-> {
            _id,
            name,
            email
        }
    }`,

    /**
     * Get a pending invite by email from an organization's embedded invites array.
     */
    getInviteByEmail: `*[_type == "organization" && _id == $orgId][0] {
        "invite": invites[email == $email && status == "pending"][0] {
            _key,
            email,
            status,
            roleKey,
            createdAt,
            "invitedBy": invitedBy-> {
                _id,
                name,
                email
            }
        }
    }.invite`,

    /**
     * Get an invite by its array entry _key.
     */
    getInviteByKey: `*[_type == "organization" && _id == $orgId][0] {
        "invite": invites[_key == $key][0] {
            _key,
            email,
            status,
            roleKey,
            createdAt,
            "invitedBy": invitedBy-> {
                _id,
                name,
                email
            },
            "joinedUser": joinedUser-> {
                _id,
                name,
                email
            }
        }
    }.invite`,

    /**
     * Find the owner (first/earliest joined team member) of an organization.
     * The owner is the first team member who joined (by joinedAt).
     */
    getOwnerTeamMember: `*[_type == "organization" && _id == $orgId][0] {
        "teamMember": teamMembers | order(joinedAt asc) [0] {
            _key,
            roleKey,
            joinedAt,
            "user": user-> {
                _id,
                clerkId,
                name,
                email,
                avatar
            }
        }
    }.teamMember`,

    /**
     * Get all team members from an organization's embedded teamMembers array.
     * Includes form count for each user.
     */
    getAllTeamMembersManaged: `*[_type == "organization" && _id == $orgId][0].teamMembers[] | order(joinedAt asc) {
        _key,
        roleKey,
        joinedAt,
        "user": user-> {
            _id,
            clerkId,
            name,
            email,
            avatar,
            createdAt
        },
        "formCount": count(*[_type == "form" && createdBy._ref == user->_id && organization._ref == $orgId])
    }`,

    /**
     * Find a pending invite by email across all organizations.
     * Used during user signup to find invites for the new user.
     */
    findPendingInviteByEmail: `*[_type == "organization"] {
        _id,
        name,
        "invite": invites[email == $email && status == "pending"][0] {
            _key,
            email,
            status,
            roleKey,
            createdAt,
            "invitedBy": invitedBy-> {
                _id,
                name,
                email
            }
        }
    }[defined(invite)]`,
};
