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
}
