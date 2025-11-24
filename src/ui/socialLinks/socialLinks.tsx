import { FC } from 'react'
import classNames from 'classnames'

import styles from './socialLinks.module.scss'
import { SocialLinksProps } from './socialLinks.types'

import IconPhone from '@icons/icon_phone.svg'
import IconMail from '@icons/icon_mail.svg'


const SocialLinks: FC<SocialLinksProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <div className={rootClassName}>
      <div className={styles.item}>
        <IconPhone />
        <a href="tel:+79999999999" className={styles.item_text}>+7 (999) 999-99-99</a>
      </div>
      <div className={styles.item}>
        <IconMail />
        <a href="mailto:example@mail.ru" className={styles.item_text}>example@mail.ru</a>
      </div>
    </div>
  )
}

export default SocialLinks
