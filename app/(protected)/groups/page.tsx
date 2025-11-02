import { Plus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export default function GroupsPage() {
  return (
    <AppShell
      title="Groups"
      description="Shared spaces for splitting expenses with friends."
      fab={
        <Button
          size="lg"
          className="h-auto rounded-full px-5 py-3 text-base font-semibold shadow-lg shadow-primary/30"
          type="button"
        >
          <Plus className="h-5 w-5" />
          Create group
        </Button>
      }
    >
      <section className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
        Group list and activity will show here.
      </section>
    </AppShell>
  );
}
