import { Archivo_Black, Inter, Knewave } from "next/font/google"

// Typographies de la marque. Pour en changer, remplacer les polices ici : les
// variables CSS (--nf-*) sont reprises par src/styles/theme.css.

/** Corps de texte : lisible (paragraphes, formulaires, tableaux). */
const body = Inter({
  subsets: ["latin"],
  variable: "--nf-body",
  display: "swap",
})

/** Titres de section, navigation, prix : sans-serif très grasse (rappel « CARDS »). */
const heading = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--nf-heading",
  display: "swap",
})

/** Titres forts façon pinceau (rappel « KWAK »). */
const display = Knewave({
  subsets: ["latin"],
  weight: "400",
  variable: "--nf-display",
  display: "swap",
})

export const fontVariables = [body.variable, heading.variable, display.variable].join(" ")
