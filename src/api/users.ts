import { apiFetch, uploadToSignedUrl } from './client';
import type { UserProfile } from '@/types';

export function getUserProfile(userId: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/users/${userId}/profile`);
}

export function updateUserProfile(
  userId: string,
  payload: Pick<UserProfile, 'bio' | 'dateOfBirth' | 'residency'>
): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/users/${userId}/profile`, {
    method: 'PUT',
    body: payload
  });
}

export interface ProfilePictureResponse {
  userId: string;
  pictureUrl?: string;
  pictureFullUrl?: string;
  pictureObjectName?: string;
}

export function getProfilePictureRaw(
  userId: string
): Promise<ProfilePictureResponse | null> {
  return apiFetch<ProfilePictureResponse>(`/users/${userId}/profile/picture`).catch(
    () => null
  );
}

export async function getProfilePicture(userId: string): Promise<string | null> {
  const data = await getProfilePictureRaw(userId);
  return data?.pictureFullUrl || data?.pictureUrl || null;
}

export interface ProfilePictureUploadResponse {
  signedUrl: string;
  fileName: string;
  expiresInMinutes?: number;
  publicUrl?: string;
}

export function getProfilePictureUploadUrl(
  userId: string,
  fileName: string,
  contentType: string
): Promise<ProfilePictureUploadResponse> {
  return apiFetch<ProfilePictureUploadResponse>(
    `/users/${userId}/profile/picture/upload-url`,
    {
      method: 'POST',
      body: { fileName, contentType }
    }
  );
}

export async function uploadProfilePicture(userId: string, file: File): Promise<void> {
  const meta = await getProfilePictureUploadUrl(userId, file.name, file.type);
  await uploadToSignedUrl(meta.signedUrl, file, file.type, 'PUT');
  // Persist the public URL on the user profile so other clients can read it.
  if (meta.publicUrl) {
    await apiFetch(`/users/${userId}/profile/picture`, {
      method: 'PUT',
      body: { pictureUrl: meta.publicUrl }
    }).catch(() => {
      /* upload-url may already register it server-side */
    });
  }
}