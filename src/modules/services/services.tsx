'use client'
import { FC, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import styles from './services.module.scss'
import { ServicesProps } from './services.types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function IconPickup() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M3 7h11v10H3V7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
			<path d="M14 10h4l3 3v4h-7v-7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
			<path d="M7 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
			<path d="M18 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
		</svg>
	)
}

function IconBoxes() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M4 7h7v7H4V7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
			<path d="M13 10h7v7h-7v-7Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
			<path d="M9 14v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M15 4v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	)
}

function IconPallet() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M5 4h14v8H5V4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
			<path d="M3 14h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M5 14v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M12 14v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M19 14v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	)
}

function IconRoute() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M7 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="none" stroke="currentColor" strokeWidth="2" />
			<path d="M17 23a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="none" stroke="currentColor" strokeWidth="2" />
			<path d="M7 7c0 4 10 2 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	)
}

function IconCalendar() {
	return (
		<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M7 3v3M17 3v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M4 6h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
			<path d="M4 10h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			<path d="M8 14h3M8 17h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	)
}

const ICONS = [IconPickup, IconBoxes, IconPallet, IconRoute, IconCalendar]

const Services: FC<ServicesProps> = ({ className, title, items }) => {
	const rootClassName = classNames(styles.root, className)
	const sectionRef = useRef<HTMLElement | null>(null)
	const listRef = useRef<HTMLDivElement | null>(null)

	const data = useMemo(() => (items ?? []).filter(Boolean), [items])

	useGSAP(() => {
		const section = sectionRef.current
		const root = listRef.current
		if (!section || !root) return
		const rows = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.item}`))
		if (!rows.length) return

		const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
		if (prefersReduced) {
			rows.forEach((c) => c.classList.add(styles.inView))
			return
		}

		// Устанавливаем начальные состояния
		rows.forEach((item) => {
			const icon = item.querySelector<HTMLElement>(`.${styles.icon}`)
			const body = item.querySelector<HTMLElement>(`.${styles.body}`)

			gsap.set(item, {
				opacity: 0,
				x: -50,
				y: 20,
				scale: 0.95,
				filter: 'blur(8px)',
				force3D: true
			})

			gsap.set(icon, {
				opacity: 0,
				scale: 0.6,
				rotation: -15,
				force3D: true
			})

			gsap.set(body, {
				opacity: 0,
				x: 30,
				force3D: true
			})
		})

		// Создаем timeline с pin эффектом
		const pinTl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top top',
				end: () => `+=${rows.length * 400}`,
				scrub: 1,
				pin: true,
				pinSpacing: true,
				anticipatePin: 1,
				invalidateOnRefresh: true
			}
		})

		// Анимируем элементы последовательно во время скролла
		rows.forEach((item, index) => {
			const icon = item.querySelector<HTMLElement>(`.${styles.icon}`)
			const body = item.querySelector<HTMLElement>(`.${styles.body}`)

			const progress = index / rows.length

			pinTl
				.to(item, {
					opacity: 1,
					x: 0,
					y: 0,
					scale: 1,
					filter: 'blur(0px)',
					duration: 0.4,
					ease: 'power2.out',
					onStart: () => item.classList.add(styles.inView)
				}, progress)
				.to(icon, {
					opacity: 1,
					scale: 1,
					rotation: 0,
					duration: 0.3,
					ease: 'back.out(1.4)'
				}, progress + 0.1)
				.to(body, {
					opacity: 1,
					x: 0,
					duration: 0.4,
					ease: 'power2.out'
				}, progress + 0.15)
		})

		return () => {
			ScrollTrigger.getAll().forEach((st) => {
				if (st.trigger === section || st.trigger === root) {
					st.kill()
				}
			})
		}
	}, { scope: sectionRef, dependencies: [data.length] })

	return (
		<section className={rootClassName} aria-label={title} ref={sectionRef}>
			<div className={styles.head}>
				<h2 className={styles.title}>{title}</h2>
				<div className={styles.pill}>что делаем</div>
			</div>

			<div className={styles.list} ref={listRef}>
				<div className={styles.rail} aria-hidden="true" />
				{data.map((it, idx) => {
					const Icon = ICONS[idx] ?? IconPickup
					return (
						<article className={styles.item} key={idx}>
							<div className={styles.icon}>
								<Icon />
							</div>
							<div className={styles.body}>
								<div className={styles.kicker}>{String(idx + 1).padStart(2, '0')}</div>
								<div className={styles.text}>{it.text}</div>
							</div>
						</article>
					)
				})}
			</div>
		</section>
	)
}

export default Services
