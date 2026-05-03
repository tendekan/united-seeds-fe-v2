import { useCallback, useEffect, useState } from 'react';
import type { Comment, SortOrder } from '@/types';
import { useAuth, getSafeUserId } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createComment, deleteComment, getComments, updateComment } from '@/api/comments';
import { Button } from '@/components/ui/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { CommentItem } from '@/components/comments/CommentItem/CommentItem';
import { Pagination } from '@/components/posts/Pagination/Pagination';
import styles from './CommentsSection.module.css';

interface Props {
  postId: string;
  onCountChange?: (count: number) => void;
}

const PAGE_SIZE = 5;

export function CommentsSection({ postId, onCountChange }: Props) {
  const { user, openAuth } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getComments(postId, page, PAGE_SIZE, sortOrder);
      setComments(data.comments || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      onCountChange?.(data.total || 0);
    } catch (e) {
      console.error(e);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId, page, sortOrder, onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return openAuth('Влез');
    if (!text.trim()) return;
    const userId = getSafeUserId(user);
    if (!userId) return;
    setSubmitting(true);
    try {
      await createComment({
        postId,
        userId,
        userName: user.name,
        commentText: text.trim()
      });
      setText('');
      setPage(1);
      await load();
      toast.show('Коментарът е публикуван.', 'success');
    } catch (err) {
      console.error(err);
      toast.show('Неуспешно публикуване.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string, newText: string) => {
    try {
      await updateComment(commentId, { commentText: newText });
      await load();
      toast.show('Коментарът е обновен.', 'success');
    } catch (e) {
      toast.show('Неуспешно обновяване.', 'error');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Изтриване на коментара?')) return;
    try {
      await deleteComment(commentId);
      await load();
      toast.show('Коментарът е изтрит.', 'success');
    } catch (e) {
      toast.show('Неуспешно изтриване.', 'error');
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.controls}>
        <span className={styles.count}>{total} коментара</span>
        <label className={styles.sort}>
          Подреди:
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as SortOrder);
              setPage(1);
            }}
          >
            <option value="desc">Най-нови първо</option>
            <option value="asc">Най-стари първо</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <Spinner size={18} /> <span>Зареждане…</span>
        </div>
      ) : comments.length === 0 ? (
        <div className={styles.empty}>Все още няма коментари.</div>
      ) : (
        <ul className={styles.list}>
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      <form className={styles.form} onSubmit={submit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напиши коментар..."
        />
        <Button size="sm" type="submit" loading={submitting}>
          Публикувай
        </Button>
      </form>
    </section>
  );
}