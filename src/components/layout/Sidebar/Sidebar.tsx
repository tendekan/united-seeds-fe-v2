import type { AppSection } from '@/types';
import styles from './Sidebar.module.css';

interface MenuItem {
  id: AppSection;
  label: string;
  icon: string;
}

const ITEMS: MenuItem[] = [
  { id: 'profile', label: 'Моят профил', icon: '👤' },
  { id: 'feed', label: 'Новини', icon: '📰' },
  { id: 'create', label: 'Създай публикация', icon: '✍️' },
  { id: 'services', label: 'Услуги', icon: '🧩' },
  { id: 'dating', label: 'Запознанства', icon: '💞' },
  { id: 'settings', label: 'Настройки', icon: '⚙️' }
];

interface SidebarProps {
  activeSection: AppSection;
  onSelect: (id: AppSection) => void;
}

export function Sidebar({ activeSection, onSelect }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.menu}>
        {ITEMS.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.item} ${active ? styles.active : ''}`}
              onClick={() => onSelect(item.id)}
              title={item.label}
            >
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.label}>{item.label}</span>
              {active && <span className={styles.dot} aria-hidden="true" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}