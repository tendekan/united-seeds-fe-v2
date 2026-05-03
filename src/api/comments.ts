import { apiFetch } from './client';
import type { Comment, CommentsPage, SortOrder } from '@/types';

export function getComments(
  postId: string,
  page: number,
  size: number,
  sortOrder: SortOrder
): Promise<CommentsPage> {
  return apiFetch<CommentsPage>(
    `/posts/${postId}/comments?page=${page}&size=${size}&sortOrder=${sortOrder}`
  );
}

export interface CreateCommentPayload {
  postId: string;
  userId: string;
  userName: string;
  commentText: string;
}

export function createComment(payload: CreateCommentPayload): Promise<Comment> {
  return apiFetch<Comment>('/comments', { method: 'POST', body: payload });
}

export function updateComment(
  commentId: string,
  payload: { commentText: string }
): Promise<Comment> {
  return apiFetch<Comment>(`/comments/${commentId}`, { method: 'PUT', body: payload });
}

export function deleteComment(commentId: string): Promise<void> {
  return apiFetch<void>(`/comments/${commentId}`, { method: 'DELETE' });
}

export function getCommentLikesCount(commentId: string): Promise<number> {
  return apiFetch<number>(`/comments/${commentId}/likes/count`);
}

export function isCommentLikedByUser(commentId: string, userId: string): Promise<boolean> {
  return apiFetch<boolean>(`/comments/${commentId}/likes/user/${userId}`);
}

export function likeComment(
  commentId: string,
  userId: string,
  userName: string
): Promise<void> {
  const params = new URLSearchParams({ userId, userName });
  return apiFetch<void>(`/comments/${commentId}/likes?${params.toString()}`, {
    method: 'POST'
  });
}

export function unlikeComment(commentId: string, userId: string): Promise<void> {
  const params = new URLSearchParams({ userId });
  return apiFetch<void>(`/comments/${commentId}/likes?${params.toString()}`, {
    method: 'DELETE'
  });
}

export function getCommentLikes(
  commentId: string,
  page = 1,
  size = 20
): Promise<{ likes: { userId: string; userName?: string }[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return apiFetch(`/comments/${commentId}/likes?${params.toString()}`);
}