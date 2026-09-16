'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './page.module.css';

type Workout = {
  id: string | number;
  title: string | null;
  description: string | null;
  category: string | null;
  duration_minutes: number | null;
  level: string | null;
};

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Workouts', href: '#workouts' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Admin Login', href: '/admin/login' },
];

function displayValue(value: string | number | null, fallback = '—') {
  return value === null || value === '' ? fallback : String(value);
}

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWorkouts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('workouts')
      .select(
        'id, title, description, category, duration_minutes, level',
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      setWorkouts([]);
      setErrorMessage(error.message);
    } else {
      setWorkouts((data ?? []) as Workout[]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadWorkouts();
  }, [loadWorkouts]);

  return (
    <main id="home" className={styles.page}>
      <nav className={styles.nav} aria-label="Main navigation">
        <a className={styles.brand} href="#home" aria-label="Athletics India home">
          <span className={styles.brandMark}>A</span>
          <span>
            Athletics <em>India</em>
          </span>
        </a>
        <div className={styles.navLinks}>
          {navigation.map((item) => (
            <a
              className={`${styles.navLink} ${
                item.label === 'Admin Login' ? styles.adminLink : ''
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Train with purpose</p>
          <h1 id="hero-title">
            Stronger every
            <span> single day.</span>
          </h1>
          <p className={styles.heroDescription}>
            Expert-built workouts for athletes who want to move better, train
            smarter, and keep showing up.
          </p>
          <a className={styles.heroButton} href="#workouts">
            Explore workouts <span aria-hidden="true">↘</span>
          </a>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <span className={`${styles.orbit} ${styles.orbitOne}`} />
          <span className={`${styles.orbit} ${styles.orbitTwo}`} />
          <span className={`${styles.orbit} ${styles.orbitThree}`} />
          <span className={styles.heroNumber}>01</span>
          <span className={styles.heroVisualLabel}>The work<br />starts here.</span>
        </div>
      </section>

      <section
        id="workouts"
        className={styles.workoutsSection}
        aria-labelledby="workouts-title"
      >
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>The library</p>
            <h2 id="workouts-title">Find your next workout.</h2>
          </div>
          <p className={styles.sectionIntro}>
            Curated sessions for every stage of your training.
          </p>
        </div>

        {errorMessage ? (
          <div className={styles.errorState} role="alert">
            <strong>Workouts couldn’t load.</strong>
            <p>{errorMessage}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={() => void loadWorkouts()}
              disabled={isLoading}
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.statusState} aria-live="polite">
            Loading published workouts…
          </div>
        ) : workouts.length === 0 ? (
          <div className={styles.statusState}>
            No published workouts are available yet.
          </div>
        ) : (
          <div className={styles.workoutGrid}>
            {workouts.map((workout) => (
              <article className={styles.workoutCard} key={workout.id}>
                <div className={styles.cardTopline}>
                  <span>{displayValue(workout.category, 'Workout')}</span>
                  <span>{displayValue(workout.level, 'All levels')}</span>
                </div>
                <h3>{displayValue(workout.title, 'Untitled workout')}</h3>
                <p className={styles.workoutDescription}>
                  {displayValue(workout.description, 'Details coming soon.')}
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.duration}>
                    <span aria-hidden="true">◷</span>{' '}
                    {workout.duration_minutes === null
                      ? '—'
                      : `${workout.duration_minutes} min`}
                  </span>
                  <a
                    className={styles.viewButton}
                    href={`/workouts/${workout.id}`}
                  >
                    View workout <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <a className={styles.brand} href="#home">
          <span className={styles.brandMark}>A</span>
          <span>
            Athletics <em>India</em>
          </span>
        </a>
        <p>Built for the discipline to begin again.</p>
      </footer>
    </main>
  );
}