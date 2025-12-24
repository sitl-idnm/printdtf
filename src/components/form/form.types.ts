export interface FormProps {
  className?: string
  submitLabel?: string
  theme?: 'default' | 'invert'
  /** Legacy flag (method is always selectable now); kept for backward compatibility */
  useAtomPrintMethod?: boolean
}
