import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";

/**
 * Server-side Supabase client using the service role key.
 *
 * USE ONLY in:
 *   - API routes (app/api/**)
 *   - Server actions
 *   - Service/repository layers
 *
 * NEVER expose this client to the browser — the service role key
 * bypasses Row Level Security.
 */

let _serverClient = null;

export function getSupabaseServer() {
  if (_serverClient) return _serverClient;

  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
    );
  }

  _serverClient = createClient(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return _serverClient;
}
