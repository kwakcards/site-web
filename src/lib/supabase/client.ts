import { createBrowserClient } from "@supabase/ssr"

import { getSupabasePublicEnv } from "@/lib/env"
import type { Database } from "@/lib/supabase/database.types"

/** Client Supabase côté navigateur (session de l'admin, envoi des photos). */
export function createClient() {
  const { url, publishableKey } = getSupabasePublicEnv()
  return createBrowserClient<Database>(url, publishableKey)
}
