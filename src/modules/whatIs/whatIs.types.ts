import { ReactNode } from "react"

export interface WhatIsProps {
  className?: string
  title: string
  arrWhat: arrWhatProps[]
  classBlock?: boolean
}

export interface arrWhatProps {
  question: string
  answer: string | ReactNode
}
