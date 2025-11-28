'use client'

import { FC, useCallback, useState } from 'react'
import classNames from 'classnames'

import styles from './faq.module.scss'
import { FaqProps } from './faq.types'
import HeaderAnim from '@modules/header/anim'

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


  return (
    <div className={rootClassName}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.faqGrid}>
          <div className={styles.col}>
            {faqData.filter((_, i) => i % 2 === 0).map((item: { title: string; content: string }, idx: number) => {
              const realIndex = idx * 2
              return (
                <div
                  key={realIndex}
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
            {faqData.filter((_, i) => i % 2 === 1).map((item: { title: string; content: string }, idx: number) => {
              const realIndex = idx * 2 + 1
              return (
                <div
                  key={realIndex}
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
