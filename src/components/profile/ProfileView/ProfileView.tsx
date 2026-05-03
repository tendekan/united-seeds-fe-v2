import { useCallback, useEffect, useRef, useState } from 'react';
import type { UserProfile } from '@/types';
import { useAuth, getSafeUserId } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useSpinner } from '@/contexts/SpinnerContext';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getProfilePicture
} from '@/api/users';
import { setCachedUserPicture } from '@/hooks/useUserPicture';
import { followUser, getFollowers, getFollowing, unfollowUser } from '@/api/follow';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { PostsList } from '@/components/posts/PostsList/PostsList';
import { PhotoModal } from '@/components/profile/PhotoModal/PhotoModal';
import { UserListModal } from '@/components/profile/UserListModal/UserListModal';
import { formatDate, avatarFallback } from '@/utils/format';
import styles from './ProfileView.module.css';

interface Props {
  userId: string | null;
  displayName?: string;
  isOwnProfile: boolean;
}

export function ProfileView({ userId, displayName, isOwnProfile }: Props) {
  const { user, setServerUserId } = useAuth();
  const toast = useToast();
  const spinner = useSpinner();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(avatarFallback(displayName || user?.name));
  const [photoOpen, setPhotoOpen] = useState(false);

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [residency, setResidency] = useState('');

  const [following, setFollowing] = useState<{ userId: string; name?: string }[]>([]);
  const [followers, setFollowers] = useState<{ userId: string; name?: string }[]>([]);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const viewerId = getSafeUserId(user);

  const refreshFollow = useCallback(async () => {
    if (!userId) return;
    const [fl, fg] = await Promise.all([
      getFollowers(userId).catch(() => [] as { userId: string; name?: string }[]),
      getFollowing(userId).catch(() => [] as { userId: string; name?: string }[])
    ]);
    const followersList = Array.isArray(fl) ? fl : [];
    const followingList = Array.isArray(fg) ? fg : [];
    setFollowers(followersList);
    setFollowing(followingList);
    if (viewerId) {
      setIsFollowing(followersList.some((u) => String(u.userId) === viewerId));
    } else {
      setIsFollowing(false);
    }
  }, [userId, viewerId]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true);
    setEditing(false);
    getUserProfile(userId)
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setBio(p.bio || '');
        setDob(p.dateOfBirth || '');
        setResidency(p.residency || '');
        if (isOwnProfile && p.userId) setServerUserId(String(p.userId));
        // Profile response carries the picture URL directly — use it and seed
        // the picture cache so downstream PostCard/CommentItem render instantly.
        const inlineUrl = p.pictureFullUrl || p.pictureUrl;
        if (inlineUrl) {
          setPhotoUrl(inlineUrl);
          setCachedUserPicture(String(p.userId || userId), inlineUrl);
        }
      })
      .catch(() => {
        if (cancelled) return;
        toast.show('Неуспешно зареждане на профила.', 'error');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    // Fall back to the dedicated picture endpoint if the profile didn't include one.
    getProfilePicture(userId)
      .then((url) => {
        if (cancelled || !url) return;
        setPhotoUrl(url);
        setCachedUserPicture(userId, url);
      })
      .catch(() => {
        /* keep fallback initials */
      });

    refreshFollow();
    return () => {
      cancelled = true;
    };
  }, [userId, isOwnProfile, displayName, user?.name, toast, refreshFollow, setServerUserId]);

  if (!userId) {
    return <div className={styles.empty}>Влезте, за да видите профила си.</div>;
  }

  const onPhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    spinner.show();
    try {
      await uploadProfilePicture(userId, file);
      const url = await getProfilePicture(userId);
      if (url) {
        setPhotoUrl(url);
        setCachedUserPicture(userId, url);
      }
      toast.show('Снимката е обновена.', 'success');
    } catch (err) {
      console.error(err);
      toast.show('Неуспешно качване на снимката.', 'error');
    } finally {
      spinner.hide();
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSave = async () => {
    if (!userId) return;
    spinner.show();
    try {
      const updated = await updateUserProfile(userId, {
        bio: bio.trim(),
        dateOfBirth: dob || null,
        residency: residency.trim()
      });
      setProfile(updated);
      setEditing(false);
      toast.show('Профилът беше обновен.', 'success');
    } catch (e) {
      toast.show('Неуспешно обновяване на профила.', 'error');
    } finally {
      spinner.hide();
    }
  };

  const toggleFollow = async () => {
    if (!user || !userId) return;
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
      }
      await refreshFollow();
    } catch (e) {
      toast.show('Неуспешна операция.', 'error');
    }
  };

  const heading =
    displayName ||
    profile?.name ||
    profile?.facebookName ||
    profile?.posts?.[0]?.post?.facebookName ||
    `Потребител ${userId}`;

  return (
    <div className={styles.profile}>
      <header className={styles.header}>
        <div className={styles.avatarWrap}>
          <img
            src={photoUrl}
            alt={heading}
            className={styles.avatar}
            onClick={() => setPhotoOpen(true)}
          />
          {isOwnProfile && (
            <label className={styles.uploadBtn}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onPhotoSelected}
              />
              Промени снимката
            </label>
          )}
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{heading}</h2>
          <p className={styles.subId}>ID: {userId}</p>
          <div className={styles.stats}>
            <button
              type="button"
              className={styles.statBtn}
              onClick={() => setFollowersOpen(true)}
            >
              <strong>{followers.length}</strong>
              <span>Последователи</span>
            </button>
            <button
              type="button"
              className={styles.statBtn}
              onClick={() => setFollowingOpen(true)}
            >
              <strong>{following.length}</strong>
              <span>Последвани</span>
            </button>
          </div>
        </div>
        <div className={styles.headerActions}>
          {!isOwnProfile && user && (
            <Button variant={isFollowing ? 'secondary' : 'gradient'} onClick={toggleFollow}>
              {isFollowing ? 'Спри да следваш' : 'Последвай'}
            </Button>
          )}
          {isOwnProfile && !editing && (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              ✏️ Редактирай
            </Button>
          )}
        </div>
      </header>

      <section className={styles.summary}>
        <SummaryRow label="Био">
          {editing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          ) : (
            <span>{profile?.bio?.trim() || 'Няма биография.'}</span>
          )}
        </SummaryRow>
        <SummaryRow label="Дата на раждане">
          {editing ? (
            <input type="date" value={dob || ''} onChange={(e) => setDob(e.target.value)} />
          ) : (
            <span>{profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : '-'}</span>
          )}
        </SummaryRow>
        <SummaryRow label="Местоживеене">
          {editing ? (
            <input
              value={residency}
              onChange={(e) => setResidency(e.target.value)}
              placeholder="Град, държава"
            />
          ) : (
            <span>{profile?.residency?.trim() || '-'}</span>
          )}
        </SummaryRow>
        {editing && (
          <div className={styles.editActions}>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Откажи
            </Button>
            <Button onClick={onSave}>Запази</Button>
          </div>
        )}
      </section>

      <section className={styles.lists}>
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h3>Публикации</h3>
            <span className={styles.sectionCount}>
              {profile?.posts?.length || 0}
            </span>
          </div>
          <PostsList posts={profile?.posts || []} emptyMessage="Все още няма публикации." />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h3>Споделяния</h3>
            <span className={styles.sectionCount}>
              {profile?.retweets?.length || 0}
            </span>
          </div>
          <PostsList
            posts={[]}
            retweets={profile?.retweets || []}
            emptyMessage="Няма споделени публикации."
          />
        </div>
      </section>

      <PhotoModal open={photoOpen} onClose={() => setPhotoOpen(false)} src={photoUrl} />
      <UserListModal
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        title="Последователи"
        users={followers}
        loading={loading}
      />
      <UserListModal
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        title="Последвани"
        users={following}
        loading={loading}
      />
    </div>
  );
}

function SummaryRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowValue}>{children}</div>
    </div>
  );
}