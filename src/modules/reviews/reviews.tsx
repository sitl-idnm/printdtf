'use client'

import { FC, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'

import styles from './reviews.module.scss'
import { ReviewsProps } from './reviews.types'
import ReviewImageModal from './reviewImageModal'

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  const rotate = dir === 'left' ? 180 : 0
  return (
    <svg className={styles.btnIcon} viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M7 17L17 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Reviews: FC<ReviewsProps> = ({
  className,
  title = <>Отзывы</>,
  subtitle = <>Несколько коротких отзывов от клиентов.</>,
  items,
}) => {
  const rootClassName = classNames(styles.root, className)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [selectedReview, setSelectedReview] = useState<{ imageSrc?: string; imageAlt?: string } | null>(null)

  const data = useMemo(() => {
    if (items?.length) return items
    return [
      {
        name: 'Антон',
        role: 'Селлер',
        company: 'Wildberries',
        rating: 5 as const,
        text: <>Заказывали DTF на срочный тираж. Быстро согласовали макет, сделали в срок, качество отличное — цвета яркие.</>,
      },
      {
        name: 'Мария',
        role: 'Маркетинг',
        company: 'бренд одежды',
        rating: 5 as const,
        text: <>Понравилось, что сразу дали требования к файлам и предупредили о рисках. Всё прозрачно по цене и срокам.</>,
      },
      {
        name: 'Илья',
        role: 'Фулфилмент',
        company: 'Москва',
        rating: 4 as const,
        text: <>Регулярно печатаем и отгружаем партиями. Удобно, что можно договориться по графику и упаковке.</>,
      },
      {
        name: 'Светлана',
        role: 'ИП',
        company: 'сувениры',
        rating: 5 as const,
        text: <>UV DTF — топ для стекла и пластика. Держится хорошо, выглядит дорого. Будем повторять.</>,
      },
      {
        name: 'Денис',
        role: 'Производство',
        company: 'мерч',
        rating: 5 as const,
        text: <>Нравится подход: если макет “не ок” — говорят прямо и предлагают исправления. Экономит кучу времени.</>,
      },
      {
        name: 'Екатерина',
        role: 'Менеджер',
        company: 'ивенты',
        rating: 4 as const,
        text: <>Сделали небольшой тираж за пару дней. В следующий раз хочется чуть больше вариантов плёнок — но в целом супер.</>,
      },
    ]
  }, [items])

  const scrollByCard = (dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    const first = el.querySelector<HTMLElement>(`.${styles.card}`)
    const delta = (first?.offsetWidth ?? 320) + 1
    el.scrollBy({ left: dir === 'left' ? -delta : delta, top: 0, behavior: 'auto' })
  }

  return (
    <>
      <ReviewImageModal
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        imageSrc={selectedReview?.imageSrc}
        imageAlt={selectedReview?.imageAlt}
      />
      <section className={rootClassName} aria-label="Отзывы">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.controls} aria-label="Навигация по отзывам">
            <button type="button" className={styles.btn} onClick={() => scrollByCard('left')} aria-label="Назад">
              <Arrow dir="left" />
            </button>
            <button type="button" className={styles.btn} onClick={() => scrollByCard('right')} aria-label="Вперёд">
              <Arrow dir="right" />
            </button>
          </div>
        </div>

        <div className={styles.frame}>
          <div className={styles.track} ref={trackRef}>
            {data.map((r, idx) => {
              const meta = [r.role, r.company].filter(Boolean).join(' · ')
              const rating = r.rating ?? 5
              return (
                <article key={`${r.name}-${idx}`} className={styles.card}>
                  <div className={styles.topline}>
                    <div className={styles.who}>
                      <div className={styles.name}>{r.name}</div>
                      {meta && <div className={styles.meta}>{meta}</div>}
                    </div>
                    <div className={styles.rating} aria-label={`Оценка ${rating} из 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} filled={i < rating} />
                      ))}
                    </div>
                  </div>
                  <div className={styles.text}>{r.text}</div>
                  <button
                    type="button"
                    className={styles.viewButton}
                    onClick={() => setSelectedReview({
                      imageSrc: ('imageSrc' in r ? r.imageSrc : undefined) || '/images/test.jpg',
                      imageAlt: ('imageAlt' in r ? r.imageAlt : undefined) || `Фотография отзыва от ${r.name}`
                    })}
                    aria-label="Посмотреть фотографию отзыва"
                  >
                    Посмотреть фото
                  </button>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default Reviews
