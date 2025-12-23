import { themeSliceActions } from '@entities/theme'
import { themeSchema } from '@entities/theme/model/schemas/theme-schema'
import { useAppDispatch } from '@shared/lib'
import { useEffect } from 'react'

import { StorageKeys } from '../../model/consts'

export const useReceiveStorageTheme = () => {
	const dispatch = useAppDispatch()

	return useEffect(() => {
		const theme = localStorage.getItem(StorageKeys.THEME)

		const parsed = themeSchema.safeParse(theme)

		if (parsed.error) {
			dispatch(themeSliceActions.setTheme('DARK'))
			return
		}

		dispatch(themeSliceActions.setTheme(parsed.data))
	}, [dispatch])
}
