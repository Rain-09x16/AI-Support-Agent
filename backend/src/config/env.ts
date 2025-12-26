import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_VERSION: z.string().default('1.0.0'),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().positive().default(5432),
  DATABASE_NAME: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_SSL: z.coerce.boolean().default(false),
  DATABASE_POOL_MIN: z.coerce.number().int().nonnegative().default(2),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(10),

  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_DB: z.coerce.number().int().nonnegative().default(0),
  REDIS_TLS: z.coerce.boolean().default(false),

  OPENROUTER_API_KEY: z.string().min(1),
  OPENROUTER_API_URL: z.string().url().default('https://openrouter.ai/api/v1'),
  OPENROUTER_MODEL: z.string().default('meta-llama/llama-3.1-8b-instruct:free'),
  OPENROUTER_MAX_TOKENS: z.coerce.number().int().positive().default(300),
  OPENROUTER_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.7),
  OPENROUTER_TIMEOUT: z.coerce.number().int().positive().default(30000),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(20),
  RATE_LIMIT_HOURLY_MAX: z.coerce.number().int().positive().default(100),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().default('logs/app.log'),

  FAQ_CACHE_TTL: z.coerce.number().int().positive().default(3600),
  FAQ_MAX_RESULTS: z.coerce.number().int().positive().default(5),

  CONVERSATION_CACHE_TTL: z.coerce.number().int().positive().default(300),
  CONVERSATION_HISTORY_LIMIT: z.coerce.number().int().positive().default(10),
  MAX_MESSAGE_LENGTH: z.coerce.number().int().positive().default(2000),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      throw new Error(
        `Environment validation failed:\n${missingVars.join('\n')}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
