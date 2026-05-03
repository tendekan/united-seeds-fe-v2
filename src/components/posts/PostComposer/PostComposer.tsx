import { useMemo, useState } from 'react';
import { useAuth, getSafeUserId } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useSpinner } from '@/contexts/SpinnerContext';
import { CATEGORIES, type CategoryKey } from '@/utils/categories';
import { createPost } from '@/api/posts';
import { uploadVideo } from '@/api/videos';
import { Button } from '@/components/ui/Button/Button';
import { FormField } from '@/components/ui/FormField/FormField';
import styles from './PostComposer.module.css';

interface Props {
  onCreated?: () => void;
}

export function PostComposer({ onCreated }: Props) {
  const { user, openAuth } = useAuth();
  const toast = useToast();
  const spinner = useSpinner();

  const [category, setCategory] = useState<CategoryKey>(CATEGORIES[0].key);
  const [subcategory, setSubcategory] = useState<string>(
    CATEGORIES[0].subcategories[0]?.value || ''
  );
  const [text, setText] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subOptions = useMemo(
    () => CATEGORIES.find((c) => c.key === category)?.subcategories ?? [],
    [category]
  );

  const submit = async () => {
    if (!user) {
      openAuth('Влез');
      return;
    }
    if (!text.trim()) {
      toast.show('Напишете текст за публикацията.', 'error');
      return;
    }
    setSubmitting(true);
    spinner.show();
    try {
      let videoFullName = '';
      if (video) {
        videoFullName = await uploadVideo(video);
      }
      const cat = CATEGORIES.find((c) => c.key === category);
      await createPost({
        id: String(Date.now()).slice(-9),
        userId: getSafeUserId(user) || undefined,
        facebookName: user.name,
        category: cat?.apiLabel || category,
        subcategory,
        videoUrl: videoFullName,
        postText: text.trim(),
        createdAt: new Date().toISOString()
      });
      toast.show('Публикацията беше изпратена.', 'success');
      setText('');
      setVideo(null);
      onCreated?.();
    } catch (e) {
      console.error(e);
      toast.show('Неуспешно публикуване.', 'error');
    } finally {
      setSubmitting(false);
      spinner.hide();
    }
  };

  return (
    <section className={styles.composer}>
      <header className={styles.header}>
        <h2>Създай нова публикация</h2>
        <p className={styles.subtitle}>
          Споделете опит, идея или въпрос с общността.
        </p>
      </header>

      <div className={styles.grid}>
        <FormField label="Категория">
          <select
            value={category}
            onChange={(e) => {
              const next = e.target.value as CategoryKey;
              setCategory(next);
              const def = CATEGORIES.find((c) => c.key === next);
              setSubcategory(def?.subcategories[0]?.value || '');
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Подкатегория">
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            {subOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Видео (по избор)" hint="Поддържат се mp4, webm, mov">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
        />
      </FormField>

      <FormField label="Съдържание">
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сподели нещо с общността..."
        />
      </FormField>

      <div className={styles.actions}>
        <Button variant="gradient" loading={submitting} onClick={submit}>
          Публикувай
        </Button>
      </div>
    </section>
  );
}