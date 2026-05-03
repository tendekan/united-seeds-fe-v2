import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { AppShell } from '@/components/layout/AppShell/AppShell';
import { SignedOutLanding } from '@/components/auth/SignedOutLanding/SignedOutLanding';
import { AuthModal } from '@/components/auth/AuthModal/AuthModal';
import { Chatbot } from '@/components/chatbot/Chatbot/Chatbot';
import { CookieConsent } from '@/components/cookie/CookieConsent/CookieConsent';
import styles from './App.module.css';

export default function App() {
  const { user } = useAuth();
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.body}>{user ? <AppShell /> : <SignedOutLanding />}</div>
      <Footer />
      <AuthModal />
      <Chatbot />
      <CookieConsent />
    </div>
  );
}