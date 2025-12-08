export interface ButtonWaveProps {
  className?: string
  variant?: 'accent2' | 'accent3'
  children?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}
