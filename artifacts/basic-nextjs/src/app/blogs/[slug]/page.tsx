import type { Metadata } from 'next';
import BlogDetailPage from './blog-detail-page';

type BlogDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const readableSlug = decodeURIComponent(slug).replace(/[-_]+/g, ' ');

  return {
    title: `${readableSlug} | Athletics India`,
    description: `Read ${readableSlug} from the Athletics India journal.`,
    openGraph: {
      title: `${readableSlug} | Athletics India`,
      description: `Read ${readableSlug} from the Athletics India journal.`,
    },
  };
}

export default async function BlogDetailRoute({
  params,
}: BlogDetailRouteProps) {
  const { slug } = await params;
  return <BlogDetailPage slug={slug} />;
}