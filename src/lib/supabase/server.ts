import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { getSupabasePublicEnv } from "@/lib/env"
import type { Database } from "@/lib/supabase/database.types"

/**
 * Client Supabase côté serveur, lié à la session (cookies) de la requête :
 * les règles RLS s'appliquent avec les droits de l'utilisateur connecté.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const { url, publishableKey } = getSupabasePublicEnv()

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Appelé depuis un Server Component : le proxy rafraîchit déjà la session.
        }
      },
    },
  })
}
