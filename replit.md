# Basic Next.js Starter

A minimal Next.js App Router project with a ready-to-customize home page.

## Run & Operate

- `pnpm --filter @workspace/basic-nextjs run dev` — run the Next.js app
- `pnpm --filter @workspace/basic-nextjs run typecheck` — typecheck the Next.js app
- `pnpm --filter @workspace/basic-nextjs run build` — create a production build
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Next.js 15 with the App Router
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/basic-nextjs/src/app/page.tsx` — starter home page
- `artifacts/basic-nextjs/src/app/layout.tsx` — document metadata and root layout
- `artifacts/basic-nextjs/src/app/globals.css` — starter styling

## Architecture decisions

- The frontend uses Next.js App Router rather than the initial Vite scaffold.
- The starter uses a standalone production output so it can run with `next start`.

## Product

The home page is a small, responsive starting point for building a new web product.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
