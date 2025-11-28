import { ComponentProps, ReactNode } from 'react'
import Link from 'next/link'

type ButtonColorSchemeType = 'black' | 'white'

type ButtonSizeType = 'md' | 'sm'

type ButtonOwnProps = {
  colorScheme?: ButtonColorSchemeType
  size?: ButtonSizeType
  className?: string
  children?: string | ReactNode
  href?: string
}

export type ButtonProps = ButtonOwnProps &
  Omit<ComponentProps<typeof Link>, keyof ButtonOwnProps>
