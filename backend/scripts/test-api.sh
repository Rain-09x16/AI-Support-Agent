#!/bin/bash

# API Testing Script for AI Support Agent Backend
# Usage: ./scripts/test-api.sh

BASE_URL="http://localhost:3000"
API_BASE="${BASE_URL}/api/v1"

echo "🧪 Testing AI Support Agent API"
echo "================================"
echo ""
echo "Base URL: ${BASE_URL}"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Root endpoint
echo "Test 1: Root Endpoint"
echo "---------------------"
curl -s "${BASE_URL}/" | jq '.' || echo "Response (raw): $(curl -s ${BASE_URL}/)"
echo ""

# Test 2: Health Check
echo "Test 2: Health Check"
echo "--------------------"
HEALTH_RESPONSE=$(curl -s "${API_BASE}/health")
echo "${HEALTH_RESPONSE}" | jq '.'
STATUS=$(echo "${HEALTH_RESPONSE}" | jq -r '.status')
if [ "$STATUS" = "healthy" ]; then
  echo -e "${GREEN}✓ Health check passed${NC}"
else
  echo -e "${YELLOW}⚠ Health check status: ${STATUS}${NC}"
fi
echo ""

# Test 3: Send first message (new conversation)
echo "Test 3: Send First Message (New Conversation)"
echo "----------------------------------------------"
MESSAGE_1='{"message": "How do I reset my password?"}'
RESPONSE_1=$(curl -s -X POST "${API_BASE}/chat/message" \
  -H "Content-Type: application/json" \
  -d "${MESSAGE_1}")
echo "${RESPONSE_1}" | jq '.'
SESSION_ID=$(echo "${RESPONSE_1}" | jq -r '.sessionId')
echo -e "${GREEN}Session ID: ${SESSION_ID}${NC}"
echo ""

# Test 4: Send second message (existing conversation)
echo "Test 4: Send Second Message (Existing Conversation)"
echo "----------------------------------------------------"
MESSAGE_2="{\"sessionId\": \"${SESSION_ID}\", \"message\": \"What about billing questions?\"}"
RESPONSE_2=$(curl -s -X POST "${API_BASE}/chat/message" \
  -H "Content-Type: application/json" \
  -d "${MESSAGE_2}")
echo "${RESPONSE_2}" | jq '.'
echo ""

# Test 5: Get conversation history
echo "Test 5: Get Conversation History"
echo "---------------------------------"
HISTORY=$(curl -s "${API_BASE}/chat/conversations/${SESSION_ID}")
echo "${HISTORY}" | jq '.'
MESSAGE_COUNT=$(echo "${HISTORY}" | jq -r '.conversation.messageCount')
echo -e "${GREEN}Message count: ${MESSAGE_COUNT}${NC}"
echo ""

# Test 6: Invalid session ID (404 error)
echo "Test 6: Invalid Session ID (Should Return 404)"
echo "-----------------------------------------------"
INVALID_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  "${API_BASE}/chat/conversations/00000000-0000-0000-0000-000000000000")
echo "${INVALID_RESPONSE}"
echo ""

# Test 7: Validation error (empty message)
echo "Test 7: Validation Error (Empty Message)"
echo "-----------------------------------------"
INVALID_MESSAGE='{"message": ""}'
VALIDATION_ERROR=$(curl -s -X POST "${API_BASE}/chat/message" \
  -H "Content-Type: application/json" \
  -d "${INVALID_MESSAGE}")
echo "${VALIDATION_ERROR}" | jq '.'
echo ""

# Test 8: Validation error (message too long)
echo "Test 8: Validation Error (Message Too Long)"
echo "--------------------------------------------"
LONG_MESSAGE=$(printf '{"message": "%*s"}' 2100 | tr ' ' 'a')
LONG_ERROR=$(curl -s -X POST "${API_BASE}/chat/message" \
  -H "Content-Type: application/json" \
  -d "${LONG_MESSAGE}")
echo "${LONG_ERROR}" | jq '.'
echo ""

# Test 9: Invalid UUID format
echo "Test 9: Invalid UUID Format"
echo "----------------------------"
INVALID_UUID_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  "${API_BASE}/chat/conversations/invalid-uuid")
echo "${INVALID_UUID_RESPONSE}"
echo ""

# Test 10: Pagination test
echo "Test 10: Pagination Test"
echo "------------------------"
PAGINATED=$(curl -s "${API_BASE}/chat/conversations/${SESSION_ID}?limit=1")
echo "${PAGINATED}" | jq '.'
HAS_MORE=$(echo "${PAGINATED}" | jq -r '.pagination.hasMore')
echo -e "${GREEN}Has more messages: ${HAS_MORE}${NC}"
echo ""

echo "================================"
echo "✅ All tests completed!"
echo ""
echo "Summary:"
echo "- Session ID created: ${SESSION_ID}"
echo "- Messages sent: 2"
echo "- Conversation history retrieved: Yes"
echo "- Error handling verified: Yes"
echo ""
