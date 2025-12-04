import { getTheme } from '@entities/theme'
import { useAppSelector } from '@shared/lib'
import { useEffect } from 'react'

export const useObserveTheme = () => {
	const theme = useAppSelector(getTheme).toLowerCase()

	useEffect(() => {
		const html = document.documentElement

		if (html.classList.contains(theme)) return

		const opposite = theme === 'light' ? 'dark' : 'light'
		html.classList.remove(opposite)

		html.classList.add(theme)
	}, [theme])
}
