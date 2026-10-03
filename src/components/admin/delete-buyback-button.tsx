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
import { deleteBuybackRequest } from "@/server/actions/buyback-admin"

/** Suppression définitive d'une demande de rachat et de ses photos, après confirmation. */
export function DeleteBuybackButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function confirm() {
    startTransition(async () => {
      const result = await deleteBuybackRequest(id)
      if (result && !result.ok) toast.error(result.message)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(value) => !pending && setOpen(value)}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon data-icon="inline-start" />
          Supprimer la demande
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la demande de {name} ?</AlertDialogTitle>
          <AlertDialogDescription>
            La demande et ses photos seront supprimées définitivement. À faire dès qu&apos;elle ne
            sert plus, et au plus tard 12 mois après le dernier échange s&apos;il n&apos;y a pas eu
            de rachat.
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
