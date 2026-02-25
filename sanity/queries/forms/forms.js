export const formsQueries = {
    getAll: `*[_type == "form" && organization._ref == $orgId] {
            ...,
            "assignedTo": assignedTo[]->{
                _id,
                name,
                email,
                avatar
            },
            "responseCount": count(*[_type == "response" && form._ref == ^._id])
        } | order(updatedAt desc)`,

    /**
     * Get forms created by a specific user within an organization.
     * Uses createdBy._ref instead of the old teamMember._ref.
     */
    getByTeamMember: `*[_type == "form" && organization._ref == $orgId && createdBy._ref == $userId] {
            ...,
            "responseCount": count(*[_type == "response" && form._ref == ^._id])
        } | order(updatedAt desc)`,

    /**
     * Get forms assigned to a user — either as creator or in assignedTo array.
     * Used for resource-level permissions: users with view_forms but not manage_forms
     * can only see forms they are assigned to.
     */
    getAssignedToUser: `*[_type == "form" && organization._ref == $orgId && (createdBy._ref == $userId || $userId in assignedTo[]._ref)] {
            ...,
            "assignedTo": assignedTo[]->{
                _id,
                name,
                email,
                avatar
            },
            "responseCount": count(*[_type == "response" && form._ref == ^._id])
        } | order(updatedAt desc)`,

    getById: `*[_type == "form" && _id == $id][0] {
        ...,
        "assignedTo": assignedTo[]->{
            _id,
            name,
            email,
            avatar
        },
        "responseCount": count(*[_type == "response" && form._ref == ^._id])
    }`,

    /**
     * Find a team member by clerkId within an organization's embedded teamMembers array.
     * Returns the team member entry with user data.
     */
    getTeamMemberByClerkId: `*[_type == "organization" && _id == $orgId][0] {
        "teamMember": teamMembers[user->clerkId == $clerkId][0] {
            _key,
            role,
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

    getUserByClerkId: `*[_type == "user" && clerkId == $clerkId][0]`,

    checkUserResponse: `*[_type == "response" && form._ref == $formId && user._ref == $userId][0]`,

    /**
     * Get only the fields of a form by its ID
     */
    getFormFields: `*[_type == "form" && _id == $formId][0]{ fields }`,

    /**
     * Get published forms created by a user (by user _id) with response count.
     * Uses createdBy._ref instead of the old teamMember._ref.
     */
    getPublishedByUser: `*[_type == "form" && createdBy._ref == $userId && status == "published"] | order(updatedAt desc) {
      _id,
      title,
      description,
      status,
      "responseCount": count(*[_type == "response" && form._ref == ^._id]),
      "organizationName": organization->name,
      createdAt,
      updatedAt
    }`,

    /**
     * Get all responses for a form (used for cascade deletion)
     */
    getResponsesByFormId: `*[_type == "response" && form._ref == $formId]`,
};
