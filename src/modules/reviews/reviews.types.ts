import { ReactNode } from 'react'

export interface ReviewItem {
  name: string
  service: string
  text: string | ReactNode
  rating?: 1 | 2 | 3 | 4 | 5
  imageSrc?: string
  imageAlt?: string
}

export interface ReviewsProps {
  className?: string
  title?: string | ReactNode
  subtitle?: string | ReactNode
  items?: ReviewItem[]
}
