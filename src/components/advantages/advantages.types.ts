import { ReactNode, CSSProperties } from "react"

export interface AdvantagesProps {
  className?: string
  arrAdvantages: arrItem[]
  title: string | ReactNode
  classBlock?: boolean
  imageSrc: string
}

export interface arrItem {
  num: string
  text: string
}
