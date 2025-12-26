-- Migration: Create messages table
-- Description: Stores all chat messages (user + AI) with conversation history
-- Author: AI Support Agent
-- Date: 2025-12-24

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRITICAL: Index on FK for join performance and delete operations
-- Without this, deleting conversations would lock the entire messages table
CREATE INDEX idx_messages_conversation_id ON messages (conversation_id);

-- Composite index for fetching recent messages in a conversation (most common query)
-- Supports: SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 10
CREATE INDEX idx_messages_conversation_created ON messages (conversation_id, created_at DESC);

-- Partial index for recent messages (hot data optimization)
-- Most queries fetch recent messages; older messages rarely accessed
-- Note: Commented out due to now() function limitation in index predicates
-- CREATE INDEX idx_messages_recent ON messages (conversation_id, created_at DESC)
-- WHERE created_at > now() - INTERVAL '7 days';

-- Index for analytics queries (token usage tracking)
CREATE INDEX idx_messages_created_at ON messages (created_at DESC);

-- Index for role-based filtering (e.g., get all AI responses)
CREATE INDEX idx_messages_role ON messages (role)
WHERE role IN ('assistant', 'user');

-- GIN index for metadata queries (model version, latency, error tracking)
CREATE INDEX idx_messages_metadata ON messages USING GIN (metadata);

-- Storage optimization: Use fillfactor=90 to leave space for HOT updates
-- This is beneficial if you update metadata frequently (e.g., adding latency info)
ALTER TABLE messages SET (fillfactor = 90);

-- Comments for documentation
COMMENT ON TABLE messages IS 'Stores all chat messages with full conversation history';
COMMENT ON COLUMN messages.id IS 'Internal UUID primary key';
COMMENT ON COLUMN messages.conversation_id IS 'Foreign key to conversations table';
COMMENT ON COLUMN messages.role IS 'Message sender: user, assistant (AI), or system';
COMMENT ON COLUMN messages.content IS 'Message text content';
COMMENT ON COLUMN messages.tokens_used IS 'LLM token usage for this message (null for user messages)';
COMMENT ON COLUMN messages.metadata IS 'Flexible storage for message attributes (model, latency, error info, etc.)';
COMMENT ON COLUMN messages.created_at IS 'Message timestamp (immutable)';

-- Constraint to ensure tokens_used is only set for assistant messages
ALTER TABLE messages ADD CONSTRAINT chk_tokens_assistant_only
  CHECK (
    (role = 'assistant' AND tokens_used IS NOT NULL) OR
    (role != 'assistant' AND tokens_used IS NULL)
  );
