"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: sess } = await supabase.auth.getSession();
        const user = sess.session?.user;
        if (!user) {
          router.replace("/auth");
          return;
        }
        setEmail(user.email ?? "");
        const { data } = await supabase
          .from("user_profile")
          .select("first_name,last_name")
          .eq("id", user.id)
          .maybeSingle();
        if (!cancelled && data) {
          setFirstName((data.first_name ?? "").trim());
          setLastName((data.last_name ?? "").trim());
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fn = firstName.trim();
      const ln = lastName.trim();
      if (!fn || !ln) {
        setError("Please enter both first and last names.");
        setSaving(false);
        return;
      }
      const { data: sess, error: sErr } = await supabase.auth.getSession();
      if (sErr) throw sErr;
      const userId = sess.session?.user.id;
      if (!userId) throw new Error("Not authenticated");
      const { error: uErr } = await supabase
        .from("user_profile")
        .update({ first_name: fn, last_name: ln })
        .eq("id", userId);
      if (uErr) throw uErr;
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6 text-foreground">
      <form
        onSubmit={onSave}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Complete your profile</h1>
          <p className="text-sm text-muted-foreground">We need your name to personalize your experience.</p>
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        ) : null}

        <div className="space-y-1">
          <label className="text-sm font-medium">First name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            disabled={loading || saving}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Last name</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            disabled={loading || saving}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input value={email} disabled aria-readonly placeholder="you@example.com" />
        </div>

        <Button
          className="w-full rounded-full"
          type="submit"
          disabled={loading || saving}
        >
          {saving ? "Saving…" : "Save and continue"}
        </Button>
      </form>
    </div>
  );
}

