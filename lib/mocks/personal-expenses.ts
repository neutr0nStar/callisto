export type PersonalExpenseType = "expense" | "income";

export type PersonalExpense = {
  id: string;
  userId: string;
  amount: number; // decimal amount in primary currency
  date: string; // ISO date string
  category: string;
  note?: string | null;
  type: PersonalExpenseType;
  createdAt: string; // ISO datetime string
};

// Mock data for UI development only
const MOCK_EXPENSES: PersonalExpense[] = [
  {
    id: "exp_01",
    userId: "demo-user",
    amount: 24.5,
    date: "2025-11-14",
    category: "Food",
    note: "Lunch at Bento Box",
    type: "expense",
    createdAt: "2025-03-14T13:45:00Z",
  },
  {
    id: "exp_02",
    userId: "demo-user",
    amount: 1200,
    date: "2025-11-12",
    category: "Income",
    note: "Salary",
    type: "income",
    createdAt: "2025-03-12T08:00:00Z",
  },
  {
    id: "exp_03",
    userId: "demo-user",
    amount: 12.75,
    date: "2025-11-11",
    category: "Transport",
    note: "Metro top-up",
    type: "expense",
    createdAt: "2025-03-11T18:20:00Z",
  },
  {
    id: "exp_04",
    userId: "demo-user",
    amount: 56.2,
    date: "2025-11-11",
    category: "Groceries",
    note: "Weekly essentials",
    type: "expense",
    createdAt: "2025-03-11T10:05:00Z",
  },
  {
    id: "exp_05",
    userId: "demo-user",
    amount: 4.99,
    date: "2025-11-09",
    category: "Entertainment",
    note: "App subscription",
    type: "expense",
    createdAt: "2025-03-09T07:30:00Z",
  },
];

export type PersonalExpenseFilters = {
  from?: string; // inclusive, ISO YYYY-MM-DD
  to?: string; // inclusive, ISO YYYY-MM-DD
  category?: string; // exact match, case-insensitive (deprecated; use categories)
  categories?: string[]; // multi-select, case-insensitive
};

export async function listPersonalExpensesMock(
  userId: string,
  filters?: PersonalExpenseFilters
): Promise<PersonalExpense[]> {
  // Simulate RLS by filtering by userId and returning newest-first by date,
  // then createdAt as a tie-breaker.
  const data = MOCK_EXPENSES.filter((e) => e.userId === userId)
    .filter((e) => {
      if (!filters) return true;
      const { from, to, category, categories } = filters;
      if (from && e.date < from) return false;
      if (to && e.date > to) return false;
      const cats = categories && categories.length > 0 ? categories : category ? [category] : [];
      if (cats.length > 0) {
        const match = cats.some((c) => c && e.category.toLowerCase() === c.toLowerCase());
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.date === b.date) {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return b.date.localeCompare(a.date);
    });
  return data;
}
