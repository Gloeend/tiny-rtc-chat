import { getUser } from '@entities/user/@x'
import { useAppDispatch, useAppSelector } from '@shared/lib'
import { useEffect, useRef } from 'react'

import { getSocketIsConnected, getSocketIsLoading } from '../../model/selectors/socket.selectors'
import { socketActions } from '../../model/types'

export const useConnectSocket = () => {
	const user = useAppSelector(getUser)
	const dispatch = useAppDispatch()

	const isConnected = useAppSelector(getSocketIsConnected)
	const isLoading = useAppSelector(getSocketIsLoading)

	const connectionStateRef = useRef({
		isConnected,
		isLoading,
		hasConnected: false
	})

	useEffect(() => {
		connectionStateRef.current = {
			isConnected,
			isLoading,
			hasConnected: connectionStateRef.current.hasConnected
		}
	}, [isConnected, isLoading])

	useEffect(() => {
		if (!user || !user.username) {
			return
		}

		const { hasConnected, isConnected, isLoading } = connectionStateRef.current

		if (!hasConnected && !isConnected && !isLoading) {
			connectionStateRef.current.hasConnected = true
			dispatch(socketActions.connect())
		}

		return () => {
			if (connectionStateRef.current.hasConnected) {
				dispatch(socketActions.disconnect())
				connectionStateRef.current.hasConnected = false
			}
		}
	}, [user, dispatch])
}
