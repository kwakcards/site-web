import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { Logo } from "@/components/brand/logo"
import { AdminLink } from "@/components/layout/admin-link"
import { MobileNav } from "@/components/layout/mobile-nav"
import { NavLink } from "@/components/layout/nav-link"
import { Button } from "@/components/ui/button"
import { helpNav, mainNav } from "@/config/navigation"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 md:h-20 md:px-6">
        <MobileNav links={mainNav} secondaryLinks={helpNav} />

        <Logo eager className="h-12 md:h-16" sizes="64px" />

        <nav aria-label="Catégories" className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-2">
            {mainNav.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  className="inline-flex h-9 tactile items-center rounded-lg border-2 border-edge bg-secondary px-3 font-heading text-xs tracking-wide text-foreground uppercase outline-none [--ledge-depth:3px] hover:border-primary hover:text-primary hover:ledge-brand-deep focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                  activeClassName="border-primary bg-primary text-primary-foreground ledge-brand-deep hover:text-primary-foreground"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Suspense fallback={null}>
            <AdminLink />
          </Suspense>
          <Button asChild variant="outline" size="icon-lg">
            <Link href="/boutique#recherche" aria-label="Rechercher une carte">
              <SearchIcon className="size-5" />
            </Link>
          </Button>
          {/* Le panier arrivera avec la commande en ligne (phase 6). */}
        </div>
      </div>
    </header>
  )
}
