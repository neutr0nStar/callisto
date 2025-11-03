"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Filter } from "lucide-react";

type PersonalFiltersDrawerProps = {
  from?: string;
  to?: string;
  selectedCategories?: string[];
  availableCategories: string[];
};

export default function PersonalFiltersDrawer({
  from,
  to,
  selectedCategories = [],
  availableCategories,
}: PersonalFiltersDrawerProps) {
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    from ? new Date(from) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    to ? new Date(to) : undefined
  );
  const [cats, setCats] = useState<Set<string>>(new Set(selectedCategories));

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCount = useMemo(() => {
    let c = 0;
    if (fromDate) c += 1;
    if (toDate) c += 1;
    if (cats.size > 0) c += 1;
    return c;
  }, [fromDate, toDate, cats]);

  function toggleCat(value: string) {
    const next = new Set(cats);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setCats(next);
  }

  function onClear() {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("from");
    params.delete("to");
    params.delete("category");
    setFromDate(undefined);
    setToDate(undefined);
    setCats(new Set());
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  }

  function toIsoDate(d?: Date) {
    if (!d || Number.isNaN(d.getTime())) return undefined;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  }

  function onApply() {
    const params = new URLSearchParams(searchParams?.toString());
    // clear existing
    params.delete("from");
    params.delete("to");
    params.delete("category");
    const fromIso = toIsoDate(fromDate);
    const toIso = toIsoDate(toDate);
    if (fromIso) params.set("from", fromIso);
    if (toIso) params.set("to", toIso);
    if (cats.size > 0) {
      for (const c of cats) params.append("category", c);
    }
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    router.push(url, { scroll: false });
    setOpen(false);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center -mt-2"
        >
          <Filter className="h-4 w-4" />
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-4 px-4">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">From</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {fromDate ? fromDate.toLocaleDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(d) => setFromDate(d ?? undefined)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">To</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {toDate ? toDate.toLocaleDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(d) => setToDate(d ?? undefined)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2 md:col-span-1">
            <p className="text-xs font-medium text-muted-foreground">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={cats.has(c)}
                    onChange={() => toggleCat(c)}
                  />
                  <span className="truncate">{c}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DrawerFooter className="gap-2">
          <Button variant="secondary" onClick={onClear}>
            Clear
          </Button>
          <Button onClick={onApply}>Apply</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
