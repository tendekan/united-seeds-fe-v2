import { useEffect, useState } from 'react';
import type { Comment } from '@/types';
import { useAuth, getSafeUserId } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  getCommentLikesCount,
  isCommentLikedByUser,
  likeComment,
  unlikeComment
} from '@/api/comments';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { formatDateTime } from '@/utils/format';
import { useUserPicture } from '@/hooks/useUserPicture';
import styles from './CommentItem.module.css';

interface Props {
  comment: Comment;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function CommentItem({ comment, onEdit, onDelete }: Props) {
  const { user, openAuth } = useAuth();
  const toast = useToast();
  const userId = getSafeUserId(user) || '';
  const isOwner = !!userId && String(comment.userId) === userId;
  const commenterPicture = useUserPicture(comment.userId);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.commentText);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getCommentLikesCount(comment.id).catch(() => 0),
      userId ? isCommentLikedByUser(comment.id, userId).catch(() => false) : false
    ]).then(([c, l]) => {
      if (cancelled) return;
      setLikeCount(c);
      setLiked(Boolean(l));
    });
    return () => {
      cancelled = true;
    };
  }, [comment.id, userId]);

  const toggleLike = async () => {
    if (!user) return openAuth('Влез');
    if (!userId) return;
    try {
      if (liked) {
        await unlikeComment(comment.id, userId);
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await likeComment(comment.id, userId, user.name);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch {
      toast.show('Неуспешна операция.', 'error');
    }
  };

  return (
    <li className={styles.row}>
      <Avatar name={comment.userName} src={commenterPicture} size={32} />
      <div className={styles.body}>
        <div className={styles.head}>
          <button
            type="button"
            className={styles.author}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent('us:openProfile', {
                  detail: { userId: comment.userId, name: comment.userName }
                })
              )
            }
          >
            {comment.userName || `Потребител ${comment.userId}`}
          </button>
          {comment.createdAt && (
            <span className={styles.time}>{formatDateTime(comment.createdAt)}</span>
          )}
        </div>
        {editing ? (
          <div className={styles.editor}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
            <div className={styles.editorActions}>
              <button type="button" onClick={() => setEditing(false)}>
                Откажи
              </button>
              <button
                type="button"
                onClick={() => {
                  onEdit(comment.id, draft);
                  setEditing(false);
                }}
              >
                Запази
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.text}>{comment.commentText}</p>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.likeBtn} ${liked ? styles.liked : ''}`}
            onClick={toggleLike}
          >
            {liked ? '♥' : '♡'} {likeCount}
          </button>
          {isOwner && !editing && (
            <>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => setEditing(true)}
              >
                Редактирай
              </button>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => onDelete(comment.id)}
              >
                Изтрий
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}