'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './plusWork.module.scss'
import { PlusWorkProps } from './plusWork.types'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const PlusWork: FC<PlusWorkProps> = ({ className, items, arrPlusWork }) => {
  const rootClassName = classNames(styles.root, className)

  const secondRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const mergedItems = arrPlusWork.map((defaultItem, index) => ({
    ...defaultItem,
    ...(items?.[index] || {})
  }))

  useGSAP(() => {
    if (window.innerWidth > 1200) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top 70%',
          scrub: true,
        }
      })

      tl.to(secondRef.current, {
        x: 448,
        ease: 'power1.out'
      })
    }
  })

  return (
    <div className={rootClassName}>
      <div className={styles.firstline} ref={triggerRef}>
        <div className={styles.box}>
          <h3 className={styles.title}>{mergedItems[0].title}</h3>
          <div className={styles.text}>
            <p>
              <span className={styles.number}>{mergedItems[0].number}</span>
              {mergedItems[0].text}
            </p>
          </div>
        </div>
        <div className={styles.box}>
          <h3 className={styles.title}>{mergedItems[1].title}</h3>
          <div className={styles.text}>
            <p>
              <span className={styles.number}>{mergedItems[1].number}</span>
              {mergedItems[1].text}
            </p>
          </div>
        </div>
        <div className={styles.box}>
          <h3 className={styles.title}>{mergedItems[2].title}</h3>
          <div className={styles.text}>
            <p>
              <span className={styles.number}>{mergedItems[2].number}</span>
              {mergedItems[2].text}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.secondline}>
        <div className={styles.box} ref={secondRef}>
          <h3 className={styles.title}>{mergedItems[3].title}</h3>
          <div className={styles.text}>
            <p>
              <span className={styles.number}>{mergedItems[3].number}</span>
              {mergedItems[3].text}
            </p>
          </div>
        </div>
        <div className={styles.box}>
        </div>
        {mergedItems[4] !== undefined ? (
          <div className={styles.box}>
          <h3 className={styles.title}>{mergedItems[4].title}</h3>
          <div className={styles.text}>
            <p>
              <span className={styles.number}>{mergedItems[4].number}</span>
              {mergedItems[4].text}
            </p>
          </div>
          </div>
        ) : null
        }
      </div>
    </div>
  )
}

export default PlusWork
