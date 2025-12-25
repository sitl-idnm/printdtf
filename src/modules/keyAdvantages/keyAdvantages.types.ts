import { ReactNode } from 'react'

export interface KeyAdvantageItem {
  title: string
  text: string | ReactNode
}

export interface KeyAdvantagesProps {
  className?: string
  title: string
  subtitle?: string | ReactNode
  items: KeyAdvantageItem[]
  note?: string | ReactNode
}

