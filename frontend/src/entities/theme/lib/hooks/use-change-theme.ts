import { themeSliceActions } from '@entities/theme'
import { useAppDispatch, useAppSelector } from '@shared/lib'

import { getTheme } from '../../model/selectors/theme.selectors'
import type { ThemeEnum } from '../../model/types'

export const useChangeTheme = () => {
	const theme = useAppSelector(getTheme)
	const dispatch = useAppDispatch()

	const setCurrentTheme = (token: ThemeEnum) => {
		dispatch(themeSliceActions.setTheme(token))
	}
	const revertTheme = () => {
		dispatch(themeSliceActions.setTheme(theme === 'LIGHT' ? 'DARK' : 'LIGHT'))
	}

	return {
		setCurrentTheme,
		revertTheme
	}
}
