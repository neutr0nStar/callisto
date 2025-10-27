# Callisto

Callisto is a mobile-first Progressive Web App that unifies personal and group expense tracking. The project explores how far coding agents (Codex) can take a full-stack build while delivering a polished finance companion that keeps every expense, split, and settlement in one place.

## Product Goals

- Provide a single home for both personal budgeting and group expense management.
- Make expense capture fast on mobile with predictable, accessible UI patterns.
- Keep balances transparent with reliable split logic and settlement history.
- Use the project as a learning ground for building production-grade Next.js + Supabase apps with agent assistance.

## Core Features

**Personal finance**
- Add, edit, and delete personal expenses or income with category, amount, date, and notes.
- View newest-first lists with empty states, filter drawers, and optional search.

**Group finance**
- Create groups, invite members by email, and manage roles (admin/member).
- Record group expenses with equal, percentage, or share-based splits that reconcile to the cent.
- Track member balances, allow edits/deletes with permission checks, and record settlements.

**Dashboard & budgets**
- Surface “money left to spend,” total spending, and group balances at a glance.
- Offer mobile-friendly charts for category and time breakdowns with basic filters.
- Support personal budgets (weekly/monthly) with quick entry flows.

**Authentication & profile**
- Sign in with Google via Supabase Auth.
- Maintain user profiles (first name, last name, email) with edit, sign-out, and account deletion flows.

## User Experience Principles

- Mobile-first layout with a bottom tab bar (`Dashboard`, `Personal`, `Groups`, `Profile`).
- Fast entry sheets and toasts for create/edit flows; slide-in drawers for filters.
- Touch-friendly controls, accessible forms, and deterministic rounding for split editors.

## Architecture at a Glance

- **Frontend**: Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui components.
- **Backend & Auth**: Supabase (Postgres, Supabase Auth for Google sign-in).
- **Key data models**: `user_profile`, `personal_expense`, `group`, `group_member`, `group_expense`, `expense_share`, `settlement`, `personal_budget`, `custom_category`.
- **State & UX helpers**: Radix primitives, Lucide icons, `sonner` toasts, `next-themes` for theming.

Further architectural details live in `docs/system_design.md`.

## Local Development

1. Install dependencies: `pnpm install`
2. Run the dev server: `pnpm dev`
3. Lint the project: `pnpm lint`
4. Build for production: `pnpm build`

The app runs at `http://localhost:3000`. Supabase environment variables will live in `.env.local`; see `docs/plan.md#phase-1` for upcoming configuration work.

## Working Conventions

- Branch naming: `feat/<area>-<desc>`, `fix/<area>-<desc>`, `chore/<area>-<desc>`
- PR checklist: scope statement, screenshots, test notes, migration notes, RLS note (if applicable)
- Definition of done: typed, linted, minimally tested, accessible, and resilient to loading/empty/error states
- Keep secrets out of the repo; use `.env.local` for Supabase keys.

## Folder Guide

- `app/` – App Router routes, layouts, server components
- `components/` – Shared UI components (shadcn/ui powered)
- `lib/` – Utilities and helpers
- `docs/` – Product brief, requirements, system design, UI references

## Further Reading

- Product brief: `docs/idea.md`
- Requirements: `docs/requirements.md`
- System design: `docs/system_design.md`
- UI notes and flows: `docs/ui.md`
- Delivery plan: `docs/plan.md`

Contributions, issues, and questions are welcome—feel free to open a discussion or PR as the roadmap evolves.
