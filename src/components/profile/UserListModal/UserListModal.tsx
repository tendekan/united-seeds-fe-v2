import { Modal } from '@/components/ui/Modal/Modal';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { useUserPicture } from '@/hooks/useUserPicture';
import styles from './UserListModal.module.css';

interface User {
  userId: string;
  name?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  users: User[];
  loading?: boolean;
}

function UserRow({
  user,
  onClick
}: {
  user: User;
  onClick: () => void;
}) {
  const picture = useUserPicture(user.userId);
  return (
    <li className={styles.row} onClick={onClick}>
      <Avatar name={user.name} src={picture} size={36} />
      <span>{user.name || `Потребител ${user.userId}`}</span>
    </li>
  );
}

export function UserListModal({ open, onClose, title, users, loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {loading ? (
        <div className={styles.empty}>Зарежда се…</div>
      ) : users.length === 0 ? (
        <div className={styles.empty}>Няма потребители.</div>
      ) : (
        <ul className={styles.list}>
          {users.map((u) => (
            <UserRow
              key={u.userId}
              user={u}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('us:openProfile', {
                    detail: { userId: u.userId, name: u.name }
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