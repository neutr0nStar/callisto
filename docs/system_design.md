# System Design Document

## Tech stack

- **Frontend**: Next.js
- **Backend**: Supabase
- **Database**: Supabase Postgres
- **Authentication**: Supabase Auth
- **UI Framework**: shadcn/ui

## Table schemas

### User Profile

- id
- first_name
- last_name
- email
- avatar_url
- created_at
- updated_at

### Personal expense

- id
- user_id FK User:id
- amount
- date
- is_income
- category
- comment
- created_at
- updated_at

### Group

- id
- name
- owner_id FK User:id (creator/admin)
- created_at
- updated_at

### Group member

- group_id FK Group:id
- user_id FK User:id
- role ENUM('admin','member')
- joined_at

### Group expense

- id
- group_id FK Group:id
- amount
- date
- category
- comment
- created_at
- updated_at

### Expense share (group)

- user_id FK User:id
- expense_id FK Group_expense:id
- amount (owed by user for the expense)

### Settlement

- id
- group_id FK Group:id
- payer_id FK User:id
- payee_id FK User:id
- amount
- occurred_at (date)
- note
- created_at

### Personal budget

- id
- user_id FK User:id
- period ENUM('monthly','weekly')
- start_date
- amount
- created_at

### Custom category

- user_id FK User:id
- name
- icon_name
