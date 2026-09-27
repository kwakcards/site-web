import { cacheLife } from "next/cache"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Splash } from "@/components/brand/splash"
import { Button } from "@/components/ui/button"
import { brand } from "@/config/brand"
import { helpNav, legalNav, mainNav, type NavLink, withdrawalLink } from "@/config/navigation"

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h2 className="font-heading text-xs tracking-wider text-primary uppercase">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

async function CurrentYear() {
  "use cache"
  cacheLife("days")
  return <>{new Date().getFullYear()}</>
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col items-start gap-4">
          <Logo className="h-20" sizes="80px" />
          <p className="max-w-xs text-sm text-muted-foreground">{brand.tagline}</p>
        </div>
        <FooterColumn title="Boutique" links={mainNav} />
        <FooterColumn title="Aide" links={helpNav} />
        <FooterColumn title="Informations légales" links={legalNav} />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p className="flex items-center gap-2">
            <Splash className="size-4" />© <CurrentYear /> {brand.name}. Tous droits réservés.
          </p>
          <Button asChild variant="cta-outline" size="sm" className="self-start md:self-auto">
            <Link href={withdrawalLink.href}>{withdrawalLink.label}</Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
