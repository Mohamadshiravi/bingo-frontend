# AGENTS.md

## Use Bun-first commands

- This repo is Bun-based (`bun.lock` exists; Docker build uses `bun install`/`bun run build`). Prefer Bun commands to avoid lockfile drift.
- Install: `bun install --frozen-lockfile`
- Dev server: `bun run dev`
- Lint: `bun run lint`
- Production check: `bun run build`
- TypeScript check (no script defined): `bunx tsc --noEmit`

## Verification order

- There is no test suite configured (`package.json` has no `test` script, no Jest/Vitest config).
- For focused validation, run: `bun run lint` -> `bunx tsc --noEmit` -> `bun run build`.

## App structure that matters

- Next.js App Router project (Next 16 / React 19).
- Main routes are `app/page.tsx` (landing) and `app/careers/page.tsx` (careers landing).
- Shared frame is in `app/layout.tsx`; it sets RTL/LTR `dir`, language-dependent fonts, global CSS, and wraps the app with Tolgee provider.
- Reusable layout components are in `components/layouts/*`; most route content lives under `app/**/components/sections/*`.

## i18n/Tolgee workflow

- Tolgee is wired through `tolgee/server.ts`, `tolgee/client.tsx`, and `tolgee/shared.ts`.
- Supported languages are hard-coded in `tolgee/shared.ts` as `en-US` and `fa-IR`; default is `fa-IR`.
- Locale cookie key is `NEXT_LOCALE` (`tolgee/language.ts`); changing language behavior should update this flow, not ad-hoc cookies.
- Translation files live in `i18n/en-US.json` and `i18n/fa-IR.json` and are loaded as Tolgee static data.
- Tolgee CLI config is in `.tolgeerc`; extraction scans `./**/*.ts?(x)` and push/pull targets `i18n/`.

## Environment variables used in code

- Required for local runtime: `NEXT_PUBLIC_TOLGEE_API_KEY`, `NEXT_PUBLIC_TOLGEE_API_URL`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_PANEL_URL` (see `.env.example`).
- Also used: `NEXT_PUBLIC_DOMAIN` for cookie domain (defaults to `.beenbo.com`), and server-side `BACKEND_URL` in some route sections.

## Build/deploy constraints

- `next.config.ts` sets `output: "standalone"`; deployment expects `.next/standalone` output.
- SVG imports are handled via `@svgr/webpack` in both Turbopack and Webpack config; preserve both unless build tooling changes.
- CI is GitLab-based via `.gitlab-ci.yml` component include; runtime container listens on port `3000` (see Dockerfile/K8s manifests).
