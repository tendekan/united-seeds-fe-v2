import type { ReactNode } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
}

export function FormField({ label, hint, children, htmlFor }: FormFieldProps) {
  return (
    <label className={styles.field} htmlFor={htmlFor}>
      <span className={styles.label}>{label}</span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}