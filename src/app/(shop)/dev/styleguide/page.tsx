import type { Metadata } from "next"
import { ArrowRightIcon, ShoppingBagIcon } from "lucide-react"
import { notFound } from "next/navigation"

import { CardTrio } from "@/components/brand/card-trio"
import { Logo } from "@/components/brand/logo"
import { Splash } from "@/components/brand/splash"
import { PriceTag } from "@/components/product/price-tag"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeCheckbox } from "@/components/ui/native-checkbox"
import { NativeSelect } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false },
}

const swatches = [
  { token: "--brand-black", usage: "Fond" },
  { token: "--brand-ink", usage: "Surfaces" },
  { token: "--brand-ink-raised", usage: "Surfaces surélevées" },
  { token: "--brand-line", usage: "Bordures" },
  { token: "--brand-yellow", usage: "Accent principal" },
  { token: "--brand-yellow-light", usage: "Survols" },
  { token: "--brand-yellow-deep", usage: "Dégradés, relief jaune" },
  { token: "--brand-edge", usage: "Contour et relief sombres" },
  { token: "--brand-cream", usage: "Texte" },
  { token: "--brand-muted", usage: "Texte secondaire" },
  { token: "--brand-danger", usage: "Erreurs" },
  { token: "--brand-danger-deep", usage: "Relief destructif" },
  { token: "--brand-success", usage: "Succès" },
]

const demoProducts = [
  {
    name: "Dracaufeu ex, illustration spéciale",
    subtitle: "Flammes Obsidiennes · FR · Near Mint",
    priceCents: 8990,
    stock: 1,
    isNew: true,
  },
  {
    name: "Display 36 boosters, Évolutions Prismatiques",
    subtitle: "Scellé · FR",
    priceCents: 21990,
    compareAtPriceCents: 24990,
    stock: 4,
  },
  {
    name: "Pikachu illustrator, PSA 9",
    subtitle: "Gradée · PSA 9",
    priceCents: 45000,
    stock: 0,
  },
  {
    name: "Sleeves Dragon Shield Matte, jaune (x100)",
    subtitle: "Accessoires",
    priceCents: 1190,
    stock: 12,
    fromPrice: true,
  },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-10">
      <h2 className="font-heading text-sm tracking-widest text-primary uppercase">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/** Page de validation de la direction artistique (développement uniquement). */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <h1 className="text-brand-gradient font-display text-5xl">Styleguide</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Aperçu des tokens d&apos;identité (src/styles/theme.css), des typographies
        (src/styles/fonts.ts) et des composants de base.
      </p>

      <Section title="Couleurs">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {swatches.map((swatch) => (
            <li
              key={swatch.token}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="h-20" style={{ background: `var(${swatch.token})` }} />
              <div className="p-3">
                <p className="font-mono text-xs">{swatch.token}</p>
                <p className="text-xs text-muted-foreground">{swatch.usage}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Typographies">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground">
              font-display : Knewave (rappel « KWAK »)
            </p>
            <p className="font-display text-5xl text-primary">Derniers ajouts</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              font-heading : Archivo Black (rappel « CARDS »)
            </p>
            <p className="font-heading text-3xl uppercase">Cartes gradées</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">font-sans : Inter (corps de texte)</p>
            <p className="max-w-2xl">
              Chaque carte est photographiée recto verso et décrite avec son état réel. Les produits
              scellés sont expédiés dans une protection renforcée.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Boutons">
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          Tous les éléments interactifs reprennent le relief du bouton « Rechercher une carte » :
          bordure épaisse, bord inférieur plein qui s&apos;enfonce au clic (utilitaires{" "}
          <code>tactile</code>, <code>tactile-field</code> et <code>ledge-*</code> dans
          globals.css). Pas de lueur : le survol passe le contour et le relief en jaune.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="cta" size="lg">
            Voir le catalogue
          </Button>
          <Button variant="cta-outline" size="lg">
            Nous contacter
          </Button>
          <Button>
            <ShoppingBagIcon data-icon="inline-start" /> Ajouter au panier
          </Button>
          <Button variant="outline">
            Filtrer <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="destructive">Supprimer</Button>
          <Button variant="outline" size="icon" aria-label="Panier">
            <ShoppingBagIcon />
          </Button>
          <Button disabled>Indisponible</Button>
        </div>
      </Section>

      <Section title="Prix">
        <div className="flex flex-wrap items-end gap-10">
          <PriceTag priceCents={8990} size="lg" />
          <PriceTag priceCents={21990} compareAtPriceCents={24990} size="md" />
          <PriceTag priceCents={1190} fromPrice size="sm" />
        </div>
      </Section>

      <Section title="Cartes produit">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {demoProducts.map((product) => (
            <ProductCard key={product.name} href="/dev/styleguide" {...product} />
          ))}
        </div>
      </Section>

      <Section title="Formulaire">
        <form className="flex max-w-md flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="styleguide-email">Adresse email</Label>
            <div className="flex gap-2">
              <Input id="styleguide-email" type="email" placeholder="toi@exemple.fr" />
              <Button type="button">S&apos;inscrire</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="styleguide-langue">Langue</Label>
            <NativeSelect id="styleguide-langue" defaultValue="FR">
              <option value="FR">Français</option>
              <option value="EN">Anglais</option>
            </NativeSelect>
          </div>
          <div className="flex items-center gap-3">
            <NativeCheckbox id="styleguide-stock" defaultChecked />
            <Label htmlFor="styleguide-stock">En stock uniquement</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="styleguide-visible" defaultChecked />
            <Label htmlFor="styleguide-visible">Visible sur la boutique</Label>
          </div>
        </form>
      </Section>

      <Section title="Logo et motifs">
        <div className="flex flex-wrap items-center gap-10">
          <Logo href={null} className="h-40" sizes="160px" />
          <Logo href={null} className="h-16" />
          <Splash className="w-28" />
          <Splash className="w-28" outlined />
          <CardTrio className="w-40" />
        </div>
      </Section>
    </div>
  )
}
