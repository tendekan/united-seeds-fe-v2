import { useEffect, useMemo, useState } from 'react';
import type { Post } from '@/types';
import { useAuth, getSafeUserId } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  deletePost,
  getPostLikesCount,
  getPostRetweetsCount,
  isPostLikedByUser,
  isPostRetweetedByUser,
  likePost,
  retweetPost,
  unlikePost,
  unretweetPost,
  updatePost
} from '@/api/posts';
import { getComments } from '@/api/comments';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { PostMedia } from '@/components/posts/PostMedia/PostMedia';
import { CommentsSection } from '@/components/comments/CommentsSection/CommentsSection';
import { LikesModal } from '@/components/posts/LikesModal/LikesModal';
import { categoryLabel, subcategoryLabel } from '@/utils/categories';
import { formatDateTime, safeCount } from '@/utils/format';
import { useUserPicture } from '@/hooks/useUserPicture';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  retweetBadge?: string;
  onChanged?: () => void;
  onDeleted?: (postId: string) => void;
}

const canBackend = (id: unknown) => /^[0-9]+$/.test(String(id || '').trim());

export function PostCard({ post, retweetBadge, onChanged, onDeleted }: PostCardProps) {
  const { user, openAuth } = useAuth();
  const toast = useToast();

  const ownerId = String(post.userId || '');
  const currentUserId = getSafeUserId(user) || '';
  const isOwner = !!ownerId && ownerId === currentUserId;
  const canLike = canBackend(post.id);
  const authorPicture = useUserPicture(ownerId);

  const [likeCount, setLikeCount] = useState(safeCount(post.likeCount));
  const [liked, setLiked] = useState(false);
  const [retweetCount, setRetweetCount] = useState(safeCount(post.shareCount));
  const [retweeted, setRetweeted] = useState(false);
  const [commentCount, setCommentCount] = useState(safeCount(post.commentCount));
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.postText || '');
  const [displayText, setDisplayText] = useState(post.postText || '');
  const [showLikes, setShowLikes] = useState(false);

  // Keep local display text in sync if the parent re-fetches a fresh post.
  useEffect(() => {
    setDisplayText(post.postText || '');
  }, [post.postText]);

  const categoryText = useMemo(() => {
    const cat = categoryLabel(post.category);
    const sub = subcategoryLabel(post.category, post.subcategory);
    return [cat, sub].filter(Boolean).join(' • ');
  }, [post.category, post.subcategory]);

  useEffect(() => {
    if (!canLike) return;
    let cancelled = false;
    Promise.all([
      getPostLikesCount(post.id).catch(() => 0),
      getPostRetweetsCount(post.id).catch(() => 0),
      currentUserId
        ? isPostLikedByUser(post.id, currentUserId).catch(() => false)
        : Promise.resolve(false),
      currentUserId
        ? isPostRetweetedByUser(post.id, currentUserId).catch(() => false)
        : Promise.resolve(false),
      getComments(post.id, 1, 1, 'desc')
        .then((page) => page.total ?? page.comments?.length ?? 0)
        .catch(() => 0)
    ]).then(([lc, rc, isLiked, isRt, cc]) => {
      if (cancelled) return;
      setLikeCount(safeCount(lc));
      setRetweetCount(safeCount(rc));
      setLiked(Boolean(isLiked));
      setRetweeted(Boolean(isRt));
      setCommentCount(safeCount(cc));
    });
    return () => {
      cancelled = true;
    };
  }, [post.id, canLike, currentUserId]);

  const handleLike = async () => {
    if (!user) return openAuth('Влез');
    if (!canLike || !currentUserId) return;
    try {
      if (liked) {
        await unlikePost(post.id, currentUserId);
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await likePost(post.id, currentUserId, user.name);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch (e) {
      console.error(e);
      toast.show('Неуспешна операция за харесване.', 'error');
    }
  };

  const handleRetweet = async () => {
    if (!user) return openAuth('Влез');
    if (!canLike || !currentUserId || isOwner) return;
    try {
      if (retweeted) {
        await unretweetPost(post.id, currentUserId);
        setRetweeted(false);
        setRetweetCount((c) => Math.max(0, c - 1));
      } else {
        await retweetPost(post.id, currentUserId, user.name);
        setRetweeted(true);
        setRetweetCount((c) => c + 1);
      }
      onChanged?.();
    } catch (e) {
      console.error(e);
      toast.show('Неуспешна операция за споделяне.', 'error');
    }
  };

  const handleSaveEdit = async () => {
    const newText = editText;
    try {
      // PUT /posts/{id} requires the full Post object, not just the field we changed.
      await updatePost(post.id, { ...post, postText: newText });
      // Optimistically update the visible text so the card refreshes immediately,
      // then trigger the parent to re-fetch in the background.
      setDisplayText(newText);
      setEditing(false);
      toast.show('Публикацията е обновена.', 'success');
      onChanged?.();
    } catch (e) {
      console.error(e);
      toast.show('Неуспешно обновяване.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази публикация?')) return;
    try {
      await deletePost(post.id);
      toast.show('Публикацията е изтрита.', 'success');
      onDeleted?.(post.id);
    } catch (e) {
      console.error(e);
      toast.show('Неуспешно изтриване.', 'error');
    }
  };

  const openProfile = () => {
    if (!ownerId) return;
    window.dispatchEvent(
      new CustomEvent('us:openProfile', {
        detail: { userId: ownerId, name: post.facebookName }
      })
    );
  };

  return (
    <article className={styles.card}>
      {retweetBadge && <div className={styles.retweetBadge}>⟳ {retweetBadge}</div>}

      <header className={styles.header}>
        <button type="button" className={styles.author} onClick={openProfile}>
          <Avatar name={post.facebookName} src={authorPicture} size={42} />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.facebookName || 'Потребител'}</span>
            <span className={styles.timestamp}>{formatDateTime(post.createdAt)}</span>
          </div>
        </button>
        {isOwner && canLike && (
          <div className={styles.ownerActions}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => {
                setEditing((v) => !v);
                setEditText(post.postText || '');
              }}
              aria-label="Редактирай"
            >
              ✏️
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleDelete}
              aria-label="Изтрий"
            >
              🗑️
            </button>
          </div>
        )}
      </header>

      {editing ? (
        <div className={styles.editor}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={4}
          />
          <div className={styles.editorActions}>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Откажи
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              Запази
            </Button>
          </div>
        </div>
      ) : (
        <p className={styles.text}>{displayText}</p>
      )}

      {(post.videoUrl || post.videoLink) && (
        <div className={styles.media}>
          <PostMedia fileName={post.videoUrl || post.videoLink || ''} />
        </div>
      )}

      {categoryText && <div className={styles.tags}>{categoryText}</div>}

      <div className={styles.stats}>
        <button
          type="button"
          className={styles.statBtn}
          onClick={() => canLike && setShowLikes(true)}
          disabled={!canLike}
        >
          ❤ <strong>{likeCount}</strong> харесвания
        </button>
        <span>
          💬 <strong>{commentCount}</strong> коментара
        </span>
        <span>
          ⟳ <strong>{retweetCount}</strong> споделяния
        </span>
      </div>

      <div className={styles.actions}>
        <Button
          variant={liked ? 'primary' : 'secondary'}
          size="sm"
          onClick={handleLike}
          disabled={!canLike}
        >
          {liked ? '♥ Харесано' : '♡ Харесай'}
        </Button>
        <Button
          variant={retweeted ? 'primary' : 'secondary'}
          size="sm"
          onClick={handleRetweet}
          disabled={!canLike || isOwner}
          title={isOwner ? 'Не можете да споделите собствена публикация' : undefined}
        >
          ⟳ {retweeted ? 'Споделено' : 'Сподели'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments((v) => !v)}
        >
          💬 Коментари
        </Button>
      </div>

      {showComments && canLike && (
        <CommentsSection
          postId={post.id}
          onCountChange={(c) => setCommentCount(c)}
        />
      )}

      <LikesModal open={showLikes} onClose={() => setShowLikes(false)} postId={post.id} />
    </article>
  );
}