'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  displayWorkoutValue,
  normalizeSteps,
  type Workout,
  type WorkoutStep,
  workoutFields,
} from '@/lib/workouts';
import SiteNav from '@/components/site-nav';
import styles from '../workouts.module.css';

function StepContent({ step }: { step: WorkoutStep }) {
  if (typeof step === 'string') {
    return <p className={styles.stepText}>{step}</p>;
  }

  const title =
    step.title || step.name || step.text || `Workout step`;
  const description =
    step.description ||
    (step.text && step.text !== title ? step.text : null);
  const duration =
    step.duration_minutes === null || step.duration_minutes === undefined
      ? null
      : `${step.duration_minutes} min`;

  return (
    <div>
      <strong className={styles.stepTitle}>{title}</strong>
      {description ? <p className={styles.stepText}>{description}</p> : null}
      {duration ? <p className={styles.stepText}>{duration}</p> : null}
    </div>
  );
}

export default function WorkoutDetailPage({ slug }: { slug: string }) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadWorkout = useCallback(async () => {
    const decodedSlug = decodeURIComponent(slug);
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('workouts')
      .select(workoutFields)
      .eq('is_published', true)
      .eq('slug', decodedSlug)
      .maybeSingle();

    if (error) {
      setWorkout(null);
      setErrorMessage(error.message);
    } else if (data) {
      setWorkout(data as Workout);
    } else if (/^\d+$/.test(decodedSlug)) {
      const fallback = await supabase
        .from('workouts')
        .select(workoutFields)
        .eq('is_published', true)
        .eq('id', decodedSlug)
        .maybeSingle();

      if (fallback.error) {
        setWorkout(null);
        setErrorMessage(fallback.error.message);
      } else {
        setWorkout((fallback.data as Workout | null) ?? null);
      }
    } else {
      setWorkout(null);
    }

    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    void loadWorkout();
  }, [loadWorkout]);

  const steps = normalizeSteps(workout?.steps ?? null);

  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.main} aria-labelledby="workout-title">
        {errorMessage ? (
          <div className={styles.errorState} role="alert">
            <strong>We couldn’t load this workout.</strong>
            <p>{errorMessage}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={() => void loadWorkout()}
              disabled={isLoading}
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.statusState} aria-live="polite">
            Loading workout…
          </div>
        ) : !workout ? (
          <div className={styles.statusState}>
            This workout is unavailable or is not published.
          </div>
        ) : (
          <>
            <header className={styles.detailHero}>
              <p className={styles.eyebrow}>Published workout</p>
              <h1 id="workout-title">
                {displayWorkoutValue(workout.title, 'Untitled workout')}
              </h1>
              <p className={styles.detailDescription}>
                {displayWorkoutValue(
                  workout.description,
                  'No description has been added for this workout yet.',
                )}
              </p>
            </header>

            <dl className={styles.detailMeta}>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Category</dt>
                <dd className={styles.metaValue}>
                  {displayWorkoutValue(workout.category, 'Workout')}
                </dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Duration</dt>
                <dd className={styles.metaValue}>
                  {workout.duration_minutes === null
                    ? '—'
                    : `${workout.duration_minutes} min`}
                </dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Level</dt>
                <dd className={styles.metaValue}>
                  {displayWorkoutValue(workout.level, 'All levels')}
                </dd>
              </div>
            </dl>

            <section className={styles.stepsSection} aria-labelledby="steps-title">
              <h2 id="steps-title">The steps.</h2>
              {steps.length === 0 ? (
                <div className={styles.statusState}>
                  No steps have been added to this workout yet.
                </div>
              ) : (
                <ol className={styles.stepsList}>
                  {steps.map((step, index) => (
                    <li className={styles.step} key={`${index}-${String(step)}`}>
                      <StepContent step={step} />
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <a className={styles.backLink} href="/workouts">
              <span aria-hidden="true">←</span> Back to all workouts
            </a>
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