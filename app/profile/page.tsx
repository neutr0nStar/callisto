"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: sessionData, error: sErr } =
          await supabase.auth.getSession();
        if (sErr) throw sErr;
        const userId = sessionData.session?.user.id;
        if (!userId) {
          setProfile(null);
          return;
        }
        const { data, error: pErr } = await supabase
          .from("user_profile")
          .select("first_name,last_name,email,avatar_url")
          .eq("id", userId)
          .single();
        if (pErr) throw pErr;
        if (!cancelled) setProfile(data as UserProfile);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const initials = useMemo(() => {
    const fn = profile?.first_name?.trim() || "";
    const ln = profile?.last_name?.trim() || "";
    const fromNames = `${fn.slice(0, 1)}${ln.slice(0, 1)}`.toUpperCase();
    if (fromNames) return fromNames;
    const email = profile?.email || "";
    return email.slice(0, 1).toUpperCase();
  }, [profile]);

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
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="Avatar"
                src={profile.avatar_url}
                className="h-16 w-16 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                {initials || "?"}
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold">
              {loading ? (
                <span className="inline-block h-5 w-40 animate-pulse rounded bg-muted" />
              ) : profile ? (
                <>
                  {profile.first_name || ""} {profile.last_name || ""}
                </>
              ) : (
                "Not signed in"
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="inline-block h-4 w-56 animate-pulse rounded bg-muted" />
              ) : (
                profile?.email || ""
              )}
            </p>
          </div>
        </div>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </section>
      <section className="pt-2">
        <Button
          variant="destructive"
          className="w-full rounded-full mt-4"
          disabled={signingOut}
          onClick={async () => {
            try {
              setSigningOut(true);
              await supabase.auth.signOut();
              router.replace("/auth");
            } finally {
              setSigningOut(false);
            }
          }}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </section>
    </AppShell>
  );
}
