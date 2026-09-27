import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { LoginForm } from "@/components/auth/login-form"
import { Skeleton } from "@/components/ui/skeleton"
import { getAdmin } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
}

export default function LoginPage({ searchParams }: PageProps<"/connexion">) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 md:py-20">
      <h1 className="font-display text-4xl">Connexion</h1>
      <p className="mt-2 text-muted-foreground">Espace réservé à l&apos;équipe de la boutique.</p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <Suspense fallback={<LoginSkeleton />}>
          <Login searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

async function Login({ searchParams }: Pick<PageProps<"/connexion">, "searchParams">) {
  const { next } = await searchParams
  const target = typeof next === "string" && next.startsWith("/admin") ? next : "/admin"
  if (await getAdmin()) redirect(target)
  return <LoginForm next={target} />
}

function LoginSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}
