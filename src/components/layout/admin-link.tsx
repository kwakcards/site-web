import { LayoutDashboardIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getAdmin } from "@/lib/auth"

/**
 * Lien vers l'espace d'administration, affiché uniquement quand le compte
 * propriétaire est connecté. Lit la session : à placer dans un <Suspense>.
 */
export async function AdminLink() {
  const admin = await getAdmin()
  if (!admin) return null

  return (
    <Button asChild variant="cta-outline" size="sm" className="h-9">
      <Link href="/admin">
        <LayoutDashboardIcon data-icon="inline-start" />
        Admin
      </Link>
    </Button>
  )
}
