"use client"

import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"
import { setProductVisibility } from "@/server/actions/products"

/** Interrupteur « visible sur la boutique » de la liste des produits. */
export function VisibilityToggle({
  productId,
  productName,
  visible,
}: {
  productId: string
  productName: string
  visible: boolean
}) {
  const [optimisticVisible, setOptimisticVisible] = useOptimistic(visible)
  const [pending, startTransition] = useTransition()

  return (
    <Switch
      checked={optimisticVisible}
      disabled={pending}
      aria-label={`${productName} : visible sur la boutique`}
      onCheckedChange={(checked) =>
        startTransition(async () => {
          setOptimisticVisible(checked)
          const result = await setProductVisibility(productId, checked)
          if (!result.ok) toast.error(result.message)
          else
            toast.success(
              checked ? `« ${productName} » est en ligne.` : `« ${productName} » est masqué.`
            )
        })
      }
    />
  )
}
