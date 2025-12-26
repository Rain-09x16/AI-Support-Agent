-- Migration: Create conversations table
-- Description: Stores chat sessions with session management
-- Author: AI Support Agent
-- Date: 2025-12-24

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  user_identifier TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast session lookup (most common query pattern)
CREATE UNIQUE INDEX idx_conversations_session_id ON conversations (session_id);

-- Index for recent conversations (analytics/monitoring)
CREATE INDEX idx_conversations_created_at ON conversations (created_at DESC);

-- Index for user-specific queries (if user_identifier is used)
CREATE INDEX idx_conversations_user_identifier ON conversations (user_identifier)
WHERE user_identifier IS NOT NULL;

-- GIN index for metadata queries (flexible querying of session attributes)
CREATE INDEX idx_conversations_metadata ON conversations USING GIN (metadata);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE conversations IS 'Stores chat session metadata and tracking';
COMMENT ON COLUMN conversations.id IS 'Internal UUID primary key';
COMMENT ON COLUMN conversations.session_id IS 'Client-generated session identifier for session continuity';
COMMENT ON COLUMN conversations.user_identifier IS 'Optional user identifier (email, user_id, etc.)';
COMMENT ON COLUMN conversations.metadata IS 'Flexible storage for session attributes (user agent, IP, referrer, etc.)';
