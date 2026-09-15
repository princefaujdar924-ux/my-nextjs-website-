---
name: Next.js artifact setup
description: How to establish a Next.js web artifact in this workspace.
---

The web artifact bootstrap is React/Vite-oriented, so a requested Next.js starter needs its generated web package converted to Next.js while preserving the artifact registration and managed workflow.

**Why:** The artifact lifecycle and preview routing are still required even when the app framework differs from the available web bootstrap.

**How to apply:** Keep the artifact's root preview path and managed workflow, use validated artifact metadata replacement for production run settings, and avoid assuming every workspace catalog dependency exists.