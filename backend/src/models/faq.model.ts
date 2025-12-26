import { db } from '../config/database';
import { FAQ } from '../types/db.types';
import { DatabaseError } from '../utils/errors';
import { logger } from '../utils/logger';

export class FAQModel {
  async create(
    question: string,
    answer: string,
    category: string | null = null,
    keywords: string[] = [],
    priority: number = 0
  ): Promise<FAQ> {
    try {
      const query = `
        INSERT INTO faqs (question, answer, category, keywords, priority)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const result = await db.query<FAQ>(query, [
        question,
        answer,
        category,
        keywords,
        priority,
      ]);

      logger.info('FAQ created', { id: result.rows[0].id, category });
      return result.rows[0];
    } catch (error: any) {
      logger.error('Error creating FAQ', { error });
      throw new DatabaseError('Failed to create FAQ', error);
    }
  }

  async findById(id: string): Promise<FAQ | null> {
    try {
      const query = `SELECT * FROM faqs WHERE id = $1`;
      const result = await db.query<FAQ>(query, [id]);
      return result.rows[0] || null;
    } catch (error: any) {
      logger.error('Error finding FAQ by ID', { error, id });
      throw new DatabaseError('Failed to find FAQ', error);
    }
  }

  async searchFullText(searchTerms: string, limit: number = 5): Promise<FAQ[]> {
    try {
      const tsQuery = this.buildTsQuery(searchTerms);

      const query = `
        SELECT
          *,
          ts_rank(
            to_tsvector('english', question || ' ' || answer),
            to_tsquery('english', $1)
          ) AS rank
        FROM faqs
        WHERE
          is_active = true
          AND to_tsvector('english', question || ' ' || answer)
              @@ to_tsquery('english', $1)
        ORDER BY
          rank DESC,
          priority DESC
        LIMIT $2
      `;

      const result = await db.query<FAQ>(query, [tsQuery, limit]);
      logger.debug('Full-text search completed', {
        searchTerms,
        resultsCount: result.rows.length,
      });

      return result.rows;
    } catch (error: any) {
      logger.error('Error in full-text search', { error, searchTerms });
      throw new DatabaseError('Failed to search FAQs', error);
    }
  }

  async searchByKeywords(keywords: string[], limit: number = 5): Promise<FAQ[]> {
    try {
      const query = `
        SELECT * FROM faqs
        WHERE
          is_active = true
          AND keywords @> $1::text[]
        ORDER BY
          priority DESC,
          created_at DESC
        LIMIT $2
      `;

      const result = await db.query<FAQ>(query, [keywords, limit]);
      logger.debug('Keyword search completed', {
        keywords,
        resultsCount: result.rows.length,
      });

      return result.rows;
    } catch (error: any) {
      logger.error('Error in keyword search', { error, keywords });
      throw new DatabaseError('Failed to search FAQs by keywords', error);
    }
  }

  async searchHybrid(userMessage: string, limit: number = 5): Promise<FAQ[]> {
    try {
      const keywords = this.extractKeywords(userMessage);
      const tsQuery = this.buildTsQuery(userMessage);

      const query = `
        SELECT
          *,
          ts_rank(
            to_tsvector('english', question || ' ' || answer),
            to_tsquery('english', $1)
          ) AS rank
        FROM faqs
        WHERE
          is_active = true
          AND (
            to_tsvector('english', question || ' ' || answer)
                @@ to_tsquery('english', $1)
            OR keywords && $2::text[]
          )
        ORDER BY
          rank DESC,
          priority DESC
        LIMIT $3
      `;

      const result = await db.query<FAQ>(query, [tsQuery, keywords, limit]);
      logger.debug('Hybrid search completed', {
        userMessage: userMessage.substring(0, 50),
        resultsCount: result.rows.length,
      });

      return result.rows;
    } catch (error: any) {
      logger.error('Error in hybrid search', { error, userMessage });
      throw new DatabaseError('Failed to search FAQs', error);
    }
  }

  async getByCategory(category: string, limit: number = 10): Promise<FAQ[]> {
    try {
      const query = `
        SELECT * FROM faqs
        WHERE
          is_active = true
          AND category = $1
        ORDER BY
          priority DESC,
          created_at DESC
        LIMIT $2
      `;

      const result = await db.query<FAQ>(query, [category, limit]);
      return result.rows;
    } catch (error: any) {
      logger.error('Error getting FAQs by category', { error, category });
      throw new DatabaseError('Failed to get FAQs by category', error);
    }
  }

  async getAll(activeOnly = true): Promise<FAQ[]> {
    try {
      const query = activeOnly
        ? `SELECT * FROM faqs WHERE is_active = true ORDER BY priority DESC, created_at DESC`
        : `SELECT * FROM faqs ORDER BY priority DESC, created_at DESC`;

      const result = await db.query<FAQ>(query);
      return result.rows;
    } catch (error: any) {
      logger.error('Error getting all FAQs', { error });
      throw new DatabaseError('Failed to get all FAQs', error);
    }
  }

  async update(
    id: string,
    updates: Partial<Omit<FAQ, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<FAQ> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      });

      values.push(id);

      const query = `
        UPDATE faqs
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await db.query<FAQ>(query, values);
      logger.info('FAQ updated', { id });
      return result.rows[0];
    } catch (error: any) {
      logger.error('Error updating FAQ', { error, id });
      throw new DatabaseError('Failed to update FAQ', error);
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const query = `UPDATE faqs SET is_active = false WHERE id = $1`;
      await db.query(query, [id]);
      logger.info('FAQ deactivated', { id });
    } catch (error: any) {
      logger.error('Error deactivating FAQ', { error, id });
      throw new DatabaseError('Failed to deactivate FAQ', error);
    }
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'i', 'you', 'he', 'she',
      'it', 'we', 'they', 'my', 'your', 'how', 'what', 'when', 'where', 'do',
      'can', 'to', 'in', 'on', 'at', 'for', 'with', 'of',
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
      .slice(0, 10);
  }

  private buildTsQuery(text: string): string {
    const keywords = this.extractKeywords(text);
    return keywords.join(' | ');
  }
}

export const faqModel = new FAQModel();
