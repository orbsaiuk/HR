export const applicationQueries = {
    /**
     * Get all applications for positions in the organization.
     * Scoped by organization via the jobPosition's organization reference.
     */
    getByOrgId: `*[_type == "application" && jobPosition->organization._ref == $orgId] | order(appliedAt desc) {
        _id,
        status,
        rating,
        appliedAt,
        updatedAt,
        "applicant": applicant->{
            _id,
            name,
            email
        },
        "jobPosition": jobPosition->{
            _id,
            title,
            department,
            status
        }
    }`,

    /**
     * Get all applications for positions owned by a specific recruiter within the org.
     * Used for "my applications" attribution view.
     */
    getByTeamMemberId: `*[_type == "application" && jobPosition->organization._ref == $orgId && jobPosition->teamMember._ref == $teamMemberId] | order(appliedAt desc) {
        _id,
        status,
        rating,
        appliedAt,
        updatedAt,
        "applicant": applicant->{
            _id,
            name,
            email
        },
        "jobPosition": jobPosition->{
            _id,
            title,
            department,
            status
        }
    }`,

    /**
     * Get all applications for a specific position
     */
    getByPositionId: `*[_type == "application" && jobPosition._ref == $positionId] | order(appliedAt desc) {
        _id,
        status,
        rating,
        notes,
        appliedAt,
        updatedAt,
        "applicant": applicant->{
            _id,
            name,
            email
        },
        "jobPosition": jobPosition->{
            _id,
            title,
            department
        }
    }`,

    /**
     * Get single application with full details including answers
     */
    getById: `*[_type == "application" && _id == $id][0] {
        _id,
        status,
        rating,
        notes,
        rejectionReason,
        answers,
        appliedAt,
        updatedAt,
        "applicant": applicant->{
            _id,
            name,
            email
        },
        "jobPosition": jobPosition->{
            _id,
            title,
            department,
            description,
            status,
            type,
            location
        },
        "form": form->{
            _id,
            title,
            fields
        }
    }`,

    /**
     * Get applications submitted by a specific user
     */
    getByUserId: `*[_type == "application" && applicant._ref == $userId] | order(appliedAt desc) {
        _id,
        status,
        appliedAt,
        updatedAt,
        "jobPosition": jobPosition->{
            _id,
            title,
            department,
            location,
            type
        }
    }`,

    /**
     * Stats for recruiter dashboard — scoped by organization
     */
    getStats: `{
        "total": count(*[_type == "application" && jobPosition->organization._ref == $orgId]),
        "new": count(*[_type == "application" && jobPosition->organization._ref == $orgId && status == "new"]),
        "screening": count(*[_type == "application" && jobPosition->organization._ref == $orgId && status == "screening"]),
        "interview": count(*[_type == "application" && jobPosition->organization._ref == $orgId && status == "interview"]),
        "offered": count(*[_type == "application" && jobPosition->organization._ref == $orgId && status == "offered"]),
        "hired": count(*[_type == "application" && jobPosition->organization._ref == $orgId && status == "hired"]),
        "rejected": count(*[_type == "application" && jobPosition->organization._ref == $orgId && status == "rejected"])
    }`,

    /**
     * Check if a user already applied to a position
     */
    checkDuplicate: `count(*[_type == "application" && jobPosition._ref == $positionId && applicant._ref == $userId])`,
};
