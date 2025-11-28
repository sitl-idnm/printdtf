import type { StaticImageData } from 'next/image'

export interface GalleryProps {
  className?: string
  title?: string
  description?: string
  items?: Array<{
    id: string | number
    image: string | StaticImageData
    title: string
    subtitle?: string
    tags?: Array<'DTF' | 'UV DTF' | string>
  }>
}
