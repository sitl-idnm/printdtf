export interface BeforeAfterItem {
  beforeImage?: string
  afterImage?: string
  beforeLabel?: string
  afterLabel?: string
  title?: string
  description?: string
}

export interface BeforeAfterProps {
  className?: string
  title?: string
  items?: BeforeAfterItem[]
}
