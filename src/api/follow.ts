import { apiFetch } from './client';

export interface UserSummary {
  userId: string;
  name?: string;
}

export function followUser(userId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/users/${userId}/follow`, { method: 'POST' });
}

export function unfollowUser(userId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/users/${userId}/follow`, { method: 'DELETE' });
}

export function getFollowing(userId: string): Promise<UserSummary[]> {
  return apiFetch<UserSummary[]>(`/api/v1/users/${userId}/following`);
}

export function getFollowers(userId: string): Promise<UserSummary[]> {
  return apiFetch<UserSummary[]>(`/api/v1/users/${userId}/followers`);
}