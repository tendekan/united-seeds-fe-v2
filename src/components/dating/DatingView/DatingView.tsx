import styles from './DatingView.module.css';

export function DatingView() {
  return (
    <section className={styles.dating}>
      <div className={styles.hero}>
        <img
          loading="lazy"
          src="https://images.unsplash.com/photo-1584467735871-3316d0b4f63a?q=80&w=1200&auto=format&fit=crop"
          alt="Възрастна двойка се усмихва заедно"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className={styles.overlay} />
        <div className={styles.content}>
          <span className={styles.eyebrow}>Скоро</span>
          <h2>Намерете своя идеален партньор</h2>
          <p>
            Запознанства, базирани на истински интереси — без бързане, без натиск,
            само автентични връзки.
          </p>
        </div>
      </div>
    </section>
  );
}