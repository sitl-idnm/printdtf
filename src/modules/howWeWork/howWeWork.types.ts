import { ReactNode } from 'react'

export interface HowWeWorkStep {
  title: string
  text: string | ReactNode
}

export interface HowWeWorkProps {
  className?: string
  title: string
  subtitle?: string | ReactNode
  steps: HowWeWorkStep[]
}
