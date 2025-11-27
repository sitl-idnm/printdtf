import { FC } from 'react'
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

  return (
    <div className={rootClassName}>
      <div className={styles.spacer}>
        <div className={styles.spacer_desktop}></div>
        <div className={styles.spacer_tablet}></div>
        <div className={styles.spacer_mobile}></div>
      </div>
      <div className={styles.bg_image}></div>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1 className={styles.title_text}>
            {title}
          </h1>
        </div>
        <div className={styles.description}>
          <div className={styles.description_text}>
            <h2 className={styles.subtitle}>{subtitle}</h2>
            {
              microtext && <p className={styles.microtext}>
                {microtext}
              </p>
            }
            {
              option && <p className={styles.option}>
                {option}
              </p>
            }
          </div>
          <TabsButtons />
        </div>
      </div>
    </div>
  )
}

export default PrintHero
