export const messagesQueries = {
    /**
     * Get all messages in a conversation.
     * Sender and recipient now only reference user documents.
     */
    getByConversationId: `*[_type == "message" && conversationId == $conversationId] | order(createdAt asc) {
        _id,
        conversationId,
        sender->{_id, name, email, avatar},
        recipient->{_id, name, email, avatar},
        content,
        read,
        createdAt
    }`,

    /**
     * Get conversations for a team member (user) within an organization.
     * The teamMember field now references user directly.
     */
    getConversationsByTeamMember: `*[_type == "conversation" && organization._ref == $orgId && teamMember._ref == $userId] | order(lastMessageAt desc) {
        _id,
        teamMember->{_id, name, avatar},
        user->{_id, name, avatar},
        relatedForm->{_id, title},
        lastMessageAt,
        createdAt
    }`,

    /**
     * Get conversations for a user (applicant).
     */
    getConversationsByUser: `*[_type == "conversation" && user._ref == $userId] | order(lastMessageAt desc) {
        _id,
        teamMember->{_id, name, avatar},
        user->{_id, name, avatar},
        relatedForm->{_id, title},
        lastMessageAt,
        createdAt
    }`,
};
