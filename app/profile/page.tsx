import { Pencil } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <AppShell
      title="Profile"
      description="Manage your personal details and preferences."
      fab={
        <Button
          size="lg"
          className="h-auto rounded-full px-5 py-3 text-base font-semibold shadow-lg shadow-primary/30"
          type="button"
        >
          <Pencil className="h-5 w-5" />
          Edit profile
        </Button>
      }
    >
      <section className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
        Profile information settings will go here.
      </section>
    </AppShell>
  );
}
