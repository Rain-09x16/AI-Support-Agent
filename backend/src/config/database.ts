import { Pool, PoolClient, QueryResult } from 'pg';
import { env } from './env';
import { logger } from '../utils/logger';

class Database {
  private pool: Pool | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    if (this.isConnected && this.pool) {
      return;
    }

    try {
      this.pool = new Pool({
        host: env.DATABASE_HOST,
        port: env.DATABASE_PORT,
        database: env.DATABASE_NAME,
        user: env.DATABASE_USER,
        password: env.DATABASE_PASSWORD,
        ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
        min: env.DATABASE_POOL_MIN,
        max: env.DATABASE_POOL_MAX,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      this.pool.on('error', (err) => {
        logger.error('Unexpected database pool error', { error: err.message });
      });

      const client = await this.pool.connect();
      client.release();

      this.isConnected = true;
      logger.info('Database connection established', {
        host: env.DATABASE_HOST,
        database: env.DATABASE_NAME,
      });
    } catch (error) {
      logger.error('Failed to connect to database', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      logger.info('Database connection closed');
    }
  }

  async query<T extends Record<string, any> = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }

    try {
      const start = Date.now();
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;

      if (duration > 1000) {
        logger.warn('Slow query detected', {
          duration: `${duration}ms`,
          query: text.substring(0, 100),
        });
      }

      return result;
    } catch (error) {
      logger.error('Database query error', {
        query: text.substring(0, 100),
        error,
      });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool.connect();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1');
      return result.rowCount === 1;
    } catch (error) {
      logger.error('Database health check failed', { error });
      return false;
    }
  }

  getPool(): Pool {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool;
  }
}

export const db = new Database();
