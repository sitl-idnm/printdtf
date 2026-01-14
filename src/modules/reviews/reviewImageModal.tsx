'use client'

import { FC, useEffect } from 'react'
import Image from 'next/image'

import styles from './reviewImageModal.module.scss'
import { Portal } from '@/service/portal'
import { lockScroll, unlockScroll } from '@/shared/lib/scrollLock'

interface ReviewImageModalProps {
	open: boolean
	onClose: () => void
	imageSrc?: string
	imageAlt?: string
}

const ReviewImageModal: FC<ReviewImageModalProps> = ({
	open,
	onClose,
	imageSrc,
	imageAlt = 'Фотография отзыва'
}) => {
	useEffect(() => {
		if (!open) return
		lockScroll()
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', onKey)
		return () => {
			unlockScroll()
			window.removeEventListener('keydown', onKey)
		}
	}, [onClose, open])

	if (!open) return null

	return (
		<Portal selector="#modal-root">
			<div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
				<button
					type="button"
					className={styles.close}
					onClick={onClose}
					aria-label="Закрыть"
				>
					<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
				<div className={styles.content} onClick={(e) => e.stopPropagation()}>
					<div className={styles.imageWrapper}>
						<Image
							src={imageSrc || '/images/test.jpg'}
							alt={imageAlt}
							width={1200}
							height={1600}
							style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
							priority
						/>
					</div>
				</div>
			</div>
		</Portal>
	)
}

export default ReviewImageModal
