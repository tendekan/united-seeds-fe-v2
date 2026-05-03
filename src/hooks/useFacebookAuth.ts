import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { AuthUser } from '@/types';

declare global {
  interface Window {
    __unitedseeds_facebook_loading?: boolean;
  }
}

function loadFacebookSdk(appId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      resolve();
      return;
    }
    if (window.__unitedseeds_facebook_loading) {
      const t = window.setInterval(() => {
        if (window.FB) {
          window.clearInterval(t);
          resolve();
        }
      }, 200);
      return;
    }
    window.__unitedseeds_facebook_loading = true;
    window.fbAsyncInit = () => {
      window.FB.init({ appId, cookie: true, xfbml: false, version: 'v18.0' });
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Facebook SDK'));
    document.body.appendChild(script);
  });
}

export function useFacebookAuth() {
  const { setUser, closeAuth } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const appId = window.UNITEDSEEDS_FACEBOOK_APP_ID;
    if (appId) {
      loadFacebookSdk(appId).catch((e) => console.warn('Facebook SDK', e));
    }
  }, []);

  const signIn = useCallback(() => {
    const appId = window.UNITEDSEEDS_FACEBOOK_APP_ID;
    if (!appId) {
      toast.show('Facebook входът не е конфигуриран.', 'error');
      return;
    }
    loadFacebookSdk(appId)
      .then(() => {
        window.FB.login(
          (resp: any) => {
            if (resp?.authResponse?.accessToken) {
              const accessToken: string = resp.authResponse.accessToken;
              const userID: string = resp.authResponse.userID;
              window.FB.api(
                '/me',
                { fields: 'id,name,email,picture.type(large)' },
                (me: any) => {
                  const user: AuthUser = {
                    provider: 'facebook',
                    userId: userID,
                    name: me?.name || 'Потребител',
                    email: me?.email,
                    photoUrl: me?.picture?.data?.url,
                    accessToken
                  };
                  setUser(user);
                  closeAuth();
                  toast.show(`Здравейте, ${user.name}!`, 'success');
                }
              );
            } else {
              toast.show('Входът беше отказан.', 'error');
            }
          },
          { scope: 'public_profile,email' }
        );
      })
      .catch(() => toast.show('Facebook SDK не можа да се зареди.', 'error'));
  }, [setUser, closeAuth, toast]);

  return { signIn };
}