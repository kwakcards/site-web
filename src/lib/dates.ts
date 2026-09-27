const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
]

/** « 2026-09-25 » → « 25 septembre 2026 » (sans dépendre du moteur ICU). */
export function formatDateFr(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  if (!year || !month || !day || month > 12) throw new Error(`Date invalide : ${isoDate}`)
  return `${day === 1 ? "1er" : day} ${MONTHS[month - 1]} ${year}`
}

const parisDateTime = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  dateStyle: "short",
  timeStyle: "short",
})

/** Horodatage ISO → « 27/09/2026 20:49 » (heure de Paris). Pour l'admin, rendu serveur. */
export function formatDateTimeParis(iso: string): string {
  return parisDateTime.format(new Date(iso))
}
