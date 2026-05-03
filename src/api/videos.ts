import { apiFetch, uploadToSignedUrl } from './client';

interface SignedUrl {
  uploadUrl?: string;
  signedUrl?: string;
  url?: string;
  fullName?: string;
  fileName?: string;
}

export async function uploadVideo(file: File): Promise<string> {
  const meta = await apiFetch<SignedUrl>('/api/v1/videos/upload-url', {
    method: 'POST',
    body: { fileName: file.name, contentType: file.type }
  });
  const target = meta.uploadUrl || meta.signedUrl || meta.url;
  if (!target) throw new Error('No upload URL returned');
  await uploadToSignedUrl(target, file, file.type, 'PUT');
  return meta.fullName || meta.fileName || file.name;
}

export async function getSignedVideoDownloadUrl(fileName: string): Promise<string> {
  const meta = await apiFetch<SignedUrl>('/api/v1/videos/download-url', {
    method: 'POST',
    body: { fileName }
  });
  return meta.signedUrl || meta.url || meta.uploadUrl || '';
}