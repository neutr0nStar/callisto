# Requirements

## Outline

Callisto: a PWA for personal and group finance tracking with summarization.

## Functional Requirements

**FR-1: Personal Expense Tracking**

- [FR-1.1]: The user can add a personal expense (date, amount, category, comments optional)
- [FR-1.2]: The user can delete a personal expense
- [FR-1.3]: The user can edit a personal expense
- [FR-1.4]: The user can add income (date, amount, comments optional)
- [FR-1.5]: The user can view a list of all personal expenses, sorted by date (newest first).

**FR-2: Group Expense Tracking**

- [FR-2.1]: The user can create a group (name); the creator becomes admin
- [FR-2.2]: The admin can add members to the group using their email addresses
- [FR-2.3]: Group members can add group expenses (date, amount, category, split, comments optional)
- [FR-2.4]: Split types and validation: equal, percentage, or shares; totals must reconcile; define rounding rules
- [FR-2.5]: Group expenses can be deleted by the expense creator or a group admin
- [FR-2.6]: Group expenses can be edited by the expense creator or a group admin
- [FR-2.7]: Group members can see their net balance (owed/are owed) at the top of the group page
- [FR-2.8]: Group members can record settlements; recording only (no payment processing)
- [FR-2.9]: Admins can manage membership (remove members, transfer admin, delete group)
- [FR-2.10]: Group members can leave a group if all balances are settled

**FR-3: Authentication and Profile**

- [FR-3.1]: The user can authenticate with Google
- [FR-3.2]: The user has a profile containing first name, last name, and email
- [FR-3.3]: The user can sign out, edit profile fields, and delete their account

**FR-4: Dashboard**

- [FR-4.1]: The user can see money left to spend out of the income, total spending, and group balances
- [FR-4.2]: The user can see category-wise and time-wise (weekly, monthly) spending with basic filters (date range, category)

## Assumptions and Clarifications

- Currency and amounts: amounts use decimal math; a single primary currency per user or group
- Sorting and filters: lists default to newest-first with basic filters and pagination when needed
- Splits and rounding: percentage and share splits must reconcile to the total; round to two decimal places with any remainder allocated deterministically
- Time zones: store timestamps in UTC; display in the user’s local time zone
- Invites: members join groups via email
- Permissions: “creator or admin” may edit/delete group expenses; admins can manage group membership

## PWA and Non-Functional Requirements

- Installable and responsive: supports mobile and desktop screen sizes
- Performance: initial load is responsive on mid-range mobile; avoid blocking the main thread
- Accessibility: adheres to WCAG 2.1 AA basics for forms and contrasts
- Security and privacy: only group members can access group data; avoid email enumeration; TLS-only; reasonable audit logs for edits/deletes/settlements
