'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import styles from './servicesScroll.module.scss'
import { ServicesScrollProps } from './servicesScroll.types'
import Form from '@/components/form/form'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function ArrowIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M7 17L17 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

const services = [
	{ title: 'Печать', href: '/print', image: '/images/fotbolka.png' },
	{ title: 'Фулфилмент', href: '/fullfilment', image: '/images/chehol.png' },
	{ title: 'Логистика', href: '/logistika', image: '/images/dostavka.png' },
]

const ServicesScroll: FC<ServicesScrollProps> = ({
	className,
}) => {
	const rootClassName = classNames(styles.root, className)
	const containerRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		const container = containerRef.current
		if (!container) return

		const blocks = Array.from(container.querySelectorAll<HTMLElement>(`.${styles.block}`))
		if (!blocks.length) return

		const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
		if (prefersReduced) {
			blocks.forEach((block, idx) => {
				if (idx === 0) {
					gsap.set(block, { opacity: 1, scale: 1, pointerEvents: 'auto' })
				} else {
					gsap.set(block, { opacity: 0, scale: 0.95, pointerEvents: 'none' })
				}
			})
			return
		}

		// Устанавливаем начальное состояние
		// Видимый блок должен иметь максимальный z-index
		const maxZIndex = blocks.length + 1
		blocks.forEach((block, idx) => {
			if (idx === 0) {
				gsap.set(block, {
					opacity: 1,
					scale: 1,
					zIndex: maxZIndex,
					pointerEvents: 'auto',
					force3D: true,
					transformOrigin: 'center center'
				})
			} else {
				gsap.set(block, {
					opacity: 0,
					scale: 0.95,
					zIndex: idx,
					pointerEvents: 'none',
					force3D: true,
					transformOrigin: 'center center'
				})
			}
		})

		// Создаём ScrollTrigger с pin
		// Каждый блок занимает 200vh скролла (удвоенная длительность)
		// Кэшируем вычисление для производительности
		let cachedTotalScroll: number | null = null
		const getTotalScroll = () => {
			if (cachedTotalScroll === null) {
				const sectionHeight = window.innerHeight
				const scrollPerBlock = sectionHeight * 2 // 200vh на блок
				cachedTotalScroll = blocks.length * scrollPerBlock
			}
			return cachedTotalScroll
		}

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: container,
				start: 'top top',
				end: () => `+=${getTotalScroll()}`,
				scrub: 1.5, // Увеличено для более плавной анимации
				pin: true,
				pinSpacing: true,
				anticipatePin: 1, // Предсказание pin для лучшей производительности
				invalidateOnRefresh: true,
				refreshPriority: 1,
			}
		})

		// Анимируем смену блоков
		// Каждый блок занимает равную часть скролла (25% для 4 блоков)
		// Переходы происходят на границах: 0.25, 0.5, 0.75
		blocks.forEach((block, idx) => {
			if (idx === 0) {
				// Первый блок виден с начала (0-25%)
				return
			}

			// Позиция перехода: каждый блок занимает 1/4 прогресса
			// Блок 0: 0-0.25, Блок 1: 0.25-0.5, Блок 2: 0.5-0.75, Блок 3: 0.75-1.0
			const transitionPoint = idx / blocks.length
			const transitionDuration = 0.2 // Короткая анимация перехода

			// Исчезновение предыдущего блока в начале перехода
			tl.to(blocks[idx - 1], {
				opacity: 0,
				scale: 0.95,
				zIndex: idx - 1,
				pointerEvents: 'none',
				duration: transitionDuration,
				ease: 'power2.in',
				force3D: true,
				overwrite: 'auto',
			}, transitionPoint)

			// Появление текущего блока одновременно
			// Видимый блок должен иметь максимальный z-index
			const maxZIndex = blocks.length + 1
			tl.fromTo(block, {
				opacity: 0,
				scale: 0.95,
				zIndex: idx,
				pointerEvents: 'none',
				force3D: true,
			}, {
				opacity: 1,
				scale: 1,
				zIndex: maxZIndex,
				pointerEvents: 'auto',
				duration: transitionDuration,
				ease: 'power2.out',
				force3D: true,
				overwrite: 'auto',
			}, transitionPoint)
		})

		return () => {
			tl.scrollTrigger?.kill()
			tl.kill()
		}
	}, { scope: containerRef, dependencies: [], revertOnUpdate: true })

	return (
		<section className={rootClassName} aria-label="Услуги и предложение">
			<div className={styles.container} ref={containerRef}>
				{/* Блоки услуг */}
				{services.map((service, idx) => (
					<div
						key={service.href}
						className={styles.block}
						data-variant={idx + 1}
						data-layout={idx % 2 === 0 ? 'left' : 'right'}
					>
						<div className={styles.card}>
							<div className={styles.cardContent}>
								<div className={styles.cardText}>
									<h2 className={styles.title}>{service.title}</h2>
									<Link
										href={service.href}
										className={styles.cta}
										aria-label={`Подробнее о ${service.title}`}
									>
										Подробнее <span className={styles.ctaIcon}><ArrowIcon /></span>
									</Link>
								</div>
								<div className={styles.cardImage}>
									<Image
										src={service.image}
										alt={service.title}
										width={600}
										height={600}
										className={styles.image}
										priority={idx === 0}
									/>
								</div>
							</div>
						</div>
					</div>
				))}

				{/* Блок оффера */}
				<div className={styles.block} data-variant="offer">
					<div className={styles.card}>
						<div className={styles.offer}>
							<div className={styles.offerLeft}>
								<h2 className={styles.offerTitle}>Готовы обсудить макет?</h2>
								<p className={styles.offerText}>
									Выберите метод (DTF/UV DTF) — наш менеджер
									свяжется с вами в течение 15 минут.
								</p>
							</div>
							<div className={styles.offerCenter}>
								<Form submitLabel="Отправить заявку" useAtomPrintMethod={false} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default ServicesScroll
