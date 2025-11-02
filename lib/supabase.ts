import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  var __supabase__: SupabaseClient | undefined;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase: SupabaseClient =
  globalThis.__supabase__ ?? createClient(supabaseUrl, supabaseKey);

if (process.env.NODE_ENV !== "production") {
  globalThis.__supabase__ = supabase;
}
