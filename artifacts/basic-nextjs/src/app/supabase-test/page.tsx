'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './page.module.css';

type WorkoutRow = Record<string, unknown>;

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export default function SupabaseTestPage() {
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkouts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      setWorkouts([]);
      setErrorMessage(error.message);
    } else {
      setWorkouts((data ?? []) as WorkoutRow[]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadWorkouts();
  }, [loadWorkouts]);

  const columns = useMemo(() => {
    const keys = new Set<string>();
    workouts.forEach((workout) => {
      Object.keys(workout).forEach((key) => keys.add(key));
    });
    return Array.from(keys);
  }, [workouts]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <a className={styles.backLink} href="/">
          ← Back to starter
        </a>

        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Temporary test page</p>
            <h1 className={styles.title}>Latest workouts</h1>
            <p className={styles.description}>
              The five most recent rows from <code>public.workouts</code>.
            </p>
          </div>
          <button
            className={styles.refreshButton}
            type="button"
            onClick={() => void loadWorkouts()}
            disabled={isLoading}
          >
            {isLoading ? 'Loading…' : 'Refresh'}
          </button>
        </header>

        {errorMessage ? (
          <section className={styles.error} role="alert">
            <strong>Couldn’t load workouts</strong>
            <p>{errorMessage}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={() => void loadWorkouts()}
              disabled={isLoading}
            >
              Try again
            </button>
          </section>
        ) : isLoading ? (
          <section className={styles.status} aria-live="polite">
            Loading the latest workouts…
          </section>
        ) : workouts.length === 0 ? (
          <section className={styles.status}>
            No workouts were found in the table.
          </section>
        ) : (
          <div className={styles.tableFrame}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th className={styles.headerCell} key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout, index) => (
                  <tr key={String(workout.id ?? workout.created_at ?? index)}>
                    {columns.map((column) => (
                      <td className={styles.cell} key={column}>
                        {formatValue(workout[column])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}