import type { ReactNode } from 'react'

export type ServicesItem = {
  text: string | ReactNode
}

export interface ServicesProps {
  className?: string
  title: string | ReactNode
  items: ServicesItem[]
}
