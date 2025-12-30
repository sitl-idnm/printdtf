import { ReactNode } from 'react'

export interface AboutCompanyStat {
  label: string
  value: string
}

export interface AboutCompanyProps {
  className?: string
  title?: string | ReactNode
  description?: string | ReactNode
  bullets?: Array<string | ReactNode>
  stats?: AboutCompanyStat[]
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  ctaTertiary?: { label: string; href: string }
}
