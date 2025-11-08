import type { ComponentType } from "react";
import {
  UtensilsCrossed,
  ShoppingCart,
  Car,
  Music4,
  Wallet,
  CreditCard,
  Archive,
  Shirt,
} from "lucide-react";

export type CategoryItem = {
  name: string;
  icon: ComponentType<{ className?: string }>;
  textColor: string;
  badgeColor: string;
};

export const COMMON_CATEGORIES: CategoryItem[] = [
  {
    name: "Income",
    icon: Wallet,
    textColor: "text-emerald-700",
    badgeColor: "border-emerald-200/60 bg-emerald-50 text-emerald-700",
  },
  {
    name: "Food & Dining",
    icon: UtensilsCrossed,
    textColor: "text-orange-700",
    badgeColor: "border-orange-200/60 bg-orange-50 text-orange-700",
  },
  {
    name: "Clothing",
    icon: Shirt,
    textColor: "text-amber-700",
    badgeColor: "border-amber-200/60 bg-amber-50 text-amber-700",
  },
  {
    name: "Groceries",
    icon: ShoppingCart,
    textColor: "text-sky-700",
    badgeColor: "border-sky-200/60 bg-sky-50 text-sky-700",
  },
  {
    name: "Transport",
    icon: Car,
    textColor: "text-indigo-700",
    badgeColor: "border-indigo-200/60 bg-indigo-50 text-indigo-700",
  },
  {
    name: "Entertainment",
    icon: Music4,
    textColor: "text-violet-700",
    badgeColor: "border-violet-200/60 bg-violet-50 text-violet-700",
  },
  {
    name: "Bills & Utilities",
    icon: CreditCard,
    textColor: "text-rose-700",
    badgeColor: "border-rose-200/60 bg-rose-50 text-rose-700",
  },
  {
    name: "Others",
    icon: Archive,
    textColor: "text-slate-700",
    badgeColor: "border-slate-200/60 bg-slate-50 text-slate-700",
  },
];

export function getAllCategoryNames(): string[] {
  return COMMON_CATEGORIES.map((c) => c.name);
}

export function getCategoryIconComponent(
  name: string,
  type: "expense" | "income"
) {
  if (type === "income") {
    return Wallet;
  } else {
    // look in common categories
    const common_categories_set = new Set(
      COMMON_CATEGORIES.map((c) => c.name.toLowerCase())
    );

    const fl = COMMON_CATEGORIES.filter(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (fl.length !== 0) {
      return fl[0].icon;
    } else {
      return Archive;
    }
  }
}

export function getExpenseIconColor(name: string) {
  const fl = COMMON_CATEGORIES.filter(
    (c) => c.name.toLocaleLowerCase() == name.toLocaleLowerCase()
  );
  if (fl.length > 0) {
    return fl[0].textColor;
  } else {
    return "text-slate-700";
  }
}

export function getExpenseBadgeClasses(name: string) {
  const fl = COMMON_CATEGORIES.filter(
    (c) => c.name.toLocaleLowerCase() == name.toLocaleLowerCase()
  );
  if (fl.length > 0) {
    return fl[0].badgeColor;
  } else {
    return "border-slate-200/60 bg-slate-50 text-slate-700";
  }
}

// Typed wrappers that consider income type explicitly
export function getCategoryIconColor(name: string, type: "expense" | "income") {
  if (type === "income") return "text-emerald-700";
  return getExpenseIconColor(name);
}

export function getCategoryBadgeClasses(
  name: string,
  type: "expense" | "income"
) {
  if (type === "income")
    return "border-emerald-200/60 bg-emerald-50 text-emerald-700";
  return getExpenseBadgeClasses(name);
}
