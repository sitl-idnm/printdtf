'use client'
import { FC, useRef } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
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
	{ title: 'Печать', href: '/print' },
	{ title: 'Фулфилмент', href: '/fullfilment' },
	{ title: 'Логистика', href: '/logistika' },
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
					gsap.set(block, { opacity: 1, scale: 1 })
				} else {
					gsap.set(block, { opacity: 0, scale: 0.95 })
				}
			})
			return
		}

		// Устанавливаем начальное состояние
		blocks.forEach((block, idx) => {
			if (idx === 0) {
				gsap.set(block, { opacity: 1, scale: 1, zIndex: blocks.length - idx })
			} else {
				gsap.set(block, { opacity: 0, scale: 0.95, zIndex: blocks.length - idx })
			}
		})

		// Создаём ScrollTrigger с pin
		// Каждый блок занимает 200vh скролла (удвоенная длительность)
		const getTotalScroll = () => {
			const sectionHeight = window.innerHeight
			const scrollPerBlock = sectionHeight * 2 // 200vh на блок
			return blocks.length * scrollPerBlock
		}

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: container,
				start: 'top top',
				end: () => `+=${getTotalScroll()}`,
				scrub: 1,
				pin: true,
				pinSpacing: true,
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
				duration: transitionDuration,
				ease: 'power2.in',
			}, transitionPoint)

			// Появление текущего блока одновременно
			tl.fromTo(block, {
				opacity: 0,
				scale: 0.95,
			}, {
				opacity: 1,
				scale: 1,
				duration: transitionDuration,
				ease: 'power2.out',
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
					>
						<Link
							href={service.href}
							className={styles.card}
							aria-label={service.title}
						>
							<span className={styles.cardInner}>
								<span className={styles.title}>{service.title}</span>
								<span className={styles.cta}>
									Подробнее <span className={styles.ctaIcon}><ArrowIcon /></span>
								</span>
							</span>
						</Link>
					</div>
				))}

				{/* Блок оффера */}
				<div className={styles.block} data-variant="offer">
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
		</section>
	)
}

export default ServicesScroll
