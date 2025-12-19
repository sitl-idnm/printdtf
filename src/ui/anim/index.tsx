'use client'

import { FC, useLayoutEffect, useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'

import styles from './anim.module.scss'

type HeaderAnimProps = {
	className?: string
	size?: number
	color?: string
	initialOpen?: boolean
	open?: boolean
}

const HeaderAnim: FC<HeaderAnimProps> = ({ className, size = 48, color = 'var(--color-black-default)', initialOpen = false, open }) => {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const tlRef = useRef<gsap.core.Timeline | null>(null)
	const arrowGroupRef = useRef<SVGGElement | null>(null)
	const arrowShaftTRRef = useRef<SVGLineElement | null>(null)
	const arrowShaftBLRef = useRef<SVGLineElement | null>(null)
	const arrowHeadARef = useRef<SVGLineElement | null>(null)
	const arrowHeadBRef = useRef<SVGLineElement | null>(null)
	const topBarRef = useRef<SVGRectElement | null>(null)
	const bottomBarRef = useRef<SVGRectElement | null>(null)
	const diag1Ref = useRef<SVGLineElement | null>(null)
	const diag2TRRef = useRef<SVGLineElement | null>(null)
	const diag2BLRef = useRef<SVGLineElement | null>(null)

	// Geometry
	const s = size
	const strokeWidth = Math.max(2, Math.round(s / 24))
	const pad = strokeWidth + 2
	const box = s - pad * 2

	// Coordinates
	const x0 = pad
	const y0 = pad
	const xMax = pad + box
	const yMax = pad + box
	const cx = pad + box / 2
	const cy = pad + box / 2

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			if (!svgRef.current) return

			// Prepare stroke-dash for draw animations
			const prepLine = (el: SVGLineElement | null) => {
				if (!el) return 0
				const x1 = Number(el.getAttribute('x1') || 0)
				const y1 = Number(el.getAttribute('y1') || 0)
				const x2 = Number(el.getAttribute('x2') || 0)
				const y2 = Number(el.getAttribute('y2') || 0)
				const len = Math.hypot(x2 - x1, y2 - y1)
				el.style.strokeDasharray = `${len}`
				// Offset slightly beyond length to avoid visible dot at endpoints
				el.style.strokeDashoffset = `${len + 2}`
				return len
			}

			// Only diagonals and second diag use dash-draw
			prepLine(diag1Ref.current)
			const lenTR = prepLine(diag2TRRef.current)
			const lenBL = prepLine(diag2BLRef.current)

			// Reset initial states (arrow visible initially)
			gsap.set([arrowHeadARef.current, arrowHeadBRef.current], { opacity: 1 })
				// Ensure arrow shafts have no dash so they're fully visible
				;[arrowShaftTRRef.current, arrowShaftBLRef.current].forEach((el) => {
					if (el) {
						el.style.strokeDasharray = ''
						el.style.strokeDashoffset = ''
					}
				})
			gsap.set(arrowGroupRef.current, { scale: 1, transformOrigin: '100% 0%', opacity: 1 })
			gsap.set([diag1Ref.current, diag2TRRef.current, diag2BLRef.current], { strokeOpacity: 0 })
			gsap.set(topBarRef.current, {
				scaleX: 0,
				transformOrigin: '100% 50%',
				opacity: 1
			})
			gsap.set(bottomBarRef.current, {
				scaleX: 0,
				transformOrigin: '0% 50%',
				opacity: 1
			})

			// Timeline
			const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, paused: true })
			tlRef.current = tl

			// 1) Arrow lines shorten by length only (no fade, no scale)
			// Heads (wings) shorten by moving start to the tip (xMax, y0)
			tl.to(arrowHeadARef.current, { duration: 0.32, attr: { x1: xMax, y1: y0 } }, '+=0.02')
			tl.to(arrowHeadBRef.current, { duration: 0.32, attr: { x1: xMax, y1: y0 } }, '<')
			// Base consists of two shafts: center->TR and center->BL, both shorten from center toward corners
			tl.to(arrowShaftTRRef.current, { duration: 0.36, attr: { x1: xMax, y1: y0 } }, '<+0.02')
			tl.to(arrowShaftBLRef.current, { duration: 0.36, attr: { x1: x0, y1: yMax } }, '<')

			// 2) Top and bottom bars grow simultaneously, then collapse simultaneously
			tl.addLabel('barsGrow')
			tl.to(topBarRef.current, { duration: 0.38, scaleX: 1, transformOrigin: '100% 50%' }, 'barsGrow')
			tl.to(bottomBarRef.current, { duration: 0.38, scaleX: 1, transformOrigin: '0% 50%' }, 'barsGrow')
			tl.addLabel('barsCollapse', '+=0.05')
			tl.to(topBarRef.current, { duration: 0.3, scaleX: 0, transformOrigin: '0% 50%' }, 'barsCollapse')
			tl.to(bottomBarRef.current, { duration: 0.3, scaleX: 0, transformOrigin: '100% 50%' }, 'barsCollapse')

			// 3) Draw diagonal TL->BR
			// Start slightly before the bar fully collapses
			tl.to(diag1Ref.current, { duration: 0.45, strokeDashoffset: 0, strokeOpacity: 1 }, '-=0.14')

			// 4) From center, draw other diagonal to TR and BL
			if (lenTR) {
				gsap.set(diag2TRRef.current, { strokeDashoffset: lenTR })
			}
			if (lenBL) {
				gsap.set(diag2BLRef.current, { strokeDashoffset: lenBL })
			}
			tl.to(
				[diag2TRRef.current, diag2BLRef.current],
				{ duration: 0.45, strokeDashoffset: 0, strokeOpacity: 1 },
				'-=0.2'
			)
			// If needs to start opened (cross), jump to end state
			if (initialOpen && tlRef.current) {
				tlRef.current.progress(1)
			}
		}, svgRef)

		return () => ctx.revert()
	}, [initialOpen, x0, xMax, y0, yMax])

	const [isOpen, setIsOpen] = useState(initialOpen)

	// Controlled mode: when `open` is provided, tween timeline to target state and ignore local toggles
	// This prevents race conditions when switching rapidly between FAQ items
	const prevOpenRef = useRef<boolean | undefined>(open)
	useEffect(() => {
		if (open === undefined) return
		if (!tlRef.current) return
		if (prevOpenRef.current === open) return
		prevOpenRef.current = open
		const tl = tlRef.current
		gsap.to(tl, {
			time: open ? tl.duration() : 0,
			duration: 0.35,
			ease: 'power2.inOut',
			overwrite: 'auto'
		})
		setIsOpen(open)
	}, [open])

	return (
		<div
			className={classNames(styles.root, className)}
			aria-hidden
			onClick={() => {
				// In controlled mode (open defined) - ignore internal clicks
				if (open !== undefined) return
				if (!tlRef.current) return
				if (!isOpen) {
					tlRef.current.play()
				} else {
					tlRef.current.reverse()
				}
				setIsOpen((v) => !v)
			}}
		>
			<svg
				ref={svgRef}
				className={styles.svg}
				width={s}
				height={s}
				viewBox={`0 0 ${s} ${s}`}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* Arrow along BL -> TR */}
				<g ref={arrowGroupRef}>
					{/* Base split into two shafts from center */}
					<line
						ref={arrowShaftTRRef}
						x1={cx}
						y1={cy}
						x2={xMax}
						y2={y0}
						stroke={color}
						strokeWidth={strokeWidth}
						strokeLinecap="butt"
					/>
					<line
						ref={arrowShaftBLRef}
						x1={cx}
						y1={cy}
						x2={x0}
						y2={yMax}
						stroke={color}
						strokeWidth={strokeWidth}
						strokeLinecap="butt"
					/>
					<line
						ref={arrowHeadARef}
						x1={xMax - box * 0.48}
						y1={y0}
						x2={xMax}
						y2={y0}
						stroke={color}
						strokeWidth={strokeWidth}
						strokeLinecap="butt"
					/>
					<line
						ref={arrowHeadBRef}
						x1={xMax}
						y1={y0 + box * 0.48}
						x2={xMax}
						y2={y0}
						stroke={color}
						strokeWidth={strokeWidth}
						strokeLinecap="butt"
					/>
				</g>

				{/* Top edge bar that grows from right to left then collapses to left */}
				<rect
					ref={topBarRef}
					x={x0}
					y={y0 - strokeWidth * 0.5}
					width={box}
					height={strokeWidth}
					fill={color}
					rx={strokeWidth / 2}
				/>

				{/* Bottom edge bar that grows from left to right then collapses to right */}
				<rect
					ref={bottomBarRef}
					x={x0}
					y={yMax - strokeWidth * 0.5}
					width={box}
					height={strokeWidth}
					fill={color}
					rx={strokeWidth / 2}
				/>

				{/* Diagonal TL -> BR */}
				<line
					ref={diag1Ref}
					x1={x0}
					y1={y0}
					x2={xMax}
					y2={yMax}
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
				/>

				{/* Second diagonal from center to TR and BL */}
				<line
					ref={diag2TRRef}
					x1={cx}
					y1={cy}
					x2={xMax}
					y2={y0}
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
				/>
				<line
					ref={diag2BLRef}
					x1={cx}
					y1={cy}
					x2={x0}
					y2={yMax}
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
				/>
			</svg>
		</div>
	)
}

export default HeaderAnim
