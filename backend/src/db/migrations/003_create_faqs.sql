-- Migration: Create FAQs table
-- Description: Stores knowledge base with full-text search capabilities
-- Author: AI Support Agent
-- Date: 2025-12-24

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for category filtering (common query pattern)
CREATE INDEX idx_faqs_category ON faqs (category)
WHERE is_active = true;

-- Index for priority-based ordering (higher priority FAQs shown first)
CREATE INDEX idx_faqs_priority ON faqs (priority DESC, created_at DESC)
WHERE is_active = true;

-- GIN index for keyword array searching (@>, &&, <@ operators)
-- Supports: SELECT * FROM faqs WHERE keywords @> ARRAY['password', 'reset']
CREATE INDEX idx_faqs_keywords ON faqs USING GIN (keywords);

-- Full-text search index (most important for FAQ retrieval)
-- Combines question + answer for comprehensive search
-- IMPORTANT: Always specify language in queries: to_tsquery('english', 'search terms')
CREATE INDEX idx_faqs_fts ON faqs USING GIN (
  to_tsvector('english', question || ' ' || answer)
);

-- Alternative: Separate indexes for question vs answer if you need to weight differently
-- CREATE INDEX idx_faqs_fts_question ON faqs USING GIN (to_tsvector('english', question));
-- CREATE INDEX idx_faqs_fts_answer ON faqs USING GIN (to_tsvector('english', answer));

-- Index for active FAQs (exclude inactive from most queries)
CREATE INDEX idx_faqs_active ON faqs (is_active, priority DESC)
WHERE is_active = true;

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE faqs IS 'Knowledge base for AI agent with full-text search';
COMMENT ON COLUMN faqs.id IS 'Internal UUID primary key';
COMMENT ON COLUMN faqs.question IS 'FAQ question text';
COMMENT ON COLUMN faqs.answer IS 'FAQ answer text (injected into LLM prompt)';
COMMENT ON COLUMN faqs.category IS 'FAQ category (billing, technical, general, etc.)';
COMMENT ON COLUMN faqs.keywords IS 'Array of keywords for simple matching (lowercase recommended)';
COMMENT ON COLUMN faqs.priority IS 'Display priority (higher = more important)';
COMMENT ON COLUMN faqs.is_active IS 'Soft delete flag (inactive FAQs excluded from queries)';

-- Constraint to ensure non-empty question and answer
ALTER TABLE faqs ADD CONSTRAINT chk_question_not_empty
  CHECK (LENGTH(TRIM(question)) > 0);

ALTER TABLE faqs ADD CONSTRAINT chk_answer_not_empty
  CHECK (LENGTH(TRIM(answer)) > 0);

-- Constraint to ensure priority is reasonable
ALTER TABLE faqs ADD CONSTRAINT chk_priority_range
  CHECK (priority >= 0 AND priority <= 100);
