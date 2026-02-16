export const chatQueries = {
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
    createdAt,
    "unreadCount": count(*[_type == "message" && conversationId == ^._id && recipient._ref == $userId && read == false]),
    "lastMessage": *[_type == "message" && conversationId == ^._id] | order(createdAt desc)[0].content
  }`,

  /**
   * Get conversations for a user (applicant).
   * The teamMember field now references user directly.
   */
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

  /**
   * Get a single conversation by ID.
   * The teamMember field now references user directly.
   */
  getConversationById: `*[_type == "conversation" && _id == $conversationId][0] {
    _id,
    teamMember->{_id, name, clerkId, avatar},
    user->{_id, name, clerkId, avatar},
    relatedForm->{_id, title},
    lastMessageAt,
    createdAt
  }`,

  /**
   * Find an existing conversation between a team member (user) and a user (applicant).
   * Both teamMember and user now reference user documents.
   */
  getExistingConversation: `*[_type == "conversation" && teamMember._ref == $teamMemberId && user._ref == $userId][0]`,

  /**
   * Get all messages in a conversation.
   * Sender and recipient now only reference user documents.
   */
  getMessagesByConversationId: `*[_type == "message" && conversationId == $conversationId] | order(createdAt asc) {
    _id,
    conversationId,
    sender->{_id, name, avatar},
    recipient->{_id, name, avatar},
    content,
    read,
    createdAt
  }`,

  /**
   * Get a single message by ID.
   */
  getMessageById: `*[_type == "message" && _id == $messageId][0] {
    _id,
    conversationId,
    sender->{_id, name, email, avatar},
    recipient->{_id, name, email, avatar},
    content,
    read,
    createdAt
  }`,

  /**
   * Get unread message IDs for a user in a conversation.
   */
  getUnreadMessages: `*[_type == "message" && conversationId == $conversationId && recipient._ref == $userId && read == false]._id`,

  /**
   * Find a team member by clerkId within an organization's embedded teamMembers array.
   * Returns the user ID for use in conversation queries.
   */
  getTeamMemberByClerkId: `*[_type == "organization" && _id == $orgId][0] {
    "userId": teamMembers[user->clerkId == $clerkId][0].user->_id
  }.userId`,

  /**
   * Get a user ID by clerkId.
   */
  getUserByClerkId: `*[_type == "user" && clerkId == $clerkId][0]._id`,
};
