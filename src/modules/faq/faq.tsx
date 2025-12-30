'use client'

import { FC, useCallback, useState, useEffect } from 'react'
import classNames from 'classnames'

import styles from './faq.module.scss'
import { FaqProps } from './faq.types'
import HeaderAnim from '@ui/anim'

const FaqComponent: FC<FaqProps> = ({
  className,
  faqData,
  title = 'Часто задаваемые вопросы'
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const rootClassName = classNames(styles.root, className)
  const handleQuestionClick = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index))
  }, [])

  // Обработка якорных ссылок
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash) {
        const targetId = hash.slice(1) // убираем #
        const targetIndex = faqData.findIndex((item) => item.id === targetId)
        if (targetIndex !== -1) {
          setActiveIndex(targetIndex)
          // Прокрутка к элементу с задержкой для загрузки страницы
          setTimeout(() => {
            const element = document.getElementById(targetId)
            if (element) {
              // Добавляем отступ сверху для лучшей видимости
              const yOffset = -80
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
              window.scrollTo({ top: y, behavior: 'smooth' })
            }
          }, 300)
        }
      }
    }

    // Обработка при монтировании
    handleHash()

    // Обработка при изменении hash (например, при клике на ссылку на той же странице)
    window.addEventListener('hashchange', handleHash)

    return () => {
      window.removeEventListener('hashchange', handleHash)
    }
  }, [faqData])


  return (
    <div className={rootClassName}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.faqGrid}>
          <div className={styles.col}>
            {faqData.filter((_, i) => i % 2 === 0).map((item: { title: string; content: string; id?: string }, idx: number) => {
              const realIndex = idx * 2
              return (
                <div
                  key={realIndex}
                  id={item.id}
                  className={classNames(styles.faqItem, {
                    [styles.active]: activeIndex === realIndex
                  })}
                >
                  <button
                    className={styles.question}
                    onClick={() => handleQuestionClick(realIndex)}
                  >
                    {item.title}
                    <div className={styles.icon}>
                      <HeaderAnim className={styles.animIcon} size={32} color={'var(--color-accent-4)'} open={activeIndex === realIndex} initialOpen={false} />
                    </div>
                  </button>
                  <div className={styles.answer}>
                    <div className={styles.answerInner}>
                      {item.content}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className={styles.col}>
            {faqData.filter((_, i) => i % 2 === 1).map((item: { title: string; content: string; id?: string }, idx: number) => {
              const realIndex = idx * 2 + 1
              return (
                <div
                  key={realIndex}
                  id={item.id}
                  className={classNames(styles.faqItem, {
                    [styles.active]: activeIndex === realIndex
                  })}
                >
                  <button
                    className={styles.question}
                    onClick={() => handleQuestionClick(realIndex)}
                  >
                    {item.title}
                    <div className={styles.icon}>
                      <HeaderAnim className={styles.animIcon} size={32} color={'var(--color-accent-4)'} open={activeIndex === realIndex} initialOpen={false} />
                    </div>
                  </button>
                  <div className={styles.answer}>
                    <div className={styles.answerInner}>
                      {item.content}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaqComponent
