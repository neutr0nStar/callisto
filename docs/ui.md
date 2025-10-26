# UI Design (Mobile-First)

## Navigation Model

- Bottom tab bar with 4 tabs: Dashboard, Personal, Groups, Profile
- Contextual FAB: Add expense on Personal and Group pages; Add budget on Dashboard
- Common patterns: full-screen sheets for create/edit, slide-in drawers for filters, toasts for confirmations

## Screens

### Auth

- Sign In: Google button, privacy notice
- Onboarding: confirm first/last name, email; optional avatar

### Dashboard

- Header: greeting, quick period selector (This month, This week)
- Budget card: money left to spend, progress bar, CTA to “Set budget” if none
- Spending summary: total spend, income toggle optional
- Group balances: per-group net owed/are owed, link to group detail
- Charts: category breakdown and time (weekly/monthly)

### Personal

- Expense list: newest first; amount, category, date, note preview
- Filters: date range, category; search by note/merchant (optional)
- Empty state: “No expenses yet” with Add expense CTA
- FAB: Add expense (toggle for income)

### Personal • Add/Edit Expense

- Fields: amount (numeric keypad), date, category, note, type toggle (Expense/Income)
- Actions: Save, Delete (edit mode only)

### Groups

- Group list: name, your net balance; badge if you owe/are owed
- Actions: Create group

### Group • Create/Edit

- Fields: name; (auto) you are admin
- Add members: add by email; pending vs active shown in member list

### Group • Detail

- Header: group name, your net balance (owed/are owed)
- Tabs: Activity (expenses + settlements), Members
- Activity list: items with payer, splits summary, amounts; settlements shown distinctly
- Toolbar: Add expense, Record settlement; Filter by date/category/type

### Group • Add/Edit Expense

- Fields: amount, date, category, description, paid by (member)
- Split editor: type = Equal | Percentage | Shares
  - Equal: auto-split equally among selected members
  - Percentage: inputs per member; must sum to 100%
  - Shares: integer weights per member; normalized to total
- Validation: split must reconcile to total; deterministic rounding

### Group • Record Settlement

- Fields: payer, payee, amount, date, note
- Shows updated summary after save

### Members

- List: member name, role (admin/member), status (pending/active)
- Admin actions: transfer admin, remove member

### Budgets

- Personal budget: period (monthly/weekly), start date, amount
- Quick links from Dashboard budget card

### Categories

- Custom categories: list and create/edit (name, icon)

### Profile

- Profile: first name, last name, email (read-only if from auth)
- Actions: Edit profile, Sign out, Delete account

## Key Flows (Mobile)

### Add Personal Expense

- Personal tab → FAB Add → enter amount, date, category, note → Save → toast → returns to list (scrolled to new item)

### Edit/Delete Personal Expense

- Personal list → tap item → Edit sheet → change fields → Save
- Or Delete → confirm dialog → toast → item removed

### Create Group and Add Members

- Groups tab → Create group → enter name → Create → Group detail opens
- Members tab → Add by email → invites shown as pending → upon acceptance, status becomes active

### Add Group Expense (Equal Split)

- Group detail → Add expense → fill amount/date/category/description → Split: Equal (preselect all) → Save → balances update

### Add Group Expense (Percentage or Shares)

- Group detail → Add expense → Split: Percentage or Shares → input per-member values → validation shows remaining/overage → Save when reconciled

### Record Settlement

- Group detail → Record settlement → choose payer/payee, amount, date, note → Save → activity shows settlement; balance updates

### View Balances

- Dashboard: per-group net balances summary → tap to open group detail
- Group detail header: your net position in that group

### Set Budget

- Dashboard budget card → Set budget → choose period, start date, amount → Save → Dashboard shows progress and remaining

### Manage Profile

- Profile tab → Edit profile → update names → Save
- Sign out or Delete account via actions

## UI Components (Core)

- Amount input (numeric keypad), date picker, category picker
- Split editor (equal/percentage/shares)
- Member selector with role/status badges
- List items with swipe actions (edit/delete) where applicable
- Toasts for success/errors; confirmation dialogs for destructive actions

## Accessibility & Mobile UX

- Touch targets ≥ 44px; clear focus states
- High-contrast theme; readable typography
- Avoid long forms; use progressive disclosure and sheets

