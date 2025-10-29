"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M17.64 9.2045c0-.6382-.0573-1.2518-.1636-1.8409H9v3.4818h4.844c-.2088 1.125-.8432 2.0773-1.7955 2.7164v2.2568h2.9086c1.7027-1.5673 2.682-3.8741 2.682-6.6141z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4668-.8045 5.955-2.1818l-2.9086-2.2568c-.8059.54-1.8368.8591-3.0464.8591-2.3428 0-4.3273-1.5827-5.0345-3.7091H.9554v2.3318C2.4373 15.8455 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.9655 10.711c-.18-.54-.2836-1.1173-.2836-1.711 0-.5936.1036-1.171.2836-1.711V4.9573H.9554C.3477 6.167 0 7.5437 0 9c0 1.4564.3477 2.833.9554 4.0427l3.0101-2.3318z"
      />
      <path
        fill="#4285F4"
        d="M9 3.5455c1.3214 0 2.5123.4545 3.4464 1.3455l2.5841-2.584C13.4668.8045 11.43 0 9 0 5.4818 0 2.4373 2.1545.9554 4.9573l3.0101 2.3318C4.6727 5.9182 6.6573 4.3636 9 4.3636z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignIn = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });
      if (err) throw err;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to start sign-in.";
      setError(message);
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Callisto</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>

        {error ? (
          <p className="mb-4 text-sm text-destructive" role="alert">{error}</p>
        ) : null}

        <Button
          type="button"
          className="h-auto w-full gap-2 rounded-full px-5 py-3 text-base font-semibold"
          onClick={onSignIn}
          disabled={loading}
        >
          <GoogleIcon className="h-5 w-5" />
          {loading ? "Redirecting…" : "Continue with Google"}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
