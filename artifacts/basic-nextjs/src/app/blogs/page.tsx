import type { Metadata } from 'next';
import BlogsPage from './blogs-page';

export const metadata: Metadata = {
  title: 'Blogs | Athletics India',
  description:
    'Read published Athletics India stories, training ideas, and practical guidance for athletes.',
  openGraph: {
    title: 'Blogs | Athletics India',
    description:
      'Read published Athletics India stories, training ideas, and practical guidance for athletes.',
  },
};

export default function BlogsRoute() {
  return <BlogsPage />;
}