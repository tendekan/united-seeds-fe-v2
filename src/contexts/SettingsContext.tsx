import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type { SettingsState } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';

const DEFAULT_SETTINGS: SettingsState = {
  useProfileForDating: true,
  language: 'bg',
  currency: 'EUR'
};

interface SettingsContextValue {
  settings: SettingsState;
  update: (patch: Partial<SettingsState>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() =>
    loadFromStorage<SettingsState>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  const update = useCallback((patch: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(() => ({ settings, update }), [settings, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}