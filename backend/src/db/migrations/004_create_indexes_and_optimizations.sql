-- Migration: Additional indexes and optimizations
-- Description: Performance optimizations and composite indexes
-- Author: AI Support Agent
-- Date: 2025-12-24

-- ============================================================================
-- ANALYTICS INDEXES
-- ============================================================================

-- Conversation growth tracking (admin dashboard)
-- Note: DATE_TRUNC not supported in index expressions on some PostgreSQL versions
-- CREATE INDEX idx_conversations_daily_stats ON conversations (
--   DATE_TRUNC('day', created_at)
-- );

-- Message volume analytics
-- Note: DATE_TRUNC not supported in index expressions on some PostgreSQL versions
-- CREATE INDEX idx_messages_hourly_stats ON messages (
--   DATE_TRUNC('hour', created_at),
--   role
-- );

-- ============================================================================
-- PERFORMANCE HINTS
-- ============================================================================

-- Analyze tables to update statistics for query planner
ANALYZE conversations;
ANALYZE messages;
ANALYZE faqs;

-- ============================================================================
-- QUERY EXAMPLES FOR COMMON PATTERNS
-- ============================================================================

-- Example 1: Get recent messages for a conversation (uses idx_messages_conversation_created)
-- SELECT * FROM messages
-- WHERE conversation_id = 'uuid-here'
-- ORDER BY created_at DESC
-- LIMIT 10;

-- Example 2: Full-text search FAQs (uses idx_faqs_fts)
-- SELECT id, question, answer,
--        ts_rank(to_tsvector('english', question || ' ' || answer),
--                to_tsquery('english', 'password & reset')) AS rank
-- FROM faqs
-- WHERE to_tsvector('english', question || ' ' || answer) @@ to_tsquery('english', 'password & reset')
--   AND is_active = true
-- ORDER BY rank DESC, priority DESC
-- LIMIT 5;

-- Example 3: Keyword-based FAQ search (uses idx_faqs_keywords)
-- SELECT * FROM faqs
-- WHERE keywords @> ARRAY['password', 'reset']::TEXT[]
--   AND is_active = true
-- ORDER BY priority DESC
-- LIMIT 5;

-- Example 4: Get all conversations for a user (uses idx_conversations_user_identifier)
-- SELECT * FROM conversations
-- WHERE user_identifier = 'user@example.com'
-- ORDER BY created_at DESC;

-- Example 5: Token usage analytics (uses idx_messages_role, idx_messages_created_at)
-- SELECT DATE_TRUNC('day', created_at) AS date,
--        COUNT(*) AS message_count,
--        SUM(tokens_used) AS total_tokens
-- FROM messages
-- WHERE role = 'assistant'
--   AND created_at >= now() - INTERVAL '30 days'
-- GROUP BY DATE_TRUNC('day', created_at)
-- ORDER BY date DESC;

-- ============================================================================
-- MAINTENANCE NOTES
-- ============================================================================

-- For high-volume inserts, consider:
-- 1. Partitioning messages table by created_at (range partitioning)
--    - Use when messages table exceeds 100M rows
--    - Example: Monthly partitions for easy archival

-- 2. Archival strategy for old messages
--    - Move messages older than 6 months to archive table
--    - Use pg_cron or application-level cleanup

-- 3. VACUUM scheduling
--    - Enable autovacuum (should be on by default)
--    - Monitor for bloat: SELECT * FROM pg_stat_all_tables WHERE relname IN ('messages', 'conversations');

-- 4. Index maintenance
--    - REINDEX CONCURRENTLY if indexes become bloated
--    - Monitor index usage: SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
