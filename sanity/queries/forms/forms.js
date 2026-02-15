export const formsQueries = {
    getAll: `*[_type == "form" && organization._ref == $orgId] {
            ...,
            "responseCount": count(*[_type == "response" && form._ref == ^._id])
        } | order(updatedAt desc)`,

    getByTeamMember: `*[_type == "form" && organization._ref == $orgId && teamMember._ref == $teamMemberId] {
            ...,
            "responseCount": count(*[_type == "response" && form._ref == ^._id])
        } | order(updatedAt desc)`,

    getById: `*[_type == "form" && _id == $id][0] {
        ...,
        "responseCount": count(*[_type == "response" && form._ref == ^._id])
    }`,

    getTeamMemberByClerkId: `*[_type == "teamMember" && clerkId == $clerkId][0]`,

    getUserByClerkId: `*[_type == "user" && clerkId == $clerkId][0]`,

    checkUserResponse: `*[_type == "response" && form._ref == $formId && user._ref == $userId][0]`,
};
