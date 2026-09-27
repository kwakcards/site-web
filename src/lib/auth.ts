import "server-only"

import { redirect } from "next/navigation"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export type AdminUser = {
  id: string
  email: string | null
}

/**
 * Administrateur connecté, ou null. Les claims du jeton sont vérifiées
 * (getClaims), puis le rôle est lu dans la table profiles (RLS : son propre profil).
 * Mémorisé le temps de la requête.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub
  if (!userId) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", userId)
    .maybeSingle()

  if (profile?.role !== "admin") return null
  return { id: profile.id, email: profile.email }
})

/** À appeler en tête de chaque page et Server Action de l'admin. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin()
  if (!admin) redirect("/connexion?next=/admin")
  return admin
}
