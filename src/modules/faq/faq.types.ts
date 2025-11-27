export interface FaqItem {
  title: string
  content: string
}

export interface FaqProps {
  className?: string
  faqData: Array<{
    title: string
    content: string
  }>
  title?: string
}
