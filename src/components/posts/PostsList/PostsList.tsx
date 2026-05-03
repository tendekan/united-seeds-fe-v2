import type { Post, PostWithStats } from '@/types';
import { PostCard } from '@/components/posts/PostCard/PostCard';
import styles from './PostsList.module.css';

interface PostsListProps {
  /** Either raw Post[] or PostWithStats[] (the wrapper used by /feed and profile). */
  posts?: (Post | PostWithStats)[];
  /** Same shape as posts; rendered with a "shared" badge. */
  retweets?: (Post | PostWithStats)[];
  emptyMessage?: string;
  onChanged?: () => void;
}

interface NormalizedItem {
  kind: 'post' | 'retweet';
  post: Post;
  stats: {
    likeCount?: number;
    commentCount?: number;
    shareCount?: number;
  };
  retweetBadge?: string;
}

function normalize(
  entry: Post | PostWithStats,
  kind: 'post' | 'retweet'
): NormalizedItem | null {
  if (!entry) return null;
  // Wrapper shape (PostWithStatsResponse)
  if ('post' in entry && entry.post) {
    const stats = {
      likeCount: entry.likeCount,
      commentCount: entry.commentCount,
      shareCount: entry.shareCount
    };
    let badge: string | undefined;
    if (kind === 'retweet' || entry.retweet) {
      badge =
        entry.retweeterName ||
        entry.retweetUserName ||
        entry.retweetUser?.name
          ? `${
              entry.retweeterName ||
              entry.retweetUserName ||
              entry.retweetUser?.name
            } сподели`
          : 'Споделено';
    }
    return { kind, post: entry.post as Post, stats, retweetBadge: badge };
  }
  // Bare Post
  const p = entry as Post;
  return {
    kind,
    post: p,
    stats: {
      likeCount: p.likeCount,
      commentCount: p.commentCount,
      shareCount: p.shareCount
    },
    retweetBadge: kind === 'retweet' ? 'Споделено' : undefined
  };
}

export function PostsList({
  posts = [],
  retweets = [],
  emptyMessage = 'Няма публикации.',
  onChanged
}: PostsListProps) {
  const items: NormalizedItem[] = [
    ...posts.map((p) => normalize(p, 'post')).filter((x): x is NormalizedItem => !!x),
    ...retweets
      .map((r) => normalize(r, 'retweet'))
      .filter((x): x is NormalizedItem => !!x)
  ];

  if (!items.length) {
    return <div className={styles.empty}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.list}>
      {items.map((item, idx) => (
        <PostCard
          key={`${item.kind}-${item.post.id ?? `idx-${idx}`}`}
          post={{
            ...item.post,
            likeCount: item.stats.likeCount ?? item.post.likeCount,
            commentCount: item.stats.commentCount ?? item.post.commentCount,
            shareCount: item.stats.shareCount ?? item.post.shareCount
          }}
          retweetBadge={item.retweetBadge}
          onChanged={onChanged}
        />
      ))}
    </div>
  );
}