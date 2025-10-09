import { CookieKeys, userSliceActions } from '@entities/user'
import { useAppDispatch } from '@shared/lib'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export const useReceiveUserFromCookies = () => {
	const [isReceived, setIsReceived] = useState(false)
	const dispatch = useAppDispatch()

	useEffect(() => {
		const username = Cookies.get(CookieKeys.USERNAME)

		if (!username || z.string().safeParse(username).error) return

		dispatch(userSliceActions.login(username))
		setIsReceived(true)
	}, [dispatch])

	return { isReceived }
}
