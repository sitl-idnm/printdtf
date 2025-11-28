import { FC } from 'react'
import classNames from 'classnames'

import styles from './advantages.module.scss'
import { AdvantagesProps } from './advantages.types'
import Image from 'next/image'

const Advantages: FC<AdvantagesProps> = ({
  className,
  arrAdvantages,
  title,
  classBlock,
  imageSrc
}) => {
  const rootClassName = classNames(styles.root, className,
    classBlock ? styles.right : null
  )

  return (
    <div className={rootClassName}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.bg_image}>
          <Image
            width={300}
            height={300}
            quality={90}
            src={imageSrc}
            alt=''
            className={styles.image}
          />
          <Image
            width={300}
            height={300}
            quality={90}
            src={imageSrc}
            alt=''
            className={styles.image2}
          />
        </div>
      </div>
      <ul className={styles.list}>
        {
          arrAdvantages?.map((item, index) => (
            <li key={index} className={styles.item}>
              <p className={styles.number}>
                {item.num}
              </p>
              <p className={styles.text}>
                {item.text}
              </p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Advantages
