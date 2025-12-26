import { Router } from 'express';
import { conversationService } from '../services/conversationService';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody, validateParams, validateQuery } from '../middleware/validateRequest';
import { chatRateLimiter, chatRateLimiterHourly } from '../middleware/rateLimiter';
import {
  ChatMessageRequestSchema,
  ConversationHistoryParamsSchema,
  ConversationHistoryQuerySchema,
} from '../types/api.types';
import { logger } from '../utils/logger';

const router = Router();

router.post(
  '/message',
  chatRateLimiter,
  chatRateLimiterHourly,
  validateBody(ChatMessageRequestSchema),
  asyncHandler(async (req, res) => {
    const startTime = Date.now();

    logger.info('Chat message received', {
      sessionId: req.body.sessionId,
      messageLength: req.body.message?.length,
      ip: req.ip,
    });

    const response = await conversationService.handleMessage(req.body);

    const statusCode = response.conversationCreated ? 201 : 200;

    logger.info('Chat message processed', {
      sessionId: response.sessionId,
      statusCode,
      duration: Date.now() - startTime,
    });

    res.status(statusCode).json(response);
  })
);

router.get(
  '/conversations/:sessionId',
  validateParams(ConversationHistoryParamsSchema),
  validateQuery(ConversationHistoryQuerySchema),
  asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { limit, before } = req.query as any;

    logger.info('Conversation history requested', {
      sessionId,
      limit,
      before,
      ip: req.ip,
    });

    const response = await conversationService.getConversationHistory(
      sessionId,
      limit,
      before
    );

    res.status(200).json(response);
  })
);

export default router;
