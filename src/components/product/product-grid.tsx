import { ProductCard } from "@/components/product/product-card"
import type { CatalogProduct } from "@/server/queries/catalog"

type ProductGridProps = {
  products: CatalogProduct[]
  /** Nombre de colonnes sur grand écran. */
  columns?: 4 | 5
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  return (
    <ul
      className={
        columns === 5
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5"
          : "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
      }
    >
      {products.map((product) => (
        <li key={product.id} className="flex">
          <ProductCard
            className="w-full"
            href={`/produit/${product.slug}`}
            name={product.name}
            subtitle={product.subtitle}
            imageUrl={product.imageUrl}
            imageAlt={product.imageAlt}
            priceCents={product.priceCents}
            compareAtPriceCents={product.compareAtPriceCents}
            stock={product.stock}
            isNew={product.isNew}
          />
        </li>
      ))}
    </ul>
  )
}
