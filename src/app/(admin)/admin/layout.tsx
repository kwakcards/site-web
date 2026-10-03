import { LogOutIcon, StoreIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { brand } from "@/config/brand"
import { requireAdmin } from "@/lib/auth"
import { signOut } from "@/server/actions/auth"

// L'admin dépend de la session : il est rendu à chaque requête, jamais pré-rendu.
export const instant = false

export const metadata: Metadata = {
  title: { default: "Administration", template: `%s · Admin ${brand.name}` },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-6">
          <Link href="/admin" className="font-heading text-sm tracking-wide uppercase">
            {brand.name} <span className="text-primary">· Admin</span>
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground lg:inline">{admin.email}</span>
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <StoreIcon data-icon="inline-start" />
                Voir la boutique
              </Link>
            </Button>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                <LogOutIcon data-icon="inline-start" />
                Se déconnecter
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main id="contenu" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6">
        {children}
      </main>
      <Toaster position="top-center" />
    </div>
  )
}
