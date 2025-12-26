import { db } from '../config/database';
import { Message } from '../types/db.types';
import { DatabaseError } from '../utils/errors';
import { logger } from '../utils/logger';

export class MessageModel {
  async create(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    tokensUsed?: number,
    metadata: Record<string, any> = {}
  ): Promise<Message> {
    try {
      const query = `
        INSERT INTO messages (conversation_id, role, content, tokens_used, metadata)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const result = await db.query<Message>(query, [
        conversationId,
        role,
        content,
        tokensUsed || null,
        JSON.stringify(metadata),
      ]);

      logger.debug('Message created', {
        conversationId,
        role,
        id: result.rows[0].id,
      });

      return result.rows[0];
    } catch (error: any) {
      logger.error('Error creating message', { error, conversationId, role });
      throw new DatabaseError('Failed to create message', error);
    }
  }

  async findById(id: string): Promise<Message | null> {
    try {
      const query = `SELECT * FROM messages WHERE id = $1`;
      const result = await db.query<Message>(query, [id]);
      return result.rows[0] || null;
    } catch (error: any) {
      logger.error('Error finding message by ID', { error, id });
      throw new DatabaseError('Failed to find message', error);
    }
  }

  async getConversationHistory(
    conversationId: string,
    limit: number = 10,
    beforeMessageId?: string
  ): Promise<Message[]> {
    try {
      let query: string;
      let params: any[];

      if (beforeMessageId) {
        const beforeMessage = await this.findById(beforeMessageId);
        if (!beforeMessage) {
          return [];
        }

        query = `
          SELECT * FROM messages
          WHERE conversation_id = $1
            AND created_at < $2
          ORDER BY created_at DESC
          LIMIT $3
        `;
        params = [conversationId, beforeMessage.created_at, limit];
      } else {
        query = `
          SELECT * FROM messages
          WHERE conversation_id = $1
          ORDER BY created_at DESC
          LIMIT $2
        `;
        params = [conversationId, limit];
      }

      const result = await db.query<Message>(query, params);
      return result.rows.reverse();
    } catch (error: any) {
      logger.error('Error getting conversation history', { error, conversationId });
      throw new DatabaseError('Failed to get conversation history', error);
    }
  }

  async getRecentMessages(conversationId: string, limit: number = 10): Promise<Message[]> {
    try {
      const query = `
        SELECT * FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;

      const result = await db.query<Message>(query, [conversationId, limit]);
      return result.rows.reverse();
    } catch (error: any) {
      logger.error('Error getting recent messages', { error, conversationId });
      throw new DatabaseError('Failed to get recent messages', error);
    }
  }

  async countByConversation(conversationId: string): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*)::int as count
        FROM messages
        WHERE conversation_id = $1
      `;

      const result = await db.query<{ count: number }>(query, [conversationId]);
      return result.rows[0]?.count || 0;
    } catch (error: any) {
      logger.error('Error counting messages', { error, conversationId });
      throw new DatabaseError('Failed to count messages', error);
    }
  }

  async getAllWithPagination(
    conversationId: string,
    limit: number = 50,
    beforeMessageId?: string
  ): Promise<{ messages: Message[]; hasMore: boolean; nextCursor?: string }> {
    try {
      const messages = await this.getConversationHistory(
        conversationId,
        limit + 1,
        beforeMessageId
      );

      const hasMore = messages.length > limit;
      const result = hasMore ? messages.slice(0, limit) : messages;
      const nextCursor = hasMore ? result[result.length - 1].id : undefined;

      return {
        messages: result,
        hasMore,
        nextCursor,
      };
    } catch (error: any) {
      logger.error('Error getting paginated messages', { error, conversationId });
      throw new DatabaseError('Failed to get paginated messages', error);
    }
  }

  async deleteByConversation(conversationId: string): Promise<void> {
    try {
      const query = `DELETE FROM messages WHERE conversation_id = $1`;
      await db.query(query, [conversationId]);
      logger.info('Messages deleted for conversation', { conversationId });
    } catch (error: any) {
      logger.error('Error deleting messages', { error, conversationId });
      throw new DatabaseError('Failed to delete messages', error);
    }
  }

  async getTotalTokensUsed(conversationId: string): Promise<number> {
    try {
      const query = `
        SELECT COALESCE(SUM(tokens_used), 0)::int as total
        FROM messages
        WHERE conversation_id = $1
          AND role = 'assistant'
      `;

      const result = await db.query<{ total: number }>(query, [conversationId]);
      return result.rows[0]?.total || 0;
    } catch (error: any) {
      logger.error('Error calculating total tokens', { error, conversationId });
      throw new DatabaseError('Failed to calculate tokens', error);
    }
  }
}

export const messageModel = new MessageModel();
