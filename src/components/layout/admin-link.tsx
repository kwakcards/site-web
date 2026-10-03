"use client"

import { LayoutDashboardIcon } from "lucide-react"
import Link from "next/link"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"

/** Cookie de session Supabase : sb-<projet>-auth-token, parfois découpé en .0, .1… */
const SESSION_COOKIE = /(?:^|;\s*)sb-[^=]+-auth-token(?:\.\d+)?=/

const subscribe = () => () => {}
const hasSession = () => SESSION_COOKIE.test(document.cookie)
const noSessionOnServer = () => false

/**
 * Lien « Admin » affiché quand une session est ouverte dans ce navigateur. La
 * détection se fait dans le navigateur : les pages publiques restent statiques et
 * rapides. L'accès à /admin reste vérifié côté serveur.
 */
export function AdminLink() {
  const visible = useSyncExternalStore(subscribe, hasSession, noSessionOnServer)
  if (!visible) return null

  return (
    <Button asChild variant="cta-outline" size="sm" className="h-9">
      <Link href="/admin">
        <LayoutDashboardIcon data-icon="inline-start" />
        Admin
      </Link>
    </Button>
  )
}
