import { ReactNode } from "react"

export interface PrintHeroProps {
  className?: string
  title?: string | ReactNode
  subtitle?: string | ReactNode
  cta1?: string | ReactNode
  cta2?: string | ReactNode
  microtext?: string | ReactNode
  option?: string | ReactNode
  optionIcon?: ReactNode
  hidePrintMethod?: boolean
  /** Optional background image URL for the hero background layer */
  bgImage?: string
  /** Optional extra class for the background layer */
  bgClassName?: string
  /** Optional inline styles for the background layer (e.g., gradients) */
  bgStyle?: React.CSSProperties
}
