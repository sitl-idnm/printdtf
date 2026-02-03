export interface CasesProps {
  className?: string
  items?: Array<{
    id: string | number
    kicker: string // компания
    type?: 'DTF' | 'UV DTF' | string
    title: string
    image?: string
    // Optional separate image for card preview (different from modal hero image)
    cardImage?: string
    /** Optional list of images for modal slider OR a folder path like /images/portfolio/futbolka */
    images?: string[] | string
    meta?: string
    stats?: Array<{ value: string, note: string }>
    task?: string | React.ReactNode
    whatWeDid?: string | React.ReactNode
    result?: string | React.ReactNode
  }>
}
