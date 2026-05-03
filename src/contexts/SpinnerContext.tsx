import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import styles from './SpinnerContext.module.css';

interface SpinnerContextValue {
  show: () => void;
  hide: () => void;
}

const SpinnerContext = createContext<SpinnerContextValue | null>(null);

export function SpinnerProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const value = useMemo<SpinnerContextValue>(
    () => ({
      show: () => setCount((c) => c + 1),
      hide: () => setCount((c) => Math.max(0, c - 1))
    }),
    []
  );

  return (
    <SpinnerContext.Provider value={value}>
      {children}
      {count > 0 && (
        <div className={styles.overlay} aria-live="polite" aria-busy="true">
          <div className={styles.card}>
            <svg
              className={styles.spinner}
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#cfd8dc" strokeWidth="3" />
              <path
                d="M22 12a10 10 0 0 1-10 10"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span>Обработва се…</span>
          </div>
        </div>
      )}
    </SpinnerContext.Provider>
  );
}

export function useSpinner(): SpinnerContextValue {
  const ctx = useContext(SpinnerContext);
  if (!ctx) throw new Error('useSpinner must be used inside SpinnerProvider');
  return ctx;
}