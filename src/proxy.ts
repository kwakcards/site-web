import type { NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    // Toutes les pages, sauf les fichiers statiques, les images et les fichiers pour robots.
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image|robots.txt|sitemap.xml|llms.txt|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
}
