import { ReactNode } from "react"

export interface AdvantagesProps {
  className?: string
  arrAdvantages: arrItem[]
  title: string | ReactNode
  classBlock?: boolean
  imageSrc1: string
  imageSrc2: string
}

export interface arrItem {
  num?: string
  icon?: ReactNode
  text: string | ReactNode
}
