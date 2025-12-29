'use client'
import { FC } from 'react'
import Image from 'next/image'
import classNames from 'classnames'

import styles from './gallerySimple.module.scss'
import { GallerySimpleProps } from './gallerySimple.types'

const GallerySimple: FC<GallerySimpleProps> = ({
  className,
  title = 'Галерея',
  images
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <section className={rootClassName}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {images.map((src, index) => (
          <div key={index} className={styles.item}>
            <Image
              src={src}
              alt=""
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default GallerySimple
