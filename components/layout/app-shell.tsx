"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserRound, UsersRound, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";

type AppShellProps = {
  title: string;
  description?: string;
  fab?: ReactNode;
  children: ReactNode;
};

type AppTab = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const tabs: AppTab[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/personal", label: "Personal", icon: Wallet },
  { href: "/groups", label: "Groups", icon: UsersRound },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function AppShell({ title, description, fab, children }: AppShellProps) {
  return (
    <div className="relative flex h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 pb-3 pt-5 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Callisto
        </p>
        <div className="mt-2 space-y-0.5">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-4 pb-32 pt-6 md:px-6">
        {children}
      </main>
      {fab ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] flex justify-end px-6 md:bottom-24">
          <div className="pointer-events-auto">{fab}</div>
        </div>
      ) : null}
      <TabBar />
    </div>
  );
}

function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <ul className="grid grid-cols-4 gap-1 px-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(`${tab.href}/`));
          const Icon = tab.icon;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl p-3 text-xs font-medium text-muted-foreground transition-colors",
                  isActive && "text-primary"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "stroke-[2.5]" : "stroke-[1.75]"
                  )}
                />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
