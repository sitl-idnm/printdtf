'use client'

import { FC, PropsWithChildren, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'

import styles from './svg-animator.module.scss'

type SvgAnimatorProps = {
	className?: string
	mode?: 'click' | 'hover' | 'auto'
	ease?: string
	defaultDuration?: number
	speed?: number
	reverseTimeScale?: number
	autoDraw?: boolean
	drawOrder?: 'sequence' | 'parallel'
	elementSelector?: string
	extraElementSelector?: string
	fallbackStroke?: string
	fallbackStrokeWidth?: number
	drawFillMode?: 'hide' | 'reveal' | 'keep'
	strictHide?: boolean
	pixelsPerSecond?: number
	minAutoDuration?: number
	maxAutoDuration?: number
	externalSelector?: string
	externalToggleOn?: string | string[]
	externalPlayOn?: string | string[]
	externalReverseOn?: string | string[]
}

const SvgAnimator: FC<PropsWithChildren<SvgAnimatorProps>> = ({
	className,
	children,
	mode = 'click',
	ease = 'power2.inOut',
	defaultDuration = 0.5,
	speed = 1,
	reverseTimeScale = 1,
	autoDraw = true,
	drawOrder = 'sequence',
	elementSelector = 'path, line, polyline, polygon, circle, ellipse, rect',
	extraElementSelector = 'text, image, use',
	fallbackStroke = 'currentColor',
	fallbackStrokeWidth = 2,
	drawFillMode = 'hide',
	strictHide = true,
	pixelsPerSecond = 300,
	minAutoDuration = 0.25,
	maxAutoDuration = 2.5,
	externalSelector,
	externalToggleOn,
	externalPlayOn,
	externalReverseOn,
}) => {
	const rootRef = useRef<HTMLDivElement | null>(null)
	const svgRef = useRef<SVGSVGElement | null>(null)
	const tlRef = useRef<gsap.core.Timeline | null>(null)
	const [isOpen, setIsOpen] = useState(false)
	const isOpenRef = useRef(false)
	isOpenRef.current = isOpen

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			if (!rootRef.current) return
			const svg = rootRef.current.querySelector('svg') as SVGSVGElement | null
			if (!svg) return
			svgRef.current = svg

			// Collect animatable nodes (attribute-driven)
			const nodes = Array.from(svg.querySelectorAll<SVGElement>('[data-anim]'))
			// Fallback auto-draw nodes when no data-anim provided
			const autoNodes: SVGElement[] =
				autoDraw && nodes.length === 0
					? Array.from(svg.querySelectorAll<SVGElement>(elementSelector))
					: []
			// Other elements that should be hidden in strict mode (e.g., text, image, use)
			const allCandidates: SVGElement[] =
				autoDraw && nodes.length === 0
					? Array.from(
						svg.querySelectorAll<SVGElement>(
							`${elementSelector}${extraElementSelector ? `, ${extraElementSelector}` : ''}`
						)
					)
					: []
			const autoOthers: SVGElement[] = allCandidates.filter((el) => !autoNodes.includes(el))
			// Group by order for sequencing (default 0)
			const groups = new Map<number, SVGElement[]>()
			nodes.forEach((el) => {
				const orderAttr = el.getAttribute('data-order')
				const order = orderAttr != null ? Number(orderAttr) : 0
				if (!groups.has(order)) groups.set(order, [])
				groups.get(order)!.push(el)
			})
			const ordered = Array.from(groups.entries()).sort((a, b) => a[0] - b[0])

			// Helpers
			const getLen = (el: SVGElement): number => {
				try {
					const geom = el as unknown as SVGGeometryElement
					if (typeof (geom as any).getTotalLength === 'function') {
						return (geom as any).getTotalLength()
					}
				} catch { }
				// Fallback to bbox diagonal
				try {
					const gfx = el as unknown as any
					if (typeof gfx.getBBox === 'function') {
						const bb = gfx.getBBox()
						if (bb) return Math.hypot(bb.width, bb.height)
					}
				} catch { }
				return 0
			}

			const resolveStrokeColor = (el: SVGElement): string => {
				const attrStroke = el.getAttribute('stroke')
				const attrFill = el.getAttribute('fill')
				// If explicit non-currentColor stroke present, use it
				if (attrStroke && attrStroke !== 'none' && attrStroke !== 'currentColor') return attrStroke
				// If stroke is currentColor or absent, prefer fill if available
				if (attrFill && attrFill !== 'none') return attrFill
				// Fallback to computed color (currentColor)
				const cs = window.getComputedStyle(el as Element)
				const c = cs?.color || cs?.stroke || 'currentColor'
				return c
			}

			// Init states (attribute-driven)
			ordered.forEach(([_, els]) => {
				els.forEach((el) => {
					const types = (el.getAttribute('data-anim') || '').split(/\s+/).filter(Boolean)
					const origin = el.getAttribute('data-origin') || '50% 50%'
					const setOrigin = () => gsap.set(el, { transformOrigin: origin })
					if (types.includes('draw')) {
						const len = getLen(el)
							; (el as any).style.strokeDasharray = `${len}`
							; (el as any).style.strokeDashoffset = `${len + 2}`
						gsap.set(el, { strokeOpacity: 1 })
					}
					if (types.includes('fade')) {
						gsap.set(el, { autoAlpha: 0 })
					}
					if (types.includes('scale')) {
						setOrigin()
						gsap.set(el, { scale: 0.001 })
					}
				})
			})

			// Init states (auto-draw fallback)
			if (autoNodes.length > 0) {
				// Strictly hide non-draw elements
				if (strictHide && autoOthers.length > 0) {
					autoOthers.forEach((el) => {
						; (el as any).style.opacity = '0'
					})
				}

				autoNodes.forEach((el) => {
					// Ensure stroke exists; if not, provide fallback values
					const strokeAttr = el.getAttribute('stroke')
					const fillAttr = el.getAttribute('fill')
					const hasStroke = strokeAttr && strokeAttr !== 'none'
					const hasStrokeWidth = el.getAttribute('stroke-width') || el.getAttribute('strokeWidth')
					// Set precise stroke color to match intended final colors
					const resolvedStroke = resolveStrokeColor(el)
					el.setAttribute('stroke', resolvedStroke || fallbackStroke)
					if (!hasStrokeWidth) el.setAttribute('stroke-width', String(fallbackStrokeWidth))

					const len = getLen(el)
						; (el as any).style.strokeDasharray = `${len}`
						; (el as any).style.strokeDashoffset = `${len + Math.max(2, (Number(el.getAttribute('stroke-width')) || fallbackStrokeWidth) * 2)}`
						// Use square ends and miter joins to avoid cap dots, keep crisp corners
						; (el as any).style.strokeLinecap = 'butt'
						// Optional: crisper corners during draw
						; (el as any).style.strokeLinejoin = (el as any).style.strokeLinejoin || 'miter'
						// Hide fills and strokes initially to avoid any pre-visibility
						; (el as any).style.strokeOpacity = '0'
					if (drawFillMode !== 'keep') {
						; (el as any).style.fillOpacity = '0'
					}
				})
			}

			// Build timeline
			const tl = gsap.timeline({
				defaults: { ease, duration: defaultDuration / speed },
				paused: true,
			})
			tlRef.current = tl

			// Attribute-driven steps
			ordered.forEach(([_, els]) => {
				const label = `step-${_}`
				tl.addLabel(label)
				els.forEach((el) => {
					const types = (el.getAttribute('data-anim') || '').split(/\s+/).filter(Boolean)
					const dur = Number(el.getAttribute('data-duration') || '') || defaultDuration / speed
					// If duration not provided and the element is drawable, scale duration by length for consistent speed
					const lenForDur = getLen(el)
					const byLenDur = Math.min(Math.max(lenForDur / pixelsPerSecond, minAutoDuration), maxAutoDuration)
					const resolvedDur = Number(el.getAttribute('data-duration') || '') ? dur : byLenDur
					const delay = Number(el.getAttribute('data-delay') || '') || 0
					const origin = el.getAttribute('data-origin') || '50% 50%'
					const easeEl = el.getAttribute('data-ease') || ease

					// draw
					if (types.includes('draw')) {
						const len = getLen(el)
						tl.to(
							el,
							{ strokeDashoffset: 0, duration: resolvedDur, ease: easeEl, strokeOpacity: 1 },
							`${label}+=${delay}`
						)
					}
					// fade
					if (types.includes('fade')) {
						tl.to(
							el,
							{ autoAlpha: 1, duration: resolvedDur, ease: easeEl },
							`${label}+=${delay}`
						)
					}
					// scale
					if (types.includes('scale')) {
						tl.to(
							el,
							{ scale: 1, transformOrigin: origin, duration: resolvedDur, ease: easeEl },
							`${label}+=${delay}`
						)
					}
				})
			})

			// Auto-draw flow
			if (autoNodes.length > 0) {
				if (drawOrder === 'parallel') {
					autoNodes.forEach((el) => {
						const len = getLen(el)
						const dur = Math.min(Math.max(len / pixelsPerSecond, minAutoDuration), maxAutoDuration)
						tl.to(el, { strokeDashoffset: 0, strokeOpacity: 1, duration: dur }, 0)
					})
					// After parallel draw completes, reveal fills and non-drawn elements
					if (drawFillMode !== 'keep') {
						tl.to(
							autoNodes,
							{ fillOpacity: 1, duration: drawFillMode === 'reveal' ? (defaultDuration / speed) * 0.4 : 0 },
							'>-0.1'
						)
					}
					if (strictHide && autoOthers.length > 0) {
						tl.to(autoOthers, { opacity: 1, duration: (defaultDuration / speed) * 0.3 }, '<')
					}
				} else {
					autoNodes.forEach((el) => {
						const len = getLen(el)
						const dur = Math.min(Math.max(len / pixelsPerSecond, minAutoDuration), maxAutoDuration)
						tl.to(el, { strokeDashoffset: 0, strokeOpacity: 1, duration: dur })
					})
					// After sequence draw completes, reveal fills and non-drawn elements
					if (drawFillMode !== 'keep') {
						tl.to(
							autoNodes,
							{ fillOpacity: 1, duration: drawFillMode === 'reveal' ? (defaultDuration / speed) * 0.4 : 0 },
							'>'
						)
					}
					if (strictHide && autoOthers.length > 0) {
						tl.to(autoOthers, { opacity: 1, duration: (defaultDuration / speed) * 0.3 }, '<')
					}
				}
			}
		}, rootRef)

		return () => ctx.revert()
	}, [ease, defaultDuration, speed, autoDraw, drawOrder, elementSelector, fallbackStroke, fallbackStrokeWidth, drawFillMode])

	const handlers =
		mode === 'hover'
			? {
				onMouseEnter: () => {
					if (!tlRef.current) return
					tlRef.current.timeScale(1)
					tlRef.current.play()
				},
				onMouseLeave: () => {
					if (!tlRef.current) return
					tlRef.current.timeScale(reverseTimeScale)
					tlRef.current.reverse()
				},
			}
			: mode === 'click'
				? {
					onClick: () => {
						if (!tlRef.current) return
						if (!isOpen) {
							tlRef.current.timeScale(1)
							tlRef.current.play()
						} else {
							tlRef.current.timeScale(reverseTimeScale)
							tlRef.current.reverse()
						}
						setIsOpen((v) => !v)
					},
				}
				: {}

	// Auto mode: play when mounted
	useLayoutEffect(() => {
		if (mode === 'auto') tlRef.current?.play()
	}, [mode])

	// External triggers via document elements
	useLayoutEffect(() => {
		if (!externalSelector) return
		const toArray = (v?: string | string[]) => (typeof v === 'string' ? v.split(/\s+/).filter(Boolean) : v) || []
		const toggleEvts = toArray(externalToggleOn)
		const playEvts = toArray(externalPlayOn)
		const reverseEvts = toArray(externalReverseOn)
		if (toggleEvts.length === 0 && playEvts.length === 0 && reverseEvts.length === 0) return

		const els = Array.from(document.querySelectorAll<HTMLElement>(externalSelector))
		const disposers: Array<() => void> = []

		const handleToggle = () => {
			if (!tlRef.current) return
			if (!isOpenRef.current) {
				tlRef.current.timeScale(1)
				tlRef.current.play()
			} else {
				tlRef.current.timeScale(reverseTimeScale)
				tlRef.current.reverse()
			}
			isOpenRef.current = !isOpenRef.current
			setIsOpen(isOpenRef.current)
		}
		const handlePlay = () => {
			if (!tlRef.current) return
			tlRef.current.timeScale(1)
			tlRef.current.play()
			isOpenRef.current = true
			setIsOpen(true)
		}
		const handleReverse = () => {
			if (!tlRef.current) return
			tlRef.current.timeScale(reverseTimeScale)
			tlRef.current.reverse()
			isOpenRef.current = false
			setIsOpen(false)
		}

		els.forEach((el) => {
			toggleEvts.forEach((evt) => {
				el.addEventListener(evt, handleToggle)
				disposers.push(() => el.removeEventListener(evt, handleToggle))
			})
			playEvts.forEach((evt) => {
				el.addEventListener(evt, handlePlay)
				disposers.push(() => el.removeEventListener(evt, handlePlay))
			})
			reverseEvts.forEach((evt) => {
				el.addEventListener(evt, handleReverse)
				disposers.push(() => el.removeEventListener(evt, handleReverse))
			})
		})

		return () => {
			disposers.forEach((fn) => fn())
		}
	}, [externalSelector, externalToggleOn, externalPlayOn, externalReverseOn, reverseTimeScale])

	return (
		<div ref={rootRef} className={classNames(styles.root, className)} {...handlers}>
			<div className={styles.svg}>{children}</div>
		</div>
	)
}

export default SvgAnimator
