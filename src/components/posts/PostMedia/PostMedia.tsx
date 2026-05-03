import { useEffect, useState } from 'react';
import { getSignedVideoDownloadUrl } from '@/api/videos';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './PostMedia.module.css';

interface Props {
  fileName?: string;
}

export function PostMedia({ fileName }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!fileName) return;
    let cancelled = false;
    setUrl(null);
    setError(false);
    getSignedVideoDownloadUrl(fileName)
      .then((u) => {
        if (cancelled) return;
        if (u) setUrl(u);
        else setError(true);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [fileName]);

  if (!fileName) return null;
  if (error) return <div className={styles.error}>Видеото не може да бъде заредено.</div>;
  if (!url) {
    return (
      <div className={styles.loading}>
        <Spinner size={18} />
        <span>Зарежда се видео…</span>
      </div>
    );
  }
  return (
    <video className={styles.video} controls preload="metadata" src={url}>
      Вашият браузър не поддържа видео.
    </video>
  );
}