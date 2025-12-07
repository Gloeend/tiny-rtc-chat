import { StorageKeys, userSliceActions } from '@entities/user'
import { useAppDispatch } from '@shared/lib'
import { useState } from 'react'
import { useStore } from 'react-redux'

export const useReceiveUserFromStorage = () => {
	const store = useStore()
	const dispatch = useAppDispatch()

	const [isReceived] = useState(() => {
		const state = store.getState() as { user: { userId?: string } }
		if (state.user?.userId) {
			return true
		}

		const userId = localStorage.getItem(StorageKeys.USER_ID)
		const username = localStorage.getItem(StorageKeys.USERNAME)
		const avatar = localStorage.getItem(StorageKeys.AVATAR)

		if (!userId || !username) {
			return true
		}

		dispatch(
			userSliceActions.login({
				username: username,
				userId: userId
			})
		)

		if (avatar && avatar.length > 0) {
			dispatch(userSliceActions.setAvatar(avatar))
		}

		return true
	})

	return { isReceived }
}
