import { ReactNode } from 'react'

export interface WhoWeAreItem {
  text: string | ReactNode
}

export interface WhoWeAreProps {
  className?: string
  title: string
  brand?: string
  lead: string | ReactNode
  paragraphs?: Array<string | ReactNode>
  asideKicker?: string | ReactNode
  asideAriaLabel?: string
  items: WhoWeAreItem[]
}
