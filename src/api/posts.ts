import { apiFetch } from './client';
import type { Post } from '@/types';

export interface CreatePostPayload {
  id: string;
  userId?: string;
  facebookName?: string;
  category?: string;
  subcategory?: string;
  videoUrl?: string;
  postText: string;
  createdAt: string;
}

export function createPost(payload: CreatePostPayload): Promise<Post> {
  return apiFetch<Post>('/posts', { method: 'POST', body: payload });
}

export function getPostsByCategory(
  category: string,
  page: number,
  size: number
): Promise<{ posts: Post[]; total: number } | Post[]> {
  return apiFetch(`/posts/category/${encodeURIComponent(category)}?page=${page}&size=${size}`);
}

export function getPost(postId: string): Promise<Post> {
  return apiFetch<Post>(`/posts/${postId}`);
}

export function updatePost(postId: string, payload: Partial<Post>): Promise<Post> {
  return apiFetch<Post>(`/posts/${postId}`, { method: 'PUT', body: payload });
}

export function deletePost(postId: string): Promise<void> {
  return apiFetch<void>(`/posts/${postId}`, { method: 'DELETE' });
}

export function getPostLikesCount(postId: string): Promise<number> {
  return apiFetch<number>(`/posts/${postId}/likes/count`);
}

export function isPostLikedByUser(postId: string, userId: string): Promise<boolean> {
  return apiFetch<boolean>(`/posts/${postId}/likes/user/${userId}`);
}

export function likePost(postId: string, userId: string, userName: string): Promise<void> {
  const params = new URLSearchParams({ userId, userName });
  return apiFetch<void>(`/posts/${postId}/likes?${params.toString()}`, {
    method: 'POST'
  });
}

export function unlikePost(postId: string, userId: string): Promise<void> {
  const params = new URLSearchParams({ userId });
  return apiFetch<void>(`/posts/${postId}/likes?${params.toString()}`, {
    method: 'DELETE'
  });
}

export interface LikesPage {
  likes: { userId: string; userName?: string }[];
  total: number;
  totalPages?: number;
}

export function getPostLikes(postId: string, page = 1, size = 20): Promise<LikesPage> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiFetch<LikesPage>(`/posts/${postId}/likes?${params.toString()}`);
}

export function getPostRetweetsCount(postId: string): Promise<number> {
  return apiFetch<number>(`/posts/${postId}/retweets/count`);
}

export function isPostRetweetedByUser(postId: string, userId: string): Promise<boolean> {
  return apiFetch<boolean>(`/posts/${postId}/retweets/user/${userId}`);
}

export function retweetPost(postId: string, userId: string, userName: string): Promise<void> {
  const params = new URLSearchParams({ userId, userName });
  return apiFetch<void>(`/posts/${postId}/retweets?${params.toString()}`, {
    method: 'POST'
  });
}

export function unretweetPost(postId: string, userId: string): Promise<void> {
  const params = new URLSearchParams({ userId });
  return apiFetch<void>(`/posts/${postId}/retweets?${params.toString()}`, {
    method: 'DELETE'
  });
}
