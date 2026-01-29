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
        <a href="tel:+79331846181" className={styles.item_text}>+7 (933) 184-61-81</a>
      </div>
      <div className={styles.item}>
        <IconMail />
        <a href="mailto:sales@city-group.pro" className={styles.item_text}>sales@city-group.pro</a>
      </div>
    </div>
  )
}

export default SocialLinks
