import type { RootState } from '@shared/config/store-config'

export const getUser = (store: RootState) => store.user
export const getUserUsername = (store: RootState) => store.user.username
