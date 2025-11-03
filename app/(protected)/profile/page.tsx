"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
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
  const [editOpen, setEditOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
          disabled={loading}
          onClick={() => {
            setSaveError(null);
            setFirstName((profile?.first_name || "").trim());
            setLastName((profile?.last_name || "").trim());
            setEditOpen(true);
          }}
        >
          <Pencil className="h-5 w-5" />
          Edit profile
        </Button>
      }
    >
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            {loading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : profile?.avatar_url ? (
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
            <div className="text-lg font-semibold">
              {loading ? (
                <Skeleton className="h-6 w-40" />
              ) : profile ? (
                <>
                  {profile.first_name || ""} {profile.last_name || ""}
                </>
              ) : (
                "Not signed in"
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="mt-2 h-4 w-56" />
              ) : (
                profile?.email || ""
              )}
            </div>
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

      <Drawer open={editOpen} onOpenChange={setEditOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-4 px-4">
            {saveError ? (
              <p className="text-sm text-destructive" role="alert">{saveError}</p>
            ) : null}
            <div className="space-y-1">
              <label className="text-sm font-medium">First name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                disabled={saving}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Last name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={saving}
              />
            </div>
          </div>
          <DrawerFooter>
            <Button
              className="w-full rounded-full"
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaveError(null);
                const fn = firstName.trim();
                const ln = lastName.trim();
                if (!fn || !ln) {
                  setSaveError("Please enter both first and last names.");
                  return;
                }
                setSaving(true);
                try {
                  const { data: sess, error: sErr } = await supabase.auth.getSession();
                  if (sErr) throw sErr;
                  const userId = sess.session?.user.id;
                  if (!userId) throw new Error("Not authenticated");
                  const { error: uErr } = await supabase
                    .from("user_profile")
                    .update({ first_name: fn, last_name: ln })
                    .eq("id", userId);
                  if (uErr) throw uErr;
                  setProfile((prev) => prev ? { ...prev, first_name: fn, last_name: ln } : prev);
                  setEditOpen(false);
                } catch (e) {
                  setSaveError(e instanceof Error ? e.message : "Failed to update profile");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </AppShell>
  );
}
