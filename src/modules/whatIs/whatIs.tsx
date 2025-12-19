import { FC, useRef } from 'react'
import classNames from 'classnames'

import styles from './whatIs.module.scss'
import { WhatIsProps } from './whatIs.types'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const WhatIs: FC<WhatIsProps> = ({
  className,
  arrWhat,
  title,
  classBlock
}) => {
  const rootClassName = classNames(styles.root, className,
    classBlock ? styles.othercolor : null
  )

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const arrCards = document.querySelectorAll(`.${styles.list}`)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 10%',
        scrub: true,
        pin: true,
        end: '+=100%'
      }
    })

    tl.fromTo(arrCards[0]!, {
      opacity: 0
    }, {
      opacity: 1,
    })

    tl.fromTo(arrCards[1]!, {
      opacity: 0
    }, {
      opacity: 1,
    })

    tl.fromTo(arrCards[2]!, {
      opacity: 0
    }, {
      opacity: 1,
    })
  })

  return (
    <div className={rootClassName} ref={containerRef}>
      <h2 className={styles.title}>
        {title}
      </h2>
      <div className={styles.container}>
        {
          arrWhat.map((item, index) => (
            <div key={index} className={styles.list}>
              <h3 className={styles.list_title}>{item.question}</h3>
              <p className={styles.list_text}>{item.answer}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default WhatIs
