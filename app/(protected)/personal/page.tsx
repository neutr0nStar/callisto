import { Plus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import PersonalExpenseList from "@/components/personal/personal-expense-list";
import PersonalSummary from "@/components/personal/personal-summary";
import PersonalFiltersDrawer from "@/components/personal/personal-filters-drawer";
import { listPersonalExpensesMock } from "@/lib/mocks/personal-expenses";

export default async function PersonalPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Parse filters from query
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const rawFrom = typeof searchParams?.from === "string" ? searchParams?.from : undefined;
  const rawTo = typeof searchParams?.to === "string" ? searchParams?.to : undefined;
  const from = rawFrom && dateRe.test(rawFrom) ? rawFrom : undefined;
  const to = rawTo && dateRe.test(rawTo) ? rawTo : undefined;
  const rawCategory = searchParams?.category;
  const categories = Array.isArray(rawCategory)
    ? rawCategory.filter((c): c is string => typeof c === "string")
    : typeof rawCategory === "string"
      ? [rawCategory]
      : undefined;

  // Using mock data for UI development only
  const items = await listPersonalExpensesMock("demo-user", {
    from,
    to,
    categories,
  });

  const availableCategories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <AppShell
      title="Personal"
      description="Track your individual income and expenses."
      fab={
        <Button
          size="lg"
          className="h-auto rounded-full px-5 py-3 text-base font-semibold shadow-lg shadow-primary/30"
          type="button"
        >
          <Plus className="h-5 w-5" />
          Add expense
        </Button>
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
      <PersonalSummary items={items} />
      <PersonalExpenseList items={items} />
    </AppShell>
  );
}
