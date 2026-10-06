"use client"

import { SpeedInsights as VercelSpeedInsights } from "@vercel/speed-insights/next"

import { filterPerformanceEvent } from "@/lib/performance-events"

/**
 * Mesure anonyme de la vitesse des pages (Web Vitals) par Vercel Speed Insights :
 * aucun cookie, aucun identifiant, statistiques réservées à l'éditeur du site. Cette
 * mesure de performance est dispensée de consentement (CNIL) et décrite dans /cookies.
 */
export function SpeedInsights() {
  return <VercelSpeedInsights beforeSend={filterPerformanceEvent} />
}
