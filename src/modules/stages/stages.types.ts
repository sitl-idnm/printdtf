export interface StagesProps {
  className?: string
  stageArray?: StageItem[]
}

export interface StageItem {
  step: number
  title: string
  description?: string
}
