import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div>© {new Date().getFullYear()} UnitedSeeds</div>
      <div className={styles.spacer} />
      <div className={styles.tag}>Made with ❤ for lifelong learners</div>
    </footer>
  );
}