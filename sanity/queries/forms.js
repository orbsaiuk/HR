export const formsQueries = {
  getAll: (teamMemberId) =>
    teamMemberId
      ? `*[_type == "form" && teamMember._ref == $teamMemberId] {
            ...,
            "responseCount": count(*[_type == "response" && form._ref == ^._id])
        } | order(updatedAt desc)`
      : `*[_type == "form"] {
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
