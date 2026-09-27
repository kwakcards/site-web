import { SectionHeading } from "@/components/home/section-heading"
import { ProductGrid } from "@/components/product/product-grid"
import { getLatestProducts } from "@/server/queries/catalog"

export async function LatestProducts() {
  const products = await getLatestProducts(8)
  if (products.length === 0) return null

  return (
    <section aria-labelledby="latest-title" className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
      <SectionHeading
        id="latest-title"
        eyebrow="Fraîchement arrivés"
        title="Derniers ajouts"
        link={{ href: "/boutique", label: "Tout le catalogue" }}
      />
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
