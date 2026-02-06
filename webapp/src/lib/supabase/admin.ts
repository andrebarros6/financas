import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Admin Supabase client using service role key
 * Use this for operations that bypass RLS (e.g., waitlist inserts)
 * NEVER expose this on the client side
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin credentials");
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
