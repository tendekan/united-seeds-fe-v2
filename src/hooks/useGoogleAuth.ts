import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { AuthUser } from '@/types';

interface GoogleUserInfo {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

async function fetchGoogleUser(accessToken: string): Promise<GoogleUserInfo> {
  const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!resp.ok) throw new Error('Failed to fetch Google user');
  return resp.json();
}

export function useGoogleAuth() {
  const { setUser, closeAuth } = useAuth();
  const toast = useToast();

  const signIn = useCallback(() => {
    const clientId = window.UNITEDSEEDS_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.show('Google входът не е конфигуриран.', 'error');
      return;
    }
    if (!window.google?.accounts?.oauth2) {
      toast.show('Google SDK не е зареден.', 'error');
      return;
    }
    try {
      window.google.accounts.oauth2
        .initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: async (tokenResponse: any) => {
            if (!tokenResponse?.access_token) {
              toast.show('Входът с Google беше отменен или неуспешен.', 'error');
              return;
            }
            try {
              const profile = await fetchGoogleUser(tokenResponse.access_token);
              const user: AuthUser = {
                provider: 'google',
                userId: profile.sub,
                name: profile.name || 'Потребител',
                email: profile.email,
                photoUrl: profile.picture,
                accessToken: tokenResponse.access_token
              };
              setUser(user);
              closeAuth();
              toast.show(`Здравейте, ${user.name}!`, 'success');
            } catch (e) {
              console.error('Google user fetch failed', e);
              toast.show('Входът с Google не беше успешен.', 'error');
            }
          }
        })
        .requestAccessToken();
    } catch (e) {
      console.error('Google sign-in failed', e);
      toast.show('Неуспешен вход с Google.', 'error');
    }
  }, [setUser, closeAuth, toast]);

  // No-op kept for AuthModal compatibility — we use a plain button now.
  const renderButton = useCallback((_el: HTMLElement | null) => {
    /* not used */
  }, []);

  return { signIn, renderButton };
}