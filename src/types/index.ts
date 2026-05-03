export interface AuthUser {
  provider: 'google' | 'facebook';
  userId: string;
  serverUserId?: string;
  name: string;
  email?: string;
  photoUrl?: string;
  accessToken: string;
}

export interface UserProfile {
  userId: string;
  bio?: string;
  dateOfBirth?: string | null;
  residency?: string;
  name?: string;
  email?: string;
  pictureUrl?: string;
  pictureFullUrl?: string;
  pictureObjectName?: string;
  facebookName?: string;
  posts?: PostWithStats[];
  retweets?: PostWithStats[];
}

export interface Post {
  id: string;
  userId: string;
  facebookName?: string;
  category?: string;
  subcategory?: string;
  videoUrl?: string;
  videoLink?: string;
  postText?: string;
  createdAt?: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  likes?: unknown[];
  comments?: unknown[];
}

export interface PostWithStats {
  post: Post;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  retweet?: boolean;
  retweetedAt?: string;
  retweeterName?: string;
  retweetUserName?: string;
  retweetUser?: { name?: string };
  likes?: unknown[];
  comments?: unknown[];
}

// Backwards-compatible alias for older imports.
export type RetweetEnvelope = PostWithStats;

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName?: string;
  commentText: string;
  createdAt?: string;
  likeCount?: number;
}

export interface CommentsPage {
  comments: Comment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface LikeUser {
  userId: string;
  userName?: string;
}

export interface FeedResponse {
  posts: Post[];
  total?: number;
  hasMore?: boolean;
}

export type SortOrder = 'asc' | 'desc';

export type AppSection =
  | 'profile'
  | 'feed'
  | 'create'
  | 'services'
  | 'dating'
  | 'settings'
  | 'service-posts';

export type ToastKind = 'info' | 'success' | 'error';

export interface SettingsState {
  useProfileForDating: boolean;
  language: 'en' | 'bg' | 'ro' | 'sv' | 'nl';
  currency: 'EUR' | 'BGN' | 'RON';
}

declare global {
  interface Window {
    UNITEDSEEDS_GOOGLE_CLIENT_ID?: string;
    UNITEDSEEDS_FACEBOOK_APP_ID?: string;
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
  }
}