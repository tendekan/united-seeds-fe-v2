import type { AuthUser } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';

type Listener = (user: AuthUser | null) => void;
type UnauthorizedHandler = () => void;

let currentUser: AuthUser | null = loadFromStorage<AuthUser | null>(
  STORAGE_KEYS.auth,
  null
);
const listeners = new Set<Listener>();
let unauthorizedHandler: UnauthorizedHandler = () => {};

export const authStore = {
  get(): AuthUser | null {
    return currentUser;
  },
  set(user: AuthUser | null): void {
    currentUser = user;
    saveToStorage(STORAGE_KEYS.auth, user);
    listeners.forEach((l) => l(user));
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setUnauthorizedHandler(handler: UnauthorizedHandler): void {
    unauthorizedHandler = handler;
  },
  triggerUnauthorized(): void {
    unauthorizedHandler();
  }
};
