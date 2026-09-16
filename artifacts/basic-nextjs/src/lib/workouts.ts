export type WorkoutStep =
  | string
  | {
      title?: string | null;
      name?: string | null;
      description?: string | null;
      text?: string | null;
      duration_minutes?: number | null;
      [key: string]: unknown;
    };

export type Workout = {
  id: string | number;
  slug: string | null;
  title: string | null;
  description: string | null;
  category: string | null;
  duration_minutes: number | null;
  level: string | null;
  steps: WorkoutStep[] | string | null;
};

export const workoutFields =
  'id, slug, title, description, category, duration_minutes, level, steps';

export function displayWorkoutValue(
  value: string | number | null | undefined,
  fallback = '—',
) {
  return value === null || value === undefined || value === ''
    ? fallback
    : String(value);
}

export function workoutPath(workout: Pick<Workout, 'id' | 'slug'>) {
  const identifier = workout.slug || String(workout.id);
  return `/workouts/${encodeURIComponent(identifier)}`;
}

export function normalizeSteps(steps: Workout['steps']): WorkoutStep[] {
  if (Array.isArray(steps)) {
    return steps;
  }

  if (typeof steps === 'string') {
    try {
      const parsed: unknown = JSON.parse(steps);
      return Array.isArray(parsed) ? (parsed as WorkoutStep[]) : [steps];
    } catch {
      return [steps];
    }
  }

  return [];
}