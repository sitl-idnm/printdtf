import { ReactNode } from 'react'

export type TariffTone = 'violet' | 'mint' | 'amber'

export interface TariffItem {
  title: string
  description: string | ReactNode
  note?: string
  tone?: TariffTone
}

export interface TariffsProps {
  className?: string
  title: string
  subtitle?: string | ReactNode
  items: TariffItem[]
}
