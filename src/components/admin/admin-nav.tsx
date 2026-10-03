"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const links = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/produits", label: "Produits", exact: false },
  { href: "/admin/rachats", label: "Rachats", exact: false },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Administration">
      <ul className="flex gap-2">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 tactile items-center rounded-lg border-2 px-3 font-heading text-xs tracking-wide uppercase outline-none [--ledge-depth:3px] focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "border-primary bg-primary text-primary-foreground ledge-brand-deep"
                    : "border-edge bg-secondary hover:border-primary hover:text-primary hover:ledge-brand-deep"
                )}
              >
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
