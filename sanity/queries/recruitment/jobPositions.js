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
        "teamMember": teamMember->{
            _id,
            name,
            email
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
        "teamMember": teamMember->{
            _id,
            name,
            email
        },
        "form": form->{
            _id,
            title,
            status
        },
        "applicationCount": count(*[_type == "application" && jobPosition._ref == ^._id])
    }`,

    getByTeamMemberId: `*[_type == "jobPosition" && organization._ref == $orgId && teamMember._ref == $teamMemberId] | order(createdAt desc) {
        _id,
        title,
        status
    }`,

    getStats: `{
        "total": count(*[_type == "jobPosition" && organization._ref == $orgId]),
        "open": count(*[_type == "jobPosition" && organization._ref == $orgId && status == "open"]),
        "closed": count(*[_type == "jobPosition" && organization._ref == $orgId && status == "closed"]),
        "onHold": count(*[_type == "jobPosition" && organization._ref == $orgId && status == "on-hold"]),
        "draft": count(*[_type == "jobPosition" && organization._ref == $orgId && status == "draft"])
    }`,
};
