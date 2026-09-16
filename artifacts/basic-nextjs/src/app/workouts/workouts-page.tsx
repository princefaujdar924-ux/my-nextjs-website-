'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  displayWorkoutValue,
  type Workout,
  workoutFields,
  workoutPath,
} from '@/lib/workouts';
import SiteNav from '@/components/site-nav';
import styles from './workouts.module.css';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
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

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          workouts
            .map((workout) => workout.category?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [workouts],
  );

  const levels = useMemo(
    () =>
      Array.from(
        new Set(
          workouts
            .map((workout) => workout.level?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [workouts],
  );

  const filteredWorkouts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return workouts.filter((workout) => {
      const matchesCategory =
        category === 'all' || workout.category?.trim() === category;
      const matchesLevel = level === 'all' || workout.level?.trim() === level;
      const searchableText = `${workout.title ?? ''} ${
        workout.description ?? ''
      }`.toLowerCase();

      return (
        matchesCategory &&
        matchesLevel &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [category, level, search, workouts]);

  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.main} aria-labelledby="workouts-title">
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>The library</p>
            <h1 id="workouts-title">
              Find your next <span>workout.</span>
            </h1>
          </div>
          <p className={styles.heroDescription}>
            Published sessions for every stage of your training. Search by
            goal, then filter the work that fits your level.
          </p>
        </header>

        <div className={styles.controls} aria-label="Workout filters">
          <div className={styles.searchField}>
            <label className={styles.label} htmlFor="workout-search">
              Search workouts
            </label>
            <input
              className={styles.input}
              id="workout-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or description"
            />
          </div>
          <div className={styles.filterField}>
            <label className={styles.label} htmlFor="workout-category">
              Category
            </label>
            <select
              className={styles.select}
              id="workout-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.filterField}>
            <label className={styles.label} htmlFor="workout-level">
              Level
            </label>
            <select
              className={styles.select}
              id="workout-level"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="all">All levels</option>
              {levels.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
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
        ) : filteredWorkouts.length === 0 ? (
          <div className={styles.statusState}>
            No workouts match those filters. Try a different search or reset
            the filters.
          </div>
        ) : (
          <>
            <p className={styles.resultsMeta} aria-live="polite">
              Showing {filteredWorkouts.length} of {workouts.length} published{' '}
              {workouts.length === 1 ? 'workout' : 'workouts'}.
            </p>
            <div className={styles.workoutGrid}>
              {filteredWorkouts.map((workout) => (
                <article className={styles.workoutCard} key={workout.id}>
                  <div className={styles.cardTopline}>
                    <span>
                      {displayWorkoutValue(workout.category, 'Workout')}
                    </span>
                    <span>
                      {displayWorkoutValue(workout.level, 'All levels')}
                    </span>
                  </div>
                  <h2>
                    {displayWorkoutValue(workout.title, 'Untitled workout')}
                  </h2>
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
                      aria-label={`View ${displayWorkoutValue(
                        workout.title,
                        'workout',
                      )}`}
                    >
                      View workout <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className={styles.footer}>
        <a className={styles.brand} href="/">
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