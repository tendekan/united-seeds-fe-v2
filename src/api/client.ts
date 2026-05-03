import { authStore } from './authStore';

export const BACKEND_URL = 'https://united-seeds-118701076488.europe-central2.run.app';

export function authHeaders(): Record<string, string> {
  const auth = authStore.get();
  if (auth?.accessToken) return { Authorization: `Bearer ${auth.accessToken}` };
  return {};
}

export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: Record<string, string>;
  raw?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BACKEND_URL}${path}`;
  const headers: Record<string, string> = {
    accept: '*/*',
    ...authHeaders(),
    ...(options.headers || {})
  };

  let body: BodyInit | undefined;
  if (options.body !== undefined && options.body !== null) {
    if (
      typeof options.body === 'string' ||
      options.body instanceof FormData ||
      options.body instanceof Blob ||
      options.body instanceof ArrayBuffer
    ) {
      body = options.body as BodyInit;
    } else {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body
  });

  if (response.status === 401) {
    authStore.triggerUnauthorized();
    throw new ApiError('Unauthorized', 401);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new ApiError(text || response.statusText, response.status);
  }

  if (options.raw) return response as unknown as T;

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  const text = await response.text();
  return text as unknown as T;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function uploadToSignedUrl(
  url: string,
  file: File | Blob,
  contentType?: string,
  method: 'PUT' | 'POST' = 'PUT'
): Promise<Response> {
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return fetch(url, {
    method,
    headers,
    body: file
  });
}