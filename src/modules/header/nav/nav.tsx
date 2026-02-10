'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
import HeaderAnim from '../anim'
import styles from './nav.module.scss'
import { useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { SocialLinks } from '@/ui'

gsap.registerPlugin(useGSAP)

const NAV_ITEMS = [
	{ href: '/print', label: 'Печать', index: 0 },
	{ href: '/fullfilment', label: 'Фулфилмент', index: 1 },
	{ href: '/logistika', label: 'Логистика', index: 2 },
] as const

export const Nav = () => {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const tlRef = useRef<gsap.core.Timeline | null>(null)
	const menuRef = useRef<HTMLUListElement>(null)

	const closeMenu = useCallback(() => {
		setIsOpen(false)
	}, [])

	const activeIndex = (() => {
		const i = NAV_ITEMS.findIndex((item) => pathname === item.href || pathname?.startsWith(item.href + '/'))
		return i >= 0 ? i : null
	})()

	useGSAP(() => {
		const items = gsap.utils.toArray<HTMLElement>(`.${styles.menu_item}`, containerRef.current ?? null)
		const menu = menuRef.current
		const mm = gsap.matchMedia()

		mm.add('(min-width: 1025px)', () => {
			if (menu) gsap.set(menu, { width: 0 })
			if (items.length) gsap.set(items, { opacity: 0 })

			tlRef.current = gsap.timeline({
				paused: true,
				defaults: { ease: 'power1.inOut' },
			})
				.to(menu, { width: 'auto' })
				.to(items, { opacity: 1, stagger: { each: 0.3, from: 'end' }, overwrite: 'auto' }, 0)

			return () => {
				tlRef.current?.kill()
				tlRef.current = null
			}
		})

		mm.add('(max-width: 1024px)', () => {
			tlRef.current?.kill()
			tlRef.current = null
			if (menu) gsap.set(menu, { clearProps: 'width' })
			if (items.length) gsap.set(items, { opacity: 1 })

			tlRef.current = gsap.timeline({
				paused: true,
				defaults: { ease: 'power1.inOut', duration: 0.15 },
			})
				.to(items, { opacity: 1, stagger: 0.04, overwrite: 'auto' }, 0)

			return () => {
				tlRef.current?.kill()
				tlRef.current = null
			}
		})

		return () => mm.revert()
	}, { scope: containerRef })

	useGSAP(() => {
		if (!tlRef.current) return
		if (isOpen) {
			tlRef.current.play()
		} else {
			tlRef.current.reverse()
		}
	}, { dependencies: [isOpen], scope: containerRef })

	return (
		<nav ref={containerRef} className={styles.container} aria-label="Основное меню">
			<ul
				id="nav-menu"
				className={classNames(styles.menu, !isOpen && styles.menu_closed)}
				ref={menuRef}
				role="menubar"
			>
				{NAV_ITEMS.map(({ href, label, index }) => (
					<li
						key={href}
						role="none"
						className={classNames(
							styles.menu_item,
							activeIndex === index && styles.menu_item_active
						)}
					>
						<Link
							href={href}
							role="menuitem"
							onClick={closeMenu}
							className={styles.menu_link}
						>
							{label}
						</Link>
					</li>
				))}
				<li role="none" className={classNames(styles.menu_item, styles.social)}>
					<SocialLinks />
				</li>
			</ul>
			<button
				type="button"
				className={styles.burger_btn}
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-controls="nav-menu"
				aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
			>
				<HeaderAnim className={styles.container_icon} open={isOpen} />
			</button>
		</nav>
	)
}
