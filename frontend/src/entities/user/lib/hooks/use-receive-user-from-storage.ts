import { StorageKeys, userSliceActions } from '@entities/user'
import { useAppDispatch } from '@shared/lib'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export const useReceiveUserFromStorage = () => {
	const [isReceived, setIsReceived] = useState<null | boolean>(null)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const userId = localStorage.getItem(StorageKeys.USER_ID)
		const username = localStorage.getItem(StorageKeys.USERNAME)
		const avatar = localStorage.getItem(StorageKeys.AVATAR)

		if (!userId || !username || z.string().safeParse(userId).error || z.string().safeParse(username).error) {
			setIsReceived(true)
			return
		}

		dispatch(
			userSliceActions.login({
				username: username
			})
		)

		if (avatar && avatar.length > 0) {
			dispatch(userSliceActions.setAvatar(avatar))
		}

		setIsReceived(true)
	}, [dispatch])

	return { isReceived }
}
