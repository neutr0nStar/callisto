"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isAmount2dp, isRequiredDate, to2dpNumber } from "@/lib/validation";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type PersonalExpenseFormValues = {
  type: "expense" | "income";
  amount: string; // keep as string in UI to preserve user input until submit
  date: Date | undefined;
  category: string;
  note: string;
};

export type PersonalExpenseSheetProps = {
  mode?: "add" | "edit";
  initial?: Partial<PersonalExpenseFormValues>;
  categoriesHint?: string[];
  onSubmit?: (values: PersonalExpenseFormValues) => Promise<void> | void;
  trigger?: React.ReactNode;
  onDelete?: () => Promise<void> | void;
};

export default function PersonalExpenseSheet({
  mode = "add",
  initial,
  categoriesHint = [],
  onSubmit,
  trigger,
  onDelete,
}: PersonalExpenseSheetProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">(
    initial?.type ?? "expense"
  );
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [date, setDate] = useState<Date | undefined>(
    initial?.date ?? (mode === "add" ? new Date() : undefined)
  );
  const [category, setCategory] = useState(initial?.category ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function resetForm() {
    if (mode === "add") {
      setType("expense");
      setAmount("");
      setDate(new Date());
      setCategory("");
      setNote("");
    } else {
      setType(initial?.type ?? "expense");
      setAmount(initial?.amount ?? "");
      setDate(initial?.date ?? new Date());
      setCategory(initial?.category ?? "");
      setNote(initial?.note ?? "");
    }
  }

  const isValid = useMemo(() => {
    const validAmount = isAmount2dp(amount) && to2dpNumber(amount) > 0;
    const validDate = isRequiredDate(date);
    const validCategory = type === "income" || category.trim().length > 0;
    return validAmount && validDate && validCategory;
  }, [amount, date, category, type]);

  async function handleSubmit() {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const values: PersonalExpenseFormValues = {
        type,
        amount,
        date,
        category: type === "income" ? "Income" : category.trim(),
        note: note.trim(),
      };

      const doSubmit = async () => {
        // Prefer passed-in handler, else fallback to Supabase insert
        if (onSubmit) {
          await onSubmit(values);
          return;
        }
        const { supabase } = await import("@/lib/supabase");
        const { data: sess, error: sErr } = await supabase.auth.getSession();
        if (sErr) throw sErr;
        const user = sess.session?.user;
        if (!user) throw new Error("Not signed in");

        const d = values.date!;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const da = String(d.getDate()).padStart(2, "0");
        const isoDate = `${y}-${m}-${da}`;

        const amt = to2dpNumber(values.amount);
        const { createPersonalExpense } = await import("@/lib/personal-expenses");
        await createPersonalExpense({
          user_id: user.id,
          amount: amt,
          date: isoDate,
          is_income: values.type === "income",
          category: values.category,
          comment: values.note || null,
        });
      };

      const promise = doSubmit();
      toast.promise(promise, {
        loading: "Saving expense...",
        success: "Expense added",
        error: (e) => e?.message || "Failed to add expense",
      });
      // Close immediately so the optimistic item is visible underneath
      setOpen(false);
      await promise;
      // Reset fields after successful submit
      resetForm();
      // leave fields as-is on close for now; future: reset on successful add
    } finally {
      setSubmitting(false);
    }
  }

  const title = mode === "add" ? "Add Expense" : "Edit Expense";

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger ?? (
          <Button
            size="lg"
            className="h-auto rounded-full px-5 py-3 text-base font-semibold shadow-lg shadow-primary/30"
            type="button"
          >
            <Plus className="h-5 w-5" />
            {mode === "add" ? "Add expense" : "Edit"}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <form className="space-y-4 px-2 pb-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={type === "expense"}
              data-state={type === "expense" ? "on" : "off"}
              onClick={() => setType("expense")}
              className={
                "border-input data-[state=on]:bg-rose-50 data-[state=on]:text-rose-700 data-[state=on]:border-rose-200 rounded-lg border px-3 py-2 text-sm font-medium"
              }
            >
              Expense
            </button>
            <button
              type="button"
              aria-pressed={type === "income"}
              data-state={type === "income" ? "on" : "off"}
              onClick={() => setType("income")}
              className={
                "border-input data-[state=on]:bg-emerald-50 data-[state=on]:text-emerald-700 data-[state=on]:border-emerald-200 rounded-lg border px-3 py-2 text-sm font-medium"
              }
            >
              Income
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Amount
            </label>
            <Input
              inputMode="decimal"
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-invalid={!isAmount2dp(amount)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => setDate(d ?? undefined)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {type === "expense" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Category
                </label>
                <Input
                  list="personal-category-hint"
                  placeholder="e.g., Groceries"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                {categoriesHint.length > 0 ? (
                  <datalist id="personal-category-hint">
                    {categoriesHint.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                ) : null}
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Category
                </label>
                <Input value="Income" disabled />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Note
            </label>
            <Input
              placeholder="Optional details"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </form>
        <DrawerFooter className="gap-2">
          {mode === "edit" && onDelete ? (
            <Button
              variant="destructive"
              type="button"
              disabled={submitting || deleting}
              onClick={async () => {
                if (deleting) return;
                const ok = typeof window !== "undefined" ? window.confirm("Delete this expense?") : true;
                if (!ok) return;
                try {
                  setDeleting(true);
                  await onDelete();
                  setOpen(false);
                  resetForm();
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          ) : null}
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            type="button"
          >
            {mode === "add" ? "Save" : "Update"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
