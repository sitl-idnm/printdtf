import { ReactNode } from 'react'

export interface AboutCompanyStat {
  label: string
  value: string
}

export interface AboutCompanyProps {
  className?: string
  title?: string | ReactNode
  subtitle?: string | ReactNode
  history?: string | ReactNode
  directionsTitle?: string | ReactNode
  directionsDescription?: string | ReactNode
  principlesTitle?: string | ReactNode
  principles?: Array<string | ReactNode>
  equipment?: string | ReactNode
  cta?: string | ReactNode
  bullets?: Array<string | ReactNode>
  stats?: AboutCompanyStat[]
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  ctaTertiary?: { label: string; href: string }
}
