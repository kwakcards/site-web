import "server-only"

/*
 * Envoi des emails transactionnels par l'API de Resend (compte de l'entreprise).
 * Variables serveur : RESEND_API_KEY, EMAIL_FROM, SHOP_NOTIFICATION_EMAIL
 * (voir .env.example). Sans clé, l'email est seulement résumé dans la console.
 */

export type Email = {
  to: string
  subject: string
  text: string
  html: string
  /** Adresse utilisée quand le destinataire clique sur « Répondre ». */
  replyTo?: string
}

const DEFAULT_FROM = "Kwak & Cards <contact@kwak-and-cards.fr>"

/** Adresse de la boutique : reçoit les alertes et les réponses des clients. */
export function shopEmail(): string | null {
  return process.env.SHOP_NOTIFICATION_EMAIL || null
}

/** Envoie un email ; renvoie false en cas d'échec, sans jamais lever d'erreur. */
export async function sendEmail(email: Email): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.info(`[email] RESEND_API_KEY absente, non envoyé : « ${email.subject} »`)
    return false
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to: [email.to],
        subject: email.subject,
        text: email.text,
        html: email.html,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
    })
    if (!response.ok) {
      console.error(
        `[email] échec ${response.status} : « ${email.subject} »`,
        await response.text()
      )
      return false
    }
    return true
  } catch (error) {
    console.error(`[email] erreur réseau : « ${email.subject} »`, error)
    return false
  }
}
