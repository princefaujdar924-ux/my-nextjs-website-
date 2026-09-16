'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SiteNav from '@/components/site-nav';
import styles from './admin.module.css';

export default function AdminPage() {
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyAdminAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !profile?.is_admin) {
        await supabase.auth.signOut();
        router.replace('/admin/login');
        return;
      }

      if (isMounted) {
        setIsAdmin(true);
        setIsCheckingAccess(false);
      }
    }

    void verifyAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  return (
    <main className={styles.page}>
      <SiteNav />
      <div className={styles.content}>
        {isCheckingAccess ? (
          <p className={styles.loading} aria-live="polite">
            Verifying administrator access…
          </p>
        ) : isAdmin ? (
          <section className={styles.dashboardCard} aria-labelledby="admin-title">
            <p className={styles.eyebrow}>Administrator</p>
            <h1 id="admin-title">Welcome back.</h1>
            <p>
              Your administrator access is confirmed. The Athletics India
              content tools can be added here.
            </p>
            <button
              className={styles.signOut}
              type="button"
              onClick={() => void handleSignOut()}
            >
              Sign out
            </button>
          </section>
        ) : null}
      </div>
    </main>
  );
}