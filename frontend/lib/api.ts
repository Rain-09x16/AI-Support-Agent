import type { ChatRequest, ChatResponse, ErrorResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export const api = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({
          detail: 'An unexpected error occurred',
        }));
        throw new APIError(response.status, errorData.detail);
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new APIError(
            0,
            'Unable to connect to the server. Please check your connection and try again.'
          );
        }
        throw new APIError(500, error.message);
      }

      throw new APIError(500, 'An unexpected error occurred');
    }
  },
};
