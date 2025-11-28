import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import classNames from 'classnames'

import styles from './gallery.module.scss'
import { GalleryProps } from './gallery.types'

const Gallery: FC<GalleryProps> = ({
  className,
  title = 'Наши работы',
  description = 'Подборка реальных проектов: от мягких текстильных принтов до UV DTF на стекле, пластике и металле. Каждый кейс — это чистая практика и аккуратная реализация.',
  items
}) => {
  const rootClassName = classNames(styles.root, className)
  const viewRef = useRef<HTMLDivElement | null>(null)
  const [lbIndex, setLbIndex] = useState<number | null>(null)

  const data = useMemo(() => {
    if (items?.length) return items
    return [
      { id: 1, image: '/images/sticker-dino.png', title: 'Стикеры DTF', tags: ['DTF'] },
      { id: 2, image: '/images/sticker-shark.png', title: 'UV DTF стекло', tags: ['UV DTF'] },
      { id: 3, image: '/images/banner.jpg', title: 'Текстильный принт', tags: ['DTF'] },
      { id: 4, image: '/images/sticker-dino.png', title: 'Наклейки', tags: ['DTF'] },
      { id: 5, image: '/images/sticker-shark.png', title: 'Подарочные наборы', tags: ['UV DTF'] }
    ]
  }, [items])

  const scrollByCards = (dir: -1 | 1) => {
    const el = viewRef.current
    if (!el) return
    const firstCard = el.querySelector<HTMLElement>(`.${styles.card}`)
    const delta = firstCard ? (firstCard.offsetWidth + 24) * 1 : el.clientWidth * 0.9
    el.scrollBy({ left: delta * dir, behavior: 'smooth' })
  }

  const openLb = (i: number) => setLbIndex(i)
  const closeLb = () => setLbIndex(null)
  const nextLb = useCallback(() => {
    setLbIndex((i) => (i === null ? 0 : (i + 1) % data.length))
  }, [data.length])
  const prevLb = useCallback(() => {
    setLbIndex((i) => (i === null ? 0 : (i - 1 + data.length) % data.length))
  }, [data.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lbIndex === null) return
      if (e.key === 'Escape') closeLb()
      if (e.key === 'ArrowRight') nextLb()
      if (e.key === 'ArrowLeft') prevLb()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lbIndex, data.length, nextLb, prevLb])

  return (
    <section className={rootClassName}>
      <div className={styles.container}>
        <div className={styles.top}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.descr}>{description}</p>
        </div>
        <div className={styles.viewport}>
          <div className={styles.track} ref={viewRef}>
            {data.map((item, idx) => {
              const src = item.image as string | StaticImageData
              return (
                <article className={styles.card} key={item.id} onClick={() => openLb(idx)}>
                  {item.tags && item.tags.length ? (
                    <div className={styles.tags}>
                      {item.tags.map((t, i) => (
                        <span className={styles.tag} key={i}>{t}</span>
                      ))}
                    </div>
                  ) : null}
                  <Image
                    className={styles.image}
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    priority={idx < 2}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className={styles.shade} aria-hidden="true" />
                  <div className={styles.tint} aria-hidden="true" />
                  <div className={styles.caption}>
                    <div className={styles.name}>{item.title}</div>
                    {item.subtitle ? <div className={styles.sub}>{item.subtitle}</div> : null}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
        <div className={styles.nav}>
          <button className={styles.btn} onClick={() => scrollByCards(-1)} aria-label="Prev">
            <svg width="24" height="24" viewBox="0 0 12 24" aria-hidden="true">
              <path d="M9.54801 6.57999L8.48701 5.51999L2.70801 11.297C2.61486 11.3896 2.54093 11.4996 2.49048 11.6209C2.44003 11.7421 2.41406 11.8722 2.41406 12.0035C2.41406 12.1348 2.44003 12.2648 2.49048 12.3861C2.54093 12.5073 2.61486 12.6174 2.70801 12.71L8.48701 18.49L9.54701 17.43L4.12301 12.005L9.54801 6.57999Z" fill="currentColor" />
            </svg>
          </button>
          <button className={styles.btn} onClick={() => scrollByCards(1)} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 12 24" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}>
              <path d="M9.54801 6.57999L8.48701 5.51999L2.70801 11.297C2.61486 11.3896 2.54093 11.4996 2.49048 11.6209C2.44003 11.7421 2.41406 11.8722 2.41406 12.0035C2.41406 12.1348 2.44003 12.2648 2.49048 12.3861C2.54093 12.5073 2.61486 12.6174 2.70801 12.71L8.48701 18.49L9.54701 17.43L4.12301 12.005L9.54801 6.57999Z" fill="currentColor" />
            </svg>
          </button>
        </div>
        <div className={styles.micro}>Откройте полноэкранный просмотр, чтобы рассмотреть текстуру принта/рельеф</div>
      </div>

      {/* lightbox */}
      <div className={classNames(styles.lightbox, { [styles.open]: lbIndex !== null })} onClick={closeLb}>
        {lbIndex !== null && (
          <>
            <button className={styles.lbCloseBar} onClick={closeLb} aria-label="Close">
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: -8 }}>
                <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={styles.lbInner} onClick={(e) => e.stopPropagation()}>

              <div className={styles.lbNav}>
                <button className={styles.lbBtn} onClick={prevLb} aria-label="Prev">
                  <svg width="28" height="28" viewBox="0 0 12 24" aria-hidden="true">
                    <path d="M9.54801 6.57999L8.48701 5.51999L2.70801 11.297C2.61486 11.3896 2.54093 11.4996 2.49048 11.6209C2.44003 11.7421 2.41406 11.8722 2.41406 12.0035C2.41406 12.1348 2.44003 12.2648 2.49048 12.3861C2.54093 12.5073 2.61486 12.6174 2.70801 12.71L8.48701 18.49L9.54701 17.43L4.12301 12.005L9.54801 6.57999Z" fill="currentColor" />
                  </svg>
                </button>
                <button className={styles.lbBtn} onClick={nextLb} aria-label="Next">
                  <svg width="28" height="28" viewBox="0 0 12 24" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M9.54801 6.57999L8.48701 5.51999L2.70801 11.297C2.61486 11.3896 2.54093 11.4996 2.49048 11.6209C2.44003 11.7421 2.41406 11.8722 2.41406 12.0035C2.41406 12.1348 2.44003 12.2648 2.49048 12.3861C2.54093 12.5073 2.61486 12.6174 2.70801 12.71L8.48701 18.49L9.54701 17.43L4.12301 12.005L9.54801 6.57999Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              {(() => {
                const item = lbIndex !== null ? data[lbIndex] : null
                const img = item?.image as string | StaticImageData | undefined
                const lbSrc: string = typeof img === 'string' ? img : (img as StaticImageData | undefined)?.src ?? ''
                return (
                  <Image
                    className={styles.lbImage}
                    src={lbSrc}
                    alt=""
                    width={1600}
                    height={1000}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                )
              })()}
              {/* old close removed in favour of top bar */}
              <div className={styles.lbCaption}>
                <div>
                  <div className={styles.lbTitle}>{lbIndex !== null ? data[lbIndex]!.title : ''}</div>
                  {lbIndex !== null && data[lbIndex]!.subtitle ? <div className={styles.lbSub}>{data[lbIndex]!.subtitle}</div> : null}
                </div>
                {lbIndex !== null && data[lbIndex] && data[lbIndex]!.tags && data[lbIndex]!.tags!.length ? (
                  <div className={styles.lbTags}>
                    {data[lbIndex]!.tags!.map((t, i) => <span className={styles.lbTag} key={i}>{t}</span>)}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Gallery
