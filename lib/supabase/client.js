import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

/**
 * Browser-side Supabase client using the anon key.
 *
 * USE ONLY in:
 *   - React components (for Realtime subscriptions)
 *   - Client-side hooks
 *
 * This client respects Row Level Security policies.
 * For server-side operations, use getSupabaseServer() instead.
 */

let _browserClient = null;

export function getSupabaseBrowser() {
  if (_browserClient) return _browserClient;

  if (!supabaseConfig.url || !supabaseConfig.anonKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
    );
  }

  _browserClient = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _browserClient;
}
