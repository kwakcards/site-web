"use client"

import imageCompression from "browser-image-compression"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ImagePlusIcon,
  LoaderCircleIcon,
  Trash2Icon,
} from "lucide-react"
import Image from "next/image"
import { useId, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MEDIA_BUCKET, mediaUrl } from "@/lib/storage"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { MAX_PRODUCT_IMAGES, productImagePrefix } from "@/lib/validation/product"

export type EditableImage = { path: string; alt: string }

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
const MAX_SOURCE_BYTES = 25 * 1024 * 1024
const EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
}

type ImageUploaderProps = {
  productId: string
  productName: string
  initialImages: EditableImage[]
  error?: string
  /** Prévient le formulaire qu'un envoi est en cours (enregistrement bloqué). */
  onBusyChange: (busy: boolean) => void
}

/**
 * Photos d'un produit : compression dans le navigateur (WebP, 1 600 px, sans
 * métadonnées EXIF), envoi direct vers le stockage Supabase avec la session de
 * l'admin, ordre et textes alternatifs. La liste est transmise au formulaire
 * dans un champ caché ; la base n'est modifiée qu'à l'enregistrement.
 */
export function ImageUploader({
  productId,
  productName,
  initialImages,
  error,
  onBusyChange,
}: ImageUploaderProps) {
  const [items, setItems] = useState<EditableImage[]>(initialImages)
  const [pending, setPending] = useState<{ id: string; name: string }[]>([])
  const [dragging, setDragging] = useState(false)
  const activeUploads = useRef(0)
  const supabaseRef = useRef<ReturnType<typeof createClient>>(null)
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()

  const supabase = () => (supabaseRef.current ??= createClient())
  const full = items.length + pending.length >= MAX_PRODUCT_IMAGES
  // Photos déjà enregistrées en base (la liste est rafraîchie après chaque enregistrement).
  const savedPaths = new Set(initialImages.map((image) => image.path))

  async function upload(file: File): Promise<string> {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error(`« ${file.name} » : format non pris en charge (JPEG, PNG, WebP ou AVIF).`)
    }
    if (file.size > MAX_SOURCE_BYTES) throw new Error(`« ${file.name} » dépasse 25 Mo.`)

    const compressed = await imageCompression(file, {
      maxWidthOrHeight: 1600,
      maxSizeMB: 1.5,
      fileType: "image/webp",
      initialQuality: 0.85,
      // Pas de Web Worker : la bibliothèque le chargerait depuis un CDN externe.
      useWebWorker: false,
    })
    // Certains navigateurs n'encodent pas le WebP : on garde alors le format produit.
    const extension = EXTENSIONS[compressed.type]
    if (!extension) throw new Error(`« ${file.name} » : conversion impossible.`)

    const path = `${productImagePrefix(productId)}${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase()
      .storage.from(MEDIA_BUCKET)
      .upload(path, compressed, {
        contentType: compressed.type,
        cacheControl: "31536000",
        upsert: false,
      })
    if (uploadError)
      throw new Error(`« ${file.name} » : envoi impossible (${uploadError.message}).`)
    return path
  }

  async function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList)
    if (files.length === 0) return

    const room = MAX_PRODUCT_IMAGES - items.length - pending.length
    if (room <= 0) {
      toast.error(`${MAX_PRODUCT_IMAGES} photos maximum par produit.`)
      return
    }
    if (files.length > room) {
      toast.warning(
        `Seules les ${room} premières photos ont été ajoutées (${MAX_PRODUCT_IMAGES} maximum).`
      )
    }

    const jobs = files.slice(0, room).map((file) => ({ id: crypto.randomUUID(), file }))
    setPending((list) => [...list, ...jobs.map((job) => ({ id: job.id, name: job.file.name }))])
    activeUploads.current += jobs.length
    onBusyChange(true)

    await Promise.all(
      jobs.map(async ({ id, file }) => {
        try {
          const path = await upload(file)
          setItems((list) => [...list, { path, alt: "" }])
        } catch (uploadError) {
          toast.error(
            uploadError instanceof Error ? uploadError.message : `Échec de l'envoi de ${file.name}.`
          )
        } finally {
          setPending((list) => list.filter((item) => item.id !== id))
          activeUploads.current -= 1
          if (activeUploads.current === 0) onBusyChange(false)
        }
      })
    )
  }

  function move(index: number, delta: -1 | 1) {
    setItems((list) => {
      const target = index + delta
      if (target < 0 || target >= list.length) return list
      const next = [...list]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function remove(index: number) {
    const item = items[index]
    setItems((list) => list.filter((_, position) => position !== index))
    // Photo envoyée mais jamais enregistrée : le fichier est supprimé tout de suite.
    // Les photos déjà enregistrées ne disparaissent qu'à l'enregistrement du produit.
    if (item && !savedPaths.has(item.path)) {
      void supabase().storage.from(MEDIA_BUCKET).remove([item.path])
    }
  }

  function updateAlt(index: number, alt: string) {
    setItems((list) => list.map((item, position) => (position === index ? { ...item, alt } : item)))
  }

  const removedSaved = initialImages.filter(
    (image) => !items.some((item) => item.path === image.path)
  ).length

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="images" value={JSON.stringify(items)} />

      <p id={hintId} className="text-xs text-muted-foreground">
        JPEG, PNG, WebP ou AVIF, {MAX_PRODUCT_IMAGES} photos maximum. Elles sont redimensionnées et
        converties avant l&apos;envoi. La première est la photo principale. Décris chaque photo en
        quelques mots : ce texte est lu aux personnes aveugles et aux moteurs de recherche.
      </p>

      {items.length > 0 && (
        <ol className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={item.path}
              className={cn(
                "flex gap-3 rounded-xl border bg-background p-3",
                index === 0 ? "border-primary/60" : "border-border"
              )}
            >
              <div className="relative aspect-[63/88] w-20 shrink-0 overflow-hidden rounded-md bg-card">
                <Image
                  src={mediaUrl(item.path)}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium">
                    {index === 0 ? "Photo principale" : `Photo ${index + 1}`}
                    {!savedPaths.has(item.path) && (
                      <span className="text-muted-foreground"> · non enregistrée</span>
                    )}
                  </span>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Placer la photo ${index + 1} avant`}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label={`Placer la photo ${index + 1} après`}
                    >
                      <ArrowDownIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      aria-label={`Retirer la photo ${index + 1}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
                <label
                  htmlFor={`${inputId}-alt-${index}`}
                  className="text-xs text-muted-foreground"
                >
                  Description de la photo
                </label>
                <Input
                  id={`${inputId}-alt-${index}`}
                  value={item.alt}
                  onChange={(event) => updateAlt(index, event.target.value)}
                  placeholder={`${productName || "Nom de la carte"}, ${["recto", "verso"][index] ?? "détail"}`}
                  maxLength={200}
                  className="h-9"
                />
              </div>
            </li>
          ))}
        </ol>
      )}

      {pending.length > 0 && (
        <ul aria-live="polite" className="flex flex-col gap-1 text-sm text-muted-foreground">
          {pending.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <LoaderCircleIcon
                aria-hidden="true"
                className="size-4 animate-spin motion-reduce:animate-none"
              />
              Envoi de « {item.name} »…
            </li>
          ))}
        </ul>
      )}

      {removedSaved > 0 && (
        <p className="text-xs text-muted-foreground">
          {removedSaved === 1
            ? "1 photo retirée sera supprimée"
            : `${removedSaved} photos retirées seront supprimées`}{" "}
          à l&apos;enregistrement.
        </p>
      )}

      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault()
          if (!full) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (!full) void addFiles(event.dataTransfer.files)
        }}
        className={cn(
          "flex flex-col items-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
          full
            ? "cursor-not-allowed border-border opacity-60"
            : "cursor-pointer border-input hover:border-primary",
          dragging && "border-primary bg-primary/5"
        )}
      >
        <ImagePlusIcon aria-hidden="true" className="size-7 text-primary" />
        <span className="font-heading text-sm uppercase">Ajouter des photos</span>
        <span className="text-xs text-muted-foreground">
          {full ? "Nombre maximal de photos atteint" : "Clique ou glisse tes fichiers ici"}
        </span>
        <input
          id={inputId}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          disabled={full}
          aria-describedby={[hintId, error ? errorId : null].filter(Boolean).join(" ")}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) void addFiles(event.target.files)
            event.target.value = ""
          }}
        />
      </label>

      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
