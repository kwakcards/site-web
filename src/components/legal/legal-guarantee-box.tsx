/**
 * Encadré obligatoire sur les garanties légales, reproduit à l'identique du
 * modèle A annexé à l'article D. 211-2 du code de la consommation (décret
 * n° 2022-946 du 29 juin 2022). Ne pas reformuler ce texte.
 */
export function LegalGuaranteeBox() {
  return (
    <div className="not-prose my-6 rounded-xl border-2 border-primary/70 bg-card p-5 text-sm leading-relaxed text-foreground md:p-6">
      <p className="font-heading text-xs tracking-wider text-primary uppercase">
        Garanties légales : encadré réglementaire (article D. 211-2 du code de la consommation)
      </p>
      <div className="mt-4 space-y-3">
        <p>
          Le consommateur dispose d&apos;un délai de deux ans à compter de la délivrance du bien
          pour obtenir la mise en œuvre de la garantie légale de conformité en cas d&apos;apparition
          d&apos;un défaut de conformité. Durant ce délai, le consommateur n&apos;est tenu
          d&apos;établir que l&apos;existence du défaut de conformité et non la date
          d&apos;apparition de celui-ci.
        </p>
        <p>
          Lorsque le contrat de vente du bien prévoit la fourniture d&apos;un contenu numérique ou
          d&apos;un service numérique de manière continue pendant une durée supérieure à deux ans,
          la garantie légale est applicable à ce contenu numérique ou ce service numérique tout au
          long de la période de fourniture prévue. Durant ce délai, le consommateur n&apos;est tenu
          d&apos;établir que l&apos;existence du défaut de conformité affectant le contenu numérique
          ou le service numérique et non la date d&apos;apparition de celui-ci.
        </p>
        <p>
          La garantie légale de conformité emporte obligation pour le professionnel, le cas échéant,
          de fournir toutes les mises à jour nécessaires au maintien de la conformité du bien.
        </p>
        <p>
          La garantie légale de conformité donne au consommateur droit à la réparation ou au
          remplacement du bien dans un délai de trente jours suivant sa demande, sans frais et sans
          inconvénient majeur pour lui.
        </p>
        <p>
          Si le bien est réparé dans le cadre de la garantie légale de conformité, le consommateur
          bénéficie d&apos;une extension de six mois de la garantie initiale.
        </p>
        <p>
          Si le consommateur demande la réparation du bien, mais que le vendeur impose le
          remplacement, la garantie légale de conformité est renouvelée pour une période de deux ans
          à compter de la date de remplacement du bien.
        </p>
        <p>
          Le consommateur peut obtenir une réduction du prix d&apos;achat en conservant le bien ou
          mettre fin au contrat en se faisant rembourser intégralement contre restitution du bien,
          si :
        </p>
        <ol className="list-none space-y-1 pl-4">
          <li>1° Le professionnel refuse de réparer ou de remplacer le bien ;</li>
          <li>
            2° La réparation ou le remplacement du bien intervient après un délai de trente jours ;
          </li>
          <li>
            3° La réparation ou le remplacement du bien occasionne un inconvénient majeur pour le
            consommateur, notamment lorsque le consommateur supporte définitivement les frais de
            reprise ou d&apos;enlèvement du bien non conforme, ou s&apos;il supporte les frais
            d&apos;installation du bien réparé ou de remplacement ;
          </li>
          <li>
            4° La non-conformité du bien persiste en dépit de la tentative de mise en conformité du
            vendeur restée infructueuse.
          </li>
        </ol>
        <p>
          Le consommateur a également droit à une réduction du prix du bien ou à la résolution du
          contrat lorsque le défaut de conformité est si grave qu&apos;il justifie que la réduction
          du prix ou la résolution du contrat soit immédiate. Le consommateur n&apos;est alors pas
          tenu de demander la réparation ou le remplacement du bien au préalable.
        </p>
        <p>
          Le consommateur n&apos;a pas droit à la résolution de la vente si le défaut de conformité
          est mineur.
        </p>
        <p>
          Toute période d&apos;immobilisation du bien en vue de sa réparation ou de son remplacement
          suspend la garantie qui restait à courir jusqu&apos;à la délivrance du bien remis en état.
        </p>
        <p>
          Les droits mentionnés ci-dessus résultent de l&apos;application des articles L. 217-1 à L.
          217-32 du code de la consommation.
        </p>
        <p>
          Le vendeur qui fait obstacle de mauvaise foi à la mise en œuvre de la garantie légale de
          conformité encourt une amende civile d&apos;un montant maximal de 300 000 euros, qui peut
          être porté jusqu&apos;à 10 % du chiffre d&apos;affaires moyen annuel (article L. 241-5 du
          code de la consommation).
        </p>
        <p>
          Le consommateur bénéficie également de la garantie légale des vices cachés en application
          des articles 1641 à 1649 du code civil, pendant une durée de deux ans à compter de la
          découverte du défaut. Cette garantie donne droit à une réduction de prix si le bien est
          conservé ou à un remboursement intégral contre restitution du bien.
        </p>
      </div>
    </div>
  )
}
