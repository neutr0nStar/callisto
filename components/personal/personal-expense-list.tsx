import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PersonalExpense } from "@/lib/mocks/personal-expenses";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Car,
  ShoppingCart,
  UtensilsCrossed,
  Wallet,
  Music4,
} from "lucide-react";

function formatCurrency(amount: number, currency = "USD") {
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
};

export default function PersonalExpenseList({
  items,
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
          <ul className="">
            {g.items.map((e, idx) => (
              <li key={e.id} className="px-4 py-3 md:px-5">
                <div className="flex items-start gap-3">
                  <div
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-center",
                      e.type === "income"
                        ? "border-emerald-200/60 bg-emerald-50 text-emerald-700"
                        : getExpenseBadgeClasses(e.category)
                    )}
                    title={e.type === "income" ? "Income" : "Expense"}
                  >
                    <CategoryIcon
                      category={e.category}
                      type={e.type}
                      className={cn(
                        e.type === "income"
                          ? "text-emerald-700"
                          : getExpenseIconColor(e.category)
                      )}
                    />
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
                            e.type === "income"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          )}
                        >
                          {e.type === "income" ? "+" : "-"}
                          {formatCurrency(e.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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

function CategoryIcon({
  category,
  type,
  className,
}: {
  category: string;
  type: PersonalExpense["type"];
  className?: string;
}) {
  const cat = category.toLowerCase();
  if (type === "income") return <Wallet className={cn("h-4 w-4", className)} />;
  if (
    cat.includes("food") ||
    cat.includes("dining") ||
    cat.includes("restaurant")
  )
    return <UtensilsCrossed className={cn("h-4 w-4", className)} />;
  if (
    cat.includes("grocery") ||
    cat.includes("grocer") ||
    cat.includes("market")
  )
    return <ShoppingCart className={cn("h-4 w-4", className)} />;
  if (
    cat.includes("transport") ||
    cat.includes("uber") ||
    cat.includes("taxi") ||
    cat.includes("metro")
  )
    return <Car className={cn("h-4 w-4", className)} />;
  if (cat.includes("entertain"))
    return <Music4 className={cn("h-4 w-4", className)} />;
  return <Wallet className={cn("h-4 w-4", className)} />;
}

function getExpenseIconColor(category: string) {
  const cat = category.toLowerCase();
  if (
    cat.includes("food") ||
    cat.includes("dining") ||
    cat.includes("restaurant")
  )
    return "text-orange-700";
  if (
    cat.includes("grocery") ||
    cat.includes("grocer") ||
    cat.includes("market")
  )
    return "text-lime-700";
  if (
    cat.includes("transport") ||
    cat.includes("uber") ||
    cat.includes("taxi") ||
    cat.includes("metro")
  )
    return "text-sky-700";
  if (cat.includes("entertain")) return "text-violet-700";
  return "text-slate-700";
}

function getExpenseBadgeClasses(category: string) {
  const cat = category.toLowerCase();
  if (
    cat.includes("food") ||
    cat.includes("dining") ||
    cat.includes("restaurant")
  )
    return "border-orange-200/60 bg-orange-50 text-orange-700";
  if (
    cat.includes("grocery") ||
    cat.includes("grocer") ||
    cat.includes("market")
  )
    return "border-lime-200/60 bg-lime-50 text-lime-700";
  if (
    cat.includes("transport") ||
    cat.includes("uber") ||
    cat.includes("taxi") ||
    cat.includes("metro")
  )
    return "border-sky-200/60 bg-sky-50 text-sky-700";
  if (cat.includes("entertain"))
    return "border-violet-200/60 bg-violet-50 text-violet-700";
  return "border-slate-200/60 bg-slate-50 text-slate-700";
}
