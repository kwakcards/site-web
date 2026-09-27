import { PackageCheckIcon, RotateCcwIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { SectionHeading } from "@/components/home/section-heading"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { PriceTag } from "@/components/product/price-tag"
import { ProductBadges } from "@/components/product/product-badges"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductSpecs } from "@/components/product/product-specs"
import { StockStatus } from "@/components/product/stock-status"
import { JsonLd } from "@/components/seo/json-ld"
import { Skeleton } from "@/components/ui/skeleton"
import { brand } from "@/config/brand"
import { shopDefaults } from "@/config/shop"
import { formatPrice } from "@/lib/money"
import { productStructuredData } from "@/lib/structured-data"
import { getProductBySlug, getRelatedProducts } from "@/server/queries/catalog"

type Props = PageProps<"/produit/[slug]">

function metaDescription(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim()
  return flat.length > 160 ? `${flat.slice(0, 157).trimEnd()}…` : flat
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Produit introuvable", robots: { index: false } }

  const description = metaDescription(
    product.description ||
      `${product.name}${product.subtitle ? ` (${product.subtitle})` : ""} à ${formatPrice(product.price_cents)} chez ${brand.name}.`
  )
  const image = product.images[0]

  return {
    title: product.name,
    description,
    alternates: { canonical: `/produit/${product.slug}` },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: brand.name,
      title: product.name,
      description,
      url: `/produit/${product.slug}`,
      ...(image ? { images: [{ url: image.url, alt: image.alt }] } : {}),
    },
  }
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </div>
  )
}

async function ProductContent({ params }: Pick<Props, "params">) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const { flatRateCents, freeShippingThresholdCents } = shopDefaults.shipping

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/boutique" },
          ...(product.category
            ? [{ label: product.category.name, href: `/boutique/${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="mx-auto w-full max-w-sm md:sticky md:top-24 md:max-w-none md:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <ProductBadges
              stock={product.stock}
              priceCents={product.price_cents}
              compareAtPriceCents={product.compare_at_price_cents}
              isNew={product.isNew}
            />
            {product.subtitle && (
              <p className="mt-3 text-sm text-muted-foreground">{product.subtitle}</p>
            )}
            <h1 className="mt-1 font-display text-3xl leading-tight md:text-4xl">{product.name}</h1>
          </div>

          <div className="flex flex-col gap-2">
            <PriceTag
              priceCents={product.price_cents}
              compareAtPriceCents={product.compare_at_price_cents}
              size="lg"
            />
            {product.compare_at_price_cents != null &&
              product.compare_at_price_cents > product.price_cents && (
                <p className="text-xs text-muted-foreground">
                  Prix barré : prix le plus bas pratiqué sur ce produit au cours des 30 jours
                  précédant la réduction.
                </p>
              )}
            <StockStatus stock={product.stock} />
          </div>

          {/* Le bouton « Ajouter au panier » arrivera avec la commande en ligne (phase 6). */}
          {!shopDefaults.onlineOrdering && (
            <div className="rounded-xl border border-primary/40 bg-card p-4 text-sm">
              <p className="font-heading text-xs tracking-wide text-primary uppercase">
                Commande en ligne bientôt disponible
              </p>
              <p className="mt-2 text-muted-foreground">
                Cet article t&apos;intéresse ?{" "}
                <Link href="/contact" className="text-primary underline underline-offset-4">
                  Écris-nous
                </Link>{" "}
                en indiquant son nom : on te répond rapidement.
              </p>
            </div>
          )}

          {product.description && (
            <section aria-labelledby="description-title">
              <h2 id="description-title" className="font-heading text-sm uppercase">
                Description
              </h2>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {product.description}
              </p>
            </section>
          )}

          <section aria-labelledby="specs-title">
            <h2 id="specs-title" className="font-heading text-sm uppercase">
              Caractéristiques
            </h2>
            <div className="mt-2">
              <ProductSpecs product={product} />
            </div>
          </section>

          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <PackageCheckIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
              <span>
                Envoi suivi et protégé : {formatPrice(flatRateCents)}
                {freeShippingThresholdCents != null &&
                  `, offert dès ${formatPrice(freeShippingThresholdCents, { compact: true })} d'achat`}
                .
              </span>
            </li>
            <li className="flex gap-3">
              <RotateCcwIcon aria-hidden="true" className="size-5 shrink-0 text-primary" />
              <span>
                14 jours pour changer d&apos;avis :{" "}
                <Link
                  href="/politique-de-remboursement"
                  className="text-primary underline underline-offset-4"
                >
                  livraison, retours et remboursements
                </Link>
                .
              </span>
            </li>
          </ul>
        </div>
      </div>

      {product.category_id && (
        <RelatedProducts categoryId={product.category_id} productId={product.id} />
      )}

      <JsonLd data={productStructuredData(product)} />
    </>
  )
}

async function RelatedProducts({
  categoryId,
  productId,
}: {
  categoryId: string
  productId: string
}) {
  const products = await getRelatedProducts(categoryId, productId, 4)
  if (products.length === 0) return null

  return (
    <section aria-labelledby="related-title" className="mt-16">
      <SectionHeading id="related-title" eyebrow="Dans la même catégorie" title="À voir aussi" />
      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </section>
  )
}

function ProductSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Chargement du produit…
      </p>
      <div aria-hidden="true">
        <Skeleton className="h-4 w-64" />
        <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-14">
          <Skeleton className="aspect-[63/88] w-full rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
