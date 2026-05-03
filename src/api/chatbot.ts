import { apiFetch } from './client';

export interface ChatbotResponse {
  answer?: string;
  response?: string;
  reply?: string;
  message?: string;
  text?: string;
  result?: string;
  output?: string;
  [key: string]: unknown;
}

export function askChatbot(question: string): Promise<ChatbotResponse | string> {
  return apiFetch<ChatbotResponse | string>('/api/v1/chatbot/ask', {
    method: 'POST',
    body: { question }
  });
}

export function extractAnswer(payload: ChatbotResponse | string | null): string {
  if (payload == null) return '';
  if (typeof payload === 'string') return payload;
  const candidates = ['answer', 'response', 'reply', 'message', 'text', 'result', 'output'];
  for (const key of candidates) {
    const value = (payload as Record<string, unknown>)[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
}