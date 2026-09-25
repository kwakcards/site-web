import Image from "next/image"
import Link from "next/link"

import { brand } from "@/config/brand"
import { cn } from "@/lib/utils"

type LogoProps = {
  /** Contrôle la taille via la hauteur, ex. « h-12 ». La largeur suit le ratio. */
  className?: string
  /** Lien de destination ; `null` pour afficher le logo seul. */
  href?: string | null
  /** À activer pour le logo visible au chargement (header). */
  eager?: boolean
  /** Largeur affichée, pour que next/image choisisse la bonne résolution. */
  sizes?: string
}

export function Logo({ className, href = "/", eager = false, sizes = "64px" }: LogoProps) {
  const image = (
    <Image
      src={brand.logo.src}
      alt={brand.logo.alt}
      width={brand.logo.width}
      height={brand.logo.height}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      className={cn("h-12 w-auto select-none", className)}
    />
  )

  if (!href) return image

  return (
    <Link
      href={href}
      aria-label={`${brand.name}, accueil`}
      className="inline-flex shrink-0 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {image}
    </Link>
  )
}
