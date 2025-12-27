import { redis } from '../config/redis';
import { env } from '../config/env';
import { FAQ, Message } from '../types/db.types';
import { logger } from '../utils/logger';

class CacheService {
  private readonly FAQ_PREFIX = 'faq:';
  private readonly MESSAGE_HISTORY_PREFIX = 'messages:';

  async cacheFAQs(userMessage: string, faqs: FAQ[]): Promise<void> {
    try {
      const key = this.getFAQCacheKey(userMessage);
      const value = JSON.stringify(faqs);
      await redis.set(key, value, env.FAQ_CACHE_TTL);

      logger.debug('FAQs cached', { key, count: faqs.length });
    } catch (error) {
      logger.error('Error caching FAQs', { error, userMessage });
    }
  }

  async getCachedFAQs(userMessage: string): Promise<FAQ[] | null> {
    try {
      const key = this.getFAQCacheKey(userMessage);
      const cached = await redis.get(key);

      if (!cached) {
        return null;
      }

      const faqs = JSON.parse(cached) as FAQ[];
      logger.debug('FAQs retrieved from cache', { key, count: faqs.length });
      return faqs;
    } catch (error) {
      logger.error('Error retrieving cached FAQs', { error, userMessage });
      return null;
    }
  }

  async cacheConversationContext(
    conversationId: string,
    messages: Message[]
  ): Promise<void> {
    try {
      const key = this.getMessageHistoryKey(conversationId);
      const value = JSON.stringify(messages);
      await redis.set(key, value, env.CONVERSATION_CACHE_TTL);

      logger.debug('Conversation context cached', {
        conversationId,
        messageCount: messages.length,
      });
    } catch (error) {
      logger.error('Error caching conversation context', { error, conversationId });
    }
  }

  async getCachedConversationContext(
    conversationId: string
  ): Promise<Message[] | null> {
    try {
      const key = this.getMessageHistoryKey(conversationId);
      const cached = await redis.get(key);

      if (!cached) {
        return null;
      }

      const messages = JSON.parse(cached) as Message[];
      logger.debug('Conversation context retrieved from cache', {
        conversationId,
        messageCount: messages.length,
      });
      return messages;
    } catch (error) {
      logger.error('Error retrieving cached conversation context', {
        error,
        conversationId,
      });
      return null;
    }
  }

  async invalidateConversationCache(conversationId: string): Promise<void> {
    try {
      const key = this.getMessageHistoryKey(conversationId);
      await redis.del(key);
      logger.debug('Conversation cache invalidated', { conversationId });
    } catch (error) {
      logger.error('Error invalidating conversation cache', { error, conversationId });
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await redis.set(key, serialized, ttlSeconds);
    } catch (error) {
      logger.error('Error setting cache value', { error, key });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      if (!cached) {
        return null;
      }
      return JSON.parse(cached) as T;
    } catch (error) {
      logger.error('Error getting cache value', { error, key });
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error('Error deleting cache value', { error, key });
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return await redis.exists(key);
    } catch (error) {
      logger.error('Error checking cache key existence', { error, key });
      return false;
    }
  }

  private getFAQCacheKey(userMessage: string): string {
    const normalized = userMessage.toLowerCase().trim().replace(/\s+/g, ' ');
    const hash = this.simpleHash(normalized);
    return `${this.FAQ_PREFIX}${hash}`;
  }

  private getMessageHistoryKey(conversationId: string): string {
    return `${this.MESSAGE_HISTORY_PREFIX}${conversationId}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

export const cacheService = new CacheService();
