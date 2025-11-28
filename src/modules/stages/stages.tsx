'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './stages.module.scss'
import { StagesProps } from './stages.types'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Stages: FC<StagesProps> = ({
  className,
  stageArray,
}) => {
  const rootClassName = classNames(styles.root, className)

  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const container = containerRef.current
    if (!container) return

    const trigger = ScrollTrigger.create({
      trigger: container,
      pin: true,
      start: 'top 30%',
      end: 'bottom 50%',
      markers: false,
    })

    return () => {
      trigger.kill()
    }
  }, { scope: containerRef })

  return (
    <div className={rootClassName}>
      <div className={styles.main} ref={containerRef}>
        <h2 className={styles.main_title}>
          Требования к макетам:
        </h2>
      </div>
      <div className={styles.container}>
        <ul className={styles.list}>
          {stageArray?.map((item, index) => (
            <li key={index} className={styles.item}>
              <div className={styles.item_container}>
                <div className={styles.item_step}>
                  {item.step ?? index + 1}
                </div>
                <h3 className={styles.item_title}>{item.title}</h3>
              </div>
              {item.description && <p className={styles.item_description}>{item.description}</p>}
            </li>
          ))}
        </ul>
        <div className={styles.shadow}><div></div></div>
      </div>
    </div>
  )
}

export default Stages
