"use client"

import { PrinterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintButton({ label = "Imprimer" }: { label?: string }) {
  return (
    <Button type="button" variant="outline" onClick={() => window.print()} className="print:hidden">
      <PrinterIcon data-icon="inline-start" />
      {label}
    </Button>
  )
}
