'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './site-nav.module.css';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Workouts', href: '/workouts' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Admin Login', href: '/admin/login' },
];

function isCurrentPath(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function SiteNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <a className={styles.brand} href="/" aria-label="Athletics India home">
        <span className={styles.brandMark}>A</span>
        <span>
          Athletics <em>India</em>
        </span>
      </a>

      <button
        className={styles.menuToggle}
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="site-navigation-links"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
        </span>
        <span className={styles.menuText}>Menu</span>
      </button>

      <div
        className={`${styles.navLinks} ${
          isMenuOpen ? styles.navLinksOpen : ''
        }`}
        id="site-navigation-links"
      >
        {navigation.map((item) => {
          const isActive = isCurrentPath(pathname, item.href);

          return (
            <a
              className={`${styles.navLink} ${
                item.label === 'Admin Login' ? styles.adminLink : ''
              } ${isActive ? styles.activeLink : ''}`}
              href={item.href}
              key={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}