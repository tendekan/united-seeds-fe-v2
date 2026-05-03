import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';
import styles from './CookieConsent.module.css';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = loadFromStorage<string | null>(STORAGE_KEYS.cookies, null);
    if (!accepted) {
      const t = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(t);
    }
  }, []);

  const accept = () => {
    saveToStorage(STORAGE_KEYS.cookies, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite">
      <p>
        Ние използваме бисквитки, за да подобрим вашето изживяване. Като продължавате,
        приемате нашите Условия и Политика за поверителност.
      </p>
      <Button size="sm" onClick={accept}>
        Приемам
      </Button>
    </div>
  );
}