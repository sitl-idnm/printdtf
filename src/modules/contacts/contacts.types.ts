import { ReactNode } from 'react'

export interface ContactLink {
  label: string
  href: string
  value?: string
}

export interface ContactsAddress {
  label?: string
  text: string | ReactNode
}

export interface ContactsProps {
  className?: string
  id?: string
  title: string
  subtitle?: string | ReactNode
  schedule?: string | ReactNode

  quickNotes?: Array<string | ReactNode>

  phoneLinks?: ContactLink[]
  messengerLinks?: ContactLink[]
  emailLinks?: ContactLink[]

  addresses?: ContactsAddress[]

  mapEmbedSrc?: string
  mapTitle?: string
}
