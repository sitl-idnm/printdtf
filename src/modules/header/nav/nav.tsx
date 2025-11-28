'use client'

import Link from 'next/link'
import HeaderAnim from '../anim'
import styles from './nav.module.scss'
import { useRef, useState } from 'react';
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react';
import { SocialLinks } from '@/ui';

gsap.registerPlugin(useGSAP)

export const Nav = () => {

	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [activeIndex, setActiveIndex] = useState<number | null>(0);
	const containerRef = useRef<HTMLDivElement | null>(null)
	const tlRef = useRef<gsap.core.Timeline | null>(null)
	const menuRef = useRef<HTMLUListElement>(null)

	useGSAP(() => {
		const items = gsap.utils.toArray<HTMLElement>(`.${styles.menu_item}`, containerRef.current!)
		const menu = menuRef.current

		const mm = gsap.matchMedia()

		// Desktop only animations
		mm.add('(min-width: 1025px)', () => {
			if (menu) gsap.set(menu, { width: 0 })
			if (items.length) gsap.set(items, { opacity: 0 })

			tlRef.current = gsap.timeline({
				paused: true,
				defaults: { ease: 'power1.inOut' }
			})
				.to(menu, { width: 'auto' })
				.to(items, { opacity: 1, stagger: { each: 0.3, from: 'end' }, overwrite: 'auto' }, 0)

			return () => {
				tlRef.current?.kill()
				tlRef.current = null
			}
		})

		// Tablet and below: disable animation, ensure visible
		mm.add('(max-width: 1024px)', () => {
			tlRef.current?.kill()
			tlRef.current = null
			if (menu) gsap.set(menu, { clearProps: 'width' })

				if (items.length) gsap.set(items, { opacity: 0 })

				tlRef.current = gsap.timeline({
					paused: true,
					defaults: { ease: 'power1.inOut' }
				})
					.to(items, { opacity: 1, stagger: { each: 0.5 }, overwrite: 'auto' }, 0)

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
		<nav ref={containerRef} className={styles.container}>
			<ul className={styles.menu} ref={menuRef}>
				<li
					onClick={() => setActiveIndex(0)}
					className={`${styles.menu_item} ${activeIndex === 0 ? styles.menu_item_active : ''}`}
				>
					<Link href="#">Печать</Link>
				</li>
				<li
					onClick={() => setActiveIndex(1)}
					className={`${styles.menu_item} ${activeIndex === 1 ? styles.menu_item_active : ''}`}
				>
					<Link href="#">Фулфилмент</Link>
				</li>
				<li
					onClick={() => setActiveIndex(2)}
					className={`${styles.menu_item} ${activeIndex === 2 ? styles.menu_item_active : ''}`}
				>
					<Link href="#">Логистика</Link>
				</li>
				<li
					onClick={() => setActiveIndex(2)}
					className={`${styles.menu_item} ${styles.social}`}
				>
					<SocialLinks />
				</li>
			</ul>
			<div onClick={() => { setIsOpen(!isOpen) }}>
				<HeaderAnim className={styles.container_icon} />
			</div>
		</nav>
	)
}
