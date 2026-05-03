import { useCallback, useEffect, useState } from 'react';
import type { Post } from '@/types';
import { CATEGORIES, type CategoryKey } from '@/utils/categories';
import { getPostsByCategory } from '@/api/posts';
import { Button } from '@/components/ui/Button/Button';
import { PostsList } from '@/components/posts/PostsList/PostsList';
import { Pagination } from '@/components/posts/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './ServicePostsView.module.css';

interface Props {
  category: CategoryKey;
  onBack: () => void;
}

const PAGE_SIZE = 5;

export function ServicePostsView({ category, onBack }: Props) {
  const def = CATEGORIES.find((c) => c.key === category);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!def) return;
    setLoading(true);
    try {
      const data = await getPostsByCategory(def.apiLabel, page, PAGE_SIZE);
      const list = Array.isArray(data) ? data : data.posts;
      const tot = Array.isArray(data) ? list.length : data.total ?? list.length;
      setPosts(list);
      setTotal(tot);
    } catch (e) {
      console.error(e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [def, page]);

  useEffect(() => {
    load();
  }, [load]);

  if (!def) return null;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className={styles.view}>
      <div className={styles.head}>
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Назад
        </Button>
        <h2>
          {def.icon} {def.label}
        </h2>
      </div>
      {loading ? (
        <div className={styles.loading}>
          <Spinner /> <span>Зарежда се…</span>
        </div>
      ) : (
        <PostsList
          posts={posts}
          emptyMessage="Все още няма публикации в тази категория."
          onChanged={load}
        />
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </section>
  );
}