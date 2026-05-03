import { Modal } from '@/components/ui/Modal/Modal';
import styles from './PhotoModal.module.css';

interface Props {
  open: boolean;
  src: string;
  onClose: () => void;
}

export function PhotoModal({ open, src, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} size="lg" hideClose>
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Затвори"
      >
        ×
      </button>
      <img src={src} alt="Профилна снимка" className={styles.image} />
    </Modal>
  );
}