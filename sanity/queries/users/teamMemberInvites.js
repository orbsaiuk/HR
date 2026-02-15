export const teamMemberInviteQueries = {
    getAllInvites: `*[_type == "teamMemberInvite" && organization._ref == $orgId] | order(createdAt desc) {
        _id,
        email,
        status,
        createdAt,
        "invitedBy": invitedBy->{
            _id,
            name,
            email
        },
        "teamMember": teamMember->{
            _id,
            name,
            email
        }
    }`,

    getInviteByEmail: `*[_type == "teamMemberInvite" && email == $email && organization._ref == $orgId][0] {
        _id,
        email,
        status,
        createdAt,
        "invitedBy": invitedBy->{
            _id,
            name
        }
    }`,

    getOwnerTeamMember: `*[_type == "teamMember" && organization._ref == $orgId] | order(createdAt asc)[0] {
        _id,
        clerkId,
        name,
        email
    }`,

    getAllTeamMembersManaged: `*[_type == "teamMember" && organization._ref == $orgId] | order(createdAt asc) {
        _id,
        clerkId,
        name,
        email,
        avatar,
        createdAt,
        "formCount": count(*[_type == "form" && teamMember._ref == ^._id])
    }`,
};
