export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <span className="eyebrow">Next.js starter</span>
        <h1 id="page-title">Build something great.</h1>
        <p>
          A small, fast starting point for your next web project. Edit this
          page in <code>src/app/page.tsx</code> to get started.
        </p>
        <div className="actions">
          <a className="button button-primary" href="https://nextjs.org/docs">
            Read the docs
          </a>
          <a
            className="button button-secondary"
            href="https://github.com/vercel/next.js"
          >
            View Next.js on GitHub
          </a>
        </div>
      </section>
      <footer className="footer">
        <span>Next.js App Router</span>
        <span aria-hidden="true">·</span>
        <span>Ready to customize</span>
      </footer>
    </main>
  );
}