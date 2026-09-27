import "server-only"

import { createClient } from "@supabase/supabase-js"

import { getSupabasePublicEnv } from "@/lib/env"
import type { Database } from "@/lib/supabase/database.types"

/**
 * Client Supabase sans session, pour les lectures publiques mises en cache
 * ('use cache') : seul le contenu visible par tous est renvoyé (RLS).
 */
export function createPublicClient() {
  const { url, publishableKey } = getSupabasePublicEnv()
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
