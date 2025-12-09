'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './plusWork.module.scss'
import { PlusWorkProps } from './plusWork.types'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'

const PlusWork: FC<PlusWorkProps> = ({ className, items, arrPlusWork }) => {
  const rootClassName = classNames(styles.root, className)

  const secondRef = useRef<HTMLDivElement>(null)
  const thirdRef = useRef<HTMLDivElement>(null)
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
          end: 'bottom 40%'
        }
      })

      tl.to(secondRef.current, {
        x: 448,
        ease: 'power1.out'
      })

      tl.to(thirdRef.current, {
        x: -448,
        ease: 'power1.out'
      })
    }
  })

  return (
    <div className={rootClassName}>
      <div className={styles.container}>
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
        <div className={styles.secondline} ref={thirdRef}>
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
          ) : (
            <div className={styles.box}>
              <Image
                width={200}
                height={200}
                quality={90}
                src={'/images/123.jpg'}
                alt=''
                className={styles.image2}
              />
            </div>
          )
          }
        </div>
      </div>
    </div>
  )
}

export default PlusWork
