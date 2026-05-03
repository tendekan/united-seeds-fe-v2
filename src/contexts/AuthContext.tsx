import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode
} from 'react';
import type { AuthUser } from '@/types';
import { authStore } from '@/api/authStore';
import { getUserProfile } from '@/api/users';
import { useToast } from './ToastContext';

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  signOut: () => void;
  isAuthOpen: boolean;
  authMode: string;
  openAuth: (mode?: string) => void;
  closeAuth: () => void;
  setServerUserId: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Single source of truth: the module-level authStore. React state is derived
  // from it via useSyncExternalStore, so a sign-in is visible to the API
  // client immediately (the very next apiFetch call sees the new token), with
  // no race against React's effect ordering.
  const user = useSyncExternalStore(
    authStore.subscribe,
    authStore.get,
    authStore.get
  );

  const [isAuthOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('Влез');
  const toast = useToast();

  const setUser = useCallback((u: AuthUser | null) => {
    authStore.set(u);
  }, []);

  const signOut = useCallback(() => {
    authStore.set(null);
  }, []);

  const openAuth = useCallback((mode = 'Влез') => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const setServerUserId = useCallback((id: string) => {
    const current = authStore.get();
    if (!current || !id || current.serverUserId === id) return;
    authStore.set({ ...current, serverUserId: id });
  }, []);

  // Bootstrap canonical server user ID right after sign-in so post ownership
  // checks (isOwner) work without first navigating to the profile.
  useEffect(() => {
    if (!user || user.serverUserId) return;
    let cancelled = false;
    getUserProfile(user.userId)
      .then((p) => {
        if (cancelled) return;
        if (p?.userId) setServerUserId(String(p.userId));
      })
      .catch(() => {
        /* nothing to do — profile load is best-effort */
      });
    return () => {
      cancelled = true;
    };
  }, [user, setServerUserId]);

  // Wire 401 handler. We give a freshly signed-in user a grace window so the
  // first authenticated request after sign-in doesn't immediately wipe state
  // if the BE rejects the token.
  const signedInAtRef = useRef<number>(user ? Date.now() : 0);
  useEffect(() => {
    if (user) signedInAtRef.current = Date.now();
  }, [user]);

  useEffect(() => {
    authStore.setUnauthorizedHandler(() => {
      if (!authStore.get()) return;
      const sinceSignIn = Date.now() - signedInAtRef.current;
      if (sinceSignIn < 5000) {
        console.warn('Got 401 within 5s of sign-in — not signing out.');
        toast.show('Грешка при удостоверяване (401).', 'error');
        return;
      }
      authStore.set(null);
      toast.show('Вашата сесия е изтекла. Моля, влезте отново.', 'error');
      setAuthMode('Влез');
      setAuthOpen(true);
    });
  }, [toast]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      setUser,
      signOut,
      isAuthOpen,
      authMode,
      openAuth,
      closeAuth,
      setServerUserId
    }),
    [user, setUser, signOut, isAuthOpen, authMode, openAuth, closeAuth, setServerUserId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function getSafeUserId(user: AuthUser | null): string | null {
  if (!user) return null;
  const raw = user.serverUserId ?? user.userId ?? '';
  const normalized = String(raw || '').trim();
  return normalized || null;
}