import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode
} from 'react';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'gradient'
  | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      fullWidth,
      loading,
      className,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = [
      styles.btn,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      className
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={cls}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <span className={styles.loader} aria-hidden="true" />
        ) : iconLeft ? (
          <span className={styles.icon}>{iconLeft}</span>
        ) : null}
        <span className={styles.label}>{children}</span>
        {iconRight && !loading ? <span className={styles.icon}>{iconRight}</span> : null}
      </button>
    );
  }
);

Button.displayName = 'Button';