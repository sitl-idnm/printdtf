import { ReactNode } from 'react'

export interface SliderBeforeAfterProps {
  className?: string
  before?: ReactNode
  after?: ReactNode
  beforeLabel?: string
  afterLabel?: string
  initial?: number // 0..1, default 0.5
}
