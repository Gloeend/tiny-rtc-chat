import { useReceiveStorageTheme } from '@entities/theme'
import { useObserveTheme } from '@entities/theme/lib/hooks/use-observe-theme.ts'
import type { ReactNode } from 'react'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	useReceiveStorageTheme()
	useObserveTheme()
	return children
}
