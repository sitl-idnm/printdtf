export interface CasesProps {
  className?: string
  items?: Array<{
    id: string | number
    kicker: string // компания
    type?: 'DTF' | 'UV DTF' | string
    title: string
    image?: string
    meta?: string
    stats?: Array<{ value: string, note: string }>
  }>
}
