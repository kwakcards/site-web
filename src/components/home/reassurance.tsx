import { MessageCircleIcon, ShieldCheckIcon, TruckIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const items = [
  {
    icon: TruckIcon,
    title: "Envoi protégé et suivi",
    text: "Chaque commande part dans un emballage renforcé, avec un numéro de suivi.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Produits authentiques",
    text: "Chaque carte est photographiée et son état décrit selon une échelle claire.",
  },
  {
    icon: MessageCircleIcon,
    title: "Une question ?",
    text: "Écris-nous : on te répond rapidement.",
    link: { href: "/contact", label: "Nous contacter" },
  },
]

export function Reassurance() {
  return (
    <section aria-label="Nos engagements" className="border-y border-border bg-card">
      <ul className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 md:px-6">
        {items.map((item) => (
          <li key={item.title} className="flex gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <item.icon className="size-6" />
            </span>
            <div>
              <h2 className="font-heading text-sm uppercase">{item.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              {item.link && (
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href={item.link.href}>{item.link.label}</Link>
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
