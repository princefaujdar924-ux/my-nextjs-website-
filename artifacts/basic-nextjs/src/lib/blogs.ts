export type BlogPost = {
  id: string | number;
  slug: string | null;
  title: string | null;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
  published_at: string | null;
  content: string | null;
};

export const blogFields =
  'id, slug, title, excerpt, category, cover_image, published_at, content';

export function displayBlogValue(
  value: string | number | null | undefined,
  fallback = '—',
) {
  return value === null || value === undefined || value === ''
    ? fallback
    : String(value);
}

export function blogPath(post: Pick<BlogPost, 'id' | 'slug'>) {
  const identifier = post.slug || String(post.id);
  return `/blogs/${encodeURIComponent(identifier)}`;
}

export function formatPublishedDate(value: string | null) {
  if (!value) {
    return 'Date unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}