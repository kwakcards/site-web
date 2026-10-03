"use client"

import { HandCoinsIcon, MenuIcon, SparklesIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { NavLink } from "@/config/navigation"
import { categoryImage, categorySlugFromHref } from "@/lib/category-image"
import { cn } from "@/lib/utils"

const icons = { new: SparklesIcon, buyback: HandCoinsIcon }

/** Vignette du menu : illustration de la catégorie, sinon pictogramme. */
function LinkVisual({ link }: { link: NavLink }) {
  const slug = categorySlugFromHref(link.href)
  const image = slug ? categoryImage(slug) : null
  if (image) {
    return (
      <Image
        src={image}
        alt=""
        width={48}
        height={36}
        sizes="48px"
        className="h-9 w-12 shrink-0 rounded-md object-cover"
      />
    )
  }
  const Icon = link.icon ? icons[link.icon] : null
  return (
    <span className="grid h-9 w-12 shrink-0 place-items-center rounded-md bg-background text-primary">
      {Icon && <Icon aria-hidden="true" className="size-5" />}
    </span>
  )
}

type MobileNavProps = {
  links: NavLink[]
  secondaryLinks: NavLink[]
}

export function MobileNav({ links, secondaryLinks }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon-lg" className="xl:hidden" aria-label="Ouvrir le menu">
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] max-w-sm gap-0 border-border bg-background">
        <SheetHeader className="flex-row items-center gap-3 border-b border-border">
          <Logo href={null} className="h-12" />
          <div>
            <SheetTitle className="font-heading text-sm uppercase">Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Catégories et pages de la boutique
            </SheetDescription>
          </div>
        </SheetHeader>
        <nav aria-label="Menu principal" className="flex flex-1 flex-col overflow-y-auto p-4">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex min-h-14 tactile items-center gap-3 rounded-lg border-2 py-2 pr-4 pl-2 font-heading text-sm tracking-wide uppercase outline-none hover:border-primary hover:text-primary hover:ledge-brand-deep focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                      link.highlight
                        ? "border-primary bg-background text-primary ledge-brand-deep"
                        : "border-edge bg-secondary"
                    )}
                  >
                    <LinkVisual link={link} />
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
          <Separator className="my-5" />
          <ul className="flex flex-col gap-2.5">
            {secondaryLinks.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="flex min-h-10 tactile items-center rounded-lg border-2 border-edge bg-card px-4 py-2 font-heading text-xs tracking-wide text-muted-foreground uppercase outline-none [--ledge-depth:3px] hover:border-primary hover:text-primary hover:ledge-brand-deep focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
