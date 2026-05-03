import styles from './SignedOutLanding.module.css';

export function SignedOutLanding() {
  return (
    <main className={styles.landing}>
      <section className={styles.canva}>
        <div className={styles.canvaFrame}>
          <iframe
            loading="lazy"
            className={styles.canvaIframe}
            src="https://www.canva.com/design/DAG3zLhxUqs/pqEfrh_IQ5PaEJn1x1ky5Q/view?embed"
            allowFullScreen
            allow="fullscreen"
            title="UnitedSeeds презентация"
          />
        </div>
      </section>
    </main>
  );
}