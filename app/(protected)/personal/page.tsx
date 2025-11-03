import { Plus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import PersonalExpenseList from "@/components/personal/personal-expense-list";
import PersonalSummary from "@/components/personal/personal-summary";
import { listPersonalExpensesMock } from "@/lib/mocks/personal-expenses";

export default async function PersonalPage() {
  // Using mock data for UI development only
  const items = await listPersonalExpensesMock("demo-user");

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
      <PersonalSummary items={items} />
      <PersonalExpenseList items={items} />
    </AppShell>
  );
}
