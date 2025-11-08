"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import PersonalExpenseSheet, { type PersonalExpenseFormValues } from "@/components/personal/personal-expense-sheet";
import PersonalExpenseList from "@/components/personal/personal-expense-list";
import PersonalSummary from "@/components/personal/personal-summary";
import PersonalFiltersDrawer from "@/components/personal/personal-filters-drawer";
import { listPersonalExpenses, type PersonalExpense, createPersonalExpense, updatePersonalExpense, deletePersonalExpense } from "@/lib/personal-expenses";
import { getAllCategoryNames } from "@/lib/categories";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { to2dpNumber } from "@/lib/validation";

export default function PersonalPage() {
  const sp = useSearchParams();
  const [items, setItems] = useState<PersonalExpense[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const rawFrom = sp?.get("from") ?? undefined;
  const rawTo = sp?.get("to") ?? undefined;
  const from = rawFrom && dateRe.test(rawFrom) ? rawFrom : undefined;
  const to = rawTo && dateRe.test(rawTo) ? rawTo : undefined;
  const categories = sp
    ? sp
        .getAll("category")
        .filter((c) => typeof c === "string" && c.trim().length > 0)
    : undefined;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data: sess, error: sErr } = await supabase.auth.getSession();
        if (sErr) throw sErr;
        const userId = sess.session?.user.id;
        if (!userId) throw new Error("Not authenticated");
        setUserId(userId);

        const [list, listForCats] = await Promise.all([
          listPersonalExpenses(userId, { from, to, categories }),
          listPersonalExpenses(userId, { from, to, categories: undefined }),
        ]);
        if (!cancelled) {
          setItems(list);
          const repoCats = getAllCategoryNames();
          const set = new Set<string>([...repoCats, ...listForCats.map((i) => i.category)]);
          setAvailableCategories(Array.from(set));
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [from, to, sp, categories?.join("|")]);

  async function handleAdd(values: PersonalExpenseFormValues) {
    if (!userId) throw new Error("Not authenticated");
    // Build optimistic item
    const d = values.date!;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const isoDate = `${y}-${m}-${da}`;
    const amt = to2dpNumber(values.amount);
    const tempId = `temp_${Date.now()}`;
    const optimistic: PersonalExpense = {
      id: tempId,
      userId,
      amount: amt,
      date: isoDate,
      category: values.category,
      note: values.note || null,
      type: values.type,
      createdAt: new Date().toISOString(),
    };

    // Only show in list if it matches current filters
    const inDateRange = (!from || isoDate >= from) && (!to || isoDate <= to);
    const inCats = !categories || categories.length === 0 || categories.includes(values.category);

    if (inDateRange && inCats) {
      setItems((prev) => [optimistic, ...prev]);
    }
    setAvailableCategories((prev) =>
      prev.includes(values.category) ? prev : [...prev, values.category]
    );

    try {
      const row = await createPersonalExpense({
        user_id: userId,
        amount: amt,
        date: isoDate,
        is_income: values.type === "income",
        category: values.category,
        comment: values.note || null,
      });
      const mapped: PersonalExpense = {
        id: row.id as string,
        userId: row.user_id as string,
        amount: typeof row.amount === "string" ? Number(row.amount) : (row.amount as number),
        date: row.date as string,
        category: row.category as string,
        note: (row as any).comment ?? null,
        type: (row as any).is_income ? "income" : "expense",
        createdAt: row.created_at as string,
      };
      if (inDateRange && inCats) {
        setItems((prev) => prev.map((it) => (it.id === tempId ? mapped : it)));
      }
    } catch (e) {
      if (inDateRange && inCats) {
        setItems((prev) => prev.filter((it) => it.id !== tempId));
      }
      throw e;
    }
  }

  async function handleEdit(id: string, values: PersonalExpenseFormValues) {
    if (!userId) throw new Error("Not authenticated");
    const d = values.date!;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const isoDate = `${y}-${m}-${da}`;
    const amt = to2dpNumber(values.amount);

    const prev = items.find((it) => it.id === id);
    if (!prev) return;

    const updated: PersonalExpense = {
      ...prev,
      amount: amt,
      date: isoDate,
      category: values.type === "income" ? "Income" : values.category,
      note: values.note || null,
      type: values.type,
      createdAt: prev.createdAt,
    };

    const inDateRange = (!from || isoDate >= from) && (!to || isoDate <= to);
    const inCats = !categories || categories.length === 0 || categories.includes(updated.category);

    setItems((prevList) => {
      let next = prevList.map((it) => (it.id === id ? updated : it));
      // If it falls out of filters, remove from current view
      if (!(inDateRange && inCats)) {
        next = next.filter((it) => it.id !== id);
      }
      return next;
    });

    try {
      const row = await updatePersonalExpense(id, {
        amount: amt,
        date: isoDate,
        is_income: values.type === "income",
        category: updated.category,
        comment: updated.note ?? null,
      });
      // If it still matches filters and exists in view, sync potential canonical fields
      const mapped: PersonalExpense = {
        id: row.id as string,
        userId: row.user_id as string,
        amount: typeof row.amount === "string" ? Number(row.amount) : (row.amount as number),
        date: row.date as string,
        category: row.category as string,
        note: (row as any).comment ?? null,
        type: (row as any).is_income ? "income" : "expense",
        createdAt: row.created_at as string,
      };
      if (inDateRange && inCats) {
        setItems((prevList) => prevList.map((it) => (it.id === id ? mapped : it)));
      }
    } catch (e) {
      // revert
      setItems((prevList) => prevList.map((it) => (it.id === id && prev ? prev : it)));
      throw e;
    }
  }

  async function handleDelete(id: string) {
    const prevList = items;
    // optimistic removal
    setItems((list) => list.filter((it) => it.id !== id));
    try {
      await deletePersonalExpense(id);
      toast.success("Expense deleted");
    } catch (e) {
      setItems(prevList);
      toast.error(e instanceof Error ? e.message : "Failed to delete expense");
    }
  }

  return (
    <AppShell
      title="Personal"
      description="Track your individual income and expenses."
      fab={
        <PersonalExpenseSheet
          categoriesHint={availableCategories}
          onSubmit={handleAdd}
        />
      }
    >
      <div className="mb-3 flex justify-end">
        <PersonalFiltersDrawer
          from={from}
          to={to}
          selectedCategories={categories}
          availableCategories={availableCategories}
        />
      </div>
      {loading ? (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3 md:gap-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-3 md:px-5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-10" />
            </div>
            <ul>
              {[0, 1, 2].map((i) => (
                <li key={i} className="px-4 py-3 md:px-5">
                  <div className="flex items-start gap-3">
                    <Skeleton className="mt-0.5 h-9 w-9 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          {error ? (
            <p className="mb-3 text-sm text-destructive" role="alert">{error}</p>
          ) : null}
          <PersonalSummary items={items} />
          <PersonalExpenseList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            categoriesHint={availableCategories}
          />
        </>
      )}
    </AppShell>
  );
}
