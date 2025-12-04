import { StorageKeys, userSliceActions } from '@entities/user'
import { useAppDispatch } from '@shared/lib'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export const useReceiveUserFromStorage = () => {
	const [isReceived, setIsReceived] = useState<null | boolean>(null)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const username = localStorage.getItem(StorageKeys.USERNAME)
		const avatar = localStorage.getItem(StorageKeys.AVATAR)

		if (!username || z.string().safeParse(username).error) {
			setIsReceived(true)
			return
		}

		dispatch(userSliceActions.login(username))

		if (avatar && typeof avatar === 'string' && avatar.length > 0) {
			dispatch(userSliceActions.setAvatar(avatar))
		}

		setIsReceived(true)
	}, [dispatch])

	return { isReceived }
}
