'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import SiteNav from '@/components/site-nav';
import {
  blogFields,
  blogPath,
  displayBlogValue,
  formatPublishedDate,
  type BlogPost,
} from '@/lib/blogs';
import styles from './blogs.module.css';

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('blog_posts')
      .select(blogFields)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      setPosts([]);
      setErrorMessage(error.message);
    } else {
      setPosts((data ?? []) as BlogPost[]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          posts
            .map((post) => post.category?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        category === 'all' || post.category?.trim() === category;
      const searchableText = `${post.title ?? ''} ${
        post.excerpt ?? ''
      }`.toLowerCase();

      return (
        matchesCategory &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [category, posts, search]);

  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.main} aria-labelledby="blogs-title">
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>The journal</p>
            <h1 id="blogs-title">
              Ideas to keep <span>moving.</span>
            </h1>
          </div>
          <p className={styles.heroDescription}>
            Stories, training insights, and practical guidance for athletes
            building a stronger practice.
          </p>
        </header>

        <div className={styles.controls} aria-label="Blog filters">
          <div className={styles.searchField}>
            <label className={styles.label} htmlFor="blog-search">
              Search articles
            </label>
            <input
              className={styles.input}
              id="blog-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or excerpt"
            />
          </div>
          <div className={styles.filterField}>
            <label className={styles.label} htmlFor="blog-category">
              Category
            </label>
            <select
              className={styles.select}
              id="blog-category"
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
        </div>

        {errorMessage ? (
          <div className={styles.errorState} role="alert">
            <strong>Articles couldn’t load.</strong>
            <p>{errorMessage}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={() => void loadPosts()}
              disabled={isLoading}
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.statusState} aria-live="polite">
            Loading published articles…
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.statusState}>
            No published articles are available yet.
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.statusState}>
            No articles match those filters. Try a different search or reset
            the category.
          </div>
        ) : (
          <>
            <p className={styles.resultsMeta} aria-live="polite">
              Showing {filteredPosts.length} of {posts.length} published{' '}
              {posts.length === 1 ? 'article' : 'articles'}.
            </p>
            <div className={styles.postGrid}>
              {filteredPosts.map((post) => (
                <article className={styles.postCard} key={post.id}>
                  <a
                    className={styles.cover}
                    href={blogPath(post)}
                    aria-label={`Read ${displayBlogValue(
                      post.title,
                      'article',
                    )}`}
                  >
                    {post.cover_image ? (
                      <img
                        className={styles.coverImage}
                        src={post.cover_image}
                        alt=""
                      />
                    ) : (
                      <span className={styles.coverPlaceholder}>
                        Athletics India journal
                      </span>
                    )}
                  </a>
                  <div className={styles.postBody}>
                    <div className={styles.postMeta}>
                      <span>{displayBlogValue(post.category, 'Journal')}</span>
                      <span>{formatPublishedDate(post.published_at)}</span>
                    </div>
                    <h2>
                      {displayBlogValue(post.title, 'Untitled article')}
                    </h2>
                    <p className={styles.excerpt}>
                      {displayBlogValue(
                        post.excerpt,
                        'Read the latest from Athletics India.',
                      )}
                    </p>
                    <div className={styles.postFooter}>
                      <span className={styles.date}>
                        {formatPublishedDate(post.published_at)}
                      </span>
                      <a className={styles.readLink} href={blogPath(post)}>
                        Read article <span aria-hidden="true">↗</span>
                      </a>
                    </div>
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