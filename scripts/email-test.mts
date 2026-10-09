/**
 * Envoie un email de test via Resend, pour vérifier la clé et le domaine.
 *
 *   node --env-file=.env.local scripts/email-test.mts destinataire@example.com
 */
const to = process.argv[2]
const apiKey = process.env.RESEND_API_KEY
const from = process.env.EMAIL_FROM ?? "Kwak & Cards <contact@kwak-and-cards.fr>"
const replyTo = process.env.SHOP_NOTIFICATION_EMAIL

if (!to) throw new Error("Indique l'adresse du destinataire en argument.")
if (!apiKey) throw new Error("RESEND_API_KEY manquante dans .env.local.")

const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    from,
    to: [to],
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject: "Test d'envoi Kwak & Cards",
    text: "Si tu lis ce message, l'envoi d'emails du site fonctionne (domaine kwak-and-cards.fr).",
    html: "<p>Si tu lis ce message, l'envoi d'emails du site <strong>Kwak &amp; Cards</strong> fonctionne (domaine kwak-and-cards.fr).</p>",
  }),
})

const result = await response.json()
if (!response.ok) {
  console.error(`Échec (${response.status}) :`, result)
  process.exit(1)
}
console.log(`Email envoyé à ${to} (id ${result.id}).`)
