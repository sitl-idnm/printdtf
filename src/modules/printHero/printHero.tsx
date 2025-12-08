import { FC, Children, isValidElement } from 'react'
import classNames from 'classnames'

import styles from './printHero.module.scss'
import { PrintHeroProps } from './printHero.types'
import { TabsButtons } from '@/components'
// import { Button } from '@/ui'

const PrintHero: FC<PrintHeroProps> = ({
  className,
  title,
  subtitle,
  // cta1,
  // cta2,
  microtext,
  option,
}) => {
  const rootClassName = classNames(styles.root, className)

  const toLines = (node?: React.ReactNode): React.ReactNode[] => {
    if (!node) return []
    // Normalize into array of children lines
    // If it's a valid element with multiple children (like fragment with spans) – flatten
    if (isValidElement(node) && node.props && node.props.children) {
      return Children.toArray(node.props.children)
    }
    return Children.toArray(node)
  }

  return (
    <div className={rootClassName} data-chat-scheme="contrast">
      <div className={styles.spacer}>
        <div className={styles.spacer_desktop}></div>
        <div className={styles.spacer_tablet}></div>
        <div className={styles.spacer_mobile}></div>
      </div>
      <div className={styles.bg_image}></div>
      <div className={styles.container}>
        <div className={styles.title}>
          <div className={styles.lines}>
            {toLines(title).map((line, idx) => (
              <div className={styles.row} key={`title-${idx}`}>
                <h1 className={styles.title_text}>{line}</h1>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.description}>
          <div className={styles.description_text}>
            <div className={styles.lines}>
              <div className={styles.row}>
                <h2 className={styles.subtitle}>{subtitle}</h2>
              </div>
              {microtext && (
                <div className={styles.row}>
                  <p className={styles.microtext}>{microtext}</p>
                </div>
              )}
              {option && (
                <div className={styles.row}>
                  <p className={styles.option}>{option}</p>
                </div>
              )}
              <div className={styles.row}>
                <TabsButtons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintHero
