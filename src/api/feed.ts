import { apiFetch } from './client';
import type { PostWithStats } from '@/types';

export function getFeed(limit: number, offset: number): Promise<PostWithStats[]> {
  return apiFetch<PostWithStats[]>(`/api/v1/feed?limit=${limit}&offset=${offset}`);
}