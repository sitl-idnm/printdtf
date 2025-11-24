'use client'
import { FC } from 'react'
import classNames from 'classnames'

import styles from './stages.module.scss'
import { StagesProps } from './stages.types'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const Stages: FC<StagesProps> = ({
  className,
  stageArray,
}) => {
  const rootClassName = classNames(styles.root, className)

  useGSAP(() => {

  })

  return (
    <div className={rootClassName}>
      <ul className={styles.list}>
        {stageArray?.map((item, index) => (
          <li key={index} className={styles.item}>
            <div className={styles.item_step}>
              {item.step ?? index + 1}
            </div>
            <div className={styles.item_title}>{item.title}</div>
            {item.description && <p>{item.description}</p>}
          </li>
        ))}
      </ul>
      <div className={styles.shadow}></div>
    </div>
  )
}

export default Stages
