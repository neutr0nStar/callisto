import { supabase } from "@/lib/supabase";

export type PersonalExpenseType = "expense" | "income";

export type PersonalExpense = {
  id: string;
  userId: string;
  amount: number;
  date: string; // ISO YYYY-MM-DD
  category: string;
  note?: string | null;
  type: PersonalExpenseType;
  createdAt: string; // ISO datetime
};

export type PersonalExpenseFilters = {
  from?: string; // inclusive, ISO YYYY-MM-DD
  to?: string; // inclusive, ISO YYYY-MM-DD
  categories?: string[];
};

export type CreatePersonalExpenseInput = {
  user_id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  is_income: boolean;
  category: string;
  comment?: string | null;
};

export async function createPersonalExpense(input: CreatePersonalExpenseInput) {
  const { data, error } = await supabase
    .from("personal_expense")
    .insert({
      user_id: input.user_id,
      amount: input.amount,
      date: input.date,
      is_income: input.is_income,
      category: input.category,
      comment: input.comment ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listPersonalExpenses(
  userId: string,
  filters?: PersonalExpenseFilters
): Promise<PersonalExpense[]> {
  let q = supabase
    .from("personal_expense")
    .select("id,user_id,amount,date,is_income,category,comment,created_at")
    .eq("user_id", userId);

  if (filters?.from) q = q.gte("date", filters.from);
  if (filters?.to) q = q.lte("date", filters.to);
  if (filters?.categories && filters.categories.length > 0) {
    q = q.in("category", filters.categories);
  }

  const { data, error } = await q.order("date", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((r) => ({
    id: r.id as string,
    userId: r.user_id as string,
    amount: typeof r.amount === "string" ? Number(r.amount) : (r.amount as number),
    date: r.date as string,
    category: r.category as string,
    note: (r as any).comment ?? null,
    type: (r as any).is_income ? "income" : "expense",
    createdAt: r.created_at as string,
  }));
}

export type UpdatePersonalExpenseInput = {
  amount?: number;
  date?: string; // YYYY-MM-DD
  is_income?: boolean;
  category?: string;
  comment?: string | null;
};

export async function updatePersonalExpense(
  id: string,
  updates: UpdatePersonalExpenseInput
) {
  const { data, error } = await supabase
    .from("personal_expense")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePersonalExpense(id: string) {
  const { error } = await supabase.from("personal_expense").delete().eq("id", id);
  if (error) throw error;
}
