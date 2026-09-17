'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  displayWorkoutValue,
  type Workout,
  workoutFields,
  workoutPath,
} from '@/lib/workouts';
import SiteNav from '@/components/site-nav';
import styles from './page.module.css';

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWorkouts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('workouts')
      .select(workoutFields)
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
      <SiteNav />

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
          <a className={styles.heroButton} href="/workouts">
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
          <div className={styles.sectionAside}>
            <p className={styles.sectionIntro}>
              Curated sessions for every stage of your training.
            </p>
            <a className={styles.sectionLink} href="/workouts">
              View all workouts <span aria-hidden="true">↗</span>
            </a>
          </div>
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
                  <span>
                    {displayWorkoutValue(workout.category, 'Workout')}
                  </span>
                  <span>
                    {displayWorkoutValue(workout.level, 'All levels')}
                  </span>
                </div>
                <h3>
                  {displayWorkoutValue(workout.title, 'Untitled workout')}
                </h3>
                <p className={styles.workoutDescription}>
                  {displayWorkoutValue(
                    workout.description,
                    'Details coming soon.',
                  )}
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
                    href={workoutPath(workout)}
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
        <a className={styles.brand} href="/">
          <span className={styles.brandMark}>A</span>
          <span>
            Athletics <em>India</em>
          </span>
        </a>
        <div className={styles.footerLinks}>
          <p>Built for the discipline to begin again.</p>
          <a href="/blogs">Read the journal <span aria-hidden="true">↗</span></a>
        </div>
      </footer>
    </main>
  );
}