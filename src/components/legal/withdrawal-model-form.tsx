import { Fill } from "@/components/legal/fill"
import { legal } from "@/config/legal"

/**
 * Modèle de formulaire de rétractation (annexe à l'article R. 221-1 du code de
 * la consommation), complété avec les coordonnées du vendeur comme le prévoit
 * le modèle. Le texte réglementaire n'est pas reformulé.
 */
export function WithdrawalModelForm() {
  const { seller } = legal

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed md:p-6">
      <p className="font-heading text-sm tracking-wide uppercase">
        Modèle de formulaire de rétractation
      </p>
      <p className="mt-2 text-muted-foreground">
        (Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous
        rétracter du contrat.)
      </p>
      <div className="mt-4 space-y-3">
        <p>
          À l&apos;attention de <Fill value={seller.legalName} label="nom du vendeur" /> (
          {seller.tradeName}), <Fill value={seller.address} label="adresse postale" />,{" "}
          <Fill value={seller.email} label="adresse email" /> :
        </p>
        <p>
          Je/nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du
          contrat portant sur la vente du bien (*)/pour la prestation de services (*) ci-dessous :
        </p>
        <p>Commandé le (*)/reçu le (*) :</p>
        <p>Nom du (des) consommateur(s) :</p>
        <p>Adresse du (des) consommateur(s) :</p>
        <p>
          Signature du (des) consommateur(s) (uniquement en cas de notification du présent
          formulaire sur papier) :
        </p>
        <p>Date :</p>
        <p className="text-muted-foreground">(*) Rayez la mention inutile.</p>
      </div>
    </div>
  )
}
