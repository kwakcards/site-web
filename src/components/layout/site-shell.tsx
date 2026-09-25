import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { shopDefaults } from "@/config/shop"

/** Habillage des pages publiques : bandeau, header, contenu, footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar messages={shopDefaults.announcements} />
      <Header />
      <main id="contenu" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </>
  )
}
