import { v4 as uuidv4 } from 'uuid';
import { conversationModel } from '../models/conversation.model';
import { messageModel } from '../models/message.model';
import { faqService } from './faqService';
import { cacheService } from './cacheService';
import { openRouterService } from './llm/openrouterService';
import { promptBuilder } from './llm/promptBuilder';
import { env } from '../config/env';
import { ChatMessageRequest, ChatMessageResponse } from '../types/api.types';
import { NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';

class ConversationService {
  async handleMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    const startTime = Date.now();
    const sessionId = request.sessionId || uuidv4();

    try {
      const { conversation, created } = await conversationModel.getOrCreate(
        sessionId,
        request.metadata || {}
      );

      await messageModel.create(
        conversation.id,
        'user',
        request.message
      );

      let conversationHistory = await cacheService.getCachedConversationContext(
        conversation.id
      );

      if (!conversationHistory) {
        conversationHistory = await messageModel.getRecentMessages(
          conversation.id,
          env.CONVERSATION_HISTORY_LIMIT
        );

        if (conversationHistory.length > 0) {
          await cacheService.cacheConversationContext(
            conversation.id,
            conversationHistory
          );
        }
      }

      const faqs = await faqService.retrieveRelevantFAQs(request.message);

      const prompt = promptBuilder.build(
        request.message,
        faqs,
        conversationHistory
      );

      const { content, tokensUsed } = await openRouterService.generateResponse(prompt);

      const assistantMessage = await messageModel.create(
        conversation.id,
        'assistant',
        content,
        tokensUsed,
        {
          model: env.OPENROUTER_MODEL,
          faqsUsed: faqs.length,
          latency: Date.now() - startTime,
        }
      );

      await cacheService.invalidateConversationCache(conversation.id);

      logger.info('Message handled successfully', {
        sessionId,
        conversationId: conversation.id,
        userMessageLength: request.message.length,
        aiResponseLength: content.length,
        tokensUsed,
        latency: Date.now() - startTime,
        faqsRetrieved: faqs.length,
        conversationCreated: created,
      });

      const response: ChatMessageResponse = {
        sessionId: conversation.session_id,
        message: {
          id: assistantMessage.id,
          role: 'assistant',
          content: assistantMessage.content,
          createdAt: assistantMessage.created_at.toISOString(),
        },
      };

      if (created) {
        response.conversationCreated = true;
      }

      return response;
    } catch (error) {
      logger.error('Error handling message', {
        error,
        sessionId,
        messageLength: request.message.length,
      });
      throw error;
    }
  }

  async getConversationHistory(
    sessionId: string,
    limit: number = 50,
    beforeMessageId?: string
  ) {
    const conversation = await conversationModel.getWithMessageCount(sessionId);

    if (!conversation) {
      throw new NotFoundError('Conversation', sessionId);
    }

    const { messages, hasMore, nextCursor } = await messageModel.getAllWithPagination(
      conversation.id,
      limit,
      beforeMessageId
    );

    return {
      conversation: {
        id: conversation.id,
        sessionId: conversation.session_id,
        createdAt: conversation.created_at.toISOString(),
        updatedAt: conversation.updated_at.toISOString(),
        messageCount: conversation.message_count,
      },
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.created_at.toISOString(),
      })),
      pagination: {
        hasMore,
        nextCursor,
      },
    };
  }

  async getConversation(sessionId: string) {
    const conversation = await conversationModel.findBySessionId(sessionId);

    if (!conversation) {
      throw new NotFoundError('Conversation', sessionId);
    }

    return conversation;
  }

  async deleteConversation(sessionId: string): Promise<void> {
    const conversation = await conversationModel.findBySessionId(sessionId);

    if (!conversation) {
      throw new NotFoundError('Conversation', sessionId);
    }

    await conversationModel.delete(conversation.id);
    await cacheService.invalidateConversationCache(conversation.id);

    logger.info('Conversation deleted', { sessionId, id: conversation.id });
  }
}

export const conversationService = new ConversationService();
