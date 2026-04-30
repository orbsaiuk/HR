-- ============================================================
-- 002: Messaging (Conversations + Messages)
-- Mirrors: sanity/schemas/messaging/conversation.js
--          sanity/schemas/messaging/message.js
-- ============================================================

CREATE TABLE IF NOT EXISTS conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Team member (company side): references user by Sanity _id
  team_member_id  TEXT NOT NULL,

  -- User (candidate/freelancer side): references user by Sanity _id
  user_id         TEXT NOT NULL,

  -- Organization: references org by Sanity _id
  org_id          TEXT,

  -- Related form (optional): references form by Sanity _id or PG UUID
  related_form_id TEXT,

  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint: one conversation per team_member + user pair per org
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique_pair
  ON conversations (team_member_id, user_id, org_id);

-- Index for listing conversations by team member
CREATE INDEX IF NOT EXISTS idx_conversations_team_member
  ON conversations (team_member_id, last_message_at DESC);

-- Index for listing conversations by user
CREATE INDEX IF NOT EXISTS idx_conversations_user
  ON conversations (user_id, last_message_at DESC);


CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FK to conversations table
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Sender: references user by Sanity _id
  sender_id       TEXT NOT NULL,

  -- Recipient: references user by Sanity _id
  recipient_id    TEXT NOT NULL,

  content         TEXT NOT NULL,

  read            BOOLEAN NOT NULL DEFAULT FALSE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fetching messages in a conversation (paginated)
CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages (conversation_id, created_at ASC);

-- Index for counting unread messages
CREATE INDEX IF NOT EXISTS idx_messages_unread
  ON messages (recipient_id, read) WHERE read = FALSE;

-- Enable Supabase Realtime on the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
