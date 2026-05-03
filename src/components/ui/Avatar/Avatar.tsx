import { useState } from 'react';
import { avatarFallback } from '@/utils/format';
import styles from './Avatar.module.css';

interface AvatarProps {
  name?: string;
  src?: string | null;
  size?: number;
  alt?: string;
  onClick?: () => void;
  className?: string;
}

export function Avatar({ name, src, size = 36, alt, onClick, className }: AvatarProps) {
  const fallback = avatarFallback(name);
  const [errored, setErrored] = useState(false);
  const finalSrc = !src || errored ? fallback : src;
  return (
    <img
      className={`${styles.avatar} ${onClick ? styles.clickable : ''} ${className || ''}`}
      src={finalSrc}
      alt={alt || name || 'Профил'}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      onClick={onClick}
      onError={() => setErrored(true)}
    />
  );
}