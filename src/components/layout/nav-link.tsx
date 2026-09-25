"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type NavLinkProps = {
  href: string
  className?: string
  activeClassName?: string
  children: React.ReactNode
}

/** Lien de navigation qui signale la page courante (aria-current). */
export function NavLink({ href, className, activeClassName, children }: NavLinkProps) {
  const pathname = usePathname()
  const target = href.split(/[?#]/)[0]
  const active = pathname === target

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(className, active && activeClassName)}
    >
      {children}
    </Link>
  )
}
