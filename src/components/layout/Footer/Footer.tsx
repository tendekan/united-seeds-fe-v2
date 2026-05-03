import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div>© {new Date().getFullYear()} UnitedSeeds</div>
    </footer>
  );
}