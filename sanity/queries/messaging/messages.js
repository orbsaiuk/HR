export const messagesQueries = {
    getByConversationId: `*[_type == "message" && conversationId == $conversationId] | order(createdAt asc)`,

    getConversationsByTeamMember: `*[_type == "conversation" && organization._ref == $orgId && teamMember._ref == $teamMemberId] | order(lastMessageAt desc)`,

    getConversationsByUser: `*[_type == "conversation" && user._ref == $userId] | order(lastMessageAt desc)`,
};
