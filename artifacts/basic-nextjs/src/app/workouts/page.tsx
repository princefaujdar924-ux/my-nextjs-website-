import type { Metadata } from 'next';
import WorkoutsPage from './workouts-page';

export const metadata: Metadata = {
  title: 'Workouts | Athletics India',
  description:
    'Explore published Athletics India workouts for every level and training goal.',
  openGraph: {
    title: 'Workouts | Athletics India',
    description:
      'Explore published Athletics India workouts for every level and training goal.',
  },
};

export default function WorkoutsRoute() {
  return <WorkoutsPage />;
}