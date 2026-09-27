"use client"

import { LoaderCircleIcon, Trash2Icon } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/server/actions/products"

type DeleteProductButtonProps = {
  productId: string
  productName: string
  /** Page à ouvrir après la suppression (depuis la fiche du produit). */
  redirectTo?: "/admin/produits"
  compact?: boolean
}

/** Suppression définitive d'un produit et de ses photos, après confirmation. */
export function DeleteProductButton({
  productId,
  productName,
  redirectTo,
  compact = false,
}: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function confirm() {
    startTransition(async () => {
      const result = await deleteProduct(productId, redirectTo ? { redirectTo } : {})
      if (result && !result.ok) {
        toast.error(result.message)
        return
      }
      setOpen(false)
      if (!redirectTo) toast.success(`« ${productName} » a été supprimé.`)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(value) => !pending && setOpen(value)}>
      <AlertDialogTrigger asChild>
        {compact ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Supprimer ${productName}`}
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        ) : (
          <Button variant="destructive">
            <Trash2Icon data-icon="inline-start" />
            Supprimer le produit
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer « {productName} » ?</AlertDialogTitle>
          <AlertDialogDescription>
            Le produit et toutes ses photos seront supprimés définitivement. Pour le retirer de la
            boutique sans le perdre, décoche plutôt « Visible sur la boutique ».
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Annuler</AlertDialogCancel>
          <Button variant="destructive" onClick={confirm} disabled={pending}>
            {pending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
            {pending ? "Suppression…" : "Supprimer définitivement"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
