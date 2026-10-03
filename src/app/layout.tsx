import type { Metadata, Viewport } from "next"

import { JsonLd } from "@/components/seo/json-ld"
import { brand } from "@/config/brand"
import { getSiteUrl } from "@/lib/env"
import { storeStructuredData } from "@/lib/structured-data"
import { cn } from "@/lib/utils"
import { fontVariables } from "@/styles/fonts"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${brand.name}, boutique de cartes à collectionner`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: brand.name,
  },
  twitter: {
    card: "summary_large_image",
  },
}

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  colorScheme: "dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={cn("dark", fontVariables)}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="sr-only tactile rounded-lg border-2 border-primary bg-primary px-4 py-3 font-heading text-sm text-primary-foreground uppercase ledge-brand-deep focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:outline-2 focus:outline-offset-2 focus:outline-cream"
        >
          Aller au contenu
        </a>
        {children}
        <JsonLd data={storeStructuredData()} />
      </body>
    </html>
  )
}
