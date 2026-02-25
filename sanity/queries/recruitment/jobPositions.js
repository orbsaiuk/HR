export const jobPositionQueries = {
    getAll: `*[_type == "jobPosition" && organization._ref == $orgId] | order(createdAt desc) {
        _id,
        title,
        department,
        description,
        location,
        type,
        salaryMin,
        salaryMax,
        currency,
        applicationMethod,
        status,
        deadline,
        createdAt,
        updatedAt,
        "recruiter": recruiter->{
            _id,
            name,
            email,
            avatar
        },
        "assignedTo": assignedTo[]->{
            _id,
            name,
            email,
            avatar
        },
        "form": form->{
            _id,
            title,
            status
        },
        "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
    }`,

    getById: `*[_type == "jobPosition" && _id == $id][0] {
        _id,
        title,
        department,
        description,
        requirements,
        location,
        type,
        salaryMin,
        salaryMax,
        currency,
        applicationMethod,
        status,
        deadline,
        createdAt,
        updatedAt,
        "recruiter": recruiter->{
            _id,
            name,
            email,
            avatar
        },
        "assignedTo": assignedTo[]->{
            _id,
            name,
            email,
            avatar
        },
        "form": form->{
            _id,
            title,
            status
        },
        "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
    }`,

    /**
     * Get job positions by recruiter (user) ID.
     * Uses recruiter._ref instead of the old teamMember._ref.
     */
    getByTeamMemberId: `*[_type == "jobPosition" && organization._ref == $orgId && recruiter._ref == $userId] | order(createdAt desc) {
        _id,
        title,
        status
    }`,

    /**
     * Get job positions assigned to a user — either as recruiter (creator) or in assignedTo array.
     * Used for resource-level permissions: users with view_positions but not manage_positions
     * can only see positions they are assigned to.
     */
    getAssignedToUser: `*[_type == "jobPosition" && organization._ref == $orgId && (recruiter._ref == $userId || $userId in assignedTo[]._ref)] | order(createdAt desc) {
        _id,
        title,
        department,
        description,
        location,
        type,
        salaryMin,
        salaryMax,
        currency,
        applicationMethod,
        status,
        deadline,
        createdAt,
        updatedAt,
        "recruiter": recruiter->{
            _id,
            name,
            email,
            avatar
        },
        "assignedTo": assignedTo[]->{
            _id,
            name,
            email,
            avatar
        },
        "form": form->{
            _id,
            title,
            status
        },
        "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
    }`,

    /**
     * Get the organization reference from a job position (for denormalization)
     */
    getOrganizationRef: `*[_type == "jobPosition" && _id == $id][0]{ organization }`,

    getStats: `{
        "total": count(*[_type == "jobPosition" && organization._ref == $orgId]),
        "open": count(*[_type == "jobPosition" && organization._ref == $orgId && status == "open"]),
        "closed": count(*[_type == "jobPosition" && organization._ref == $orgId && status == "closed"]),
        "onHold": count(*[_type == "jobPosition" && organization._ref == $orgId && status == "on-hold"]),
        "draft": count(*[_type == "jobPosition" && organization._ref == $orgId && status == "draft"])
    }`,
};
