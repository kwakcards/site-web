import { SearchIcon, ShoppingBagIcon } from "lucide-react"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"
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
          <ul className="flex items-center gap-1">
            {mainNav.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  className="relative rounded-md px-3 py-2 font-heading text-xs tracking-wide text-foreground/85 uppercase transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform hover:text-primary hover:after:scale-x-100 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  activeClassName="text-primary after:scale-x-100"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button asChild variant="ghost" size="icon-lg">
            <Link href="/boutique" aria-label="Rechercher une carte">
              <SearchIcon className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon-lg">
            <Link href="/panier" aria-label="Voir le panier">
              <ShoppingBagIcon className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
