'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SiteNav from '@/components/site-nav';
import {
  blogFields,
  displayBlogValue,
  formatPublishedDate,
  type BlogPost,
} from '@/lib/blogs';
import styles from '../blogs.module.css';

function BlogContent({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className={styles.content}>
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}
    </div>
  );
}

export default function BlogDetailPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    const decodedSlug = decodeURIComponent(slug);
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('blog_posts')
      .select(blogFields)
      .eq('is_published', true)
      .eq('slug', decodedSlug)
      .maybeSingle();

    if (error) {
      setPost(null);
      setErrorMessage(error.message);
    } else {
      setPost((data as BlogPost | null) ?? null);
    }

    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    void loadPost();
  }, [loadPost]);

  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.main} aria-labelledby="blog-title">
        {errorMessage ? (
          <div className={styles.errorState} role="alert">
            <strong>This article couldn’t load.</strong>
            <p>{errorMessage}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={() => void loadPost()}
              disabled={isLoading}
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.statusState} aria-live="polite">
            Loading article…
          </div>
        ) : !post ? (
          <div className={styles.statusState}>
            This article is unavailable or is not published.
          </div>
        ) : (
          <>
            <header className={styles.detailHero}>
              <p className={styles.eyebrow}>Published article</p>
              <h1 id="blog-title">
                {displayBlogValue(post.title, 'Untitled article')}
              </h1>
              <dl className={styles.detailMeta}>
                <div className={styles.metaItem}>
                  <dt className={styles.metaLabel}>Category</dt>
                  <dd className={styles.metaValue}>
                    {displayBlogValue(post.category, 'Journal')}
                  </dd>
                </div>
                <div className={styles.metaItem}>
                  <dt className={styles.metaLabel}>Published</dt>
                  <dd className={styles.metaValue}>
                    {formatPublishedDate(post.published_at)}
                  </dd>
                </div>
              </dl>
            </header>

            {post.cover_image ? (
              <img
                className={styles.detailCover}
                src={post.cover_image}
                alt=""
              />
            ) : null}

            {post.content ? (
              <BlogContent content={post.content} />
            ) : (
              <div className={styles.statusState}>
                This article does not have any published content yet.
              </div>
            )}

            <a className={styles.backLink} href="/blogs">
              <span aria-hidden="true">←</span> Back to all articles
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