export const chatQueries = {
  getConversationsByTeamMember: `*[_type == "conversation" && organization._ref == $orgId && teamMember._ref == $userId] | order(lastMessageAt desc) {
    _id,
    teamMember->{_id, name},
    user->{_id, name, avatar},
    relatedForm->{_id, title},
    lastMessageAt,
    createdAt,
    "unreadCount": count(*[_type == "message" && conversationId == ^._id && recipient._ref == $userId && read == false]),
    "lastMessage": *[_type == "message" && conversationId == ^._id] | order(createdAt desc)[0].content
  }`,

  getConversationsByUser: `*[_type == "conversation" && user._ref == $userId] | order(lastMessageAt desc) {
    _id,
    teamMember->{_id, name, avatar},
    user->{_id, name, avatar},
    relatedForm->{_id, title},
    lastMessageAt,
    createdAt,
    "unreadCount": count(*[_type == "message" && conversationId == ^._id && recipient._ref == $userId && read == false]),
    "lastMessage": *[_type == "message" && conversationId == ^._id] | order(createdAt desc)[0].content
  }`,

  getConversationById: `*[_type == "conversation" && _id == $conversationId][0] {
    _id,
    teamMember->{_id, name, clerkId},
    user->{_id, name, clerkId},
    relatedForm->{_id, title},
    lastMessageAt,
    createdAt
  }`,

  getExistingConversation: `*[_type == "conversation" && teamMember._ref == $teamMemberId && user._ref == $userId][0]`,

  getMessagesByConversationId: `*[_type == "message" && conversationId == $conversationId] | order(createdAt asc) {
    _id,
    conversationId,
    sender->{_id, name},
    recipient->{_id, name},
    content,
    read,
    createdAt
  }`,

  getMessageById: `*[_type == "message" && _id == $messageId][0] {
    _id,
    conversationId,
    sender->{_id, name, email},
    recipient->{_id, name, email},
    content,
    read,
    createdAt
  }`,

  getUnreadMessages: `*[_type == "message" && conversationId == $conversationId && recipient._ref == $userId && read == false]._id`,

  getTeamMemberByClerkId: `*[_type == "teamMember" && clerkId == $clerkId][0]._id`,

  getUserByClerkId: `*[_type == "user" && clerkId == $clerkId][0]._id`,
};
