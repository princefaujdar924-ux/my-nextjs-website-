import type { Metadata } from 'next';
import WorkoutDetailPage from './workout-detail-page';

type WorkoutDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: WorkoutDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const readableSlug = decodeURIComponent(slug).replace(/[-_]+/g, ' ');

  return {
    title: `${readableSlug} | Athletics India`,
    description: `Follow the ${readableSlug} workout from Athletics India.`,
    openGraph: {
      title: `${readableSlug} | Athletics India`,
      description: `Follow the ${readableSlug} workout from Athletics India.`,
    },
  };
}

export default async function WorkoutDetailRoute({
  params,
}: WorkoutDetailRouteProps) {
  const { slug } = await params;
  return <WorkoutDetailPage slug={slug} />;
}