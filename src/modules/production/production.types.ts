export interface ProductionProps {
  className?: string
  title: string
  titleArr: arrItem[]
  // Each item represents a single video; inside are multiple sources for different resolutions
  videoSrcs: string[][]
}

export interface arrItem {
  name: string
}
