# Callisto Project Execution Plan

Purpose: Implement an MVP PWA for unified personal and group expense tracking using Next.js + Supabase. Work is divided into phases with atomic, reviewable tasks (small PRs: ~100–300 LOC, single responsibility).

Conventions

- Branch naming: `feat/<area>-<short-desc>`, `fix/<area>-<short-desc>`, `chore/<area>-<short-desc>`
- PR checklist: scope statement, screenshots, test notes, migration notes, RLS note if DB
- Definition of done: types OK, lint OK, minimal tests/edge-cases, accessible forms, loading/empty/error states
- Environments: `.env.local` for Supabase keys; avoid secrets in repo

Phase 0 — Repo Bootstrap

1. [x] Initialize Next.js (App Router, TypeScript) with Tailwind, ESLint, and Prettier.
2. [x] Install shadcn/ui with base primitives (Button, Input, Dialog, Sheet, Tabs, Toast).
3. [x] Build a mobile-first layout shell with a bottom tab bar (Dashboard, Personal, Groups, Profile).
4. [-] Configure basic CI to run typecheck and lint on pull requests.

Phase 1 — Supabase Setup & Core Schemas

1. [x] Document Supabase project configuration and create `.env.example`.
2. [x] Add `user_profile` table with trigger to upsert on auth signup and RLS for `auth.uid()`.
3. [x] Add `personal_expense` table with owner-only RLS.
4. [x] Add `group` and `group_member` tables with membership RLS.
5. [x] Add `group_expense` and `expense_share` tables with member RLS for validated splits.

Phase 2 — Auth & Profile

1. [ ] Wire Supabase Auth (Google) with Next.js including sign-in page and callback route.
2. [ ] Add session provider, protect app routes, and redirect unauthenticated users to Sign In.
3. [ ] Create Profile page to display name and email, allow editing names, and provide sign-out.
4. [ ] Connect profile CRUD operations to Supabase with RLS-safe API handlers.

Phase 3 — Personal Expenses

1. [ ] Build personal expense list sorted newest first with empty state CTA.
2. [ ] Implement basic filters for date range and category via query params and server calls.
3. [ ] Create Add/Edit Expense sheet with amount, date, category, note, and type toggle.
4. [ ] Implement create expense API call with optimistic toast and error handling.
5. [ ] Implement edit and delete API calls with confirmation dialog for delete.
6. [ ] Add validation for decimal math to 2dp and required date, and cover helpers with unit tests.

Phase 4 — Groups Core

1. [ ] Build groups list page showing group name and your net balance badge.
2. [ ] Implement Create Group flow where creator becomes admin and is redirected to detail view.
3. [ ] Create Members tab listing members with role/status and gating admin actions.
4. [ ] Allow admins to add members by email directly for MVP and handle leave group checks.

Phase 5 — Group Expenses & Balances

1. [ ] Build group detail Activity tab mixing expenses and settlements, newest first.
2. [ ] Implement Add Group Expense sheet with amount, date, category, description, and payer.
3. [ ] Build split editor supporting Equal, Percentage, and Shares options with member selector.
4. [ ] Ensure split validation reconciles to cents and call RPC for atomic expense + shares upsert.
5. [ ] Enable edit/delete for group expenses with permission checks and refresh balances post-action.
6. [ ] Add Record Settlement sheet (payer, payee, amount, date, note) and surface settlements in activity.

Phase 6 — QA & Launch Prep

1. [ ] Seed sample data for local development and smoke testing.
2. [ ] Draft manual test checklist for key flows across personal and group expenses.
3. [ ] Update README with setup instructions, environment variables, and project scripts.
4. [ ] Provide lightweight deployment notes (e.g., Vercel + Supabase) for MVP release.

Backlog / Nice-to-Have

- Multi-currency support with FX snapshots
- Attachments/receipts for expenses
- Search by note/merchant
- Notifications for group activity
- Offline-first caching strategy for PWA
- Budgets dashboard with charts and filters
- Custom categories with backfill handling
- Accessibility and performance polish pass
- Enhanced auditing and observability tooling

Review Gates (end of each phase)

- Scope demo against `docs/requirements.md`
- RLS + permissions check for new tables/RPCs
- Accessibility check on new forms/screens
- Performance sanity (route bundles, API timing)
