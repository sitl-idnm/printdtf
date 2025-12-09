'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './production.module.scss'
import { ProductionProps } from './production.types'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Production: FC<ProductionProps> = ({
  className,
  title,
  titleArr,
  videoSrc
}) => {
  const rootClassName = classNames(styles.root, className)

  const videoRef = useRef<HTMLVideoElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: videoRef.current,
        scrub: 2,
        start: 'top 150%',
        end: 'bottom 100%',
      }
    })

    tl.fromTo(videoRef.current, {
      scale: 0.01
    }, {
      scale: 1
    })
  })

  return (
    <div className={rootClassName}>
      <div className={styles.title}>
        <h2 className={styles.title_name}>
          {title}
        </h2>
        <ul className={styles.title_list}>
          {
            titleArr.map((item, index) => (
              <li key={index} className={styles.title_list_item}>{item.name}</li>
            ))
          }
        </ul>
      </div>
      <div className={styles.container}>
        <video className={styles.video} width="100vw" height="100vh" preload="auto" ref={videoRef} autoPlay loop>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default Production
