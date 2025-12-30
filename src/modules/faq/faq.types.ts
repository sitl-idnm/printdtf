export interface FaqItem {
  title: string
  content: string
  id?: string
}

export interface FaqProps {
  className?: string
  faqData: Array<{
    title: string
    content: string
    id?: string
  }>
  title?: string
}
