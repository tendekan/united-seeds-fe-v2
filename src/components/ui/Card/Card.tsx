import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...rest
}: CardProps) {
  const cls = [styles.card, styles[variant], styles[`p_${padding}`], className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}