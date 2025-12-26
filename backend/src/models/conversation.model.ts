import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { Conversation, ConversationWithCount } from '../types/db.types';
import { DatabaseError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

export class ConversationModel {
  async create(
    sessionId: string,
    metadata: Record<string, any> = {},
    userIdentifier?: string
  ): Promise<Conversation> {
    try {
      const query = `
        INSERT INTO conversations (session_id, user_identifier, metadata)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const result = await db.query<Conversation>(query, [
        sessionId,
        userIdentifier || null,
        JSON.stringify(metadata),
      ]);

      logger.info('Conversation created', { sessionId, id: result.rows[0].id });
      return result.rows[0];
    } catch (error: any) {
      logger.error('Error creating conversation', { error, sessionId });
      throw new DatabaseError('Failed to create conversation', error);
    }
  }

  async findBySessionId(sessionId: string): Promise<Conversation | null> {
    try {
      const query = `
        SELECT * FROM conversations
        WHERE session_id = $1
      `;

      const result = await db.query<Conversation>(query, [sessionId]);
      return result.rows[0] || null;
    } catch (error: any) {
      logger.error('Error finding conversation by session ID', { error, sessionId });
      throw new DatabaseError('Failed to find conversation', error);
    }
  }

  async findById(id: string): Promise<Conversation | null> {
    try {
      const query = `
        SELECT * FROM conversations
        WHERE id = $1
      `;

      const result = await db.query<Conversation>(query, [id]);
      return result.rows[0] || null;
    } catch (error: any) {
      logger.error('Error finding conversation by ID', { error, id });
      throw new DatabaseError('Failed to find conversation', error);
    }
  }

  async getWithMessageCount(sessionId: string): Promise<ConversationWithCount | null> {
    try {
      const query = `
        SELECT
          c.*,
          COUNT(m.id)::int AS message_count
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.session_id = $1
        GROUP BY c.id
      `;

      const result = await db.query<ConversationWithCount>(query, [sessionId]);
      return result.rows[0] || null;
    } catch (error: any) {
      logger.error('Error getting conversation with message count', { error, sessionId });
      throw new DatabaseError('Failed to get conversation details', error);
    }
  }

  async updateMetadata(id: string, metadata: Record<string, any>): Promise<void> {
    try {
      const query = `
        UPDATE conversations
        SET metadata = $1
        WHERE id = $2
      `;

      const result = await db.query(query, [JSON.stringify(metadata), id]);

      if (result.rowCount === 0) {
        throw new NotFoundError('Conversation', id);
      }
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Error updating conversation metadata', { error, id });
      throw new DatabaseError('Failed to update conversation', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const query = `DELETE FROM conversations WHERE id = $1`;
      const result = await db.query(query, [id]);

      if (result.rowCount === 0) {
        throw new NotFoundError('Conversation', id);
      }

      logger.info('Conversation deleted', { id });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Error deleting conversation', { error, id });
      throw new DatabaseError('Failed to delete conversation', error);
    }
  }

  async getOrCreate(sessionId: string, metadata: Record<string, any> = {}): Promise<{
    conversation: Conversation;
    created: boolean;
  }> {
    const existing = await this.findBySessionId(sessionId);

    if (existing) {
      return { conversation: existing, created: false };
    }

    const newConversation = await this.create(sessionId, metadata);
    return { conversation: newConversation, created: true };
  }
}

export const conversationModel = new ConversationModel();
