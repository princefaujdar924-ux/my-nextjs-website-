---
name: Next.js development cache
description: Avoid stale or missing chunks when building and serving a Next.js app locally.
---

Do not run `next build` against the same `.next` directory while `next dev` is serving the app; restart the managed dev workflow after a production build.

**Why:** Concurrent development and production compilation can leave the dev server referencing missing webpack chunks and return a blank 500 page.

**How to apply:** Run verification builds separately, then restart the managed Next.js workflow before taking a preview or debugging runtime errors.