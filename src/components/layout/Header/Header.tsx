import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button/Button';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import styles from './Header.module.css';

export function Header() {
  const { user, openAuth, signOut } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">
          <span>US</span>
        </div>
        <div className={styles.titles}>
          <h1>UnitedSeeds</h1>
          <p>Развивайте умения. Споделяйте знания. Възнаграждавайте създателите.</p>
        </div>
      </div>

      <nav className={styles.authNav}>
        {!user ? (
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" onClick={() => openAuth('Влез')}>
              Влез
            </Button>
            <Button variant="gradient" size="sm" onClick={() => openAuth('Регистрирай се')}>
              Регистрирай се
            </Button>
          </div>
        ) : (
          <div className={styles.profile}>
            <Avatar name={user.name} src={user.photoUrl} size={40} />
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{user.name}</div>
              {user.email && <div className={styles.profileEmail}>{user.email}</div>}
            </div>
            <Button variant="secondary" size="sm" onClick={signOut}>
              Излез
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}