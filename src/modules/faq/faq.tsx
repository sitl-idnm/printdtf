'use client'

import { FC, useState } from 'react'
import classNames from 'classnames'
import FaqIcon from '@icons/faq.svg'

import styles from './faq.module.scss'
import { FaqProps } from './faq.types'

const FaqComponent: FC<FaqProps> = ({
  className,
  faqData,
  title = 'Часто задаваемые вопросы'
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const rootClassName = classNames(styles.root, className)

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className={rootClassName}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.faqList}>
          {faqData.map((item: { title: string; content: string }, index: number) => (
            <div
              key={index}
              className={classNames(styles.faqItem, {
                [styles.active]: activeIndex === index
              })}
            >
              <button
                className={styles.question}
                onClick={() => toggleQuestion(index)}
              >
                {item.title}
                <div className={styles.icon}>
                  <FaqIcon />
                </div>
              </button>
              <div className={styles.answer}>
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FaqComponent
