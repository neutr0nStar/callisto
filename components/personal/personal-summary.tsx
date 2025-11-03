import { Card, CardContent } from "@/components/ui/card";

import type { PersonalExpense } from "@/lib/mocks/personal-expenses";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Calculator, TrendingDown, TrendingUp } from "lucide-react";

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

function inCurrentMonth(dateIso: string) {
  const d = new Date(dateIso);
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth()
  );
}

export default function PersonalSummary({
  items,
}: {
  items: PersonalExpense[];
}) {
  const monthItems = items.filter((i) => inCurrentMonth(i.date));
  const income = monthItems
    .filter((i) => i.type === "income")
    .reduce((sum, i) => sum + i.amount, 0);
  const expenses = monthItems
    .filter((i) => i.type === "expense")
    .reduce((sum, i) => sum + i.amount, 0);
  const net = income - expenses;

  return (
    <div className="mb-4 grid grid-cols-3 gap-3 md:gap-4">
      <SummaryCard
        label="Income"
        value={formatCurrency(income)}
        accent="emerald"
        icon={TrendingUp}
      />
      <SummaryCard
        label="Spent"
        value={formatCurrency(expenses)}
        accent="rose"
        icon={TrendingDown}
      />
      <SummaryCard
        label="Net"
        value={formatCurrency(net)}
        accent={net >= 0 ? "emerald" : "rose"}
        icon={Calculator}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  accent: "emerald" | "rose";
  icon: LucideIcon;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div
          aria-hidden
          className={cn(
            "mb-2 flex h-7 w-7 items-center justify-center rounded-full border text-center",
            accent === "emerald"
              ? "border-emerald-200/60 bg-emerald-50 text-emerald-700"
              : "border-rose-200/60 bg-rose-50 text-rose-700"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-1 text-base font-semibold tabular-nums",
            accent === "emerald" ? "text-emerald-600" : "text-rose-600"
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
