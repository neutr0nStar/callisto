# Repository Guidelines

## General guidelines for agents

- Always refer to `docs/plan.md` to understand what needs to be done.
- If anythin is unclear, or any action needs to be taken on user's part, discuss first, and once user approves, only then make changes

## Project Structure & Module Organization

- `app/` — Next.js App Router routes, layouts, and server components.
- `components/` — Reusable UI and layout pieces; filenames are kebab-case, exports PascalCase.
- `lib/` — Framework-agnostic utilities and clients (e.g., `lib/supabase.ts`, `lib/utils.ts`).
- `public/` — Static assets.
- `docs/` — Product/architecture notes (`docs/system_design.md`, `docs/plan.md`).

## Build, Test, and Development Commands

- `pnpm dev` — Run the local dev server at `http://localhost:3000`.
- `pnpm build` — Production build (`.next/`).
- `pnpm start` — Start the production server (after build).
- `pnpm lint` — Lint with ESLint (Next.js core-web-vitals + TypeScript).
- Type check: `pnpm exec tsc --noEmit` (strict mode enabled).

## Coding Style & Naming Conventions

- TypeScript, strict mode; prefer explicit types at module boundaries.
- 2-space indentation; keep lines focused and functions small.
- React components: default-exported, PascalCase symbols; files in kebab-case (e.g., `components/ui/button.tsx`).
- App Router: route segments lowercase; colocate `page.tsx`, `layout.tsx`, and styles in `app/<segment>/`.
- Tailwind CSS v4; keep utility classes ordered logically (layout → spacing → color → state).
- Lint before pushing; fix issues or justify ignores inline and narrowly.

## Testing Guidelines

- No test runner is wired yet. Prefer unit tests for pure helpers in `lib/` (naming: `*.test.ts`).
- Suggested setup: Vitest + React Testing Library when added; target critical math (splits, rounding) and RLS-safe API helpers.
- Aim for meaningful coverage on core calculations and permission checks.

## Commit & Pull Request Guidelines

- Commit style follows conventional prefixes seen in history: `feat|fix|chore(<scope>): <imperative message>`.
- Branch naming: `feat/<area>-<desc>`, `fix/<area>-<desc>`, `chore/<area>-<desc>`.
- PRs: include scope/intent, linked issues, screenshots (UI), test notes, and any migration/RLS notes. Keep PRs small and focused.

## Security & Configuration Tips

- Use `.env.local` for Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`); env files are gitignored.
- Never commit service-role or secret keys; client uses publishable keys only.
- Review `docs/plan.md` before schema or RLS changes; prefer small, auditable migrations.
