'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SiteNav from '@/components/site-nav';
import styles from '../admin.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      setErrorMessage(
        error?.message === 'Invalid login credentials'
          ? 'The email or password is incorrect.'
          : error?.message || 'We could not sign you in. Please try again.',
      );
      setIsLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError || !profile?.is_admin) {
      await supabase.auth.signOut();
      setErrorMessage(
        profileError
          ? 'We could not verify administrator access for this account.'
          : 'This account does not have administrator access.',
      );
      setIsLoading(false);
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  return (
    <main className={styles.page}>
      <SiteNav />
      <div className={styles.content}>
        <section className={styles.card} aria-labelledby="admin-login-title">
          <p className={styles.eyebrow}>Restricted access</p>
          <h1 className={styles.title} id="admin-login-title">
            Admin login.
          </h1>
          <p className={styles.intro}>
            Sign in with your Athletics India administrator account to continue.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="admin-email">
                Email address
              </label>
              <input
                className={styles.input}
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="admin-password">
                Password
              </label>
              <input
                className={styles.input}
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {errorMessage ? (
              <div className={styles.error} role="alert" aria-live="polite">
                {errorMessage}
              </div>
            ) : null}

            <button className={styles.submit} type="submit" disabled={isLoading}>
              {isLoading ? 'Checking access…' : 'Sign in'}
            </button>
          </form>

          <p className={styles.securityNote}>
            Your password is handled by Supabase Auth and is never stored by
            Athletics India.
          </p>
        </section>
      </div>
    </main>
  );
}