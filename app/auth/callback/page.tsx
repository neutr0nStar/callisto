"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  const { oAuthError, oAuthErrorDescription } = useMemo(() => {
    if (typeof window === "undefined")
      return { oAuthError: null as string | null, oAuthErrorDescription: null as string | null };
    const params = new URLSearchParams(window.location.search);
    return {
      oAuthError: params.get("error"),
      oAuthErrorDescription: params.get("error_description"),
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function resolveSession() {
      try {
        if (oAuthError) throw new Error(oAuthErrorDescription || oAuthError);
        const { data, error: sessErr } = await supabase.auth.getSession();
        if (sessErr) throw sessErr;
        if (data.session) {
          const needsProfile = await needsNameCompletion();
          if (!cancelled) router.replace(needsProfile ? "/auth/complete-profile" : "/");
          return;
        }
        // Retry once shortly after; SDK may hydrate session asynchronously
        timeoutId = setTimeout(async () => {
          const { data: d2, error: e2 } = await supabase.auth.getSession();
          if (e2) {
            if (!cancelled) {
              setError(e2.message);
              setProcessing(false);
            }
            return;
          }
          if (d2.session) {
            const needsProfile = await needsNameCompletion();
            if (!cancelled) router.replace(needsProfile ? "/auth/complete-profile" : "/");
          } else if (!cancelled) {
            setError("No active session found. Please sign in again.");
            setProcessing(false);
          }
        }, 800);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Authentication failed.";
        if (!cancelled) {
          setError(message);
          setProcessing(false);
        }
      }
    }

    resolveSession();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [oAuthError, oAuthErrorDescription, router]);

  async function needsNameCompletion() {
    const { data: sess } = await supabase.auth.getSession();
    const userId = sess.session?.user.id;
    if (!userId) return true;
    const { data } = await supabase
      .from("user_profile")
      .select("first_name,last_name")
      .eq("id", userId)
      .maybeSingle();
    const first = (data?.first_name || "").trim();
    const last = (data?.last_name || "").trim();
    return !first || !last;
  }

  if (processing && !error) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Completing sign-in…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6 text-foreground">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Sign-in Error</span>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">{error}</p>
          <Button className="w-full rounded-full" type="button" onClick={() => router.replace("/auth")}> 
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
