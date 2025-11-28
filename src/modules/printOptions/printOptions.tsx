import { FC, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import styles from './printOptions.module.scss'
import { PrintOptionsProps } from './printOptions.types'

const PrintOptions: FC<PrintOptionsProps> = ({
  className,
  title = 'Опции выдачи:',
  left = 'Только печать: отдадим плёнку/трансферы; перенос делаете сами.',
  right = 'Печать + перенос: полностью выполним нанесение и отгрузим готовые изделия.'
}) => {
  const rootClassName = classNames(styles.root, className)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const l = leftRef.current
    const r = rightRef.current
    const ctx = gsap.context(() => {
      if (l) {
        // старт полностью за левым краем, движение привязано к скроллу
        gsap.set(l, { xPercent: -105 })
        gsap.to(l, {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: l,
            start: 'top 90%',
            end: 'top 50%',
            scrub: true
          }
        })
      }
      if (r) {
        // старт полностью за правым краем
        gsap.set(r, { xPercent: 105 })
        gsap.to(r, {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: r,
            start: 'top 90%',
            end: 'top 50%',
            scrub: true
          }
        })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className={rootClassName} ref={rootRef}>
      <div className={styles.inner}>
        <div className={styles.title}>{title}</div>
        <div className={styles.col}>
          <div className={classNames(styles.badge, styles.left)} ref={leftRef}>
            {left}
          </div>
          <div className={classNames(styles.badge, styles.right)} ref={rightRef}>
            {right}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrintOptions
