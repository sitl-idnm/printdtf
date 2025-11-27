'use client'

import { FC, ReactNode, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// ScrollSmoother is a Club GSAP plugin; ensure it's available in your build
// eslint-disable-next-line import/no-unresolved
import { ScrollSmoother } from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

interface SmoothProviderProps {
	children: ReactNode
	smooth?: number
	effects?: boolean
}

export const SmoothProvider: FC<SmoothProviderProps> = ({
	children,
	smooth = 0,
	effects = true
}) => {
	const smootherRef = useRef<ReturnType<typeof ScrollSmoother.create> | null>(null)

	useEffect(() => {
		// Prevent SSR issues and duplicate init
		if (smootherRef.current) return

		try {
			smootherRef.current = ScrollSmoother.create({
				wrapper: '#smooth-wrapper',
				content: '#smooth-content',
				smooth,
				effects,
				normalizeScroll: true
			})
		} catch (_) {
			// If plugin isn't available, fail silently
		}

		return () => {
			try {
				smootherRef.current?.kill()
				smootherRef.current = null
			} catch (_) { }
		}
	}, [smooth, effects])

	return <>{children}</>
}
