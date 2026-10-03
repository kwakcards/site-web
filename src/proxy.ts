import type { NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

// Seules l'admin et la connexion utilisent la session : les pages publiques ne
// passent pas par le proxy, ce qui les garde rapides.
export const config = {
  matcher: ["/admin/:path*", "/connexion"],
}
