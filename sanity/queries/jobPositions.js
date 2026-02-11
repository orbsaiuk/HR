export const jobPositionQueries = {
  getAll: `*[_type == "jobPosition" && teamMember._ref == $teamMemberId] | order(createdAt desc) {
        _id,
        title,
        department,
        description,
        location,
        type,
        salaryMin,
        salaryMax,
        currency,
        status,
        deadline,
        createdAt,
        updatedAt,
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

  getByTeamMemberId: `*[_type == "jobPosition" && teamMember._ref == $teamMemberId] | order(createdAt desc) {
        _id,
        title,
        status
    }`,

  getStats: `{
        "total": count(*[_type == "jobPosition" && teamMember._ref == $teamMemberId]),
        "open": count(*[_type == "jobPosition" && teamMember._ref == $teamMemberId && status == "open"]),
        "closed": count(*[_type == "jobPosition" && teamMember._ref == $teamMemberId && status == "closed"]),
        "onHold": count(*[_type == "jobPosition" && teamMember._ref == $teamMemberId && status == "on-hold"]),
        "draft": count(*[_type == "jobPosition" && teamMember._ref == $teamMemberId && status == "draft"])
    }`,
};
