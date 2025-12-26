import { faqModel } from '../models/faq.model';
import { FAQ } from '../types/db.types';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class FAQService {
  async retrieveRelevantFAQs(userMessage: string): Promise<FAQ[]> {
    try {
      const limit = env.FAQ_MAX_RESULTS;

      const faqs = await faqModel.searchHybrid(userMessage, limit);

      logger.debug('FAQs retrieved for user message', {
        messageLength: userMessage.length,
        faqCount: faqs.length,
      });

      return faqs;
    } catch (error) {
      logger.error('Error retrieving relevant FAQs', { error });
      return [];
    }
  }

  async searchByKeywords(keywords: string[]): Promise<FAQ[]> {
    try {
      return await faqModel.searchByKeywords(keywords, env.FAQ_MAX_RESULTS);
    } catch (error) {
      logger.error('Error searching FAQs by keywords', { error, keywords });
      return [];
    }
  }

  async getByCategory(category: string): Promise<FAQ[]> {
    try {
      return await faqModel.getByCategory(category);
    } catch (error) {
      logger.error('Error getting FAQs by category', { error, category });
      return [];
    }
  }

  async getAllActive(): Promise<FAQ[]> {
    try {
      return await faqModel.getAll(true);
    } catch (error) {
      logger.error('Error getting all active FAQs', { error });
      return [];
    }
  }

  async create(
    question: string,
    answer: string,
    category?: string,
    keywords?: string[],
    priority?: number
  ): Promise<FAQ> {
    return await faqModel.create(
      question,
      answer,
      category || null,
      keywords || [],
      priority || 0
    );
  }

  async update(id: string, updates: Partial<FAQ>): Promise<FAQ> {
    return await faqModel.update(id, updates);
  }

  async deactivate(id: string): Promise<void> {
    await faqModel.deactivate(id);
  }
}

export const faqService = new FAQService();
