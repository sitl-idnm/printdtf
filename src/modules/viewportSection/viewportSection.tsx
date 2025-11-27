'use client'

import { FC, useEffect, useRef } from 'react'
import classNames from 'classnames'

import styles from './viewportSection.module.scss'
import { ViewportSectionProps } from './viewportSection.types'

const ViewportSection: FC<ViewportSectionProps> = ({
	className,
	children,
	center = true,
	snap = false,
	threshold = 0.6,
	smooth = true
}) => {
	const rootRef = useRef<HTMLElement | null>(null)
	const rootClassName = classNames(
		styles.root,
		center && styles.center,
		className
	)

	// NOTE: legacy JS snap via IntersectionObserver removed to avoid scroll conflicts

	// Snap to top using ScrollTrigger + ScrollToPlugin (compatible with SmoothSmoother)
	useEffect(() => {
		if (!snap) return
		let st: any
			; (async () => {
				const { ScrollTrigger } = await import('gsap/ScrollTrigger')
				const { gsap } = await import('gsap')
				const { ScrollToPlugin } = await import('gsap/ScrollToPlugin')
				gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
				if (!rootRef.current) return
				// На подходе к верхней кромке мягко доводим секцию к top
				st = ScrollTrigger.create({
					trigger: rootRef.current,
					start: 'top 80%',
					end: 'top 20%',
					onEnter: () => {
						gsap.to(window, {
							scrollTo: { y: rootRef.current as Element, autoKill: true },
							duration: 0.5,
							ease: 'power2.out'
						})
					},
					onEnterBack: () => {
						gsap.to(window, {
							scrollTo: { y: rootRef.current as Element, autoKill: true },
							duration: 0.5,
							ease: 'power2.out'
						})
					}
				})
			})()
		return () => {
			st && st.kill && st.kill()
		}
	}, [snap])

	// global smooth scrolling handled by SmoothProvider (ScrollSmoother)

	return (
		<section ref={rootRef as any} className={rootClassName} data-viewport-section="true">
			{children}
		</section>
	)
}

export default ViewportSection
