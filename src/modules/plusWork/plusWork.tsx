'use client'
import { FC } from 'react'
import classNames from 'classnames'

import styles from './plusWork.module.scss'
import { PlusWorkProps } from './plusWork.types'
import Image from 'next/image'

const PlusWork: FC<PlusWorkProps> = ({ className, items, arrPlusWork }) => {
  const rootClassName = classNames(styles.root, className)

  const mergedItems = arrPlusWork.map((defaultItem, index) => ({
    ...defaultItem,
    ...(items?.[index] || {})
  }))

  return (
    <div className={rootClassName}>
      <div className={styles.container}>
        <div className={styles.firstline}>
          <div className={styles.box}>
            <h3 className={styles.title}>{mergedItems[0].title}</h3>
            <div className={styles.text}>
              <p>
                <span className={styles.number}>{mergedItems[0].number}</span>
                <span className={styles.textContent}>{mergedItems[0].text}</span>
              </p>
            </div>
          </div>
          <div className={styles.box}>
            <h3 className={styles.title}>{mergedItems[1].title}</h3>
            <div className={styles.text}>
              <p>
                <span className={styles.number}>{mergedItems[1].number}</span>
                <span className={styles.textContent}>{mergedItems[1].text}</span>
              </p>
            </div>
          </div>
          <div className={styles.box}>
            <h3 className={styles.title}>{mergedItems[2].title}</h3>
            <div className={styles.text}>
              <p>
                <span className={styles.number}>{mergedItems[2].number}</span>
                <span className={styles.textContent}>{mergedItems[2].text}</span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.secondline}>
          <div className={styles.box}>
            <h3 className={styles.title}>{mergedItems[3].title}</h3>
            <div className={styles.text}>
              <p>
                <span className={styles.number}>{mergedItems[3].number}</span>
                <span className={styles.textContent}>{mergedItems[3].text}</span>
              </p>
            </div>
          </div>
          {mergedItems[4] !== undefined ? (
            <div className={styles.box}>
              <h3 className={styles.title}>{mergedItems[4].title}</h3>
              <div className={styles.text}>
                <p>
                  <span className={styles.number}>{mergedItems[4].number}</span>
                  <span className={styles.textContent}>{mergedItems[4].text}</span>
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
          )}
        </div>
      </div>
    </div>
  )
}

export default PlusWork
