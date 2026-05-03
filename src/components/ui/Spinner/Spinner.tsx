import styles from './Spinner.module.css';

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className={styles.spin}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(15,23,42,0.18)" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}