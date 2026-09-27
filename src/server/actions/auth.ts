"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

export type SignInState = { error?: string; email?: string }

const signInSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
})

/** Chemin interne uniquement : empêche une redirection vers un autre site. */
function safeNextPath(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : ""
  if (!path.startsWith("/admin") || path.startsWith("//") || path.includes("\\")) return "/admin"
  return path
}

/** Connexion de l'équipe (email + mot de passe Supabase), réservée aux comptes admin. */
export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim()
  const parsed = signInSchema.safeParse({ email, password: formData.get("password") })
  if (!parsed.success) return { error: "Indique ton email et ton mot de passe.", email }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error || !data.user) return { error: "Email ou mot de passe incorrect.", email }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle()

  if (profile?.role !== "admin") {
    await supabase.auth.signOut()
    return { error: "Ce compte n'a pas accès à l'administration.", email }
  }

  redirect(safeNextPath(formData.get("next")))
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
