import { ComponentProps, ElementType, ReactNode } from 'react'

type ButtonColorSchemeType = 'black' | 'white'

type ButtonSizeType = 'md' | 'sm'

type ButtonOwnProps = {
  colorScheme?: ButtonColorSchemeType
  size?: ButtonSizeType
  className?: string
  children?: string | ReactNode
  href?: string
}

export type ButtonProps<E extends ElementType> = &
  Omit<ComponentProps<E>, keyof ButtonOwnProps>
