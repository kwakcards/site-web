import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { getSupabasePublicEnv } from "@/lib/env"

/**
 * Rafraîchit la session Supabase à chaque requête et redirige vers la page de
 * connexion une visite de l'admin sans session. Le contrôle du rôle admin est
 * fait côté serveur (layout de l'admin et chaque Server Action).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, publishableKey } = getSupabasePublicEnv()

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
      },
    },
  })

  // Rien entre createServerClient et getClaims (recommandation Supabase).
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims && request.nextUrl.pathname.startsWith("/admin")) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/connexion"
    loginUrl.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`
    return NextResponse.redirect(loginUrl)
  }

  return response
}
