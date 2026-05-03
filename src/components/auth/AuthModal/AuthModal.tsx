import { useAuth } from '@/contexts/AuthContext';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import styles from './AuthModal.module.css';

export function AuthModal() {
  const { isAuthOpen, closeAuth, authMode } = useAuth();
  const google = useGoogleAuth();

  return (
    <Modal open={isAuthOpen} onClose={closeAuth} size="sm" title={`Продължи към ${authMode}`}>
      <div className={styles.actions}>
        <Button variant="secondary" fullWidth onClick={google.signIn}>
          <span className={styles.gIcon}>G</span> Продължи с Google
        </Button>
      </div>
      <p className={styles.legal}>
        С продължаването се съгласявате с нашите Условия и признавате нашата Политика за
        поверителност.
      </p>
    </Modal>
  );
}