import { Fill } from "@/components/legal/fill"
import { legal } from "@/config/legal"

/** Mention relative à la TVA, selon le régime du vendeur. */
export function VatStatement() {
  const { vatExempt, vatNumber } = legal.seller
  if (vatExempt === true) return <>TVA non applicable, article 293 B du code général des impôts</>
  if (vatExempt === false) {
    return (
      <>
        Numéro de TVA intracommunautaire : <Fill value={vatNumber} label="numéro de TVA" />
      </>
    )
  }
  return <Fill value={null} label="régime de TVA" />
}

export function SellerEmail() {
  const { email } = legal.seller
  return email ? <a href={`mailto:${email}`}>{email}</a> : <Fill value={null} label="email" />
}

export function SellerPhone() {
  const { phone } = legal.seller
  if (!phone) return <Fill value={null} label="téléphone" />
  // Numéro français (« 07 69… ») composé au format international : +33 7 69…
  const href = phone.replace(/\s/g, "").replace(/^0(?=\d{9}$)/, "+33")
  return <a href={`tel:${href}`}>{phone}</a>
}

/** Identité complète du vendeur (mentions légales, CGV, contact). */
export function SellerIdentity() {
  const { seller } = legal

  return (
    <dl>
      <dt>Nom commercial</dt>
      <dd>{seller.tradeName}</dd>
      <dt>Vendeur</dt>
      <dd>
        <Fill value={seller.legalName} label="nom ou dénomination sociale" />
      </dd>
      <dt>Forme juridique</dt>
      <dd>
        <Fill value={seller.legalForm} label="forme juridique" />
      </dd>
      <dt>Adresse</dt>
      <dd>
        <Fill value={seller.address} label="adresse postale" />
      </dd>
      <dt>SIRET</dt>
      <dd>
        <Fill value={seller.siret} label="numéro SIRET" />
      </dd>
      <dt>Immatriculation</dt>
      <dd>
        <Fill value={seller.registration} label="RNE ou RCS" />
      </dd>
      <dt>TVA</dt>
      <dd>
        <VatStatement />
      </dd>
      <dt>Email</dt>
      <dd>
        <SellerEmail />
      </dd>
      <dt>Téléphone</dt>
      <dd>
        <SellerPhone />
      </dd>
    </dl>
  )
}

/** Coordonnées du médiateur de la consommation (art. R616-1 du code de la consommation). */
export function MediatorDetails() {
  const { mediator } = legal
  return (
    <ul>
      <li>
        Médiateur : <Fill value={mediator.name} label="nom du médiateur" />
      </li>
      <li>
        Site internet :{" "}
        {mediator.website ? (
          <a href={mediator.website}>{mediator.website}</a>
        ) : (
          <Fill value={null} label="site du médiateur" />
        )}
      </li>
      {mediator.complaintUrl && (
        <li>
          Saisir le médiateur en ligne :{" "}
          <a href={mediator.complaintUrl}>formulaire « Déclarer un litige »</a>
        </li>
      )}
      <li>
        Adresse postale : <Fill value={mediator.address} label="adresse du médiateur" />
      </li>
    </ul>
  )
}
