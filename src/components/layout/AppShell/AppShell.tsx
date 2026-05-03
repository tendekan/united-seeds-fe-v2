import { useCallback, useEffect, useState } from 'react';
import type { AppSection } from '@/types';
import type { CategoryKey } from '@/utils/categories';
import { useAuth, getSafeUserId } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { ProfileView } from '@/components/profile/ProfileView/ProfileView';
import { FeedView } from '@/components/feed/FeedView/FeedView';
import { PostComposer } from '@/components/posts/PostComposer/PostComposer';
import { ServicesView } from '@/components/services/ServicesView/ServicesView';
import { DatingView } from '@/components/dating/DatingView/DatingView';
import { SettingsView } from '@/components/settings/SettingsView/SettingsView';
import { ServicePostsView } from '@/components/services/ServicePostsView/ServicePostsView';
import styles from './AppShell.module.css';

export function AppShell() {
  const { user } = useAuth();
  const [section, setSection] = useState<AppSection>('feed');
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeProfileName, setActiveProfileName] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);

  const navigate = useCallback(
    (next: AppSection) => {
      if (next === 'profile') {
        const id = getSafeUserId(user);
        setActiveProfileId(id);
        setActiveProfileName(user?.name || '');
      }
      if (next !== 'service-posts') setActiveCategory(null);
      setSection(next);
    },
    [user]
  );

  // Allow other components to programmatically navigate via custom events
  useEffect(() => {
    const onOpenProfile = (e: Event) => {
      const detail = (e as CustomEvent<{ userId: string; name?: string }>).detail;
      if (!detail?.userId) return;
      setActiveProfileId(String(detail.userId));
      setActiveProfileName(detail.name || '');
      setSection('profile');
    };
    const onOpenServicePosts = (e: Event) => {
      const detail = (e as CustomEvent<{ category: CategoryKey }>).detail;
      if (!detail?.category) return;
      setActiveCategory(detail.category);
      setSection('service-posts');
    };
    window.addEventListener('us:openProfile', onOpenProfile);
    window.addEventListener('us:openServicePosts', onOpenServicePosts);
    return () => {
      window.removeEventListener('us:openProfile', onOpenProfile);
      window.removeEventListener('us:openServicePosts', onOpenServicePosts);
    };
  }, []);

  return (
    <div className={styles.shell}>
      <Sidebar activeSection={section} onSelect={navigate} />
      <main className={styles.main}>
        {section === 'feed' && <FeedView />}
        {section === 'create' && <PostComposer onCreated={() => setSection('feed')} />}
        {section === 'profile' && (
          <ProfileView
            userId={activeProfileId}
            displayName={activeProfileName}
            isOwnProfile={getSafeUserId(user) === activeProfileId}
          />
        )}
        {section === 'services' && (
          <ServicesView
            onSelect={(cat) => {
              setActiveCategory(cat);
              setSection('service-posts');
            }}
          />
        )}
        {section === 'service-posts' && activeCategory && (
          <ServicePostsView
            category={activeCategory}
            onBack={() => setSection('services')}
          />
        )}
        {section === 'dating' && <DatingView />}
        {section === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}