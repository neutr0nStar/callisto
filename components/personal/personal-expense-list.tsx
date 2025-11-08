"use client";

import type { PersonalExpense } from "@/lib/personal-expenses";
import { cn } from "@/lib/utils";
import { CalendarDays, Wallet } from "lucide-react";
import {
  getCategoryIconComponent,
  getCategoryBadgeClasses,
  getCategoryIconColor,
} from "@/lib/categories";
import PersonalExpenseSheet, {
  type PersonalExpenseFormValues,
} from "@/components/personal/personal-expense-sheet";

function formatCurrency(amount: number, currency = "AUD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type PersonalExpenseListProps = {
  items: PersonalExpense[];
  onEdit?: (id: string, values: PersonalExpenseFormValues) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  categoriesHint?: string[];
};

export default function PersonalExpenseList({
  items,
  onEdit,
  onDelete,
  categoriesHint = [],
}: PersonalExpenseListProps) {
  if (!items.length) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
          <Wallet className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">No personal expenses yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the Add button to create your first one.
        </p>
      </section>
    );
  }

  const groups = groupByDate(items);

  return (
    <div className="rounded-2xl border border-border bg-card">
      {groups.map((g, gi) => (
        <section
          key={g.date}
          className={cn(gi > 0 && "border-t border-border")}
        >
          <header className="flex items-center justify-between px-4 py-3 md:px-5">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDate(g.date)}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {g.count} {g.count === 1 ? "item" : "items"}
            </span>
          </header>
          <ul>
            {g.items.map((e) => (
              <li key={e.id} className="px-4 py-3 md:px-5">
                <PersonalExpenseSheet
                  mode="edit"
                  initial={{
                    type: e.type,
                    amount: String(e.amount),
                    date: new Date(e.date),
                    category: e.category,
                    note: e.note ?? "",
                  }}
                  categoriesHint={categoriesHint}
                  onSubmit={(values) => onEdit?.(e.id, values)}
                  onDelete={onDelete ? () => onDelete?.(e.id) : undefined}
                  trigger={
                    <div className="flex items-start gap-3">
                      <div
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-center",
                          getCategoryBadgeClasses(e.category, e.type)
                        )}
                        title={e.type === "income" ? "Income" : "Expense"}
                      >
                        {(() => {
                          const Icon = getCategoryIconComponent(e.category, e.type);
                          return (
                            <Icon
                              className={cn(
                                "h-4 w-4",
                                getCategoryIconColor(e.category, e.type)
                              )}
                            />
                          );
                        })()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {e.note || e.category}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {e.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={cn(
                                "text-sm font-semibold tabular-nums",
                                e.type === "income" ? "text-emerald-600" : "text-rose-600"
                              )}
                            >
                              {e.type === "income" ? "+" : "-"}
                              {formatCurrency(e.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function groupByDate(items: PersonalExpense[]) {
  const map = new Map<string, PersonalExpense[]>();
  for (const e of items) {
    const key = e.date; // already ISO YYYY-MM-DD
    const arr = map.get(key) ?? [];
    arr.push(e);
    map.set(key, arr);
  }
  const groups = Array.from(map.entries()).map(([date, items]) => ({
    date,
    items,
    count: items.length,
  }));
  groups.sort((a, b) => b.date.localeCompare(a.date));
  // within a date, preserve createdAt desc
  for (const g of groups) {
    g.items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return groups;
}
