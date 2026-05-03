import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { getPostLikes } from '@/api/posts';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useUserPicture } from '@/hooks/useUserPicture';
import styles from './LikesModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  postId: string;
}

interface LikeUser {
  userId: string;
  userName?: string;
}

function LikeRow({ user, onClick }: { user: LikeUser; onClick: () => void }) {
  const picture = useUserPicture(user.userId);
  return (
    <li className={styles.row} onClick={onClick}>
      <Avatar name={user.userName} src={picture} size={36} />
      <span>{user.userName || `Потребител ${user.userId}`}</span>
    </li>
  );
}

export function LikesModal({ open, onClose, postId }: Props) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<LikeUser[]>([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getPostLikes(postId, 1, 50)
      .then((data) => {
        // Endpoint may return either { likes: [...] } or a bare array.
        if (Array.isArray(data)) setUsers(data as unknown as LikeUser[]);
        else setUsers((data as { likes?: LikeUser[] })?.likes || []);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [open, postId]);

  return (
    <Modal open={open} onClose={onClose} title="Харесвания" size="sm">
      {loading ? (
        <div className={styles.loader}>
          <Spinner /> <span>Зарежда се…</span>
        </div>
      ) : users.length === 0 ? (
        <div className={styles.empty}>Все още няма харесвания.</div>
      ) : (
        <ul className={styles.list}>
          {users.map((u) => (
            <LikeRow
              key={u.userId}
              user={u}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('us:openProfile', {
                    detail: { userId: u.userId, name: u.userName }
                  })
                );
                onClose();
              }}
            />
          ))}
        </ul>
      )}
    </Modal>
  );
}