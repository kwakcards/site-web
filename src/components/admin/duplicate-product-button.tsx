"use client"

import { CopyIcon, LoaderCircleIcon } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { duplicateProduct } from "@/server/actions/products"

/** Crée une copie masquée du produit (sans photos) et l'ouvre pour modification. */
export function DuplicateProductButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await duplicateProduct(productId)
          if (result && !result.ok) toast.error(result.message)
        })
      }
    >
      {pending ? (
        <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      Dupliquer
    </Button>
  )
}
