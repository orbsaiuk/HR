/**
 * Supabase environment configuration
 *
 * Centralizes all Supabase-related environment variables.
 * Import this instead of reading process.env directly.
 */

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  jwtSecret: process.env.SUPABASE_JWT_SECRET,
};
