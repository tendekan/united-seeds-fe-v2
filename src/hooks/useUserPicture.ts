import { useEffect, useState } from 'react';
import { getProfilePicture } from '@/api/users';

const cache = new Map<string, string | null>();
const inFlight = new Map<string, Promise<string | null>>();

export function useUserPicture(userId?: string | null): string | null {
  const [url, setUrl] = useState<string | null>(() =>
    userId ? cache.get(String(userId)) ?? null : null
  );

  useEffect(() => {
    if (!userId) {
      setUrl(null);
      return;
    }
    const id = String(userId);
    const cached = cache.get(id);
    if (cached !== undefined) {
      setUrl(cached);
      return;
    }
    let cancelled = false;
    let promise = inFlight.get(id);
    if (!promise) {
      promise = getProfilePicture(id)
        .then((u) => {
          cache.set(id, u || null);
          return u || null;
        })
        .catch(() => {
          cache.set(id, null);
          return null;
        })
        .finally(() => {
          inFlight.delete(id);
        });
      inFlight.set(id, promise);
    }
    promise.then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return url;
}

export function setCachedUserPicture(userId: string, url: string | null): void {
  cache.set(String(userId), url);
}

export function clearUserPictureCache(): void {
  cache.clear();
  inFlight.clear();
}