'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function PageThemeProvider({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()

	useEffect(() => {
		const body = document.body

		// Удаляем все предыдущие data-атрибуты темы
		body.removeAttribute('data-page-theme')

		// Устанавливаем data-атрибут в зависимости от страницы
		if (pathname === '/fullfilment') {
			body.setAttribute('data-page-theme', 'fulfillment')
		} else if (pathname === '/logistika') {
			body.setAttribute('data-page-theme', 'logistika')
		}
		// Для остальных страниц (включая /print) атрибут не устанавливается
	}, [pathname])

	return <>{children}</>
}
