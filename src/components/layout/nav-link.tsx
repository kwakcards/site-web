"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense } from "react"

import { cn } from "@/lib/utils"

type NavLinkProps = {
  href: string
  className?: string
  activeClassName?: string
  children: React.ReactNode
}

/**
 * Lien de navigation qui signale la page courante (aria-current). Sur une page
 * dont l'adresse n'est connue qu'à la requête (fiche produit, catalogue filtré),
 * le lien simple est affiché d'abord, puis l'état actif arrive avec la page.
 */
export function NavLink(props: NavLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={props.href} className={props.className}>
          {props.children}
        </Link>
      }
    >
      <ActiveNavLink {...props} />
    </Suspense>
  )
}

function ActiveNavLink({ href, className, activeClassName, children }: NavLinkProps) {
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
