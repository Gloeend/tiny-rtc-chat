import type { ReactNode } from 'react'

import { useObserveTheme } from '../lib/hooks/use-observe-theme'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	useObserveTheme()
	return children
}
