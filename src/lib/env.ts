import { z } from "zod"

/*
 * Variables d'environnement publiques (exposées au navigateur).
 * Documentation complète : .env.example
 *
 * Chaque groupe est validé au moment où il sert, avec un message explicite si
 * une variable manque. Les références à process.env.NEXT_PUBLIC_* doivent
 * rester écrites en toutes lettres pour que Next.js les injecte côté client.
 */
const raw = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
}

/**
 * URL publique du site, sans slash final. Ordre de résolution :
 * NEXT_PUBLIC_SITE_URL, puis l'URL de preview Vercel, puis localhost.
 */
export function getSiteUrl(): string {
  const url = raw.siteUrl || (raw.vercelUrl ? `https://${raw.vercelUrl}` : "http://localhost:3000")
  return z
    .url({ error: `NEXT_PUBLIC_SITE_URL invalide : « ${url} »` })
    .parse(url)
    .replace(/\/+$/, "")
}

const supabasePublicSchema = z.object({
  url: z.url({
    error: "NEXT_PUBLIC_SUPABASE_URL manquante ou invalide (voir .env.example)",
  }),
  publishableKey: z
    .string({
      error: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY manquante (voir .env.example)",
    })
    .min(1),
})

/** URL du projet Supabase et clé publique (publishable). */
export function getSupabasePublicEnv() {
  return supabasePublicSchema.parse({
    url: raw.supabaseUrl,
    publishableKey: raw.supabasePublishableKey,
  })
}
