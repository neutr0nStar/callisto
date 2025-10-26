# Callisto Project Execution Plan

Purpose: Implement a PWA for unified personal and group expense tracking using Next.js + Supabase, guided by docs in `docs/` (idea, requirements, system design, UI). Work is divided into phases with atomic, reviewable tasks (small PRs: ~100–300 LOC, single responsibility).

Conventions

- Branch naming: `feat/<area>-<short-desc>`, `fix/<area>-<short-desc>`, `chore/<area>-<short-desc>`
- PR checklist: scope statement, screenshots, test notes, migration notes, RLS note if DB
- Definition of done: types OK, lint OK, minimal tests/edge-cases, accessible forms, loading/empty/error states
- Environments: `.env.local` for Supabase keys; avoid secrets in repo

Phase 0 — Repo Bootstrap

- [ ] Initialize Next.js (App Router, TypeScript) with Tailwind and ESLint/Prettier
- [ ] Add shadcn/ui with base theme and primitives (Button, Input, Dialog, Sheet, Tabs, Toast)
- [ ] Add mobile-first layout shell: bottom tab bar placeholders (Dashboard, Personal, Groups, Profile)
- [ ] Add basic CI: typecheck + lint on PR
- [ ] PWA scaffold: `manifest.json`, icon placeholders, service worker scaffold (no caching rules yet)

Phase 1 — Supabase Setup + Core Schemas

- [ ] Create Supabase project configuration docs and `.env.example`
- [ ] Migration: `user_profile` table; trigger to upsert profile on auth signup; RLS for `auth.uid()`
- [ ] Migration: `personal_expense` table + RLS (owner-only)
- [ ] Migration: `group`, `group_member` tables + RLS (owner/admin membership)
- [ ] Migration: `group_expense`, `expense_share` tables + RLS (group members)
- [ ] Migration: `settlement` table + RLS (group members)
- [ ] Migration: `personal_budget`, `custom_category` tables + RLS (owner-only)
- [ ] Add SQL views: per-group member net balances; per-user personal summaries (by category, by period)
- [ ] Add RPC functions: create group expense with validated splits; record settlement; compute balances

Phase 2 — Auth & Profile (FR-3)

- [ ] Wire Supabase Auth (Google) with Next.js: sign-in page and callback route
- [ ] Add session provider, protect app routes, redirect unauthenticated to Sign In
- [ ] Create Profile page: show first/last name, email; edit names; delete account; sign out
- [ ] Implement profile API integration (RLS-protected CRUD)
- [ ] Access control smoke tests (cannot read other users’ profiles)

Phase 3 — Personal Expenses (FR-1)

- [ ] Personal list page: newest first; empty state with CTA
- [ ] Filters UI: date range, category; basic query params + server calls
- [ ] Add/Edit Expense sheet: amount (numeric), date, category, note, type toggle (Expense/Income)
- [ ] Implement create expense API call; optimistic toast and error handling
- [ ] Implement edit/delete API calls; confirm dialog for delete
- [ ] Validation: decimal math to 2dp; date required; category optional initially
- [ ] Loading/empty/error states; basic unit tests for helpers (rounding, parsing)

Phase 4 — Groups Core (FR-2.1, 2.2, 2.9, 2.10)

- [ ] Groups list page: name + your net balance badge (from view)
- [ ] Create Group flow: name field; you become admin; navigate to detail
- [ ] Members tab: list with role/status; admin actions gated by role
- [ ] Invite members by email: create pending member record; clarify acceptance flow (MVP: admin add directly)
- [ ] Leave group: only if balances settled; enforce via SQL/RPC guard
- [ ] Remove member and transfer admin; enforce via RLS/RPC

Phase 5 — Group Expenses + Splits (FR-2.3 to FR-2.6)

- [ ] Group detail Activity tab: mixed list of expenses + settlements; newest first
- [ ] Add Group Expense sheet: amount/date/category/description/paid by
- [ ] Split editor component: Equal | Percentage | Shares; member selector
- [ ] Split validation: sum reconciliation, deterministic rounding to cents
- [ ] RPC: atomic upsert of expense + shares with server-side validation
- [ ] Edit/Delete group expense with permissions (creator or admin)
- [ ] Update balances in header and list after save/delete

Phase 6 — Settlements (FR-2.7, 2.8)

- [ ] Record Settlement sheet: payer, payee, amount, date, note
- [ ] RPC: record settlement; insert activity entry; update balances
- [ ] Render settlements distinctly in Activity list
- [ ] Net balance computation check against view/RPC outputs

Phase 7 — Dashboard & Budgets (FR-4)

- [ ] Dashboard layout: greeting + period selector (This month/This week)
- [ ] Budget card: show remaining, total spending; CTA to set budget
- [ ] Add/Edit Budget sheet: period, start date, amount
- [ ] Category breakdown chart; time-series chart (weekly/monthly)
- [ ] Filters: date range, include income toggle
- [ ] Per-group balances summary with deep-links to group detail

Phase 8 — Categories & Customization

- [ ] Personal categories: list + create/edit (name, icon)
- [ ] Use custom categories in personal and group forms
- [ ] Backfill mapping when custom categories are edited/removed (MVP: soft-delete or disallow delete if referenced)

Phase 9 — PWA, Accessibility, Mobile UX

- [ ] Installable PWA: icons, manifest metadata, basic service worker registration
- [ ] Responsive tweaks: mobile-first sheets, bottom tab, touch targets ≥ 44px
- [ ] Focus states, ARIA for forms and dialogs, color contrast check (WCAG 2.1 AA basics)
- [ ] Performance pass: split critical routes, avoid blocking main thread; lazy-load charts

Phase 10 — Security, Policies, and Auditing

- [ ] RLS policy review for all tables; ensure least-privilege access
- [ ] Prevent email enumeration (auth flows and invites)
- [ ] Audit logs: edits/deletes/settlements captured (MVP: table-level triggers to history tables)
- [ ] TLS-only and cookie settings documentation; secure storage of keys

Phase 11 — Observability, Testing, and QA

- [ ] Error reporting and tracing (client-side; vendor or console fallback)
- [ ] Unit tests for calculations (splits, rounding, net balance)
- [ ] Integration tests for RPCs (if feasible locally)
- [ ] Manual test scripts for key flows from `docs/ui.md`
- [ ] Seed scripts for local dev data

Phase 12 — Documentation and Release

- [ ] Update README with setup, environment variables, scripts
- [ ] Contribute guide: PR size, review process, testing checklist
- [ ] Changelog for MVP
- [ ] Deployment docs (e.g., Vercel + Supabase)

Backlog / Nice-to-Have

- Multi-currency support with FX snapshots
- Attachments/receipts for expenses
- Search by note/merchant
- Notifications for group activity
- Offline-first caching strategy for PWA

Review Gates (end of each phase)

- Scope demo against `docs/requirements.md`
- RLS + permissions check for new tables/RPCs
- Accessibility check on new forms/screens
- Performance sanity (route bundles, API timing)

