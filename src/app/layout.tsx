import type { Metadata, Viewport } from "next"

import { Toaster } from "@/components/ui/sonner"
import { brand } from "@/config/brand"
import { getSiteUrl } from "@/lib/env"
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
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
