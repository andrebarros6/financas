import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient<Database> | undefined;

export function createClient() {
  if (client) {
    console.log('[Supabase] Reusing existing client');
    return client;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('[Supabase] Creating NEW client with:', {
    url: url ? `${url.substring(0, 30)}...` : 'MISSING',
    key: key ? `${key.substring(0, 20)}...` : 'MISSING'
  });

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  client = createBrowserClient<Database>(url, key);
  return client;
}
