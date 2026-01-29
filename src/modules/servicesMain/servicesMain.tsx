'use client'
import { FC, memo, useMemo, useRef } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import styles from './servicesMain.module.scss'
import { ServicesMainProps } from './servicesMain.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17L17 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const defaultImages = [
  '/images/fotbolka.png',
  '/images/chehol.png',
  '/images/dostavka.png',
]

const defaultItems = [
  { title: 'Печать', href: '/print' },
  { title: 'Фулфилмент', href: '/fullfilment' },
  { title: 'Логистика', href: '/logistika' },
]

const ServicesMain: FC<ServicesMainProps> = ({
  className,
  items = defaultItems,
}) => {
  const rootClassName = classNames(styles.root, className)
  const sectionRef = useRef<HTMLElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)
  const cards = useMemo(() => {
    return items.map((item, idx) => {
      const imageSrc: string = ('image' in item && typeof (item as { image?: string }).image === 'string')
        ? (item as { image: string }).image
        : (defaultImages[idx] || defaultImages[0])
      return (
        <Link
          key={item.href ?? `${item.title}-${idx}`}
          href={item.href ?? '#'}
          className={styles.card}
          data-variant={idx + 1}
          aria-label={item.title}
        >
          <div className={styles.cardImage}>
            <Image
              src={imageSrc}
              alt=""
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={idx === 0}
            />
          </div>
          <span className={styles.cardInner}>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.cta}>
              Подробнее <span className={styles.ctaIcon}><ArrowIcon /></span>
            </span>
          </span>
        </Link>
      )
    })
  }, [items])

  useGSAP(() => {
    const section = sectionRef.current
    const row = rowRef.current
    if (!section || !row) return

    const cardNodes = Array.from(row.querySelectorAll<HTMLElement>(`.${styles.card}`))
    if (!cardNodes.length) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      gsap.set(cardNodes, { opacity: 1, y: 0, clearProps: 'filter,transform' })
      return
    }

    gsap.set(cardNodes, { opacity: 0, y: 24, filter: 'blur(6px)', force3D: true })

    gsap.to(cardNodes, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      }
    })

    const cards = cardNodes.map((card) => ({
      card,
      image: card.querySelector<HTMLElement>(`.${styles.image}`),
      cta: card.querySelector<HTMLElement>(`.${styles.cta}`),
    }))

    const resetCards = () => {
      gsap.to(cardNodes, {
        flexGrow: 1,
        flexBasis: '0%',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      })
      gsap.to(cardNodes, {
        '--card-overlay-opacity': 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      })

      const images = cards.map(({ image }) => image).filter(Boolean)
      const ctas = cards.map(({ cta }) => cta).filter(Boolean)

      if (images.length) {
        gsap.to(images, {
          opacity: 0.4,
          filter: 'grayscale(100%)',
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }

      if (ctas.length) {
        gsap.to(ctas, {
          x: 0,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }
    }

    const activateCard = (active: HTMLElement) => {
      gsap.to(cardNodes, {
        flexGrow: 0.6,
        flexBasis: '0%',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      })
      gsap.to(active, {
        flexGrow: 2.8,
        flexBasis: '0%',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      })
      gsap.to(active, {
        '--card-overlay-opacity': 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      })

      const meta = cards.find(({ card }) => card === active)
      if (meta?.image) {
        gsap.to(meta.image, {
          opacity: 0.6,
          filter: 'grayscale(0%)',
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }
      if (meta?.cta) {
        gsap.to(meta.cta, {
          x: 2,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }
    }

    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      gsap.set(cardNodes, { '--card-overlay-opacity': 0 })

      const handlers = cards.map(({ card }) => {
        const onEnter = () => activateCard(card)
        card.addEventListener('mouseenter', onEnter)
        return { card, onEnter }
      })

      const onLeave = () => resetCards()
      row.addEventListener('mouseleave', onLeave)

      return () => {
        handlers.forEach(({ card, onEnter }) => {
          card.removeEventListener('mouseenter', onEnter)
        })
        row.removeEventListener('mouseleave', onLeave)
        resetCards()
      }
    })

    return () => mm.revert()
  })

  return (
    <section ref={sectionRef} className={rootClassName} aria-label="Основные услуги">
      <div ref={rowRef} className={styles.row}>
        {cards}
      </div>
    </section>
  )
}

export default memo(ServicesMain)
