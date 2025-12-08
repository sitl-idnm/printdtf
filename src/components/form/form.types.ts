export interface FormProps {
  className?: string
  submitLabel?: string
  theme?: 'default' | 'invert'
  /** When true, take print method from Jotai atom; hide manual chooser */
  useAtomPrintMethod?: boolean
}
