export const organizationQueries = {
    getByClerkOrgId: `*[_type == "organization" && clerkOrgId == $clerkOrgId][0] {
        ...,
        roles[] {
            _key,
            name,
            description,
            permissions,
            isSystem,
            createdAt
        }
    }`,
    getBySlug: `*[_type == "organization" && slug.current == $slug][0]`,
    getById: `*[_type == "organization" && _id == $id][0] {
        _id,
        name,
        slug,
        clerkOrgId,
        logo,
        description,
        website,
        industry,
        size,
        location,
        settings,
        roles[] {
            _key,
            name,
            description,
            permissions,
            isSystem,
            createdAt
        },
        createdAt,
        updatedAt
    }`,
    /**
     * Get organization by ID with teamMembers included.
     * Used by auth sync to check membership and clerkOrgId.
     */
    getByIdWithMembers: `*[_type == "organization" && _id == $id][0] {
        _id,
        name,
        clerkOrgId,
        "teamMembers": teamMembers[] {
            _key,
            roleKey,
            "user": user-> { _id, clerkId, name, email }
        }
    }`,
    getAll: `*[_type == "organization"] | order(name asc)`,

    /**
     * Get all team members from the embedded teamMembers array in an organization.
     * Returns team members with their user data expanded.
     */
    getMembers: `*[_type == "organization" && _id == $orgId][0].teamMembers[] | order(joinedAt asc) {
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
    }`,

    /**
     * Find a team member by clerkId within an organization's embedded teamMembers array.
     * Returns the team member entry with user data.
     */
    getTeamMemberByClerkAndOrg: `*[_type == "organization" && _id == $orgId][0] {
        "teamMember": teamMembers[user->clerkId == $clerkId][0] {
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
     * Get all invites from the embedded invites array in an organization.
     */
    getInvites: `*[_type == "organization" && _id == $orgId][0].invites[] | order(createdAt desc) {
        _key,
        email,
        status,
        roleKey,
        createdAt,
        "invitedBy": invitedBy-> { _id, name, email },
        "joinedUser": joinedUser-> { _id, name, email }
    }`,

    /**
     * Find a pending invite by email within an organization's embedded invites array.
     */
    getInviteByEmail: `*[_type == "organization" && _id == $orgId][0] {
        "invite": invites[email == $email && status == "pending"][0] {
            _key,
            email,
            status,
            roleKey,
            createdAt,
            "invitedBy": invitedBy-> { _id, name, email }
        }
    }.invite`,

    /**
     * Find the owner (first admin/earliest joined team member) of an organization.
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
     * Check if an email already belongs to a team member in an organization.
     * Used to prevent duplicate invites for existing members.
     */
    getTeamMemberByEmail: `*[_type == "organization" && _id == $orgId][0].teamMembers[user->email == $email][0]`,

    /**
     * Get all user _ref values from the teamMembers array.
     * Used for idempotent membership checks before adding a new member.
     */
    getTeamMemberUserRefs: `*[_type == "organization" && _id == $orgId][0].teamMembers[].user._ref`,

    /**
     * Public: Get all organizations with career pages enabled, plus their open position count.
     */
    getPublicCompanies: `*[_type == "organization" && settings.careerPageEnabled == true] | order(name asc) {
        _id,
        name,
        "slug": slug.current,
        logo,
        description,
        website,
        industry,
        size,
        location,
        "openPositions": count(*[_type == "jobPosition" && organization._ref == ^._id && status == "open"])
    }`,

    /**
     * Public: Get a single organization by slug with its open positions.
     */
    getPublicCompanyBySlug: `*[_type == "organization" && slug.current == $slug && settings.careerPageEnabled == true][0] {
        _id,
        name,
        "slug": slug.current,
        logo,
        description,
        website,
        industry,
        size,
        location,
        settings,
        createdAt,
        "openPositions": *[_type == "jobPosition" && organization._ref == ^._id && status == "open"] | order(createdAt desc) {
            _id,
            title,
            department,
            description,
            location,
            type,
            salaryMin,
            salaryMax,
            currency,
            deadline,
            applicationMethod,
            createdAt,
            "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
        }
    }`,

    /**
     * Public: Get platform-wide stats for the landing page.
     */
    getPlatformStats: `{
        "totalJobs": count(*[_type == "jobPosition" && status == "open"]),
        "totalCompanies": count(*[_type == "organization" && settings.careerPageEnabled == true]),
        "totalApplications": count(*[_type == "application"])
    }`,

    /**
     * Public: Get featured positions for the landing page (most recent open positions).
     */
    getFeaturedPositions: `*[_type == "jobPosition" && status == "open"] | order(createdAt desc) [0..5] {
        _id,
        title,
        department,
        location,
        type,
        salaryMin,
        salaryMax,
        currency,
        createdAt,
        "organizationName": organization->name,
        "organizationLogo": organization->logo,
        "organizationSlug": organization->slug.current
    }`,
};

