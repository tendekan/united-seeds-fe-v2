import { CATEGORIES, type CategoryKey } from '@/utils/categories';
import styles from './ServicesView.module.css';

interface Props {
  onSelect: (cat: CategoryKey) => void;
}

export function ServicesView({ onSelect }: Props) {
  return (
    <section className={styles.services}>
      <header className={styles.header}>
        <h2>Услуги</h2>
        <p className={styles.subtitle}>
          Открийте умения и услуги в категория, която ви интересува.
        </p>
      </header>
      <div className={styles.grid}>
        {CATEGORIES.map((cat, idx) => (
          <button
            key={cat.key}
            type="button"
            className={styles.tile}
            onClick={() => onSelect(cat.key)}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div className={styles.icon} aria-hidden="true">
              {cat.icon}
            </div>
            <div className={styles.label}>{cat.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}