import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PostWithStats } from '@/types';
import { useAuth, getSafeUserId } from '@/contexts/AuthContext';
import { getFeed } from '@/api/feed';
import { getFollowing } from '@/api/follow';
import { PostsList } from '@/components/posts/PostsList/PostsList';
import { Pagination } from '@/components/posts/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './FeedView.module.css';

const PAGE_SIZE = 10;

export function FeedView() {
  const { user } = useAuth();
  const viewerId = getSafeUserId(user);

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PostWithStats[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async () => {
    if (!viewerId) return;
    setLoading(true);
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const [feed, following] = await Promise.all([
        getFeed(PAGE_SIZE, offset),
        getFollowing(viewerId).catch(() => [])
      ]);
      const list = Array.isArray(feed) ? feed : [];
      setItems(list);
      setHasMore(list.length === PAGE_SIZE);
      setFollowingIds(new Set((following || []).map((u) => String(u.userId))));
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, viewerId]);

  useEffect(() => {
    load();
  }, [load]);

  // Belt-and-braces: keep only posts authored by people the viewer follows
  // (or by the viewer themself). The BE may return a wider set.
  const visibleItems = useMemo(() => {
    if (!followingIds) return items;
    return items.filter((entry) => {
      const authorId = String(entry.post?.userId || '');
      if (!authorId) return false;
      if (viewerId && authorId === viewerId) return true;
      return followingIds.has(authorId);
    });
  }, [items, followingIds, viewerId]);

  return (
    <section className={styles.feed}>
      <header className={styles.header}>
        <h2>Новини</h2>
        <p className={styles.subtitle}>Публикации от хората, които следвате.</p>
      </header>

      {loading ? (
        <div className={styles.loading}>
          <Spinner /> <span>Зарежда се…</span>
        </div>
      ) : visibleItems.length === 0 && items.length > 0 ? (
        <div className={styles.empty}>
          Няма публикации от хората, които следвате на тази страница.
        </div>
      ) : (
        <PostsList
          posts={visibleItems}
          emptyMessage="Все още няма публикации във вашата лента. Последвайте някого, за да видите публикации тук."
          onChanged={load}
        />
      )}

      <Pagination
        page={page}
        totalPages={hasMore ? page + 1 : page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </section>
  );
}