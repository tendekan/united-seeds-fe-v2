import { Button } from '@/components/ui/Button/Button';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <Button variant="secondary" size="sm" onClick={onPrev} disabled={page <= 1}>
        ← Предишна
      </Button>
      <span className={styles.label}>
        Страница {page} от {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        Следваща →
      </Button>
    </div>
  );
}