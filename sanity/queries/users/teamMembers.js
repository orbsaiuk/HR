export const teamMembersQueries = {
    getAll: `*[_type == "teamMember" && organization._ref == $orgId] | order(name asc) {
        _id,
        name,
        email,
        bio,
        avatar,
        createdAt,
        "formCount": count(*[_type == "form" && teamMember._ref == ^._id && status == "published"])
    }`,

    getById: `*[_type == "teamMember" && _id == $id][0] {
        _id,
        name,
        email,
        bio,
        avatar,
        createdAt,
        "formCount": count(*[_type == "form" && teamMember._ref == ^._id && status == "published"])
    }`,

    getByClerkId: `*[_type == "teamMember" && clerkId == $clerkId][0]`,
};
