import { getSupabasePublicEnv } from "@/lib/env"

/** Bucket public des photos (produits, bannières…). */
export const MEDIA_BUCKET = "media"

/** URL publique d'un fichier du bucket « media ». */
export function mediaUrl(path: string): string {
  const { url } = getSupabasePublicEnv()
  const encoded = path.split("/").map(encodeURIComponent).join("/")
  return `${url}/storage/v1/object/public/${MEDIA_BUCKET}/${encoded}`
}
