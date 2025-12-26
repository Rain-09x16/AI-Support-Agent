# AI Support Agent - Live Chat

A mini AI support agent for live chat.

## 🚀 Live Demo

- **Frontend**: [Deployed URL - TBD]
- **Backend API**: [Deployed URL - TBD]

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [LLM Integration](#llm-integration)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Trade-offs & Future Improvements](#trade-offs--future-improvements)

## ✨ Features

### Core Functionality
- ✅ Real-time chat interface with AI-powered responses
- ✅ LLM integration using OpenRouter API
- ✅ PostgreSQL database for conversation persistence
- ✅ Redis caching for FAQs and session data
- ✅ 15 pre-seeded FAQs about a fictional e-commerce store
- ✅ Conversation history persisted across page reloads
- ✅ Input validation and error handling
- ✅ Rate limiting (20 requests/min, 100 requests/hour)

### UX Features
- ✅ Auto-scroll to latest message
- ✅ Clear user/AI message distinction
- ✅ Disabled send button during API calls
- ✅ Loading indicator while AI is responding
- ✅ Error messages displayed in UI
- ✅ Responsive design (mobile-friendly)

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Render cloud)
- **Cache**: Redis (Upstash cloud)
- **Validation**: Zod
- **Logging**: Winston

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with localStorage persistence)
- **UI Components**: Custom React components

### LLM
- **Provider**: OpenRouter
- **Model**: `openai/gpt-oss-120b:free` (free tier)
- **Features**: Retry logic, error handling, token management

## 🏗 Architecture

### Backend Structure
```
backend/
├── src/
│   ├── config/          # Database, Redis, environment configs
│   ├── db/
│   │   ├── migrations/  # SQL migration files
│   │   └── seeds/       # FAQ seed data
│   ├── middleware/      # Error handling, validation, rate limiting
│   ├── models/          # Database models
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic layer
│   │   ├── conversationService.ts
│   │   ├── faqService.ts
│   │   └── llmService.ts
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Logger, helpers
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── scripts/             # Migration and seed scripts
└── logs/                # Application logs
```

### Frontend Structure
```
frontend/
├── app/                 # Next.js App Router pages
├── components/
│   ├── Chat/            # Chat UI components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/
│   ├── api.ts           # API client
│   ├── store.ts         # Zustand state management
│   └── types.ts         # TypeScript types
└── public/              # Static assets
```

### Data Flow
```
User Input → Frontend (Zustand Store)
           ↓
      POST /api/v1/chat/message
           ↓
      Backend (Express)
           ↓
      ┌─────────┴─────────┐
      ↓                   ↓
  FAQ Service      LLM Service (OpenRouter)
      ↓                   ↓
  PostgreSQL         AI Response
      ↓                   ↓
  Save Message     Return to User
           ↓
      Frontend Display
```

## 💻 Local Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- PostgreSQL database (cloud or local)
- Redis instance (cloud or local)
- OpenRouter API key

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd AI-support-agent
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```bash
cp .env.example .env
```

Edit `.env` with your actual credentials (see [Environment Variables](#environment-variables) section).

#### Set Up Database
Run migrations to create tables:
```bash
npm run migrate
```

Seed FAQ data:
```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```

Backend should now be running on `http://localhost:8000`

### Step 3: Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables
Create a `.env.local` file in the `frontend` directory:
```bash
cp .env.example .env.local
```

The default values should work for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Start Frontend Server
```bash
npm run dev
```

Frontend should now be running on `http://localhost:3000`

### Step 4: Test the Application
1. Open `http://localhost:3000` in your browser
2. Type a message like "What are your shipping options?"
3. The AI should respond based on the seeded FAQ knowledge

## 🔐 Environment Variables

### Backend (`backend/.env`)

#### Required Variables
```env
# PostgreSQL Database
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_HOST=your-host
DATABASE_PORT=5432
DATABASE_NAME=your-database
DATABASE_USER=your-user
DATABASE_PASSWORD=your-password
DATABASE_SSL=true  # Set to true for cloud databases (Render, etc.)

# Redis Cache
REDIS_URL=redis://default:password@host:port
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_TLS=true  # Set to true for cloud Redis (Upstash, etc.)

# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
OPENROUTER_MODEL=openai/gpt-oss-120b:free
```

#### Optional Variables (with defaults)
```env
NODE_ENV=development
PORT=8000
CORS_ORIGIN=http://localhost:3000
OPENROUTER_MAX_TOKENS=300
OPENROUTER_TEMPERATURE=0.7
RATE_LIMIT_MAX_REQUESTS=20
FAQ_CACHE_TTL=3600
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AI Support Agent
```

### How to Get API Keys

#### OpenRouter API Key
1. Go to https://openrouter.ai/
2. Sign up for a free account
3. Go to https://openrouter.ai/keys
4. Create a new API key
5. Go to https://openrouter.ai/settings/privacy
6. **Important**: Enable "Free model publication" to use free models

#### PostgreSQL Database (Render - Free)
1. Go to https://render.com/
2. Sign up for a free account
3. Create a new PostgreSQL database
4. Copy the "External Database URL"
5. Parse it to get individual credentials

#### Redis Cache (Upstash - Free)
1. Go to https://upstash.com/
2. Sign up for a free account
3. Create a new Redis database
4. Copy the connection details from the dashboard

## 🤖 LLM Integration

### Provider
**OpenRouter** - Unified API for multiple LLM providers

### Model
**`openai/gpt-oss-120b:free`** - Free-tier model

### Prompt Strategy

#### System Prompt
```
You are a helpful customer support agent for an e-commerce store.

Your responsibilities:
- Answer customer questions clearly and concisely
- Be friendly and professional
- If you don't know something, admit it politely
- Keep responses under 200 words

Here is our FAQ knowledge base:
[Dynamically injected FAQs from database]
```

#### Context Management
- FAQs are retrieved from PostgreSQL using full-text search
- Top 5 relevant FAQs are injected into the system prompt
- Conversation history (last 10 messages) is included for context
- Token limit: 300 tokens for response generation

#### Error Handling
- Retry logic: 3 attempts with exponential backoff
- Timeout: 30 seconds
- Fallback messages for API failures
- Rate limit handling

### Why OpenRouter?
- ✅ Free tier available
- ✅ Multiple model options
- ✅ Good documentation
- ✅ Easy to switch models
- ✅ No complex authentication

### Token Optimization
- Max tokens limited to 300 to control costs
- FAQ context truncated if too long
- Conversation history limited to last 10 messages
- Response streaming not implemented (future improvement)

## 🗄 Database Schema

### Tables

#### `conversations`
Stores chat sessions
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  user_identifier TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `messages`
Stores all chat messages (user + AI)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `faqs`
Stores FAQ knowledge base
```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Indexes
- Full-text search on FAQs (GIN index)
- Composite indexes for performance
- Foreign key indexes

### Migrations
Migration files are located in `backend/src/db/migrations/`:
- `001_create_conversations.sql` - Conversations table
- `002_create_messages.sql` - Messages table
- `003_create_faqs.sql` - FAQs table
- `004_create_indexes_and_optimizations.sql` - Performance indexes

## 📡 API Documentation

### Base URL
- Local: `http://localhost:8000`
- Production: `[TBD]`

### Endpoints

#### POST `/api/v1/chat/message`
Send a chat message and get AI response

**Request Body:**
```json
{
  "message": "What are your shipping options?",
  "sessionId": "optional-session-uuid"
}
```

**Response (201 Created):**
```json
{
  "sessionId": "generated-or-existing-uuid",
  "message": {
    "id": "message-uuid",
    "role": "assistant",
    "content": "We offer standard and express shipping...",
    "createdAt": "2025-12-26T10:30:00Z"
  },
  "conversationCreated": true
}
```

**Error Response (502 Bad Gateway):**
```json
{
  "error": "LLMServiceError",
  "message": "AI service temporarily unavailable. Please try again.",
  "timestamp": "2025-12-26T10:30:00Z",
  "path": "/api/v1/chat/message"
}
```

#### GET `/api/v1/chat/conversations/:sessionId`
Retrieve conversation history

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50, max: 100)
- `before` (optional): Message UUID for pagination

**Response (200 OK):**
```json
{
  "conversation": {
    "id": "conversation-uuid",
    "sessionId": "session-uuid",
    "createdAt": "2025-12-26T10:00:00Z",
    "updatedAt": "2025-12-26T10:30:00Z",
    "messageCount": 10
  },
  "messages": [
    {
      "id": "message-uuid",
      "role": "user",
      "content": "Hello",
      "createdAt": "2025-12-26T10:00:00Z"
    },
    {
      "id": "message-uuid-2",
      "role": "assistant",
      "content": "Hi! How can I help you today?",
      "createdAt": "2025-12-26T10:00:05Z"
    }
  ],
  "pagination": {
    "hasMore": false
  }
}
```

#### GET `/api/v1/health`
Health check endpoint

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-26T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "up",
    "redis": "up",
    "llm": "up"
  },
  "uptime": 3600
}
```

### Rate Limits
- **Per IP**: 20 requests per minute
- **Per Session**: 100 requests per hour

## 🧪 Testing

### Manual Testing Checklist
- [ ] Send a simple greeting
- [ ] Ask about shipping policy
- [ ] Ask about return policy
- [ ] Ask about pricing
- [ ] Send empty message (should be blocked)
- [ ] Send very long message (2000+ chars)
- [ ] Reload page (conversation should persist)
- [ ] Test on mobile device
- [ ] Test with slow network (throttle in DevTools)
- [ ] Trigger rate limit (send 21 messages quickly)

### Example Test Queries
```
"Hi, I'm new here"
"What payment methods do you accept?"
"How long does shipping take?"
"What's your return policy?"
"Do you ship internationally?"
"How can I track my order?"
```

### Expected Behavior
- AI should respond within 5-10 seconds
- Responses should reference FAQ knowledge
- Conversation should persist on page reload
- Error messages should be user-friendly
- Rate limits should show clear error messages

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Web Service**
   - Go to https://render.com/
   - Create new "Web Service"
   - Connect your GitHub repository
   - Select `backend` as root directory

2. **Configure Build Settings**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node

3. **Add Environment Variables**
   - Add all variables from `.env`
   - Make sure `DATABASE_SSL=true` and `REDIS_TLS=true`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note the deployment URL

### Frontend Deployment (Vercel)

1. **Create New Project**
   - Go to https://vercel.com/
   - Import your GitHub repository
   - Select `frontend` as root directory

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**
   - `NEXT_PUBLIC_API_URL`: Your backend URL from Render

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Note the deployment URL

### Post-Deployment Testing
1. Test the deployed frontend URL
2. Verify backend API is accessible
3. Check database connections work
4. Test end-to-end chat flow
5. Verify CORS is configured correctly

## ⚖️ Trade-offs & Future Improvements

### Current Limitations & Trade-offs

#### 1. **In-Memory Rate Limiting**
**Trade-off**: Using in-memory store instead of Redis for rate limiting
- ✅ **Pro**: Simpler setup, faster for assessment
- ❌ **Con**: Rate limits reset on server restart
- ❌ **Con**: Doesn't work across multiple server instances
- 🔮 **Future**: Implement Redis-backed rate limiting for production

#### 2. **localStorage for Conversation Persistence**
**Trade-off**: Storing conversation history in browser localStorage
- ✅ **Pro**: Instant load times, works offline
- ✅ **Pro**: Reduces API calls
- ❌ **Con**: Lost if user clears browser data
- ❌ **Con**: Doesn't sync across devices
- 🔮 **Future**: Add "Load from server" option for syncing

#### 3. **No Streaming Responses**
**Trade-off**: Waiting for complete response instead of streaming
- ✅ **Pro**: Simpler implementation
- ❌ **Con**: User sees no feedback until full response ready
- 🔮 **Future**: Implement Server-Sent Events (SSE) for streaming

#### 4. **Free LLM Model**
**Trade-off**: Using free-tier model for cost savings
- ✅ **Pro**: Zero cost for assessment/demo
- ❌ **Con**: Slower response times (~5 seconds)
- ❌ **Con**: Limited token budget
- 🔮 **Future**: Switch to paid model (GPT-4, Claude) for production

#### 5. **Basic Prompt Engineering**
**Trade-off**: Simple FAQ injection instead of advanced RAG
- ✅ **Pro**: Easy to understand and maintain
- ❌ **Con**: Limited to 5 FAQs per query
- ❌ **Con**: No semantic search for FAQ retrieval
- 🔮 **Future**: Implement vector embeddings + semantic search

### If I Had More Time...

#### High Priority
1. **Add "typing" indicator** - Better UX while waiting for response
2. **Implement response streaming** - Show AI response as it's generated
3. **Add conversation list sidebar** - View/switch between past conversations
4. **Better error recovery** - Retry failed messages, queue messages offline
5. **Add tests** - Unit tests for services, integration tests for API
6. **Better mobile UX** - Keyboard handling, scroll behavior

#### Medium Priority
7. **User authentication** - Persistent identity across devices
8. **Admin dashboard** - View conversations, manage FAQs, analytics
9. **FAQ management UI** - Add/edit/delete FAQs without touching database
10. **Conversation search** - Full-text search across all conversations
11. **Export conversations** - Download chat history as PDF/JSON
12. **Multi-language support** - i18n for UI and AI responses

#### Low Priority (Polish)
13. **Dark mode** - Toggle between light/dark themes
14. **Message reactions** - Thumbs up/down for AI responses
15. **Rich media support** - Images, links, formatted text
16. **Voice input** - Speech-to-text for messages
17. **Accessibility improvements** - Screen reader support, keyboard navigation
18. **Analytics** - Track response times, user satisfaction, FAQ coverage

### Architectural Improvements

#### 1. **Microservices Architecture**
Current: Monolithic backend
Future: Separate services for LLM, FAQ, conversation handling

#### 2. **Message Queue**
Current: Synchronous request-response
Future: Queue messages for async processing (SQS, RabbitMQ)

#### 3. **Caching Strategy**
Current: Basic Redis caching for FAQs
Future: Multi-layer caching (CDN, Redis, in-memory)

#### 4. **Monitoring & Observability**
Current: Basic Winston logging
Future: Structured logging, metrics (Prometheus), tracing (Jaeger)

#### 5. **CI/CD Pipeline**
Current: Manual deployment
Future: Automated testing, linting, deployment on push

## 📝 License

This project was created for the Spur Founding Full-Stack Engineer take-home assignment.

## 👤 Author

[Your Name]
- GitHub: [@yourusername]
- Email: your.email@example.com

## 🙏 Acknowledgments

- Spur team for the interesting assignment
- OpenRouter for free LLM access
- Render & Upstash for free hosting
