import { ReactNode } from "react"

export interface ForWorkProps {
  className?: string
  title: string
  textArr: textArrProps[]
}

export interface textArrProps {
  text: string | ReactNode
}
