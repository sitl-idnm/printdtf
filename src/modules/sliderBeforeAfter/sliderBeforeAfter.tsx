'use client'
import { FC, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import styles from './sliderBeforeAfter.module.scss'
import { SliderBeforeAfterProps } from './sliderBeforeAfter.types'
import gsap from 'gsap'
import { Advantages } from '@/components'
import { useSetAtom } from 'jotai'
import { printMethodWriteAtom } from '@atoms/printMethodAtom'

const advantagesDTF = [{
  num: '1', text: 'Малые и средние тиражи'
}, {
  num: '2', text: 'Полноцветные изображения, насыщенные цвета;'
}, {
  num: '3', text: 'Высокая детализация'
}, {
  num: '4', text: 'Перенос на готовые изделия и сложные поверхности'
}, {
  num: '5', text: 'Готовые изделия за 1–3 рабочих дня'
}, {
  num: '6', text: 'Прозрачные условия: договор, акты, отчётность'
}, {
  num: '7', text: 'Личный менеджер и сопровождение на всех этапах'
}]

const advantagesUVDTF = [{
  num: '1', text: 'Хорошо держится на стекле, пластике, металле '
}, {
  num: '2', text: 'Рельефный эффект, устойчивость к истиранию'
}, {
  num: '3', text: 'Небольшие партии и персонализация'
}, {
  num: '4', text: 'Готовые изделия за 1–3 рабочих дня'
}, {
  num: '5', text: 'Перенос на готовые изделия и сложные поверхности'
}, {
  num: '6', text: 'Прозрачные условия: договор, акты, отчётность'
}, {
  num: '7', text: 'Личный менеджер и сопровождение на всех этапах'
}]

const SliderBeforeAfter: FC<SliderBeforeAfterProps> = ({
  className,
  // before,
  // after,
  // beforeLabel = 'Before',
  // afterLabel = 'After',
  // initial = 0.5,
}) => {
  const rootClassName = classNames(styles.root, className)

  const [currentSlide, setCurrentSlide] = useState<number>(1)

  const prevRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLDivElement>(null)
  const setPrintMethod = useSetAtom(printMethodWriteAtom)

  useLayoutEffect(() => {
    gsap.set(prevRef.current, { left: 0 })
    gsap.set(nextRef.current, { left: '100%' })
    setPrintMethod('dtf')
  }, [setPrintMethod])

  function nextSlide() {
    gsap.to(prevRef.current, {
      left: '-100%',
      ease: 'power1.inOut',
      duration: 1
    })

    gsap.to(nextRef.current, {
      left: '0',
      ease: 'power1.inOut',
      duration: 1
    })
  }

  function prevSlide() {
    gsap.to(prevRef.current, {
      left: '0',
      ease: 'power1.inOut',
      duration: 1
    })

    gsap.to(nextRef.current, {
      left: '100%',
      ease: 'power1.inOut',
      duration: 1
    })
  }

  return (
    <div className={rootClassName}>
      <div className={styles.navigation}>
        <div className={`${styles.navigation_container} ${currentSlide === 1 ? styles.firstSlide : styles.secondSlide}`}>
          <button onClick={() => {
            nextSlide()
            setCurrentSlide(2)
            setPrintMethod('uvdtf')
          }}>
            2
          </button>
          <button onClick={() => {
            prevSlide()
            setCurrentSlide(1)
            setPrintMethod('dtf')
          }}>
            1
          </button>
        </div>
      </div>
      <div className={styles.slider}>
        <div className={styles.first} ref={prevRef}>
          <Advantages
            arrAdvantages={advantagesDTF}
            title={<><span>Преимущества</span><span>DTF</span></>}
            imageSrc='/images/sticker-shark.png'
          />
        </div>
        <div className={styles.second} ref={nextRef}>
          <Advantages
            classBlock
            arrAdvantages={advantagesUVDTF}
            title={<><span>Преимущества</span><span>UV-DTF</span></>}
            imageSrc='/images/sticker-shark.png'
          />
        </div>
      </div>
    </div>
  )
}

export default SliderBeforeAfter
