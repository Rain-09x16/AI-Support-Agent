#!/bin/bash

set -e

echo "🚀 AI Support Agent Backend Setup"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env from .env.example..."
  cp .env.example .env
  echo "⚠️  Please update .env with your actual configuration values"
  echo ""
else
  echo "✓ .env file already exists"
  echo ""
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs
echo "✓ Logs directory created"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
node scripts/migrate.js
echo "✓ Migrations completed"
echo ""

# Seed FAQs
echo "🌱 Seeding sample FAQs..."
if [ -n "$DATABASE_HOST" ]; then
  psql -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME -f scripts/seed-faqs.sql
  echo "✓ FAQs seeded"
else
  echo "⚠️  DATABASE_HOST not set. Skipping FAQ seeding."
  echo "   Run manually: psql -U postgres -d ai_support_agent -f scripts/seed-faqs.sql"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration (database, Redis, OpenRouter API key)"
echo "2. Start development server: npm run dev"
echo "3. Test the API: curl http://localhost:3000/api/v1/health"
echo ""
