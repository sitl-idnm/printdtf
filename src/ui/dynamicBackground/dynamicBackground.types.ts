export type DynamicBgVariant = 'grid-draw' | 'diagonal-lines' | 'swirl-2' | 'crosses' | 'none'

export interface DynamicBackgroundProps {
  className?: string
  variant?: DynamicBgVariant
  children?: React.ReactNode
  // approximate cell size; grid adapts to wrapper size
  cellSize?: number
  // pin the section while animating (default true for grid-draw)
  pin?: boolean
  // duration factor for scroll; 1 = 100% viewport, >1 = longer
  scrollFactor?: number
}
