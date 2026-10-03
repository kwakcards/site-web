"use client"

import { LoaderCircleIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { buybackStatuses } from "@/config/buyback"
import { updateBuybackRequest } from "@/server/actions/buyback-admin"

type BuybackStatusFormProps = {
  id: string
  status: string
  adminNote: string | null
}

/** Statut de la demande et note interne (jamais visible par le vendeur). */
export function BuybackStatusForm({ id, status, adminNote }: BuybackStatusFormProps) {
  const [value, setValue] = useState(status)
  const [note, setNote] = useState(adminNote ?? "")
  const [pending, startTransition] = useTransition()

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(async () => {
      const result = await updateBuybackRequest({ id, status: value, adminNote: note })
      if (result.ok) toast.success("Demande mise à jour.")
      else toast.error(result.message)
    })
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="buyback-status">Statut</Label>
        <NativeSelect
          id="buyback-status"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        >
          {buybackStatuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="buyback-note">Note interne</Label>
        <Textarea
          id="buyback-note"
          rows={4}
          maxLength={2000}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Offre faite, rendez-vous, remarques…"
        />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        {pending && <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />}
        Enregistrer
      </Button>
    </form>
  )
}
