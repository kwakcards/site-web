/**
 * Référentiels du catalogue. L'échelle d'état décrit ce que le client est en
 * droit d'attendre : elle sert à apprécier la conformité d'une carte à sa
 * description (garantie légale de conformité).
 */
export const cardConditions = [
  {
    code: "M",
    label: "Mint",
    description: "État parfait, comme sortie du booster : aucun défaut visible.",
  },
  {
    code: "NM",
    label: "Near Mint",
    description:
      "Quasi parfaite : défauts infimes visibles seulement à l'examen attentif (très légère usure d'un coin, par exemple).",
  },
  {
    code: "EX",
    label: "Excellent",
    description: "Légère usure visible (bords ou coins un peu blanchis), sans pliure.",
  },
  {
    code: "GD",
    label: "Good",
    description: "Usure marquée des bords et des coins, légères rayures, sans pliure importante.",
  },
  {
    code: "LP",
    label: "Light Played",
    description: "Usure nette sur l'ensemble de la carte ; une petite pliure est possible.",
  },
  {
    code: "PL",
    label: "Played",
    description: "Usure importante : pliures, marques ou rayures bien visibles.",
  },
  {
    code: "PO",
    label: "Poor",
    description: "Très abîmée : pliures marquées, déchirures ou taches.",
  },
] as const

export type CardConditionCode = (typeof cardConditions)[number]["code"]
